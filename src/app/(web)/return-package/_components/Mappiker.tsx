/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"
import "leaflet/dist/leaflet.css"
import "leaflet-geosearch/dist/geosearch.css"
import L from "leaflet"

// 🔧 Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// 📌 Types
interface LocationData {
  address: string
  lat: number
  lng: number
}

// 🔍 Search Control (ONLY ONE)
function SearchControl({
  onLocationFound,
}: {
  onLocationFound: (data: LocationData) => void
}) {
  const map = useMap()

  useEffect(() => {
    const provider = new OpenStreetMapProvider()

    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      autoComplete: true,
      autoClose: true,
      keepResult: true,
      showMarker: false, // আমরা নিজে marker দেখাব
      showPopup: false,
      searchLabel: "Search address...",
      notFoundMessage: "Address not found",
    })

    map.addControl(searchControl)

    const handler = (result: any) => {
      const fullLabel = result.location.label
      const shortAddress = fullLabel
        .split(",")
        .slice(0, 3)
        .join(",")
        .trim()

      onLocationFound({
        address: shortAddress || fullLabel,
        lat: result.location.y,
        lng: result.location.x,
      })
    }

    map.on("geosearch/showlocation" as any, handler)

    return () => {
      map.off("geosearch/showlocation" as any, handler)
      map.removeControl(searchControl)
    }
  }, [map, onLocationFound])

  return null
}

// 🖱️ Click on map to select location
function MapClickHandler({
  onLocationSelected,
}: {
  onLocationSelected: (data: LocationData) => void
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
        .then((res) => res.json())
        .then((data) => {
          const addr = data.address || {}
          const house = addr.house_number ? `${addr.house_number} ` : ""
          const road = addr.road || addr.street || "Unnamed Road"
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.hamlet ||
            addr.state ||
            ""

          const address = `${house}${road}, ${city}`.trim()

          onLocationSelected({
            address: address || "Selected Location",
            lat,
            lng,
          })
        })
        .catch(() => {
          onLocationSelected({
            address: "Selected Location",
            lat,
            lng,
          })
        })
    },
  })

  return null
}

// 🗺️ Main Map Picker
export default function MapPicker({
  onSelect,
  onClose,
}: {
  onSelect: (data: LocationData) => void
  onClose: () => void
}) {
  const [center, setCenter] = useState<[number, number]>([
    23.8103, 90.4125, // Dhaka default
  ])
  const [selectedLocation, setSelectedLocation] =
    useState<LocationData | null>(null)

  const handleLocationSelect = (data: LocationData) => {
    setCenter([data.lat, data.lng])
    setSelectedLocation(data)
  }

  const confirm = () => {
    if (selectedLocation) {
      onSelect(selectedLocation)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Select Pickup Location</h3>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SearchControl onLocationFound={handleLocationSelect} />
            <MapClickHandler onLocationSelected={handleLocationSelect} />

            {selectedLocation && (
              <Marker
                position={[
                  selectedLocation.lat,
                  selectedLocation.lng,
                ]}
              />
            )}
          </MapContainer>
        </div>

        {/* Footer */}
        {selectedLocation && (
          <div className="p-5 border-t bg-gray-50">
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-medium">Selected:</span>{" "}
              {selectedLocation.address}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                className="px-7 py-2.5 bg-[#31B8FA] text-white rounded-lg hover:bg-[#31B8FA]/90"
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

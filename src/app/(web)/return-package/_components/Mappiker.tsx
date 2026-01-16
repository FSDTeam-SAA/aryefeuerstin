"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface DataProps {
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerModalProps {
  onSelect: (val: DataProps) => void;
  onClose?: () => void;
  initialLocation?: DataProps | null;
}

const libraries: ("places")[] = ["places"];

// Default location - USA (New York)
const DEFAULT_LOCATION = {
  lat: 40.7128,
  lng: -74.006,
};

export default function LocationPickerModal({
  onSelect,
  initialLocation,
}: LocationPickerModalProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [position, setPosition] = useState(DEFAULT_LOCATION);
  const [tempLocation, setTempLocation] = useState<DataProps | null>(null);

  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  /* ---------- Initial location ---------- */
  useEffect(() => {
    if (initialLocation) {
      setPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
      setTempLocation(initialLocation);
    } else {
      setPosition(DEFAULT_LOCATION);
    }
  }, [initialLocation]);

  /* ---------- Search place ---------- */
  const handlePlacesChanged = () => {
    if (!searchBox) return;

    const places = searchBox.getPlaces();
    if (!places || !places[0]?.geometry?.location) return;

    const lat = places[0].geometry.location.lat();
    const lng = places[0].geometry.location.lng();

    const locationData = {
      address:
        places[0].formatted_address ||
        places[0].name ||
        "Selected Location",
      lat,
      lng,
    };

    setPosition({ lat, lng });
    setTempLocation(locationData);
    onSelect(locationData);
  };

  /* ---------- Map click ---------- */
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setPosition({ lat, lng });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let address = "Selected Location";

      if (status === "OK" && results?.[0]) {
        address = results[0].formatted_address.replace(
          /^[A-Z0-9+]+,\s*/,
          ""
        );
      }

      const locationData = { address, lat, lng };
      setTempLocation(locationData);
      onSelect(locationData);
    });
  };

  /* ---------- Loader ---------- */
  if (!isLoaded) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-[500px] w-full rounded-md border overflow-hidden relative">
        <GoogleMap
          center={position}
          zoom={13}
          mapContainerStyle={{ height: "100%", width: "100%" }}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
          }}
        >
          {/* Search box only */}
          <div className="absolute top-3 left-3 z-10 w-[calc(100%-1rem)] sm:w-auto">
            <StandaloneSearchBox
              onLoad={(ref) => setSearchBox(ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for address..."
                className="w-full sm:w-72 h-10 px-3 rounded border border-gray-300 shadow-md bg-white"
              />
            </StandaloneSearchBox>
          </div>

          <Marker position={position} />
        </GoogleMap>
      </div>

      {tempLocation && (
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-sm text-gray-600">Selected Location:</p>
          <p className="font-medium text-gray-900">
            {tempLocation.address}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {tempLocation.lat.toFixed(4)},{" "}
            {tempLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}

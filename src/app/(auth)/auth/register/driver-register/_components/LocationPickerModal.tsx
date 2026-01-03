/*eslint-disable */
"use client";

import { useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

interface dataProps {
  address: string;
  lat: number;
  lng: number;
}

const libraries: "places"[] = ["places"];

export default function LocationPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (val: dataProps) => void;
  onClose?: () => void;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 23.8103,
    lng: 90.4125,
  });

  const [tempLocation, setTempLocation] = useState<dataProps | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Handle search box place selection
  const handlePlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setPosition({ lat, lng });

          // Extract short name (similar to OpenStreetMap logic)
          const shortName =
            place.name ||
            place.formatted_address?.split(",")[0] ||
            "Selected Location";

          // Store temporarily and update parent immediately
          const locationData = { address: shortName, lat, lng };
          setTempLocation(locationData);
          onSelect(locationData);
        }
      }
    }
  };

  // Handle map click to select location
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setPosition({ lat, lng });

      // Reverse geocoding (similar to OpenStreetMap's Nominatim)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const addressComponents = results[0].address_components;
          let shortName = "Selected Location";

          // Priority: Specific place > Road > Suburb > City > State
          const priorityTypes = [
            "premise", // Building name
            "point_of_interest", // Amenity
            "route", // Road
            "sublocality_level_1", // Suburb
            "sublocality",
            "locality", // City
            "administrative_area_level_2", // Town
            "administrative_area_level_1", // State
          ];

          for (const type of priorityTypes) {
            const component = addressComponents.find((comp) =>
              comp.types.includes(type)
            );
            if (component) {
              shortName = component.long_name;
              break;
            }
          }

          // Store temporarily and update parent immediately
          const locationData = { address: shortName, lat, lng };
          setTempLocation(locationData);
          onSelect(locationData);
        } else {
          const locationData = { address: "Selected Location", lat, lng };
          setTempLocation(locationData);
          onSelect(locationData);
        }
      });
    }
  };

  // Get current location
  const handleGetMyLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition({ lat, lng });

          // Reverse geocoding
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            setIsGettingLocation(false);
            if (status === "OK" && results && results[0]) {
              const addressComponents = results[0].address_components;
              let shortName = "My Location";

              const priorityTypes = [
                "premise",
                "point_of_interest",
                "route",
                "sublocality_level_1",
                "sublocality",
                "locality",
                "administrative_area_level_2",
                "administrative_area_level_1",
              ];

              for (const type of priorityTypes) {
                const component = addressComponents.find((comp) =>
                  comp.types.includes(type)
                );
                if (component) {
                  shortName = component.long_name;
                  break;
                }
              }

              const locationData = { address: shortName, lat, lng };
              setTempLocation(locationData);
              onSelect(locationData);
            } else {
              const locationData = { address: "My Location", lat, lng };
              setTempLocation(locationData);
              onSelect(locationData);
            }
          });
        },
        (error) => {
          setIsGettingLocation(false);
          alert(
            "Unable to get your location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <Loader2 className="animate-spin text-gray-400" />
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
          {/* Search Box and My Location Button */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 flex flex-col sm:flex-row gap-2 w-full max-w-md px-3">
            <StandaloneSearchBox
              onLoad={(ref) => setSearchBox(ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for address..."
                className="w-full h-10 px-3 rounded border border-gray-300 shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              />
            </StandaloneSearchBox>

            {/* My Location Button */}
            <button
              type="button"
              onClick={handleGetMyLocation}
              disabled={isGettingLocation}
              className="w-full h-10 px-3 rounded bg-white border border-gray-300 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {isGettingLocation ? (
                <Loader2 className="animate-spin text-blue-500" size={18} />
              ) : (
                <MapPin className="text-blue-500" size={18} />
              )}
              <span className="text-sm font-medium text-gray-700">
                My Location
              </span>
            </button>
          </div>

          {/* Marker */}
          <Marker position={position} />
        </GoogleMap>
      </div>

      {/* Selected Location Preview */}
      {tempLocation && tempLocation.address && (
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-sm text-gray-600">Selected Location:</p>
          <p className="font-medium text-gray-900">{tempLocation.address}</p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {tempLocation.lat.toFixed(4)},{" "}
            {tempLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}

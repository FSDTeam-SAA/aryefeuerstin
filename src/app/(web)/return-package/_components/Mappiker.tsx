"use client";

import { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

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

export default function LocationPickerModal({
  onSelect,
  initialLocation,
}: LocationPickerModalProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: initialLocation?.lat ?? 23.8103,
    lng: initialLocation?.lng ?? 90.4125,
  });

  const [tempLocation, setTempLocation] = useState<DataProps | null>(
    initialLocation || null
  );

  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
      setTempLocation(initialLocation);
    }
  }, [initialLocation]);

  const handlePlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const newPos = { lat, lng };
          setPosition(newPos);

          const shortName =
            place.name ||
            place.formatted_address?.split(",")[0] ||
            "Selected Location";

          const locationData = { address: shortName, lat, lng };
          setTempLocation(locationData);
          onSelect(locationData);
        }
      }
    }
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newPos = { lat, lng };
      setPosition(newPos);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPos }, (results, status) => {
        let shortName = "Selected Location";

        if (status === "OK" && results && results[0]) {
          const addressComponents = results[0].address_components;
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
        }

        const locationData = { address: shortName, lat, lng };
        setTempLocation(locationData);
        onSelect(locationData);
      });
    }
  };

  const handleGetMyLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const newPos = { lat, lng };
          setPosition(newPos);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: newPos }, (results, status) => {
            setIsGettingLocation(false);
            let shortName = "My Location";

            if (status === "OK" && results && results[0]) {
              const addressComponents = results[0].address_components;
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
            }

            const locationData = { address: shortName, lat, lng };
            setTempLocation(locationData);
            onSelect(locationData);
          });
        },
        (error) => {
          setIsGettingLocation(false);
          alert("Unable to retrieve your location. " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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
          {/* Responsive Search Box + My Location Button */}
          <div className="absolute top-3 left-3 z-10 flex flex-col sm:flex-row gap-2 w-[calc(100%-1rem)] sm:w-auto">
            <StandaloneSearchBox
              onLoad={(ref) => setSearchBox(ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for address..."
                className="w-full sm:w-72 h-10 px-3 rounded border border-gray-300 shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
              />
            </StandaloneSearchBox>

            <button
              type="button"
              onClick={handleGetMyLocation}
              disabled={isGettingLocation}
              className="w-full sm:w-auto h-10 px-4 rounded bg-white border border-gray-300 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
            >
              {isGettingLocation ? (
                <Loader2 className="animate-spin text-blue-500" size={18} />
              ) : (
                <MapPin className="text-blue-500" size={18} />
              )}
              <span className="text-sm font-medium text-gray-700">My Location</span>
            </button>
          </div>

          <Marker position={position} />
        </GoogleMap>
      </div>

      {tempLocation && (
        <div className="bg-gray-50 p-3 rounded-lg border">
          <p className="text-sm text-gray-600">Selected Location:</p>
          <p className="font-medium text-gray-900">{tempLocation.address}</p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {tempLocation.lat.toFixed(4)}, {tempLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}

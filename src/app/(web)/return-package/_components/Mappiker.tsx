"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

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
  lng: -74.0060,
};

export default function LocationPickerModal({
  onSelect,
  initialLocation,
}: LocationPickerModalProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Map center position
  const [position, setPosition] = useState<{ lat: number; lng: number }>(
    DEFAULT_LOCATION
  );

  // Selected location details
  const [tempLocation, setTempLocation] = useState<DataProps | null>(null);

  // Google search box reference
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  // Loading state for "My Location" button
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  /* =====================================================
     On map load:
     - If initialLocation exists → show it
     - Else show default US location
     ===================================================== */
  useEffect(() => {
    if (initialLocation) {
      setPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
      setTempLocation(initialLocation);
    } else {
      setPosition(DEFAULT_LOCATION);
    }
  }, [initialLocation]);

  /* ---------- Handle place search ---------- */
  const handlePlacesChanged = () => {
    if (!searchBox) return;

    const places = searchBox.getPlaces();
    if (!places || !places[0]?.geometry?.location) return;

    const lat = places[0].geometry.location.lat();
    const lng = places[0].geometry.location.lng();

    setPosition({ lat, lng });

    const locationData = {
      address: places[0].formatted_address || places[0].name || "Selected Location",
      lat,
      lng,
    };

    setTempLocation(locationData);
    onSelect(locationData);
  };

  /* ---------- Handle map click ---------- */
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setPosition({ lat, lng });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let address = "Selected Location";

      if (status === "OK" && results?.[0]) {
        // Remove plus code if present at the start
        address = results[0].formatted_address.replace(/^[A-Z0-9+]+,\s*/, "");
      }

      const locationData = { address, lat, lng };
      setTempLocation(locationData);
      onSelect(locationData);
    });
  };

  /* ---------- Handle "My Location" button ---------- */
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);

    // Function to process location
    const processLocation = (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setPosition({ lat, lng });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setIsGettingLocation(false);

        let address = "My Location";
        if (status === "OK" && results?.[0]) {
          // Remove plus code if present at the start
          address = results[0].formatted_address.replace(/^[A-Z0-9+]+,\s*/, "");
        } else {
          // If geocoding fails, still use the location with coordinates as address
          address = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }

        const locationData = { address, lat, lng };
        setTempLocation(locationData);
        onSelect(locationData);
        
        toast.success("Location selected successfully!");
      });
    };

    // Try to get location with multiple fallback attempts
    const attemptGeolocation = (attemptNumber: number = 1) => {
      const configs = [
        // Attempt 1: Network-based, moderate timeout
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 },
        // Attempt 2: Network-based, longer timeout, accept older cache
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
        // Attempt 3: Low accuracy, very long timeout, accept very old cache
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 },
      ];

      const config = configs[attemptNumber - 1] || configs[configs.length - 1];

      navigator.geolocation.getCurrentPosition(
        processLocation,
        (error) => {
          // If permission denied, show error immediately
          if (error.code === error.PERMISSION_DENIED) {
            setIsGettingLocation(false);
            toast.error("Location access denied. Please enable location permission in your browser settings.");
            return;
          }

          // If not the last attempt, try again with next config
          if (attemptNumber < configs.length) {
            console.log(`Attempt ${attemptNumber} failed, trying again...`);
            attemptGeolocation(attemptNumber + 1);
          } else {
            // All attempts failed
            setIsGettingLocation(false);
            toast.error("Unable to get your location after multiple attempts. Please check your device's location settings.");
          }
        },
        config
      );
    };

    // Start first attempt
    attemptGeolocation(1);
  };

  // Show loader while Google Maps is loading
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
          {/* Search box and My Location button */}
          <div className="absolute top-3 left-3 z-10 flex flex-col sm:flex-row gap-2 w-[calc(100%-1rem)] sm:w-auto">
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

            <button
              type="button"
              onClick={handleGetMyLocation}
              disabled={isGettingLocation}
              className="w-full sm:w-auto h-10 px-4 rounded bg-white border border-gray-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
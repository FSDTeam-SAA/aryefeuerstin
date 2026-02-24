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
  addressComponents?: Record<string, string>;
}

interface LocationPickerModalProps {
  onSelect: (val: DataProps) => void;
  onClose?: () => void;
  initialLocation?: DataProps | null;
}

const libraries: "places"[] = ["places"];

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

  useEffect(() => {
    if (initialLocation) {
      setPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
      setTempLocation(initialLocation);
    } else {
      setPosition(DEFAULT_LOCATION);
    }
  }, [initialLocation]);

  const extractComponents = (
    components: google.maps.GeocoderAddressComponent[] | undefined,
  ) => {
    if (!components || !Array.isArray(components)) return {};
    const result: Record<string, string> = {};
    components.forEach((comp) => {
      if (comp.types?.length) {
        const type = comp.types[0];
        result[type] = comp.long_name;
      }
    });
    return result;
  };

  const handleSelect = (
    lat: number,
    lng: number,
    address: string = "Selected Location",
    components: Record<string, string> = {},
  ) => {
    const data: DataProps = {
      address,
      lat,
      lng,
      addressComponents:
        Object.keys(components).length > 0 ? components : undefined,
    };
    setPosition({ lat, lng });
    setTempLocation(data);
    onSelect(data);
  };

  const handlePlacesChanged = () => {
    if (!searchBox) return;

    const places = searchBox.getPlaces();
    if (!places?.length || !places[0]?.geometry?.location) {
      console.warn("No valid place selected");
      return;
    }

    const place = places[0];
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address =
      place.formatted_address || place.name || "Selected Location";
    const components = place.address_components
      ? extractComponents(place.address_components)
      : {};

    handleSelect(lat, lng, address, components);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let address = "Selected Location";
      let components: Record<string, string> = {};

      if (status === "OK" && results?.length && results[0]) {
        address = results[0].formatted_address || address;
        components = extractComponents(results[0].address_components);
      } else {
        console.warn("Geocoding failed:", status);
      }

      handleSelect(lat, lng, address, components);
    });
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

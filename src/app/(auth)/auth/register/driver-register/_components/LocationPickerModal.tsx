// /* eslint-disable */
// "use client";

// import { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   Marker,
//   useLoadScript,
//   StandaloneSearchBox,
// } from "@react-google-maps/api";
// import { Loader2, MapPin } from "lucide-react";

// interface DataProps {
//   address: string;
//   lat: number;
//   lng: number;
// }

// const libraries: "places"[] = ["places"];

// export default function LocationPickerModal({
//   onSelect,
//   onClose,
// }: {
//   onSelect: (val: DataProps) => void;
//   onClose?: () => void;
// }) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//     libraries,
//   });

//   // 🔹 Position initially null
//   const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
//     null
//   );

//   const [tempLocation, setTempLocation] = useState<DataProps | null>(null);
//   const [searchBox, setSearchBox] =
//     useState<google.maps.places.SearchBox | null>(null);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   // ✅ Get phone/device location on page load
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setPosition({ lat: 23.8103, lng: 90.4125 });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setPosition({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       () => {
//         // Permission denied → fallback
//         setPosition({ lat: 23.8103, lng: 90.4125 });
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//       }
//     );
//   }, []);

//   // 🔍 Search box selection
//   const handlePlacesChanged = () => {
//     if (!searchBox) return;

//     const places = searchBox.getPlaces();
//     if (!places || places.length === 0) return;

//     const place = places[0];
//     if (!place.geometry?.location) return;

//     const lat = place.geometry.location.lat();
//     const lng = place.geometry.location.lng();

//     setPosition({ lat, lng });

//     const shortName =
//       place.name ||
//       place.formatted_address?.split(",")[0] ||
//       "Selected Location";

//     const locationData = { address: shortName, lat, lng };
//     setTempLocation(locationData);
//     onSelect(locationData);
//   };

//   // 🖱 Map click selection
//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (!event.latLng) return;

//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     setPosition({ lat, lng });

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       let shortName = "Selected Location";

//       if (status === "OK" && results && results[0]) {
//         const priorityTypes = [
//           "premise",
//           "point_of_interest",
//           "route",
//           "sublocality_level_1",
//           "sublocality",
//           "locality",
//           "administrative_area_level_2",
//           "administrative_area_level_1",
//         ];

//         for (const type of priorityTypes) {
//           const comp = results[0].address_components.find((c) =>
//             c.types.includes(type)
//           );
//           if (comp) {
//             shortName = comp.long_name;
//             break;
//           }
//         }
//       }

//       const locationData = { address: shortName, lat, lng };
//       setTempLocation(locationData);
//       onSelect(locationData);
//     });
//   };

//   // 📍 My Location button
//   const handleGetMyLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }

//     setIsGettingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;
//         setPosition({ lat, lng });

//         const geocoder = new google.maps.Geocoder();
//         geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//           setIsGettingLocation(false);

//           let shortName = "My Location";

//           if (status === "OK" && results && results[0]) {
//             const priorityTypes = [
//               "premise",
//               "point_of_interest",
//               "route",
//               "sublocality_level_1",
//               "sublocality",
//               "locality",
//               "administrative_area_level_2",
//               "administrative_area_level_1",
//             ];

//             for (const type of priorityTypes) {
//               const comp = results[0].address_components.find((c) =>
//                 c.types.includes(type)
//               );
//               if (comp) {
//                 shortName = comp.long_name;
//                 break;
//               }
//             }
//           }

//           const locationData = { address: shortName, lat, lng };
//           setTempLocation(locationData);
//           onSelect(locationData);
//         });
//       },
//       () => {
//         setIsGettingLocation(false);
//         alert("Unable to get your location.");
//       }
//     );
//   };

//   // ⏳ Loading state
//   if (!isLoaded || !position) {
//     return (
//       <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
//         <Loader2 className="animate-spin text-gray-400" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <div className="lg:h-[500px] h-[350px] w-full rounded-md border overflow-hidden relative">
//         <GoogleMap
//           center={position}
//           zoom={14}
//           mapContainerStyle={{ height: "100%", width: "100%" }}
//           onClick={handleMapClick}
//           options={{
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//         >
//           {/* Search + My Location */}
//           <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10   flex flex-col  md:flex-row gap-2 w-full max-w-md px-3">
//             <StandaloneSearchBox
//               onLoad={(ref) => setSearchBox(ref)}
//               onPlacesChanged={handlePlacesChanged}
//             >
//               <input
//                 type="text"
//                 placeholder="Search location..."
//                 className="w-full h-10 px-3 rounded border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </StandaloneSearchBox>

//             {/* <button
//               onClick={handleGetMyLocation}
//               disabled={isGettingLocation}
//               className="h-10 px-3 rounded bg-white border shadow-md flex items-center gap-2 disabled:opacity-50"
//             >
//               {isGettingLocation ? (
//                 <Loader2 className="animate-spin" size={18} />
//               ) : (
//                 <MapPin size={18} />
//               )}
//               <span className="text-sm">My Location</span>
//             </button> */}
//           </div>

//           <Marker position={position} />
//         </GoogleMap>
//       </div>

//       {tempLocation && (
//         <div className="bg-gray-50 p-3 rounded-lg border">
//           <p className="text-sm text-gray-600">Selected Location</p>
//           <p className="font-medium">{tempLocation.address}</p>
//           <p className="text-xs text-gray-500">
//             {tempLocation.lat.toFixed(4)}, {tempLocation.lng.toFixed(4)}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }




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

const libraries: ("places")[] = ["places"];

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
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    if (initialLocation) {
      setPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
      setTempLocation(initialLocation);
    } else {
      setPosition(DEFAULT_LOCATION);
    }
  }, [initialLocation]);

  // Helper to extract address components safely
  const extractComponents = (components: google.maps.GeocoderAddressComponent[] | undefined) => {
    if (!components || !Array.isArray(components)) return {};

    const result: Record<string, string> = {};

    components.forEach((comp) => {
      if (comp.types?.length) {
        const type = comp.types[0]; // primary type
        result[type] = comp.long_name;
      }
    });

    return result;
  };

  const handleSelect = (
    lat: number,
    lng: number,
    address: string = "Selected Location",
    components: Record<string, string> = {}
  ) => {
    const data: DataProps = {
      address,
      lat,
      lng,
      addressComponents: Object.keys(components).length > 0 ? components : undefined,
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
    const address = place.formatted_address || place.name || "Selected Location";

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
        const firstResult = results[0];
        address = firstResult.formatted_address || address;
        components = extractComponents(firstResult.address_components);
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
            Coordinates: {tempLocation.lat.toFixed(4)}, {tempLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}
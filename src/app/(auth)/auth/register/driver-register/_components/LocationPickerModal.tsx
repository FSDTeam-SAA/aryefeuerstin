/*eslint-disable */
"use client"
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import L from 'leaflet'

interface dataProps {
  address: string;
  lat: number;
  lng: number;
}

interface resultProps {
  location: {
    x: number;
    y: number;
    label: string;
  }
}

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function SearchControl({ onLocationFound }: { onLocationFound: (data: dataProps) => void }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: 'bar',
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Search for address...',
      keepResult: true
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result: any) => {
      // Logic to extract just the first part of the searched label
      const shortName = result.location.label.split(',')[0];
      onLocationFound({
        address: shortName,
        lat: result.location.y,
        lng: result.location.x
      });
    });

    return () => { map.removeControl(searchControl); };
  }, [map, onLocationFound]);

  return null;
}

export default function MapPicker({ onSelect }: { onSelect: (val: any) => void }) {
  const [position, setPosition] = useState<[number, number]>([23.8103, 90.4125]);

  const fetchAddressName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      
      // Extract specific parts for a shorter name
      const addr = data.address;
      // Priority: Specific place > Suburb > City > State
      const shortName = addr.amenity || addr.building || addr.road || addr.suburb || addr.city || addr.town || addr.village || "Selected Location";

      onSelect({ address: shortName, lat, lng });
    } catch (error) {
      onSelect({ address: "Selected Location", lat, lng });
    }
  };

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetchAddressName(lat, lng);
      },
    });
    return <Marker position={position} icon={icon} />;
  }

  const handleSearchResult = (data: any) => {
    setPosition([data.lat, data.lng]);
    onSelect(data);
  };

  return (
    <div className="h-[400px] w-full rounded-md border overflow-hidden relative">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchControl onLocationFound={handleSearchResult} />
        <ClickHandler />
      </MapContainer>
    </div>
  )
}









// "use client";

// import { useState } from "react";
// import { GoogleMap, Marker, useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";

// interface LocationData {
//   address: string;
//   lat: number;
//   lng: number;
// }

// interface Props {
//   onSelect: (data: LocationData) => void;
// }

// const libraries: ("places")[] = ["places"];

// export default function LocationPickerModal({ onSelect }: Props) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//     libraries,
//   });

//   const [marker, setMarker] = useState<{ lat: number; lng: number } | null>({
//     lat: 23.8103,
//     lng: 90.4125,
//   });

//   const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

//   const handlePlacesChanged = () => {
//     if (searchBox) {
//       const places = searchBox.getPlaces();
//       if (places && places.length > 0) {
//         const place = places[0];
//         if (place.geometry?.location) {
//           const lat = place.geometry.location.lat();
//           const lng = place.geometry.location.lng();
//           setMarker({ lat, lng });
//           onSelect({ address: place.formatted_address || "", lat, lng });
//         }
//       }
//     }
//   };

//   const handleMapClick = async (event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();
//       setMarker({ lat, lng });

//       // Reverse geocoding
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//         if (status === "OK" && results && results[0]) {
//           onSelect({ address: results[0].formatted_address, lat, lng });
//         } else {
//           onSelect({ address: "Selected Location", lat, lng });
//         }
//       });
//     }
//   };

//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div className="h-[400px] w-full rounded-md border overflow-hidden relative">
//       <GoogleMap
//         center={marker || { lat: 23.8103, lng: 90.4125 }}
//         zoom={13}
//         mapContainerStyle={{ height: "100%", width: "100%" }}
//         onClick={handleMapClick}
//       >
//         <StandaloneSearchBox
//           onLoad={(ref) => setSearchBox(ref)}
//           onPlacesChanged={handlePlacesChanged}
//         >
//           <input
//             type="text"
//             placeholder="Search for address..."
//             className="absolute top-3 left-3 z-10 w-72 h-10 px-3 rounded border border-gray-300 shadow"
//           />
//         </StandaloneSearchBox>

//         {marker && <Marker position={marker} />}
//       </GoogleMap>
//     </div>
//   );
// }

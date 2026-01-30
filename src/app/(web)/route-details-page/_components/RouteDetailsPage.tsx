"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import {
  MapPin,
  Navigation,
  Clock,
  Package,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeeDetailsModal } from "@/components/shared/SeeDetailsModal";

interface PickupPoint {
  customer: string;
  address: string;
  lat: number;
  lng: number;
  orderIndex: number;
  id: string;
}

interface Leg {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  start_address: string;
  end_address: string;
}

interface RouteData {
  origin: string;
  pickups: PickupPoint[];
  polyline: string;
  totalDistance: number;
  totalDuration: number;
  optimizedOrder: number[];
  id: string;
  legs?: Leg[];
}

// Format distance
function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

// Format duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const libraries: "places"[] = ["places"];

export default function RouteDetailsPage() {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Get route data from localStorage
  useEffect(() => {
    const fetchRouteData = () => {
      try {
        const storedData = localStorage.getItem("currentRouteData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setRouteData(parsedData);
          setIsLoadingRoute(false);
          return;
        }

        setError("No route data found");
        setIsLoadingRoute(false);
      } catch (err) {
        console.error("Error loading route data:", err);
        setError("Failed to load route data");
        setIsLoadingRoute(false);
      }
    };

    fetchRouteData();
  }, []);

  // Track current location when navigating
  useEffect(() => {
    if (!isNavigating) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error tracking location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isNavigating]);

  // Parse origin coordinates
  const getOriginCoords = () => {
    if (!routeData) return null;
    const [lat, lng] = routeData.origin.split(",").map(Number);
    return { lat, lng };
  };

  // Get map center - use current location if navigating
  const getMapCenter = () => {
    if (isNavigating && currentLocation) return currentLocation;
    const origin = getOriginCoords();
    if (origin) return origin;
    if (routeData?.pickups?.[0]) {
      return { lat: routeData.pickups[0].lat, lng: routeData.pickups[0].lng };
    }
    return { lat: 23.8103, lng: 90.4125 };
  };

  // Get ordered pickups based on optimizedOrder
  const getOrderedPickups = () => {
    if (!routeData) return [];
    const ordered = routeData.optimizedOrder
      .map((index) => routeData.pickups.find((p) => p.orderIndex === index))
      .filter(Boolean) as PickupPoint[];
    return ordered;
  };

  if (isLoadingRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#31B8FA] mx-auto mb-4" />
          <p className="text-gray-600">Loading route details...</p>
        </div>
      </div>
    );
  }

  if (error || !routeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || "Route data not found"}
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-[#31B8FA] hover:bg-[#31B8FA]/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#31B8FA]" />
      </div>
    );
  }

  //   const decodedPath = decodePolyline(routeData.polyline)
  const orderedPickups = getOrderedPickups();
  console.log("orderPic", orderedPickups);
  const origin = getOriginCoords();

  // Create individual route segments
  const getRouteSegments = () => {
    if (!origin || orderedPickups.length === 0) return [];

    const segments = [];
    const allPoints = [
      origin,
      ...orderedPickups.map((p) => ({ lat: p.lat, lng: p.lng })),
    ];

    for (let i = 0; i < allPoints.length - 1; i++) {
      segments.push({
        from: allPoints[i],
        to: allPoints[i + 1],
        color: i === 0 ? "#10B981" : "#8B5CF6", // Green for first, Purple for rest
      });
    }

    return segments;
  };

  const routeSegments = getRouteSegments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Your Delivery Route
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {orderedPickups.length} stops •{" "}
                {formatDistance(routeData.totalDistance)} •{" "}
                {formatDuration(routeData.totalDuration)}
              </p>
            </div>
            <Button onClick={() => window.history.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden shadow-lg">
              <div className="h-[600px] relative">
                <GoogleMap
                  center={getMapCenter()}
                  zoom={isNavigating ? 16 : 12}
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                  }}
                >
                  {/* Current Location Marker (when navigating) */}
                  {isNavigating && currentLocation && (
                    <Marker
                      position={currentLocation}
                      icon={{
                        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%234285F4' stroke='white' stroke-width='3'/%3E%3Ccircle cx='12' cy='12' r='3' fill='white'/%3E%3C/svg%3E",
                        scaledSize: new google.maps.Size(50, 50),
                        anchor: new google.maps.Point(25, 25),
                      }}
                      title="You are here"
                      zIndex={1100}
                    />
                  )}

                  {/* Origin Marker (only show if not navigating) */}
                  {!isNavigating && origin && (
                    <Marker
                      position={origin}
                      icon={{
                        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%2331B8FA'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
                        scaledSize: new google.maps.Size(45, 45),
                      }}
                      title="Your Location"
                      zIndex={1000}
                    />
                  )}

                  {/* Pickup Markers with different colors */}
                  {orderedPickups.map((pickup, index) => (
                    <Marker
                      key={pickup.orderIndex}
                      position={{ lat: pickup.lat, lng: pickup.lng }}
                      label={{
                        text: `${index + 1}`,
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                      icon={{
                        url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23${index === 0 ? "10B981" : index === 1 ? "F59E0B" : "EF4444"}'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E`,
                        scaledSize: new google.maps.Size(40, 40),
                      }}
                      title={pickup.customer}
                      zIndex={900 - index}
                    />
                  ))}

                  {/* Individual route segments with different colors */}
                  {routeSegments.map((segment, index) => (
                    <Polyline
                      key={`segment-${index}`}
                      path={[segment.from, segment.to]}
                      options={{
                        strokeColor: segment.color,
                        strokeWeight: 5,
                        strokeOpacity: 0.9,
                        zIndex: 100 - index,
                      }}
                    />
                  ))}
                </GoogleMap>
              </div>

              {/* Map Legend */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#31B8FA]"></div>
                    <span className="text-xs text-gray-600">Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#10B981]"></div>
                    <span className="text-xs text-gray-600">First Stop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
                    <span className="text-xs text-gray-600">Second Stop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#EF4444]"></div>
                    <span className="text-xs text-gray-600">Other Stops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-1.5 bg-[#10B981]"></div>
                    <span className="text-xs text-gray-600">First Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-1.5 bg-[#8B5CF6]"></div>
                    <span className="text-xs text-gray-600">Next Routes</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order List Section */}
          <div className="lg:col-span-1">
            <Card className="p-5 shadow-lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#31B8FA]" />
                  Delivery Sequence
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Optimized route for fastest delivery
                </p>
              </div>

              {/* Route Summary */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Navigation className="h-4 w-4" />
                    <span className="text-xs">Distance</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDistance(routeData.totalDistance)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDuration(routeData.totalDuration)}
                  </p>
                </div>
              </div>

              {/* Starting Point */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-[#31B8FA]">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-[#31B8FA]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Starting Point
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      Your Current Location
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center my-3">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              {/* Pickup Points */}
              <div className="space-y-3">
                {orderedPickups.map((pickup, index) => {
                  const leg = routeData?.legs?.[index];
                  const markerColor =
                    index === 0
                      ? "bg-[#10B981]"
                      : index === 1
                        ? "bg-[#F59E0B]"
                        : "bg-[#EF4444]";

                  return (
                    <div key={pickup.orderIndex}>
                      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#31B8FA] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full ${markerColor} text-white flex items-center justify-center font-semibold text-sm`}
                            >
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {pickup.customer}
                              </p>
                            </div>
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-gray-600">
                                {pickup.address}
                              </p>
                            </div>
                            {leg && (
                              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                  <Navigation className="h-3 w-3 text-green-600" />
                                  <span className="text-xs font-medium text-green-600">
                                    {leg.distance.text}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-orange-600" />
                                  <span className="text-xs font-medium text-orange-600">
                                    {leg.duration.text}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* See Details Button */}
                            <div className="mt-3">
                              <SeeDetailsModal orderId={pickup.id} />
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < orderedPickups.length - 1 && (
                        <div className="flex items-center justify-center py-2">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              {!isNavigating ? (
                <Button
                  onClick={() => {
                    setIsNavigating(true);
                    // Get initial location
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setCurrentLocation({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        });
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                        alert(
                          "Please enable location services to start navigation",
                        );
                      },
                    );
                  }}
                  className="w-full mt-6 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white py-6"
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Start Navigation
                </Button>
              ) : (
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      if (origin && orderedPickups.length > 0) {
                        const allStops = [
                          currentLocation
                            ? `${currentLocation.lat},${currentLocation.lng}`
                            : `${origin.lat},${origin.lng}`,
                          ...orderedPickups.map((p) => `${p.lat},${p.lng}`),
                        ];

                        const googleMapsUrl = `https://www.google.com/maps/dir/${allStops.join("/")}`;
                        window.open(googleMapsUrl, "_blank");
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4"
                  >
                    <Navigation className="mr-2 h-5 w-5" />
                    Open in Google Maps
                  </Button>
                  <Button
                    onClick={() => setIsNavigating(false)}
                    variant="outline"
                    className="w-full py-4"
                  >
                    Stop Navigation
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

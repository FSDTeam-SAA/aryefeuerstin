/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Map, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderSkeleton } from "./_components/OrderSkeleton";
import { useState } from "react";
import LocationPickerModal from "@/app/(auth)/auth/register/driver-register/_components/LocationPickerModal";
import { useRouter } from "next/navigation";

interface OrderAssignment {
  _id: string;
  status: string;
  customer: {
    fullName: string;
    pickupLocation: {
      address: string;
    };
  };
  user?: {
    subscription?: {
      planId?: {
        title?: string;
      };
    };
  };
  rushService?: {
    enabled: boolean;
    fee: number;
  };
}

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

export default function OrderRequestsPage() {
  const session = useSession();
  const token = session?.data?.accessToken;
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );
  const [routeType, setRouteType] = useState<"single" | "multiple">("single");
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/my-assignments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    enabled: !!token,
  });

  const confirmToSeeRouteMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/generate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Failed to generate route");
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Route generated successfully:", data);
      setIsMapOpen(false);
      setSelectedLocation(null);
    },
    onError: (error) => {
      console.error("Error generating route:", error);
    },
  });

  const orders: OrderAssignment[] = data?.data || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedOrders(orders.map((order) => order._id));
    else setSelectedOrders([]);
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) setSelectedOrders([...selectedOrders, orderId]);
    else setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
  };

  const handleMultipleRoute = () => {
    setRouteType("multiple");
    setIsMapOpen(true);
  };

  const handleSingleRoute = (orderId: string) => {
    setRouteType("single");
    setCurrentOrderId(orderId);
    setIsMapOpen(true);
  };

  const handleLocationSelect = (location: any) => {
  setSelectedLocation({
    address: location.address,
    lat: location.lat ?? location.latitude,
    lng: location.lng ?? location.longitude,
  });
};
  const handleConfirmRoute = async () => {
    if (!selectedLocation) return;

    const payload = {
      currentLocation: {
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
      orderIds: routeType === "multiple" ? selectedOrders : [currentOrderId],
    };

    confirmToSeeRouteMutation.mutate(payload, {
      onSuccess: (response) => {
        localStorage.setItem("currentRouteData", JSON.stringify(response.data));
        router.push("/route-details-page");
      },
    });
  };

  const isAllSelected =
    orders.length > 0 && selectedOrders.length === orders.length;

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load deliveries.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold text-[#181818] mb-14 text-center">
          {isLoading
            ? "Checking deliveries..."
            : `You have ${orders.length} active deliveries`}
        </h1>

        {!isLoading && orders.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({selectedOrders.length})
              </label>
            </div>
            {selectedOrders.length > 1 && (
              <Button
                onClick={handleMultipleRoute}
                className="bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white w-full sm:w-auto"
              >
                See Route for Selected
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <OrderSkeleton />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isOrderSelected = selectedOrders.includes(order._id);
              const shouldDisableIndividualRoute = selectedOrders.length > 1;

              return (
                <Card key={order._id} className="p-5 shadow-none">
                  <div className="mb-4 flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0 items-start sm:items-center">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`order-${order._id}`}
                        checked={isOrderSelected}
                        onCheckedChange={(checked) =>
                          handleSelectOrder(order._id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div>
                        <p className="mb-1 text-xs font-medium text-gray-500">
                          Job #{order._id.slice(-4).toUpperCase()}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.customer.fullName}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>

                      {/* === এখান থেকে নিচের কোডটুকু যোগ করুন / replace করুন === */}
                      {order.rushService?.enabled && (
                        <span className="rounded-full px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 inline-flex items-center gap-1.5 border border-amber-300/70 shadow-sm">
                          <span className="text-base leading-none">⚡</span>
                          Rush Service
                        </span>
                      )}

                      {order.user?.subscription?.planId?.title && (
                        <span
                          className="rounded-full px-3 py-1.5 text-xs font-medium text-white"
                          style={{
                            backgroundColor:
                              order.user.subscription.planId.title ===
                              "PAY-PER-PICKUP"
                                ? "#0fa551"
                                : order.user.subscription.planId.title ===
                                    "STANDARD PACKAGE"
                                  ? "#ff8c00"
                                  : order.user.subscription.planId.title ===
                                      "PREMIUM PACKAGE"
                                    ? "#166de9"
                                    : "#6b7280",
                          }}
                        >
                          {order.user.subscription.planId.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-start gap-2 border-b pb-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {order?.customer?.pickupLocation?.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Return Request
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <Link href={`/driver/order-details/${order._id}`}>
                      <Button className="w-full sm:w-[127px] bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
                        See Details
                      </Button>
                    </Link>

                    <Button
                      onClick={() => handleSingleRoute(order._id)}
                      className="w-full sm:w-[127px] bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-1"
                      disabled={shouldDisableIndividualRoute}
                    >
                      <Map />
                      See Route
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Map Modal */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="w-full max-w-3xl p-4 sm:p-6 rounded-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Select Your Current Location
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Location Picker */}
            <LocationPickerModal
              onSelect={handleLocationSelect}
              onClose={() => setIsMapOpen(false)}
            />

            {/* Buttons */}
            <div className="flex sm:flex-row justify-end gap-2 mt-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsMapOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleConfirmRoute}
                disabled={
                  !selectedLocation || confirmToSeeRouteMutation.isPending
                }
                className="w-full sm:w-auto bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white"
              >
                {confirmToSeeRouteMutation.isPending
                  ? "Generating..."
                  : "Confirm & See Route"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

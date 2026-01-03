"use client";

import { MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { OrderCardSkeleton } from "./_components/OrderCardSkeleton";
import { useSession } from "next-auth/react";

type Order = {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    pickupLocation?: {
      address: string;
    };
    address?: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
  stores: Array<{
    numberOfPackages: number;
  }>;
  status: string;
  review: {
    rating: number | null;
    reviewedAt: string | null;
  };
};

const fetchOrders = async (token: string): Promise<Order[]> => {
  if (!token) throw new Error("Authentication token is missing");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  const json = await res.json();
  return json.data.data;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ON_MY_WAY":
      return "orange";
    case "PENDING":
      return "purple";
    case "COMPLETED":
      return "green";
    default:
      return "gray";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "ON_MY_WAY":
      return "On My Way";
    case "PENDING":
      return "Pending";
    case "COMPLETED":
      return "Completed";
    default:
      return status || "Unknown";
  }
};

export default function OrderRequestsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken as string | undefined;

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<Order[]>({
    queryKey: ["return-orders", token],
    queryFn: () => fetchOrders(token!),
    enabled: !!token && sessionStatus === "authenticated",
    retry: 1,
  });

  // Auth loading
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600">Loading session...</p>
      </div>
    );
  }

  // Not logged in
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-700 mb-4">
            You need to be logged in to view your orders.
          </p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-[#181818] mb-14 md:text-3xl text-center">
          Your Order Requests
        </h1>

        <div className="space-y-6">
          {isLoading ? (
            <>
              <OrderCardSkeleton />
              <OrderCardSkeleton />
              <OrderCardSkeleton />
            </>
          ) : isError ? (
            <Card className="p-8 text-center">
              <p className="text-red-600 mb-2">Error loading orders</p>
              <p className="text-sm text-gray-500">
                {(error as Error)?.message || "Please try again later"}
              </p>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No return orders found.</p>
            </Card>
          ) : (
            orders.map((order) => {
              const fullName = `${order.customer.firstName} ${order.customer.lastName}`;

              const address =
                order.customer?.pickupLocation?.address ||
                [
                  order.customer?.address?.street,
                  order.customer?.address?.city,
                  order.customer?.address?.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                "Address not available";

              const totalPackages = order.stores.reduce(
                (sum, store) => sum + (store.numberOfPackages || 0),
                0
              );

              const isCompleted = order.status === "COMPLETED";

              return (
                <Card key={order._id} className="p-5 shadow-none border">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job #{order._id.slice(-6)}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {fullName}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        getStatusColor(order.status) === "orange"
                          ? "bg-orange-100 text-orange-800"
                          : getStatusColor(order.status) === "purple"
                          ? "bg-purple-100 text-purple-800"
                          : getStatusColor(order.status) === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-start gap-2 border-b pb-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                      <span className="text-sm text-gray-700">{address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {totalPackages} Package{totalPackages !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-row justify-between gap-3 ">
                    <Link
                      href={`/user/job-details/${order._id}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
                        See Details
                      </Button>
                    </Link>

                    {isCompleted && (
                      <Link
                        href={`/user/review/${order._id}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
                          Write a Review
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

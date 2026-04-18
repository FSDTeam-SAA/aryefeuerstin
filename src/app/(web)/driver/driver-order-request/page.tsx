
"use client"

import {  MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { DeliveryCardSkeleton } from "./_components/DeliveryCardSkeleton" 
import { useSession } from "next-auth/react"

// --- Types ---
interface Store {
  store: string
  numberOfPackages: number
}

interface Order {
  _id: string
  customer: {
    firstName: string
    lastName: string
    address: { street: string; city: string; zipCode: string }
  }
  stores: Store[]
}

interface ApiResponse {
  data: {
    data: Order[]
    pagination: { totalData: number }
  }
}

export default function DeliveryQueue() {
  const session = useSession()
  const token = session?.data?.accessToken as string

 

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["completedOrders"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/my-completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch")
      return response.json()
    },
  })

   const deliveries = data?.data?.data || []
  const totalItems = data?.data?.pagination?.totalData || 0

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-10 text-center text-xl font-medium text-gray-900">
          {isLoading ? "Loading your deliveries..." : `You have completed ${totalItems} active deliveries today`}
        </h1>

        <div className="space-y-6">
        
        
          <div className="space-y-4">
            {isLoading ? (
              // Use the separate Skeleton component
              <>
                <DeliveryCardSkeleton />
                <DeliveryCardSkeleton />
                <DeliveryCardSkeleton />
              </>
            ) : (
              deliveries.map((delivery) => {
                const fullName = `${delivery.customer.firstName} ${delivery.customer.lastName}`
                const fullAddress = `${delivery.customer.address.street}, ${delivery.customer.address.city}, ${delivery.customer.address.zipCode}`
                const totalPackages = delivery.stores.reduce((sum, s) => sum + s.numberOfPackages, 0)

                return (
                  <div key={delivery._id} className="rounded-lg bg-white p-6 shadow-sm border border-transparent hover:border-gray-200 transition-colors">
                    <div className="flex-1 space-y-3">
                      <p className="text-xs text-gray-500">{delivery._id}</p>
                      <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
                      
                      <div className="flex items-start gap-2 text-sm text-gray-600 border-b border-gray-100 pb-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{fullAddress}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span>{totalPackages} Packages</span>
                      </div>

                      <div className="flex justify-between pt-2">
                        <Link href={`/driver/order-details/${delivery._id}`}>
                          <Button size="sm" className="bg-[#3bb3e0] hover:bg-[#2a9dc7]">
                            <Package className="mr-2 h-4 w-4" />
                            See Details
                          </Button>
                        </Link>
                       
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
import { MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DeliveryQueue() {
  const deliveries = [
    {
      id: "Job-1001",
      name: "Daniel Hart",
      address: "12 Maple Street, Brookview, CA 92714",
      packages: 2,
    },
    {
      id: "Job-1002",
      name: "Emma Collins",
      address: "19 Maple Street, Brookview, CA 92714",
      packages: 2,
    },
    {
      id: "Job-1002",
      name: "Emma Collins",
      address: "19 Maple Street, Brookview, CA 92714",
      packages: 2,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <h1 className="mb-10 text-center text-xl font-medium text-gray-900">You have 4 active deliveries today</h1>

        {/* Active Queue Section */}
        <div className="space-y-6">
          <h2 className="text-sm font-medium text-gray-700">Active queue</h2>

          {/* Delivery Cards */}
          <div className="space-y-4">
            {deliveries.map((delivery, index) => (
              <div key={`${delivery.id}-${index}`} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{delivery.id}</p>
                           {/* Right Actions */}
                  <div className="flex gap-3 lg:flex-row lg:items-end">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-[#c8f5dd] text-[#1a8754] hover:bg-[#b3ecc9] lg:flex-none lg:px-6"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-[#f5d0d0] text-[#c5534d] hover:bg-[#edb8b8] lg:flex-none lg:px-6"
                    >
                      Reject
                    </Button>
                  </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">{delivery.name}</h3>
                    <div className="flex items-start gap-2 text-sm text-gray-600 border-b border-gray-200 pb-2">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{delivery.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <span>{delivery.packages} Packages</span>
                    </div>
                    <Link href={`/driver/order-details/${delivery.id}`}>
                    <Button variant="default" size="sm" className="bg-[#3bb3e0] text-white hover:bg-[#2a9dc7] mt-2">
                      <Package className="mr-2 h-4 w-4" />
                      See Details
                    </Button>
                    </Link>
                  </div>

               
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

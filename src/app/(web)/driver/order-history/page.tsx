// "use client"

// import { MapPin, Package } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import Link from "next/link"
// import { useSession } from "next-auth/react"

// // Dummy data
// const orders = [
//   {
//     id: 1002,
//     name: "Emma Collins",
//     status: "On My Way",
//     statusColor: "orange",
//     address: "19 Maple Street, Brookview, CA 92714",
//     packages: 2,
//     completedToday: false,
//   },
//   {
//     id: 1003,
//     name: "Sophia Bennett",
//     status: "Picked Up",
//     statusColor: "purple",
//     address: "31 Maple Street, Brookview, CA 92714",
//     packages: 3,
//     completedToday: false,
//   },
//   {
//     id: 1001,
//     name: "Ryan Mitchell",
//     status: "Completed",
//     statusColor: "green",
//     address: "40 Maple Street, Brookview, CA 92714",
//     packages: 1,
//     completedToday: true,
//   },
// ]

// export default function OrderRequestsPage() {
//   const session= useSession();
//   const token=session?.data?.accessToken
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="mx-auto max-w-4xl">
//         <h1 className=" text-2xl font-semibold text-[#181818] mb-14 md:text-2xl text-center">
//          You have 4 active deliveries today
//         </h1>

//         <div className="space-y-6">
//           {orders.map((order) => (
//             <Card key={order.id} className="p-5 shadow-none">
//               <div className="mb-4 flex items-start justify-between">
//                 <div>
//                   <p className="mb-1 text-xs font-medium text-gray-500">
//                     Job {order.id}
//                   </p>
//                   <h3 className="text-lg font-semibold text-gray-900">{order.name}</h3>
//                 </div>
//                 <span
//                   className={`rounded-full px-3 py-1.5 text-xs font-medium ${
//                     order.statusColor === "orange"
//                       ? "bg-orange-100 text-orange-800"
//                       : order.statusColor === "purple"
//                       ? "bg-purple-100 text-purple-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <div className="mb-4 space-y-2">
//                 <div className="flex items-start gap-2 border-b pb-2">
//                   <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
//                   <span className="text-sm text-gray-700">{order.address}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Package className="h-4 w-4 shrink-0 text-gray-500" />
//                   <span className="text-sm text-gray-700">{order.packages} Packages</span>
//                 </div>
//               </div>

//               {/* Buttons */}
//               <div className={`flex justify-between   ${order.completedToday ? "" : "flex-col"}`}>
//                 <Link href={`/driver/order-details/${order.id}`}>
//                 <Button className=" w-[127px] bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
//                   See Details
//                 </Button>
//                 </Link>
//                 {order.completedToday && (
//                     <Link href="/user/review">
//                   <Button className=" !w-[127px] bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
//                     Write a Review
//                   </Button>
//                     </Link>
//                 )}
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { Map, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { OrderSkeleton } from "./_components/OrderSkeleton"


// Types based on your API response
interface OrderAssignment {
  _id: string
  status: string
  customer: {
    firstName: string
    lastName: string
    pickupLocation: {
      address: string
    }
  }
}

export default function OrderRequestsPage() {
  const session  = useSession()
  const token = session?.data?.accessToken 

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/return-order/my-assignments`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Network response was not ok")
      return response.json()
    },
    enabled: !!token, // Only run if token exists
  })

  const orders: OrderAssignment[] = data?.data || []

  if (isError) return <div className="p-8 text-center text-red-500">Failed to load deliveries.</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold text-[#181818] mb-14 text-center">
          {isLoading ? "Checking deliveries..." : `You have ${orders.length} active deliveries today`}
        </h1>

        {isLoading ? (
          <OrderSkeleton/>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="p-5 shadow-none">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">
                      Job #{order._id.slice(-4).toUpperCase()}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.customer.firstName} {order.customer.lastName}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      order.status === "PENDING"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
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
                    <span className="text-sm text-gray-700">Return Request</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Link href={`/driver/order-details/${order._id}`}>
                    <Button className="w-[127px] bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
                      See Details 
                    </Button>
                  </Link>
                  
                
                    <Link href="">
                      <Button className="w-[127px] bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white">
                      <Map/>
                       See Route
                      </Button>
                    </Link>
           
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


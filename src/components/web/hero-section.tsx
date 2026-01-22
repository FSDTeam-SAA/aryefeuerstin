// "use client"

// import { Button } from "@/components/ui/button"
// import { useSession } from "next-auth/react";
// import Image from "next/image"
// import Link from "next/link"

// export default function HeroSection() {
//   const session = useSession();
//   const role = session?.data?.user?.role
//   const TOKEN = session?.data?.accessToken; 

//   const {
//       data: userData,
//       isLoading,
//       isError,
//       error,
//     } = useQuery({
//       queryKey: ["userProfile"],
//       queryFn: async () => {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${TOKEN}`, // যদি token লাগে
//             },
//           },
//         );
  
//         if (!res.ok) {
//           throw new Error("Failed to fetch user profile");
//         }
  
//         return res.json(); // 👉 backend response return করবে
//       },
//     });
  

//   return (
//     <section className="bg-[#E4F6FF] py-12 md:py-12 lg:py-14">
//       <div className="container mx-auto px-4">
//         <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

//           {/* Left Content */}
//           <div className="space-y-7 lg:col-span-5">
//             <h1 className="text-2xl md:text-4xl lg:text-[45px] font-semibold text-[#0A0A23] leading-[120%]">
//               Your Trusted Partner for Store Returns
//             </h1>

//             <p className="text-sm md:text-base text-[#424242] leading-[1.5]">
//               We pick up your packages and return them to the store for you.
//               Saving you time, and cost of taxis, preventing missed deadlines,
//               and ensuring you never lose any refund. Simple, efficient, and
//               designed for your convenience.
//             </p>

//             {
//               role === "USER" && (
//                 <div className="mt-5">
//                 <Link href="/return-package">
//                   <Button className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-8 py-6 text-base">
//                     Schedule My Return Pickup
//                   </Button>
//                 </Link>
//                 </div>
//               )
//             }
          
//           </div>

//           {/* Right Image */}
//           <div className="flex justify-center lg:justify-end lg:col-span-7">
//             <div className="relative w-full  h-auto lg:h-[550px]">
//               <Image
//                 src="/image/newb12.png"
//                 alt="Delivery person with packages and truck"
//                 width={1000}
//                 height={1000}
//                 className="object-contain"
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }




"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export default function HeroSection() {
  const session = useSession();
  const role = session?.data?.user?.role
  const TOKEN = session?.data?.accessToken


  const {
    data: userData,
    isLoading,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("Failed to fetch user profile")
      }

      return res.json()
    },
    enabled: !!TOKEN && role === "USER",
  })

  const hasActiveSubscription = userData?.data?.user?.hasActiveSubscription ?? false
  const maxReturnOrders = userData?.data?.user?.subscription?.planId?.limits?.maxReturnOrders
  const returnOrdersUsed = userData?.data?.user?.subscriptionUsage?.returnOrdersUsed ?? 0

  const handleScheduleClick = () => {
    if (!hasActiveSubscription) {
      toast.info("Please purchase a package first to request a return pickup!")
      return
    }

    // maxReturnOrders null হলে unlimited, না হলে limit check করবে
    if (maxReturnOrders !== null && returnOrdersUsed >= maxReturnOrders) {
      toast.error("You have reached your return order limit for this package! Buy a new package")
      return
    }

    window.location.href = "/return-package"
  }

  if (isLoading) {
    return <div className="py-12 text-center">Loading user info...</div>
  }

  return (
    <section className="bg-[#E4F6FF] py-12 md:py-12 lg:py-14">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-7 lg:col-span-5">
            <h1 className="text-2xl md:text-4xl lg:text-[45px] font-semibold text-[#0A0A23] leading-[120%]">
              Your Trusted Partner for Store Returns
            </h1>

            <p className="text-sm md:text-base text-[#424242] leading-[1.5]">
              We pick up your packages and return them to the store for you.
              Saving you time, and cost of taxis, preventing missed deadlines,
              and ensuring you never lose any refund. Simple, efficient, and
              designed for your convenience.
            </p>

            {role === "USER" && (
              <div className="mt-5">
                <Button
                  onClick={handleScheduleClick}
                  className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-8 py-6 text-base"
                  disabled={isLoading}
                >
                  Schedule My Return Pickup
                </Button>
              </div>
            )}
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end lg:col-span-7">
            <div className="relative w-full h-auto lg:h-[550px]">
              <Image
                src="/image/newb12.png"
                alt="Delivery person with packages and truck"
                width={1000}
                height={1000}
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
// "use client"
// import { Button } from "@/components/ui/button"


// import Image from "next/image"

// export default function HeroSection() {

//   return (
//     <section className="bg-[#E4F6FF] py-12 md:py-20 lg:py-24">
//       <div className="container mx-auto px-4">
//        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
//   {/* Left Content */}
//   <div className="space-y-7 lg:col-span-5">
//     <h1 className="text-2xl md:text-4xl lg:text-[45px] font-semibold text-[#0A0A23] !leading-[120%]">
//       Your Trusted Partner for Store Returns
//     </h1>

//     <p className="text-sm md:text-base text-[#424242] leading-[1.2]">
//       We pick up your packages and return them to the store for you. Saving you time, and cost of taxis,
//       preventing missed deadlines, and ensuring you never lose any refund. Simple, efficient, and designed for
//       your convenience
//     </p>

//     <Button className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-8 py-6 text-base">
//       Schedule My Return Pickup
//     </Button>
//   </div>

//   {/* Right Illustration */}
//   <div className="flex justify-center lg:justify-end lg:col-span-7">
//     <div className="relative w-full h-auto lg:h-[484px]">
//       <Image
//         src="/image/newb12.png"
//         alt="Delivery person with packages and truck"
//         width={1000}
//         height={1000}
//         className="w-full h-full object-cover"
//       />
//     </div>
//   </div>
// </div>

//       </div>
//     </section>
//   )
// }



"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
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

            <Button className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-8 py-6 text-base">
              Schedule My Return Pickup
            </Button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end lg:col-span-7">
            <div className="relative w-full  h-auto lg:h-[550px]">
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

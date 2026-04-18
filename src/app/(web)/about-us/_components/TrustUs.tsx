"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TrustUs() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

        {/* Left Side - Content */}
        <div className="flex flex-col space-y-10 text-center lg:text-left">
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-[60px] font-semibold leading-tight text-[#11204C]">
            Why Trust Us
          </h2>

          <ul className="mx-auto lg:mx-0 max-w-xl list-disc space-y-4 pl-5 text-left">
            <li className="text-sm sm:text-base lg:text-[22px] leading-relaxed text-[#616263]">
              Reliable Service: Consistent, on-time pickups and secure return handling.
            </li>
            <li className="text-sm sm:text-base lg:text-[22px] leading-relaxed text-[#616263]">
             Cost-Effective: Eliminates taxi expenses and unnecessary travel.
            </li>
            <li className="text-sm sm:text-base lg:text-[22px] leading-relaxed text-[#616263]">
              Deadline Protection: We ensure your returns are completed on time to avoid lost refunds.
            </li>
            <li className="text-sm sm:text-base lg:text-[22px] leading-relaxed text-[#616263]">
              Efficient Process: Smooth, organized, and stress-free from pickup to drop-off.
            </li>
            <li className="text-sm sm:text-base lg:text-[22px] leading-relaxed text-[#616263]">
              Transparent & Professional: Clear communication and dependable service at every step.
            </li>
          </ul>

          <div className="pt-6 sm:pt-8 flex justify-center lg:justify-start">
            <Button className="h-[48px] sm:h-[50px] px-10 sm:px-[68px] text-sm sm:text-base font-bold rounded-lg bg-[#31B8FA] text-white hover:bg-[#31B8FA]/90">
              Read more
            </Button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full">
          <div className="relative w-full h-[260px] sm:h-[360px] md:h-[450px] lg:h-[500px] overflow-hidden">
            <Image
              src="/image/aboutN2.png"
              alt="Why trust us"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              
            />
          </div>
        </div>

      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function OurMission() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

        {/* Right Side - Content (Show FIRST on Mobile) */}
        <div className="order-1 lg:order-2 flex flex-col space-y-10 text-center lg:text-right">
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-[60px] font-semibold leading-tight text-[#11204C]">
            Our Mission
          </h2>

          <p className="text-pretty text-base leading-relaxed text-[#616263] sm:text-[22px]">
            Our mission is to provide a smooth, reliable, and cost-effective return service that saves our customers time, eliminates stress, and ensures no one loses money on missed deadlines again. We pick up your packages, handle the return process, and make everything as effortless as possible.
          </p>

          <div className="pt-6 sm:pt-8 flex justify-center lg:justify-end">
            <Button className="h-[48px] sm:h-[50px] px-10 sm:px-[68px] text-sm sm:text-base font-bold rounded-lg bg-[#31B8FA] text-white hover:bg-[#31B8FA]/90">
              Read more
            </Button>
          </div>
        </div>

        {/* Left Side - Image (Show SECOND on Mobile) */}
        <div className="order-2 lg:order-1 w-full">
          <div className="relative w-full h-[260px] sm:h-[360px] md:h-[450px] lg:h-[562px] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/image/about4.png"
              alt="Our mission"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}

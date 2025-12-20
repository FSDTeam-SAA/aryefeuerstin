"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function OurStory() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 sm:py-5">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

        {/* Left Side - Content */}
        <div className="flex flex-col space-y-10 text-center lg:text-left">
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-[60px] font-semibold leading-tight text-[#11204C]">
            Our Story
          </h2>

          <p className="text-pretty text-base leading-relaxed text-[#616263] sm:text-[22px]">
            We created this service after seeing how many people struggled with simple returns—business owners spending unnecessary money on taxis, and busy parents missing deadlines because their packages got stuck in a car or forgotten at home. Too much time and money was being lost over something that should be easy. So we took action and built a service that makes returning items simple, affordable, and stress-free.
          </p>

          <div className="pt-6 sm:pt-8 flex justify-center lg:justify-start">
            <Button className="h-[48px] sm:h-[50px] px-10 sm:px-[68px] text-sm sm:text-base font-bold rounded-lg bg-[#31B8FA] text-white hover:bg-[#31B8FA]/90">
              Read more
            </Button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full">
          <div className="relative w-full h-[260px] sm:h-[360px] md:h-[450px] lg:h-[562px] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/image/about3.png"
              alt="Our story"
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

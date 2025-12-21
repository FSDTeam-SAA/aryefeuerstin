"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRef, useState } from "react"
import Link from "next/link"

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState("/professional-woman-portrait.png")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className=" p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Card className="border-none shadow-none p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row">

            {/* LEFT SIDE */}
            <div className="flex shrink-0 flex-col items-center gap-4 w-full lg:w-auto">
              <div className="h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-200">
                <Image
                  src={preview}
                  alt="Profile"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#33B8FF] text-[#33B8FF] hover:bg-blue-50 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <Link href="/change-password">
                <Button
                  variant="outline"
                  className="w-full border-[#33B8FF] text-[#33B8FF] hover:bg-blue-50 bg-transparent"
                >
                  Change Password
                </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-[#131313]">
                  Profile Settings
                </h1>

                <span className="w-fit rounded-lg border-2 border-[#31B8FA] bg-white px-3 py-1.5 text-sm sm:text-base font-medium text-[#31B8FA]">
                  Total Returns: 04
                </span>
              </div>

              {/* Form */}
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <Label className="mb-1.5 block text-sm sm:text-base">
                    First Name  <span className="text-[#8C311E]">*</span> 
                  </Label>
                  <Input
                    placeholder="Enter your first name"
                    className="h-[44px] sm:h-[48px]"
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm sm:text-base">
                    Last Name<span className="text-[#8C311E]">*</span> 
                  </Label>
                  <Input
                    placeholder="Enter your last name"
                    className="h-[44px] sm:h-[48px]"
                  />
                </div>

                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block text-sm sm:text-base">
                      Email<span className="text-[#8C311E]">*</span> 
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-[44px] sm:h-[48px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-sm sm:text-base">
                      Phone No<span className="text-[#8C311E]">*</span> 
                    </Label>
                    <Input
                      placeholder="Enter your phone number"
                      className="h-[44px] sm:h-[48px]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm sm:text-base">
                    Pickup Address <span className="text-[#8C311E]">*</span> 
                  </Label>
                  <Input
                    placeholder="Enter your address"
                    className="h-[44px] sm:h-[48px]"
                  />
                </div>

                {/* Sticky button on mobile */}
                <div className="sticky bottom-0 bg-[#F9FAFB] pt-4 sm:static sm:bg-transparent">
                  <Button className="h-12 w-full rounded-full bg-[#31B8FA] text-white text-base font-semibold hover:bg-[#31B8FA]">
                    Update Profile
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  )
}

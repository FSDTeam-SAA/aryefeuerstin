"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">

      {/* Left Image Section */}
      <div className="hidden lg:block relative">
        <Image
          src="/delivery-van.png"
          alt="Ez Returns delivery van"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-2xl space-y-4">

          {/* Header */}
          <div className="text-center space-y-1">
            <p className="text-sm text-[#616161]">
              Welcome to Wellness Made Clear
            </p>
            <h1 className="text-3xl font-semibold text-[#131313]">
              Create an account for Driver
            </h1>
          </div>

          {/* Form */}
          <form className="space-y-4">

            <div>
              <Label>First Name *</Label>
              <Input className="bg-[#E4F6FF] h-11 mt-1" placeholder="First name" />
            </div>

            <div>
              <Label>Last Name *</Label>
              <Input className="bg-[#E4F6FF] h-11 mt-1" placeholder="Last name" />
            </div>


            <div>
              <Label>Email *</Label>
              <Input type="email" className="bg-[#E4F6FF] h-11 mt-1" placeholder="Email" />
            </div>
             <div>
              <Label>Phone No *</Label>
              <Input type="email" className="bg-[#E4F6FF] h-11 mt-1" placeholder="Phone No" />
            </div>

            <div>
              <Label> Address *</Label>
              <Input className="bg-[#E4F6FF] h-11 mt-1" placeholder="Address" />
            </div>

            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="bg-[#E4F6FF] h-11 mt-1"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirm Password *</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-[#E4F6FF] h-11 mt-1"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
               <div>
              <Label>Driving License *</Label>
              <Input type="text" className="bg-[#E4F6FF] h-11 mt-1" placeholder="Driving License" />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-[#8C311E] underline">
                  terms & conditions
                </Link>
              </label>
            </div>

            <Button className="w-full h-11 bg-[#31B8FA] text-white">
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#23547B] font-medium">
                Log In
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

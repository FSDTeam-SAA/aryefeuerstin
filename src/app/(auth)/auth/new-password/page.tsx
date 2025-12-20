"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Left Image */}
      <div className="hidden lg:block relative">
        <Image
          src="/delivery-van.png"
          alt="Ez Returns delivery van"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-3xl p-8 rounded-xl space-y-6">

          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-[40px] font-semibold text-[#131313]">
              New Password
            </h1>
            <p className="text-sm text-[#616161]">
              Please create your new password
            </p>
          </div>

          <form className="space-y-6">

            {/* New Password */}
            <div>
              <Label htmlFor="password">New Password *</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#E4F6FF] py-6 pr-10"
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

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Re-enter Password *</Label>
              <div className="relative mt-2">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#E4F6FF] py-6 pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

         

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white"
            >
              Continue
            </Button>

           
          </form>
        </div>
      </div>
    </div>
  )
}

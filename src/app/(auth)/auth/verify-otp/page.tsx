"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")
    console.log("Verify OTP:", otpValue)
    // Handle OTP verification logic here
    router.push("/auth/new-password")
  }

  const handleResendOTP = () => {
    console.log("Resend OTP")
    // Handle resend OTP logic here
  }

  return (
    <div className="h-screen flex">
      {/* Left Section - Form with Logo */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="hidden lg:block relative">
            <Image
              src="/delivery-van.png"
              alt="Ez Returns delivery van"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Enter OTP</h1>
            <p className="text-sm text-muted-foreground">
              An OTP has been sent to your email address
              please verify it below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 bg-[#E4F6FF] text-center text-lg font-semibold"
                />
              ))}
            </div>

            <div className="text-center">
              <button type="button" onClick={handleResendOTP} className="text-sm text-sky-500 hover:underline">
                Didn&apos;t receive OTP? Resend OTP
              </button>
              </div>

            <Button type="submit" className="w-full bg-[#31B8FA] hover:bg-[#31B8FA] text-white h-[48px]">
              Submit OTP
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Back to{" "}
            <Link href="/login" className="text-sky-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Van Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image width={500} height={500} src="/delivery-van.png" alt="Ez Returns Delivery Van" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  )
}

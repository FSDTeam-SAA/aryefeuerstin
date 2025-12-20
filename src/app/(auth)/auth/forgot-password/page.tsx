"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    router.push("/auth/verify-otp")
  }

  return (
    <div className="h-screen flex">

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
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

          <div className="text-center space-y-2">
            <h1 className="text-[40px] font-semibold text-[#252525] ">Forget Password</h1>
            <p className="text-sm text-[#9E9E9E]">
              Please enter the email address linked to your account. We&apos;ll send a one-time password (OTP) to your email for verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                className="bg-[#E4F6FF] py-5"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#31B8FA] hover:bg-[#31B8FA] text-[#2F3E34]">
              Send OTP
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Back to{" "}
            <Link href="/login" className="text-[#23547B] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Van Image */}
      <div className="hidden lg:flex flex-1 relative ">
        <Image width={500} height={500} src="/delivery-van.png" alt="Ez Returns Delivery Van" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  )
}

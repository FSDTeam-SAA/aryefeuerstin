"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get email from URL params
  const email = searchParams.get("email") || ""
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 1. TanStack Query Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { otp: string; email: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Invalid OTP code")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("OTP Verified Successfully!", { id: "otp-toast" })
      // Redirect to new-password and pass email forward
      setTimeout(() => {
        router.push(`/auth/new-password?email=${encodeURIComponent(email)}`)
      }, 1500)
    },
    onError: (error) => {
      toast.error(error.message, { id: "otp-toast" })
    },
  })

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Take only the last character
    setOtp(newOtp)

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
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length < 6) {
      return toast.error("Please enter the full 6-digit code")
    }

    if (!email) {
      return toast.error("Email not found. Please try again from the forgot password page.")
    }

    toast.loading("Verifying code...", { id: "otp-toast" })
    mutate({ otp: otpValue, email })
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div className="h-screen flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Enter OTP</h1>
              <p className="text-sm text-muted-foreground">
                An OTP has been sent to <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isPending}
                    className="w-12 h-12 bg-[#E4F6FF] border-none text-center text-lg font-semibold focus-visible:ring-1 focus-visible:ring-sky-400"
                  />
                ))}
              </div>

              <div className="text-center">
                <button 
                  type="button" 
                  className="text-sm text-sky-500 hover:underline disabled:opacity-50"
                  disabled={isPending}
                >
                  Didn&apos;t receive OTP? Resend OTP
                </button>
              </div>

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white h-[48px] font-medium"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </div>
                ) : (
                  "Submit OTP"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Back to{" "}
              <Link href="/auth/login" className="text-sky-500 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 relative">
          <Image 
            fill 
            src="/delivery-van.png" 
            alt="Ez Returns Delivery Van" 
            className="object-cover" 
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </>
  )
}
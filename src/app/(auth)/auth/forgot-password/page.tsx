"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  // 1. TanStack Query Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (emailData: { email: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to send OTP")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("OTP sent to your email!", { id: "forgot-password-toast" })
      
      // Redirect to verify-otp and pass the email in params
      setTimeout(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
      }, 1500)
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong", { id: "forgot-password-toast" })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return toast.error("Please enter your email")

    // Show loading toast
    toast.loading("Sending OTP...", { id: "forgot-password-toast" })
    
    // Execute mutation
    mutate({ email })
  }

  return (
    <>
     
      
      <div className="h-screen flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            
            <div className="text-center space-y-2">
              <h1 className="text-[40px] font-semibold text-[#252525]">Forget Password</h1>
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
                  className="bg-[#E4F6FF] py-6 rounded-md border-none"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-11 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white font-medium"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Back to{" "}
              <Link href="/auth/login" className="text-[#23547B] font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section - Van Image */}
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



"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// 1. Define Types
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional if you handle confirm password separately
  pickupAddress: string;
}

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 2. Mutation Setup
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // 3. Form Submission Handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const payload: RegisterPayload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: password,
      pickupAddress: formData.get("pickupAddress") as string,
    };

    mutate(payload);
  };

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
      <div className="flex items-center justify-center bg-gray-50 px-6 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-4 py-8">
          <div className="text-center space-y-1">
            <p className="text-sm text-[#616161]">Welcome to Wellness Made Clear</p>
            <h1 className="text-3xl font-semibold text-[#131313]">Create  Account for User</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
      
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input name="firstName" id="firstName" required className="bg-[#E4F6FF] h-11 mt-1" placeholder="First name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input name="lastName" id="lastName" required className="bg-[#E4F6FF] h-11 mt-1" placeholder="Last name" />
              </div>
           

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input name="email" id="email" type="email" required className="bg-[#E4F6FF] h-11 mt-1" placeholder="Email" />
            </div>

            <div>
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Input name="pickupAddress" id="pickupAddress" type="text" required className="bg-[#E4F6FF] h-11 mt-1" placeholder="Pickup Address" />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  required
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
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  required
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

            <div className="flex items-start gap-2 text-sm">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the <Link href="/terms" className="text-[#8C311E] underline">terms & conditions</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isPending} 
              className="w-full h-11 bg-[#31B8FA] hover:bg-[#28a5e0] text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#23547B] font-medium">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
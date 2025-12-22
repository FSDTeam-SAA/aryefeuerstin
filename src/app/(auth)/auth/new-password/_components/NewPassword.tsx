
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Get email from URL params
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2. TanStack Query Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { email: string; newPassword: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reset password");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Password reset successful!", { id: "reset-toast" });
      // Redirect to login after success
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message, { id: "reset-toast" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (!email) {
      return toast.error("Email missing. Please restart the process.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    // Show loading toast
    toast.loading("Updating password...", { id: "reset-toast" });

    // 3. Execute Mutation
    mutate({
      email: email,
      newPassword: password,
    });
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      
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
                Please create your new password for <span className="font-medium text-black">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="bg-[#E4F6FF] py-6 pr-10 border-none"
                    required
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
                    className="bg-[#E4F6FF] py-6 pr-10 border-none"
                    required
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white font-medium text-lg"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Resetting Password...
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
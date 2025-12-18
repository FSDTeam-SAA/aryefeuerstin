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
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

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
            <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-3xl p-8 rounded-xl  space-y-6">

                    {/* Header */}
                    <div className="text-center font-medium text-[18px] space-y-1">
                        <h1 className="text-[40px] font-semibold  text-[#131313]">
                            Welcome Back!
                        </h1>
                        <p className="text-sm text-[#616161]">Enter to get unlimited data & information</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" type="email" className="bg-[#E4F6FF] py-6 mt-2" placeholder="Enter your email" />
                        </div>

                        {/* Password */}
                        <div>
                            <Label>Password *</Label>
                            <div className="relative">
                                <Input

                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className="bg-[#E4F6FF] py-6  mt-2"
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

                        {/* Terms */}
                        <div className="flex  items-center  justify-between">
                            <div className="flex items-start gap-2">
                                <Checkbox id="terms" className="mt-1" />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#8C311E] hover:underline">
                                        terms & conditions
                                    </Link>
                                </label>
                            </div>
                            <div>
                                <Link href="/auth/forgot-password" className="text-sm font-medium text-[#8C311ECC] hover:underline">
                                    Forget Password
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white"
                        >
                            Sign In
                        </Button>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-600">
                            Don’t have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="text-[#23547B] underline font-medium hover:underline"
                            >
                                Register Here
                            </Link>
                        </p>
                    </form>

                </div>
            </div>
        </div>
    )
}

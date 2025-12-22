// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { signIn } from "next-auth/react"
// import { toast, Toaster } from "sonner"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import Link from "next/link"
// import { Eye, EyeOff } from "lucide-react"
// import Image from "next/image"

// export default function SignInPage() {
//   const router = useRouter()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!email.trim()) return toast.error("Email is required")
//     if (!password.trim()) return toast.error("Password is required")

//     setLoading(true)

//     const toastId = toast.loading("Signing in...", {
//       duration: Infinity,
//     })

//     try {
//       const res = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//         callbackUrl: "/",
//       })

//       if (res?.error) {
//         toast.error("Invalid email or password", { id: toastId })
//         return
//       }

//       toast.success("Login successful!", {
//         id: toastId,
//         duration: 2000,
//       })

//       setTimeout(() => {
//         router.push(res?.url ?? "/")
//       }, 2100)

//     } catch (error) {
//       toast.error("Something went wrong. Try again.", {
//         id: toastId,
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Toaster position="top-right" />

//       <div className="h-screen grid grid-cols-1 lg:grid-cols-2">
//         {/* Left Image */}
//         <div className="hidden lg:block relative">
//           <Image
//             src="/delivery-van.png"
//             alt="Delivery van"
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>

//         {/* Right Form */}
//         <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
//           <div className="w-full max-w-3xl p-8 rounded-xl space-y-6">

//             {/* Header */}
//             <div className="text-center space-y-1">
//               <h1 className="text-[40px] font-semibold text-[#131313]">
//                 Welcome Back!
//               </h1>
//               <p className="text-sm text-[#616161]">
//                 Enter to get unlimited data & information
//               </p>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">

//               {/* Email */}
//               <div>
//                 <Label>Email *</Label>
//                 <Input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="bg-[#E4F6FF] py-6 mt-2"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <Label>Password *</Label>
//                 <div className="relative">
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="bg-[#E4F6FF] py-6 mt-2"
//                     placeholder="Enter password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Terms + Forgot */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-start gap-2">
//                   <Checkbox id="terms" className="mt-1" />
//                   <label htmlFor="terms" className="text-sm text-gray-600">
//                     I agree to the{" "}
//                     <Link href="/terms" className="text-[#8C311E] hover:underline">
//                       terms & conditions
//                     </Link>
//                   </label>
//                 </div>

//                 <Link
//                   href="/auth/forgot-password"
//                   className="text-sm font-medium text-[#8C311ECC] hover:underline"
//                 >
//                   Forget Password
//                 </Link>
//               </div>

//               {/* Button */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-11 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white"
//               >
//                 {loading ? "Signing in..." : "Sign In"}
//               </Button>

//               {/* Footer */}
//               <p className="text-center text-sm text-gray-600">
//                 Don’t have an account?{" "}
//                 <Link href="/auth" className="text-[#23547B] underline font-medium">
//                   Register Here
//                 </Link>
//               </p>

//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }



"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 1. Add state for the terms checkbox
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 2. Validation for Checkbox
    if (!agreed) {
      return toast.error("Please agree to the terms & conditions before signing in")
    }

    if (!email.trim()) return toast.error("Email is required")
    if (!password.trim()) return toast.error("Password is required")

    setLoading(true)

    const toastId = toast.loading("Signing in...", {
      duration: Infinity,
    })

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      })

      if (res?.error) {
        toast.error("Invalid email or password", { id: toastId })
        return
      }

      toast.success("Login successful!", {
        id: toastId,
        duration: 2000,
      })

      setTimeout(() => {
        router.push(res?.url ?? "/")
      }, 2100)

    } catch (error) {
      toast.error("Something went wrong. Try again." + error, {
        id: toastId,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Image */}
        <div className="hidden lg:block relative">
          <Image
            src="/delivery-van.png"
            alt="Delivery van"
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
                Welcome Back!
              </h1>
              <p className="text-sm text-[#616161]">
                Enter to get unlimited data & information
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#E4F6FF] py-6 mt-2 border-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#E4F6FF] py-6 mt-2 border-none"
                    placeholder="Enter password"
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

              {/* Terms + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  {/* 3. Bind state to Checkbox */}
                  <Checkbox 
                    id="terms" 
                    className="mt-1" 
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#8C311E] hover:underline">
                      terms & conditions
                    </Link>
                  </label>
                </div>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#8C311ECC] hover:underline"
                >
                  Forget Password
                </Link>
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Footer */}
              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link href="/auth" className="text-[#23547B] underline font-medium">
                  Register Here
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}
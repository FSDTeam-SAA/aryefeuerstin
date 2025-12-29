// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useSession } from "next-auth/react"
// import { useMutation } from "@tanstack/react-query"
// import { toast } from "sonner"
// import { Loader2 } from "lucide-react"

// export default function AccountsPage() {
//   const { data: session } = useSession()
//   const token = session?.accessToken

//   // Form State
//   const [formData, setFormData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   // TanStack Mutation
//   const mutation = useMutation({
//     mutationFn: async (passwordData: typeof formData) => {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           oldPassword: passwordData.oldPassword,
//           newPassword: passwordData.newPassword,
//         }),
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.message || "Something went wrong")
//       }

//       return result
//     },
//     onSuccess: () => {
//       toast.success("Password changed successfully!")
//       setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })
//     },
//     onError: (error: Error) => {
//       toast.error(error.message)
//     },
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   const handleSubmit = () => {
//     // Basic Validation
//     if (!formData.oldPassword || !formData.newPassword) {
//       toast.error("Please fill in all fields")
//       return
//     }
//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("New passwords do not match")
//       return
//     }
//     if (formData.newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters")
//       return
//     }

//     mutation.mutate(formData)
//   }

//   return (
//     <div className="px-4 py-6 sm:px-6 md:px-8">
//       <div className="mx-auto w-full max-w-3xl">
//         {/* Page Title */}
//         <h1 className="text-center text-2xl font-semibold text-[#131313] sm:text-3xl md:text-[40px]">
//           Accounts
//         </h1>

//         {/* Save Button (Desktop / Tablet) */}
//         <div className="mt-6 mb-8 hidden justify-end md:flex">
//           <Button 
//             onClick={handleSubmit}
//             disabled={mutation.isPending}
//             className="h-[48px] bg-[#31B8FA] px-[60px] text-white hover:bg-[#31B8FA]/90"
//           >
//             {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
//           </Button>
//         </div>

//         {/* Card */}
//         <Card className="border-none p-4 shadow-none sm:p-6 md:p-8">
//           <h2 className="mb-5 text-xl font-semibold text-[#131313] sm:text-2xl">
//             Change password
//           </h2>

//           <div className="space-y-5">
//             {/* Current Password */}
//             <div>
//               <Label
//                 htmlFor="oldPassword"
//                 className="mb-2 block text-sm font-medium text-[#131313] sm:text-base"
//               >
//                 Current Password
//               </Label>
//               <Input
//                 id="oldPassword"
//                 type="password"
//                 placeholder="#############"
//                 value={formData.oldPassword}
//                 onChange={handleChange}
//                 className="h-11 border-gray-300 focus:border-[#31B8FA] focus:ring-0"
//               />
//             </div>

//             {/* New & Confirm Password */}
//             <div className="grid gap-5 md:grid-cols-2">
//               <div>
//                 <Label
//                   htmlFor="newPassword"
//                   className="mb-2 block text-sm font-medium text-[#131313] sm:text-base"
//                 >
//                   New Password
//                 </Label>
//                 <Input
//                   id="newPassword"
//                   type="password"
//                   placeholder="#############"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   className="h-11 border-gray-300 focus:border-[#31B8FA] focus:ring-0"
//                 />
//               </div>

//               <div>
//                 <Label
//                   htmlFor="confirmPassword"
//                   className="mb-2 block text-sm font-medium text-[#131313] sm:text-base"
//                 >
//                   Confirm New Password
//                 </Label>
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="#############"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="h-11 border-gray-300 focus:border-[#31B8FA] focus:ring-0"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Save Button (Mobile Only) */}
//           <div className="mt-8 md:hidden">
//             <Button 
//               onClick={handleSubmit}
//               disabled={mutation.isPending}
//               className="h-[48px] w-full bg-[#31B8FA] text-white hover:bg-[#31B8FA]/90"
//             >
//               {mutation.isPending ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function AccountsPage() {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 👁 show / hide states
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const mutation = useMutation({
    mutationFn: async (passwordData: typeof formData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      )

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Something went wrong")
      return result
    },
    onSuccess: () => {
      toast.success("Password changed successfully!")
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!formData.oldPassword || !formData.newPassword) {
      toast.error("Please fill in all fields")
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    mutation.mutate(formData)
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-center text-2xl font-semibold text-[#131313] sm:text-3xl md:text-[40px]">
          Accounts
        </h1>

        <div className="mt-6 mb-8 hidden justify-end md:flex">
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="h-[48px] bg-[#31B8FA] px-[60px] text-white hover:bg-[#31B8FA]/90"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>

        <Card className="border-none p-4 shadow-none sm:p-6 md:p-8">
          <h2 className="mb-5 text-xl font-semibold text-[#131313] sm:text-2xl">
            Change password
          </h2>

          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <Label className="mb-2 block">Current Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  placeholder="*****"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* New Password */}
              <div>
                <Label className="mb-2 block">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    placeholder="*****"
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="mb-2 block">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="*****"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 md:hidden">
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="h-[48px] w-full bg-[#31B8FA] text-white"
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

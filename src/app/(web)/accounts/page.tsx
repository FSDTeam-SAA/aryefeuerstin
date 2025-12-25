

"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Internal Components & Types
import { UpdateProfilePayload, UserProfileResponse } from "./_components/type"
import { ProfileSkeleton } from "./_components/ProfileSkeleton"

export default function ProfilePage() {
  const { data: session } = useSession()
  const token = session?.accessToken
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    pickupAddress: "",
    profileImage: "/professional-woman-portrait.png"
  })
  
  const [isChanged, setIsChanged] = useState(false)

  // 1. FETCH DATA
  const { data, isLoading } = useQuery<UserProfileResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch profile")
      return res.json()
    },
    enabled: !!token,
  })

  // 2. UPDATE TEXT DATA MUTATION
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!")
      setIsChanged(false)
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
    onError: () => toast.error("Update failed. Please try again."),
  })

  // 3. IMAGE UPLOAD MUTATION
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData()
      body.append("profileImage", file)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/upload-avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: body,
      })
      if (!res.ok) throw new Error("Failed to upload image")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Profile image updated!")
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
    onError: () => toast.error("Image upload failed."),
  })

  // Sync API data to Form State
  useEffect(() => {
    if (data?.data?.user) {
      const user = data.data.user
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        pickupAddress: user.pickupAddress || "",
        profileImage: user.profileImage || "/professional-woman-portrait.png"
      })
    }
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setIsChanged(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Local preview (Optimistic)
    setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(file) }))
    
    // Trigger API
    uploadAvatarMutation.mutate(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      pickupAddress: formData.pickupAddress,
    })
  }

  if (isLoading) return <ProfileSkeleton />

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Card className="border-none shadow-none p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            
            {/* LEFT SIDE: Image Upload */}
            <div className="flex shrink-0 flex-col items-center gap-4 w-full lg:w-auto">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-200">
                <Image
                  src={formData.profileImage}
                  alt="Profile"
                  fill
                  className={`object-cover ${uploadAvatarMutation.isPending ? "opacity-50" : ""}`}
                />
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadAvatarMutation.isPending}
                  className="w-full border-[#33B8FF] text-[#33B8FF] hover:bg-blue-50 bg-transparent h-[44px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadAvatarMutation.isPending ? "Uploading..." : "Upload Image"}
                </Button>
                <Link href="/change-password">
                  <Button variant="outline" className="w-full border-[#33B8FF] text-[#33B8FF] bg-transparent h-[44px]">
                    Change Password
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="flex-1">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-[#131313]">Profile Settings</h1>
                <span className="w-fit rounded-lg border-2 border-[#31B8FA] bg-white px-3 py-1.5 text-sm sm:text-base font-medium text-[#31B8FA]">
                  Total Returns: {data?.data?.totalPackages?.toString().padStart(2, '0') || "00"}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <Label className="mb-1.5 block text-sm sm:text-base">First Name <span className="text-[#8C311E]">*</span></Label>
                  <Input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleInputChange} 
                    placeholder="Enter your first name"
                    className="h-[48px]" 
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm sm:text-base">Last Name <span className="text-[#8C311E]">*</span></Label>
                  <Input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    placeholder="Enter your last name"
                    className="h-[48px]" 
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block text-sm sm:text-base text-gray-400">Email (Read Only)</Label>
                    <Input 
                      value={data?.data?.user?.email || ""} 
                      readOnly 
                      className="h-[48px] bg-gray-50 cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm sm:text-base">Phone No <span className="text-[#8C311E]">*</span></Label>
                    <Input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="Enter your phone number"
                      className="h-[48px]" 
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm sm:text-base">Pickup Address <span className="text-[#8C311E]">*</span></Label>
                  <Input 
                    name="pickupAddress" 
                    value={formData.pickupAddress} 
                    onChange={handleInputChange} 
                    placeholder="Enter your address"
                    className="h-[48px]" 
                  />
                </div>

                {/* Submit Button */}
                <div className="sticky bottom-0 bg-[#F9FAFB] pt-4 sm:static sm:bg-transparent">
                  <Button 
                    type="submit"
                    disabled={!isChanged || updateProfileMutation.isPending}
                    className={`h-12 w-full rounded-full text-white text-base font-semibold transition-all ${
                      isChanged && !updateProfileMutation.isPending 
                        ? "bg-[#31B8FA] hover:bg-[#2aa5e0]" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </Card>
      </div>
    </div>
  )
}
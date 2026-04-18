import Image from "next/image"
import type React from "react"
interface AuthLayoutProps {
  children: React.ReactNode
  showImage?: boolean
}

export function AuthLayout({ children, showImage = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">{children}</div>

      {/* Image Section */}
      {showImage && (
        <div className="hidden lg:flex flex-1 relative">
          <Image width={500} height={500} src="/delivery-van-parked-in-front-of-suburban-house.jpg" alt="Ez Returns Delivery Van" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
    </div>
  )
}

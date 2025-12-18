import Link from "next/link"
import { Button } from "@/components/ui/button"

import { EzReturnsLogo } from "../_components/ez-returns-logo"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Dark with wood texture */}
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/authbg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl text-[#FFFFFF] font-bold mb-2">Welcome!</h1>
          <p className="text-[#FFFFFF] mb-8 font-normal text-2xl">Hi user login</p>
          <EzReturnsLogo />
          <div className="flex gap-4  justify-center">
            <Button asChild className="border-[#D7A748] border bg-transparent text-white px-8">
              <Link href="/auth/login">Driver Login </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#D7A748] border bg-[#D7A748] px-8 "
            >
              <Link href="/auth/login">User Register </Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

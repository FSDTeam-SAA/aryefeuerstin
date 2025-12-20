"use client"

import { useState } from "react"
import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"  


const menuItems = [
  { name: "Personal", hasDropdown: true, href: "/personal" },
  { name: "Driver", hasDropdown: true, href: "/driver" },
  { name: "Company", hasDropdown: true, href: "/company" },
//   { name: "Login", hasDropdown: false, href: "/login" },
  { name: "Join Now", hasDropdown: false, isButton: true, href: "/join-now" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
          <div className="w-[120px] h-[75px]">
            <Image
              src="/logo.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.isButton ? (
                  <Button
                    asChild
                    className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-10 h-[48px]"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ) : (
                  <button className="flex items-center gap-1 text-xl font-medium text-[#131313] hover:text-[#131313]/90">
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu - Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-8">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through our services
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-6">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.isButton ? (
                      <Button
                        asChild
                        className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full w-full mt-4"
                        onClick={() => setOpen(false)}
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    ) : (
                      <button
                        className="flex items-center justify-between text-lg text-gray-700 hover:text-gray-900 w-full"
                        onClick={() => setOpen(false)}
                      >
                        <Link href={item.href}>{item.name}</Link>
                        {item.hasDropdown && <ChevronDown className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
"use client"
import { useState } from "react"
import { ChevronDown, Menu, User, Package, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
// import { useSession } from "next-auth/react"

const menuItems = [
  { name: "Personal", hasDropdown: true, href: "/personal" },
  { name: "Driver", hasDropdown: true, href: "/driver" },
  { name: "Company", hasDropdown: true, href: "/company" },
  { name: "Join Now", hasDropdown: false, isButton: true, href: "/join-now" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  // const sesseion=useSession()
  // const user=sesseion
  // console.log(user)

  // Sub-component for the Profile Dropdown (Desktop Only)
  const UserProfileDesktop = () => (
    <div className="hidden md:block ml-2  pl-4 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 outline-none focus-visible:ring-0">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src="/avatar-placeholder.png" alt="User" />
              <AvatarFallback className="bg-[#31B8FA] text-white">DH</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Daniel Hart</p>
              <p className="text-xs leading-none text-muted-foreground">daniel@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/accounts" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/order-requests" className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              <span>Order Requests</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto  py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="w-[100px] h-[60px] md:w-[125px] md:h-[75px]">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={75}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.isButton ? (
                  <Button
                    asChild
                    className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full px-8 h-[44px] transition-all"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ) : (
                  <Link 
                    href={item.href}
                    className="flex items-center gap-1 text-base lg:text-lg font-medium text-[#131313] hover:text-[#31B8FA] transition-colors"
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                )}
              </div>
            ))}
            <UserProfileDesktop />
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="w-7 h-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col">
                <SheetHeader className="text-left mb-4">
                  <SheetTitle className="text-[#31B8FA] font-bold">Navigation</SheetTitle>
                  <SheetDescription>Explore our services and manage your profile</SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col gap-2 flex-grow">
                  {menuItems.map((item) => (
                    <div key={item.name} className="border-b border-gray-50 last:border-none">
                      {item.isButton ? (
                        <Button
                          asChild
                          className="bg-[#31B8FA] hover:bg-[#2BA5D6] text-white rounded-full w-full mt-4"
                          onClick={() => setOpen(false)}
                        >
                          <Link href={item.href}>{item.name}</Link>
                        </Button>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center justify-between py-4 text-lg font-semibold text-gray-800 active:text-[#31B8FA]"
                          onClick={() => setOpen(false)}
                        >
                          <span>{item.name}</span>
                          {item.hasDropdown && <ChevronDown className="w-5 h-5 opacity-40" />}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Profile Section (At the bottom of Sheet) */}
                <div className="mt-auto border-t pt-6 pb-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-12 w-12 border border-gray-100">
                      <AvatarImage src="/avatar-placeholder.png" alt="User" />
                      <AvatarFallback className="bg-[#31B8FA] text-white">DH</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-gray-900">Daniel Hart</p>
                      <p className="text-xs text-gray-500">daniel@example.com</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Link 
                      href="/accounts" 
                      className="flex items-center gap-3 text-gray-700 font-medium hover:text-[#31B8FA]" 
                      onClick={() => setOpen(false)}
                    >
                      <User className="h-5 w-5 text-gray-400" /> Account
                    </Link>
                    <Link 
                      href="/order-requests" 
                      className="flex items-center gap-3 text-gray-700 font-medium hover:text-[#31B8FA]" 
                      onClick={() => setOpen(false)}
                    >
                      <Package className="h-5 w-5 text-gray-400" /> Order Requests
                    </Link>
                    <button className="flex items-center gap-3 text-red-500 font-bold pt-2">
                      <LogOut className="h-5 w-5" /> Log out
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
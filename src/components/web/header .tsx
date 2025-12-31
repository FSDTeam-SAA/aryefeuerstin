"use client"

import { useState } from "react"
import {
  Menu,
  User,
  Package,
  LogOut,
  RotateCcw,
  Check,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
]

const fetchUserProfile = async (token: string | undefined) => {
  if (!token) throw new Error("No access token")

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return res.json()
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined
  const role = session?.user?.role as "USER" | "DRIVER" | "ADMIN" | undefined

  const [open, setOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  const { data: profileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token && !!session,
    select: (data) => data?.data?.user,
    staleTime: 5 * 60 * 1000,
  })

  const profileImage = profileData?.profileImage
  const firstName = profileData?.firstName || "User"
  const hasActiveSubscription = profileData?.hasActiveSubscription ?? false

  // Generate initials: First 2 letters of firstName (uppercase)
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US"
  }

  const initials = getInitials(firstName)

  const isActive = (href: string) => pathname === href

  const handleReturnPackageClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (role === "USER" && !hasActiveSubscription) {
      toast.error("You need an active subscription to return a package.")
      return
    }

    router.push("/return-package")
    setOpen(false)
  }

  const DesktopAvatar = () => {
    if (!session) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
            <Avatar className="h-12 w-12 border">
              {/* Only show image if profileImage exists and is not empty */}
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-[#31B8FA] text-white font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {role === "ADMIN" && (
            <>
              <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLogoutModal(true)}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </>
          )}

          {role !== "ADMIN" && (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/accounts">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </DropdownMenuItem>

              {role === "USER" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/user/order-request">
                      <Package className="mr-2 h-4 w-4" />
                      Order History
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleReturnPackageClick}
                    className="cursor-pointer"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Return Package
                  </DropdownMenuItem>
                </>
              )}

              {role === "DRIVER" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/driver/order-history">
                      <Package className="mr-2 h-4 w-4" />
                      Active Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/driver/driver-order-request">
                      <Check className="mr-2 h-4 w-4" />
                      Completed Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/driver/work-sation">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Work Hours
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLogoutModal(true)}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto py-2 flex items-center justify-between">
          <Link href="/">
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
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium text-base transition-colors ${
                  isActive(item.href)
                    ? "text-[#31B8FA]"
                    : "text-foreground hover:text-[#31B8FA]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {!session ? (
              <Button
                asChild
                size="lg"
                className="bg-[#31B8FA] rounded-full px-12 h-[48px] hover:bg-[#31B8FA]/90"
              >
                <Link href="/auth/login">Join Now</Link>
              </Button>
            ) : (
              <DesktopAvatar />
            )}
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Main Navigation */}
                  <nav className="flex flex-col gap-6 mt-10">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`text-xl font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-[#31B8FA]"
                            : "text-foreground hover:text-[#31B8FA]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {!session && (
                      <Button
                        asChild
                        size="lg"
                        className="bg-[#31B8FA] rounded-full mt-4"
                        onClick={() => setOpen(false)}
                      >
                        <Link href="/auth/login">Join Now</Link>
                      </Button>
                    )}
                  </nav>

                  {/* Logged In User Section */}
                  {session && (
                    <div className="mt-auto border-t pt-8 space-y-5 pb-8">
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          My Account
                        </p>

                        <Link
                          href="/accounts"
                          onClick={() => setOpen(false)}
                          className="block text-lg font-medium hover:text-[#31B8FA] transition"
                        >
                          Account Settings
                        </Link>

                        {role === "USER" && (
                          <>
                            <Link
                              href="/user/order-request"
                              onClick={() => setOpen(false)}
                              className="block text-lg font-medium hover:text-[#31B8FA] transition"
                            >
                              Order History
                            </Link>

                            <button
                              onClick={handleReturnPackageClick}
                              className={`text-lg font-medium text-left w-full transition ${
                                !hasActiveSubscription
                                  ? "text-muted-foreground"
                                  : "hover:text-[#31B8FA]"
                              }`}
                              disabled={role === "USER" && !hasActiveSubscription}
                            >
                              Return Package
                              {!hasActiveSubscription && role === "USER" && (
                                <p className="text-sm text-red-500 mt-1">
                                  Active subscription required
                                </p>
                              )}
                            </button>
                          </>
                        )}

                        {role === "DRIVER" && (
                          <>
                            <Link
                              href="/driver/order-history"
                              onClick={() => setOpen(false)}
                              className="block text-lg font-medium hover:text-[#31B8FA] transition"
                            >
                              Active Orders
                            </Link>
                            <Link
                              href="/driver/driver-order-request"
                              onClick={() => setOpen(false)}
                              className="block text-lg font-medium hover:text-[#31B8FA] transition"
                            >
                              Completed Orders
                            </Link>
                            <Link
                              href="/driver/work-sation"
                              onClick={() => setOpen(false)}
                              className="block text-lg font-medium hover:text-[#31B8FA] transition"
                            >
                              Work Hours
                            </Link>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setLogoutModal(true)
                          setOpen(false)
                        }}
                        className="text-lg font-medium text-red-600 hover:text-red-700 transition w-full text-left"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutModal} onOpenChange={setLogoutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
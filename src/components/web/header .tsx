// "use client"

// import { useState } from "react"
// import {
//   Menu,
//   User,
//   Package,
//   LogOut,
//   RotateCcw,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useSession, signOut } from "next-auth/react"

// const menuItems = [
//   { name: "Home", href: "/" },
//   { name: "About Us", href: "/about-us" },
//   { name: "Contact Us", href: "/contact-us" },
// ]

// export default function Header() {
//   const pathname = usePathname()
//   const { data: session } = useSession()
//   const role = session?.user?.role // USER | DRIVER | ADMIN
//   const [open, setOpen] = useState(false)
//   const [logoutModal, setLogoutModal] = useState(false)

//   const isActive = (href: string) => pathname === href

//   /* ================= DESKTOP AVATAR ================= */
//   const DesktopAvatar = () => {
//     if (!session) return null

//     // ADMIN → only avatar
//     if (role === "ADMIN") {
//       return (
//         <Avatar className="h-10 w-10 border ml-4">
//           <AvatarImage src="/avatar-placeholder.png" />
//           <AvatarFallback className="bg-[#31B8FA] text-white">
//             AD
//           </AvatarFallback>
//         </Avatar>
//       )
//     }

//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
//             <Avatar className="h-10 w-10 border">
//               <AvatarImage src="/avatar-placeholder.png" />
//               <AvatarFallback className="bg-[#31B8FA] text-white">
//                 {role === "DRIVER" ? "DR" : "US"}
//               </AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-56">
//           <DropdownMenuLabel>My Account</DropdownMenuLabel>
//           <DropdownMenuSeparator />

//           <DropdownMenuItem asChild>
//             <Link href="/accounts">
//               <User className="mr-2 h-4 w-4" /> Account
//             </Link>
//           </DropdownMenuItem>

//           {/* USER OPTIONS */}
//           {role === "USER" && (
//             <>
//               <DropdownMenuItem asChild>
//                 <Link href="/user/order-request">
//                   <Package className="mr-2 h-4 w-4" /> Order History
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild>
//                 <Link href="/join-now">
//                   <RotateCcw className="mr-2 h-4 w-4" /> Return Package
//                 </Link>
//               </DropdownMenuItem>
//             </>
//           )}

//           {/* DRIVER OPTIONS */}
//           {role === "DRIVER" && (
//             <>
//               <DropdownMenuItem asChild>
//                 <Link href="/driver/order-history">
//                   <Package className="mr-2 h-4 w-4" /> Driver Orders
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/driver/driver-order-request">
//                   <Package className="mr-2 h-4 w-4" /> Order Requests
//                 </Link>
//               </DropdownMenuItem>
//             </>
//           )}

       

//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             onClick={() => setLogoutModal(true)}
//             className="text-red-600 cursor-pointer"
//           >
//             <LogOut className="mr-2 h-4 w-4" /> Log out
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     )
//   }

//   return (
//     <>
//       {/* ================= HEADER ================= */}
//       <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
//         <div className="container mx-auto py-2 flex items-center justify-between">
//           <Link href="/">
//             <div className="w-[100px] h-[60px] md:w-[125px] md:h-[75px]">
//               <Image
//                 src="/logo.png"
//                 alt="Logo"
//                 width={120}
//                 height={75}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </Link>

//           {/* DESKTOP NAV */}
//           <nav className="hidden md:flex items-center gap-6">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`font-medium ${
//                   isActive(item.href)
//                     ? "text-[#31B8FA]"
//                     : "hover:text-[#31B8FA]"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {/* Join Now → only when NOT logged in */}
//             {!session && (
//               <Button asChild className="bg-[#31B8FA] h-[50px] px-10 hover:bg-[#31B8FA]/90 rounded-full">
//                 <Link href="/auth/login">Join Now</Link>
//               </Button>
//             )}

//             <DesktopAvatar />
//           </nav>

//           {/* MOBILE */}
//           <div className="md:hidden">
//             <Sheet open={open} onOpenChange={setOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="ghost">
//                   <Menu />
//                 </Button>
//               </SheetTrigger>

//               <SheetContent side="right" className="flex flex-col">
//                 <nav className="flex flex-col gap-4">
//                   {menuItems.map((item) => (
//                     <Link
//                       key={item.name}
//                       href={item.href}
//                       onClick={() => setOpen(false)}
//                     >
//                       {item.name}
//                     </Link>
//                   ))}

//                   {!session && (
//                     <Link href="/auth/login">Join Now</Link>
//                   )}
//                 </nav>

//                 {/* MOBILE PROFILE */}
//                 {session && role !== "ADMIN" && (
//                   <div className="mt-auto border-t pt-6 space-y-4">
//                     <Link href="/accounts">Account</Link>

//                     {role === "USER" && (
//                       <>
//                         <Link href="/user/order-request">Order History</Link>
//                         <Link href="/return-package">Return Package</Link>
//                       </>
//                     )}

//                     {role === "DRIVER" && (
//                       <>
//                         <Link href="/driver/order-history">
//                           Driver Orders
//                         </Link>
//                         <Link href="/driver/order-requests">
//                           Order Requests
//                         </Link>
//                       </>
//                     )}

//                     <button
//                       onClick={() => setLogoutModal(true)}
//                       className="text-red-500 font-bold"
//                     >
//                       Log out
//                     </button>
//                   </div>
//                 )}
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </header>

//       {/* ================= LOGOUT CONFIRM MODAL ================= */}
//       <AlertDialog open={logoutModal} onOpenChange={setLogoutModal}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               Are you sure you want to logout?
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               You will be logged out from your account.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>No</AlertDialogCancel>
//             <AlertDialogAction onClick={() => signOut()} className="bg-red-600 hover:bg-red-700">
//               Yes, Logout
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   )
// }




"use client"

import { useState } from "react"
import {
  Menu,
  User,
  Package,
  LogOut,
  RotateCcw,
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
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
]

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role // USER | DRIVER | ADMIN
  const [open, setOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  const isActive = (href: string) => pathname === href

  /* ================= DESKTOP AVATAR ================= */
  const DesktopAvatar = () => {
    if (!session) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-[#31B8FA] text-white">
                {role === "ADMIN" ? "AD" : role === "DRIVER" ? "DR" : "US"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* ================= ADMIN ================= */}
          {role === "ADMIN" && (
            <>
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
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

          {/* ================= USER / DRIVER ================= */}
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

              {/* USER */}
              {role === "USER" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/user/order-request">
                      <Package className="mr-2 h-4 w-4" />
                      Order History
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/return-package">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Return Package
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              {/* DRIVER */}
              {role === "DRIVER" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/driver/order-history">
                      <Package className="mr-2 h-4 w-4" />
                      Driver Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/driver/driver-order-request">
                      <Package className="mr-2 h-4 w-4" />
                      Order Requests
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
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto py-2 flex items-center justify-between">
          {/* LOGO */}
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

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium ${
                  isActive(item.href)
                    ? "text-[#31B8FA]"
                    : "hover:text-[#31B8FA]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Join Now only if NOT logged in */}
            {!session && (
              <Button
                asChild
                className="bg-[#31B8FA] h-[50px] px-10 rounded-full hover:bg-[#31B8FA]/90"
              >
                <Link href="/auth/login">Join Now</Link>
              </Button>
            )}

            <DesktopAvatar />
          </nav>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex flex-col">
                <nav className="flex flex-col gap-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {!session && (
                    <Link href="/auth/login">Join Now</Link>
                  )}
                </nav>

                {/* MOBILE PROFILE */}
                {session && (
                  <div className="mt-auto border-t pt-6 space-y-4">
                    {role !== "ADMIN" && (
                      <>
                        <Link href="/accounts">Account</Link>

                        {role === "USER" && (
                          <>
                            <Link href="/user/order-request">
                              Order History
                            </Link>
                            <Link href="/return-package">
                              Return Package
                            </Link>
                          </>
                        )}

                        {role === "DRIVER" && (
                          <>
                            <Link href="/driver/order-history">
                              Driver Orders
                            </Link>
                            <Link href="/driver/driver-order-request">
                              Order Requests
                            </Link>
                          </>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => setLogoutModal(true)}
                      className="text-red-500 font-bold"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ================= LOGOUT CONFIRM MODAL ================= */}
      <AlertDialog open={logoutModal} onOpenChange={setLogoutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut()}
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

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ez Returns - Return Service",
  description: "Easy and hassle-free return service for your packages",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
   <div>
     {children}
   </div>
  )
}

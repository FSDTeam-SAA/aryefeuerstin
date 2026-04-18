import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const authSecret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: authSecret })
  const pathname = req.nextUrl.pathname

  // ❌ Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = token.role as string

  // ❌ Only USER & DRIVER can login
  if (role !== "USER" && role !== "DRIVER") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  /**
   * USER ROUTES
   */
  if (role === "USER") {
    if (pathname.startsWith("/return-package")) {
      return NextResponse.next()
    }

    // ❌ USER trying other routes
    return NextResponse.redirect(new URL("/", req.url))
  }

  /**
   * DRIVER ROUTES
   */
  if (role === "DRIVER") {
    if (
      pathname.startsWith("/driver/order-history") ||
      pathname.startsWith("/driver/work-sation")||
      pathname.startsWith("/driver/order-details")||
      pathname.startsWith("/driver/driver-order-request")
    ) {
      return NextResponse.next()
    }

    // ❌ DRIVER trying other routes
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

/**
 * Protect only these routes
 */
export const config = {
  matcher: [
    "/return-package/:path*",
    "/driver/:path*",
  ],
}

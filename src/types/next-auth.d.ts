import  { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      userId: string
      email: string
      role: string
      firstName?: string
      lastName?: string
      profileImage?: string
    }
    accessToken: string
  }

  interface User {
    id: string
    email: string
    role: string
    firstName?: string
    lastName?: string
    profileImage?: string
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    email: string
    role: string
    firstName?: string
    lastName?: string
    profileImage?: string
    accessToken: string
  }
}

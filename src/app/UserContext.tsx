

/*eslint-disable */
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Type definition for the context value
type UserContextType = {
  user: any                  
  profileImage: string | null
  hasActiveSubscription: boolean
  totalPackages: number
  setProfileData: (data: any) => void  
  clearProfileData: () => void          
}

const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [totalPackages, setTotalPackages] = useState(0)

  // Save the full response from /user/me API into context
  const setProfileData = (apiResponse: any) => {
    const userData = apiResponse?.data?.user
    const packagesCount = apiResponse?.data?.totalPackages || 0

    setUser(userData || null)
    setProfileImage(userData?.profileImage || null)
    setHasActiveSubscription(userData?.hasActiveSubscription ?? false)
    setTotalPackages(packagesCount)
  }

  // Clear all data when user logs out
  const clearProfileData = () => {
    setUser(null)
    setProfileImage(null)
    setHasActiveSubscription(false)
    setTotalPackages(0)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profileImage,
        hasActiveSubscription,
        totalPackages,
        setProfileData,
        clearProfileData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the context anywhere
export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider")
  }
  return context
}
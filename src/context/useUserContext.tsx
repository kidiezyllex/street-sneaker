"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"

import { clearToken, setTokenToLocalStorage } from "@/helper/tokenStorage"
import { useUserProfile } from "@/hooks/account"
import { IAccountResponse } from "@/interface/response/account"
import { useRouter } from "next/navigation"
import cookies from "js-cookie"

type UserContextType = {
  user: null | Record<string, any>
  profile: IAccountResponse | null
  loginUser: (userInfo: any, token: string) => void
  logoutUser: () => void
  fetchUserProfile: () => Promise<void>
  isLoadingProfile: boolean
  isAuthenticated: boolean
  updateUserProfile?: (data: any) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: profileData, refetch: refetchProfile, isLoading: isProfileLoading } = useUserProfile()
  const [user, setUser] = useState<null | Record<string, any>>(null)
  const [profile, setProfile] = useState<IAccountResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)
  const lastProfileDataStringRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const setCookie = (name: string, value: string, days = 30) => {
    if (typeof window === "undefined") return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const deleteCookie = (name: string) => {
    if (typeof window === "undefined") return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }

  const loginUser = (userInfo: any, token: string) => {
    setUser(userInfo)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token)
      localStorage.setItem("token", JSON.stringify({ token }))
    }
    cookies.set("accessToken", token, { expires: 7 })
    setTokenToLocalStorage(token)
    fetchUserProfile()
  }

  const updateUserProfile = (data: any) => {
    if (profile && profile.data) {
      const updatedProfile = {
        ...profile,
        data: {
          ...profile.data,
          ...data
        }
      };
      setProfile(updatedProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      }
    }
  }

  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true)
      await refetchProfile()
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
      }
    }
  }, [])

  useEffect(() => {
    const currentProfileDataString = profileData ? JSON.stringify(profileData) : null;
    console.log("UserProfileContext: useEffect for profileData triggered. Current profileData string:", currentProfileDataString);

    if (currentProfileDataString !== lastProfileDataStringRef.current) {
      if (profileData) {
        console.log("UserProfileContext: profileData has changed (or was initially set). Updating profile state and localStorage.");
        setProfile(profileData);
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", currentProfileDataString!);
        }
      } else {
        console.log("UserProfileContext: profileData is now falsy and has changed. Clearing profile state and localStorage.");
        setProfile(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("userProfile");
        }
      }
      lastProfileDataStringRef.current = currentProfileDataString;
    } else {
      console.log("UserProfileContext: profileData string has NOT changed. Skipping state update.");
    }
  }, [profileData])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user])

  const logoutUser = () => {
    clearToken()
    setUser(null)
    setProfile(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("token")
    }
    cookies.remove("accessToken")
    router.push("/sign-in")
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loginUser,
        logoutUser,
        fetchUserProfile,
        isLoadingProfile: isProfileLoading || isLoadingProfile,
        isAuthenticated: !!user || !!profile,
        updateUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}


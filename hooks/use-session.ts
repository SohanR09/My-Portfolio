"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"

interface UseSessionOptions {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useSession(options: UseSessionOptions = {}) {
  const { redirectTo = "/admin/login", redirectIfFound = false } = options
  const { user, isLoading } = useAuth()
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null)
  const [isSessionChecked, setIsSessionChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Skip if still loading or if we've already checked the session
    if (isLoading || isSessionChecked) return

    const checkSession = async () => {
      try {
        // Check localStorage for session
        const storedSession = localStorage.getItem("supabase.auth.token")

        if (!storedSession) {
          setIsSessionValid(false)
          if (!redirectIfFound) {
            router.push(redirectTo)
          }
          return
        }

        try {
          const parsedSession = JSON.parse(storedSession)
          const expiresAt = new Date(parsedSession.expires_at * 1000)
          const now = new Date()

          const isValid = expiresAt > now
          setIsSessionValid(isValid)

          // Handle redirects based on session validity
          if (!isValid && !redirectIfFound) {
            // Session expired, redirect to login
            localStorage.removeItem("supabase.auth.token")
            router.push(redirectTo)
          } else if (isValid && redirectIfFound) {
            // Valid session found, redirect away from login
            router.push("/admin")
          }
        } catch (err) {
          console.error("Error parsing stored session:", err)
          localStorage.removeItem("supabase.auth.token")
          setIsSessionValid(false)
          if (!redirectIfFound) {
            router.push(redirectTo)
          }
        }
      } finally {
        setIsSessionChecked(true)
      }
    }

    checkSession()
  }, [isLoading, user, router, redirectTo, redirectIfFound, isSessionChecked])

  // Function to check if session is about to expire (within 5 minutes)
  const isSessionExpiringSoon = (): boolean => {
    try {
      const storedSession = localStorage.getItem("supabase.auth.token")
      if (!storedSession) return true

      const parsedSession = JSON.parse(storedSession)
      const expiresAt = new Date(parsedSession.expires_at * 1000)
      const now = new Date()

      // Check if session expires within 5 minutes
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)
      return expiresAt <= fiveMinutesFromNow
    } catch (err) {
      console.error("Error checking if session is expiring soon:", err)
      return true
    }
  }

  return {
    isSessionValid,
    isSessionChecked,
    isSessionExpiringSoon,
    isLoading: isLoading || !isSessionChecked,
    user,
  }
}


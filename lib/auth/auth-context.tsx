"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { User, AuthError, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error fetching session:", error)
        } else {
          // Check if session exists and is not expired
          if (session) {
            const expiresAt = new Date(session.expires_at * 1000)
            const now = new Date()

            if (expiresAt <= now) {
              // Session has expired, sign out
              console.log("Session expired, signing out")
              await supabase.auth.signOut()
              setSession(null)
              setUser(null)
              localStorage.removeItem("supabase.auth.token")
            } else {
              setSession(session)
              setUser(session.user)

              // Store session in localStorage with proper format
              // Make sure we're storing the full session object
              localStorage.setItem(
                "supabase.auth.token",
                JSON.stringify({
                  ...session,
                  expires_at: session.expires_at,
                }),
              )
            }
          } else {
            // Try to recover session from localStorage
            const storedSession = localStorage.getItem("supabase.auth.token")
            if (storedSession) {
              try {
                const parsedSession = JSON.parse(storedSession)
                const expiresAt = new Date(parsedSession.expires_at * 1000)
                const now = new Date()

                if (expiresAt > now) {
                  // Session is still valid
                  setSession(parsedSession)
                  setUser(parsedSession.user)
                } else {
                  // Session has expired, remove it
                  localStorage.removeItem("supabase.auth.token")
                }
              } catch (err) {
                console.error("Error parsing stored session:", err)
                localStorage.removeItem("supabase.auth.token")
              }
            } else {
              setSession(null)
              setUser(null)
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch session:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)

      if (session) {
        localStorage.setItem("supabase.auth.token", JSON.stringify(session))
      } else {
        localStorage.removeItem("supabase.auth.token")
      }

      setIsLoading(false)
    })

    // Set up a timer to check session expiry every minute
    const checkSessionInterval = setInterval(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const expiresAt = new Date(session.expires_at * 1000)
          const now = new Date()

          if (expiresAt <= now) {
            // Session has expired, sign out
            console.log("Session expired, signing out")
            await supabase.auth.signOut()
            setSession(null)
            setUser(null)
            localStorage.removeItem("supabase.auth.token")
          }
        } else {
          // Check localStorage for session
          const storedSession = localStorage.getItem("supabase.auth.token")
          if (storedSession) {
            try {
              const parsedSession = JSON.parse(storedSession)
              const expiresAt = new Date(parsedSession.expires_at * 1000)
              const now = new Date()

              if (expiresAt <= now) {
                // Session has expired, remove it
                localStorage.removeItem("supabase.auth.token")
                setSession(null)
                setUser(null)
              }
            } catch (err) {
              console.error("Error parsing stored session:", err)
              localStorage.removeItem("supabase.auth.token")
            }
          }
        }
      } catch (err) {
        console.error("Error checking session expiry:", err)
      }
    }, 60000) // Check every minute

    return () => {
      subscription.unsubscribe()
      clearInterval(checkSessionInterval)
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (data.session) {
        localStorage.setItem("supabase.auth.token", JSON.stringify(data.session))
      }

      return { error }
    } catch (err) {
      console.error("Sign in error:", err)
      return { error: err as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("supabase.auth.token")
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


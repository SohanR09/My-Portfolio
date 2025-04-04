import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.SUPABASE_URL! || "https://okiadhwsjjlgjqmkxkim.supabase.co";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY! || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9raWFkaHdzampsZ2pxbWt4a2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzMzMzcsImV4cCI6MjA1ODU0OTMzN30.5X6WazVpznQ7hLnfnkNCc4MifHz-U67gXy15DVyvRcA"
// Create a Supabase client for server-side operations
export const createServerSupabaseClient = () => {
  const cookieStore: any = cookies()

  return createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
}


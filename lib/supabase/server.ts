import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.SUPABASE_URL! 
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
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


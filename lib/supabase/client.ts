import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database from the browser
const supabaseUrl = process.env.SUPABASE_URL! || "https://okiadhwsjjlgjqmkxkim.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY! || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9raWFkaHdzampsZ2pxbWt4a2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzMzMzcsImV4cCI6MjA1ODU0OTMzN30.5X6WazVpznQ7hLnfnkNCc4MifHz-U67gXy15DVyvRcA";

// Create a singleton to prevent multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}


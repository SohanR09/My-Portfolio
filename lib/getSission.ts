import { getSupabaseClient } from "./supabase/client"

export const getSession = async () => {
  const supabase = getSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    throw error
  }

  return {session, user: session?.user}
}

export const signOutClient = async () => {
  const supabase = getSupabaseClient()
  await supabase.auth.signOut()
  localStorage.clear()
}

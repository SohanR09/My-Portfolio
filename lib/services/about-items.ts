import { createServerSupabaseClient } from "../supabase/server"

export type AboutItem = {
  id?: string
  title: string
  content: string
  icon: string
}

export async function getAboutItems() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("about_items").select("*").order("created_at", { ascending: true })

  if (error) throw error
  return data as AboutItem[]
}

export async function getAboutItemById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("about_items").select("*").eq("id", id).single()

  if (error) throw error
  return data as AboutItem
}

export async function createAboutItem(aboutItem: AboutItem) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("about_items").insert(aboutItem).select().single()

  if (error) throw error
  return data as AboutItem
}

export async function updateAboutItem(id: string, aboutItem: Partial<AboutItem>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("about_items").update(aboutItem).eq("id", id).select().single()

  if (error) throw error
  return data as AboutItem
}

export async function deleteAboutItem(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("about_items").delete().eq("id", id)

  if (error) throw error
  return true
}


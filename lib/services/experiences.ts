import { createServerSupabaseClient } from "../supabase/server"

export type Experience = {
  id?: string
  company: string
  logo?: string
  position: string
  period: string
  description: string
  skills: string[]
}

export async function getExperiences() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("experiences").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Experience[]
}

export async function getExperienceById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("experiences").select("*").eq("id", id).single()

  if (error) throw error
  return data as Experience
}

export async function createExperience(experience: Experience) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("experiences").insert(experience).select().single()

  if (error) throw error
  return data as Experience
}

export async function updateExperience(id: string, experience: Partial<Experience>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("experiences").update(experience).eq("id", id).select().single()

  if (error) throw error
  return data as Experience
}

export async function deleteExperience(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("experiences").delete().eq("id", id)

  if (error) throw error
  return true
}


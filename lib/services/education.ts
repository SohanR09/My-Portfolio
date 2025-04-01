import { createServerSupabaseClient } from "../supabase/server"

export type Education = {
  id?: string
  university: string
  logo?: string
  degree: string
  period: string
  cgpa: string
  subjects: string[]
  description: string
}

export async function getEducations() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("education").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Education[]
}

export async function getEducationById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("education").select("*").eq("id", id).single()

  if (error) throw error
  return data as Education
}

export async function createEducation(education: Education) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("education").insert(education).select().single()

  if (error) throw error
  return data as Education
}

export async function updateEducation(id: string, education: Partial<Education>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("education").update(education).eq("id", id).select().single()

  if (error) throw error
  return data as Education
}

export async function deleteEducation(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("education").delete().eq("id", id)

  if (error) throw error
  return true
}


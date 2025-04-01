import { createServerSupabaseClient } from "../supabase/server"

export type Skill = {
  id?: string
  name: string
  icon: string
}

export async function getSkills() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("skills").select("*").order("name", { ascending: true })

  if (error) throw error
  return data as Skill[]
}

export async function getSkillById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("skills").select("*").eq("id", id).single()

  if (error) throw error
  return data as Skill
}

export async function createSkill(skill: Skill) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("skills").insert(skill).select().single()

  if (error) throw error
  return data as Skill
}

export async function updateSkill(id: string, skill: Partial<Skill>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("skills").update(skill).eq("id", id).select().single()

  if (error) throw error
  return data as Skill
}

export async function deleteSkill(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("skills").delete().eq("id", id)

  if (error) throw error
  return true
}


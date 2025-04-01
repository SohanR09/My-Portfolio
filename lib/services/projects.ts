import { createServerSupabaseClient } from "../supabase/server"

export type Project = {
  id?: string
  name: string
  description: string
  image?: string
  skills: string[]
  github?: string
  live?: string
}

export async function getProjects() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data as Project[]
}

export async function getProjectById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error) throw error
  return data as Project
}

export async function createProject(project: Project) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("projects").insert(project).select().single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, project: Partial<Project>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("projects").update(project).eq("id", id).select().single()

  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) throw error
  return true
}


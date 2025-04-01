import { createServerSupabaseClient } from "../supabase/server"

export type BlogCategory = {
  id?: string
  name: string
  icon: string
}

export type BlogPost = {
  id?: string
  title: string
  excerpt: string
  content: string
  image?: string
  date: string
  author: string
  author_image?: string
  category_id: string
  read_time: string
}

export async function getBlogCategories() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true })

  if (error) throw error
  return data as BlogCategory[]
}

export async function getBlogCategoryById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("blog_categories").select("*").eq("id", id).single()

  if (error) throw error
  return data as BlogCategory
}

export async function createBlogCategory(category: BlogCategory) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("blog_categories").insert(category).select().single()

  if (error) throw error
  return data as BlogCategory
}

export async function updateBlogCategory(id: string, category: Partial<BlogCategory>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("blog_categories").update(category).eq("id", id).select().single()

  if (error) throw error
  return data as BlogCategory
}

export async function deleteBlogCategory(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("blog_categories").delete().eq("id", id)

  if (error) throw error
  return true
}

export async function getBlogPosts() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:blog_categories(*)
    `)
    .order("date", { ascending: false })

  if (error) throw error
  return data
}

export async function getBlogPostById(id: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getBlogPostsByCategory(categoryId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq("category_id", categoryId)
    .order("date", { ascending: false })

  if (error) throw error
  return data
}

export async function createBlogPost(post: BlogPost) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("blog_posts").insert(post).select().single()

  if (error) throw error
  return data as BlogPost
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("blog_posts").update(post).eq("id", id).select().single()

  if (error) throw error
  return data as BlogPost
}

export async function deleteBlogPost(id: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) throw error
  return true
}


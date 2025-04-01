"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, ArrowLeft, Calendar, Clock } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { PostForm } from "./components/post-form"
import Link from "next/link"
import { getIconByName } from "@/utils/icon-utils"
import type { BlogPost } from "@/lib/services/blog"

type BlogPostWithCategory = BlogPost & {
  category: {
    id: string
    name: string
    icon: string
  }
}

export default function BlogPostsAdmin() {
  const [posts, setPosts] = useState<BlogPostWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPostWithCategory | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(*)
      `)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
    } else {
      setPosts(data || [])
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) {
        console.error("Error deleting blog post:", error)
        alert("Failed to delete blog post")
      } else {
        fetchPosts()
      }
    }
  }

  function handleEdit(post: BlogPostWithCategory) {
    setSelectedPost(post)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedPost(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedPost(null)
    fetchPosts()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-col gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/blog" className="flex justify-start items-center gap-2 hover:underline underline-offset-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog Posts</h1>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const CategoryIcon = post.category ? getIconByName(post.category.icon) : null

            return (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                        {post.category?.name || "Uncategorized"}
                      </CardDescription>
                    </div>
                    {post.image && (
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {post.read_time}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id!)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {isFormOpen && <PostForm post={selectedPost} onClose={handleFormClose} />}
    </div>
  )
}


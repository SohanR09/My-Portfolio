"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import type { BlogPost, BlogCategory } from "@/lib/services/blog"

interface PostFormProps {
  post: null
  onClose: () => void
}

export function PostForm({ post, onClose }: PostFormProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
    author: "John Smith",
    author_image: "https://placehold.co/200x200?text=JS",
    category_id: "",
    read_time: "5 min read",
  })
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        category_id: post.category?.id || "",
      })
    }
  }, [post])

  async function fetchCategories() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
    } else {
      setCategories(data || [])
    }
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      if (post?.id) {
        // Update existing post
        const {category, ...rest} = formData
        const { error } = await supabase.from("blog_posts").update(rest).eq("id", post.id)
        if (error) throw error
      } else {
        // Create new post
        const { error } = await supabase.from("blog_posts").insert(formData)
        if (error) throw error
      }

      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Blog Post" : "Add Blog Post"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="read_time">Read Time *</Label>
              <Input
                id="read_time"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                placeholder="5 min read"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_image">Author Image URL</Label>
              <Input
                id="author_image"
                name="author_image"
                value={formData.author_image || ""}
                onChange={handleChange}
                placeholder="https://example.com/author.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
              placeholder="# Markdown content supported
              
## Use markdown for formatting

- Lists
- Are supported

> Blockquotes work too

```javascript
// Code blocks are also supported
function example() {
  return 'Hello World';
}
```"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


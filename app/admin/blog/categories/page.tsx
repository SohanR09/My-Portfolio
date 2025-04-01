"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { CategoryForm } from "./components/category-form"
import { getIconByName } from "@/utils/icon-utils"
import Link from "next/link"
import type { BlogCategory } from "@/lib/services/blog"

export default function BlogCategoriesAdmin() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching blog categories:", error)
    } else {
      setCategories(data || [])
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this category? This will affect all posts in this category.")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("blog_categories").delete().eq("id", id)

      if (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category. It may be in use by blog posts.")
      } else {
        fetchCategories()
      }
    }
  }

  function handleEdit(category: BlogCategory) {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedCategory(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedCategory(null)
    fetchCategories()
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog Categories</h1>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = getIconByName(category.icon)

            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="pb-2 text-center">
                  <div className="flex justify-center mb-2">
                    {IconComponent && <IconComponent className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Icon: {category.icon}
                </CardContent>
                <CardFooter className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id!)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {isFormOpen && <CategoryForm category={selectedCategory} onClose={handleFormClose} />}
    </div>
  )
}


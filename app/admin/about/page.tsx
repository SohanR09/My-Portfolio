"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { AboutItemForm } from "./components/about-item-form"
import { getAboutSectionIcon } from "@/utils/about-icon-utils"
import type { AboutItem } from "@/lib/services/about-items"

export default function AboutAdmin() {
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<AboutItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchAboutItems()
  }, [])

  async function fetchAboutItems() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("about_items").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching about items:", error)
    } else {
      setAboutItems(data || [])
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this about item?")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("about_items").delete().eq("id", id)

      if (error) {
        console.error("Error deleting about item:", error)
        alert("Failed to delete about item")
      } else {
        fetchAboutItems()
      }
    }
  }

  function handleEdit(item: AboutItem) {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedItem(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedItem(null)
    fetchAboutItems()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage About Section</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    {getAboutSectionIcon(item.icon, "w-5 h-5")}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id!)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && <AboutItemForm item={selectedItem} onClose={handleFormClose} />}
    </div>
  )
}


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
import { getAboutSectionIcon, getAboutIconOptions } from "@/utils/about-icon-utils"
import type { AboutItem } from "@/lib/services/about-items"

interface AboutItemFormProps {
  item: AboutItem | null
  onClose: () => void
}

export function AboutItemForm({ item, onClose }: AboutItemFormProps) {
  const [formData, setFormData] = useState<AboutItem>({
    title: "",
    content: "",
    icon: "FaLightbulb",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
  }, [item])

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

      if (item?.id) {
        // Update existing item
        const { error } = await supabase.from("about_items").update(formData).eq("id", item.id)
        if (error) throw error
      } else {
        // Create new item
        const { error } = await supabase.from("about_items").insert(formData)
        if (error) throw error
      }

      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the about item")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get available icon options
  const iconOptions = getAboutIconOptions()

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit About Item" : "Add About Item"}</DialogTitle>
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
            <Label htmlFor="content">Content *</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={4} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon *</Label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
              required
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center py-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">{getAboutSectionIcon(formData.icon, "w-12 h-12")}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Icon Preview</p>
            </div>
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
                "Save Item"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { getIconByName, getIconName } from "@/utils/icon-utils"
import type { Skill } from "@/lib/services/skills"

interface SkillFormProps {
  skill: Skill | null
  onClose: () => void
}

// Common icon options
const iconOptions = [
  "FaReact",
  "FaNodeJs",
  "SiTypescript",
  "SiJavascript",
  "FaPython",
  "SiMongodb",
  "SiPostgresql",
  "FaAws",
  "SiDocker",
  "SiKubernetes",
  "SiNextdotjs",
  "SiGraphql",
  "SiTailwindcss",
  "SiRedux",
  "SiVuedotjs",
  "SiAngular",
  "SiDjango",
  "SiFlask",
  "SiExpress",
  "SiFirebase",
]

export function SkillForm({ skill, onClose }: SkillFormProps) {
  const [formData, setFormData] = useState<Skill>({
    name: "",
    icon: "FaReact",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (skill) {
      setFormData(skill)
    }
  }, [skill])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      if (skill?.id) {
        // Update existing skill
        const { error } = await supabase.from("skills").update(formData).eq("id", skill.id)
        if (error) throw error
      } else {
        // Create new skill
        const { error } = await supabase.from("skills").insert(formData)
        if (error) throw error
      }

      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the skill")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get the icon component for preview
  const IconComponent = getIconByName(formData.icon)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit Skill" : "Add Skill"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
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
              {getIconName()?.map((icon: string) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center py-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {IconComponent && <IconComponent className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
              </div>
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
                "Save Skill"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


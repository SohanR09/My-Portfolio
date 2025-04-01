"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getSupabaseClient } from "@/lib/supabase/client"
import { X, Plus, Loader2 } from "lucide-react"
import type { Education } from "@/lib/services/education"

interface EducationFormProps {
  education: Education | null
  onClose: () => void
}

export function EducationForm({ education, onClose }: EducationFormProps) {
  const [formData, setFormData] = useState<Education>({
    university: "",
    logo: "",
    degree: "",
    period: "",
    cgpa: "",
    subjects: [],
    description: "",
  })
  const [subject, setSubject] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (education) {
      setFormData(education)
    }
  }, [education])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubject = () => {
    if (subject.trim() && !formData.subjects.includes(subject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subject.trim()],
      }))
      setSubject("")
    }
  }

  const handleRemoveSubject = (subjectToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subjectToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      if (education?.id) {
        // Update existing education
        const { error } = await supabase.from("education").update(formData).eq("id", education.id)
        if (error) throw error
      } else {
        // Create new education
        const { error } = await supabase.from("education").insert(formData)
        if (error) throw error
      }

      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the education")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{education ? "Edit Education" : "Add Education"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-red-700 dark:text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University/Institution *</Label>
              <Input id="university" name="university" value={formData.university} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo || ""}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Input id="degree" name="degree" value={formData.degree} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period *</Label>
              <Input
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                placeholder="2018 - 2022"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cgpa">CGPA/Grade *</Label>
            <Input id="cgpa" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="3.8/4.0" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Subjects/Courses *</Label>
            <div className="flex gap-2">
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Add a subject"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSubject()
                  }
                }}
              />
              <Button type="button" onClick={handleAddSubject} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(subject)}
                    className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {formData.subjects.length === 0 && <p className="text-sm text-red-500">At least one subject is required</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || formData.subjects.length === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Education"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


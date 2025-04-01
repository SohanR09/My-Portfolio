"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, GraduationCap } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { EducationForm } from "./components/education-form"
import type { Education } from "@/lib/services/education"

export default function EducationAdmin() {
  const [educations, setEducations] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchEducations()
  }, [])

  async function fetchEducations() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("education").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching education:", error)
    } else {
      setEducations(data || [])
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this education entry?")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("education").delete().eq("id", id)

      if (error) {
        console.error("Error deleting education:", error)
        alert("Failed to delete education entry")
      } else {
        fetchEducations()
      }
    }
  }

  function handleEdit(education: Education) {
    setSelectedEducation(education)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedEducation(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedEducation(null)
    fetchEducations()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Education</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {educations.map((education) => (
            <Card key={education.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {education.logo ? (
                    <img
                      src={education.logo || "/placeholder.svg"}
                      alt={education.university}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{education.university}</CardTitle>
                    <CardDescription>{education.degree}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Period:</span> {education.period}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">CGPA:</span> {education.cgpa}
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{education.description}</p>
                <div className="flex flex-wrap gap-2">
                  {education.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(education)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(education.id!)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && <EducationForm education={selectedEducation} onClose={handleFormClose} />}
    </div>
  )
}


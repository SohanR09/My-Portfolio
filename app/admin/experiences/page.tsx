"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, Briefcase, GripVertical, Home, ChevronRight } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { ExperienceForm } from "./components/experience-form"
import type { Experience } from "@/lib/services/experiences"
import Link from "next/link"
import { useDragSort } from "@/hooks/use-drag-sort"

export default function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchExperiences()
  }, [])

  async function fetchExperiences() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sequence", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching experiences:", error)
    } else {
      setExperiences(data || [])
    }
    setIsLoading(false)
  }

  const {
    items: sortedExperiences,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragSort<Experience>(experiences, "experiences", fetchExperiences)

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this experience?")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("experiences").delete().eq("id", id)

      if (error) {
        console.error("Error deleting experience:", error)
        alert("Failed to delete experience")
      } else {
        fetchExperiences()
      }
    }
  }

  function handleEdit(experience: Experience) {
    setSelectedExperience(experience)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedExperience(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedExperience(null)
    fetchExperiences()
  }

  return (
    <div>
      <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 dark:text-white font-medium">Experiences</span>
          </li>
        </ol>
      </nav>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Experiences</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedExperiences && sortedExperiences.map((experience, index) => (
            <Card
              key={experience.id}
              className="overflow-hidden relative group"
              draggable={sortedExperiences.length > 1}
              onDragStart={() => handleDragStart(experience)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              {sortedExperiences.length > 1 && (
                <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded-md bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {experience.logo ? (
                    <img
                      src={experience.logo || "/placeholder.svg"}
                      alt={experience.company}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{experience.company}</CardTitle>
                    <CardDescription>{experience.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{experience.period}</p>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{experience.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {experience.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(experience)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(experience.id!)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && <ExperienceForm experience={selectedExperience} onClose={handleFormClose} />}
    </div>
  )
}


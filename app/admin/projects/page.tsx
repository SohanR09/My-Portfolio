"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2, ExternalLink, GripVertical, Home, ChevronRight } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { ProjectForm } from "./components/project-form"
import { useDragSort } from "@/hooks/use-drag-sort"
import Link from "next/link"

type Project = {
  id: string
  name: string
  description: string
  image: string | null
  skills: string[]
  github: string | null
  live: string | null
  sequence?: number
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sequence", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
    } else {
      setProjects(data || [])
    }
    setIsLoading(false)
  }

  const {
  items: sortedProjects,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragSort<Project>(projects, "projects", fetchProjects)

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this project?")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) {
        console.error("Error deleting project:", error)
        alert("Failed to delete project")
      } else {
        fetchProjects()
      }
    }
  }

  function handleEdit(project: Project) {
    setSelectedProject(project)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedProject(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedProject(null)
    fetchProjects()
  }

  console.log("sortedProjects", sortedProjects, handleDragStart)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
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
            <span className="text-gray-900 dark:text-white font-medium">Projects</span>
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects?.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden relative group"
              draggable={sortedProjects.length > 1}
              onDragStart={() => handleDragStart(project)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              {sortedProjects.length > 1 && (
                <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded-md bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && <ProjectForm project={selectedProject} onClose={handleFormClose} />}
    </div>
  )
}


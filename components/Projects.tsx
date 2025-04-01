"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionContainer } from "@/components/ui/section-container"
import { SectionTitle } from "@/components/ui/section-title"
import { SECTION_TITLES } from "@/constants"
import { Code, ExternalLink, Github } from "lucide-react"
import { getSkillIcon } from "@/utils/text-utils"
import { getSupabaseClient } from "@/lib/supabase/client"

type Project = {
  id: string
  name: string
  description: string
  image: string | null
  skills: string[]
  github: string | null
  live: string | null
}

/**
 * Projects section component that displays recent projects
 * with images, descriptions, and skills used.
 */
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("sequence", { ascending: true })
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          setError("Unable to load projects at this time")
          setProjects([])
        } else {
          setProjects(data || [])
          setError(null)
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setError("Unable to load projects at this time")
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <SectionContainer id="projects" background="dark" className="relative overflow-hidden">
        <SectionTitle title={SECTION_TITLES.projects} light />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[...Array(3)].map((_, skillIndex) => (
                    <div key={skillIndex} className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    )
  }

  // If no projects are found, show a fallback message
  if (projects.length === 0) {
    return (
      <SectionContainer id="projects" background="dark" className="relative overflow-hidden">
        <SectionTitle title={SECTION_TITLES.projects} light />
        <div className="text-center py-12">
          <p className="text-gray-400">
            {error || "Project information will be available soon. Please check back later."}
          </p>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="projects" background="dark" className="relative overflow-hidden">
      {/* Particle effect background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animation: `float ${Math.random() * 10 + 5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <SectionTitle title={SECTION_TITLES.projects} light />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -5 }}
            >
              <div className="h-48 overflow-hidden relative">
                {project.image ? (
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                    <Code className="w-20 h-20 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2 space-x-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
              </div>

              {/* Skills footer - now aligned at the bottom */}
              <div className="px-6 pb-6 mt-auto">
                <div className="flex flex-wrap gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  {project.skills.slice(0, 4).map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                    >
                      <span>{getSkillIcon(skill)}</span>
                    </div>
                  ))}
                  {project.skills.length > 4 && (
                    <div className="flex items-center bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1">
                      <span className="text-xs text-gray-800 dark:text-gray-200">+{project.skills.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project details dialog - improved for mobile */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">{selectedProject.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="relative w-full h-48 sm:h-64 mb-4 rounded-md overflow-hidden">
                  {selectedProject.image ? (
                    <Image
                      src={selectedProject.image || "/placeholder.svg"}
                      alt={selectedProject.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                      <Code className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <DialogDescription className="text-base text-gray-700 dark:text-gray-300 my-4">
                  {selectedProject.description}
                </DialogDescription>

                {/* Updated skills display in dialog */}
                <div className="flex flex-wrap gap-2 my-4">
                  {selectedProject.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1"
                    >
                      {getSkillIcon(skill)}
                      <span>{skill}</span>
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  {selectedProject.github && (
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <Link
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Github className="w-4 h-4 mr-2 text-gray-800 dark:text-gray-200" /> GitHub Repository
                      </Link>
                    </Button>
                  )}
                  {selectedProject.live && (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Link
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SectionContainer>
  )
}


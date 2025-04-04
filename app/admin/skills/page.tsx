"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { SkillForm } from "./components/skill-form"
import { getIconByName } from "@/utils/icon-utils"
import type { Skill } from "@/lib/services/skills"

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    setIsLoading(true)
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("skills").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching skills:", error)
    } else {
      setSkills(data as Skill[] || [])
    }
    setIsLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this skill?")) {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("skills").delete().eq("id", id)

      if (error) {
        console.error("Error deleting skill:", error)
        alert("Failed to delete skill")
      } else {
        fetchSkills()
      }
    }
  }

  function handleEdit(skill: Skill) {
    setSelectedSkill(skill)
    setIsFormOpen(true)
  }

  function handleAdd() {
    setSelectedSkill(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedSkill(null)
    fetchSkills()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Skills</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => {
            const IconComponent = getIconByName(skill.icon)

            return (
              <Card key={skill.id} className="overflow-hidden">
                <CardHeader className="pb-2 text-center">
                  <div className="flex justify-center mb-2">
                    {IconComponent && <IconComponent className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Icon: {skill.icon}
                </CardContent>
                <CardFooter className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id!)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {isFormOpen && <SkillForm skill={selectedSkill} onClose={handleFormClose} />}
    </div>
  )
}


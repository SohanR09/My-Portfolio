"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SectionContainer } from "@/components/ui/section-container"
import { SectionTitle } from "@/components/ui/section-title"
import { SECTION_TITLES } from "@/constants"
import { Calendar, Award, BookOpen, School } from "lucide-react"
import { highlightQuotedText } from "@/utils/text-utils"
import { getSupabaseClient } from "@/lib/supabase/client"

type Education = {
  id: string
  university: string
  logo: string | null
  degree: string
  period: string
  cgpa: string
  subjects: string[]
  description: string
}

/**
 * Education section component that displays educational background
 * with university logos, degrees, and subjects.
 */
export default function Education() {
  const [educations, setEducations] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEducations() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("education").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching educations:", error)
          setError("Unable to load education information at this time")
          setEducations([])
        } else {
          setEducations(data || [])
          setError(null)
        }
      } catch (err) {
        console.error("Failed to fetch educations:", err)
        setError("Unable to load education information at this time")
        setEducations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEducations()
  }, [])

  if (isLoading) {
    return (
      <SectionContainer id="education" background="light">
        <SectionTitle title={SECTION_TITLES.education} />
        <div className="space-y-12">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gray-200 dark:bg-gray-800 p-6 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                  <div className="mt-4">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[...Array(5)].map((_, subjectIndex) => (
                        <div key={subjectIndex} className="h-8 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    )
  }

  // If no educations are found, show a fallback message
  if (educations.length === 0) {
    return (
      <SectionContainer id="education" background="light">
        <SectionTitle title={SECTION_TITLES.education} />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Education information will be available soon. Please check back later."}
          </p>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="education" background="light">
      <SectionTitle title={SECTION_TITLES.education} />

      <div className="space-y-12">
        {educations.map((edu, index) => (
          <motion.div
            key={edu.id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="md:flex">
              {/* Left side with logo and basic info */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-6 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 p-2 mb-4 flex items-center justify-center overflow-hidden">
                  {edu?.logo ? (
                    <Image
                      src={edu.logo || "/placeholder.svg"}
                      alt={`${edu.university} logo`}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <School className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                  )}
                </div>

                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                  {edu.university}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                  <span>{edu.period}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Award className="w-4 h-4 mr-2 text-yellow-500 dark:text-yellow-400" />
                  <span>CGPA: {edu.cgpa}</span>
                </div>
              </div>

              {/* Right side with degree and subjects */}
              <div className="md:w-2/3 p-6">
                <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">{edu.degree}</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{highlightQuotedText(edu.description)}</p>

                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                    <h5 className="font-medium text-gray-900 dark:text-white">Key Subjects</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {edu.subjects.map((subject, subjectIndex) => (
                      <span
                        key={subjectIndex}
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  )
}


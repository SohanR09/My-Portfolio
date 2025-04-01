"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SectionContainer } from "@/components/ui/section-container"
import { SectionTitle } from "@/components/ui/section-title"
import { SECTION_TITLES } from "@/constants"
import { getSupabaseClient } from "@/lib/supabase/client"
import { getAboutSectionIcon } from "@/utils/about-icon-utils"
import type { AboutItem } from "@/lib/services/about-items"

/**
 * About section component that displays information about the developer
 * using a bento grid layout with icons.
 */
export default function About() {
  const [aboutItems, setAboutItems] = useState<AboutItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutItems() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("about_items")
          .select("*")
          .order("sequence", { ascending: true })
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching about items:", error)
          // Handle the error gracefully - show default data or error state
          setAboutItems([])
        } else {
          setAboutItems(data || [])
        }
      } catch (err) {
        console.error("Failed to fetch about items:", err)
        setAboutItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutItems()
  }, [])

  if (isLoading) {
    return (
      <SectionContainer id="about" background="light">
        <SectionTitle title={SECTION_TITLES.about} />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {[...Array(5)].map((_, index) => {
            let colSpan = "md:col-span-3"
            if (index === 0) colSpan = "md:col-span-6"
            else if (index === 3) colSpan = "md:col-span-4"
            else if (index === 4) colSpan = "md:col-span-2"

            return (
              <div key={index} className={`rounded-lg shadow-md overflow-hidden animate-pulse ${colSpan}`}>
                <div className="h-2 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 bg-white dark:bg-gray-800">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-full bg-gray-300 dark:bg-gray-700 mr-4 w-14 h-14"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SectionContainer>
    )
  }

  // If no items are found, show a fallback message
  if (aboutItems.length === 0) {
    return (
      <SectionContainer id="about" background="light">
        <SectionTitle title={SECTION_TITLES.about} />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            About information will be available soon. Please check back later.
          </p>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="about" background="light">
      <SectionTitle title={SECTION_TITLES.about} />

      {/* Redesigned grid layout with better mobile responsiveness and varied column spans */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {aboutItems.map((item, index) => {
          // Determine column span based on index for visual interest
          let colSpan = "md:col-span-3"
          if (index === 0) colSpan = "md:col-span-6"
          else if (index === 1 || index === 2) colSpan = "md:col-span-3"
          else if (index === 3) colSpan = "md:col-span-4"
          else if (index === 4) colSpan = "md:col-span-2"

          return (
            <motion.div
              key={item.id}
              className={`rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl ${colSpan}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 h-2" />
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-start mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                    {getAboutSectionIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionContainer>
  )
}


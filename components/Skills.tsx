"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SectionContainer } from "@/components/ui/section-container"
import { SectionTitle } from "@/components/ui/section-title"
import { SECTION_TITLES } from "@/constants"
import { getSupabaseClient } from "@/lib/supabase/client"
import {
  FaReact,
  FaNodeJs,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaVuejs,
  FaDocker,
  FaAws,
  FaJava,
  FaPhp,
  FaAngular,
  FaGithub,
  FaGitAlt,
  FaLaravel,
  FaSass,
  FaBootstrap,
  FaWordpress,
  FaFigma,
  FaDatabase,
  FaCode,
} from "react-icons/fa"
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiRedux,
  SiFirebase,
  SiExpress,
  SiGraphql,
  SiDjango,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiRuby,
  SiRubyonrails,
  SiJest,
  SiCypress,
  SiMysql,
  SiRedis,
  SiElasticsearch,
  SiKubernetes,
  SiTerraform,
  SiAnsible,
  SiJenkins,
  SiGo,
  SiRust,
  SiDart,
  //SiCsharp,
  SiDotnet,
  SiSpring,
  SiSvelte,
  SiElectron,
  SiWebpack,
  SiVite,
  SiStorybook,
 //SiMaterialui,
  SiChakraui,
  SiAntdesign,
  SiStripe,
  SiAuth0,
  SiVercel,
  SiNetlify,
  SiHeroku,
  SiDigitalocean,
  SiGooglecloud,
 // SiMicrosoftazure,
  //SiAmazonaws,
} from "react-icons/si"
import type { IconType } from "react-icons"

type Skill = {
  id: string
  name: string
  icon: string
}

/**
 * Skills section component that displays technical skills
 * with icons and names in a grid layout.
 */
export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.from("skills").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching skills:", error)
          setError("Unable to load skills at this time")
          setSkills([])
        } else {
          setSkills(data || [])
          setError(null)
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err)
        setError("Unable to load skills at this time")
        setSkills([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (isLoading) {
    return (
      <SectionContainer id="skills" background="primary" className="relative overflow-hidden">
        <SectionTitle title={SECTION_TITLES.skills} />
        <div className="flex flex-wrap justify-center gap-8">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </SectionContainer>
    )
  }

  // If no skills are found, show a fallback message
  if (skills.length === 0) {
    return (
      <SectionContainer id="skills" background="primary" className="relative overflow-hidden">
        <SectionTitle title={SECTION_TITLES.skills} />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Skills information will be available soon. Please check back later."}
          </p>
        </div>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer id="skills" background="primary" className="relative overflow-hidden">
      <SectionTitle title={SECTION_TITLES.skills} />
      <div className="flex flex-wrap justify-center gap-8">
        {skills.map((skill, index) => {
          const IconComponent = getSkillIcon(skill.name, skill.icon)

          return (
            <motion.div
              key={skill.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <IconComponent className={`text-5xl mb-2 ${getSkillIconColor(skill.name)}`} />
              <span className="text-sm text-gray-800 dark:text-gray-200">{skill.name}</span>
            </motion.div>
          )
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 blur-2xl animate-beam" />
      </div>
    </SectionContainer>
  )
}

/**
 * Enhanced function to get the appropriate icon for a skill
 * Tries to match by both skill name and icon name
 * Returns a default icon if no match is found
 */
function getSkillIcon(skillName: string, iconName: string): IconType {
  // Comprehensive map of skill names to icon components
  const skillIconMap: Record<string, IconType> = {
    // Frontend
    React: FaReact,
    "React.js": FaReact,
    ReactJS: FaReact,
    "Next.js": SiNextdotjs,
    NextJS: SiNextdotjs,
    "Vue.js": FaVuejs,
    VueJS: FaVuejs,
    Angular: FaAngular,
    Svelte: SiSvelte,
    HTML: FaHtml5,
    HTML5: FaHtml5,
    CSS: FaCss3Alt,
    CSS3: FaCss3Alt,
    Sass: FaSass,
    SCSS: FaSass,
    Tailwind: SiTailwindcss,
    "Tailwind CSS": SiTailwindcss,
    Bootstrap: FaBootstrap,
    //"Material UI": SiMaterialui,
    //MaterialUI: SiMaterialui,
    "Chakra UI": SiChakraui,
    "Ant Design": SiAntdesign,
    Storybook: SiStorybook,
    Figma: FaFigma,

    // JavaScript/TypeScript
    JavaScript: FaJs,
    JS: FaJs,
    TypeScript: SiTypescript,
    TS: SiTypescript,

    // Backend
    "Node.js": FaNodeJs,
    NodeJS: FaNodeJs,
    Express: SiExpress,
    "Express.js": SiExpress,
    ExpressJS: SiExpress,
    Django: SiDjango,
    Flask: FaPython,
    Laravel: FaLaravel,
    Spring: SiSpring,
    "Spring Boot": SiSpring,
    ".NET": SiDotnet,
    "ASP.NET": SiDotnet,
    "Ruby on Rails": SiRubyonrails,
    Rails: SiRubyonrails,

    // Databases
    MongoDB: SiMongodb,
    PostgreSQL: SiPostgresql,
    MySQL: SiMysql,
    Redis: SiRedis,
    Elasticsearch: SiElasticsearch,
    Firebase: SiFirebase,
    SQL: FaDatabase,
    NoSQL: FaDatabase,

    // Programming Languages
    Python: FaPython,
    Java: FaJava,
    PHP: FaPhp,
    Ruby: SiRuby,
    Go: SiGo,
    Golang: SiGo,
    Rust: SiRust,
    //"C#": SiCsharp,
    Swift: SiSwift,
    Kotlin: SiKotlin,
    Dart: SiDart,

    // Mobile
    Flutter: SiFlutter,
    "React Native": FaReact,

    // DevOps/Cloud
    Docker: FaDocker,
    Kubernetes: SiKubernetes,
    K8s: SiKubernetes,
    AWS: FaAws,
    //"Amazon Web Services": SiAmazonaws,
    "Google Cloud": SiGooglecloud,
    GCP: SiGooglecloud,
    //Azure: SiMicrosoftazure,
    Terraform: SiTerraform,
    Ansible: SiAnsible,
    Jenkins: SiJenkins,
    "CI/CD": SiJenkins,
    Vercel: SiVercel,
    Netlify: SiNetlify,
    Heroku: SiHeroku,
    DigitalOcean: SiDigitalocean,

    // Testing
    Jest: SiJest,
    Cypress: SiCypress,
    Testing: SiJest,

    // Other
    Git: FaGitAlt,
    GitHub: FaGithub,
    GraphQL: SiGraphql,
    "REST API": FaCode,
    "REST APIs": FaCode,
    Redux: SiRedux,
    Webpack: SiWebpack,
    Vite: SiVite,
    Electron: SiElectron,
    Stripe: SiStripe,
    Auth0: SiAuth0,
    WordPress: FaWordpress,
  }

  // First try to match by skill name (case insensitive)
  const normalizedSkillName = skillName.toLowerCase()
  for (const [key, icon] of Object.entries(skillIconMap)) {
    if (key.toLowerCase() === normalizedSkillName) {
      return icon
    }
  }

  // If no match by skill name, try to match by icon name
  if (skillIconMap[iconName]) {
    return skillIconMap[iconName]
  }

  // If still no match, return a default icon
  return FaCode
}

/**
 * Helper function to get appropriate icon colors based on the skill name
 */
function getSkillIconColor(skillName: string): string {
  const colorMap: Record<string, string> = {
    React: "text-[#61DAFB] dark:text-[#61DAFB]",
    "React.js": "text-[#61DAFB] dark:text-[#61DAFB]",
    ReactJS: "text-[#61DAFB] dark:text-[#61DAFB]",
    "Node.js": "text-[#339933] dark:text-[#339933]",
    NodeJS: "text-[#339933] dark:text-[#339933]",
    TypeScript: "text-[#3178C6] dark:text-[#3178C6]",
    JavaScript: "text-[#F7DF1E] dark:text-[#F7DF1E]",
    JS: "text-[#F7DF1E] dark:text-[#F7DF1E]",
    Python: "text-[#3776AB] dark:text-[#3776AB]",
    MongoDB: "text-[#47A248] dark:text-[#47A248]",
    PostgreSQL: "text-[#336791] dark:text-[#336791]",
    MySQL: "text-[#4479A1] dark:text-[#4479A1]",
    AWS: "text-[#FF9900] dark:text-[#FF9900]",
    Docker: "text-[#2496ED] dark:text-[#2496ED]",
    Kubernetes: "text-[#326CE5] dark:text-[#326CE5]",
    HTML: "text-[#E34F26] dark:text-[#E34F26]",
    HTML5: "text-[#E34F26] dark:text-[#E34F26]",
    CSS: "text-[#1572B6] dark:text-[#1572B6]",
    CSS3: "text-[#1572B6] dark:text-[#1572B6]",
    "Vue.js": "text-[#4FC08D] dark:text-[#4FC08D]",
    VueJS: "text-[#4FC08D] dark:text-[#4FC08D]",
    Angular: "text-[#DD0031] dark:text-[#DD0031]",
    "Next.js": "text-gray-900 dark:text-white",
    NextJS: "text-gray-900 dark:text-white",
    Tailwind: "text-[#06B6D4] dark:text-[#06B6D4]",
    "Tailwind CSS": "text-[#06B6D4] dark:text-[#06B6D4]",
    GraphQL: "text-[#E10098] dark:text-[#E10098]",
    Firebase: "text-[#FFCA28] dark:text-[#FFCA28]",
    Redux: "text-[#764ABC] dark:text-[#764ABC]",
    Sass: "text-[#CC6699] dark:text-[#CC6699]",
    SCSS: "text-[#CC6699] dark:text-[#CC6699]",
    Java: "text-[#007396] dark:text-[#007396]",
    PHP: "text-[#777BB4] dark:text-[#777BB4]",
    Go: "text-[#00ADD8] dark:text-[#00ADD8]",
    Golang: "text-[#00ADD8] dark:text-[#00ADD8]",
    Rust: "text-[#000000] dark:text-[#FFFFFF]",
    "C#": "text-[#239120] dark:text-[#239120]",
    Ruby: "text-[#CC342D] dark:text-[#CC342D]",
    Swift: "text-[#FA7343] dark:text-[#FA7343]",
    Kotlin: "text-[#7F52FF] dark:text-[#7F52FF]",
  }

  return colorMap[skillName] || "text-blue-500 dark:text-blue-400"
}


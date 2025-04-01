import type { ReactNode } from "react"
import { FaReact, FaNodeJs, FaJs, FaHtml5, FaCss3Alt, FaPython, FaVuejs, FaDocker, FaAws } from "react-icons/fa"
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
} from "react-icons/si"
import { Code } from "lucide-react"

/**
 * Returns the appropriate icon component for a given skill/technology name
 */
export function getSkillIcon(skill: string) {
  const iconMap = {
    React: <FaReact className="text-[#61DAFB]" />,
    "Node.js": <FaNodeJs className="text-[#339933]" />,
    TypeScript: <SiTypescript className="text-[#3178C6]" />,
    JavaScript: <FaJs className="text-[#F7DF1E]" />,
    "Next.js": <SiNextdotjs className="text-black dark:text-white" />,
    "Tailwind CSS": <SiTailwindcss className="text-[#06B6D4]" />,
    MongoDB: <SiMongodb className="text-[#47A248]" />,
    PostgreSQL: <SiPostgresql className="text-[#336791]" />,
    Redux: <SiRedux className="text-[#764ABC]" />,
    Firebase: <SiFirebase className="text-[#FFCA28]" />,
    "Express.js": <SiExpress className="text-black dark:text-white" />,
    GraphQL: <SiGraphql className="text-[#E10098]" />,
    Python: <FaPython className="text-[#3776AB]" />,
    Django: <SiDjango className="text-[#092E20]" />,
    "Vue.js": <FaVuejs className="text-[#4FC08D]" />,
    HTML: <FaHtml5 className="text-[#E34F26]" />,
    CSS: <FaCss3Alt className="text-[#1572B6]" />,
    Docker: <FaDocker className="text-[#2496ED]" />,
    AWS: <FaAws className="text-[#FF9900]" />,
    "REST Api": <Code className="text-blue-500" />,
    "REST APIs": <Code className="text-blue-500" />,
    MaterialUI: <Code className="text-blue-500" />,
    "D3.js": <Code className="text-orange-500" />,
    Bootstrap: <Code className="text-purple-500" />,
    Clerk: <Code className="text-green-500" />,
    Typescript: <SiTypescript className="text-[#3178C6]" />,
  }

  return iconMap[skill] || <Code className="text-gray-500" />
}

/**
 * Highlights text within quotation marks in a string
 */
export function highlightQuotedText(text: string): ReactNode[] {
  // Regular expression to find text in inverted commas
  const regex = /"([^"]*)"/g

  // Split the text by the regex
  const parts = text.split(regex)

  // Map through parts and apply highlighting to quoted text
  return parts.map((part, index) => {
    // Even indices are regular text, odd indices are matches
    if (index % 2 === 1) {
      return (
        <span key={index} className="font-semibold text-blue-600 dark:text-blue-400">
          "{part}"
        </span>
      )
    }
    return part
  })
}

export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true

  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key)) return false

    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      if (!isEqual(obj1[key], obj2[key])) return false
    } else if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}


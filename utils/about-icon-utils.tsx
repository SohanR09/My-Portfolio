import {
  FaLightbulb,
  FaCode,
  FaPuzzlePiece,
  FaUsers,
  FaGlobeAmericas,
  FaBookOpen,
  FaPaintBrush,
  FaSearch,
  FaRocket,
  FaBrain,
  FaChartLine,
  FaHeart,
  FaCoffee,
  FaAward,
  FaGraduationCap,
  FaLaptopCode,
  FaTools,
  FaFlask,
} from "react-icons/fa"
import type { IconType } from "react-icons"

/**
 * Map of icon names to icon components for About section
 */
export const aboutIconMap: Record<string, IconType> = {
  FaLightbulb: FaLightbulb,
  FaCode: FaCode,
  FaPuzzlePiece: FaPuzzlePiece,
  FaUsers: FaUsers,
  FaGlobeAmericas: FaGlobeAmericas,
  FaBookOpen: FaBookOpen,
  FaPaintBrush: FaPaintBrush,
  FaSearch: FaSearch,
  FaRocket: FaRocket,
  FaBrain: FaBrain,
  FaChartLine: FaChartLine,
  FaHeart: FaHeart,
  FaCoffee: FaCoffee,
  FaAward: FaAward,
  FaGraduationCap: FaGraduationCap,
  FaLaptopCode: FaLaptopCode,
  FaTools: FaTools,
  FaFlask: FaFlask,
}

/**
 * Color mapping for About section icons
 */
export const aboutIconColorMap: Record<string, string> = {
  FaLightbulb: "text-yellow-500 dark:text-yellow-400",
  FaCode: "text-blue-500 dark:text-blue-400",
  FaPuzzlePiece: "text-green-500 dark:text-green-400",
  FaUsers: "text-purple-500 dark:text-purple-400",
  FaGlobeAmericas: "text-blue-500 dark:text-blue-400",
  FaBookOpen: "text-indigo-500 dark:text-indigo-400",
  FaPaintBrush: "text-pink-500 dark:text-pink-400",
  FaSearch: "text-cyan-500 dark:text-cyan-400",
  FaRocket: "text-red-500 dark:text-red-400",
  FaBrain: "text-violet-500 dark:text-violet-400",
  FaChartLine: "text-emerald-500 dark:text-emerald-400",
  FaHeart: "text-rose-500 dark:text-rose-400",
  FaCoffee: "text-amber-500 dark:text-amber-400",
  FaAward: "text-yellow-600 dark:text-yellow-500",
  FaGraduationCap: "text-blue-600 dark:text-blue-500",
  FaLaptopCode: "text-teal-500 dark:text-teal-400",
  FaTools: "text-gray-600 dark:text-gray-400",
  FaFlask: "text-purple-600 dark:text-purple-500",
}

/**
 * Returns the appropriate icon component for a given icon name with styling
 * @param iconName - The name of the icon to retrieve
 * @param size - Optional size class (default: "w-8 h-8")
 * @returns JSX element with the icon
 */
export function getAboutSectionIcon(iconName: string, size = "w-8 h-8") {
  // Get the icon component or use FaLightbulb as default
  const IconComponent = aboutIconMap[iconName] || FaLightbulb

  // Get the color class or use a default
  const color = aboutIconColorMap[iconName] || "text-blue-500 dark:text-blue-400"

  return <IconComponent className={`${size} ${color}`} aria-hidden="true" />
}

/**
 * Returns a list of available icon options for the About section
 */
export function getAboutIconOptions(): string[] {
  return Object.keys(aboutIconMap)
}


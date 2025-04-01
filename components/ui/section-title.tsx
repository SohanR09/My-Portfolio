/**
 * A reusable section title component that provides consistent styling
 * for all section titles in the portfolio.
 */

import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  className?: string
  centered?: boolean
  light?: boolean
}

export function SectionTitle({ title, className, centered = true, light = false }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "text-3xl font-bold mb-12",
        centered && "text-center",
        light ? "text-white" : "text-gray-900 dark:text-white",
        className,
      )}
    >
      {title}
    </h2>
  )
}


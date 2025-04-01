/**
 * A reusable section container component that provides consistent styling
 * for all sections of the portfolio.
 */

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  id?: string
  className?: string
  children: ReactNode
  background?: "light" | "dark" | "primary"
}

export function SectionContainer({ id, className, children, background = "light" }: SectionContainerProps) {
  const bgClasses = {
    light: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
    dark: "bg-gray-900 dark:bg-gray-900 text-white",
    primary: "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
  }

  return (
    <section id={id} className={cn("py-20", bgClasses[background], className)}>
      <div className="container mx-auto px-6">{children}</div>
    </section>
  )
}


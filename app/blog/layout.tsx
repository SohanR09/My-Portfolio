import type React from "react"
import Link from "next/link"
import { DarkModeToggle } from "@/components/DarkModeToggle"
import { SITE_CONFIG } from "@/constants"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            {SITE_CONFIG.name}
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
          </nav>
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  )
}


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth/auth-context"
import ScrollToTop from "@/components/ScrollToTop"

// Update this import to use the correct function name
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { updateSchemaSQL } from "@/db/update-schema"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A professional portfolio showcasing my skills and projects",
    generator: 'v0.dev'
}

// Update this function to use the correct function name
async function updateSchema() {
  try {
    const supabase = createServerSupabaseClient()
    await supabase.rpc("execute_sql", { sql: updateSchemaSQL })
    console.log("Schema updated successfully")
  } catch (error) {
    console.error("Error updating schema:", error)
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Update schema on app load
  await updateSchema()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
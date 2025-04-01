"use client"

import { type ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { DarkModeToggle } from "@/components/DarkModeToggle"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Code, Briefcase, GraduationCap, FileText, User, BookOpen, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession } from "@/hooks/use-session"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [user, isLoading, router, pathname])

  // Use our custom session hook
  const { isSessionValid, isSessionExpiringSoon } = useSession()

  // Check for session expiry and warn user if session is about to expire
  useEffect(() => {
    if (user) {
      const checkSessionExpiry = () => {
        if (isSessionExpiringSoon()) {
          // Session is about to expire, show a warning or refresh token
          console.log("Session is about to expire")
          // You could add a toast notification here to warn the user
        }
      }

      // Check immediately
      checkSessionExpiry()

      // Set up interval to check periodically
      const interval = setInterval(checkSessionExpiry, 60 * 1000) // Check every minute

      return () => clearInterval(interval)
    }
  }, [user, isSessionExpiringSoon])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== "/admin/login") {
    return null
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/projects", label: "Projects", icon: Code },
    { href: "/admin/experiences", label: "Experience", icon: Briefcase },
    { href: "/admin/education", label: "Education", icon: GraduationCap },
    { href: "/admin/skills", label: "Skills", icon: FileText },
    { href: "/admin/about", label: "About", icon: User },
    { href: "/admin/blog", label: "Blog", icon: BookOpen },
  ]

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(path)
  }

  // Navigation component for both desktop and mobile
  const Navigation = ({ mobile = false, onItemClick = () => {} }: { mobile?: boolean; onItemClick?: () => void }) => (
    <nav className={mobile ? "space-y-1" : "hidden lg:flex space-x-1"}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${mobile ? "block w-full" : ""} px-3 py-2 rounded-md text-sm font-medium flex items-center ${
            isActive(item.href)
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={onItemClick}
        >
          <item.icon className="w-4 h-4 mr-1.5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {user && pathname !== "/admin/login" && (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white mr-6">
                Portfolio Admin
              </Link>

              {/* Desktop Navigation */}
              <Navigation />
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="link" size="sm" asChild className="flex items-center gap-2">
                <Link href="/" className="flex justify-center items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">View Site</span>
                </Link>
              </Button>

              <DarkModeToggle />

              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut()
                  router.push("/admin/login")
                }}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>

              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                  <div className="py-4">
                    <h2 className="text-lg font-bold mb-4 px-3">Portfolio Admin</h2>
                    <Navigation
                      mobile
                      onItemClick={() => {
                        // Close sheet when item is clicked
                        const closeButton = document.querySelector("[data-sheet-close]")
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click()
                        }
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      {user && pathname !== "/admin/login" && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Portfolio Admin Dashboard
          </div>
        </footer>
      )}
    </div>
  )
}


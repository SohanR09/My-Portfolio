"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, GraduationCap, Code, FileText, User, BookOpen, LayoutDashboard, Palette } from "lucide-react"
import { DatabaseInitializer } from "./components/database-initializer"

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <div className="flex items-center">
          <LayoutDashboard className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="text-gray-600 dark:text-gray-400">Manage your portfolio content</span>
        </div>
      </div>

      <div className="mb-8">
        <DatabaseInitializer />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Projects"
          description="Manage your portfolio projects"
          href="/admin/projects"
          icon={Code}
        />
        <DashboardCard
          title="Experience"
          description="Manage your professional experience"
          href="/admin/experiences"
          icon={Briefcase}
        />
        <DashboardCard
          title="Education"
          description="Manage your educational background"
          href="/admin/education"
          icon={GraduationCap}
        />
        <DashboardCard title="Skills" description="Manage your technical skills" href="/admin/skills" icon={FileText} />
        <DashboardCard title="About" description="Manage your about section" href="/admin/about" icon={User} />
        <DashboardCard
          title="Blog"
          description="Manage your blog posts and categories"
          href="/admin/blog"
          icon={BookOpen}
        />
        <DashboardCard
          title="Appearance"
          description="Customize your portfolio appearance"
          href="/admin/appearance"
          icon={Palette}
        />
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ElementType
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-full mb-4"></div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-1/2">
          <Link href={href}>Manage</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


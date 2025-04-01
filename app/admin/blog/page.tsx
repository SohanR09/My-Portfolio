"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Tag } from "lucide-react"

export default function BlogAdmin() {
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Manage Blog Posts</CardTitle>
                <CardDescription>Create, edit, and delete blog posts</CardDescription>
            </CardHeader>
            <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
                Manage all your blog posts from one place. Add new posts, edit existing ones, or remove outdated
                content.
            </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/admin/blog/posts">Manage Posts</Link>
                </Button>
            </CardFooter>
        </Card>
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Manage Blog Categories</CardTitle>
                <CardDescription>Create, edit, and delete blog categories</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                    Organize your blog with categories. Create new categories, edit existing ones, or remove unused
                    categories.
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/admin/blog/categories">Manage Categories</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}


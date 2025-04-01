"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ChevronRight, Calendar, Clock, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/constants"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type BlogCategory = {
  id: string
  name: string
  icon: string
}

type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  image: string | null
  date: string
  author: string
  author_image: string | null
  category_id: string
  category: string
  read_time: string
}

export default function BlogPage() {
  const searchParams = useSearchParams()
  const postId = searchParams.get("post")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryMap, setCategoryMap] = useState<Record<string, { name: string; count: number }>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const supabase = getSupabaseClient()

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase.from("blog_categories").select("*")

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError)
          if (categoriesError.code === "42P01") {
            setError("Blog data is not available yet. Please check back later.")
          } else {
            setError("Failed to load blog categories. Please try again later.")
          }
        } else {
          setCategories(categoriesData || [])

          // Create category map
          const catMap: Record<string, { name: string; count: 0 }> = {}
          categoriesData?.forEach((cat) => {
            catMap[cat.id] = { name: cat.name, count: 0 }
          })

          categoriesData?.forEach((cat) => {
            catMap[cat.id] = { name: cat.name, count: 0 }
          })

          // Fetch posts
          const { data: postsData, error: postsError } = await supabase
            .from("blog_posts")
            .select("*, blog_categories(name)")

          if (postsError) {
            console.error("Error fetching posts:", postsError)
            if (postsError.code === "42P01") {
              setError("Blog data is not available yet. Please check back later.")
            } else {
              setError("Failed to load blog posts. Please try again later.")
            }
          } else {
            // Transform posts data
            const transformedPosts =
              postsData?.map((post) => ({
                ...post,
                category: post.blog_categories?.name || "Uncategorized",
              })) || []

            setPosts(transformedPosts)

            // Update category counts
            const updatedCatMap = { ...catMap }
            transformedPosts.forEach((post) => {
              if (post.category_id && updatedCatMap[post.category_id]) {
                updatedCatMap[post.category_id].count++
              }
            })

            setCategoryMap(updatedCatMap)

            // Check if we need to open a specific post
            if (postId) {
              const post = transformedPosts.find((p) => p.id === postId)
              if (post) {
                setSelectedPost(post)
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in fetchData:", err)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [postId])

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? post.category_id === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Function to render blog content with markdown
  const renderBlogContent = (content: string) => {
    return (
      <ReactMarkdown
        className="prose dark:prose-invert max-w-none"
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} style={vscDarkPlus} className="rounded-md my-4" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">{children}</blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
          li: ({ children }) => <li className="ml-2 mb-1">{children}</li>,
          p: ({ children }) => <p className="mb-4">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Blog Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Categories sidebar for mobile
  const CategoriesSidebar = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => {
              setSelectedCategory(null)
              // Close sheet if on mobile
              if (window.innerWidth < 1024) {
                const closeButton = document.querySelector("[data-sheet-close]")
                if (closeButton instanceof HTMLElement) {
                  closeButton.click()
                }
              }
            }}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
              selectedCategory === null
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="flex items-center">
              <span>All Categories</span>
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{posts.length}</span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => {
                setSelectedCategory(category.id)
                // Close sheet if on mobile
                if (window.innerWidth < 1024) {
                  const closeButton = document.querySelector("[data-sheet-close]")
                  if (closeButton instanceof HTMLElement) {
                    closeButton.click()
                  }
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="flex items-center">
                <span>{category.name}</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{categoryMap[category.id]?.count || 0}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
              <p className="text-blue-100">Insights and tutorials on web development</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={
                    "https://okiadhwsjjlgjqmkxkim.supabase.co/storage/v1/object/sign/user.data/profile_pic/picofme%20(2).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1c2VyLmRhdGEvcHJvZmlsZV9waWMvcGljb2ZtZSAoMikucG5nIiwiaWF0IjoxNzQzMTY4ODM5LCJleHAiOjIwNTg1Mjg4Mzl9.WTX_CanT-mCJB1fGmznibppNCubtDWadp9jrrppBeOI" ||
                    SITE_CONFIG.socialLinks.github.replace("github.com", "avatars.githubusercontent.com") + ".png" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={SITE_CONFIG.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/john-smith-profile.jpg"
                  }}
                />
              </div>
              <div>
                <h2 className="font-medium">{SITE_CONFIG.name}</h2>
                <p className="text-sm text-blue-100">{SITE_CONFIG.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb and Search */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 dark:text-white font-medium">Blog</span>
          </div>
          <div className="w-full md:w-64 relative flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            {/* Mobile filter button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <CategoriesSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar - Desktop */}
          <div className="w-full lg:w-1/4 hidden lg:block">
            <CategoriesSidebar />
          </div>

          {/* Blog Posts */}
          <div className="w-full lg:w-3/4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts?.map((post) => (
                  <motion.div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="h-48 relative">
                      {post.image ? (
                        <Image
                          src={post.image || `https://placehold.co/600x400?text=${post.category}`}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-20">
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{post.read_time}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <Image
                              src={post.author_image || "https://placehold.co/600x400?text=SR"}
                              alt={post.author}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline underline-offset-2">
                          Read more
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog Post Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 md:p-6">
          {selectedPost && (
            <>
              <DialogHeader className="border-b border-gray-200 dark:border-gray-700">
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl">{selectedPost.title}</DialogTitle>
                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <div className="flex items-center mr-4 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{selectedPost.read_time}</span>
                  </div>
                </div>
              </DialogHeader>
              <div className="mt-2">
                {renderBlogContent(selectedPost.content)}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={selectedPost.author_image || "/john-smith-profile.jpg"}
                        alt={selectedPost.author}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{selectedPost.author}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{SITE_CONFIG.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


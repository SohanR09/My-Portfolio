"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  CheckCircle2,
  Home,
  ImageIcon,
  Loader2,
  Upload,
  ChevronRight,
  Type,
  Save,
  LinkIcon,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isEqual } from "@/utils/text-utils"

interface HeroImage {
  path: string
  filename: string
  url: string
  size?: number
  lastUpdated?: string
}

interface TextContent {
  headerName: string
  heroName: string
  heroSubtitle: string
  lastUpdated?: string
}

interface SocialLinks {
  linkedin: string
  github: string
  scholar: string
  email: string
  lastUpdated?: string
}

export default function AppearancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentHeroImage, setCurrentHeroImage] = useState<HeroImage | null>(null)
  const [textContent, setTextContent] = useState<TextContent>({
    headerName: "",
    heroName: "",
    heroSubtitle: "",
  })
  const [originalTextContent, setOriginalTextContent] = useState<TextContent>({
    headerName: "",
    heroName: "",
    heroSubtitle: "",
  })
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    linkedin: "",
    github: "",
    scholar: "",
    email: "",
  })
  const [originalSocialLinks, setOriginalSocialLinks] = useState<SocialLinks>({
    linkedin: "",
    github: "",
    scholar: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingText, setIsSavingText] = useState(false)
  const [isSavingSocial, setIsSavingSocial] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Clear success message after 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (success) {
      timeoutId = setTimeout(() => {
        setSuccess(null)
      }, 5000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [success])

  // Fetch current hero image, text content, and social links on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch hero image
        const imageResponse = await fetch("/api/site-settings/hero-image")
        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          setCurrentHeroImage(imageData)
        }

        // Fetch text content
        const textResponse = await fetch("/api/site-settings/text-content")
        if (textResponse.ok) {
          const textData = await textResponse.json()
          setTextContent(textData)
          setOriginalTextContent(textData)
        }

        // Fetch social links
        const socialResponse = await fetch("/api/site-settings/social-links")
        if (socialResponse.ok) {
          const socialData = await socialResponse.json()
          setSocialLinks(socialData)
          setOriginalSocialLinks(socialData)
        }
      } catch (err) {
        console.error("Error fetching appearance data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image file")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/site-settings/hero-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      setCurrentHeroImage(data)
      setSuccess("Hero image updated successfully")

      // Clear the selected file and preview
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Refresh the page to show the updated image
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTextContent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveText = async () => {
    setIsSavingText(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/site-settings/text-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textContent),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save text content")
      }

      const updatedData = await response.json()
      setOriginalTextContent(updatedData)
      setSuccess("Text content updated successfully")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save text content")
    } finally {
      setIsSavingText(false)
    }
  }

  const handleSaveSocial = async () => {
    setIsSavingSocial(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/site-settings/social-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(socialLinks),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save social links")
      }

      const updatedData = await response.json()
      setOriginalSocialLinks(updatedData)
      setSuccess("Social links updated successfully")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save social links")
    } finally {
      setIsSavingSocial(false)
    }
  }

  // Check if text content has changed
  const hasTextContentChanged = !isEqual(textContent, originalTextContent)

  // Check if social links have changed
  const hasSocialLinksChanged = !isEqual(socialLinks, originalSocialLinks)

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-900 dark:text-white font-medium">Appearance</span>
          </li>
        </ol>
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appearance Settings</h1>
      </div>

      <Tabs defaultValue="hero-image" className="flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="hero-image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Hero Image
          </TabsTrigger>
          <TabsTrigger value="text-content" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Text Content
          </TabsTrigger>
          <TabsTrigger value="social-links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero-image" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Hero Image
              </CardTitle>
              <CardDescription>
                Update the profile image displayed in the hero section of your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current hero image */}
              {currentHeroImage && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Current Image</h3>
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      src={currentHeroImage.url || "/placeholder.svg"}
                      alt="Current hero image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Last updated:{" "}
                    {currentHeroImage.lastUpdated ? new Date(currentHeroImage.lastUpdated).toLocaleString() : "Unknown"}
                  </p>
                </div>
              )}

              {/* Upload new image */}
              <div>
                <Label htmlFor="hero-image" className="block mb-2">
                  Upload New Image
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="hero-image"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="max-w-md"
                  />
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Image preview */}
              {previewUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image src={previewUrl || "/placeholder.svg"} alt="Image preview" fill className="object-cover" />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">Recommended: Upload a square image for best results</p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="text-content" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-blue-600" />
                Text Content
              </CardTitle>
              <CardDescription>Update the text displayed in the header and hero sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headerName">Header Name</Label>
                  <Input
                    id="headerName"
                    name="headerName"
                    placeholder="Name shown in the header when scrolled"
                    value={textContent.headerName}
                    onChange={handleTextChange}
                  />
                  <p className="text-xs text-gray-500">This is displayed in the header when scrolled down</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroName">Hero Name</Label>
                  <Input
                    id="heroName"
                    name="heroName"
                    placeholder="Your full name in the hero section"
                    value={textContent.heroName}
                    onChange={handleTextChange}
                  />
                  <p className="text-xs text-gray-500">This is the main name displayed in the hero section</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    name="heroSubtitle"
                    placeholder="Your title or subtitle"
                    value={textContent.heroSubtitle}
                    onChange={handleTextChange}
                  />
                  <p className="text-xs text-gray-500">This is displayed below your name in the hero section</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveText}
                disabled={isSavingText || !hasTextContentChanged}
                className="flex items-center gap-2"
              >
                {isSavingText ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social-links" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                Social Links
              </CardTitle>
              <CardDescription>Update your social media profiles and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={socialLinks.linkedin}
                    onChange={handleSocialChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    name="github"
                    placeholder="https://github.com/yourusername"
                    value={socialLinks.github}
                    onChange={handleSocialChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scholar">Google Scholar URL</Label>
                  <Input
                    id="scholar"
                    name="scholar"
                    placeholder="https://scholar.google.com/citations?user=youruserid"
                    value={socialLinks.scholar}
                    onChange={handleSocialChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={socialLinks.email}
                    onChange={handleSocialChange}
                  />
                  <p className="text-xs text-gray-500">This email will be displayed in the contact section</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSocial}
                disabled={isSavingSocial || !hasSocialLinksChanged}
                className="flex items-center gap-2"
              >
                {isSavingSocial ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}


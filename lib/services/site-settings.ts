import { createServerSupabaseClient } from "../supabase/server"
import { getSupabaseClient } from "../supabase/client"

export type SiteSettingKey = "hero_image" | "site_info" | "contact_info" | "text_content" | "social_links"

export interface SiteSetting<T = any> {
  key: SiteSettingKey
  value: T
}

export interface HeroImageSetting {
  path: string
  filename: string
  url: string // Signed URL with long expiry
  size?: number
  lastUpdated?: string
}

export interface TextContentSetting {
  headerName: string
  heroName: string
  heroSubtitle: string
  lastUpdated?: string
}

export interface SocialLinksSetting {
  linkedin: string
  github: string
  scholar: string
  email: string
  lastUpdated?: string
}

// Server-side functions
export async function getSetting<T = any>(key: SiteSettingKey): Promise<T | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single()

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null
    }
    throw error
  }

  return data?.value as T
}

export async function getHeroImage(): Promise<HeroImageSetting | null> {
  return getSetting<HeroImageSetting>("hero_image")
}

export async function getTextContent(): Promise<TextContentSetting | null> {
  const textContent = await getSetting<TextContentSetting>("text_content")

  // Return default values if not set
  if (!textContent) {
    return {
      headerName: "Sohan",
      heroName: "Sohan Rathod",
      heroSubtitle: "Full Stack Developer",
      lastUpdated: new Date().toISOString(),
    }
  }

  return textContent
}

export async function getSocialLinks(): Promise<SocialLinksSetting | null> {
  const socialLinks = await getSetting<SocialLinksSetting>("social_links")

  // Return default values if not set
  if (!socialLinks) {
    return {
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
      scholar: "https://scholar.google.com/citations?user=userid",
      email: "your.email@example.com",
      lastUpdated: new Date().toISOString(),
    }
  }

  return socialLinks
}

// Client-side functions
export async function updateSetting<T = any>(key: SiteSettingKey, value: T): Promise<void> {
  const supabase = getSupabaseClient()

  // Check if setting exists
  const { data: existingData } = await supabase.from("site_settings").select("id").eq("key", key).single()

  if (existingData) {
    // Update existing setting
    const { error } = await supabase.from("site_settings").update({ value }).eq("key", key)

    if (error) throw error
  } else {
    // Insert new setting
    const { error } = await supabase.from("site_settings").insert({ key, value })

    if (error) throw error
  }
}

export async function updateTextContent(textContent: Partial<TextContentSetting>): Promise<TextContentSetting> {
  const currentContent = await getTextContent()
  const updatedContent = {
    ...currentContent,
    ...textContent,
    lastUpdated: new Date().toISOString(),
  }

  await updateSetting("text_content", updatedContent)
  return updatedContent
}

export async function updateSocialLinks(socialLinks: Partial<SocialLinksSetting>): Promise<SocialLinksSetting> {
  const currentLinks = await getSocialLinks()
  const updatedLinks = {
    ...currentLinks,
    ...socialLinks,
    lastUpdated: new Date().toISOString(),
  }

  await updateSetting("social_links", updatedLinks)
  return updatedLinks
}

export async function uploadHeroImage(file: File): Promise<HeroImageSetting> {
  const supabase = getSupabaseClient()

  // Generate a unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `hero-image-${Date.now()}.${fileExt}`
  const filePath = `hero/${fileName}`

  // Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (uploadError) throw uploadError

  // Generate a signed URL with a long expiry (5 years)
  // 5 years in seconds = 5 * 365 * 24 * 60 * 60 = 157680000
  const { data: signedUrlData } = await supabase.storage.from("portfolio").createSignedUrl(filePath, 157680000)

  if (!signedUrlData?.signedUrl) {
    throw new Error("Failed to generate signed URL")
  }

  // Create the hero image setting
  const heroImageSetting: HeroImageSetting = {
    path: filePath,
    filename: fileName,
    url: signedUrlData.signedUrl,
    size: file.size,
    lastUpdated: new Date().toISOString(),
  }

  // Update the setting in the database
  await updateSetting("hero_image", heroImageSetting)

  return heroImageSetting
}


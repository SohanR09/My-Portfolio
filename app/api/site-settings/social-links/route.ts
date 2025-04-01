import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSocialLinks, type SocialLinksSetting } from "@/lib/services/site-settings"

export async function GET(request: NextRequest) {
  try {
    const socialLinks = await getSocialLinks()
    return NextResponse.json(socialLinks)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.linkedin && !data.github && !data.scholar && !data.email) {
      return NextResponse.json({ error: "At least one field must be provided" }, { status: 400 })
    }

    // Get current social links
    const supabase = createServerSupabaseClient()
    const { data: existingData, error: fetchError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "social_links")
      .single()

    let currentLinks: SocialLinksSetting = {
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
      scholar: "https://scholar.google.com/citations?user=userid",
      email: "your.email@example.com",
      lastUpdated: new Date().toISOString(),
    }

    if (!fetchError && existingData) {
      currentLinks = existingData.value as SocialLinksSetting
    }

    // Update with new values
    const updatedLinks = {
      ...currentLinks,
      ...(data.linkedin && { linkedin: data.linkedin }),
      ...(data.github && { github: data.github }),
      ...(data.scholar && { scholar: data.scholar }),
      ...(data.email && { email: data.email }),
      lastUpdated: new Date().toISOString(),
    }

    // Save to database
    const { error: updateError } = await supabase.from("site_settings").upsert(
      {
        key: "social_links",
        value: updatedLinks,
      },
      {
        onConflict: "key",
      },
    )

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(updatedLinks)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


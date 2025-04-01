import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getTextContent, type TextContentSetting } from "@/lib/services/site-settings"

export async function GET(request: NextRequest) {
  try {
    const textContent = await getTextContent()
    return NextResponse.json(textContent)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.headerName && !data.heroName && !data.heroSubtitle) {
      return NextResponse.json({ error: "At least one field must be provided" }, { status: 400 })
    }

    // Get current text content
    const supabase = createServerSupabaseClient()
    const { data: existingData, error: fetchError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "text_content")
      .single()

    let currentContent: TextContentSetting = {
      headerName: "Sohan",
      heroName: "Sohan Rathod",
      heroSubtitle: "Full Stack Developer",
      lastUpdated: new Date().toISOString(),
    }

    if (!fetchError && existingData) {
      currentContent = existingData.value as TextContentSetting
    }

    // Update with new values
    const updatedContent = {
      ...currentContent,
      ...(data.headerName && { headerName: data.headerName }),
      ...(data.heroName && { heroName: data.heroName }),
      ...(data.heroSubtitle && { heroSubtitle: data.heroSubtitle }),
      lastUpdated: new Date().toISOString(),
    }

    // Save to database
    const { error: updateError } = await supabase.from("site_settings").upsert(
      {
        key: "text_content",
        value: updatedContent,
      },
      {
        onConflict: "key",
      },
    )

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(updatedContent)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getHeroImage } from "@/lib/services/site-settings"

export async function GET(request: NextRequest) {
  try {
    const heroImage = await getHeroImage()

    if (!heroImage) {
      return NextResponse.json({ error: "Hero image not found" }, { status: 404 })
    }

    return NextResponse.json(heroImage)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const fileType = file.type
    if (!fileType.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Upload to Supabase Storage
    const supabase = createServerSupabaseClient()

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `hero-image-${Date.now()}.${fileExt}`
    const filePath = `hero/${fileName}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    // Generate a signed URL with a long expiry (5 years)
    // 5 years in seconds = 5 * 365 * 24 * 60 * 60 = 157680000
    const { data: signedUrlData } = await supabase.storage.from("portfolio").createSignedUrl(filePath, 157680000)

    if (!signedUrlData?.signedUrl) {
      throw new Error("Failed to generate signed URL")
    }

    // Update the hero_image setting
    const heroImageSetting = {
      path: filePath,
      filename: fileName,
      url: signedUrlData.signedUrl,
      size: file.size,
      lastUpdated: new Date().toISOString(),
    }

    const { error: settingError } = await supabase.from("site_settings").upsert(
      {
        key: "hero_image",
        value: heroImageSetting,
      },
      {
        onConflict: "key",
      },
    )

    if (settingError) {
      throw settingError
    }

    return NextResponse.json(heroImageSetting)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


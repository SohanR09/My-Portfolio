import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create updated_at function
    const { error: functionError } = await supabase.rpc("update_updated_at_column")
    if (functionError) {
      console.error("Error creating updated_at function:", functionError)
    }

    // Create tables
    const tables = [
      "create_about_items_table",
      "create_skills_table",
      "create_experiences_table",
      "create_education_table",
      "create_projects_table",
      "create_blog_categories_table",
      "create_blog_posts_table",
    ]

    for (const table of tables) {
      const { error } = await supabase.rpc(table)
      if (error) {
        console.error(`Error creating ${table}:`, error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Database tables created successfully" })
  } catch (error: any) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


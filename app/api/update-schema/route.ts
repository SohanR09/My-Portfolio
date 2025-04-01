import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { updateSchemaSQL } from "@/db/update-schema"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Execute the SQL to update the schema
    await supabase.rpc("execute_sql", { sql: updateSchemaSQL })

    return NextResponse.json({ success: true, message: "Schema updated successfully" })
  } catch (error) {
    console.error("Error updating schema:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}


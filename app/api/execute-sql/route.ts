import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ success: false, error: "SQL query is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Execute the SQL query
    const { error } = await supabase.rpc("execute_sql", { sql })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "SQL executed successfully" })
  } catch (error: any) {
    console.error("Error executing SQL:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


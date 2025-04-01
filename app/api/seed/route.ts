import { NextResponse } from "next/server"
import { seedAdminUser } from "@/lib/supabase/seed-user"

export async function GET() {
  try {
    // Seed the admin user
    const { success, message, error } = await seedAdminUser()

    if (!success) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error("Error seeding data:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


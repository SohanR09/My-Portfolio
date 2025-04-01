import { type NextRequest, NextResponse } from "next/server"
import {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
} from "@/lib/services/education"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      const education = await getEducationById(id)
      return NextResponse.json(education)
    } else {
      const educations = await getEducations()
      return NextResponse.json(educations)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const education = await createEducation(data)
    return NextResponse.json(education)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...rest } = data

    if (!id) {
      return NextResponse.json({ error: "Education ID is required" }, { status: 400 })
    }

    const education = await updateEducation(id, rest)
    return NextResponse.json(education)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Education ID is required" }, { status: 400 })
    }

    await deleteEducation(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


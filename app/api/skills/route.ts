import { type NextRequest, NextResponse } from "next/server"
import { createSkill, getSkills, getSkillById, updateSkill, deleteSkill } from "@/lib/services/skills"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      const skill = await getSkillById(id)
      return NextResponse.json(skill)
    } else {
      const skills = await getSkills()
      return NextResponse.json(skills)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const skill = await createSkill(data)
    return NextResponse.json(skill)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...rest } = data

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 })
    }

    const skill = await updateSkill(id, rest)
    return NextResponse.json(skill)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 })
    }

    await deleteSkill(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


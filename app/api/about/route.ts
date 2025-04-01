import { type NextRequest, NextResponse } from "next/server"
import {
  createAboutItem,
  getAboutItems,
  getAboutItemById,
  updateAboutItem,
  deleteAboutItem,
} from "@/lib/services/about-items"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      const aboutItem = await getAboutItemById(id)
      return NextResponse.json(aboutItem)
    } else {
      const aboutItems = await getAboutItems()
      return NextResponse.json(aboutItems)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const aboutItem = await createAboutItem(data)
    return NextResponse.json(aboutItem)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...rest } = data

    if (!id) {
      return NextResponse.json({ error: "About item ID is required" }, { status: 400 })
    }

    const aboutItem = await updateAboutItem(id, rest)
    return NextResponse.json(aboutItem)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "About item ID is required" }, { status: 400 })
    }

    await deleteAboutItem(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


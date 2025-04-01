import { type NextRequest, NextResponse } from "next/server"
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  getBlogPostsByCategory,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/services/blog"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    const categoryId = url.searchParams.get("categoryId")

    if (id) {
      const post = await getBlogPostById(id)
      return NextResponse.json(post)
    } else if (categoryId) {
      const posts = await getBlogPostsByCategory(categoryId)
      return NextResponse.json(posts)
    } else {
      const posts = await getBlogPosts()
      return NextResponse.json(posts)
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const post = await createBlogPost(data)
    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...rest } = data

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const post = await updateBlogPost(id, rest)
    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    await deleteBlogPost(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


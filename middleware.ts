import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { getSupabaseClient } from "./lib/supabase/client"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = getSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for the admin area (except login page)
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"

  // If trying to access admin routes without being logged in
  if (isAdminRoute && !isLoginPage && !session) {
    const redirectUrl = new URL("/admin/login", request.url)
    // return NextResponse.redirect(redirectUrl)
  }

  // If already logged in and trying to access login page
  if (isLoginPage && session) {
    const redirectUrl = new URL("/admin", request.url)
    // return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Only run middleware on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}


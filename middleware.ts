import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = await createSupabaseMiddlewareClient(req, res)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: userProfile } = await supabase.from("users").select("role").eq("id", user?.id).single()

  const userRole = userProfile?.role || null

  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicPaths = ["/", "/signin", "/signup", "/forgot-password", "/about", "/services", "/contact", "/home"]

  // Redirect authenticated users from auth pages to their dashboard
  if (user && publicPaths.includes(pathname)) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    } else if (userRole === "company") {
      return NextResponse.redirect(new URL("/company", req.url))
    } else if (userRole === "user") {
      return NextResponse.redirect(new URL("/client", req.url))
    }
  }

  // Protect authenticated routes
  if (!user && !publicPaths.includes(pathname)) {
    // If not authenticated and trying to access a protected route, redirect to signin
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Role-based access control for authenticated users
  if (user) {
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    if (pathname.startsWith("/company") && userRole !== "company" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    if (pathname.startsWith("/client") && userRole !== "user" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files in the /public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}

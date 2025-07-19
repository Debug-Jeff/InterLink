import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import type { NextResponse, NextRequest } from "next/server"

export async function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession() // Refresh the session
  return supabase
}

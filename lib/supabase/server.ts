import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies() ?? null

  // Gracefully handle cases (like Server Actions) where `cookies()` is
  // unavailable by falling back to no-op cookie handlers.
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore?.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        if (!cookieStore) return
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* ignore outside Server Components / Route Handlers */
        }
      },
      remove: (name: string, options: CookieOptions) => {
        if (!cookieStore) return
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          /* ignore outside Server Components / Route Handlers */
        }
      },
    },
  })
}

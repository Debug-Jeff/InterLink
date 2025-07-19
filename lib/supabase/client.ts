import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Create a Supabase client for use in the browser.
  // This client is used for client-side interactions, like real-time subscriptions.
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

/**
 * OAuth Callback Handler
 * Handles authentication callbacks from OAuth providers and email confirmations
 * This is critical for completing the authentication flow
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(error_description || error)}`
    );
  }

  // Handle missing code parameter
  if (!code) {
    console.error("Missing code parameter in OAuth callback");
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent("Invalid callback request")}`
    );
  }

  try {
    const cookieStore = cookies();
    
    // Create Supabase client for server-side auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Exchange the code for a session
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error("Error exchanging code for session:", authError);
      return NextResponse.redirect(
        `${origin}/signin?error=${encodeURIComponent(authError.message)}`
      );
    }

    // Get user profile to determine role-based redirect
    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        // Still redirect to default page if profile fetch fails
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Role-based redirects
      let redirectPath = next;
      if (profile?.role === "admin") {
        redirectPath = "/admin";
      } else if (profile?.role === "company") {
        redirectPath = "/company";
      } else if (profile?.role === "user") {
        redirectPath = "/client";
      }

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }

    // Default redirect if no user data
    return NextResponse.redirect(`${origin}${next}`);

  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent("An unexpected error occurred")}`
    );
  }
}
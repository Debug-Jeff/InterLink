"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * All actions return the same shape so the auth pages can
 * display a toast with `state.message` and check `state.success`.
 */
type ActionResponse = {
  success: boolean
  message: string
  data?: any // Optional data for successful operations
}

export async function signIn(prevState: any, formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign-in error:", error.message)
    return { success: false, message: error.message }
  }

  // Redirect to the root, middleware will handle role-based redirection
  redirect("/")
}

export async function signUp(prevState: any, formData: FormData): Promise<ActionResponse> {
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string // 'user', 'company', or 'admin'
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Sign-up error:", error.message)
    return { success: false, message: error.message }
  }

  // Insert into public.users table with the specified role
  const { error: dbError } = await supabase.from("users").insert({
    id: data.user?.id,
    full_name: fullName,
    email: email,
    role: role,
  })

  if (dbError) {
    console.error("Database insert error:", dbError.message)
    // Optionally, you might want to delete the auth user if the DB insert fails
    await supabase.auth.admin.deleteUser(data.user?.id!)
    return { success: false, message: dbError.message }
  }

  return {
    success: true,
    message: "Sign up successful! Please check your email for a confirmation link.",
  }
}

export async function signOut(): Promise<ActionResponse> {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign-out error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/signin")
}

export async function resetPassword(prevState: any, formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback?next=/client/settings/password`, // Redirect to a page where user can set new password
  })

  if (error) {
    console.error("Password reset error:", error.message)
    return { success: false, message: error.message }
  }

  return {
    success: true,
    message: "Password reset email sent! Check your inbox for instructions.",
  }
}

export async function updatePassword(prevState: any, formData: FormData): Promise<ActionResponse> {
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error("Update password error:", error.message)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Your password has been updated successfully!" }
}

export async function updateCompanyProfile(prevState: any, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const phoneNumber = formData.get("phoneNumber") as string

  try {
    // Update auth.users table (for email and user_metadata)
    const { error: authError } = await supabase.auth.updateUser({
      email: email,
      data: {
        full_name: fullName,
        phone_number: phoneNumber, // Store phone number in user_metadata
      },
    })

    if (authError) {
      throw authError
    }

    // Update public.users table (for full_name and email)
    const { error: dbError } = await supabase
      .from("users")
      .update({ full_name: fullName, email: email })
      .eq("id", user.id)

    if (dbError) {
      throw dbError
    }

    revalidatePath("/company/settings/profile")
    return { success: true, message: "Company profile updated successfully!" }
  } catch (error: any) {
    console.error("Error updating company profile:", error.message)
    return { success: false, message: error.message || "Failed to update company profile." }
  }
}

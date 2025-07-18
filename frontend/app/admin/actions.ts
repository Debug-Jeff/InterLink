"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

/**
 * All actions return the same shape so the auth pages can
 * display a toast with `state.message` and check `state.success`.
 */
type ActionResponse = {
  success: boolean
  message: string
  data?: any // Optional data for successful operations
}

export async function addUser(formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const role = formData.get("role") as string

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Automatically confirm email for admin-created users
    user_metadata: { full_name: fullName },
  })

  if (error) {
    console.error("Error creating user:", error.message)
    return { success: false, message: error.message }
  }

  // Update the public.users table with the role
  const { error: updateError } = await supabase.from("users").update({ role }).eq("id", data.user.id)

  if (updateError) {
    console.error("Error updating user role:", updateError.message)
    return { success: false, message: updateError.message }
  }

  revalidatePath("/admin/users")
  return { success: true, message: "User added successfully!" }
}

export async function updateUser(formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const userId = formData.get("id") as string
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as string

  // Update auth.users metadata
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    email,
    user_metadata: { full_name: fullName },
  })

  if (authError) {
    console.error("Error updating auth user:", authError.message)
    return { success: false, message: authError.message }
  }

  // Update public.users table
  const { error: dbError } = await supabase.from("users").update({ full_name: fullName, email, role }).eq("id", userId)

  if (dbError) {
    console.error("Error updating user profile:", dbError.message)
    return { success: false, message: dbError.message }
  }

  revalidatePath("/admin/users")
  return { success: true, message: "User updated successfully!" }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
  const supabase = createClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error("Error deleting user:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/users")
  return { success: true, message: "User deleted successfully!" }
}

export async function updateAppSettings(prevState: any, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.role !== "admin") {
    return { success: false, message: "Unauthorized access." }
  }

  const platformName = formData.get("platformName") as string
  const adminContactEmail = formData.get("adminContactEmail") as string
  const welcomeMessage = formData.get("welcomeMessage") as string

  try {
    // Update platform_name
    const { error: nameError } = await supabase
      .from("app_settings")
      .upsert({ key: "platform_name", value: platformName }, { onConflict: "key" })
    if (nameError) throw nameError

    // Update admin_contact_email
    const { error: emailError } = await supabase
      .from("app_settings")
      .upsert({ key: "admin_contact_email", value: adminContactEmail }, { onConflict: "key" })
    if (emailError) throw emailError

    // Update welcome_message
    const { error: messageError } = await supabase
      .from("app_settings")
      .upsert({ key: "welcome_message", value: welcomeMessage }, { onConflict: "key" })
    if (messageError) throw messageError

    revalidatePath("/admin/settings/general")
    return { success: true, message: "Platform settings updated successfully!" }
  } catch (error: any) {
    console.error("Error updating app settings:", error.message)
    return { success: false, message: error.message || "Failed to update settings." }
  }
}

// New: Server action to add content
export async function addContent(prevState: any, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const contentBody = formData.get("contentBody") as string
  const status = formData.get("status") as string

  const { data, error } = await supabase
    .from("content")
    .insert({
      title,
      type,
      content_body: contentBody,
      status,
      author_id: user.id, // Set author to the current authenticated user
    })
    .select("*, users(full_name)") // Select the inserted row with author name
    .single()

  if (error) {
    console.error("Error adding content:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/content")
  return { success: true, message: "Content added successfully!", data }
}

// New: Server action to update content
export async function updateContent(prevState: any, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const contentBody = formData.get("contentBody") as string
  const status = formData.get("status") as string

  const { data, error } = await supabase
    .from("content")
    .update({
      title,
      type,
      content_body: contentBody,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*, users(full_name)") // Select the updated row with author name
    .single()

  if (error) {
    console.error("Error updating content:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/content")
  return { success: true, message: "Content updated successfully!", data }
}

// New: Server action to delete content
export async function deleteContent(id: string): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const { error } = await supabase.from("content").delete().eq("id", id)

  if (error) {
    console.error("Error deleting content:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/content")
  return { success: true, message: "Content deleted successfully!" }
}

// New: Server action to toggle content status
export async function toggleContentStatus(id: string, currentStatus: string): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const newStatus = currentStatus === "Published" ? "Draft" : "Published"

  const { data, error } = await supabase
    .from("content")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, users(full_name)")
    .single()

  if (error) {
    console.error("Error toggling content status:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/admin/content")
  return { success: true, message: `Content status changed to ${newStatus}!`, data }
}

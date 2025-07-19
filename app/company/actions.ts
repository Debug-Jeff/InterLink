"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

type ActionResponse = {
  success: boolean
  message: string
  data?: any
}

export async function updateCompanyProfile(prevState: any, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const companyName = formData.get("companyName") as string
  const companyEmail = formData.get("companyEmail") as string
  const companyPhone = formData.get("companyPhone") as string

  try {
    // Update auth.users email and user_metadata (for full_name and phone)
    const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
      email: companyEmail,
      user_metadata: {
        full_name: companyName,
        phone_number: companyPhone, // Store phone number in user_metadata
      },
    })

    if (authError) {
      console.error("Error updating auth user profile:", authError.message)
      return { success: false, message: authError.message }
    }

    // Update public.users table (full_name and email)
    const { error: dbError } = await supabase
      .from("users")
      .update({
        full_name: companyName,
        email: companyEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (dbError) {
      console.error("Error updating public user profile:", dbError.message)
      return { success: false, message: dbError.message }
    }

    revalidatePath("/company/settings/profile")
    revalidatePath("/company/layout") // Revalidate layout to update sidebar/navbar name
    return { success: true, message: "Company profile updated successfully!" }
  } catch (error: any) {
    console.error("Unexpected error updating company profile:", error.message)
    return { success: false, message: error.message || "Failed to update company profile." }
  }
}

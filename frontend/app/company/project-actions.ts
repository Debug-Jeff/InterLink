"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function addProject(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const clientId = formData.get("clientId") as string
  const status = formData.get("status") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const budget = Number.parseFloat(formData.get("budget") as string)

  const { data, error } = await supabase
    .from("projects")
    .insert({
      company_id: user.id,
      name,
      description,
      client_id: clientId,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
      budget: isNaN(budget) ? null : budget,
    })
    .select()
    .single() // Select the inserted row

  if (error) {
    console.error("Error adding project:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/company/projects")
  return { success: true, message: "Project added successfully!", data }
}

export async function updateProject(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const clientId = formData.get("clientId") as string
  const status = formData.get("status") as string
  const startDate = formData.get("startDate") as string
  const endDate = formData.get("endDate") as string
  const budget = Number.parseFloat(formData.get("budget") as string)

  const { data, error } = await supabase
    .from("projects")
    .update({
      name,
      description,
      client_id: clientId,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
      budget: isNaN(budget) ? null : budget,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("company_id", user.id) // Ensure only owner can update
    .select() // Select the updated row
    .single()

  if (error) {
    console.error("Error updating project:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/company/projects")
  revalidatePath(`/company/projects/${id}`) // Revalidate the detail page
  return { success: true, message: "Project updated successfully!", data }
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const { error } = await supabase.from("projects").delete().eq("id", id).eq("company_id", user.id) // Ensure only owner can delete

  if (error) {
    console.error("Error deleting project:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/company/projects")
  return { success: true, message: "Project deleted successfully!" }
}

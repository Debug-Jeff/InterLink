"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function addClient(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const name = formData.get("name") as string
  const contactEmail = formData.get("contactEmail") as string
  const contactPerson = formData.get("contactPerson") as string
  const status = formData.get("status") as string

  const { data, error } = await supabase
    .from("clients")
    .insert({
      company_id: user.id,
      name,
      contact_email: contactEmail,
      contact_person: contactPerson,
      status,
    })
    .select()
    .single() // Select the inserted row

  if (error) {
    console.error("Error adding client:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/company/clients")
  return { success: true, message: "Client added successfully!", data }
}

export async function updateClient(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const contactEmail = formData.get("contactEmail") as string
  const contactPerson = formData.get("contactPerson") as string
  const status = formData.get("status") as string

  const { data, error } = await supabase
    .from("clients")
    .update({
      name,
      contact_email: contactEmail,
      contact_person: contactPerson,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("company_id", user.id) // Ensure only owner can update
    .select() // Select the updated row
    .single()

  if (error) {
    console.error("Error updating client:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/company/clients")
  revalidatePath(`/company/clients/${id}`) // Revalidate the detail page
  return { success: true, message: "Client updated successfully!", data }
}

export async function deleteClient(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const { error } = await supabase.from("clients").delete().eq("id", id).eq("company_id", user.id) // Ensure only owner can delete

  if (error) {
    console.error("Error deleting client:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/company/clients")
  return { success: true, message: "Client deleted successfully!" }
}

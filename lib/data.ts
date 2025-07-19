import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"
import { unstable_noStore as noStore } from "next/cache"

// --- Server-side data fetching functions ---

export async function getAuthenticatedUser() {
  noStore() // Opt-out of Next.js data cache for dynamic user data
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error.message)
    return null
  }
  return data
}

// New: Fetch company profile (which is essentially a user profile with role 'company')
export async function getCompanyProfile(companyId: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("users").select("*").eq("id", companyId).single()

  if (error) {
    console.error("Error fetching company profile:", error.message)
    return null
  }
  return data
}

export async function getAllUsers() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all users:", error.message)
    return []
  }
  return data
}

// New: Fetch a single client by ID
export async function getClientById(clientId: string) {
  noStore()
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Or throw an error for unauthenticated access
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .eq("company_id", user.id) // Ensure client belongs to the authenticated company
    .single()

  if (error) {
    console.error("Error fetching client by ID:", error.message)
    return null
  }
  return data
}

// New: Fetch a single project by ID
export async function getProjectById(projectId: string) {
  noStore()
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // Or throw an error for unauthenticated access
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*, clients(name, contact_email, contact_person)") // Also fetch associated client details
    .eq("id", projectId)
    .eq("company_id", user.id) // Ensure project belongs to the authenticated company
    .single()

  if (error) {
    console.error("Error fetching project by ID:", error.message)
    return null
  }
  return data
}

// New: Fetch projects associated with a specific client
export async function getProjectsByClientId(clientId: string) {
  noStore()
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, start_date, end_date")
    .eq("client_id", clientId)
    .eq("company_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects by client ID:", error.message)
    return []
  }
  return data
}

export async function getAllClients(companyId: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error.message)
    return []
  }
  return data
}

export async function getAllProjects(companyId: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*, clients(name)") // Select project fields and client name
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error.message)
    return []
  }
  return data
}

// Dummy data fetching for dashboards (replace with real data from your DB)
export async function getCompanyDashboardStats() {
  noStore()
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      activeClients: 0,
      ongoingProjects: 0,
      revenueSummary: 0,
      newInquiries: 0,
      averageProjectDuration: "0 days",
      clientSatisfaction: 0,
      projectStatusBreakdown: {
        completed: 0,
        in_progress: 0,
        pending: 0,
        total: 0,
      },
    }
  }

  const companyId = user.id

  // Active Clients
  const { count: clientsCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyId)

  // Ongoing Projects
  const { count: projectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyId)
    .neq("status", "completed") // Count projects that are not completed

  // Revenue Summary (Placeholder)
  const revenue = 125000 // Placeholder

  // New Inquiries (Placeholder)
  const { count: newInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new") // Assuming an 'inquiries' table

  // Fetch all projects for calculations
  const { data: projectsData, error: projectsError } = await supabase
    .from("projects")
    .select("status, start_date, end_date")
    .eq("company_id", companyId)

  let averageProjectDuration = "N/A"
  const projectStatusBreakdown = {
    completed: 0,
    in_progress: 0,
    pending: 0,
    total: projectsData?.length || 0,
  }

  if (projectsData && projectsData.length > 0) {
    let totalDurationDays = 0
    let completedProjectsCount = 0

    projectsData.forEach((project) => {
      if (project.status === "completed" && project.start_date && project.end_date) {
        const startDate = new Date(project.start_date)
        const endDate = new Date(project.end_date)
        const durationMs = endDate.getTime() - startDate.getTime()
        const durationDays = durationMs / (1000 * 60 * 60 * 24)
        totalDurationDays += durationDays
        completedProjectsCount++
      }

      if (project.status === "completed") {
        projectStatusBreakdown.completed++
      } else if (project.status === "in_progress") {
        projectStatusBreakdown.in_progress++
      } else if (project.status === "pending") {
        projectStatusBreakdown.pending++
      }
    })

    if (completedProjectsCount > 0) {
      averageProjectDuration = `${(totalDurationDays / completedProjectsCount).toFixed(0)} days`
    }
  }

  // Client Satisfaction (Dummy data for now, would come from a ratings/feedback table)
  const clientSatisfaction = 4.7 // Placeholder

  return {
    activeClients: clientsCount || 0,
    ongoingProjects: projectsCount || 0,
    revenueSummary: revenue,
    newInquiries: newInquiries || 0,
    averageProjectDuration: averageProjectDuration,
    clientSatisfaction: clientSatisfaction,
    projectStatusBreakdown: projectStatusBreakdown,
  }
}

export async function getCompanyEngagementData() {
  noStore()
  const supabase = createClient()
  // Example: Fetch aggregated data for a chart
  // This would typically involve more complex SQL queries or a view
  const { data, error } = await supabase
    .from("engagement_metrics") // Assuming you have a table for this
    .select("month, clients, projects")
    .order("month_order", { ascending: true }) // Order by month if it's a string like Jan, Feb

  if (error) {
    console.error("Error fetching engagement data:", error.message)
    return []
  }
  return data
}

export async function getClientDashboardStats(userId: string) {
  noStore()
  const supabase = createClient()
  // Example: Fetch data specific to the logged-in client
  const { count: activeProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId)
    .eq("status", "in_progress")
  const { count: pendingApprovals } = await supabase
    .from("approvals")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId)
  const { count: newMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("read", false)
  const { count: upcomingDeadlines } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId)
    .eq("status", "in_progress")
    .gte("end_date", new Date().toISOString().split("T")[0]) // Projects ending today or later
    .lte("end_date", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) // Within next 7 days

  return {
    activeProjects: activeProjects || 0,
    pendingApprovals: pendingApprovals || 0,
    newMessages: newMessages || 0,
    overallProgress: 85, // Placeholder
    upcomingDeadlines: upcomingDeadlines || 0,
  }
}

export async function getAdminDashboardStats() {
  noStore()
  const supabase = createClient()

  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })
  const { count: activeInternships } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true })
    .eq("type", "Internship")
    .eq("status", "Published")
  const { count: newSignupsToday } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date().toISOString().split("T")[0])
  const { count: pendingReviews } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending Review")

  return {
    totalUsers: totalUsers || 0,
    activeInternships: activeInternships || 0,
    newSignupsToday: newSignupsToday || 0,
    pendingReviews: pendingReviews || 0,
  }
}

// New: Fetch all app settings
export async function getAppSettings() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("app_settings").select("*")

  if (error) {
    console.error("Error fetching app settings:", error.message)
    return {}
  }

  // Transform array of { key, value } into a single object { key: value }
  const settings: { [key: string]: any } = {}
  data.forEach((item) => {
    settings[item.key] = item.value
  })
  return settings
}

// New: Fetch all content items with author details
export async function getAllContent() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("content")
    .select("*, users(full_name)") // Select all content fields and the author's full_name
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all content:", error.message)
    return []
  }
  return data
}

// --- Client-side real-time data functions ---

export function subscribeToCompanyActivity(callback: (payload: any) => void) {
  const supabase = createBrowserSupabaseClient()
  const channel = supabase
    .channel("company_activity_feed")
    .on("postgres_changes", { event: "*", schema: "public", table: "company_activities" }, (payload) => {
      callback(payload.new) // Assuming payload.new contains the new row data
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToClientActivity(userId: string, callback: (payload: any) => void) {
  const supabase = createBrowserSupabaseClient()
  const channel = supabase
    .channel(`client_activity_feed_${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "client_activities", filter: `client_id=eq.${userId}` }, // Corrected filter to client_id
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

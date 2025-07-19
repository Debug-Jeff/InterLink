import type React from "react"
import { redirect } from "next/navigation"
import { getAuthenticatedUser, getUserProfile } from "@/lib/data"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser()
  const userProfile = user ? await getUserProfile(user.id) : null

  if (!user || userProfile?.role !== "admin") {
    redirect("/unauthorized")
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}

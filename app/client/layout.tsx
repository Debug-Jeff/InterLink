import type React from "react"
import { redirect } from "next/navigation"
import { getAuthenticatedUser, getUserProfile } from "@/lib/data"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { ClientNavbar } from "@/components/client/client-navbar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser()
  const userProfile = user ? await getUserProfile(user.id) : null

  if (!user || (userProfile?.role !== "user" && userProfile?.role !== "admin")) {
    redirect("/unauthorized")
  }

  return (
    <SidebarProvider>
      <ClientSidebar />
      <div className="flex flex-1 flex-col">
        <ClientNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}

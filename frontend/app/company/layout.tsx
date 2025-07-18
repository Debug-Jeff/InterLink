import type React from "react"
import { redirect } from "next/navigation"
import { getAuthenticatedUser, getUserProfile } from "@/lib/data"
import { CompanySidebar } from "@/components/company/company-sidebar"
import { CompanyNavbar } from "@/components/company/company-navbar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser()
  const userProfile = user ? await getUserProfile(user.id) : null

  if (!user || (userProfile?.role !== "company" && userProfile?.role !== "admin")) {
    redirect("/unauthorized")
  }

  return (
    <SidebarProvider>
      <CompanySidebar />
      <div className="flex flex-1 flex-col">
        <CompanyNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}

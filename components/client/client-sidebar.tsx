"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderKanban, LifeBuoy, Settings, LogOut } from "lucide-react" // Import LogOut icon

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/(auth)/actions" // Import signOut action
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client" // Client-side Supabase for user info

// Sample navigation items
const navItems = [
  {
    group: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/client",
        icon: LayoutDashboard,
      },
      {
        title: "My Projects",
        href: "/client/projects",
        icon: FolderKanban,
      },
    ],
  },
  {
    group: "Support & Settings",
    items: [
      {
        title: "Support",
        href: "/client/support",
        icon: LifeBuoy,
      },
      {
        title: "Settings",
        href: "/client/settings",
        icon: Settings,
      },
    ],
  },
]

export function ClientSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const [userFullName, setUserFullName] = useState("Loading...")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserFullName(user.user_metadata?.full_name || user.email?.split("@")[0] || "User")
        setUserEmail(user.email || "")
      }
    }
    fetchUser()
  }, [])

  return (
    <Sidebar collapsible="icon" side="left" className="border-r border-gray-100">
      <SidebarHeader className="p-4">
        <Link href="/client" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-logo-blue text-3xl">I</span>NTER<span className="text-logo-orange text-3xl">L</span>
            INK
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto p-2">
        {navItems.map((group, index) => (
          <SidebarGroup key={group.group} className="mb-4">
            <SidebarGroupLabel className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase group-data-[collapsible=icon]:hidden">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {index < navItems.length - 1 && (
              <Separator className="my-2 mx-2 bg-gray-100 group-data-[collapsible=icon]:hidden" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-gray-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-10 rounded-xl group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-8 w-8 mr-2 group-data-[collapsible=icon]:mr-0">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Client Avatar" />
                <AvatarFallback>
                  {userFullName.charAt(0).toUpperCase()}
                  {userFullName.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-800 group-data-[collapsible=icon]:hidden">{userFullName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

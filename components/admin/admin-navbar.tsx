"use client"

import { Bell, LogOut } from "lucide-react" // Import LogOut icon
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { signOut } from "@/app/(auth)/actions" // Import signOut action

export function AdminNavbar() {
  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm px-4 md:px-8">
      {/* Mobile Sidebar Trigger & App Logo */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <span className="text-2xl font-extrabold tracking-tight">
          <span className="text-logo-blue text-3xl">I</span>NTER<span className="text-logo-orange text-3xl">L</span>INK
        </span>
      </div>

      {/* Right side: Notifications & User Avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications Popover (simplified for now) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New user registered!</DropdownMenuItem>
            <DropdownMenuItem>Content update pending.</DropdownMenuItem>
            <DropdownMenuItem>View all notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Admin menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              {" "}
              {/* Call signOut action */}
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

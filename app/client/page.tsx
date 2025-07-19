"use client"

import { DashboardCard } from "@/components/client/dashboard-card"
import { ActivityFeed } from "@/components/client/activity-feed"
import { Users, CheckCircle, MessageSquare, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Define types for client dashboard data
type ClientDashboardStats = {
  activeProjects: number
  pendingApprovals: number
  newMessages: number
  upcomingDeadlines: number
  overallProgress: number
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [clientName, setClientName] = useState("Client")
  const [stats, setStats] = useState<ClientDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchClientDashboard = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/signin")
          return
        }

        // Set client name from user metadata
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Client"
        setClientName(name)

        // Fetch client dashboard stats in parallel
        const [
          { count: activeProjects },
          { count: pendingApprovals },
          { count: newMessages },
          { count: upcomingDeadlines }
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true })
            .eq("client_id", user.id).eq("status", "in_progress"),
          supabase.from("approvals").select("*", { count: "exact", head: true })
            .eq("client_id", user.id),
          supabase.from("messages").select("*", { count: "exact", head: true })
            .eq("recipient_id", user.id).eq("read", false),
          supabase.from("projects").select("*", { count: "exact", head: true })
            .eq("client_id", user.id).eq("status", "in_progress")
            .gte("end_date", new Date().toISOString().split("T")[0])
            .lte("end_date", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
        ])

        setStats({
          activeProjects: activeProjects || 0,
          pendingApprovals: pendingApprovals || 0,
          newMessages: newMessages || 0,
          upcomingDeadlines: upcomingDeadlines || 0,
          overallProgress: 85, // This would be calculated from actual project data
        })

      } catch (error) {
        console.error('Error fetching client dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientDashboard()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back!</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back!</h1>
        <div className="text-center py-12 text-gray-500">Failed to load dashboard data</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-gray-800">Welcome back, {clientName}!</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Users}
          description="Currently working on"
        />
        <DashboardCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={CheckCircle}
          description="Action required"
        />
        <DashboardCard
          title="New Messages"
          value={stats.newMessages}
          icon={MessageSquare}
          description="From your team"
        />
        <DashboardCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
          icon={Clock}
          description="Next 7 days"
        />
      </div>

      {/* Project Progress / Chart */}
      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Project Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-2">Website Redesign</p>
              <Progress value={75} className="h-3 rounded-full" />
              <p className="text-sm text-gray-500 mt-1">75% Complete</p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">Mobile App Development</p>
              <Progress value={40} className="h-3 rounded-full" />
              <p className="text-sm text-gray-500 mt-1">40% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <ActivityFeed />
    </div>
  )
}

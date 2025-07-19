"use client"

import { Suspense, useEffect, useState } from "react"
import { StatCard } from "@/components/company/stat-card"
import { EngagementChart } from "@/components/company/engagement-chart"
import { ActivityFeed } from "@/components/company/activity-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Briefcase, Mail, Clock, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Define types for dashboard data
type DashboardStats = {
  activeClients: number
  ongoingProjects: number
  revenueSummary: number
  newInquiries: number
  averageProjectDuration: string
  clientSatisfaction: number
  projectStatusBreakdown: {
    completed: number
    in_progress: number
    pending: number
    total: number
  }
}

type EngagementData = {
  month: string
  clients: number
  projects: number
}[]

export default function CompanyDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [engagementData, setEngagementData] = useState<EngagementData>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/signin")
          return
        }

        const companyId = user.id

        // Fetch dashboard stats in parallel
        const [
          { count: clientsCount },
          { count: projectsCount },
          { count: newInquiries },
          { data: projectsData }
        ] = await Promise.all([
          supabase.from("clients").select("*", { count: "exact", head: true }).eq("company_id", companyId),
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("company_id", companyId).neq("status", "completed"),
          supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("projects").select("status, start_date, end_date").eq("company_id", companyId)
        ])

        // Calculate project stats
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

        // For now, keep some placeholder values that would need a proper business logic implementation
        const revenue = 125000 // This would need to be calculated from actual project budgets/payments
        const clientSatisfaction = 4.7 // This would come from a ratings/feedback table

        setStats({
          activeClients: clientsCount || 0,
          ongoingProjects: projectsCount || 0,
          revenueSummary: revenue,
          newInquiries: newInquiries || 0,
          averageProjectDuration,
          clientSatisfaction,
          projectStatusBreakdown,
        })

        // Fetch engagement data (placeholder for now)
        setEngagementData([
          { month: "Jan", clients: 10, projects: 15 },
          { month: "Feb", clients: 12, projects: 18 },
          { month: "Mar", clients: 15, projects: 22 },
          { month: "Apr", clients: 18, projects: 25 },
          { month: "May", clients: 20, projects: 28 },
          { month: "Jun", clients: 22, projects: 30 },
        ])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-800">Company Dashboard</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-800">Company Dashboard</h1>
        <div className="text-center py-12 text-gray-500">Failed to load dashboard data</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-gray-800">Company Dashboard</h1>
      <p className="text-lg text-gray-600">Overview of your business operations and key metrics.</p>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Clients"
          value={stats.activeClients.toString()}
          description="Currently engaged clients"
          icon={<Users className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Ongoing Projects"
          value={stats.ongoingProjects.toString()}
          description="Projects currently in progress"
          icon={<Briefcase className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenueSummary.toLocaleString()}`}
          description="Year-to-date earnings"
          icon={<DollarSign className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="New Inquiries"
          value={stats.newInquiries.toString()}
          description="Unread client messages"
          icon={<Mail className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Avg. Project Duration"
          value={stats.averageProjectDuration}
          description="Average time to complete a project"
          icon={<Clock className="h-5 w-5 text-gray-500" />}
        />
        <StatCard
          title="Client Satisfaction"
          value={`${stats.clientSatisfaction.toFixed(1)} / 5.0`}
          description="Average client rating"
          icon={<Star className="h-5 w-5 text-gray-500" />}
        />
      </div>

      {/* Charts and Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Engagement Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading chart...</div>}>
              <EngagementChart data={engagementData} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Project Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-600">Completed:</span>
              <Progress
                value={(stats.projectStatusBreakdown.completed / stats.projectStatusBreakdown.total) * 100 || 0}
                className="h-2 flex-1"
              />
              <span className="text-sm font-medium">
                {stats.projectStatusBreakdown.completed} (
                {((stats.projectStatusBreakdown.completed / stats.projectStatusBreakdown.total) * 100 || 0).toFixed(0)}
                %)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-600">In Progress:</span>
              <Progress
                value={(stats.projectStatusBreakdown.in_progress / stats.projectStatusBreakdown.total) * 100 || 0}
                className="h-2 flex-1 bg-yellow-400"
              />
              <span className="text-sm font-medium">
                {stats.projectStatusBreakdown.in_progress} (
                {((stats.projectStatusBreakdown.in_progress / stats.projectStatusBreakdown.total) * 100 || 0).toFixed(
                  0,
                )}
                %)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-600">Pending:</span>
              <Progress
                value={(stats.projectStatusBreakdown.pending / stats.projectStatusBreakdown.total) * 100 || 0}
                className="h-2 flex-1 bg-blue-400"
              />
              <span className="text-sm font-medium">
                {stats.projectStatusBreakdown.pending} (
                {((stats.projectStatusBreakdown.pending / stats.projectStatusBreakdown.total) * 100 || 0).toFixed(0)}
                %)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-600">Total:</span>
              <Progress value={100} className="h-2 flex-1 bg-gray-300" />
              <span className="text-sm font-medium">{stats.projectStatusBreakdown.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

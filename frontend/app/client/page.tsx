import { DashboardCard } from "@/components/client/dashboard-card"
import { ActivityFeed } from "@/components/client/activity-feed"
import { Users, CheckCircle, MessageSquare, Clock } from "lucide-react" // Import Clock icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getClientDashboardStats, getAuthenticatedUser } from "@/lib/data"

export default async function ClientDashboardPage() {
  const user = await getAuthenticatedUser()
  const clientName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Client"
  const stats = await getClientDashboardStats(user?.id || "")

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

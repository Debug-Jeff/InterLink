import { DashboardCard } from "@/components/client/dashboard-card" // Reusing DashboardCard
import { ActivityFeed } from "@/components/client/activity-feed" // Reusing ActivityFeed
import { Users, FileText, Clock, UserPlus } from "lucide-react" // Import UserPlus icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getAdminDashboardStats } from "@/lib/data" // Import admin stats function

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats()

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats.totalUsers} icon={Users} description="Registered accounts" />
        <DashboardCard
          title="Active Internships"
          value={stats.activeInternships}
          icon={FileText}
          description="Currently live"
        />
        <DashboardCard
          title="New Signups (Today)"
          value={stats.newSignupsToday}
          icon={UserPlus}
          description="Interns & Startups"
        />
        <DashboardCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={Clock}
          description="Content & Profiles"
        />
      </div>

      {/* Content Overview / Chart (Placeholder) */}
      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Content Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-2">Internship Listings</p>
              <Progress value={90} className="h-3 rounded-full" />
              <p className="text-sm text-gray-500 mt-1">90% Approved</p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">User Profiles</p>
              <Progress value={70} className="h-3 rounded-full" />
              <p className="text-sm text-gray-500 mt-1">70% Verified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Admin Activity (Reusing ActivityFeed for now) */}
      <ActivityFeed />
    </div>
  )
}

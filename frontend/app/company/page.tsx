import { Suspense } from "react"
import { getCompanyDashboardStats, getCompanyEngagementData } from "@/lib/data"
import { StatCard } from "@/components/company/stat-card"
import { EngagementChart } from "@/components/company/engagement-chart"
import { ActivityFeed } from "@/components/company/activity-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Briefcase, Mail, Clock, Star } from "lucide-react"

export default async function CompanyDashboardPage() {
  const stats = await getCompanyDashboardStats()
  const engagementData = await getCompanyEngagementData()

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

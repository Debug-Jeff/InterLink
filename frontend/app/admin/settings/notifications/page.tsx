import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Admin Notification Settings</h1>
      <p className="text-lg text-gray-600">Manage system-wide notification settings for users and admins.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Admin Email Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-new-user">New User Registrations</Label>
            <Switch id="admin-new-user" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-content-review">Content Pending Review</Label>
            <Switch id="admin-content-review" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-system-alerts">System Health Alerts</Label>
            <Switch id="admin-system-alerts" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  )
}

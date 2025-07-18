import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ClientNotificationsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Notification Settings</h1>
      <p className="text-lg text-gray-600">Configure how you receive alerts and updates.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-project-updates">Project Updates</Label>
            <Switch id="email-project-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-new-messages">New Messages</Label>
            <Switch id="email-new-messages" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-approvals">Approval Requests</Label>
            <Switch id="email-approvals" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">In-App Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-project-updates">Project Updates</Label>
            <Switch id="inapp-project-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-new-messages">New Messages</Label>
            <Switch id="inapp-new-messages" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/client/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  )
}

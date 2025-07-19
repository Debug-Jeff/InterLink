import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CompanyNotificationsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Company Notification Settings</h1>
      <p className="text-lg text-gray-600">Manage notification preferences for your company account.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-client-inquiries">New Client Inquiries</Label>
            <Switch id="email-client-inquiries" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-project-updates">Project Status Updates</Label>
            <Switch id="email-project-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-reports-ready">Reports Ready</Label>
            <Switch id="email-reports-ready" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/company/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  )
}

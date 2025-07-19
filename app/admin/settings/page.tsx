import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Bell, Palette } from "lucide-react" // Import Palette icon

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Admin Settings</h1>
      <p className="text-lg text-gray-600">Configure portal settings and administrative preferences.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Settings className="h-6 w-6 text-gray-600" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Manage platform-wide configurations and defaults.</p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/admin/settings/general">Configure General Settings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="h-6 w-6 text-gray-600" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Manage system-wide notification settings for users and admins.</p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/admin/settings/notifications">Configure Notifications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Palette className="h-6 w-6 text-gray-600" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Set the default theme and visual preferences for the platform.</p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/admin/settings/appearance">Change Theme</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

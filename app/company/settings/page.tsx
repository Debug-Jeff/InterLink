import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Bell, Palette } from "lucide-react" // Import Palette icon

export default function CompanySettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Company Settings</h1>
      <p className="text-lg text-gray-600">Manage your company profile, user access, and portal preferences.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-md border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gray-600" /> Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Update your company's public profile and contact information.</p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/company/settings/profile">Edit Company Profile</Link>
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
            <p className="text-gray-700 mb-4">Manage notification preferences for your company account.</p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/company/settings/notifications">Configure Notifications</Link>
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
            <p className="text-gray-700 mb-4">Customize the visual theme of your company portal.</p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/company/settings/appearance">Change Theme</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

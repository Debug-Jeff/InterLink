import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ClientSettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
      <p className="text-lg text-gray-600">Manage your account settings and preferences.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/client/settings/profile" className="group block">
          <Card className="h-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 group-hover:text-gray-700">Name, email, etc.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/client/settings/appearance" className="group block">
          <Card className="h-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 group-hover:text-gray-700">Theme, layout, etc.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/client/settings/notifications" className="group block">
          <Card className="h-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 group-hover:text-gray-700">Email, push, etc.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/client/settings/password" className="group block">
          <Card className="h-full transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 group-hover:text-gray-700">Update your login credentials.</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Separator className="my-8" />

      <h2 className="text-2xl font-semibold text-gray-800">Advanced Settings</h2>
      <p className="text-md text-gray-600">Settings that affect your account more broadly.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example of a placeholder for future advanced settings */}
        <Card className="h-full opacity-70">
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Export your account data.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminAppearancePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Admin Appearance Settings</h1>
      <p className="text-lg text-gray-600">Set the default theme and visual preferences for the platform.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Default Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">Set the default theme for all users:</p>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-gray-600">Toggle between Light, Dark, or System theme.</span>
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

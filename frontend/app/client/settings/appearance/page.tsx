import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle" // Import ThemeToggle

export default function ClientAppearancePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Appearance Settings</h1>
      <p className="text-lg text-gray-600">Customize the visual theme of your dashboard.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">Select your preferred theme:</p>
          <div className="flex items-center space-x-4">
            <ThemeToggle /> {/* Use the ThemeToggle component */}
            <span className="text-gray-600">Toggle between Light, Dark, or System theme.</span>
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

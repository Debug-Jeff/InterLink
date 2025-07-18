"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { getAppSettings } from "@/lib/data" // Import the data fetching function
import { updateAppSettings } from "@/app/admin/actions" // Import the server action
import { toast } from "@/hooks/use-toast" // Assuming you have a toast hook

export default function AdminGeneralSettingsPage() {
  const [settings, setSettings] = useState<{ [key: string]: any }>({})
  const [state, formAction, isPending] = useActionState(updateAppSettings, null)

  useEffect(() => {
    const fetchSettings = async () => {
      const fetchedSettings = await getAppSettings()
      setSettings(fetchedSettings)
    }
    fetchSettings()
  }, []) // Fetch settings only once on component mount

  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      })
      // Re-fetch settings to ensure UI is up-to-date with latest data
      const fetchUpdatedSettings = async () => {
        const updatedSettings = await getAppSettings()
        setSettings(updatedSettings)
      }
      fetchUpdatedSettings()
      state.success = null // Reset state to prevent re-toasting
    } else if (state?.success === false) {
      toast({
        title: "Error!",
        description: state.message,
        variant: "destructive",
      })
      state.success = null // Reset state
    }
  }, [state, toast])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">General Platform Settings</h1>
      <p className="text-lg text-gray-600">Manage platform-wide configurations and defaults.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Platform Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="platformName" className="md:text-right">
                Platform Name
              </Label>
              <Input
                id="platformName"
                name="platformName"
                defaultValue={settings.platform_name || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="adminContactEmail" className="md:text-right">
                Admin Contact Email
              </Label>
              <Input
                id="adminContactEmail"
                name="adminContactEmail"
                type="email"
                defaultValue={settings.admin_contact_email || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
              <Label htmlFor="welcomeMessage" className="md:text-right pt-2">
                Welcome Message
              </Label>
              <Textarea
                id="welcomeMessage"
                name="welcomeMessage"
                defaultValue={settings.welcome_message || ""}
                rows={3}
                className="col-span-3"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  )
}

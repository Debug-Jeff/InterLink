"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { updateAppSettings } from "@/app/admin/actions"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface SettingsFormProps {
  initialSettings: {
    platform_name: string
    admin_contact_email: string
    welcome_message: string
  }
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('platformName', settings.platform_name)
      formData.append('adminContactEmail', settings.admin_contact_email)
      formData.append('welcomeMessage', settings.welcome_message)

      const result = await updateAppSettings(null, formData)
      
      if (result?.success) {
        toast({
          title: "Settings Updated",
          description: "Your settings have been successfully updated.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to update settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="rounded-xl shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Platform Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <Label htmlFor="platformName" className="md:text-right">
              Platform Name
            </Label>
            <Input
              id="platformName"
              name="platformName"
              value={settings.platform_name}
              onChange={(e) => setSettings(prev => ({ ...prev, platform_name: e.target.value }))}
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
              value={settings.admin_contact_email}
              onChange={(e) => setSettings(prev => ({ ...prev, admin_contact_email: e.target.value }))}
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
              value={settings.welcome_message}
              onChange={(e) => setSettings(prev => ({ ...prev, welcome_message: e.target.value }))}
              rows={3}
              className="col-span-3"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
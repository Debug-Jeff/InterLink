import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "./form"

export default async function AdminGeneralSettingsPage() {
  const supabase = createClient()
  
  // Fetch app settings from database
  let settings = {
    platform_name: "INTERLINK",
    admin_contact_email: "admin@interlink.com", 
    welcome_message: "Welcome to INTERLINK - Connecting talent with opportunity through innovation"
  }

  try {
    const { data: appSettings, error } = await supabase
      .from('app_settings')
      .select('*')
      .single()

    if (!error && appSettings) {
      settings = {
        platform_name: appSettings.platform_name || settings.platform_name,
        admin_contact_email: appSettings.admin_contact_email || settings.admin_contact_email,
        welcome_message: appSettings.welcome_message || settings.welcome_message
      }
    }
  } catch (error) {
    console.error('Error fetching app settings:', error)
    // Fall back to default settings
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">General Platform Settings</h1>
      <p className="text-lg text-gray-600">Manage platform-wide configurations and defaults.</p>

      <SettingsForm initialSettings={settings} />

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  )
}
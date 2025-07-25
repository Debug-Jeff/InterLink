"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useActionState } from "react"
import { updateCompanyProfile } from "@/app/company/actions" // Import the new server action
import { useToast } from "@/hooks/use-toast" // Assuming you have a toast hook
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Define types for client-side data
type CompanyProfile = {
  id: string
  email: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  bio: string | null
  location: string | null
  website: string | null
  user_metadata?: {
    phone_number?: string
  }
} | null

export default function CompanyProfileSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(null)
  const [loading, setLoading] = useState(true)
  const [state, formAction, isPending] = useActionState(updateCompanyProfile, null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/signin")
          return
        }

        // Fetch company profile from users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching company profile:', profileError)
          toast({
            title: "Error",
            description: "Failed to load profile",
            variant: "destructive",
          })
        } else {
          setCompanyProfile(profile)
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router, supabase, toast])

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        // Re-fetch profile to update local state with latest data
        const fetchUpdatedProfile = async () => {
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (userError || !user) return
          
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
            
          if (!profileError && profile) {
            setCompanyProfile(profile)
          }
        }
        fetchUpdatedProfile()
      }
    }
  }, [state, toast, supabase])

  if (loading || !companyProfile) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-md border border-gray-100 text-center text-gray-500">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading company profile...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Company Profile Settings</h1>
      <p className="text-lg text-gray-600">Update your company's public profile and contact information.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="md:text-right">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                defaultValue={companyProfile.full_name || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="companyEmail" className="md:text-right">
                Contact Email
              </Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                type="email"
                defaultValue={companyProfile.email || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="companyPhone" className="md:text-right">
                Phone
              </Label>
              <Input
                id="companyPhone"
                name="companyPhone"
                type="tel"
                defaultValue={companyProfile.user_metadata?.phone_number || ""}
                className="col-span-3"
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
          <Link href="/company/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  )
}

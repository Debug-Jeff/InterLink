"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useActionState, useEffect, useState } from "react"
import { updateUserProfile } from "@/app/(auth)/actions"
import { useToast } from "@/components/ui/use-toast"
import { getAuthenticatedUser, getUserProfile } from "@/lib/data" // Import server-side data fetching
import { useRouter } from "next/navigation"

// Define types for data fetched from server
type UserProfile = Awaited<ReturnType<typeof getUserProfile>>

export default function UserProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState<UserProfile>(null)
  const [state, formAction, isPending] = useActionState(updateUserProfile, null)

  useEffect(() => {
    const fetchProfile = async () => {
      const authUser = await getAuthenticatedUser()
      if (authUser) {
        const profile = await getUserProfile(authUser.id)
        setUserProfile(profile)
      } else {
        router.push("/signin") // Redirect if not authenticated
      }
    }
    fetchProfile()
  }, [router])

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
          const authUser = await getAuthenticatedUser()
          if (authUser) {
            const profile = await getUserProfile(authUser.id)
            setUserProfile(profile)
          }
        }
        fetchUpdatedProfile()
      }
    }
  }, [state, toast])

  if (!userProfile) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-md border border-gray-100 text-center text-gray-500">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Edit Profile</h1>
      <p className="text-lg text-gray-600">Update your personal information.</p>

      <Card className="rounded-xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="md:text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={userProfile.full_name || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="md:text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={userProfile.email || ""}
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
    </div>
  )
}

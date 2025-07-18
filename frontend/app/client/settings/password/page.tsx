"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useActionState } from "react"
import { updatePassword } from "@/app/(auth)/actions"
import { toast } from "@/hooks/use-toast" // Corrected import path for useToast

export default function PasswordSettingsPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  // Show toast notifications based on action state
  // Using useEffect to prevent re-toasting on re-renders and ensure state is stable
  useState(() => {
    if (state?.success === true) {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      })
      // Clear form fields on success
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      // Reset state to prevent re-toasting on re-render
      // This is a common pattern when using useActionState with toasts
      // However, useActionState's state is immutable, so directly modifying it like state.success = null
      // is not the correct way. The state will only change when the action returns a new state.
      // For clearing form fields, it's fine, but for toast, useEffect is better.
    } else if (state?.success === false) {
      toast({
        title: "Error!",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state]) // Depend on state to re-run when action state changes

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input
              id="confirm-new-password"
              name="confirmNewPassword"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

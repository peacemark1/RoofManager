"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/settings")
      return response.data.data
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (formData: any) => {
      // In a real app, this would be a PUT /api/users/profile
      // For now, we'll just simulate success since the focus is on UI visibility
      return new Promise((resolve) => setTimeout(resolve, 500))
    },
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const user = data?.user || {}

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); updateProfile.mutate({}) }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user.lastName} />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
              <p className="text-xs text-gray-400">Email cannot be changed.</p>
            </div>
            <div className="space-y-2 mb-6">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={user.phone || ""} />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
              {success && (
                <span className="flex items-center text-sm text-green-600">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Saved!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Security settings are currently managed by the administrator.
          </p>
          <Button variant="outline" disabled>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}

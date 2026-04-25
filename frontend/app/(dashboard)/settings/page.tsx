"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, Gift, Clock, Crown, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

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

  // Trial status query
  const { data: trialData, isLoading: trialLoading, refetch: refetchTrial } = useQuery({
    queryKey: ["trialStatus"],
    queryFn: async () => {
      const response = await api.get("/estimates/trial-status")
      return response.data.data
    },
    retry: false
  })

  const updateProfile = useMutation({
    mutationFn: async (formData: { firstName: string; lastName: string; phone: string }) => {
      const response = await api.put("/settings/profile", formData)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  })

  // Start trial mutation
  const startTrial = useMutation({
    mutationFn: async () => {
      const response = await api.post("/estimates/start-trial")
      return response.data.data
    },
    onSuccess: () => {
      refetchTrial()
      alert("Trial started successfully!")
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || "Failed to start trial"
      alert(message)
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

  const isTrialActive = trialData?.isTrialActive && trialData?.daysRemaining > 0
  const trialUsed = trialData?.trialUsed
  const daysRemaining = trialData?.daysRemaining || 0
  const currentTier = trialData?.tier || "FREE"

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {/* Trial/Subscription Card */}
      <Card className={isTrialActive ? "border-green-500 bg-green-950" : trialUsed ? "border-gray-600" : "border-blue-500 bg-blue-950"}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              {isTrialActive ? (
                <Crown className="mr-2 h-5 w-5 text-green-400" />
              ) : (
                <Gift className="mr-2 h-5 w-5 text-blue-400" />
              )}
              Subscription
            </CardTitle>
            <Badge variant={isTrialActive ? "default" : trialUsed ? "secondary" : "outline"}>
              {currentTier}
            </Badge>
          </div>
          <CardDescription>
            Manage your subscription and trial
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trialLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : isTrialActive ? (
            // Active trial
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-900/30 rounded-lg border border-green-800">
                <div className="flex items-center">
                  <Clock className="mr-3 h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-green-400">Pro Trial Active</p>
                    <p className="text-sm text-gray-400">{daysRemaining} days remaining</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Upgrade Now
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                You&apos;re currently on a free 14-day Pro trial. Upgrade to continue enjoying premium features.
              </p>
            </div>
          ) : trialUsed ? (
            // Trial already used
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <AlertTriangle className="mr-3 h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium">Trial Used</p>
                    <p className="text-sm text-gray-400">Upgrade to access premium features</p>
                  </div>
                </div>
                <Button>
                  Upgrade Plan
                </Button>
              </div>
            </div>
          ) : (
            // Eligible for trial
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-900/30 rounded-lg border border-blue-800">
                <div className="flex items-center">
                  <Gift className="mr-3 h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-blue-400">Start Free Trial</p>
                    <p className="text-sm text-gray-400">14 days of Pro features</p>
                  </div>
                </div>
                <Button
                  onClick={() => startTrial.mutate()}
                  disabled={startTrial.isPending}
                >
                  {startTrial.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Start Trial
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Try all Pro features free for 14 days. No credit card required.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              updateProfile.mutate({
                firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
                lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
                phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
              })
            }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={user.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={user.lastName} />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
              <p className="text-xs text-gray-400">Email cannot be changed.</p>
            </div>
            <div className="space-y-2 mb-6">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user.phone || ""} />
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
          <a href="/forgot-password">
            <Button variant="outline" type="button">Change Password</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

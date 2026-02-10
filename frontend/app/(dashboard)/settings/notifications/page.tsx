"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare, Clock, DollarSign, Loader2, Save } from "lucide-react"

interface NotificationPreferences {
  // Email notifications
  emailEnabled: boolean
  emailNewLead: boolean
  emailNewQuote: boolean
  emailQuoteApproved: boolean
  emailNewInvoice: boolean
  emailPaymentReceived: boolean
  emailJobAssigned: boolean
  emailJobCompleted: boolean

  // SMS notifications
  smsEnabled: boolean
  smsNewLead: boolean
  smsQuoteApproved: boolean
  smsPaymentReceived: boolean
  smsJobAssigned: boolean
  smsUrgentAlerts: boolean

  // Thresholds and quiet hours
  invoiceThreshold: number
  quietHoursStart: string
  quietHoursEnd: string
}

const NOTIFICATION_EVENTS = [
  { key: "newLead", label: "New Lead Received", description: "When a new lead is created" },
  { key: "newQuote", label: "Quote Sent", description: "When you send a quote to a customer" },
  { key: "quoteApproved", label: "Quote Approved", description: "When a customer approves a quote" },
  { key: "newInvoice", label: "Invoice Created", description: "When an invoice is created" },
  { key: "paymentReceived", label: "Payment Received", description: "When a payment is successfully processed" },
  { key: "jobAssigned", label: "Job Assigned", description: "When a job is assigned to you" },
  { key: "jobCompleted", label: "Job Completed", description: "When a job is marked as complete" },
  { key: "urgentAlerts", label: "Urgent Alerts", description: "Critical issues requiring immediate attention" },
]

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    emailNewLead: true,
    emailNewQuote: true,
    emailQuoteApproved: true,
    emailNewInvoice: true,
    emailPaymentReceived: true,
    emailJobAssigned: true,
    emailJobCompleted: true,
    smsEnabled: false,
    smsNewLead: false,
    smsQuoteApproved: true,
    smsPaymentReceived: true,
    smsJobAssigned: true,
    smsUrgentAlerts: true,
    invoiceThreshold: 0,
    quietHoursStart: "21:00",
    quietHoursEnd: "07:00",
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Load current preferences
  const { data, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const response = await api.get("/settings/notifications")
      return response.data.data as NotificationPreferences
    }
  })

  useEffect(() => {
    if (data) {
      setPreferences(data)
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: async (newPrefs: NotificationPreferences) => {
      const response = await api.put("/settings/notifications", newPrefs)
      return response.data
    },
    onSuccess: () => {
      setHasChanges(false)
      alert("Notification preferences saved successfully!")
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to save preferences")
    },
  })

  const handleChange = (key: keyof NotificationPreferences, value: boolean | string | number) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateMutation.mutate(preferences)
  }

  const resetToDefaults = () => {
    const defaults: NotificationPreferences = {
      emailEnabled: true,
      emailNewLead: true,
      emailNewQuote: true,
      emailQuoteApproved: true,
      emailNewInvoice: true,
      emailPaymentReceived: true,
      emailJobAssigned: true,
      emailJobCompleted: true,
      smsEnabled: false,
      smsNewLead: false,
      smsQuoteApproved: true,
      smsPaymentReceived: true,
      smsJobAssigned: true,
      smsUrgentAlerts: true,
      invoiceThreshold: 0,
      quietHoursStart: "21:00",
      quietHoursEnd: "07:00",
    }
    setPreferences(defaults)
    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notification Preferences</h1>
          <p className="text-gray-600">Configure how and when you receive notifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || updateMutation.isPending}
            className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-600" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={preferences.emailEnabled}
              onCheckedChange={(checked: boolean) => handleChange("emailEnabled", checked)}
            />
          </div>

          <Separator />

          {preferences.emailEnabled && (
            <div className="grid gap-4 pl-4">
              {NOTIFICATION_EVENTS.slice(0, 7).map((event) => {
                const key = `email${event.key.charAt(0).toUpperCase() + event.key.slice(1)}` as keyof NotificationPreferences
                return (
                  <div key={event.key} className="flex items-center justify-between">
                    <div>
                      <Label>{event.label}</Label>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                    <Switch
                      checked={!!preferences[key]}
                      onCheckedChange={(checked: boolean) => handleChange(key, checked)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable SMS Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via text message</p>
            </div>
            <Switch
              checked={preferences.smsEnabled}
              onCheckedChange={(checked: boolean) => handleChange("smsEnabled", checked)}
            />
          </div>

          <Separator />

          {preferences.smsEnabled && (
            <div className="grid gap-4 pl-4">
              {NOTIFICATION_EVENTS.slice(1, 8).map((event) => {
                const key = `sms${event.key.charAt(0).toUpperCase() + event.key.slice(1)}` as keyof NotificationPreferences
                return (
                  <div key={event.key} className="flex items-center justify-between">
                    <div>
                      <Label>{event.label}</Label>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                    <Switch
                      checked={!!preferences[key]}
                      onCheckedChange={(checked: boolean) => handleChange(key, checked)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-purple-600" />
            Quiet Hours (SMS Only)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Set quiet hours to prevent SMS notifications from disturbing you. 
            SMS notifications will be queued and sent after quiet hours end.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quiet Hours Start</Label>
              <Input
                type="time"
                value={preferences.quietHoursStart}
                onChange={(e) => handleChange("quietHoursStart", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Quiet Hours End</Label>
              <Input
                type="time"
                value={preferences.quietHoursEnd}
                onChange={(e) => handleChange("quietHoursEnd", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Bell className="h-4 w-4" />
            <span>No SMS will be sent between {preferences.quietHoursStart} and {preferences.quietHoursEnd}</span>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Threshold */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-yellow-600" />
            Invoice Notification Threshold
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Only receive notifications for invoices above this amount. Set to 0 to receive all notifications.
          </p>
          <div>
            <Label>Minimum Invoice Amount</Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500">GHS</span>
              <Input
                type="number"
                value={preferences.invoiceThreshold}
                onChange={(e) => handleChange("invoiceThreshold", parseFloat(e.target.value) || 0)}
                className="w-40"
                min="0"
                step="50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

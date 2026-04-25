"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { useAuthStore } from "@/lib/stores/authStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, Building2 } from "lucide-react"
import { useState } from "react"

export default function CompanySettingsPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [success, setSuccess] = useState(false)
  const isAdmin = user?.role === "ADMIN"

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get("/settings")
      return response.data.data
    },
  })

  const updateCompany = useMutation({
    mutationFn: async (formData: Record<string, string>) => {
      const response = await api.put("/settings/company", formData)
      return response.data
    },
    onSuccess: () => {
      setSuccess(true)
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      setTimeout(() => setSuccess(false), 3000)
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const company = data?.user?.company || {}

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-gray-600">Manage your company information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "Update your company details visible to customers"
              : "Only admins can update company settings"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              updateCompany.mutate({
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                address: formData.get("address") as string,
                city: formData.get("city") as string,
                state: formData.get("state") as string,
                zipCode: formData.get("zipCode") as string,
                website: formData.get("website") as string,
              })
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={company.name}
                  disabled={!isAdmin}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={company.email || ""}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={company.phone || ""}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={company.address || ""}
                  disabled={!isAdmin}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={company.city || ""}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    defaultValue={company.state || ""}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    defaultValue={company.zipCode || ""}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  defaultValue={company.website || ""}
                  disabled={!isAdmin}
                />
              </div>
              {isAdmin && (
                <div className="flex items-center gap-4 pt-2">
                  <Button type="submit" disabled={updateCompany.isPending}>
                    {updateCompany.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  {success && (
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Saved!
                    </span>
                  )}
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

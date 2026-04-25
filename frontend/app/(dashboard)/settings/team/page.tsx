"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { useAuthStore } from "@/lib/stores/authStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserPlus, Mail, Shield, Users, X } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

interface Invite {
  id: string
  email: string
  role: string
  status: string
  expiresAt: string
  createdAt: string
}

export default function TeamSettingsPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("CREW")
  const [showInviteForm, setShowInviteForm] = useState(false)

  const { data: teamData, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await api.get("/team")
      return response.data.data
    },
  })

  const { data: inviteData } = useQuery({
    queryKey: ["teamInvites"],
    queryFn: async () => {
      const response = await api.get("/team/invites")
      return response.data.data
    },
  })

  const inviteMember = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const response = await api.post("/team/invite", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamInvites"] })
      setInviteEmail("")
      setShowInviteForm(false)
    },
  })

  const cancelInvite = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/team/invites/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamInvites"] })
    },
  })

  const updateMember = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { role?: string; isActive?: boolean } }) => {
      const response = await api.put(`/team/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },
  })

  const members: TeamMember[] = teamData?.members || []
  const invites: Invite[] = inviteData?.invites?.filter((i: Invite) => i.status === "PENDING") || []
  const isAdmin = user?.role === "ADMIN"

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    MANAGER: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    CREW: "bg-green-500/10 text-green-400 border-green-500/30",
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-600">Manage your team members and invitations</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <Card className="border-cyan-500/30 bg-cyan-950/20">
          <CardHeader>
            <CardTitle className="text-lg">Invite Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="CREW">Crew</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button
                onClick={() => inviteMember.mutate({ email: inviteEmail, role: inviteRole })}
                disabled={!inviteEmail || inviteMember.isPending}
              >
                {inviteMember.isPending ? "Sending..." : "Send Invite"}
              </Button>
            </div>
            {inviteMember.isError && (
              <p className="mt-2 text-sm text-red-500">
                {(inviteMember.error as Error)?.message || "Failed to send invitation"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-gray-500">
                      Invited {new Date(invite.createdAt).toLocaleDateString()} · Expires{" "}
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={roleColors[invite.role]}>
                      {invite.role}
                    </Badge>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cancelInvite.mutate(invite.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Users className="mr-2 h-5 w-5" />
            Team Members ({members.length})
          </CardTitle>
          <CardDescription>People with access to your RoofManager account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {member.firstName[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                      {member.id === user?.id && (
                        <span className="ml-2 text-xs text-gray-400">(you)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!member.isActive && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                      Inactive
                    </Badge>
                  )}
                  <Badge variant="outline" className={roleColors[member.role] || roleColors.CREW}>
                    <Shield className="mr-1 h-3 w-3" />
                    {member.role}
                  </Badge>
                  {isAdmin && member.id !== user?.id && (
                    <select
                      value={member.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        updateMember.mutate({
                          id: member.id,
                          data: { isActive: e.target.value === "active" },
                        })
                      }
                      className="rounded border border-gray-300 px-2 py-1 text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

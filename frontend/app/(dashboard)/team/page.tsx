"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { useAuthStore } from "@/lib/stores/authStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Loader2,
  UserPlus,
  X,
  Users,
  Shield,
  HardHat,
  User as UserIcon,
  MoreVertical,
  Mail,
  Phone,
} from "lucide-react"

interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

const ROLES = [
  { value: "ADMIN", label: "Admin", icon: Shield, color: "text-red-400" },
  { value: "MANAGER", label: "Manager", icon: Users, color: "text-blue-400" },
  { value: "CREW", label: "Field Crew", icon: HardHat, color: "text-green-400" },
  { value: "SALES", label: "Sales", icon: UserIcon, color: "text-yellow-400" },
]

function getRoleBadge(role: string) {
  const roleConfig = ROLES.find((r) => r.value === role)
  if (!roleConfig) return <Badge variant="secondary">{role}</Badge>

  const colorMap: Record<string, string> = {
    "text-red-400": "bg-red-900/30 text-red-400 border-red-800",
    "text-blue-400": "bg-blue-900/30 text-blue-400 border-blue-800",
    "text-green-400": "bg-green-900/30 text-green-400 border-green-800",
    "text-yellow-400": "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[roleConfig.color] || ""}`}>
      <roleConfig.icon className="w-3 h-3" />
      {roleConfig.label}
    </span>
  )
}

export default function TeamPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "CREW",
    password: "",
  })
  const [error, setError] = useState("")

  const { data: members = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await api.get("/team")
      return res.data.data
    },
  })

  const inviteMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await api.post("/team/invite", data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] })
      setShowInvite(false)
      setForm({ firstName: "", lastName: "", email: "", phone: "", role: "CREW", password: "" })
      setError("")
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || "Failed to invite member")
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await api.put(`/team/${id}`, { isActive })
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await api.put(`/team/${id}`, { role })
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team"] }),
  })

  const isAdmin = user?.role === "ADMIN"
  const activeCount = members.filter((m) => m.isActive).length

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Team</h2>
          <p className="text-slate-400 mt-1">
            {activeCount} active member{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowInvite(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Invite Team Member</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setShowInvite(false); setError("") }}>
              <X className="w-4 h-4 text-slate-400" />
            </Button>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900/50 mb-4">{error}</div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                inviteMutation.mutate(form)
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <label className="text-xs text-slate-400">First Name</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Last Name</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-10 rounded-md border border-slate-700 bg-slate-800 text-white px-3 text-sm"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Temporary Password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank for default"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => { setShowInvite(false); setError("") }} className="text-slate-400">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  Send Invite
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Team Table */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No team members yet. Invite your first team member!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Contact</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Last Login</TableHead>
                  {isAdmin && <TableHead className="text-slate-400 text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="border-slate-700 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">
                      {member.firstName} {member.lastName}
                      {member.id === user?.id && (
                        <span className="ml-2 text-xs text-cyan-400">(You)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-slate-300 text-sm">
                          <Mail className="w-3 h-3" /> {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Phone className="w-3 h-3" /> {member.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        member.isActive
                          ? "bg-green-900/30 text-green-400 border-green-800"
                          : "bg-slate-800 text-slate-500 border-slate-700"
                      }`}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {member.lastLogin
                        ? new Date(member.lastLogin).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        {member.id !== user?.id && (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                updateRoleMutation.mutate({ id: member.id, role: e.target.value })
                              }
                              className="h-8 rounded border border-slate-700 bg-slate-800 text-white px-2 text-xs"
                            >
                              {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                              ))}
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleActiveMutation.mutate({
                                  id: member.id,
                                  isActive: !member.isActive,
                                })
                              }
                              className={member.isActive ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}
                            >
                              {member.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

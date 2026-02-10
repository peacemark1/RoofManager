"use client"

import { useState } from "react"
import { useLeads, useUpdateLead, useCreateLead, Lead } from "@/lib/hooks/useLeads"
import LeadTable from "@/components/leads/LeadTable"
import LeadKanban from "@/components/leads/LeadKanban"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "kanban">("table")
  const [search, setSearch] = useState("")
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const { data: leads = [], isLoading } = useLeads()
  const updateLead = useUpdateLead()
  const createLead = useCreateLead()

  const filteredLeads = leads.filter(
    (lead: Lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      // deleteLead(id) - Implement this hook
    }
  }

  const handleAdd = (status: Lead["status"]) => {
    setEditingLead({ ...initialLead, status } as Lead)
    setIsCreating(true)
  }

  const handleDragDrop = (leadId: string, status: Lead["status"]) => {
    updateLead.mutate({ id: leadId, data: { status } })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const leadData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      source: formData.get("source") as string,
      estimatedValue: Number(formData.get("estimatedValue")),
      status: editingLead?.status || "new",
      notes: formData.get("notes") as string,
    }

    if (editingLead?.id) {
      updateLead.mutate({ id: editingLead.id, data: leadData })
    } else {
      createLead.mutate(leadData)
    }

    setIsCreating(false)
    setEditingLead(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button onClick={() => { setEditingLead(null); setIsCreating(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={view} onValueChange={(v: string) => setView(v as "table" | "kanban")}>
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <LeadTable
              leads={filteredLeads}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        <TabsContent value="kanban" className="mt-4">
          <LeadKanban
            leads={filteredLeads}
            onEdit={handleEdit}
            onAdd={handleAdd}
            onDragStart={() => { }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
          />
        </TabsContent>
      </Tabs>

      {/* Lead Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>
                {editingLead?.id ? "Edit Lead" : "Add New Lead"}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingLead?.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={editingLead?.email}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={editingLead?.phone}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="source" className="text-sm font-medium">
                      Source
                    </label>
                    <Input
                      id="source"
                      name="source"
                      defaultValue={editingLead?.source}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={editingLead?.address}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="estimatedValue" className="text-sm font-medium">
                    Estimated Value
                  </label>
                  <Input
                    id="estimatedValue"
                    name="estimatedValue"
                    type="number"
                    defaultValue={editingLead?.estimatedValue}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Input
                    id="notes"
                    name="notes"
                    defaultValue={editingLead?.notes}
                  />
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsCreating(false); setEditingLead(null) }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLead?.id ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

const initialLead: Partial<Lead> = {
  name: "",
  email: "",
  phone: "",
  address: "",
  source: "",
  estimatedValue: 0,
  notes: "",
  status: "new",
}
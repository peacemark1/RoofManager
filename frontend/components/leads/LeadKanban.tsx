"use client"

import { useState } from "react"
import { Lead } from "@/lib/hooks/useLeads"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface LeadKanbanProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onAdd: (status: Lead["status"]) => void
  onDragStart: (leadId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (leadId: string, status: Lead["status"]) => void
}

const columns: { id: Lead["status"]; title: string }[] = [
  { id: "new", title: "New" },
  { id: "contacted", title: "Contacted" },
  { id: "qualified", title: "Qualified" },
  { id: "proposal", title: "Proposal" },
  { id: "negotiation", title: "Negotiation" },
  { id: "won", title: "Won" },
  { id: "lost", title: "Lost" },
]

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  proposal: "bg-purple-100 text-purple-800",
  negotiation: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
}

export default function LeadKanban({
  leads,
  onEdit,
  onAdd,
  onDragStart,
  onDragOver,
  onDrop,
}: LeadKanbanProps) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null)

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId)
    onDragStart(leadId)
  }

  const handleDrop = (status: Lead["status"]) => {
    if (draggedLead) {
      onDrop(draggedLead, status)
      setDraggedLead(null)
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnLeads = leads.filter((lead) => lead.status === column.id)
        return (
          <div
            key={column.id}
            className="min-w-[280px] flex-1"
            onDragOver={onDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {column.title}
                  </CardTitle>
                  <Badge variant="secondary">{columnLeads.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {columnLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="cursor-move hover:shadow-md"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{lead.name}</span>
                        <Badge className={statusColors[lead.status]}>
                          ${lead.estimatedValue.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(lead)}
                        >
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => onAdd(column.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
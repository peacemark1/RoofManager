import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: string
  source: string
  notes: string
  propertyType: string
  estimatedValue: number
  createdAt: string
  updatedAt: string
  name?: string
}

function enrichLead(lead: Lead): Lead {
  return {
    ...lead,
    name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
  }
}

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await api.get("/leads")
      const leads = response.data?.data?.leads || response.data?.leads || []
      return leads.map(enrichLead)
    },
  })
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const response = await api.get(`/leads/${id}`)
      const lead = response.data?.data || response.data
      return enrichLead(lead)
    },
    enabled: !!id,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (lead: Partial<Lead> & { name?: string }) => {
      const payload = { ...lead }
      if (payload.name && !payload.firstName) {
        const parts = payload.name.split(' ')
        payload.firstName = parts[0]
        payload.lastName = parts.slice(1).join(' ')
      }
      delete payload.name
      const response = await api.post("/leads", payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> & { name?: string } }) => {
      const payload = { ...data }
      if (payload.name && !payload.firstName) {
        const parts = payload.name.split(' ')
        payload.firstName = parts[0]
        payload.lastName = parts.slice(1).join(' ')
      }
      delete payload.name
      const response = await api.patch(`/leads/${id}`, payload)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      queryClient.invalidateQueries({ queryKey: ["lead", variables.id] })
    },
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/leads/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}

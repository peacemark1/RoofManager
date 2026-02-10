import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export interface Job {
  id: string
  leadId: string
  customerName: string
  address: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  startDate: string
  endDate: string
  estimatedCost: number
  finalCost: number
  notes: string
  createdAt: string
  updatedAt: string
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs")
      return response.data.data.jobs || []
    },
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (job: Partial<Job>) => {
      const response = await api.post("/jobs", job)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Job> }) => {
      const response = await api.put(`/jobs/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/jobs/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}
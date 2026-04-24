import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export interface Job {
  id: string
  jobNumber: string
  title: string
  description: string
  address: string
  propertyType: string
  roofSize: number
  roofPitch: string
  status: string
  scheduledStart: string
  scheduledEnd: string
  estimatedCost: number
  actualCost: number
  customerName: string
  createdAt: string
  updatedAt: string
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs")
      return response.data?.data?.jobs || []
    },
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}`)
      return response.data?.data || response.data
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
      const response = await api.patch(`/jobs/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}

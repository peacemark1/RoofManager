import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export interface Quote {
  id: string
  leadId: string
  customerName: string
  address: string
  totalAmount: number
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected"
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  validUntil: string
  createdAt: string
  updatedAt: string
}

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await api.get("/quotes")
      return response.data.data.quotes || []
    },
  })
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const response = await api.get(`/quotes/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (quote: Partial<Quote>) => {
      const response = await api.post("/quotes", quote)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

export function useUpdateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Quote> }) => {
      const response = await api.put(`/quotes/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}
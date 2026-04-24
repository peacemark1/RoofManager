import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Quote {
  id: string
  quoteNumber: string
  jobId: string
  total: number
  subtotal: number
  tax: number
  discount: number
  status: string
  lineItems: QuoteItem[] | string
  validUntil: string
  publicLink: string
  notes: string
  createdAt: string
  updatedAt: string
}

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const response = await api.get("/quotes")
      return response.data?.data?.quotes || []
    },
  })
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const response = await api.get(`/quotes/${id}`)
      return response.data?.data || response.data
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
      const response = await api.patch(`/quotes/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

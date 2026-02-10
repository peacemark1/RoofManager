import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"

export interface Invoice {
  id: string
  jobId?: string
  customerId?: string
  customerName: string
  customerEmail?: string
  address: string
  totalAmount: number
  paidAmount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  paymentStatus?: "unpaid" | "processing" | "paid" | "refunded" | "failed"
  currency?: string
  dueDate: string
  items: {
    description: string
    amount: number
  }[]
  createdAt: string
  updatedAt: string
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await api.get("/invoices")
      return response.data
    },
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const response = await api.get(`/invoices/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (invoice: Partial<Invoice>) => {
      const response = await api.post("/invoices", invoice)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
      const response = await api.put(`/invoices/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}
"use client"

import { useState } from "react"
import { useInvoices, useCreateInvoice, Invoice } from "@/lib/hooks/useInvoices"
import { useJobs } from "@/lib/hooks/useJobs"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Plus,
  Search,
  DollarSign,
  Calendar,
  Printer,
  Send,
  CheckCircle,
  CreditCard,
  Loader2,
} from "lucide-react"
import { PaymentModal } from "@/components/payments"

export default function InvoicesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreating, setIsCreating] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const { data: invoices = [], isLoading } = useInvoices()
  const { data: jobs = [] } = useJobs()
  const createInvoice = useCreateInvoice()

  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const matchesSearch =
      invoice.customerName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const invoiceData = {
      customerName: formData.get("customerName") as string,
      address: formData.get("address") as string,
      dueDate: formData.get("dueDate") as string,
      totalAmount: Number(formData.get("totalAmount")),
      items: [
        {
          description: formData.get("description") as string,
          amount: Number(formData.get("totalAmount")),
        },
      ],
      jobId: formData.get("jobId") as string,
    }

    createInvoice.mutate(invoiceData)
    setIsCreating(false)
  }

  // Payment status colors
  const paymentStatusColors: Record<string, string> = {
    unpaid: "bg-gray-100 text-gray-800",
    processing: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-blue-100 text-blue-800",
    failed: "bg-red-100 text-red-800",
  }

  // Invoice status colors (for the status column)
  const invoiceStatusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  }

  const totalOutstanding = filteredInvoices
    .filter((i: Invoice) => i.status !== "paid" && i.status !== "cancelled")
    .reduce((sum: number, i: Invoice) => sum + (i.totalAmount - i.paidAmount), 0)

  const totalPaid = filteredInvoices
    .filter((i: Invoice) => i.status === "paid")
    .reduce((sum: number, i: Invoice) => sum + i.paidAmount, 0)

  const handlePayClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (reference: string) => {
    console.log("Payment successful:", reference)
    // The invoice status will be updated via React Query cache invalidation
    setIsPaymentModalOpen(false)
    setSelectedInvoice(null)
  }

  // Get payment initialization data
  const { data: paymentData, isLoading: isLoadingPayment } = useQuery({
    queryKey: ["payment-init", selectedInvoice?.id],
    queryFn: async () => {
      if (!selectedInvoice) return null
      const response = await api.post<any>("/payments/initialize", {
        invoiceId: selectedInvoice.id,
        customerEmail: selectedInvoice.customerEmail || "customer@example.com",
        customerCountry: "US", // Default to US for now, can be enhanced with customer data
      })
      return response.data
    },
    enabled: !!selectedInvoice && isPaymentModalOpen,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalOutstanding.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Paid This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalPaid.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredInvoices.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    #{invoice.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>${invoice.paidAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={invoiceStatusColors[invoice.status]}>
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[invoice.paymentStatus || "unpaid"]}>
                      {(invoice.paymentStatus || "unpaid").charAt(0).toUpperCase() +
                        (invoice.paymentStatus || "unpaid").slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" title="Print">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Send">
                      <Send className="h-4 w-4" />
                    </Button>
                    {(invoice.status === "sent" || invoice.status === "overdue") &&
                      invoice.paymentStatus !== "paid" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          title="Pay Now"
                          onClick={() => handlePayClick(invoice)}
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      )}
                    {invoice.paymentStatus === "paid" && (
                      <Button variant="ghost" size="sm" className="text-green-600" title="Paid">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Payment Modal */}
      {selectedInvoice && (
        <PaymentModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          provider={paymentData?.provider || "stripe"}
          amount={selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0)}
          email="customer@example.com"
          reference={paymentData?.reference}
          clientSecret={paymentData?.clientSecret}
          currency={selectedInvoice.currency || "USD"}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Invoice Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Create Invoice</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="jobId" className="text-sm font-medium">
                    Assign to Job
                  </label>
                  <select
                    id="jobId"
                    name="jobId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a job...</option>
                    {jobs.map((job: any) => (
                      <option key={job.id} value={job.id}>
                        {job.jobNumber} - {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="customerName" className="text-sm font-medium">
                    Customer Name
                  </label>
                  <Input
                    id="customerName"
                    name="customerName"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input id="address" name="address" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="totalAmount" className="text-sm font-medium">
                    Amount
                  </label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input id="description" name="description" required />
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Invoice</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

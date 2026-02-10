"use client"

import { useState, useMemo } from "react"
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
  Search,
  Download,
  Filter,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
} from "lucide-react"

interface Payment {
  id: string
  invoiceId: string
  amount: number
  currency: string
  method: string
  status: string
  transactionId: string
  createdAt: string
  paidAt?: string
  metadata?: {
    provider?: string
    channel?: string
    customerName?: string
    invoiceNumber?: string
  }
  invoice?: {
    customerName: string
    customerEmail: string
  }
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  const { data, isLoading, refetch } = useQuery<{ data: Payment[] }>({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await api.get<{ data: Payment[] }>("/payments")
      return response.data
    },
  })

  const payments = data?.data || []

  // Filter payments
  const filteredPayments = useMemo(() => {
    if (!Array.isArray(payments)) return []
    return payments.filter((payment: Payment) => {
      // Search filter
      const matchesSearch =
        !search ||
        payment.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        payment.invoice?.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        payment.metadata?.invoiceNumber?.toLowerCase().includes(search.toLowerCase())

      // Provider filter
      const provider = payment.metadata?.provider || payment.method
      const matchesProvider =
        providerFilter === "all" ||
        provider.toLowerCase() === providerFilter.toLowerCase()

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        payment.status.toLowerCase() === statusFilter.toLowerCase()

      // Date filter
      const paymentDate = new Date(payment.createdAt)
      const matchesDateFrom = !dateFrom || paymentDate >= new Date(dateFrom)
      const matchesDateTo = !dateTo || paymentDate <= new Date(dateTo + "T23:59:59")

      return matchesSearch && matchesProvider && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [payments, search, providerFilter, statusFilter, dateFrom, dateTo])

  // Calculate totals
  const totals = useMemo(() => {
    return filteredPayments.reduce(
      (acc: Record<string, number>, payment: Payment) => {
        if (payment.status === "completed") {
          acc.totalReceived += payment.amount
          acc.successfulCount += 1
        } else if (payment.status === "pending") {
          acc.pendingAmount += payment.amount
          acc.pendingCount += 1
        } else if (payment.status === "failed") {
          acc.failedCount += 1
        } else if (payment.status === "refunded") {
          acc.refundedAmount += payment.amount
          acc.refundedCount += 1
        }
        return acc
      },
      { totalReceived: 0, pendingAmount: 0, refundedAmount: 0, successfulCount: 0, pendingCount: 0, failedCount: 0, refundedCount: 0 }
    )
  }, [filteredPayments])

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Date", "Invoice #", "Customer", "Amount", "Currency", "Provider", "Status", "Transaction ID"]
    const rows = filteredPayments.map((payment: Payment) => [
      new Date(payment.createdAt).toLocaleString(),
      payment.metadata?.invoiceNumber || payment.invoiceId.slice(0, 8),
      payment.invoice?.customerName || payment.metadata?.customerName || "N/A",
      payment.amount,
      payment.currency,
      payment.metadata?.provider || payment.method,
      payment.status,
      payment.transactionId,
    ])

    const csvContent = [headers.join(","), ...rows.map((row: (string | number)[]) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Status badge colors
  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-blue-100 text-blue-800",
  }

  // Status icons
  const statusIcons: Record<string, React.ReactNode> = {
    completed: <CheckCircle className="w-4 h-4 text-green-600" />,
    pending: <Clock className="w-4 h-4 text-yellow-600" />,
    failed: <XCircle className="w-4 h-4 text-red-600" />,
    refunded: <RefreshCcw className="w-4 h-4 text-blue-600" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totals.totalReceived.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">{totals.successfulCount} successful</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${totals.pendingAmount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">{totals.pendingCount} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-blue-600" />
              Refunded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totals.refundedAmount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">{totals.refundedCount} refunded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totals.failedCount}
            </div>
            <p className="text-sm text-gray-500">failed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customer, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
          aria-label="Filter by provider"
        >
          <option value="all">All Providers</option>
          <option value="paystack">Paystack</option>
          <option value="stripe">Stripe</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
            placeholder="From"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
            placeholder="To"
          />
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment: Payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    #{payment.metadata?.invoiceNumber || payment.invoiceId.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>{payment.invoice?.customerName || payment.metadata?.customerName || "N/A"}</div>
                    <div className="text-xs text-gray-500">{payment.invoice?.customerEmail}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {payment.metadata?.provider || payment.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcons[payment.status]}
                      <Badge className={statusColors[payment.status]}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payment.transactionId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-sm text-gray-500 text-right">
        Showing {filteredPayments.length} of {payments.length} payments
      </p>
    </div>
  )
}

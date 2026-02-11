"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payments"
import { Loader2, ArrowLeft, DollarSign, Calendar, FileText, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface InvoiceDetail {
  id: string
  invoiceNumber: string
  totalAmount: number
  paidAmount: number
  status: string
  dueDate: string
  description?: string
  items: InvoiceItem[]
  customer: {
    name: string
    email: string
    phone?: string
  }
  company: {
    name: string
    phone?: string
    email?: string
  }
  currency: string
  countryCode: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function CustomerInvoicePage() {
  const params = useParams()
  const token = params.token as string
  const invoiceId = params.invoiceId as string
  const [showPayment, setShowPayment] = useState(false)

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["customer-invoice", token, invoiceId],
    queryFn: async () => {
      const response = await api.get<{ data: InvoiceDetail }>(`/customer/${token}/invoice/${invoiceId}`)
      return response.data.data
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invoice Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-4">
              This invoice could not be found or you don&apos;t have access.
            </p>
            <Link href={`/customer/${token}`}>
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const amountDue = invoice.totalAmount - invoice.paidAmount
  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid'
  const canPay = amountDue > 0 && invoice.status !== 'paid'

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link href={`/customer/${token}`} className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
            <p className="text-gray-500 mt-1">
              Issued by {invoice.company.name}
            </p>
          </div>
          <div className="text-right">
            <Badge className={`text-lg px-4 py-1 ${getInvoiceStatusColor(invoice.status, isOverdue)}`}>
              {isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
            {isOverdue && (
              <p className="text-red-600 text-sm mt-1">
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Payment Summary Card */}
        {canPay && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-medium">Amount Due</p>
                  <p className="text-4xl font-bold text-blue-600">
                    ${amountDue.toLocaleString()}
                  </p>
                  {invoice.paidAmount > 0 && (
                    <p className="text-sm text-blue-600 mt-1">
                      (${invoice.paidAmount.toLocaleString()} already paid)
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => setShowPayment(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already Paid Card */}
        {invoice.status === 'paid' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-center">
                <DollarSign className="h-12 w-12 text-green-600 mr-4" />
                <div>
                  <p className="text-xl font-semibold text-green-800">Invoice Paid</p>
                  <p className="text-green-600">
                    Thank you! This invoice has been paid in full.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Billed To</p>
                <p className="font-medium">{invoice.customer.name}</p>
                {invoice.customer.email && <p className="text-sm text-gray-500">{invoice.customer.email}</p>}
              </div>
            </div>

            {invoice.description && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{invoice.description}</p>
              </div>
            )}

            {/* Line Items */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Item</th>
                    <th className="text-center p-3 text-sm font-medium text-gray-600">Qty</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-600">Unit Price</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item: InvoiceItem) => (
                    <tr key={item.id}>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium">${item.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-bold text-lg">Total Amount</td>
                    <td className="p-3 text-right font-bold text-lg text-blue-600">
                      ${invoice.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Questions about this invoice?</p>
          <p className="mt-1">
            {invoice.company.email && (
              <a href={`mailto:${invoice.company.email}`} className="text-blue-600 hover:underline">
                {invoice.company.email}
              </a>
            )}
            {invoice.company.phone && (
              <>
                <span className="mx-2">•</span>
                <a href={`tel:${invoice.company.phone}`} className="text-blue-600 hover:underline">
                  {invoice.company.phone}
                </a>
              </>
            )}
          </p>
        </div>

        {/* Payment Modal */}
        {showPayment && invoice && (
          <PaymentModal
            open={showPayment}
            onOpenChange={setShowPayment}
            provider={invoice.countryCode === 'GH' ? 'paystack' : 'stripe'}
            amount={amountDue}
            email={invoice.customer.email}
            currency={invoice.currency || 'USD'}
            onSuccess={(ref) => {
              console.log('Payment successful:', ref);
              setShowPayment(false);
            }}
          />
        )}
      </div>
    </div>
  )
}

function getInvoiceStatusColor(status: string, isOverdue: boolean) {
  if (isOverdue) return 'bg-red-100 text-red-800'
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'partial': return 'bg-yellow-100 text-yellow-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

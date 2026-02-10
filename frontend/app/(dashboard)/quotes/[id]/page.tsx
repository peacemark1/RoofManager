"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, Mail, Download, Link2, Loader2, Check, 
  Pencil, Send, FileText, DollarSign, Calendar 
} from "lucide-react"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  quoteNumber: string
  status: string
  lineItems: LineItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  notes: string
  termsAndConditions: string
  validUntil: string
  pdfUrl: string
  publicLink: string
  job: {
    title: string
    address: string
  }
  creator: {
    firstName: string
    lastName: string
  }
}

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quoteId = params.id as string

  const [isEditing, setIsEditing] = useState(false)
  const [editedQuote, setEditedQuote] = useState<Quote | null>(null)
  const [sendEmail, setSendEmail] = useState({ recipientEmail: "", message: "" })

  // Fetch quote
  const { data: quoteData, isLoading, refetch } = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: async () => {
      const response = await api.get<{ data: Quote }>(`/quotes/${quoteId}`)
      return response.data
    }
  })

  const quote = quoteData?.data

  // Send quote mutation
  const sendQuoteMutation = useMutation({
    mutationFn: async (data: { recipientEmail: string; message: string }) => {
      const response = await api.post(`/quotes/${quoteId}/send`, data)
      return response.data
    },
    onSuccess: () => {
      refetch()
      alert("Quote sent successfully!")
    },
    onError: (error: any) => {
      alert(error.response?.data?.error?.message || "Failed to send quote")
    }
  })

  // Generate PDF mutation
  const generatePDFMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/quotes/${quoteId}/generate-pdf`)
      return response.data
    },
    onSuccess: (data) => {
      refetch()
      // Open PDF in new tab
      if (data.data.url) {
        window.open(data.data.url, '_blank')
      }
    },
    onError: (error: any) => {
      alert(error.response?.data?.error?.message || "Failed to generate PDF")
    }
  })

  // Regenerate public link mutation
  const regenerateLinkMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/quotes/${quoteId}/regenerate-link`)
      return response.data
    },
    onSuccess: (data) => {
      refetch()
      navigator.clipboard.writeText(data.data.publicUrl)
      alert("New public link copied to clipboard!")
    },
    onError: (error: any) => {
      alert(error.response?.data?.error?.message || "Failed to regenerate link")
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'default'
      case 'SENT': case 'VIEWED': return 'secondary'
      case 'REJECTED': return 'destructive'
      default: return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quote not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const lineItems = Array.isArray(quote.lineItems) ? quote.lineItems : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quote #{quote.quoteNumber}</h1>
            <p className="text-gray-500">{quote.job?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusBadgeVariant(quote.status)} className="text-sm">
            {quote.status}
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => regenerateLinkMutation.mutate()}
            disabled={regenerateLinkMutation.isPending}
          >
            {regenerateLinkMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="h-4 w-4 mr-2" />
            )}
            Copy Public Link
          </Button>
          <Button 
            variant="outline" 
            onClick={() => generatePDFMutation.mutate()}
            disabled={generatePDFMutation.isPending}
          >
            {generatePDFMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Quote Details */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send to Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Email</label>
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  value={sendEmail.recipientEmail}
                  onChange={(e) => setSendEmail({ ...sendEmail, recipientEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (optional)</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]"
                  placeholder="Add a personal message to the customer..."
                  value={sendEmail.message}
                  onChange={(e) => setSendEmail({ ...sendEmail, message: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => sendQuoteMutation.mutate(sendEmail)}
                disabled={sendQuoteMutation.isPending || !sendEmail.recipientEmail}
              >
                {sendQuoteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Quote Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Line Items Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Line Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-bold">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(quote.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(quote.tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          {(quote.notes || quote.termsAndConditions) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-gray-600">{quote.notes}</p>
                  </div>
                )}
                {quote.termsAndConditions && (
                  <div>
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-gray-600">{quote.termsAndConditions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="sticky top-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.pdfUrl ? (
                <div className="aspect-[1/1.414] bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={quote.pdfUrl}
                    className="w-full h-full"
                    title="Quote Preview"
                  />
                </div>
              ) : (
                <div className="aspect-[1/1.414] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>PDF preview will appear here</p>
                    <Button 
                      variant="link" 
                      onClick={() => generatePDFMutation.mutate()}
                      disabled={generatePDFMutation.isPending}
                    >
                      Generate PDF Preview
                    </Button>
                  </div>
                </div>
              )}

              {/* Quote Info */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="text-sm font-medium">{formatDate(quote.validUntil)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-medium">{formatCurrency(quote.total)}</p>
                  </div>
                </div>
              </div>

              {/* Created By */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">Created by</p>
                <p className="text-sm font-medium">
                  {quote.creator?.firstName} {quote.creator?.lastName}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

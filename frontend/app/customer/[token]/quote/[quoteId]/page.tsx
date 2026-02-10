"use client"

import { useParams } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft, FileText, CheckCircle, Calendar, DollarSign, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface QuoteDetail {
  id: string
  quoteNumber: string
  totalAmount: number
  status: string
  createdAt: string
  validUntil: string
  description?: string
  items: QuoteItem[]
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
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface AcceptQuoteResponse {
  success: boolean
  message: string
  signature?: string
}

export default function CustomerQuotePage() {
  const params = useParams()
  const token = params.token as string
  const quoteId = params.quoteId as string
  const [signature, setSignature] = useState("")
  const [showAcceptForm, setShowAcceptForm] = useState(false)

  const { data: quote, isLoading, error, refetch } = useQuery({
    queryKey: ["customer-quote", token, quoteId],
    queryFn: async () => {
      const response = await api.get<{ data: QuoteDetail }>(`/customer/${token}/quote/${quoteId}`)
      return response.data.data
    }
  })

  const acceptMutation = useMutation({
    mutationFn: async (sig: string) => {
      const response = await api.post<AcceptQuoteResponse>(`/customer/${token}/quote/${quoteId}/accept`, { signature: sig })
      return response.data
    },
    onSuccess: (data) => {
      refetch()
      alert(data.message)
      setShowAcceptForm(false)
      setSignature("")
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to accept quote")
    }
  })

  const handleAccept = () => {
    if (!signature.trim()) {
      alert("Please type your name as signature")
      return
    }
    acceptMutation.mutate(signature)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Quote Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-4">
              This quote could not be found or you don't have access.
            </p>
            <Link href={`/customer/${token}`}>
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(quote.validUntil) < new Date()

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
            <h1 className="text-3xl font-bold text-gray-900">Quote #{quote.quoteNumber}</h1>
            <p className="text-gray-500 mt-1">
              Prepared on {new Date(quote.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className={`text-lg px-4 py-1 ${getQuoteStatusColor(quote.status)}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </Badge>
        </div>

        {/* Quote Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Quote Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</p>
                {isExpired && <Badge className="mt-1 bg-red-100 text-red-800">Expired</Badge>}
              </div>
              <div>
                <p className="text-sm text-gray-500">Prepared By</p>
                <p className="font-medium">{quote.company.name}</p>
                {quote.company.phone && <p className="text-sm text-gray-500">{quote.company.phone}</p>}
              </div>
            </div>

            {quote.description && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{quote.description}</p>
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
                  {quote.items.map((item: QuoteItem) => (
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
                      ${quote.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Accept Quote Section */}
        {quote.status === 'sent' && !isExpired && (
          <Card className={showAcceptForm ? "ring-2 ring-green-500" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-green-600" />
                Accept This Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showAcceptForm ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    By accepting this quote, you agree to proceed with the work as described.
                  </p>
                  <Button onClick={() => setShowAcceptForm(true)} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Quote
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Electronic Signature:</strong> By typing your name below, you agree that your 
                      electronic signature has the same legal effect as a physical signature.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type your full name as signature
                    </label>
                    <Input
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={quote.customer.name}
                      className="text-lg"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleAccept}
                      disabled={acceptMutation.isPending || !signature.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {acceptMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Acceptance
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAcceptForm(false)
                        setSignature("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Already Accepted Message */}
        {quote.status === 'accepted' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
                <div>
                  <p className="text-xl font-semibold text-green-800">Quote Accepted</p>
                  <p className="text-green-600">
                    Thank you for accepting this quote. We will be in touch shortly to schedule your project.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Questions about this quote?</p>
          <p className="mt-1">
            {quote.company.email && (
              <a href={`mailto:${quote.company.email}`} className="text-blue-600 hover:underline">
                {quote.company.email}
              </a>
            )}
            {quote.company.phone && (
              <>
                <span className="mx-2">•</span>
                <a href={`tel:${quote.company.phone}`} className="text-blue-600 hover:underline">
                  {quote.company.phone}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function getQuoteStatusColor(status: string) {
  switch (status) {
    case 'accepted': return 'bg-green-100 text-green-800'
    case 'sent': return 'bg-blue-100 text-blue-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

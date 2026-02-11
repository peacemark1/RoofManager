"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Check, AlertCircle, FileText, DollarSign, Calendar,
  Phone, Mail, MapPin, Loader2, Building
} from "lucide-react"

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  quoteNumber: string
  lineItems: LineItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  notes: string
  termsAndConditions: string
  validUntil: string
  status: string
  company: {
    name: string
    logo: string
    primaryColor: string
    subdomain: string
  }
  job: {
    title: string
    address: string
    propertyType: string
    customerName: string
    customerEmail: string
    customerPhone: string
  }
  approval: {
    signedBy: string
    signedAt: string
  }
}

export default function PublicQuotePage() {
  const params = useParams()
  const publicLink = params.publicLink as string

  const [signatureData, setSignatureData] = useState<string>("")
  const [signedBy, setSignedBy] = useState("")
  const [hasAgreed, setHasAgreed] = useState(false)

  // Fetch quote
  const { data: quoteData, isLoading, error, refetch } = useQuery({
    queryKey: ['publicQuote', publicLink],
    queryFn: async () => {
      const response = await fetch(`/api/quotes/public/${publicLink}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || "Failed to load quote")
      return data
    }
  })

  const quote = quoteData?.data

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (data: { signedBy: string; signatureData: string }) => {
      const response = await fetch(`/api/quotes/public/${publicLink}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error?.message || "Failed to approve quote")
      return result
    },
    onSuccess: () => {
      refetch()
      setSignatureData("")
      setSignedBy("")
      setHasAgreed(false)
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

  const handleSign = () => {
    if (!signedBy.trim()) {
      alert("Please enter your name to sign")
      return
    }
    if (!signatureData) {
      alert("Please provide your signature")
      return
    }
    if (!hasAgreed) {
      alert("Please agree to the terms and conditions")
      return
    }
    approveMutation.mutate({ signedBy: signedBy.trim(), signatureData })
  }

  const isExpired = quote && new Date(quote.validUntil) < new Date() && quote.status !== 'APPROVED'
  const isApproved = quote?.status === 'APPROVED'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quote Not Found</h2>
            <p className="text-gray-600">
              This quote link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const lineItems = Array.isArray(quote.lineItems) ? quote.lineItems : []

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Company Header */}
      <div
        className="bg-white shadow-md"
        style={{ borderTop: `6px solid ${quote.company.primaryColor}` }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {quote.company.logo ? (
                <Image
                  src={quote.company.logo}
                  alt={quote.company.name}
                  height={48}
                  width={150}
                  className="h-12 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: quote.company.primaryColor }}
                >
                  {quote.company.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">{quote.company.name}</h1>
                <p className="text-sm text-gray-500">Roofing & Construction Services</p>
              </div>
            </div>
            <Badge
              className="text-sm"
              style={{
                backgroundColor: isApproved
                  ? '#dcfce7'
                  : isExpired
                    ? '#fee2e2'
                    : '#e0f2fe',
                color: isApproved
                  ? '#166534'
                  : isExpired
                    ? '#991b1b'
                    : '#0369a1'
              }}
            >
              {isApproved
                ? '✓ Approved'
                : isExpired
                  ? 'Expired'
                  : quote.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message for Approved */}
        {isApproved && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="py-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Quote Approved!
              </h2>
              <p className="text-green-700">
                Thank you for approving this quote. We will be in touch shortly to schedule your project.
              </p>
              {quote.approval && (
                <p className="text-sm text-green-600 mt-4">
                  Signed by {quote.approval.signedBy} on {formatDate(quote.approval.signedAt)}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Expiry Warning */}
        {isExpired && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="py-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">
                This quote expired on {formatDate(quote.validUntil)}
              </p>
              <p className="text-red-600 text-sm">
                Please contact {quote.company.name} for a new quote.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote #{quote.quoteNumber}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Job Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Project</h3>
                    <p className="text-gray-700">{quote.job.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {quote.job.address}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Property: {quote.job.propertyType}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="font-medium">{formatDate(quote.validUntil)}</p>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: quote.company.primaryColor }}>
                        <th className="text-left p-3 text-white font-semibold">Description</th>
                        <th className="text-center p-3 text-white font-semibold">Qty</th>
                        <th className="text-right p-3 text-white font-semibold">Price</th>
                        <th className="text-right p-3 text-white font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-6 max-w-xs ml-auto">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(quote.subtotal)}</span>
                  </div>
                  {quote.discount > 0 && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(quote.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(quote.tax)}</span>
                  </div>
                  <div
                    className="flex justify-between py-3 text-xl font-bold border-t mt-2"
                    style={{ color: quote.company.primaryColor }}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(quote.total)}</span>
                  </div>
                </div>

                {/* Notes */}
                {quote.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{quote.notes}</p>
                  </div>
                )}

                {/* Terms */}
                {quote.termsAndConditions && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-gray-600">{quote.termsAndConditions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approval Card - Only show if not approved and not expired */}
            {!isApproved && !isExpired && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Approve This Quote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    By approving this quote, you agree to the terms and conditions outlined above.
                  </p>

                  {/* Signature Pad */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Your Signature <span className="text-red-500">*</span>
                    </label>
                    <div
                      className="border-2 border-dashed rounded-lg p-4 bg-gray-50"
                      style={{ minHeight: '120px' }}
                    >
                      {signatureData ? (
                        <img
                          src={signatureData}
                          alt="Signature"
                          className="max-h-24 mx-auto"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                          <p className="text-sm">Signature will appear here</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Simple signature input simulation
                          const canvas = document.createElement('canvas')
                          canvas.width = 300
                          canvas.height = 100
                          const ctx = canvas.getContext('2d')
                          if (ctx) {
                            ctx.fillStyle = '#f9fafb'
                            ctx.fillRect(0, 0, 300, 100)
                            ctx.fillStyle = '#1e40af'
                            ctx.font = 'italic 40px "Brush Script MT", cursive'
                            ctx.fillText(signedBy || 'Signature', 20, 65)
                            setSignatureData(canvas.toDataURL())
                          }
                        }}
                      >
                        Generate from Name
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSignatureData("")}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      value={signedBy}
                      onChange={(e) => setSignedBy(e.target.value)}
                    />
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agree"
                      checked={hasAgreed}
                      onChange={(e) => setHasAgreed(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="agree" className="text-sm text-gray-600">
                      I agree to the terms and conditions outlined in this quote and
                      authorize {quote.company.name} to proceed with the work.
                    </label>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSign}
                    disabled={approveMutation.isPending}
                    style={{ backgroundColor: quote.company.primaryColor }}
                  >
                    {approveMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Approve Quote
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{quote.company.name}</p>
                    <a
                      href={`https://${quote.company.subdomain}.roofmanager.com`}
                      target="_blank"
                      className="text-sm text-primary hover:underline"
                    >
                      {quote.company.subdomain}.roofmanager.com
                    </a>
                  </div>
                </div>

                {quote.job.customerName && (
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {quote.job.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{quote.job.customerName}</p>
                    </div>
                  </div>
                )}

                {quote.job.customerEmail && (
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <a
                      href={`mailto:${quote.job.customerEmail}`}
                      className="text-primary hover:underline"
                    >
                      {quote.job.customerEmail}
                    </a>
                  </div>
                )}

                {quote.job.customerPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <a
                      href={`tel:${quote.job.customerPhone}`}
                      className="text-primary hover:underline"
                    >
                      {quote.job.customerPhone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="bg-gray-50">
              <CardContent className="py-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about this quote, please don't hesitate to contact us.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = `mailto:${quote.company.subdomain}@roofmanager.com`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 pb-8">
          <p>Powered by RoofManager</p>
        </div>
      </div>
    </div>
  )
}

// Import required hooks
import { useQuery, useMutation } from "@tanstack/react-query"

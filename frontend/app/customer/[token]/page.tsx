"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, Briefcase, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CustomerData {
  customer: {
    name: string
    email: string
    phone?: string
  }
  company: {
    name: string
    logo?: string
    phone?: string
    email?: string
  }
  quotes: Quote[]
  invoices: Invoice[]
  jobs: Job[]
}

interface Quote {
  id: string
  quoteNumber: string
  totalAmount: number
  status: string
  createdAt: string
  validUntil: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  totalAmount: number
  paidAmount: number
  status: string
  dueDate: string
}

interface Job {
  id: string
  title: string
  status: string
  startDate: string
  scheduledEndDate?: string
  address: string
}

export default function CustomerPortalPage() {
  const params = useParams()
  const token = params.token as string

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-portal", token],
    queryFn: async () => {
      const response = await api.get<{ data: CustomerData }>(`/customer/${token}`)
      return response.data.data
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center">
              This link is invalid or has expired. Please contact us for a new access link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { customer, company, quotes, invoices, jobs } = data

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          {company.logo && (
            <div className="relative h-16 mb-4 flex justify-center">
              <Image
                src={company.logo}
                alt={company.name}
                height={64}
                width={200}
                className="h-16 w-auto object-contain"
                unoptimized
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {customer.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            View your quotes, invoices, and track job progress
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Powered by {company.name}
          </p>
        </div>

        {/* Quotes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Your Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No quotes yet</p>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote: Quote) => (
                  <Link
                    key={quote.id}
                    href={`/customer/${token}/quote/${quote.id}`}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium">Quote #{quote.quoteNumber || quote.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(quote.createdAt).toLocaleDateString()} • Valid until {new Date(quote.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          ${quote.totalAmount.toLocaleString()}
                        </span>
                        <Badge className={getQuoteStatusColor(quote.status)}>
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
              Your Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice: Invoice) => {
                  const amountDue = invoice.totalAmount - invoice.paidAmount
                  return (
                    <Link
                      key={invoice.id}
                      href={`/customer/${token}/invoice/${invoice.id}`}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors cursor-pointer">
                        <div>
                          <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold">${amountDue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              of ${invoice.totalAmount.toLocaleString()}
                            </p>
                          </div>
                          <Badge className={getInvoiceStatusColor(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-purple-600" />
              Your Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No jobs scheduled yet</p>
            ) : (
              <div className="space-y-3">
                {jobs.map((job: Job) => (
                  <Link
                    key={job.id}
                    href={`/customer/${token}/job/${job.id}`}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-500">
                          {job.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          Scheduled: {new Date(job.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getJobStatusColor(job.status)}>
                          {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.replace('_', ' ').slice(1)}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Questions? Contact us at:</p>
          <p className="mt-1">
            {company.email && <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a>}
            {company.phone && <span className="mx-2">•</span>}
            {company.phone && <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">{company.phone}</a>}
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

function getInvoiceStatusColor(status: string) {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    case 'partial': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getJobStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'scheduled': return 'bg-purple-100 text-purple-800'
    case 'on_hold': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

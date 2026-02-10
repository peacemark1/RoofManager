"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Briefcase, Calendar, MapPin, Clock, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface JobDetail {
  id: string
  title: string
  status: string
  startDate: string
  scheduledEndDate?: string
  completedAt?: string
  address: string
  description?: string
  notes: JobNote[]
  timeline: JobTimelineItem[]
  quote: { id: string; quoteNumber: string; totalAmount: number } | null
  invoice: { id: string; invoiceNumber: string; totalAmount: number; status: string } | null
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

interface JobNote {
  id: string
  content: string
  createdAt: string
  type: 'update' | 'milestone' | 'issue'
}

interface JobTimelineItem {
  id: string
  title: string
  description?: string
  date: string
  completed: boolean
}

export default function CustomerJobPage() {
  const params = useParams()
  const token = params.token as string
  const jobId = params.jobId as string

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["customer-job", token, jobId],
    queryFn: async () => {
      const response = await api.get<{ data: JobDetail }>(`/customer/${token}/job/${jobId}`)
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

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Job Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center mb-4">
              This job could not be found or you don't have access.
            </p>
            <Link href={`/customer/${token}`}>
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getProgressPercentage = () => {
    switch (job.status) {
      case 'scheduled': return 10
      case 'in_progress': return 50
      case 'completed': return 100
      default: return 0
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center mt-2 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.address}</span>
            </div>
          </div>
          <Badge className={`text-lg px-4 py-1 ${getJobStatusColor(job.status)}`}>
            {formatJobStatus(job.status)}
          </Badge>
        </div>

        {/* Progress Card */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Project Progress</span>
              <span className="text-2xl font-bold text-blue-600">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-lg">{format(new Date(job.startDate), 'MMMM d, yyyy')}</p>
              </div>
              {job.scheduledEndDate && (
                <div>
                  <p className="text-sm text-gray-500">Expected Completion</p>
                  <p className="font-medium text-lg">{format(new Date(job.scheduledEndDate), 'MMMM d, yyyy')}</p>
                </div>
              )}
              {job.completedAt && (
                <div>
                  <p className="text-sm text-gray-500">Completed On</p>
                  <p className="font-medium text-lg text-green-600">{format(new Date(job.completedAt), 'MMMM d, yyyy')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {job.timeline && job.timeline.length > 0 ? (
              <div className="space-y-4">
                {job.timeline.map((item: JobTimelineItem, index: number) => (
                  <div key={item.id} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      {index < job.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${item.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Timeline will be available soon
              </p>
            )}
          </CardContent>
        </Card>

        {/* Related Documents */}
        <div className="grid grid-cols-2 gap-4">
          {job.quote && (
            <Link href={`/customer/${token}/quote/${job.quote.id}`}>
              <Card className="hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors">
                <CardContent className="py-4 flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">View Quote</p>
                    <p className="text-sm text-gray-500">
                      #{job.quote.quoteNumber} - ${job.quote.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {job.invoice && (
            <Link href={`/customer/${token}/invoice/${job.invoice.id}`}>
              <Card className="hover:bg-green-50 hover:border-green-200 cursor-pointer transition-colors">
                <CardContent className="py-4 flex items-center">
                  <Briefcase className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">View Invoice</p>
                    <p className="text-sm text-gray-500">
                      #{job.invoice.invoiceNumber} - ${job.invoice.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Notes & Updates */}
        {job.notes && job.notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Notes & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {job.notes.map((note: JobNote) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getNoteTypeColor(note.type)}>
                        {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {format(new Date(note.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {job.description && (
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{job.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Questions about this job?</p>
          <p className="mt-1">
            {job.company.email && (
              <a href={`mailto:${job.company.email}`} className="text-blue-600 hover:underline">
                {job.company.email}
              </a>
            )}
            {job.company.phone && (
              <>
                <span className="mx-2">•</span>
                <a href={`tel:${job.company.phone}`} className="text-blue-600 hover:underline">
                  {job.company.phone}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function formatJobStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getJobStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'scheduled': return 'bg-purple-100 text-purple-800'
    case 'on_hold': return 'bg-yellow-100 text-yellow-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getNoteTypeColor(type: string) {
  switch (type) {
    case 'milestone': return 'bg-green-100 text-green-800'
    case 'issue': return 'bg-red-100 text-red-800'
    case 'update': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

"use client"

import { useParams } from "next/navigation"
import { useJob, useUpdateJob } from "@/lib/hooks/useJobs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, DollarSign, MapPin, User } from "lucide-react"
import Link from "next/link"

export default function JobDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data: job, isLoading } = useJob(id)
  const updateJob = useUpdateJob()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!job) {
    return <div>Job not found</div>
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const handleStatusChange = (status: any) => {
    updateJob.mutate({ id, data: { status } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{job.customerName}</h1>
        <Badge className={statusColors[job.status]}>
          {job.status.replace("_", " ").charAt(0).toUpperCase() +
            job.status.replace("_", " ").slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <span>{job.address}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span>
                {new Date(job.startDate).toLocaleDateString()} -{" "}
                {job.endDate
                  ? new Date(job.endDate).toLocaleDateString()
                  : "TBD"}
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
              <span>Estimated: ${job.estimatedCost.toLocaleString()}</span>
            </div>
            {job.finalCost > 0 && (
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                <span>Final: ${job.finalCost.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("scheduled")}
                disabled={job.status === "scheduled"}
              >
                Schedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("in_progress")}
                disabled={job.status === "in_progress"}
              >
                Start Job
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("completed")}
                disabled={job.status === "completed"}
              >
                Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("cancelled")}
                disabled={job.status === "cancelled"}
                className="text-red-600"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {job.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{job.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
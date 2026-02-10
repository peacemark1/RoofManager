"use client"

import { useState } from "react"
import { useJobs, useCreateJob, useUpdateJob, Job } from "@/lib/hooks/useJobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Calendar, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  const [search, setSearch] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const { data: jobs = [], isLoading } = useJobs()
  const createJob = useCreateJob()

  const filteredJobs = jobs.filter(
    (job: Job) =>
      job.customerName.toLowerCase().includes(search.toLowerCase()) ||
      job.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const jobData = {
      customerName: formData.get("customerName") as string,
      address: formData.get("address") as string,
      startDate: formData.get("startDate") as string,
      estimatedCost: Number(formData.get("estimatedCost")),
      notes: formData.get("notes") as string,
    }

    createJob.mutate(jobData)
    setIsCreating(false)
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Job
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job: Job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{job.customerName}</CardTitle>
                    <Badge className={statusColors[job.status]}>
                      {job.status.replace("_", " ").charAt(0).toUpperCase() +
                        job.status.replace("_", " ").slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2 h-4 w-4" />
                    {job.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(job.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Est: ${job.estimatedCost.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Job Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Schedule New Job</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
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
                  <Input
                    id="address"
                    name="address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="estimatedCost" className="text-sm font-medium">
                    Estimated Cost
                  </label>
                  <Input
                    id="estimatedCost"
                    name="estimatedCost"
                    type="number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Input
                    id="notes"
                    name="notes"
                  />
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
                <Button type="submit">Schedule Job</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
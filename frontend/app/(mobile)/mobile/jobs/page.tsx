"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Calendar, 
  Users, 
  Loader2, 
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useOfflineStore } from "@/lib/stores/offlineStore"

interface Job {
  id: string
  jobNumber: string
  title: string
  address: string
  status: string
  propertyType: string
  scheduledStart: string
  scheduledEnd: string
  assignments: { userId: string; user: { firstName: string; role: string } }[]
}

export default function MobileJobsPage() {
  const router = useRouter()
  const { setJobs, jobs, isOnline } = useOfflineStore()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch jobs from API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['mobileJobs'],
    queryFn: async () => {
      const response = await api.get<{ data: Job[] }>('/jobs?status=IN_PROGRESS,SCHEDULED')
      return response.data
    },
    // Only fetch when online
    enabled: isOnline
  })

  // Use cached jobs when offline
  const displayJobs = data?.data || jobs

  // Update offline store with fetched jobs
  useEffect(() => {
    if (data?.data) {
      setJobs(data.data as any)
    }
  }, [data?.data, setJobs])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading && !displayJobs.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-gray-500 text-sm">
            {displayJobs.length} jobs assigned
          </p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">You're offline. Showing cached jobs.</p>
        </div>
      )}

      {/* Job List */}
      {displayJobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Jobs Found</h2>
          <p className="text-gray-500">
            You don't have any active jobs assigned.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayJobs.map((job) => (
            <Link key={job.id} href={`/mobile/jobs/${job.id}`}>
              <Card className="tap-highlight-none active:scale-98 transition-transform">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.jobNumber}</p>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{job.address}</p>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(job.scheduledStart)}
                    </Badge>
                    {job.assignments.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.assignments.length} crew
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Import icons
import { Briefcase } from "lucide-react"

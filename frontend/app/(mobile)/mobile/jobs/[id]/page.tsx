"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Clock,
  Camera,
  Play,
  Square,
  Loader2,
  CheckCircle,
  Ruler,
  Home
} from "lucide-react"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { useOfflineStore } from "@/lib/stores/offlineStore"
import GPSCheckIn from "@/components/mobile/GPSCheckIn"
import PhotoUpload from "@/components/mobile/PhotoUpload"

interface Job {
  id: string
  jobNumber: string
  title: string
  address: string
  status: string
  propertyType: string
  roofSize: number
  roofPitch: string
  scheduledStart: string
  scheduledEnd: string
  estimatedCost: number
  actualCost: number
  description: string
  assignments: { userId: string; user: { firstName: string; lastName: string; role: string } }[]
  photos: { id: string; url: string; caption?: string; takenAt: string }[]
  materials: { id: string; name: string; quantityPlanned: number; quantityUsed: number }[]
}

interface Photo {
  id: string
  url: string
  caption?: string
  latitude?: number
  longitude?: number
  takenAt: string
}

export default function MobileJobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const { 
    activeTimeLog, 
    startTimer, 
    stopTimer, 
    addPendingPhoto,
    selectJob,
    jobs 
  } = useOfflineStore()

  // Select job for offline access
  useEffect(() => {
    if (jobId && jobs.length > 0) {
      const job = jobs.find(j => j.id === jobId)
      if (job) selectJob(job)
    }
  }, [jobId, jobs, selectJob])

  // Fetch job details
  const { data: jobData, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await api.get<{ data: Job }>(`/jobs/${jobId}`)
      return response.data
    }
  })

  const job = jobData?.data

  // Update job status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await api.patch(`/jobs/${jobId}`, { status })
      return response.data
    },
    onSuccess: () => {
      // Will refetch on next mount
    }
  })

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (photo: { url: string; caption?: string; latitude?: number; longitude?: number }) => {
      const response = await api.post(`/jobs/${jobId}/photos`, photo)
      return response.data
    },
    onSuccess: () => {
      // Will refetch
    }
  })

  // Handle photo upload
  const handlePhotoUpload = (photo: any) => {
    // Add to offline store
    addPendingPhoto({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      latitude: photo.latitude,
      longitude: photo.longitude,
      takenAt: photo.takenAt || new Date().toISOString(),
      synced: false
    })

    // Try to upload if online
    uploadPhotoMutation.mutate({
      url: photo.url,
      caption: photo.caption,
      latitude: photo.latitude,
      longitude: photo.longitude
    })
  }

  // Handle check-in
  const handleCheckIn = (checkIn: { latitude: number; longitude: number; timestamp: string }) => {
    // The check-in is already stored in offline store
    // Sync with backend when online
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate elapsed time for timer
  const [elapsedTime, setElapsedTime] = useState('00:00:00')
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeTimeLog) {
      interval = setInterval(() => {
        const start = new Date(activeTimeLog.startTime)
        const now = new Date()
        const diff = now.getTime() - start.getTime()
        
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimeLog])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <Link href="/mobile/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/mobile/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-gray-500 text-sm">{job.jobNumber}</p>
        </div>
        <Badge 
          className={
            job.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }
        >
          {job.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          size="lg"
          className="h-20 flex-col gap-2"
          onClick={() => activeTimeLog ? stopTimer() : startTimer(jobId)}
        >
          {activeTimeLog ? (
            <>
              <Square className="h-8 w-8" />
              <span className="text-lg font-mono">{elapsedTime}</span>
            </>
          ) : (
            <>
              <Play className="h-8 w-8" />
              <span>Start Timer</span>
            </>
          )}
        </Button>
        <Link href={`/mobile/jobs/${jobId}/materials`}>
          <Button size="lg" variant="outline" className="h-20 flex-col gap-2 w-full">
            <Ruler className="h-8 w-8" />
            <span>Materials</span>
          </Button>
        </Link>
      </div>

      {/* GPS Check-In */}
      <GPSCheckIn
        jobId={jobId}
        jobAddress={job.address}
        onCheckIn={handleCheckIn}
      />

      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600">{job.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Home className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Property Type</p>
              <p className="text-gray-600">{job.propertyType}</p>
            </div>
          </div>

          {job.roofSize && (
            <div className="flex items-start gap-3">
              <Ruler className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Roof Size</p>
                <p className="text-gray-600">{job.roofSize.toLocaleString()} sq ft</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Scheduled</p>
              <p className="text-gray-600">{formatDate(job.scheduledStart)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Estimated Cost</p>
              <p className="text-gray-600">{formatCurrency(job.estimatedCost)}</p>
            </div>
          </div>

          {job.assignments.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Crew</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.assignments.map((assignment) => (
                    <Badge key={assignment.userId} variant="outline">
                      {assignment.user.firstName} ({assignment.user.role})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Job Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            jobId={jobId}
            onUpload={handlePhotoUpload}
            includeGPS
            optimizeForMobile
            existingPhotos={job.photos}
          />
        </CardContent>
      </Card>

      {/* Description */}
      {job.description && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{job.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Materials */}
      {job.materials && job.materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {job.materials.map((material) => (
                <div key={material.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{material.name}</span>
                  <span className="text-sm text-gray-600">
                    {material.quantityUsed} / {material.quantityPlanned} used
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Job */}
      {job.status !== 'COMPLETED' && (
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => updateStatusMutation.mutate('COMPLETED')}
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-5 w-5" />
          )}
          Mark as Complete
        </Button>
      )}
    </div>
  )
}

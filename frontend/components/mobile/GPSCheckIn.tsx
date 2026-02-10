"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Loader2, CheckCircle, Navigation, Clock } from "lucide-react"
import { useOfflineStore } from "@/lib/stores/offlineStore"

interface GPSCheckInProps {
  jobId: string
  jobAddress: string
  onCheckIn?: (checkIn: {
    latitude: number
    longitude: number
    timestamp: string
  }) => void
}

export default function GPSCheckIn({
  jobId,
  jobAddress,
  onCheckIn
}: GPSCheckInProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const { addPendingCheckIn, pendingCheckIns } = useOfflineStore()

  // Get current location
  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported on this device")
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
          setLocation(coords)
          setLocationError(null)
          resolve(coords)
        },
        (error) => {
          console.error("Geolocation error:", error)
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location permission denied. Please enable GPS in settings.")
              break
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location unavailable. Please try again.")
              break
            case error.TIMEOUT:
              setLocationError("Location request timed out. Please try again.")
              break
            default:
              setLocationError("Unable to get location")
          }
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      )
    })
  }

  // Check if already checked in today
  useEffect(() => {
    const today = new Date().toDateString()
    const todayCheckIns = pendingCheckIns.filter(
      (c) => c.jobId === jobId && new Date(c.timestamp).toDateString() === today
    )
    if (todayCheckIns.length > 0) {
      setIsCheckedIn(true)
      setCheckInTime(new Date(todayCheckIns[0].timestamp))
    }
  }, [jobId, pendingCheckIns])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    setLocationError(null)

    try {
      const coords = await getLocation()
      
      if (coords) {
        const checkInData = {
          latitude: coords.lat,
          longitude: coords.lng,
          timestamp: new Date().toISOString()
        }

        // Add to offline store
        addPendingCheckIn({
          id: crypto.randomUUID(),
          jobId,
          latitude: coords.lat,
          longitude: coords.lng,
          timestamp: checkInData.timestamp,
          synced: false
        })

        setIsCheckedIn(true)
        setCheckInTime(new Date())

        // Call callback
        onCheckIn?.(checkInData)
      }
    } catch (error) {
      console.error("Check-in error:", error)
      setLocationError("Failed to check in. Please try again.")
    } finally {
      setIsCheckingIn(false)
    }
  }

  const formatCheckInTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          GPS Check-In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Job Address */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Job Location</p>
            <p className="font-medium">{jobAddress}</p>
          </div>

          {/* Status */}
          {isCheckedIn ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-600">Checked In</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Clock className="h-4 w-4" />
                <span>at {checkInTime ? formatCheckInTime(checkInTime) : "--:--"}</span>
              </div>
              {location && (
                <p className="text-xs text-green-600 mt-2">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                <Badge variant="secondary">Not Checked In</Badge>
              </div>
              <p className="text-sm text-blue-700">
                Check in to record your arrival at the job site.
              </p>
            </div>
          )}

          {/* Error Message */}
          {locationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{locationError}</p>
            </div>
          )}

          {/* Check In Button */}
          <Button
            onClick={handleCheckIn}
            disabled={isCheckedIn || isCheckingIn}
            size="lg"
            className="w-full"
          >
            {isCheckingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Getting Location...
              </>
            ) : isCheckedIn ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Already Checked In
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-5 w-5" />
                Check In at Job Site
              </>
            )}
          </Button>

          {/* Location Accuracy Info */}
          {location && (
            <p className="text-xs text-gray-500 text-center">
              Location accuracy: ±{Math.round(location.accuracy || 0)}m
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Loader2, Image, MapPin, X } from "lucide-react"

interface PhotoUploadProps {
  jobId: string
  onUpload: (photo: {
    id: string
    url: string
    caption?: string
    latitude?: number
    longitude?: number
    local?: boolean
  }) => void
  includeGPS?: boolean
  optimizeForMobile?: boolean
  existingPhotos?: { id: string; url: string; caption?: string }[]
}

export default function PhotoUpload({
  jobId,
  onUpload,
  includeGPS = true,
  optimizeForMobile = true,
  existingPhotos = []
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported")
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocationError("Unable to get location")
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  const handleCameraCapture = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera is not supported on this device")
      return
    }

    try {
      setIsUploading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: optimizeForMobile ? "environment" : "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Capture frame
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedPhoto(photoData)
      }

      // Stop camera
      stream.getTracks().forEach(track => track.stop())

      if (includeGPS) {
        await getLocation()
      }
    } catch (error) {
      console.error("Camera error:", error)
      alert("Failed to access camera")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Read file as data URL
      const reader = new FileReader()
      reader.onload = async (event) => {
        const photoData = event.target?.result as string

        let photoLocation = location
        if (includeGPS && !location) {
          photoLocation = await getLocation()
        }

        const photo = {
          id: crypto.randomUUID(),
          url: photoData,
          local: true,
          ...(photoLocation && {
            latitude: photoLocation.lat,
            longitude: photoLocation.lng
          })
        }

        setCapturedPhoto(null)
        onUpload(photo)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("File read error:", error)
      alert("Failed to process image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleConfirmPhoto = () => {
    if (!capturedPhoto) return

    const photo = {
      id: crypto.randomUUID(),
      url: capturedPhoto,
      local: true,
      ...(location && {
        latitude: location.lat,
        longitude: location.lng
      })
    }

    setCapturedPhoto(null)
    setLocation(null)
    onUpload(photo)
  }

  const handleCancelCapture = () => {
    setCapturedPhoto(null)
    setLocation(null)
    setLocationError(null)
  }

  return (
    <div className="space-y-4">
      {/* Show captured photo for confirmation */}
      {capturedPhoto && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <img
            src={capturedPhoto}
            alt="Captured"
            className="w-full max-h-96 object-contain"
          />
          {location && (
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-green-600">
                <MapPin className="w-3 h-3 mr-1" />
                GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </Badge>
            </div>
          )}
          {locationError && (
            <div className="absolute bottom-4 left-4">
              <Badge variant="destructive">
                {locationError}
              </Badge>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="destructive" onClick={handleCancelCapture}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
            <Button onClick={handleConfirmPhoto} className="bg-green-600 hover:bg-green-700">
              <Upload className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Upload buttons */}
      {!capturedPhoto && (
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleCameraCapture}
            disabled={isUploading}
            className="h-24 flex-col gap-2"
            variant="outline"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Camera className="h-8 w-8" />
                <span className="text-sm">Take Photo</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-24 flex-col gap-2"
            variant="outline"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Image className="h-8 w-8" />
                <span className="text-sm">Choose Photo</span>
              </>
            )}
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload photo"
        title="Upload photo"
      />

      {/* Existing photos gallery */}
      {(existingPhotos.length > 0 || !capturedPhoto) && (
        <div>
          <h4 className="font-medium mb-2">Recent Photos</h4>
          <div className="grid grid-cols-3 gap-2">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.caption || "Job photo"}
                  className="w-full h-full object-cover"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-1">
                    <p className="text-xs text-white truncate">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

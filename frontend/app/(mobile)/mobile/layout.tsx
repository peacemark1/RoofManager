"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Settings,
  Menu,
  Wifi,
  WifiOff
} from "lucide-react"
import { useOfflineStore } from "@/lib/stores/offlineStore"

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isOnline, pendingPhotos, pendingCheckIns, timeLogs } = useOfflineStore()

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed:', error)
      })
    }
  }, [])

  const pendingCount = pendingPhotos.length + 
    pendingCheckIns.filter(c => !c.synced).length + 
    timeLogs.filter(l => !l.synced).length

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">RoofManager</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Offline Indicator */}
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-300" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-300" />
              )}
            </div>
            
            {/* Pending Sync Indicator */}
            {pendingCount > 0 && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex justify-around">
          <Link
            href="/mobile/jobs"
            className={`flex flex-col items-center px-4 py-2 rounded-lg ${
              pathname === '/mobile/jobs' 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-600'
            }`}
          >
            <Briefcase className="h-6 w-6" />
            <span className="text-xs mt-1">Jobs</span>
          </Link>
          
          <Link
            href="/mobile/checkin"
            className={`flex flex-col items-center px-4 py-2 rounded-lg ${
              pathname === '/mobile/checkin' 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-600'
            }`}
          >
            <MapPin className="h-6 w-6" />
            <span className="text-xs mt-1">Check-In</span>
          </Link>
          
          <Link
            href="/mobile/timer"
            className={`flex flex-col items-center px-4 py-2 rounded-lg ${
              pathname === '/mobile/timer' 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-600'
            }`}
          >
            <Clock className="h-6 w-6" />
            <span className="text-xs mt-1">Timer</span>
          </Link>
          
          <Link
            href="/mobile/settings"
            className={`flex flex-col items-center px-4 py-2 rounded-lg ${
              pathname === '/mobile/settings' 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-600'
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

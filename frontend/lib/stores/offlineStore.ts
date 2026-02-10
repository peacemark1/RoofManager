import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Job {
  id: string
  jobNumber: string
  title: string
  address: string
  status: string
  propertyType: string
  roofSize: number
  scheduledStart: string
  scheduledEnd: string
  estimatedCost: number
  assignments: { userId: string; user: { firstName: string; role: string } }[]
  photos: JobPhoto[]
}

interface JobPhoto {
  id: string
  url: string
  caption?: string
  latitude?: number
  longitude?: number
  takenAt: string
  synced: boolean
}

interface TimeLog {
  id: string
  jobId: string
  startTime: string
  endTime?: string
  totalHours?: number
  synced: boolean
}

interface CheckIn {
  id: string
  jobId: string
  latitude: number
  longitude: number
  timestamp: string
  synced: boolean
}

interface OfflineStore {
  // Jobs
  jobs: Job[]
  selectedJob: Job | null
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  selectJob: (job: Job | null) => void
  
  // Photos
  pendingPhotos: JobPhoto[]
  addPendingPhoto: (photo: JobPhoto) => void
  markPhotoSynced: (id: string) => void
  removePendingPhoto: (id: string) => void
  
  // Time Logs
  timeLogs: TimeLog[]
  activeTimeLog: TimeLog | null
  startTimer: (jobId: string) => void
  stopTimer: () => void
  syncTimeLogs: () => void
  
  // Check-ins
  pendingCheckIns: CheckIn[]
  addPendingCheckIn: (checkIn: CheckIn) => void
  markCheckInSynced: (id: string) => void
  
  // Sync status
  isOnline: boolean
  lastSyncTime: string | null
  setOnline: (online: boolean) => void
  setLastSyncTime: (time: string) => void
  
  // Clear all
  clearAll: () => void
}

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      // Jobs
      jobs: [],
      selectedJob: null,
      setJobs: (jobs) => set({ jobs }),
      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id ? { ...j, ...updates } : j
          ),
        })),
      selectJob: (job) => set({ selectedJob: job }),
      
      // Photos
      pendingPhotos: [],
      addPendingPhoto: (photo) =>
        set((state) => ({ pendingPhotos: [...state.pendingPhotos, photo] })),
      markPhotoSynced: (id) =>
        set((state) => ({
          pendingPhotos: state.pendingPhotos.map((p) =>
            p.id === id ? { ...p, synced: true } : p
          ),
        })),
      removePendingPhoto: (id) =>
        set((state) => ({
          pendingPhotos: state.pendingPhotos.filter((p) => p.id !== id),
        })),
      
      // Time Logs
      timeLogs: [],
      activeTimeLog: null,
      startTimer: (jobId) => {
        const newTimeLog: TimeLog = {
          id: crypto.randomUUID(),
          jobId,
          startTime: new Date().toISOString(),
          synced: false,
        }
        set({ activeTimeLog: newTimeLog })
      },
      stopTimer: () => {
        const { activeTimeLog } = get()
        if (activeTimeLog) {
          const endTime = new Date().toISOString()
          const start = new Date(activeTimeLog.startTime)
          const end = new Date(endTime)
          const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
          
          const completedLog: TimeLog = {
            ...activeTimeLog,
            endTime,
            totalHours,
          }
          
          set((state) => ({
            timeLogs: [...state.timeLogs, completedLog],
            activeTimeLog: null,
          }))
        }
      },
      syncTimeLogs: () => {
        set((state) => ({
          timeLogs: state.timeLogs.map((log) => ({ ...log, synced: true })),
        }))
      },
      
      // Check-ins
      pendingCheckIns: [],
      addPendingCheckIn: (checkIn) =>
        set((state) => ({ pendingCheckIns: [...state.pendingCheckIns, checkIn] })),
      markCheckInSynced: (id) =>
        set((state) => ({
          pendingCheckIns: state.pendingCheckIns.map((c) =>
            c.id === id ? { ...c, synced: true } : c
          ),
        })),
      
      // Sync status
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      lastSyncTime: null,
      setOnline: (online) => set({ isOnline: online }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      
      // Clear all
      clearAll: () =>
        set({
          jobs: [],
          selectedJob: null,
          pendingPhotos: [],
          timeLogs: [],
          activeTimeLog: null,
          pendingCheckIns: [],
          lastSyncTime: null,
        }),
    }),
    {
      name: 'roofmanager-offline',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        jobs: state.jobs,
        pendingPhotos: state.pendingPhotos,
        timeLogs: state.timeLogs,
        activeTimeLog: state.activeTimeLog,
        pendingCheckIns: state.pendingCheckIns,
      }),
    }
  )
)

// Online/Offline listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOnline(true)
  })
  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOnline(false)
  })
}

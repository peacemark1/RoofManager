# RoofManager Frontend Architecture

Next.js 14 (App Router) + PWA specification for web and mobile.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Maps**: Leaflet.js
- **PDF**: react-pdf
- **PWA**: next-pwa

---

## Folder Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── estimates/
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── quotes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── materials/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   ├── branding/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   └── modules/page.tsx
│   │   └── layout.tsx
│   ├── (mobile)/
│   │   ├── mobile/
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── quotes/
│   │   └── [publicLink]/
│   │       └── page.tsx (public quote view)
│   ├── api/ (API routes for server actions)
│   │   └── upload/
│   │       └── route.ts
│   ├── layout.tsx (root layout)
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   └── RecentActivity.tsx
│   ├── leads/
│   │   ├── LeadTable.tsx
│   │   ├── LeadForm.tsx
│   │   ├── LeadKanban.tsx
│   │   └── ConvertToJobDialog.tsx
│   ├── jobs/
│   │   ├── JobCard.tsx
│   │   ├── JobTimeline.tsx
│   │   ├── AssignCrewDialog.tsx
│   │   └── JobPhotoGallery.tsx
│   ├── estimates/
│   │   ├── EstimateForm.tsx
│   │   ├── AIEstimatePreview.tsx
│   │   └── MaterialsList.tsx
│   ├── quotes/
│   │   ├── QuoteForm.tsx
│   │   ├── QuotePDFViewer.tsx
│   │   └── SignaturePad.tsx
│   ├── mobile/
│   │   ├── JobList.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── TimeTracker.tsx
│   │   └── GPSCheckIn.tsx
│   ├── charts/
│   │   ├── RevenueChart.tsx
│   │   ├── ConversionFunnel.tsx
│   │   └── CrewEfficiencyChart.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── OfflineIndicator.tsx
├── lib/
│   ├── api.ts (API client)
│   ├── auth.ts (Auth helpers)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useJobs.ts
│   │   ├── useLeads.ts
│   │   └── useOffline.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── offlineStore.ts
│   └── utils.ts
├── public/
│   ├── icons/
│   ├── manifest.json
│   ├── sw.js (service worker)
│   └── offline.html
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 1. Authentication Pages

### `app/(auth)/login/page.tsx`

Premium login page with company branding.

**Features:**
- Email/password form
- "Remember me" checkbox
- "Forgot password" link
- Company logo display
- Gradient background
- Loading state

**Design:**
```tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 backdrop-blur-lg bg-white/10 border-white/20">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="RoofManager" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        </div>
        
        <form className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
          <Input 
            type="password" 
            placeholder="Password"
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
          
          <div className="flex items-center justify-between">
            <label className="flex items-center text-white/80 text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            Sign In
          </Button>
        </form>
        
        <p className="text-center text-white/60 text-sm mt-6">
          Don't have an account? <Link href="/register" className="text-blue-300 hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
```

---

## 2. Dashboard Layout

### `app/(dashboard)/layout.tsx`

Main layout with sidebar navigation and header.

**Features:**
- Responsive sidebar (collapsible on mobile)
- Company branding in sidebar
- Navigation links with icons
- User avatar dropdown in header
- Notifications bell
- Offline indicator

**Navigation Items:**
- Dashboard
- Leads
- Jobs
- Estimates
- Quotes
- Invoices
- Materials
- Analytics
- Settings

---

## 3. Dashboard Homepage

### `app/(dashboard)/dashboard/page.tsx`

Overview dashboard with key metrics and charts.

**Components:**

#### Stats Cards (Grid)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <StatsCard 
    title="Total Revenue" 
    value="$125,430" 
    trend="+12.5%" 
    icon={DollarSignIcon}
    color="blue"
  />
  <StatsCard 
    title="Active Jobs" 
    value="8" 
    trend="+2" 
    icon={BriefcaseIcon}
    color="green"
  />
  <StatsCard 
    title="Pending Quotes" 
    value="5" 
    trend="-1" 
    icon={FileTextIcon}
    color="amber"
  />
  <StatsCard 
    title="Conversion Rate" 
    value="32%" 
    trend="+4%" 
    icon={TrendingUpIcon}
    color="purple"
  />
</div>
```

#### Pipeline Overview (Kanban-style)
```tsx
<Card className="mb-8">
  <CardHeader>
    <CardTitle>Job Pipeline</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex gap-4 overflow-x-auto pb-4">
      <PipelineColumn title="Leads" count={12} color="gray" />
      <PipelineColumn title="Quoted" count={5} color="blue" />
      <PipelineColumn title="Scheduled" count={3} color="amber" />
      <PipelineColumn title="In Progress" count={8} color="green" />
      <PipelineColumn title="Completed" count={24} color="purple" />
    </div>
  </CardContent>
</Card>
```

#### Revenue Chart
```tsx
<Card>
  <CardHeader>
    <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
  </CardHeader>
  <CardContent>
    <RevenueChart data={revenueData} />
  </CardContent>
</Card>
```

---

## 4. Leads Management

### `app/(dashboard)/leads/page.tsx`

Lead management with table and Kanban views.

**Features:**
- Toggle between table and Kanban views
- Filter by status, source
- Search by name, email, phone
- Bulk actions (assign, delete)
- "Add Lead" button → modal form
- "Convert to Job" action

**LeadTable Component:**
```tsx
<DataTable
  columns={[
    { header: "Name", accessorKey: "fullName" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Source", accessorKey: "source", cell: (row) => <Badge>{row.source}</Badge> },
    { header: "Status", accessorKey: "status", cell: (row) => <StatusBadge status={row.status} /> },
    { header: "Actions", cell: (row) => <LeadActions lead={row} /> }
  ]}
  data={leads}
  pagination
/>
```

**LeadKanban Component:**
```tsx
<div className="flex gap-4 overflow-x-auto">
  {["NEW", "CONTACTED", "QUALIFIED", "CONVERTED"].map(status => (
    <KanbanColumn key={status} status={status}>
      {leads.filter(l => l.status === status).map(lead => (
        <LeadCard key={lead.id} lead={lead} draggable />
      ))}
    </KanbanColumn>
  ))}
</div>
```

---

## 5. Job Details

### `app/(dashboard)/jobs/[id]/page.tsx`

Comprehensive job detail view.

**Sections:**

#### 1. Job Header
```tsx
<div className="flex justify-between items-start mb-6">
  <div>
    <div className="flex items-center gap-3 mb-2">
      <h1 className="text-3xl font-bold">{job.title}</h1>
      <StatusBadge status={job.status} />
    </div>
    <p className="text-gray-600">{job.jobNumber}</p>
  </div>
  
  <div className="flex gap-2">
    <Button variant="outline">Edit Job</Button>
    <Button>Update Status</Button>
  </div>
</div>
```

#### 2. Job Info Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <InfoCard label="Address" value={job.address} icon={MapPinIcon} />
  <InfoCard label="Property Type" value={job.propertyType} icon={HomeIcon} />
  <InfoCard label="Roof Size" value={`${job.roofSize} sq ft`} icon={RulerIcon} />
  <InfoCard label="Scheduled Start" value={formatDate(job.scheduledStart)} icon={CalendarIcon} />
  <InfoCard label="Estimated Cost" value={formatCurrency(job.estimatedCost)} icon={DollarSignIcon} />
  <InfoCard label="Actual Cost" value={formatCurrency(job.actualCost)} icon={DollarSignIcon} />
</div>
```

#### 3. Tabs (Timeline, Photos, Materials, Crew, Documents)
```tsx
<Tabs defaultValue="timeline">
  <TabsList>
    <TabsTrigger value="timeline">Timeline</TabsTrigger>
    <TabsTrigger value="photos">Photos ({job.photos.length})</TabsTrigger>
    <TabsTrigger value="materials">Materials</TabsTrigger>
    <TabsTrigger value="crew">Crew</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  
  <TabsContent value="timeline">
    <JobTimeline events={timelineEvents} />
  </TabsContent>
  
  <TabsContent value="photos">
    <PhotoGallery photos={job.photos} />
  </TabsContent>
  
  {/* ... other tabs */}
</Tabs>
```

---

## 6. AI-Assisted Estimation

### `app/(dashboard)/estimates/create/page.tsx`

Estimation form with AI assistance.

**Workflow:**
1. Select job
2. Enter basic details (roof size, pitch, materials)
3. Upload photos (optional)
4. Click "Generate AI Estimate"
5. AI returns suggestions
6. User reviews and edits
7. Save estimate

**AI Estimate Preview:**
```tsx
{aiEstimate && (
  <Card className="mb-6 border-blue-500 bg-blue-50">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="text-blue-500" />
          AI Estimate
        </CardTitle>
        <Badge>Confidence: {aiEstimate.aiConfidence}%</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Labor Hours</p>
          <p className="text-2xl font-bold">{aiEstimate.laborHours} hrs</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-2xl font-bold">{formatCurrency(aiEstimate.totalCost)}</p>
        </div>
      </div>
      
      <h4 className="font-semibold mb-2">Suggested Materials:</h4>
      <MaterialsList materials={aiEstimate.materials} editable />
      
      <p className="text-sm text-gray-600 mt-4">{aiEstimate.notes}</p>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={applyAIEstimate}>Accept AI Estimate</Button>
        <Button variant="outline" onClick={editEstimate}>Edit Values</Button>
      </div>
    </CardContent>
  </Card>
)}
```

---

## 7. Quote Generation

### `app/(dashboard)/quotes/[id]/page.tsx`

Quote detail and PDF preview.

**Features:**
- Live PDF preview
- Edit line items
- Send via email
- Generate public link
- Download PDF

**Layout:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div>
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Quote Details</CardTitle>
      </CardHeader>
      <CardContent>
        <QuoteForm quote={quote} onSave={handleSave} />
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full" onClick={sendQuote}>
          <MailIcon className="mr-2" /> Send to Customer
        </Button>
        <Button variant="outline" className="w-full" onClick={downloadPDF}>
          <DownloadIcon className="mr-2" /> Download PDF
        </Button>
        <Button variant="outline" className="w-full" onClick={copyPublicLink}>
          <LinkIcon className="mr-2" /> Copy Public Link
        </Button>
      </CardContent>
    </Card>
  </div>
  
  <div className="sticky top-4">
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <QuotePDFViewer quote={quote} />
      </CardContent>
    </Card>
  </div>
</div>
```

---

## 8. Mobile PWA (Field Crew)

### `app/(mobile)/mobile/jobs/page.tsx`

Mobile-optimized job list.

**Design Principles:**
- Large touch targets (min 44px)
- Simple, uncluttered UI
- Offline-first
- GPS-aware
- Camera integration

**Job List:**
```tsx
<div className="p-4 space-y-4">
  {jobs.map(job => (
    <Card key={job.id} className="p-4 tap-highlight-none active:scale-98 transition-transform">
      <Link href={`/mobile/jobs/${job.id}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{job.address}</p>
        
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {formatDate(job.scheduledStart)}
          </Badge>
          <Badge variant="outline">
            <UsersIcon className="w-3 h-3 mr-1" />
            {job.assignments.length} crew
          </Badge>
        </div>
      </Link>
    </Card>
  ))}
</div>
```

### `app/(mobile)/mobile/jobs/[id]/page.tsx`

Mobile job detail with field actions.

**Features:**
- GPS check-in button
- Photo upload
- Start/stop timer
- Material usage tracking
- Progress notes

**GPS Check-In:**
```tsx
<Button 
  size="lg" 
  className="w-full mb-4" 
  onClick={handleCheckIn}
  disabled={!geolocation}
>
  <MapPinIcon className="mr-2" />
  Check In at Job Site
</Button>
```

**Photo Upload:**
```tsx
<Card className="mb-4">
  <CardHeader>
    <CardTitle>Job Photos</CardTitle>
  </CardHeader>
  <CardContent>
    <PhotoUpload 
      onUpload={handlePhotoUpload}
      includeGPS
      optimizeForMobile
    />
    
    <div className="grid grid-cols-3 gap-2 mt-4">
      {photos.map(photo => (
        <img 
          key={photo.id} 
          src={photo.url} 
          alt={photo.caption}
          className="rounded-lg aspect-square object-cover"
        />
      ))}
    </div>
  </CardContent>
</Card>
```

**Time Tracker:**
```tsx
<Card className="mb-4">
  <CardHeader>
    <CardTitle>Time Tracking</CardTitle>
  </CardHeader>
  <CardContent>
    {activeTimeLog ? (
      <div className="text-center">
        <p className="text-4xl font-bold mb-2">
          <LiveTimer startTime={activeTimeLog.startTime} />
        </p>
        <Button 
          size="lg" 
          variant="destructive" 
          onClick={stopTimer}
          className="w-full"
        >
          <StopCircleIcon className="mr-2" />
          Stop Work
        </Button>
      </div>
    ) : (
      <Button 
        size="lg" 
        className="w-full"
        onClick={startTimer}
      >
        <PlayCircleIcon className="mr-2" />
        Start Work
      </Button>
    )}
  </CardContent>
</Card>
```

---

## 9. PWA Configuration

### `public/manifest.json`

```json
{
  "name": "RoofManager",
  "short_name": "RoofManager",
  "description": "Complete roofing management platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e40af",
  "theme_color": "#1e40af",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### `next.config.js`

```js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'cloudinary.com']
  }
});
```

### Service Worker Strategy

**Cache-First for Static Assets:**
- Images, fonts, icons
- UI components

**Network-First for API Calls:**
- Fallback to cache if offline
- Queue mutations (POST/PATCH/DELETE) for sync when online

**Background Sync:**
- Photo uploads
- Time log updates
- Status changes

---

## 10. State Management

### `lib/stores/authStore.ts` (Zustand)

```ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        const { data } = await response.json();
        set({ user: data.user, token: data.token });
      },
      
      logout: () => {
        set({ user: null, token: null });
      },
      
      isAuthenticated: () => !!get().token
    }),
    {
      name: 'auth-storage'
    }
  )
);
```

---

## 11. API Client

### `lib/api.ts`

```ts
import { useAuthStore } from './stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

// Convenience methods
export const api = {
  get: <T>(url: string) => apiRequest<T>(url),
  post: <T>(url: string, data: any) => apiRequest<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(url: string, data: any) => apiRequest<T>(url, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string) => apiRequest<T>(url, { method: 'DELETE' })
};
```

---

## 12. Custom Hooks

### `lib/hooks/useJobs.ts`

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => api.get<JobsResponse>(`/jobs?${new URLSearchParams(filters)}`)
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => api.get<Job>(`/jobs/${id}`)
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      api.patch(`/jobs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}
```

---

## Design System

### Colors (Tailwind Config)
```js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a'
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
}
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, tracking-tight
- **Body**: Regular, text-gray-700

### Shadows & Effects
- Cards: `shadow-md hover:shadow-lg transition-shadow`
- Buttons: Gradient backgrounds, hover scale effects
- Glassmorphism: `backdrop-blur-lg bg-white/10`

---

## Responsive Breakpoints
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

**Mobile-First Approach**: Design for mobile, enhance for desktop.

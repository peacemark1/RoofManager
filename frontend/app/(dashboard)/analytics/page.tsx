"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Target,
  Calendar,
} from "lucide-react"

// Color palette for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

interface AnalyticsData {
  revenue: {
    totalRevenue: number
    monthlyRevenue: { month: string; amount: number }[]
    averageJobValue: number
    collectionRate: number
  }
  pipeline: {
    totalLeads: number
    totalQuotes: number
    totalJobs: number
    conversionRate: number
    avgTimeToClose: number
    leadsBySource: { source: string; count: number }[]
    monthlyLeads: { month: string; leads: number; quotes: number; jobs: number }[]
  }
  jobs: {
    completed: number
    scheduled: number
    avgCompletionTime: number
    completionRate: number
    jobsByStatus: { status: string; count: number }[]
    monthlyJobs: { month: string; completed: number; scheduled: number }[]
  }
  financials: {
    outstanding: number
    overdue: number
    paymentMethods: { method: string; amount: number }[]
    monthlyPayments: { month: string; collected: number; outstanding: number }[]
  }
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("this_month")

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: async () => {
      const response = await api.get<AnalyticsData>(`/analytics?range=${dateRange}`)
      return response.data
    },
  })

  const mockData: AnalyticsData = useMemo(() => ({
    revenue: {
      totalRevenue: 125430,
      monthlyRevenue: [
        { month: "Jan", amount: 45000 },
        { month: "Feb", amount: 52000 },
        { month: "Mar", amount: 48000 },
        { month: "Apr", amount: 61000 },
        { month: "May", amount: 55000 },
        { month: "Jun", amount: 125430 },
      ],
      averageJobValue: 8500,
      collectionRate: 87,
    },
    pipeline: {
      totalLeads: 156,
      totalQuotes: 89,
      totalJobs: 42,
      conversionRate: 26.9,
      avgTimeToClose: 5.2,
      leadsBySource: [
        { source: "Referral", count: 45 },
        { source: "Website", count: 38 },
        { source: "Phone", count: 32 },
        { source: "Social", count: 24 },
        { source: "Other", count: 17 },
      ],
      monthlyLeads: [
        { month: "Jan", leads: 25, quotes: 12, jobs: 6 },
        { month: "Feb", leads: 28, quotes: 15, jobs: 7 },
        { month: "Mar", leads: 22, quotes: 11, jobs: 5 },
        { month: "Apr", leads: 35, quotes: 18, jobs: 9 },
        { month: "May", leads: 31, quotes: 16, jobs: 8 },
        { month: "Jun", leads: 15, quotes: 17, jobs: 7 },
      ],
    },
    jobs: {
      completed: 38,
      scheduled: 12,
      avgCompletionTime: 3.5,
      completionRate: 92,
      jobsByStatus: [
        { status: "Completed", count: 38 },
        { status: "In Progress", count: 8 },
        { status: "Scheduled", count: 4 },
        { status: "On Hold", count: 2 },
      ],
      monthlyJobs: [
        { month: "Jan", completed: 8, scheduled: 2 },
        { month: "Feb", completed: 10, scheduled: 3 },
        { month: "Mar", completed: 7, scheduled: 2 },
        { month: "Apr", completed: 12, scheduled: 4 },
        { month: "May", completed: 9, scheduled: 3 },
        { month: "Jun", completed: 8, scheduled: 4 },
      ],
    },
    financials: {
      outstanding: 45600,
      overdue: 12300,
      paymentMethods: [
        { method: "Paystack", amount: 68000 },
        { method: "Stripe", amount: 42000 },
        { method: "Cash", amount: 15430 },
        { method: "Bank Transfer", amount: 12000 },
      ],
      monthlyPayments: [
        { month: "Jan", collected: 45000, outstanding: 12000 },
        { month: "Feb", collected: 52000, outstanding: 15000 },
        { month: "Mar", collected: 48000, outstanding: 18000 },
        { month: "Apr", collected: 61000, outstanding: 22000 },
        { month: "May", collected: 55000, outstanding: 28000 },
        { month: "Jun", collected: 55000, outstanding: 45600 },
      ],
    },
  }), [])

  const displayData = analytics || mockData

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
            aria-label="Select date range"
          >
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={`$${displayData.revenue.totalRevenue.toLocaleString()}`}
          trend="+12.5%"
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
        />
        <KPICard
          title="Conversion Rate"
          value={`${displayData.pipeline.conversionRate.toFixed(1)}%`}
          trend="+2.3%"
          icon={<Target className="h-5 w-5 text-blue-600" />}
        />
        <KPICard
          title="Avg Job Value"
          value={`$${displayData.revenue.averageJobValue.toLocaleString()}`}
          trend="+5.2%"
          icon={<Briefcase className="h-5 w-5 text-purple-600" />}
        />
        <KPICard
          title="Collection Rate"
          value={`${displayData.revenue.collectionRate}%`}
          trend="-1.2%"
          icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData.revenue.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-xl">
                    ${displayData.revenue.monthlyRevenue[5]?.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Job Value</span>
                  <span className="font-bold text-xl">
                    ${displayData.revenue.averageJobValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Collection Rate</span>
                  <span className="font-bold text-xl text-green-600">
                    {displayData.revenue.collectionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Outstanding Revenue</span>
                  <span className="font-bold text-xl text-red-600">
                    ${displayData.financials.outstanding.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayData.financials.paymentMethods}
                        dataKey="amount"
                        nameKey="method"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {displayData.financials.paymentMethods.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Conversion Funnel */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData.pipeline.monthlyLeads} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="month" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                      <Bar dataKey="quotes" fill="#10b981" name="Quotes" />
                      <Bar dataKey="jobs" fill="#f59e0b" name="Jobs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Leads</span>
                  <span className="font-bold text-xl">{displayData.pipeline.totalLeads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quotes Sent</span>
                  <span className="font-bold text-xl">{displayData.pipeline.totalQuotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jobs Won</span>
                  <span className="font-bold text-xl text-green-600">{displayData.pipeline.totalJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Time to Close</span>
                  <span className="font-bold text-xl">{displayData.pipeline.avgTimeToClose} days</span>
                </div>
              </CardContent>
            </Card>

            {/* Leads by Source */}
            <Card>
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayData.pipeline.leadsBySource}
                        dataKey="count"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {displayData.pipeline.leadsBySource.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Job Completion Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Job Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayData.jobs.monthlyJobs}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Completed"
                      />
                      <Line
                        type="monotone"
                        dataKey="scheduled"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="Scheduled"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Job Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Jobs</span>
                  <span className="font-bold text-xl text-green-600">
                    {displayData.jobs.completed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Scheduled</span>
                  <span className="font-bold text-xl text-blue-600">
                    {displayData.jobs.scheduled}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Completion Time</span>
                  <span className="font-bold text-xl">
                    {displayData.jobs.avgCompletionTime} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-xl text-green-600">
                    {displayData.jobs.completionRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Jobs by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Jobs by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayData.jobs.jobsByStatus}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {displayData.jobs.jobsByStatus.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Cash Flow */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Cash Flow Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData.financials.monthlyPayments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar dataKey="collected" fill="#10b981" name="Collected" />
                      <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Outstanding</span>
                  <span className="font-bold text-xl text-yellow-600">
                    ${displayData.financials.outstanding.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overdue</span>
                  <span className="font-bold text-xl text-red-600">
                    ${displayData.financials.overdue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Collection Rate</span>
                  <span className="font-bold text-xl text-green-600">
                    {displayData.revenue.collectionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Invoice Value</span>
                  <span className="font-bold text-xl">
                    ${(displayData.revenue.totalRevenue / displayData.jobs.completed).toFixed(0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                    {displayData.financials.paymentMethods.map((method, index) => (
                      <div key={method.method} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] } as React.CSSProperties}
                        />
                        <span className="flex-1">{method.method}</span>
                        <span className="font-bold">
                          ${method.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// KPI Card Component
function KPICard({
  title,
  value,
  trend,
  icon,
}: {
  title: string
  value: string
  trend: string
  icon: React.ReactNode
}) {
  const isPositive = trend.startsWith("+")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend} from last period
        </p>
      </CardContent>
    </Card>
  )
}

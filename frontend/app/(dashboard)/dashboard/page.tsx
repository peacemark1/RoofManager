"use client"

import { DollarSign, Users, Briefcase, FileText, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics } from "@/lib/hooks/useAnalytics"

const iconMap: Record<string, any> = {
  DollarSign,
  Users,
  Briefcase,
  FileText,
}

export default function DashboardPage() {
  const { data: analytics, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const stats = analytics?.stats || []
  const pipelineStages = analytics?.pipelineStages || []
  const recentActivity = analytics?.recentActivity || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] || Briefcase
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500">
                  Updated just now
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.length > 0 ? (
                pipelineStages.map((stage) => (
                  <div key={stage.name} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{stage.name}</span>
                        <span className="text-sm text-gray-500">{stage.count} leads</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600 dynamic-width"
                          style={{ width: `${Math.min(100, (stage.count / 10) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        ${stage.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No pipeline data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`h-2 w-2 rounded-full ${item.type === 'lead' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.time).toLocaleDateString()} - {item.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
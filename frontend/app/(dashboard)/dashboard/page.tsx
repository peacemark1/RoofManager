"use client"

import { DollarSign, Users, Briefcase, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
  },
  {
    name: "Active Leads",
    value: "23",
    change: "+4",
    icon: Users,
  },
  {
    name: "Active Jobs",
    value: "12",
    change: "+2",
    icon: Briefcase,
  },
  {
    name: "Pending Invoices",
    value: "8",
    change: "-3",
    icon: FileText,
  },
]

const pipelineStages = [
  { name: "New Leads", count: 12, value: 45000 },
  { name: "Quote Sent", count: 8, value: 32000 },
  { name: "Negotiation", count: 5, value: 28000 },
  { name: "Job Scheduled", count: 3, value: 15000 },
  { name: "Completed", count: 15, value: 85000 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <span className="text-sm text-gray-500">{stage.count} jobs</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary dynamic-width"
                        style={{ width: `${(stage.count / 43) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      ${stage.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New lead added</p>
                  <p className="text-xs text-gray-500">John Doe - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Quote sent</p>
                  <p className="text-xs text-gray-500">Smith Residence - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Job completed</p>
                  <p className="text-xs text-gray-500">Johnson Roofing - 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-500">$5,000 - 2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
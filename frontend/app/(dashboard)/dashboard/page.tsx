
"use client";

import { useAuthStore } from "@/store/auth";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-950">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center px-3 py-1 bg-slate-800 rounded-md border border-slate-700 text-slate-300 text-sm">
            <span>Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <RevenueChart />
        <RecentActivity />
      </div>
    </div>
  );
}
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Check,
  Crown,
  Zap,
  Building2,
  Users,
  Briefcase,
  HardDrive,
  Clock,
  Gift,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"

interface Plan {
  tier: string
  name: string
  price: number
  currency: string
  maxUsers: number
  maxJobs: number
  maxStorage: number
  features: Record<string, boolean>
}

interface SubscriptionData {
  tier: string
  status: string
  plan: Plan
  usage: { users: number; maxUsers: number; jobs: number; maxJobs: number }
  trial: { isActive: boolean; daysRemaining: number; used: boolean }
}

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: [
    "Up to 3 team members",
    "10 active jobs",
    "Lead management",
    "Basic estimates",
    "Invoice generation",
    "Payment collection",
  ],
  PRO: [
    "Up to 10 team members",
    "100 active jobs",
    "AI-powered estimates",
    "SMS notifications (Hubtel)",
    "Customer portal",
    "Advanced analytics",
    "PDF quote generation",
    "Priority support",
  ],
  ENTERPRISE: [
    "Up to 50 team members",
    "Unlimited jobs",
    "Everything in Pro",
    "Custom branding",
    "API access",
    "Dedicated support",
    "Multi-branch management",
    "Custom integrations",
  ],
}

const PLAN_ICONS: Record<string, typeof Zap> = {
  FREE: Zap,
  PRO: Crown,
  ENTERPRISE: Building2,
}

export default function BillingPage() {
  const queryClient = useQueryClient()
  const [upgrading, setUpgrading] = useState<string | null>(null)

  const { data: subscription, isLoading: subLoading } = useQuery<SubscriptionData>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await api.get("/subscription/current")
      return res.data.data
    },
  })

  const { data: plans = [], isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get("/subscription/plans")
      return res.data.data
    },
  })

  const upgradeMutation = useMutation({
    mutationFn: async (tier: string) => {
      setUpgrading(tier)
      const res = await api.post("/subscription/upgrade", { tier })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] })
      setUpgrading(null)
    },
    onError: () => setUpgrading(null),
  })

  const isLoading = subLoading || plansLoading

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  const currentTier = subscription?.tier || "FREE"

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-slate-400 mt-1">Manage your subscription and view usage</p>
      </div>

      {/* Current Plan Summary */}
      {subscription && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                {subscription.trial.isActive && (
                  <Clock className="w-5 h-5 text-green-400" />
                )}
                Current Plan: {subscription.plan.name}
              </CardTitle>
              <Badge
                className={
                  subscription.trial.isActive
                    ? "bg-green-900/30 text-green-400 border-green-800"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }
              >
                {subscription.trial.isActive
                  ? `Trial — ${subscription.trial.daysRemaining} days left`
                  : subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <Users className="w-4 h-4" /> Team Members
                </div>
                <p className="text-white text-xl font-bold">
                  {subscription.usage.users}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    / {subscription.usage.maxUsers}
                  </span>
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <Briefcase className="w-4 h-4" /> Active Jobs
                </div>
                <p className="text-white text-xl font-bold">
                  {subscription.usage.jobs}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    / {subscription.usage.maxJobs === -1 ? "Unlimited" : subscription.usage.maxJobs}
                  </span>
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <HardDrive className="w-4 h-4" /> Storage
                </div>
                <p className="text-white text-xl font-bold">
                  {formatStorage(subscription.plan.maxStorage)}
                </p>
              </div>
            </div>

            {subscription.trial.isActive && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-3">
                <Gift className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">
                  You&apos;re on a free 14-day Pro trial. Upgrade before it ends to keep all Pro features.
                </p>
              </div>
            )}

            {!subscription.trial.isActive && subscription.trial.used && currentTier === "FREE" && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-yellow-300">
                  Your trial has ended. Upgrade to Pro to unlock AI estimates, SMS, customer portal, and more.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.tier] || Zap
          const features = PLAN_FEATURES[plan.tier] || []
          const isCurrent = currentTier === plan.tier
          const isPopular = plan.tier === "PRO"

          return (
            <Card
              key={plan.tier}
              className={`relative bg-slate-900 border-slate-700 ${
                isPopular ? "border-cyan-500 shadow-lg shadow-cyan-900/20" : ""
              } ${isCurrent ? "ring-2 ring-cyan-500" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <div className="mx-auto mb-3 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                  <Icon className={`w-6 h-6 ${isPopular ? "text-cyan-400" : "text-slate-400"}`} />
                </div>
                <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">
                    {plan.price === 0 ? "Free" : `${plan.currency} ${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-400 text-sm"> /month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    isCurrent
                      ? "bg-slate-800 text-slate-400 cursor-default"
                      : isPopular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                  disabled={isCurrent || upgradeMutation.isPending}
                  onClick={() => !isCurrent && upgradeMutation.mutate(plan.tier)}
                >
                  {upgrading === plan.tier ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {isCurrent ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function formatStorage(bytes: number): string {
  if (bytes >= 1073741824) return `${Math.round(bytes / 1073741824)} GB`
  if (bytes >= 1048576) return `${Math.round(bytes / 1048576)} MB`
  return `${bytes} B`
}

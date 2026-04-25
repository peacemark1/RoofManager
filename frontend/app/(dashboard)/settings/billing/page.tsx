"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, Crown, Zap, Building2 } from "lucide-react"

const plans = [
  {
    name: "Free",
    tier: "FREE",
    price: "$0",
    period: "forever",
    features: [
      "Up to 3 team members",
      "10 active jobs",
      "Basic estimates",
      "Invoice generation",
      "1 GB storage",
    ],
    icon: Building2,
  },
  {
    name: "Pro",
    tier: "PRO",
    price: "$49",
    period: "/month",
    popular: true,
    features: [
      "Up to 15 team members",
      "Unlimited jobs",
      "AI-powered estimates",
      "Payment processing",
      "Customer portal",
      "10 GB storage",
      "Priority support",
    ],
    icon: Zap,
  },
  {
    name: "Enterprise",
    tier: "ENTERPRISE",
    price: "$149",
    period: "/month",
    features: [
      "Unlimited team members",
      "Unlimited jobs",
      "AI-powered estimates",
      "Payment processing",
      "Customer portal",
      "White-label branding",
      "100 GB storage",
      "Dedicated support",
      "API access",
    ],
    icon: Crown,
  },
]

export default function BillingPage() {
  const queryClient = useQueryClient()

  const { data: trialData, isLoading } = useQuery({
    queryKey: ["trialStatus"],
    queryFn: async () => {
      const response = await api.get("/estimates/trial-status")
      return response.data.data
    },
    retry: false,
  })

  const startTrial = useMutation({
    mutationFn: async () => {
      const response = await api.post("/estimates/start-trial")
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trialStatus"] })
    },
  })

  const currentTier = trialData?.tier || "FREE"
  const isTrialActive = trialData?.isTrialActive && trialData?.daysRemaining > 0
  const daysRemaining = trialData?.daysRemaining || 0

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-gray-600">Manage your subscription and billing</p>
      </div>

      {/* Current Plan Status */}
      <Card className={isTrialActive ? "border-green-500/50" : ""}>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            {isTrialActive
              ? `Pro Trial — ${daysRemaining} days remaining`
              : `${currentTier} Plan`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTrialActive ? (
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Trial Active
              </Badge>
              <p className="text-sm text-gray-500">
                Upgrade before your trial ends to keep all Pro features.
              </p>
            </div>
          ) : !trialData?.trialUsed ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => startTrial.mutate()}
                disabled={startTrial.isPending}
                variant="outline"
              >
                {startTrial.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Start 14-Day Pro Trial
              </Button>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentTier === plan.tier
          const Icon = plan.icon
          return (
            <Card
              key={plan.tier}
              className={`relative ${
                plan.popular ? "border-cyan-500 shadow-lg shadow-cyan-500/10" : ""
              } ${isCurrent ? "ring-2 ring-cyan-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-cyan-500 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-cyan-600 hover:bg-cyan-500"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => {
                      // TODO: Integrate with Stripe/Paystack checkout
                      alert(
                        `Upgrade to ${plan.name} plan — payment integration coming soon. Contact support@roofmanager.com to upgrade.`
                      )
                    }}
                  >
                    {plan.tier === "FREE" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payment info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Payment processing is handled securely via Stripe/Paystack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No payment method on file. Add a payment method when upgrading your plan.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

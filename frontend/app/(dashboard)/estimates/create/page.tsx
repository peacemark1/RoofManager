"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  DollarSign,
  Ruler,
  MapPin,
  Sparkles,
  Loader2,
  Check,
  Plus,
  Trash2,
  Truck,
  Wrench,
  Percent,
  TrendingUp,
  Save
} from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

interface Material {
  id?: string
  name: string
  quantity: number
  unit: string
  buyingPrice: number
  sellingPrice: number
  discount: number
}

interface EstimateData {
  jobId?: string
  useAI?: boolean
  laborHours: number
  totalCost: number
  timeline: string
  notes: string
  materials: Material[]
  installationCost: number
  transportationCost: number
  discountType: "percent" | "fixed"
  discountValue: number
  status: string
}

const UNITS = [
  { value: "sq ft", label: "Square Feet" },
  { value: "bundle", label: "Bundle" },
  { value: "piece", label: "Piece" },
  { value: "box", label: "Box" },
  { value: "roll", label: "Roll" },
  { value: "gal", label: "Gallon" },
  { value: "lb", label: "Pound" },
  { value: "sq", label: "Square (100 sq ft)" },
  { value: "ft", label: "Linear Feet" },
  { value: "each", label: "Each" }
]

export default function CreateEstimatePage() {
  const [jobId, setJobId] = useState("")
  const [laborHours, setLaborHours] = useState(0)
  const [timeline, setTimeline] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("DRAFT")

  // Materials
  const [materials, setMaterials] = useState<Material[]>([
    {
      name: "",
      quantity: 1,
      unit: "sq ft",
      buyingPrice: 0,
      sellingPrice: 0,
      discount: 0
    }
  ])

  // Additional costs
  const [installationCost, setInstallationCost] = useState(0)
  const [transportationCost, setTransportationCost] = useState(0)

  // Discounts
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent")
  const [discountValue, setDiscountValue] = useState(0)

  // Calculated totals
  const calculateTotals = () => {
    const materialsSubtotal = materials.reduce((sum, m) => {
      const lineTotal = (m.sellingPrice * m.quantity) - m.discount
      return sum + lineTotal
    }, 0)

    const subtotal = materialsSubtotal + installationCost + transportationCost

    const discountAmount = discountType === "percent"
      ? subtotal * (discountValue / 100)
      : discountValue

    const finalTotal = subtotal - discountAmount

    const totalBuyingCost = materials.reduce((sum, m) => {
      return sum + (m.buyingPrice * m.quantity)
    }, 0) + installationCost + transportationCost

    const profitMargin = finalTotal > 0
      ? ((finalTotal - totalBuyingCost) / finalTotal) * 100
      : 0

    return {
      materialsSubtotal,
      subtotal,
      discountAmount,
      finalTotal,
      totalBuyingCost,
      profitMargin
    }
  }

  const totals = calculateTotals()

  // Save estimate mutation
  const saveEstimate = useMutation({
    mutationFn: async () => {
      const discountAmount = discountType === "percent"
        ? totals.subtotal * (discountValue / 100)
        : discountValue

      const response = await api.post("/estimates", {
        jobId: jobId || undefined,
        laborHours,
        timeline,
        notes,
        materials: materials.map(m => ({
          ...m,
          estimatedCost: m.sellingPrice * m.quantity
        })),
        installationCost,
        transportationCost,
        discountPercent: discountType === "percent" ? discountValue : 0,
        discountAmount: discountType === "fixed" ? discountValue : 0,
        status
      })
      return response.data.data
    },
    onSuccess: () => {
      alert("Estimate saved successfully!")
    },
    onError: (error: any) => {
      console.error("Save estimate error:", error)
      alert("Failed to save estimate. Please try again.")
    }
  })

  // Add material row
  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        name: "",
        quantity: 1,
        unit: "sq ft",
        buyingPrice: 0,
        sellingPrice: 0,
        discount: 0
      }
    ])
  }

  // Remove material row
  const removeMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index))
    }
  }

  // Update material
  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updated = [...materials]
    updated[index] = { ...updated[index], [field]: value }
    setMaterials(updated)
  }

  // Calculate line total for a material
  const getLineTotal = (material: Material) => {
    return (material.sellingPrice * material.quantity) - material.discount
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return value.toFixed(1) + "%"
  }

  return (
    <div className="space-y-6 p-8 pt-6 min-h-screen bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Estimate</h1>
          <p className="text-gray-400 mt-1">Build a detailed business estimate with materials and pricing</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Estimate Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Estimate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job ID (Optional)</label>
                  <Input
                    placeholder="Enter job ID to link"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timeline</label>
                  <Input
                    placeholder="e.g., 2-3 days"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Labor Hours</label>
                  <Input
                    type="number"
                    min="0"
                    value={laborHours}
                    onChange={(e) => setLaborHours(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[80px]"
                  placeholder="Additional notes for this estimate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Materials Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Materials
                </CardTitle>
                <Button variant="outline" size="sm" onClick={addMaterial}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Material
                </Button>
              </div>
              <CardDescription>
                Add materials with buying and selling prices to track profit margins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header */}
                <div className="grid gap-2 text-sm font-medium text-gray-400 grid-cols-12">
                  <div className="col-span-3">Material Name</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-1">Unit</div>
                  <div className="col-span-2">Buying Price</div>
                  <div className="col-span-2">Selling Price</div>
                  <div className="col-span-1">Discount</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Material Rows */}
                {materials.map((material, index) => (
                  <div key={index} className="grid gap-2 grid-cols-12 items-center">
                    <div className="col-span-3">
                      <Input
                        placeholder="Material name"
                        value={material.name}
                        onChange={(e) => updateMaterial(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(index, "quantity", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <select
                        value={material.unit}
                        onChange={(e) => updateMaterial(index, "unit", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                      >
                        {UNITS.map((unit) => (
                          <option key={unit.value} value={unit.value}>
                            {unit.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Cost"
                        value={material.buyingPrice}
                        onChange={(e) => updateMaterial(index, "buyingPrice", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={material.sellingPrice}
                        onChange={(e) => updateMaterial(index, "sellingPrice", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={material.discount}
                        onChange={(e) => updateMaterial(index, "discount", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1 text-sm font-medium">
                      {formatCurrency(getLineTotal(material))}
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMaterial(index)}
                        disabled={materials.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Costs */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Wrench className="mr-2 h-5 w-5" />
                  Installation / Labor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Installation Cost ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={installationCost}
                    onChange={(e) => setInstallationCost(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Truck className="mr-2 h-5 w-5" />
                  Transportation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transportation Cost ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={transportationCost}
                    onChange={(e) => setTransportationCost(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Discounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Discounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">
                    {discountType === "percent" ? "Discount %" : "Discount Amount ($)"}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  />
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Total Discount</p>
                  <p className="text-xl font-bold text-red-400">
                    {formatCurrency(totals.discountAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Estimate Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Materials Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Materials Subtotal</span>
                <span className="font-medium">{formatCurrency(totals.materialsSubtotal)}</span>
              </div>

              {/* Installation */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Installation/Labor</span>
                <span className="font-medium">{formatCurrency(installationCost)}</span>
              </div>

              {/* Transportation */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transportation</span>
                <span className="font-medium">{formatCurrency(transportationCost)}</span>
              </div>

              <hr className="border-gray-700" />

              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center text-red-400">
                <span>Discount</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>

              <hr className="border-gray-700" />

              {/* Grand Total */}
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Grand Total</span>
                <span className="font-bold text-green-400">{formatCurrency(totals.finalTotal)}</span>
              </div>

              <hr className="border-gray-700" />

              {/* Profit Analysis */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Profit Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Total Cost</p>
                    <p className="text-lg font-bold text-red-400">
                      {formatCurrency(totals.totalBuyingCost)}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Profit Margin</p>
                    <p className={`text-lg font-bold ${totals.profitMargin >= 20 ? 'text-green-400' : totals.profitMargin >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {formatPercent(totals.profitMargin)}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Total Revenue</p>
                  <p className="text-lg font-bold text-green-400">
                    {formatCurrency(totals.finalTotal)}
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={() => saveEstimate.mutate()}
                disabled={saveEstimate.isPending}
              >
                {saveEstimate.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Estimate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
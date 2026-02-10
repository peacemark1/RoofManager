"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, DollarSign, Ruler, MapPin, Sparkles, Loader2, Check } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"

interface Material {
  name: string
  quantity: number
  unit: string
  estimatedCost: number
}

interface AIEstimate {
  laborHours: number
  materials: Material[]
  totalCost: number
  timeline: string
  confidenceScore: number
  notes: string
  aiGenerated: boolean
}

export default function CreateEstimatePage() {
  const [address, setAddress] = useState("")
  const [roofType, setRoofType] = useState("shingle")
  const [roofArea, setRoofArea] = useState("")
  const [stories, setStories] = useState("1")
  const [pitch, setPitch] = useState("medium")
  const [aiEstimate, setAIEstimate] = useState<AIEstimate | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const generateAIEstimate = useMutation({
    mutationFn: async () => {
      const response = await api.post("/estimates", {
        jobId: selectedJobId,
        useAI: true,
        propertyType: roofType,
        roofSize: Number(roofArea) || 2000,
        roofPitch: pitch,
        description: address
      })
      return response.data.data
    },
    onSuccess: (data) => {
      setAIEstimate({
        laborHours: data.laborHours,
        materials: data.materials.map((m: any) => ({
          name: m.name,
          quantity: m.quantity,
          unit: m.unit,
          estimatedCost: m.estimatedCost
        })),
        totalCost: data.totalCost,
        timeline: data.timeline,
        confidenceScore: data.aiConfidence || 75,
        notes: data.notes || "",
        aiGenerated: data.aiGenerated
      })
    },
    onError: (error: any) => {
      console.error("AI Estimate error:", error)
      alert("Failed to generate AI estimate. Please try again or use manual calculation.")
    }
  })

  const calculateManualEstimate = useMutation({
    mutationFn: async () => {
      const area = Number(roofArea) || 2000
      const pitchMultiplier = pitch === "low" ? 1.05 : pitch === "medium" ? 1.1 : 1.2
      const storiesMultiplier = stories === "1" ? 1 : stories === "2" ? 1.1 : 1.2

      const adjustedArea = area * pitchMultiplier * storiesMultiplier

      let materialCostPerSqft = 5
      if (roofType === "shingle") materialCostPerSqft = 5
      else if (roofType === "metal") materialCostPerSqft = 12
      else if (roofType === "tile") materialCostPerSqft = 15
      else if (roofType === "flat") materialCostPerSqft = 8

      const materialsCost = adjustedArea * materialCostPerSqft
      const laborCost = adjustedArea * 4
      const totalCost = materialsCost + laborCost

      const estimate: AIEstimate = {
        laborHours: Math.ceil(laborCost / 50),
        materials: [
          {
            name: roofType === "shingle" ? "Asphalt Shingles" : roofType === "metal" ? "Metal Panels" : roofType === "tile" ? "Concrete Tiles" : "EPDM Membrane",
            quantity: adjustedArea,
            unit: "sq ft",
            estimatedCost: materialsCost
          },
          {
            name: "Underlayment",
            quantity: adjustedArea,
            unit: "sq ft",
            estimatedCost: adjustedArea * 1.5
          },
          {
            name: "Nails & Hardware",
            quantity: Math.ceil(adjustedArea / 100),
            unit: "boxes",
            estimatedCost: Math.ceil(adjustedArea / 100) * 45
          },
          {
            name: "Flashing",
            quantity: Math.ceil(adjustedArea / 50),
            unit: "pieces",
            estimatedCost: Math.ceil(adjustedArea / 50) * 35
          }
        ],
        totalCost,
        timeline: `${Math.ceil((laborCost / 50) / 8)} days`,
        confidenceScore: 100,
        notes: "Manual calculation based on industry averages",
        aiGenerated: false
      }

      return estimate
    },
    onSuccess: (data) => {
      setAIEstimate(data)
    }
  })

  const handleGenerateEstimate = () => {
    if (selectedJobId) {
      generateAIEstimate.mutate()
    } else {
      calculateManualEstimate.mutate()
    }
  }

  const applyAIEstimate = () => {
    // Accept the AI estimate - would typically save to backend here
    alert("AI Estimate applied! You can now review and create a quote.")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Roof Estimation</h1>
        {selectedJobId && (
          <Badge variant="outline" className="text-sm">
            Job ID: {selectedJobId}
          </Badge>
        )}
      </div>

      {/* AI Estimate Preview Card - Shows when AI estimate is available */}
      {aiEstimate && (
        <Card className="mb-6 border-blue-500 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-blue-500 h-5 w-5" />
                AI Estimate Preview
              </CardTitle>
              <Badge variant={aiEstimate.aiGenerated ? "default" : "secondary"}>
                Confidence: {aiEstimate.confidenceScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg bg-white p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Labor Hours</p>
                <p className="text-2xl font-bold text-blue-600">{aiEstimate.laborHours} hrs</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(aiEstimate.totalCost)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="font-medium">{aiEstimate.timeline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Source</p>
                <p className="font-medium">{aiEstimate.aiGenerated ? "AI Generated" : "Manual Calculation"}</p>
              </div>
            </div>

            <h4 className="font-semibold mb-2">Suggested Materials:</h4>
            <div className="space-y-2 mb-4">
              {aiEstimate.materials.map((material, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-3 rounded border border-blue-100">
                  <div>
                    <p className="font-medium">{material.name}</p>
                    <p className="text-sm text-gray-500">
                      {material.quantity} {material.unit}
                    </p>
                  </div>
                  <p className="font-medium text-blue-600">
                    {formatCurrency(material.estimatedCost)}
                  </p>
                </div>
              ))}
            </div>

            {aiEstimate.notes && (
              <p className="text-sm text-gray-600 mb-4 p-3 bg-white rounded border border-blue-100">
                <strong>Notes:</strong> {aiEstimate.notes}
              </p>
            )}

            <div className="flex gap-2">
              <Button onClick={applyAIEstimate} className="bg-blue-600 hover:bg-blue-700">
                <Check className="mr-2 h-4 w-4" />
                Accept AI Estimate
              </Button>
              <Button variant="outline" onClick={() => calculateManualEstimate.mutate()}>
                Recalculate Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Roof Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="jobId" className="text-sm font-medium">
                Job ID (for AI Estimation)
              </label>
              <Input
                id="jobId"
                placeholder="Enter job ID to use AI (optional)"
                value={selectedJobId || ""}
                onChange={(e) => setSelectedJobId(e.target.value || null)}
              />
              <p className="text-xs text-gray-500">
                Leave empty for manual calculation. Enter a job ID to use AI estimation.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Property Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="address"
                  placeholder="Enter property address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="roofType" className="text-sm font-medium">
                Roof Type
              </label>
              <select
                id="roofType"
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="shingle">Asphalt Shingles</option>
                <option value="metal">Metal</option>
                <option value="tile">Tile</option>
                <option value="flat">Flat/Commercial</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="roofArea" className="text-sm font-medium">
                Roof Area (sq ft)
              </label>
              <div className="relative">
                <Ruler className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="roofArea"
                  type="number"
                  placeholder="Enter roof area"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="stories" className="text-sm font-medium">
                Number of Stories
              </label>
              <select
                id="stories"
                value={stories}
                onChange={(e) => setStories(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="1">1 Story</option>
                <option value="2">2 Stories</option>
                <option value="3">3+ Stories</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="pitch" className="text-sm font-medium">
                Roof Pitch
              </label>
              <select
                id="pitch"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="low">Low (0-3:12)</option>
                <option value="medium">Medium (4-9:12)</option>
                <option value="high">High (10:12+)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleGenerateEstimate}
                disabled={generateAIEstimate.isPending || calculateManualEstimate.isPending}
              >
                {generateAIEstimate.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AI Estimate...
                  </>
                ) : calculateManualEstimate.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : selectedJobId ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Estimate
                  </>
                ) : (
                  "Calculate Manually"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Estimate Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiEstimate ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-100 p-4">
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="text-2xl font-bold">
                      {aiEstimate.materials.reduce((acc, m) => acc + m.quantity, 0).toLocaleString()} sq ft
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(aiEstimate.totalCost)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                    <p className="text-sm text-gray-600">Labor Hours</p>
                    <p className="text-xl font-bold text-blue-600">{aiEstimate.laborHours} hrs</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="text-xl font-bold text-green-600">{aiEstimate.timeline}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Cost Breakdown</h4>
                  <div className="flex justify-between text-sm">
                    <span>Materials</span>
                    <span>
                      {formatCurrency(aiEstimate.materials.reduce((acc, m) => acc + m.estimatedCost, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Labor ({aiEstimate.laborHours} hrs @ $50/hr)</span>
                    <span>{formatCurrency(aiEstimate.laborHours * 50)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Materials List</h4>
                  <div className="space-y-1">
                    {aiEstimate.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {material.name} ({material.quantity} {material.unit})
                        </span>
                        <span>{formatCurrency(material.estimatedCost)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={applyAIEstimate}>
                  Create Quote from Estimate
                </Button>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-gray-500">
                Enter roof parameters and click "Generate Estimate" to see
                results
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Calendar, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function EstimatesPage() {
    const [search, setSearch] = useState("")

    const { data: estimates = [], isLoading } = useQuery({
        queryKey: ["estimates"],
        queryFn: async () => {
            const response = await api.get("/estimates")
            return response.data.data.estimates || []
        }
    })

    const filteredEstimates = estimates.filter((est: any) =>
        est.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
        est.job?.jobNumber?.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Estimates</h1>
                <Button asChild>
                    <Link href="/estimates/create">
                        <Plus className="mr-2 h-4 w-4" />
                        New Estimate
                    </Link>
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search estimates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {filteredEstimates.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">No estimates found</h3>
                    <p className="text-gray-500 mb-6">Create your first AI-powered estimate to get started.</p>
                    <Button asChild variant="outline">
                        <Link href="/estimates/create">Create Estimate</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEstimates.map((est: any) => (
                        <Card key={est.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{est.job?.title || "Draft Estimate"}</CardTitle>
                                        <p className="text-xs text-gray-500">{est.job?.jobNumber || "Unassigned"}</p>
                                    </div>
                                    <Badge variant={est.aiGenerated ? "default" : "secondary"}>
                                        {est.aiGenerated ? "AI" : "Manual"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    <span className="font-semibold text-blue-600">
                                        ${Number(est.totalCost).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {new Date(est.createdAt).toLocaleDateString()}
                                </div>
                                <div className="pt-2 border-t flex justify-end">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/estimates/${est.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

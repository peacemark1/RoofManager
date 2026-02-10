"use client"

import { useQuotes } from "@/lib/hooks/useQuotes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Search, FileText, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function QuotesPage() {
    const [search, setSearch] = useState("")
    const { data: quotes = [], isLoading } = useQuotes()

    const filteredQuotes = Array.isArray(quotes) ? quotes.filter((q: any) =>
        q.quoteNumber?.toLowerCase().includes(search.toLowerCase()) ||
        q.job?.title?.toLowerCase().includes(search.toLowerCase())
    ) : []

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
                <h1 className="text-3xl font-bold">Quotes</h1>
                <Button asChild>
                    <Link href="/estimates">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Quote
                    </Link>
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search quotes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredQuotes.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold">No quotes found</h3>
                        <p className="text-gray-500">Quotes are generated from accepted estimates.</p>
                    </Card>
                ) : (
                    <div className="bg-white border rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Quote #</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Job</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredQuotes.map((quote: any) => (
                                    <tr key={quote.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium">{quote.quoteNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{quote.job?.title || "Project"}</td>
                                        <td className="px-6 py-4 text-sm font-bold">${Number(quote.total).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <Badge className={getStatusColor(quote.status)}>
                                                {quote.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/dashboard/quotes/${quote.id}`}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
        case 'APPROVED': return 'bg-green-100 text-green-800'
        case 'SENT': return 'bg-blue-100 text-blue-800'
        case 'DRAFT': return 'bg-gray-100 text-gray-800'
        case 'EXPIRED': return 'bg-red-100 text-red-800'
        default: return 'bg-blue-100 text-blue-800'
    }
}

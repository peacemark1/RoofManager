import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

export interface AnalyticsData {
    stats: {
        name: string
        value: string
        icon: string
    }[]
    pipelineStages: {
        name: string
        count: number
        value: number
    }[]
    recentActivity: {
        type: string
        title: string
        time: string
        status: string
    }[]
}

export function useAnalytics() {
    return useQuery({
        queryKey: ["analytics"],
        queryFn: async () => {
            const response = await api.get("/analytics")
            return response.data.data as AnalyticsData
        },
    })
}

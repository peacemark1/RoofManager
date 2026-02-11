
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Briefcase, FileText, AlertTriangle } from "lucide-react";

export function DashboardMetrics() {
    const metrics = [
        {
            title: "Total Revenue",
            value: "$124,500",
            description: "+20.1% from last month",
            icon: DollarSign,
            trend: "up",
            color: "cyan",
        },
        {
            title: "Active Projects",
            value: "12",
            description: "3 completing this week",
            icon: Briefcase,
            trend: "neutral",
            color: "blue",
        },
        {
            title: "Pending Estimates",
            value: "8",
            description: "2 high priority",
            icon: FileText,
            trend: "down",
            color: "purple",
        },
        {
            title: "Low Stock Alert",
            value: "3 Items",
            description: "Requires reorder",
            icon: AlertTriangle,
            trend: "warning",
            color: "danger",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <Card key={metric.title} className="bg-slate-800/50 backdrop-blur border-slate-700 text-slate-100 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">
                            {metric.title}
                        </CardTitle>
                        <metric.icon
                            className={`h-4 w-4 text-${metric.color}-500`}
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {metric.value}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {metric.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Briefcase, FileText, Users } from "lucide-react";
import api from "@/lib/api";

interface StatItem {
    name: string;
    value: string;
    icon: string;
}

export function DashboardMetrics() {
    const [stats, setStats] = useState<StatItem[]>([]);

    useEffect(() => {
        api.get('/analytics')
            .then(res => {
                const data = res.data?.data || res.data;
                if (data?.stats) {
                    setStats(data.stats);
                }
            })
            .catch(err => console.error('Analytics fetch error:', err));
    }, []);

    const iconMap: Record<string, typeof DollarSign> = {
        DollarSign,
        Briefcase,
        FileText,
        Users,
    };

    const defaults = [
        { name: "Total Revenue", value: "$0", icon: "DollarSign" },
        { name: "Active Leads", value: "0", icon: "Users" },
        { name: "Active Jobs", value: "0", icon: "Briefcase" },
        { name: "Pending Invoices", value: "0", icon: "FileText" },
    ];

    const items = stats.length > 0 ? stats : defaults;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {items.map((metric) => {
                const IconComp = iconMap[metric.icon] || FileText;
                return (
                    <Card key={metric.name} className="bg-slate-800/50 backdrop-blur border-slate-700 text-slate-100 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">
                                {metric.name}
                            </CardTitle>
                            <IconComp className="h-4 w-4 text-cyan-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {metric.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

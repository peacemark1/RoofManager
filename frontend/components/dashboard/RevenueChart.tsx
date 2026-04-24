"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "@/lib/api";

const fallbackData = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
];

export function RevenueChart() {
    const [data, setData] = useState(fallbackData);

    useEffect(() => {
        api.get('/analytics')
            .then(res => {
                const chartData = res.data?.data?.revenueChart;
                if (chartData && chartData.length > 0) {
                    setData(chartData);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 text-slate-100 shadow-lg">
            <CardHeader>
                <CardTitle className="text-slate-100">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="month"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: '#06b6d4' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

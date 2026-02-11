
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { name: "Jan", total: 12000 },
    { name: "Feb", total: 15000 },
    { name: "Mar", total: 18000 },
    { name: "Apr", total: 22000 },
    { name: "May", total: 25000 },
    { name: "Jun", total: 30000 },
    { name: "Jul", total: 28000 },
];

export function RevenueChart() {
    return (
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700 text-slate-100 shadow-lg">
            <CardHeader>
                <CardTitle className="text-slate-100">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
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
                            dataKey="total"
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

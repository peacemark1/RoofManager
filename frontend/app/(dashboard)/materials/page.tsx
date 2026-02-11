
"use client";

import { MaterialsTable } from "@/components/materials/MaterialsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

export default function MaterialsPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-950">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Materials & Inventory
                </h2>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                    <Plus className="mr-2 h-4 w-4" /> Add Material
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur p-4 rounded-lg border border-slate-800">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search materials..."
                        className="pl-9 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 transition-all duration-200"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-md transition-all duration-200">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-md transition-all duration-200">
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* We can insert a summary row here later if needed (e.g. Total Value, Low Stock Count) */}

                <MaterialsTable />
            </div>
        </div>
    );
}

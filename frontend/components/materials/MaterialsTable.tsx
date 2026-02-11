
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const materials = [
    {
        id: "MAT-001",
        name: "Asphalt Shingles - Charcoal",
        category: "Shingles",
        quantity: 145,
        unit: "Bundles",
        price: 32.50,
        status: "In Stock",
    },
    {
        id: "MAT-002",
        name: "Roofing Nails - 1.25 inch",
        category: "Fasteners",
        quantity: 12,
        unit: "Boxes",
        price: 45.00,
        status: "Low Stock",
    },
    {
        id: "MAT-003",
        name: "Synthetic Underlayment",
        category: "Underlayment",
        quantity: 28,
        unit: "Rolls",
        price: 85.00,
        status: "In Stock",
    },
    {
        id: "MAT-004",
        name: "Drip Edge - Black",
        category: "Flashing",
        quantity: 8,
        unit: "Pieces",
        price: 18.25,
        status: "Low Stock",
    },
    {
        id: "MAT-005",
        name: "Ridge Vent - 4ft",
        category: "Ventilation",
        quantity: 56,
        unit: "Pieces",
        price: 12.00,
        status: "In Stock",
    },
];

export function MaterialsTable() {
    return (
        <div className="rounded-md border border-slate-800 bg-slate-900/50 backdrop-blur">
            <Table>
                <TableHeader className="bg-slate-900/80 border-b border-slate-800">
                    <TableRow className="border-slate-800 hover:bg-slate-900/80">
                        <TableHead className="text-slate-400">Material Name</TableHead>
                        <TableHead className="text-slate-400">Category</TableHead>
                        <TableHead className="text-slate-400">Quantity</TableHead>
                        <TableHead className="text-slate-400">Unit Price</TableHead>
                        <TableHead className="text-slate-400">Total Value</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-right text-slate-400">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materials.map((material) => (
                        <TableRow key={material.id} className="border-slate-800 hover:bg-slate-800/50 transition-all duration-200">
                            <TableCell className="font-medium text-slate-200">
                                <div className="flex flex-col">
                                    <span>{material.name}</span>
                                    <span className="text-xs text-slate-500">{material.id}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-400">{material.category}</TableCell>
                            <TableCell className="text-slate-300">
                                {material.quantity} <span className="text-slate-500 text-xs">{material.unit}</span>
                            </TableCell>
                            <TableCell className="text-slate-300">${material.price.toFixed(2)}</TableCell>
                            <TableCell className="text-slate-300 font-medium">${(material.quantity * material.price).toFixed(2)}</TableCell>
                            <TableCell>
                                {material.status === "In Stock" ? (
                                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                                        <CheckCircle2 className="mr-1 h-3 w-3" /> In Stock
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                                        <AlertTriangle className="mr-1 h-3 w-3" /> Low Stock
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-slate-900 border border-slate-800 text-slate-200 shadow-lg backdrop-blur">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer py-2 px-3 hover:bg-slate-700 hover:text-white">
                                            Edit details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer py-2 px-3 hover:bg-slate-700 hover:text-white">
                                            Adjust stock
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-800" />
                                        <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer py-2 px-3 hover:bg-red-900/20 hover:text-red-300">
                                            Delete item
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";
import { Users, FileText, Briefcase, CheckCircle, ArrowRight } from "lucide-react";

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
  bg: string;
  border: string;
  icon: typeof Users;
}

interface JobsPipelineProps {
  className?: string;
}

export function JobsPipeline({ className }: JobsPipelineProps) {
  const stages: PipelineStage[] = [
    {
      name: "Leads",
      count: 24,
      value: 450000,
      color: "text-ghana-green",
      bg: "bg-ghana-green/10",
      border: "border-ghana-green/30",
      icon: Users,
    },
    {
      name: "Quotes",
      count: 12,
      value: 280000,
      color: "text-kente-yellow",
      bg: "bg-kente-yellow/10",
      border: "border-kente-yellow/30",
      icon: FileText,
    },
    {
      name: "Active Jobs",
      count: 8,
      value: 185000,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      icon: Briefcase,
    },
    {
      name: "Completed",
      count: 15,
      value: 320000,
      color: "text-ghana-gold",
      bg: "bg-ghana-gold/10",
      border: "border-ghana-gold/30",
      icon: CheckCircle,
    },
  ];

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);

  return (
    <div
      className={cn(
        "rounded-2xl p-6 glass-card",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Jobs Pipeline</h3>
          <p className="text-sm text-slate-400">Roof installation stages</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ghana-green/10 border border-ghana-green/30">
          <ArrowRight className="w-4 h-4 text-ghana-green" />
          <span className="text-sm font-medium text-ghana-green">GHS {totalValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="relative">
        {/* Connecting lines */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-ghana-green/50 via-kente-yellow/50 to-cyan-500/50" />

        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage, index) => {
            const percentage = (stage.value / totalValue) * 100;
            const widthClass = index === 0 ? "col-span-1" : index === 3 ? "col-span-1" : "col-span-1";
            
            return (
              <div key={stage.name} className="relative group">
                {/* Stage Card */}
                <div
                  className={cn(
                    "relative rounded-xl p-4 transition-all duration-300",
                    "bg-slate-800/50 backdrop-blur-sm border",
                    stage.border,
                    "hover:bg-slate-800/80 hover:shadow-lg hover:shadow-ghana-green/10",
                    "cursor-pointer"
                  )}
                >
                  {/* Roof shape indicator */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div
                      className={cn(
                        "w-0 h-0 border-l-4 border-r-4 border-b-8",
                        stage.border.replace("border-", "border-b-")
                      )}
                    />
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl",
                      stage.bg
                    )}
                  >
                    <stage.icon className={cn("w-6 h-6", stage.color)} />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stage.count}</p>
                    <p className="text-sm text-slate-400 font-medium">{stage.name}</p>
                  </div>

                  {/* Value */}
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500">Value</p>
                    <p className={cn("text-sm font-semibold", stage.color)}>
                      GHS {(stage.value / 1000).toFixed(0)}K
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          stage.bg.replace("/10", "/50")
                        )}
                        style={{ width: `${Math.max(percentage, 20)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Arrow connector for mobile */}
                {index < stages.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 items-center z-10">
                    <ArrowRight className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Conversion Rate</span>
          <span className="text-ghana-green font-medium">32.5%</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-400">Avg. Job Value</span>
          <span className="text-ghana-gold font-medium">GHS 24,500</span>
        </div>
      </div>
    </div>
  );
}

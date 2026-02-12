"use client";

import { cn } from "@/lib/utils";
import {
  UserPlus,
  FileText,
  Briefcase,
  Receipt,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
  label: string;
  icon: typeof UserPlus;
  variant: "red" | "gold" | "green" | "blue";
  description: string;
  onClick: () => void;
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: "New Lead",
      icon: UserPlus,
      variant: "green",
      description: "Add a new potential customer",
      onClick: () => console.log("New Lead"),
    },
    {
      label: "Generate Quote",
      icon: FileText,
      variant: "gold",
      description: "Create a price estimate",
      onClick: () => console.log("Generate Quote"),
    },
    {
      label: "Schedule Job",
      icon: Briefcase,
      variant: "blue",
      description: "Book a new installation",
      onClick: () => console.log("Schedule Job"),
    },
    {
      label: "Create Invoice",
      icon: Receipt,
      variant: "red",
      description: "Send payment request",
      onClick: () => console.log("Create Invoice"),
    },
    {
      label: "Add Material",
      icon: Package,
      variant: "green",
      description: "Update inventory",
      onClick: () => console.log("Add Material"),
    },
  ];

  const variants = {
    red: {
      bg: "bg-ghana-red/10 hover:bg-ghana-red/20",
      border: "border-ghana-red/20",
      icon: "text-ghana-red",
      glow: "shadow-ghana-red/20",
    },
    gold: {
      bg: "bg-kente-yellow/10 hover:bg-kente-yellow/20",
      border: "border-kente-yellow/20",
      icon: "text-kente-yellow",
      glow: "shadow-kente-yellow/20",
    },
    green: {
      bg: "bg-ghana-green/10 hover:bg-ghana-green/20",
      border: "border-ghana-green/20",
      icon: "text-ghana-green",
      glow: "shadow-ghana-green/20",
    },
    blue: {
      bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
      border: "border-cyan-500/20",
      icon: "text-cyan-500",
      glow: "shadow-cyan-500/20",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("rounded-2xl p-6 premium-card", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ghana-gold/10">
            <Sparkles className="w-4 h-4 text-kente-yellow" />
          </div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        <span className="text-xs text-slate-500">Ghana Time: {new Date().toLocaleTimeString('en-GH')}</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {actions.map((action, index) => {
          const variantStyles = variants[action.variant];

          return (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative flex flex-col items-center justify-center p-4 rounded-xl",
                "border transition-all duration-300",
                variantStyles.bg,
                variantStyles.border,
                "hover:shadow-lg hover:-translate-y-1",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "p-3 rounded-xl mb-2 transition-transform duration-300",
                  "bg-slate-800/50 group-hover:scale-110",
                  variantStyles.icon
                )}
              >
                <action.icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <span className="text-sm font-medium text-white group-hover:text-white">
                {action.label}
              </span>

              {/* Description */}
              <span className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">
                {action.description}
              </span>

              {/* Arrow indicator */}
              <div
                className={cn(
                  "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100",
                  "transition-all duration-300 transform translate-x-1 group-hover:translate-x-0",
                  variantStyles.icon
                )}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Ghana flag accent strip */}
      <div className="mt-6 h-1 rounded-full overflow-hidden flex">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold" />
        <div className="flex-1 bg-ghana-green" />
      </div>
    </motion.div>
  );
}

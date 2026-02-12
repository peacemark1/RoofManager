"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "red" | "gold" | "green" | "blue";
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  trendValue,
  variant = "green",
  className,
  onClick,
}: MetricCardProps) {
  const variants = {
    red: {
      bg: "bg-ghana-red/10",
      border: "border-ghana-red/20",
      icon: "text-ghana-red",
      gradient: "from-ghana-red/20",
      accent: "bg-ghana-red",
    },
    gold: {
      bg: "bg-kente-yellow/10",
      border: "border-kente-yellow/20",
      icon: "text-kente-yellow",
      gradient: "from-kente-yellow/20",
      accent: "bg-kente-yellow",
    },
    green: {
      bg: "bg-ghana-green/10",
      border: "border-ghana-green/20",
      icon: "text-ghana-green",
      gradient: "from-ghana-green/20",
      accent: "bg-ghana-green",
    },
    blue: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-500",
      gradient: "from-cyan-500/20",
      accent: "bg-cyan-500",
    },
  };

  const variantStyles = variants[variant];

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up" ? "text-ghana-green" : trend === "down" ? "text-ghana-red" : "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative group rounded-2xl overflow-hidden transition-all duration-300",
        "premium-card cursor-pointer",
        variantStyles.border,
        className
      )}
      onClick={onClick}
    >
      {/* Gradient background on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl",
        variantStyles.gradient
      )} />

      {/* Content */}
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>

            {(description || trendValue) && (
              <div className="flex items-center gap-2 mt-2">
                {trendValue && (
                  <span
                    className={cn(
                      "flex items-center text-xs font-medium",
                      trendColor
                    )}
                  >
                    <TrendIcon className="w-3 h-3 mr-1" />
                    {trendValue}
                  </span>
                )}
                {description && (
                  <span className="text-xs text-slate-500">{description}</span>
                )}
              </div>
            )}
          </div>

          {/* Icon container */}
          <div
            className={cn(
              "relative p-3 rounded-xl",
              variantStyles.bg,
              "backdrop-blur-sm"
            )}
          >
            <Icon
              className={cn("w-6 h-6", variantStyles.icon)}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}

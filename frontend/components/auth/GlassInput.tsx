"use client"

import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  showPasswordToggle?: boolean
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, label, error, icon, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-slate-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            type={showPasswordToggle && showPassword ? "text" : type}
            id={props.id}
            className={cn(
              "flex h-12 w-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-400",
              "transition-all duration-300 ease-in-out",
              "focus:outline-none focus:border-ghana-gold/50 focus:ring-2 focus:ring-ghana-gold/20",
              "hover:border-white/20",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
              icon && "pl-10",
              showPasswordToggle && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400 animate-shake">{error}</p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = "GlassInput"

export { GlassInput }

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/stores/authStore"
import { GlassInput } from "./GlassInput"
import { SocialLoginButtons } from "./SocialLoginButtons"
import { Home, Lock, Mail, ArrowRight, Loader2 } from "lucide-react"

interface LoginFormProps {
  onMobileMoneyClick?: () => void
}

export function LoginForm({ onMobileMoneyClick }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-ghana-green to-ghana-green/60 shadow-lg shadow-ghana-green/30 mb-4"
        >
          <Home className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-bold text-white mb-2"
        >
          RoofManager
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-slate-400"
        >
          Welcome back! <span className="text-ghana-gold">Akwaaba!</span>
        </motion.p>
      </div>

      {/* Glass Card Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="premium-card p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <GlassInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail className="w-5 h-5" />}
            autoComplete="email"
          />

          {/* Password Field */}
          <GlassInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<Lock className="w-5 h-5" />}
            showPasswordToggle
            autoComplete="current-password"
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-ghana-green focus:ring-ghana-green/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-slate-400 hover:text-ghana-gold transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-ghana-green to-ghana-green/80 text-white font-semibold shadow-lg shadow-ghana-green/30 hover:shadow-ghana-green/50 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-4 text-sm text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <SocialLoginButtons onMobileMoneyClick={onMobileMoneyClick} />

        {/* Sign Up Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-ghana-gold hover:text-ghana-gold/80 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mt-6 text-xs text-slate-500"
      >
        <p className="mb-2">
          © 2026 RoofManager Inc. All rights reserved.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-slate-400 transition-colors">
            Contact Support
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

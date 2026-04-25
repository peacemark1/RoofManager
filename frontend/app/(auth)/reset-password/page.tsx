"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Lock, CheckCircle, ArrowLeft } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await api.post("/auth/reset-password", { token, password })
      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch {
      setError("Failed to reset password. The link may be expired.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="w-[400px] bg-slate-900/50 backdrop-blur border-slate-800 text-slate-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white">Invalid Link</CardTitle>
            <CardDescription className="text-slate-400">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/forgot-password" className="w-full">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                Request New Link
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="w-[400px] bg-slate-900/50 backdrop-blur border-slate-800 text-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Password Reset</CardTitle>
            <CardDescription className="text-slate-400">
              Your password has been reset. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-30" />

      <Card className="w-[400px] z-10 bg-slate-900/50 backdrop-blur border-slate-800 text-slate-200 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/40">
            <Home className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900/50 text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
            <Link href="/login" className="text-sm text-cyan-400 hover:text-cyan-300 text-center">
              <ArrowLeft className="inline mr-1 h-3 w-3" />
              Back to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LiquidGlassLoginProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export default function LiquidGlassLogin({ onSubmit }: LiquidGlassLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(email, password);
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated orbs */}
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
          }}
          transition={{ duration: 16, repeat: Infinity }}
        />
        
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.3, 0.9, 1.3],
            opacity: [0.3, 0.4, 0.3],
            y: [0, -100, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 1 }}
        />

        <motion.div
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          }}
          animate={{
            scale: [0.9, 1.2, 0.9],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main container */}
      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Liquid glass card with enhanced blur effect */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background with glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-3xl border border-white/20" />

          {/* Border glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-orange-400/0 opacity-0 pointer-events-none"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-10">
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="inline-flex mb-6 p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H3C2.17 1.5 1.5 2.17 1.5 3v14c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5V9.5M10.5 1.5v6h6M10.5 1.5L16.5 7.5" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">RoofManager</h1>
              <p className="text-white/60">Sign in to your account</p>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
              >
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-amber-400/50 focus:ring-amber-400/20 focus-visible:ring-2 backdrop-blur-sm transition-all"
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 pr-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-amber-400/50 focus:ring-amber-400/20 focus-visible:ring-2 backdrop-blur-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 border-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative py-6">
              <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <p className="relative text-center text-sm text-white/50 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-3">
                Or continue with
              </p>
            </motion.div>

            {/* Social buttons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl backdrop-blur-sm transition-all"
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="h-12 border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl backdrop-blur-sm transition-all"
              >
                Microsoft
              </Button>
            </motion.div>

            {/* Sign up link */}
            <motion.p variants={itemVariants} className="text-center text-sm text-white/60 pt-4">
              Don't have an account?{' '}
              <Link href="/register" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Sign up for free
              </Link>
            </motion.p>
          </div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-white/40 mt-8"
        >
          © 2026 RoofManager Inc. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}

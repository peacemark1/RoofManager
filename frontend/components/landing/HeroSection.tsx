'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';

export default function HeroSection() {
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
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradients - Ghanaian inspired */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Golden/Orange orb - Primary color */}
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Purple orb - Secondary color */}
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 0.9, 1.2],
            opacity: [0.3, 0.5, 0.3],
            y: [0, -50, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        
        {/* Emerald orb - Accent color */}
        <motion.div
          className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.4, 0.2],
            x: [-30, 30, -30],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light backdrop-blur-md border border-white/10"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-white/90">AI-Powered Roofing Management</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
              <span className="text-white">Manage Your </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Roofing Business
              </span>
              <br />
              <span className="text-white">Like Never Before</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed"
          >
            The complete CRM platform designed for roofing professionals. Estimate, schedule, manage crew, and track revenue—all in one intelligent system built for Ghana's growing roofing industry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 border-0 rounded-full"
            >
              <Link href="/register" className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold glass border-white/20 text-white hover:bg-white/10 rounded-full"
              asChild
            >
              <Link href="#features">
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-8 text-white/60 flex-wrap justify-center"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Roof-shaped decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(217, 119, 6, 0.2)" />
              <stop offset="100%" stopColor="rgba(217, 119, 6, 0.05)" />
            </linearGradient>
          </defs>
          <polygon points="0,50 300,0 600,50 900,0 1200,50 1200,100 0,100" fill="url(#roofGradient)" />
        </svg>
      </motion.div>
    </section>
  );
}

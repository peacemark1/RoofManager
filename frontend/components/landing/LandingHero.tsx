'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Star } from 'lucide-react';

interface LandingHeroProps {
  onGetStarted?: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  const [showVideo, setShowVideo] = useState(false);

  const stats = [
    { value: '2,500+', label: 'Businesses' },
    { value: '45k+', label: 'Roofs Managed' },
    { value: '98%', label: 'Customer Satisfaction' },
  ];

  const trustBadges = [
    'Trusted by industry leaders',
    'ISO 27001 Certified',
    'GDPR Compliant',
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Radial Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239, 43, 45, 0.1), transparent 50%)',
          }}
        />

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(239, 43, 45, 0.15), transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1), transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ghana-green/10 border border-ghana-green/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ghana-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ghana-green" />
              </span>
              <span className="text-sm font-medium text-ghana-green">
                AI-Powered Roofing Solutions
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Roofing Management,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold to-yellow-400">
                Redefined.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Leverage AI-driven monitoring and drone integration to transform how you inspect, 
              maintain, and manage commercial and residential roofing systems.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={onGetStarted}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-ghana-red to-ghana-red/80 hover:from-ghana-red/90 hover:to-ghana-red/70 transition-all hover:scale-105 hover:shadow-xl hover:shadow-ghana-red/25 focus:outline-none focus:ring-2 focus:ring-ghana-red/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-ghana-green" />
                  {badge}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Main Card */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ghana-red/20 flex items-center justify-center">
                    <span className="text-ghana-red font-bold">R</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">RoofManager Pro</div>
                    <div className="text-xs text-slate-400">Dashboard Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-ghana-gold to-ghana-green flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 ml-2">+250</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                  <div className="text-slate-400 text-sm mb-1">Total Properties</div>
                  <div className="text-2xl font-bold text-white">1,248</div>
                  <div className="text-xs text-ghana-green flex items-center gap-1 mt-1">
                    <ArrowRight className="w-3 h-3 rotate-45" /> +12% this month
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                  <div className="text-slate-400 text-sm mb-1">Issues Detected</div>
                  <div className="text-2xl font-bold text-white">23</div>
                  <div className="text-xs text-ghana-gold flex items-center gap-1 mt-1">
                    <ArrowRight className="w-3 h-3 -rotate-45" /> 8 critical
                  </div>
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-gradient-to-r from-ghana-green/20 to-ghana-gold/10 rounded-xl p-4 border border-ghana-green/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold">Structural Health</div>
                  <div className="text-ghana-green font-bold">98.2%</div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ghana-green to-ghana-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '98.2%' }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-slate-900/90 backdrop-blur-xl rounded-xl p-3 border border-ghana-gold/30 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-ghana-green animate-pulse" />
                  <span className="text-xs text-white font-medium">Live Thermal</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-slate-900/90 backdrop-blur-xl rounded-xl p-3 border border-ghana-red/30 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-ghana-gold" />
                  <span className="text-xs text-white font-medium">AI Analysis</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 p-2 text-white hover:text-ghana-gold transition-colors"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-ghana-red/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-ghana-red" />
                </div>
                <p className="text-white font-medium">Demo Video Placeholder</p>
                <p className="text-slate-400 text-sm mt-2">Connect your video source</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

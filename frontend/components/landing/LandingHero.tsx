'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface LandingHeroProps {
  onGetQuote?: () => void;
  onViewServices?: () => void;
}

export default function LandingHero({ onGetQuote, onViewServices }: LandingHeroProps) {
  const [showVideo, setShowVideo] = useState(false);

  const stats = [
    { value: '2,500+', label: 'Roofs Installed' },
    { value: '20+', label: 'Years Experience' },
    { value: '98%', label: 'Customer Satisfaction' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 50%, #1e3a8a 100%)' }}
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
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.15), transparent 50%)',
          }}
        />

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15), transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(30, 58, 138, 0.2), transparent 70%)',
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
              </span>
              <span className="text-sm font-medium text-brand-orange">
                Professional Roofing Services
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Professional Roofing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">
                Services
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Expert roofing solutions for residential and commercial properties. 
              Quality craftsmanship, reliable service, and competitive pricing.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={onGetQuote}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-orange to-brand-orange/80 hover:from-brand-orange/90 hover:to-brand-orange/70 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-orange/25 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Get Quote
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onViewServices}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                View Services
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { text: 'Licensed & Insured', icon: CheckCircle },
                { text: '5-Star Rated', icon: CheckCircle },
                { text: 'Fast Response', icon: CheckCircle },
              ].map((badge, index) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                >
                  <badge.icon className="w-4 h-4 text-brand-orange" />
                  <span className="text-xs text-slate-300">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Hero SVG Image */}
              <Image
                src="/images/hero.svg"
                alt="Professional Roofing Services"
                fill
                className="object-contain"
                priority
              />

              {/* Floating Cards Effect */}
              <motion.div
                className="absolute -bottom-8 -left-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Quality Guaranteed</div>
                    <div className="text-slate-400 text-sm">10-Year Warranty</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Free Estimate</div>
                    <div className="text-slate-400 text-sm">No obligation</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

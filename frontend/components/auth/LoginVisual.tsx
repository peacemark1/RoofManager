"use client"

import React from "react"
import { motion } from "framer-motion"
import { Building2, Shield, TrendingUp, Users } from "lucide-react"

// Adinkra symbol component (simplified SVG representation)
function GyeNyameSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10 L50 90 M10 50 L90 50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M50 20 Q60 20 60 30 Q60 40 50 40 Q40 40 40 30 Q40 20 50 20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 60 Q60 60 60 70 Q60 80 50 80 Q40 80 40 70 Q40 60 50 60"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M20 50 Q20 40 30 40 Q40 50 30 60 Q20 60 20 50"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M80 50 Q80 40 70 40 Q60 50 70 60 Q80 60 80 50"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

// Animated roof tile pattern
function RoofPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5">
      <svg width="100%" height="100%">
        <pattern id="roof-tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M0 20 L20 0 L40 20 L20 40 Z"
            fill="currentColor"
            className="text-ghana-green"
          />
          <path
            d="M20 20 L40 0 L60 20 L40 40 Z"
            fill="currentColor"
            className="text-ghana-gold"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#roof-tile)" />
      </svg>
    </div>
  )
}

// Floating particle
function FloatingParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100, -200],
        x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
      }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`absolute w-2 h-2 rounded-full ${color}`}
      style={{
        left: `${Math.random() * 100}%`,
        bottom: "-20px",
      }}
    />
  )
}

export function LoginVisual() {
  const features = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Roof Management",
      description: "Complete control over your roofing projects",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "Track your business growth",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hidden lg:flex flex-col items-center justify-center w-full h-full relative overflow-hidden premium-bg rounded-l-3xl"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Ghana Flag Color Gradients */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-ghana-green/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ghana-gold/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ghana-red/10 rounded-full blur-3xl"
        />

        {/* Animated particles */}
        <FloatingParticle delay={0} color="bg-ghana-green" />
        <FloatingParticle delay={2} color="bg-ghana-gold" />
        <FloatingParticle delay={4} color="bg-ghana-red" />
        <FloatingParticle delay={6} color="bg-ghana-green" />
        <FloatingParticle delay={8} color="bg-ghana-gold" />

        {/* Roof Pattern */}
        <RoofPattern />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-12">
        {/* Adinkra Symbol */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-8"
        >
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-ghana-gold/30 to-ghana-green/30 rounded-full blur-xl" />
            <GyeNyameSymbol className="relative z-10 w-full h-full text-ghana-gold animate-pulse" />
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Building the Future of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold to-ghana-green">
            Roofing
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-slate-300 mb-12 max-w-md"
        >
          Manage your roofing business with confidence and style
        </motion.p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-medium rounded-2xl p-4 text-left backdrop-blur-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-ghana-green/20 text-ghana-green">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Kente Border */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-12 h-1 rounded-full bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green"
      />

      {/* Ghana Flag Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-1"
      >
        <div className="flex h-full">
          <div className="flex-1 bg-ghana-red animate-pulse" />
          <div className="flex-1 bg-ghana-gold animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="flex-1 bg-ghana-green animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </motion.div>
    </motion.div>
  )
}

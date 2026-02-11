'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Film, Box, Layers, Cpu } from 'lucide-react';
import FloatingCard from '@/components/ar/FloatingCard';
import MediaPanel from '@/components/ar/MediaPanel';

interface Particle {
  id: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate particles only on the client side after mounting
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AR Interfaces</span>
          </motion.h1>
          <motion.p
            className="mb-8 text-xl text-zinc-400 md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Immersive, AI-driven, and completely dynamic.
          </motion.p>
          <motion.button
            onClick={scrollToDemo}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mounted && particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </header>

      {/* Features Section */}
      <section id="demo-section" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="mb-12 text-3xl font-bold text-center md:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Key Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <FloatingCard
              title="Immersive 3D Tilt"
              description="Real-time mouse tracking creates stunning 3D tilt effects with smooth spring animations and parallax layers."
              icon={<Box className="w-12 h-12 text-blue-400" />}
              backgroundImage="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=800&fit=crop"
            />
            <FloatingCard
              title="Real-time AI Content"
              description="Dynamic content generation powered by advanced AI models, delivering personalized experiences instantly."
              icon={<Cpu className="w-12 h-12 text-purple-400" />}
              backgroundImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop"
            />
            <FloatingCard
              title="Cinematic Motion"
              description="Hollywood-grade camera movements and transitions that bring your content to life with dramatic flair."
              icon={<Film className="w-12 h-12 text-pink-400" />}
              backgroundImage="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=800&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="mb-12 text-3xl font-bold text-center md:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Advanced Visual Effects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingCard
              title="Glassmorphism"
              description="Beautiful frosted glass effects with backdrop blur and subtle borders for modern UI aesthetics."
              icon={<Layers className="w-10 h-10 text-cyan-400" />}
            />
            <FloatingCard
              title="Lightning Fast"
              description="Optimized performance with 60fps animations and GPU-accelerated rendering for smooth interactions."
              icon={<Zap className="w-10 h-10 text-yellow-400" />}
            />
          </div>
        </div>
      </section>

      {/* Media Panels Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="mb-12 text-3xl font-bold text-center md:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Cinematic Media Display
          </motion.h2>

          <div className="space-y-16">
            <MediaPanel
              type="image"
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
              alt="Digital landscape"
              caption="Immersive visualizations that blur the line between digital and physical worlds."
            />

            <MediaPanel
              type="image"
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop"
              alt="Abstract 3D"
              caption="Stunning parallax effects create depth and dimension in every frame."
            />

            <MediaPanel
              type="image"
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&h=1080&fit=crop"
              alt="Neon city"
              caption="Dynamic content that responds to user interaction and environmental conditions."
            />
          </div>
        </div>
      </section>

      {/* Feature Icons Showcase */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Framer Motion</span>
          </motion.div>

          <h2 className="mb-8 text-3xl font-bold md:text-4xl">
            Built for Modern Web Experiences
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Box, label: '3D Transforms', color: 'text-blue-400' },
              { icon: Sparkles, label: 'Smooth Animations', color: 'text-purple-400' },
              { icon: Layers, label: 'Glass Effects', color: 'text-cyan-400' },
              { icon: Cpu, label: 'AI Ready', color: 'text-pink-400' },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`p-4 rounded-2xl bg-zinc-800/50 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="text-sm text-zinc-400">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-zinc-500 mb-4">
            © 2024 AR UI Prototype. Built with Next.js and Framer Motion.
          </p>
          <div className="flex justify-center gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

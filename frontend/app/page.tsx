'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import MobileCTABanner from '@/components/landing/MobileCTABanner';
import ScrollToTop from '@/components/landing/ScrollToTop';
import { Roof } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile CTA Banner */}
      <MobileCTABanner />

      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 lg:px-8 h-16 flex items-center glass-light sticky top-0 z-50 backdrop-blur-lg border-b border-white/10"
      >
        <Link className="flex items-center justify-center" href="/">
          <Roof className="h-7 w-7 text-amber-400 mr-2" />
          <span className="font-bold text-xl tracking-tight text-white">RoofManager</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="text-sm font-medium text-white/70 hover:text-white transition-colors" href="/login">
            Login
          </Link>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center rounded-3xl p-12 glass-medium border border-amber-400/20 overflow-hidden"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Transform Your Roofing Business <span className="text-amber-400">Today</span>
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mb-10">
                Join Ghana's fastest-growing roofing contractors who've scaled their businesses with RoofManager. Start your free trial—no credit card required.
              </p>
              <Button
                asChild
                size="lg"
                className="px-10 py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 border-0 rounded-xl"
              >
                <Link href="/register">Start Your Free Trial</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 glass-light border-t border-white/10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© 2026 RoofManager Inc. All rights reserved.</p>
          <nav className="flex gap-6">
            <Link className="text-sm text-white/50 hover:text-white transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm text-white/50 hover:text-white transition-colors" href="#">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

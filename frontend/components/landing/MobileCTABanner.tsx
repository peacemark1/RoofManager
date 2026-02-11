'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Smartphone } from 'lucide-react';

export default function MobileCTABanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-4 shadow-2xl">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{
                backgroundImage:
                  'linear-gradient(45deg, transparent 25%, rgba(255,255,255,.2) 25%, rgba(255,255,255,.2) 50%, transparent 50%, transparent 75%, rgba(255,255,255,.2) 75%, rgba(255,255,255,.2))',
                backgroundSize: '60px 60px',
              }}
            />

            <div className="relative z-10 flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Smartphone className="h-5 w-5 text-white flex-shrink-0" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Ready to scale your business?</p>
                  <p className="text-xs text-white/90">Start your free 14-day trial today</p>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  asChild
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-white/90 font-semibold"
                >
                  <Link href="/register">Start Free</Link>
                </Button>
                <motion.button
                  onClick={() => setIsVisible(false)}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Close banner"
                >
                  <X className="h-4 w-4 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

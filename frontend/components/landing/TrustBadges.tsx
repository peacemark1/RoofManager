'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const trustBadges = [
  {
    icon: '/images/trust-licensed.svg',
    label: 'Licensed & Insured',
    value: 'Fully Certified',
  },
  {
    icon: '/images/trust-rated.svg',
    label: '5-Star Rated',
    value: '4.9/5 Rating',
  },
  {
    icon: '/images/trust-experience.svg',
    label: '20+ Years Experience',
    value: 'Industry Leaders',
  },
  {
    icon: '/images/trust-fast.svg',
    label: 'Fast Response',
    value: 'Same Day Service',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-brand-blue/5 via-brand-orange/5 to-brand-blue/5 rounded-full blur-3xl" 
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative premium-card text-center cursor-default"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={badge.icon}
                  alt={badge.label}
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{badge.value}</div>
              <div className="text-sm text-slate-400">{badge.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8"
        >
          {[
            { text: 'GAF Certified', icon: '🏆' },
            { text: 'Better Business Bureau A+', icon: '⭐' },
            { text: 'Local & Family Owned', icon: '🏠' },
            { text: 'Eco-Friendly Materials', icon: '🌿' },
          ].map((item, index) => (
            <div
              key={item.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-slate-300">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

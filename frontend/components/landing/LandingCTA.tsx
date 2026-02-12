'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface LandingCTAProps {
  title?: string;
  description?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
}

const defaultProps = {
  title: 'Ready to Transform Your Roof?',
  description: 'Get a free, no-obligation quote today. Our expert team is ready to help you with all your roofing needs.',
  primaryCTA: 'Get Free Quote',
  secondaryCTA: 'Contact Us',
};

export default function LandingCTA({
  title = defaultProps.title,
  description = defaultProps.description,
  primaryCTA = defaultProps.primaryCTA,
  secondaryCTA = defaultProps.secondaryCTA,
}: LandingCTAProps) {
  const benefits = [
    'Free On-Site Inspection',
    'Detailed Written Estimates',
    'Quality Materials & Workmanship',
    '10-Year Warranty Available',
    'Flexible Payment Options',
    'Licensed & Insured Crews',
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Pattern Background */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url('/images/pattern-bg.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Background gradients overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue/90 via-brand-blue/80 to-brand-orange/90" />

      {/* Animated overlay effect */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="premium-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Brand accent */}
          <div className="absolute top-0 left-0 right-0 h-1">
            <div className="h-full w-full bg-gradient-to-r from-brand-orange via-brand-orange to-brand-blue" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text content */}
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg text-white/80 mb-8"
                >
                  {description}
                </motion.p>

                {/* Benefits list */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-2 gap-3 mb-8"
                >
                  {benefits.map((benefit, index) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-2 text-white/90"
                    >
                      <CheckCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap gap-4"
                >
                  <button className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-orange/25">
                    {primaryCTA}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105">
                    {secondaryCTA}
                  </button>
                </motion.div>
              </div>

              {/* Image/Graphic */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden md:block"
              >
                <div className="relative aspect-square max-w-md mx-auto">
                  {/* Decorative circles */}
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute inset-10 bg-brand-orange/20 rounded-full blur-2xl" />
                  
                  {/* Main content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-32 h-32 rounded-full bg-brand-orange flex items-center justify-center mb-6 shadow-2xl">
                      <span className="text-5xl font-bold text-white">10+</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Years of Excellence</h3>
                    <p className="text-white/70">Trusted by thousands of happy customers</p>
                    
                    {/* Stats */}
                    <div className="flex gap-8 mt-8 pt-8 border-t border-white/20">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">2500+</div>
                        <div className="text-white/60 text-sm">Roofs Installed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">98%</div>
                        <div className="text-white/60 text-sm">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

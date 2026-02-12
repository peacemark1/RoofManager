'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import FeatureCard from './FeatureCard';

const featureIcons = {
  quotes: '/images/feature-quotes.svg',
  craftsmanship: '/images/feature-craftsmanship.svg',
  service: '/images/feature-service.svg',
  pricing: '/images/feature-pricing.svg',
};

export default function FeaturesSection() {
  const features = [
    {
      title: 'Free Quotes',
      description: 'Get detailed, no-obligation estimates for your roofing project. Transparent pricing with no hidden fees.',
      icon: featureIcons.quotes,
      accentColor: 'orange' as const,
    },
    {
      title: 'Expert Craftsmanship',
      description: 'Our certified roofing professionals deliver quality workmanship backed by years of industry experience.',
      icon: featureIcons.craftsmanship,
      accentColor: 'blue' as const,
    },
    {
      title: 'Premium Service',
      description: 'Dedicated customer support throughout your project. We keep you informed every step of the way.',
      icon: featureIcons.service,
      accentColor: 'orange' as const,
    },
    {
      title: 'Competitive Pricing',
      description: 'Quality roofing at fair prices. We offer flexible payment options to fit your budget.',
      icon: featureIcons.pricing,
      accentColor: 'blue' as const,
    },
  ];

  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.1), transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(30, 58, 138, 0.05), transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
            </span>
            Why Choose Us
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything you need for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">
              quality roofing
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 leading-relaxed">
            We provide comprehensive roofing services with a focus on quality, 
            reliability, and customer satisfaction.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                }
                index={index}
                accentColor={feature.accentColor}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-orange/25">
            View All Services
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ElementType;
  ctaText: string;
}

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers: PricingTier[] = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? 'GHS 499' : 'GHS 4,790',
      description: 'Perfect for small roofing businesses getting started with digital inspections.',
      icon: Zap,
      features: [
        'Up to 50 properties',
        'Basic AI inspections',
        'Drone photo storage (10GB)',
        'Email support',
        'Mobile app access',
        'Basic reporting',
      ],
      ctaText: 'Start Free Trial',
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 'GHS 1,499' : 'GHS 14,390',
      description: 'Ideal for growing companies needing advanced features and integrations.',
      icon: Sparkles,
      highlighted: true,
      features: [
        'Up to 500 properties',
        'Advanced AI inspections',
        'Drone photo storage (100GB)',
        'Thermal mapping analysis',
        'Priority support',
        'API access',
        'Custom integrations',
        'Team collaboration',
      ],
      ctaText: 'Get Started',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations requiring maximum scale and security.',
      icon: Crown,
      features: [
        'Unlimited properties',
        'Premium AI models',
        'Unlimited storage',
        'Advanced thermal analytics',
        '24/7 dedicated support',
        'Custom AI training',
        'On-premise deployment',
        'SLA guarantee',
        'White-label options',
      ],
      ctaText: 'Contact Sales',
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08), transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ghana-gold/10 border border-ghana-gold/20 text-ghana-gold text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple Pricing
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Choose the perfect plan for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold to-yellow-400">
              your business
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            Transparent pricing with no hidden fees. Start your free trial today and see the difference.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-slate-800/50 rounded-xl p-1.5 border border-slate-700/50">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-ghana-red text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-ghana-red text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-ghana-green">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-ghana-red/20 via-slate-900/80 to-slate-900/80 border-2 border-ghana-red/50 shadow-2xl shadow-ghana-red/20'
                  : 'bg-slate-900/60 border border-slate-700/50 hover:border-ghana-gold/30'
              }`}
            >
              {/* Highlight Badge */}
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-ghana-red to-ghana-red/80 py-2 text-center">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className={`p-8 ${tier.highlighted ? 'pt-12' : ''}`}>
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    tier.highlighted
                      ? 'bg-gradient-to-br from-ghana-red to-ghana-red/60'
                      : 'bg-slate-800/50'
                  }`}
                >
                  <tier.icon
                    className={`w-7 h-7 ${
                      tier.highlighted ? 'text-white' : 'text-ghana-gold'
                    }`}
                  />
                </motion.div>

                {/* Name & Price */}
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-slate-400 text-sm ml-2">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-ghana-red to-ghana-red/80 text-white hover:from-ghana-red/90 hover:to-ghana-red/70 hover:scale-[1.02] shadow-lg shadow-ghana-red/25 focus:ring-ghana-red/50'
                      : 'bg-slate-800/50 text-white hover:bg-slate-800/70 hover:scale-[1.02] border border-slate-700/50 focus:ring-slate-500/50'
                  }`}
                >
                  {tier.ctaText}
                </button>

                {/* Features List */}
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-5 h-5 text-ghana-green shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border border-ghana-gold/30" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          className="text-center mt-12 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-300">
            <span className="text-ghana-gold font-semibold">30-day money-back guarantee</span>
            {' '}| Try risk-free with full support during your trial period.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

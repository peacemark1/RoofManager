'use client';

import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  highlighted: boolean;
  features: string[];
  color: string;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for solo contractors just getting started',
    price: '₵199',
    period: '/month',
    cta: 'Start Free Trial',
    highlighted: false,
    color: 'from-blue-400 to-cyan-500',
    features: [
      'Up to 20 jobs/month',
      'Basic estimates & quoting',
      'Mobile job tracking',
      'Photo storage (5GB)',
      'Email support',
      '1 user account',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Most popular for growing roofing teams',
    price: '₵499',
    period: '/month',
    cta: 'Start Free Trial',
    highlighted: true,
    color: 'from-amber-400 to-orange-500',
    features: [
      'Unlimited jobs',
      'AI-powered estimates',
      'Advanced scheduling',
      'Crew management',
      'Photo storage (50GB)',
      'Priority email & chat support',
      'Up to 5 user accounts',
      'Revenue analytics',
      'Custom templates',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale roofing operations',
    price: 'Custom',
    period: 'pricing',
    cta: 'Contact Sales',
    highlighted: false,
    color: 'from-purple-400 to-indigo-500',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'On-site training',
      'SLA guarantee',
      'White-label options',
    ],
  },
];

export default function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Simple, Transparent <span className="text-amber-400">Pricing</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Choose the plan that fits your roofing business. All plans include a 14-day free trial with full access.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className="relative group h-full"
              whileHover={plan.highlighted ? { y: -12 } : { y: -4 }}
            >
              {/* Highlight indicator */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="h-4 w-4" />
                    Most Popular
                  </motion.div>
                </div>
              )}

              <div
                className={`relative h-full rounded-2xl p-8 overflow-hidden transition-all duration-300 ${
                  plan.highlighted ? 'ring-2 ring-amber-400/50' : ''
                }`}
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    plan.highlighted
                      ? 'from-white/15 via-white/10 to-white/5'
                      : 'from-white/10 via-white/5 to-transparent'
                  } glass-light backdrop-blur-lg border ${
                    plan.highlighted ? 'border-amber-400/40' : 'border-white/20'
                  } group-hover:border-amber-400/30 transition-all`}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/60 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <motion.div
                      className="inline-flex items-baseline gap-1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/60">{plan.period}</span>
                    </motion.div>
                  </div>

                  {/* CTA Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-8">
                    <Button
                      asChild
                      className={`w-full h-12 font-semibold rounded-xl border-0 transition-all ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                      }`}
                    >
                      <Link href="/register">{plan.cta}</Link>
                    </Button>
                  </motion.div>

                  {/* Features list */}
                  <div className="border-t border-white/10 pt-8 flex-1">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          className="flex items-start gap-3 text-white/80"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ section */}
        <motion.div
          className="max-w-2xl mx-auto rounded-2xl p-8 glass-medium border border-white/10 backdrop-blur-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>

          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes! Upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, bank transfers, and Momo (MTN & Vodafone) for Ghana-based customers.',
              },
              {
                q: 'Is there a setup fee?',
                a: 'No setup fees! You can start using RoofManager immediately after signing up. No credit card required for the free trial.',
              },
              {
                q: 'What happens if I cancel?',
                a: 'You can cancel anytime with no penalties. Your data remains accessible for 30 days after cancellation.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="border border-white/10 rounded-lg p-4 hover:border-amber-400/30 transition-all"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-white/60 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

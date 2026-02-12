'use client';

import { motion } from 'framer-motion';
import { 
  Camera, 
  Brain, 
  Zap, 
  Shield, 
  BarChart3, 
  Users,
  ArrowUpRight 
} from 'lucide-react';
import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
  const features = [
    {
      title: 'AI-Powered Inspections',
      description: 'Advanced computer vision and machine learning algorithms automatically detect defects, damage, and potential issues with 98% accuracy.',
      icon: Brain,
      accentColor: 'red' as const,
    },
    {
      title: 'Drone Integration',
      description: 'Seamlessly connect with drone platforms to capture high-resolution aerial imagery of entire roofing systems in minutes.',
      icon: Camera,
      accentColor: 'gold' as const,
    },
    {
      title: 'Real-Time Alerts',
      description: 'Instant notifications when issues are detected, allowing you to respond quickly and prevent costly damage before it escalates.',
      icon: Zap,
      accentColor: 'green' as const,
    },
    {
      title: 'Thermal Mapping',
      description: 'Identify heat loss, moisture intrusion, and insulation problems with advanced thermal imaging analysis.',
      icon: BarChart3,
      accentColor: 'blue' as const,
    },
    {
      title: 'Secure Data Storage',
      description: 'Enterprise-grade encryption and compliance with data protection regulations ensure your sensitive information stays safe.',
      icon: Shield,
      accentColor: 'green' as const,
    },
    {
      title: 'Team Collaboration',
      description: 'Multi-user access with role-based permissions allows your entire team to view, analyze, and act on roofing data together.',
      icon: Users,
      accentColor: 'gold' as const,
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
              radial-gradient(circle at 20% 50%, rgba(239, 43, 45, 0.1), transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.05), transparent 50%)
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ghana-red/10 border border-ghana-red/20 text-ghana-red text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ghana-red opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ghana-red" />
            </span>
            Powerful Features
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold to-yellow-400">
              manage roofs smarter
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 leading-relaxed">
            Our comprehensive platform combines cutting-edge AI technology with intuitive design 
            to revolutionize how you inspect, maintain, and manage roofing systems.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
              accentColor={feature.accentColor}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-ghana-green/20 to-ghana-green/10 border border-ghana-green/30 hover:from-ghana-green/30 hover:to-ghana-green/20 transition-all hover:scale-105">
            Explore All Features
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

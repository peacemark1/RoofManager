'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  Calendar, 
  Users, 
  BarChart, 
  Smartphone, 
  Shield,
  Roof,
  TrendingUp,
  FileText
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
}

const features: Feature[] = [
  {
    id: '1',
    title: 'AI Estimation',
    description: 'Generate accurate, professional roof estimates in minutes. Our AI learns from your pricing to deliver quotes that maximize margins.',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
    bgGradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/5',
  },
  {
    id: '2',
    title: 'Smart Scheduling',
    description: 'Optimize crew assignments and job timelines automatically. Keep your teams synchronized and projects on track in real-time.',
    icon: Calendar,
    color: 'from-purple-400 to-indigo-500',
    bgGradient: 'bg-gradient-to-br from-purple-500/10 to-indigo-500/5',
  },
  {
    id: '3',
    title: 'Lead Pipeline',
    description: 'Track every opportunity from first contact to final payment. Integrated CRM designed specifically for roofing contractors.',
    icon: Users,
    color: 'from-emerald-400 to-teal-500',
    bgGradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5',
  },
  {
    id: '4',
    title: 'Revenue Analytics',
    description: 'Get deep insights into business performance, profit margins, and revenue trends. Real-time dashboards for better decisions.',
    icon: BarChart,
    color: 'from-rose-400 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-rose-500/10 to-pink-500/5',
  },
  {
    id: '5',
    title: 'Mobile Management',
    description: 'Manage your entire business on-the-go. Upload photos, get signatures, track jobs, and manage crew from any device.',
    icon: Smartphone,
    color: 'from-cyan-400 to-blue-500',
    bgGradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5',
  },
  {
    id: '6',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance. Your data is protected as your roofing business scales across multiple locations.',
    icon: Shield,
    color: 'from-indigo-400 to-purple-500',
    bgGradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5',
  },
];

const roofingFeatures = [
  {
    icon: Roof,
    title: 'Roof Inspection Tools',
    description: 'Built-in tools for roof assessment and measurements',
  },
  {
    icon: FileText,
    title: 'Job Documentation',
    description: 'Complete photo and note organization for each project',
  },
  {
    icon: TrendingUp,
    title: 'Growth Tracking',
    description: 'Monitor business growth and performance metrics',
  },
];

export default function FeaturesSection() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
            Everything Built for <span className="text-amber-400">Your Success</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Purpose-built features that understand the roofing industry. From estimation to execution, we've got you covered.
          </p>
        </motion.div>

        {/* Main features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-8px]"
            >
              {/* Background with glass effect */}
              <div className={`absolute inset-0 ${feature.bgGradient} glass-light backdrop-blur-lg border border-white/10 group-hover:border-white/20 transition-all`} />
              
              {/* Icon container */}
              <div className="relative z-10 mb-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>

              {/* Accent line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Roofing-specific features */}
        <motion.div
          className="py-16 px-8 rounded-2xl glass-medium border border-white/10 backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-12 text-center">
            Made for Roofing Professionals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roofingFeatures.map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <item.icon className="h-6 w-6 text-amber-400" />
                </motion.div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

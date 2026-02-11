'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Kwame Mensah',
    role: 'Owner & Founder',
    company: 'Mensah Roofing Solutions',
    location: 'Accra, Ghana',
    quote: 'RoofManager transformed our operations. We went from managing jobs with pen and paper to a full digital system. Our revenue increased by 45% in just 6 months.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ama Osei',
    role: 'Project Manager',
    company: 'Elite Roofing Services',
    location: 'Kumasi, Ghana',
    quote: 'The scheduling feature alone saves us 15+ hours every week. Our crew coordination is seamless, and clients love the transparency. This tool is a game-changer for Ghana.',
    rating: 5,
  },
  {
    id: '3',
    name: 'David Abotsi',
    role: 'Business Owner',
    company: 'Apex Roof Contractors',
    location: 'Takoradi, Ghana',
    quote: 'Finally, software that understands roofing! The AI estimates are incredibly accurate, and we close 50% more deals. Highly recommend for any serious roofing business.',
    rating: 5,
  },
];

const stats = [
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '1,200+', label: 'Active Users' },
  { value: '₵250M+', label: 'Revenue Managed' },
  { value: '15,000+', label: 'Jobs Completed' },
];

export default function TestimonialsSection() {
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
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
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
            Trusted by <span className="text-amber-400">Roofing Professionals</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Join hundreds of roofing contractors across Ghana who've transformed their businesses with RoofManager.
          </p>
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group rounded-2xl p-6 glass-light border border-white/10 hover:border-amber-400/30 transition-all"
            >
              <div className="relative z-10">
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2"
                  whileInView={{ scale: [0.8, 1] }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-white/60 text-sm md:text-base">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="relative group"
              whileHover={{ y: -8 }}
            >
              <div className="relative h-full rounded-2xl p-8 glass-medium border border-white/10 group-hover:border-amber-400/30 backdrop-blur-lg transition-all overflow-hidden">
                {/* Background decoration */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Quote icon */}
                  <motion.div
                    className="inline-flex mb-4 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/10 items-center justify-center"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Quote className="h-5 w-5 text-amber-400" />
                  </motion.div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white/80 leading-relaxed flex-1 mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author info */}
                  <div className="border-t border-white/10 pt-6">
                    <p className="font-semibold text-white mb-1">{testimonial.name}</p>
                    <p className="text-sm text-white/60 mb-1">{testimonial.role}</p>
                    <p className="text-xs text-white/50 mb-2">{testimonial.company}</p>
                    <p className="text-xs text-amber-400/70 font-medium">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 relative rounded-3xl p-12 glass-medium border border-amber-400/20 overflow-hidden text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-transparent to-orange-600/10 opacity-0"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Join These <span className="text-amber-400">Success Stories?</span>
            </h3>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Start your free trial today and see how RoofManager can transform your roofing business.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
              <span>→</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

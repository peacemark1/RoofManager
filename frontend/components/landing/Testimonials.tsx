'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
  accentColor: 'green' | 'gold' | 'red' | 'orange' | 'blue';
}

const testimonials: Testimonial[] = [
  {
    name: 'James Wilson',
    role: 'Homeowner',
    company: 'Residential Client',
    quote: 'Exceptional service from start to finish. The team was professional, clean, and delivered exactly what they promised. Our new roof looks amazing!',
    rating: 5,
    avatar: '/images/testimonial-1.svg',
    accentColor: 'orange',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Property Manager',
    company: 'Mitchell Properties',
    quote: 'We\'ve used their services for multiple commercial properties. Always on time, on budget, and quality work. Highly recommend for any roofing needs.',
    rating: 5,
    avatar: '/images/testimonial-2.svg',
    accentColor: 'blue',
  },
  {
    name: 'Robert Chen',
    role: 'Business Owner',
    company: 'Chen Industries',
    quote: 'After storm damage, they responded quickly and handled everything with our insurance company. Made what could have been a nightmare completely stress-free.',
    rating: 5,
    avatar: '/images/testimonial-3.svg',
    accentColor: 'orange',
  },
];

const accentColors = {
  orange: {
    bg: 'from-brand-orange/10 to-brand-orange/5',
    border: 'border-brand-orange/20',
    icon: 'text-brand-orange',
    accent: 'bg-brand-orange',
  },
  blue: {
    bg: 'from-brand-blue/10 to-brand-blue/5',
    border: 'border-brand-blue/20',
    icon: 'text-brand-blue',
    accent: 'bg-brand-blue',
  },
  green: {
    bg: 'from-green-500/10 to-green-600/5',
    border: 'border-green-400/20',
    icon: 'text-green-400',
    accent: 'bg-green-500',
  },
  gold: {
    bg: 'from-yellow-500/10 to-yellow-600/5',
    border: 'border-yellow-400/20',
    icon: 'text-yellow-400',
    accent: 'bg-yellow-500',
  },
  red: {
    bg: 'from-red-500/10 to-red-600/5',
    border: 'border-red-400/20',
    icon: 'text-red-400',
    accent: 'bg-red-500',
  },
};

export default function Testimonials() {
  return (
    <section className="py-24 relative">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-orange mb-6"
          >
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
            What Our Customers Say
          </motion.span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Happy Customers
          </h2>

          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Join hundreds of satisfied customers who trust us for their roofing needs.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative premium-card p-8 rounded-2xl bg-gradient-to-br ${accentColors[testimonial.accentColor].bg} ${accentColors[testimonial.accentColor].border}`}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className={`w-10 h-10 ${accentColors[testimonial.accentColor].icon}`} />
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  <p className="text-slate-500 text-xs">{testimonial.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${accentColors[testimonial.accentColor].accent}`} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 transition-all hover:scale-105">
            Read More Reviews
          </button>
        </motion.div>
      </div>
    </section>
  );
}

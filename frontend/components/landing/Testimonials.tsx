'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    name: string;
    role: string;
    company: string;
    quote: string;
    rating: number;
    accentColor: 'green' | 'gold' | 'red';
}

const testimonials: Testimonial[] = [
    {
        name: 'Kwame Asante',
        role: 'CEO',
        company: 'Asante Roofing Ltd.',
        quote: 'RoofManager transformed how we handle estimates. We close 40% more jobs now. The AI-powered features are incredible for our Ghanaian market.',
        rating: 5,
        accentColor: 'green',
    },
    {
        name: 'Adaeze Okafor',
        role: 'Operations Manager',
        company: 'Summit Roofers Ghana',
        quote: 'The scheduling feature alone saves us 10+ hours every week. Our team in Accra is now more efficient than ever before.',
        rating: 5,
        accentColor: 'gold',
    },
    {
        name: 'Emmanuel Mensah',
        role: 'Founder',
        company: 'Premier Construction',
        quote: 'Finally, software built for roofers by people who understand the trade. The localization for Ghanaian contractors is spot on.',
        rating: 5,
        accentColor: 'red',
    },
];

const accentColors = {
    green: {
        bg: 'from-green-500/10 to-green-600/5',
        border: 'border-green-400/20',
        icon: 'text-green-400',
        accent: 'bg-ghana-green',
    },
    gold: {
        bg: 'from-yellow-500/10 to-yellow-600/5',
        border: 'border-yellow-400/20',
        icon: 'text-yellow-400',
        accent: 'bg-ghana-gold',
    },
    red: {
        bg: 'from-red-500/10 to-red-600/5',
        border: 'border-red-400/20',
        icon: 'text-red-400',
        accent: 'bg-ghana-red',
    },
};

export default function Testimonials() {
    return (
        <section className="py-24 relative">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ghana-green/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ghana-gold/10 rounded-full blur-3xl" />
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-ghana-gold mb-6"
                    >
                        <span className="w-2 h-2 bg-ghana-gold rounded-full animate-pulse" />
                        Trusted by Ghanaian Contractors
                    </motion.span>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        What Our Customers Say
                    </h2>

                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Join hundreds of roofing professionals across Ghana who trust RoofManager to grow their businesses.
                    </p>
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => {
                        const colors = accentColors[testimonial.accentColor];
                        
                        return (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="group relative premium-card"
                            >
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                                
                                {/* Quote icon */}
                                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-xl glass flex items-center justify-center ${
                                    testimonial.accentColor === 'green' ? 'bg-ghana-green/20' :
                                    testimonial.accentColor === 'gold' ? 'bg-ghana-gold/20' :
                                    'bg-ghana-red/20'
                                }`}>
                                    <Quote className={`w-5 h-5 ${
                                        testimonial.accentColor === 'green' ? 'text-ghana-green' :
                                        testimonial.accentColor === 'gold' ? 'text-ghana-gold' :
                                        'text-ghana-red'
                                    }`} />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-white/80 leading-relaxed mb-6 italic relative z-10">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 relative z-10">
                                    {/* Avatar placeholder */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                        testimonial.accentColor === 'green' ? 'bg-ghana-green' :
                                        testimonial.accentColor === 'gold' ? 'bg-ghana-gold' :
                                        'bg-ghana-red'
                                    }`}>
                                        {testimonial.name.charAt(0)}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-white">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-white/60">
                                            {testimonial.role}, {testimonial.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative accent */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${
                                    testimonial.accentColor === 'green' ? 'bg-gradient-to-r from-ghana-green/50 to-transparent' :
                                    testimonial.accentColor === 'gold' ? 'bg-gradient-to-r from-ghana-gold/50 to-transparent' :
                                    'bg-gradient-to-r from-ghana-red/50 to-transparent'
                                }`} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

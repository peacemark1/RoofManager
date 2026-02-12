'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface LandingCTAProps {
    title?: string;
    description?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
}

const defaultProps = {
    title: 'Ready to Transform Your Roofing Business?',
    description: 'Join hundreds of Ghanaian contractors who trust RoofManager to streamline their operations and boost profits.',
    primaryCTA: 'Start Free Trial',
    secondaryCTA: 'Schedule Demo',
};

export default function LandingCTA({
    title = defaultProps.title,
    description = defaultProps.description,
    primaryCTA = defaultProps.primaryCTA,
    secondaryCTA = defaultProps.secondaryCTA,
}: LandingCTAProps) {
    const benefits = [
        'AI-Powered Estimating',
        'Smart Scheduling',
        'Lead Management',
        'Real-time Analytics',
        'Mobile App Access',
        'Ghanaian Payment Integration',
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10">
                {/* Ghana flag gradient wave */}
                <div className="absolute inset-0 bg-gradient-to-br from-ghana-red/10 via-transparent to-ghana-green/10" />

                {/* Animated aurora effect */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-ghana-green/20 via-ghana-gold/20 to-ghana-red/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-ghana-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-ghana-green/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="premium-card p-8 md:p-12 relative overflow-hidden"
                >
                    {/* Ghana flag accent */}
                    <div className="absolute top-0 left-0 right-0 h-1">
                        <div className="h-full w-1/3 bg-ghana-red" />
                        <div className="absolute top-0 left-1/3 h-full w-1/3 bg-ghana-gold" />
                        <div className="absolute top-0 left-2/3 h-full w-1/3 bg-ghana-green" />
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
                                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                                >
                                    {title}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-white/70 text-lg mb-8"
                                >
                                    {description}
                                </motion.p>

                                {/* Benefits list */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="grid grid-cols-2 gap-3 mb-8"
                                >
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={benefit}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                                            className="flex items-center gap-2 text-white/60"
                                        >
                                            <CheckCircle className="w-4 h-4 text-ghana-green" />
                                            <span className="text-sm">{benefit}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* CTA buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <Link href="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 px-8 py-4 premium-button-primary"
                                        >
                                            {primaryCTA}
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </Link>

                                    <Link href="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 px-8 py-4 premium-button-secondary"
                                        >
                                            {secondaryCTA}
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Visual element */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="hidden md:block"
                            >
                                <div className="relative">
                                    {/* Decorative elements */}
                                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-ghana-gold/20 rounded-full blur-2xl" />
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-ghana-green/20 rounded-full blur-2xl" />

                                    {/* Main visual */}
                                    <div className="relative glass-gold rounded-2xl p-8">
                                        <div className="space-y-6">
                                            {/* Stat cards */}
                                            {[
                                                { label: 'Time Saved', value: '10+ hrs/week', color: 'green' },
                                                { label: 'Revenue Increase', value: '40%', color: 'gold' },
                                                { label: 'Faster Quotes', value: '5x', color: 'red' },
                                            ].map((stat, index) => (
                                                <motion.div
                                                    key={stat.label}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                                                    className="glass rounded-xl p-4"
                                                >
                                                    <div className="text-sm text-white/60 mb-1">{stat.label}</div>
                                                    <div className={`text-2xl font-bold ${
                                                        stat.color === 'green' ? 'text-ghana-green' :
                                                        stat.color === 'gold' ? 'text-ghana-gold' :
                                                        'text-ghana-red'
                                                    }`}>{stat.value}</div>
                                                </motion.div>
                                            ))}
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

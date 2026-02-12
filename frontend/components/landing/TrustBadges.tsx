'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Users, Star, CheckCircle, MapPin } from 'lucide-react';

interface TrustBadge {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    bgColor: string;
}

const trustBadges: TrustBadge[] = [
    {
        icon: <Users className="w-8 h-8" />,
        label: 'Active Users',
        value: '500+',
        color: 'text-ghana-green',
        bgColor: 'bg-ghana-green/20',
    },
    {
        icon: <MapPin className="w-8 h-8" />,
        label: 'Cities Covered',
        value: '25+',
        color: 'text-ghana-gold',
        bgColor: 'bg-ghana-gold/20',
    },
    {
        icon: <Award className="w-8 h-8" />,
        label: 'Years Experience',
        value: '10+',
        color: 'text-ghana-red',
        bgColor: 'bg-ghana-red/20',
    },
    {
        icon: <Star className="w-8 h-8" />,
        label: 'Customer Rating',
        value: '4.9',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/20',
    },
];

const guarantees = [
    { text: 'No credit card required', icon: <Shield className="w-4 h-4" /> },
    { text: '14-day free trial', icon: <CheckCircle className="w-4 h-4" /> },
    { text: 'Cancel anytime', icon: <CheckCircle className="w-4 h-4" /> },
    { text: '24/7 Support', icon: <Users className="w-4 h-4" /> },
];

export default function TrustBadges() {
    return (
        <section className="py-16 relative">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-ghana-green/5 via-ghana-gold/5 to-ghana-red/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {trustBadges.map((badge, index) => (
                        <motion.div
                            key={badge.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative premium-card text-center cursor-default"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${badge.bgColor} ${badge.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {badge.icon}
                            </div>

                            <div className="text-3xl font-bold text-white mb-1">
                                {badge.value}
                            </div>

                            <div className="text-sm text-white/60">
                                {badge.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust guarantees */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-8"
                >
                    {guarantees.map((guarantee, index) => (
                        <motion.div
                            key={guarantee.text}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                            className="flex items-center gap-2 text-white/70"
                        >
                            <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-ghana-green">
                                {guarantee.icon}
                            </div>
                            <span className="text-sm font-medium">{guarantee.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

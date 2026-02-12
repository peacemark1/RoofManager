'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    index: number;
    accentColor?: 'red' | 'gold' | 'green' | 'blue';
}

const accentColors = {
    red: {
        bg: 'from-red-500/10 to-red-600/5',
        border: 'border-red-400/20',
        icon: 'text-red-400',
        glow: 'shadow-red-500/20',
    },
    gold: {
        bg: 'from-yellow-500/10 to-yellow-600/5',
        border: 'border-yellow-400/20',
        icon: 'text-yellow-400',
        glow: 'shadow-yellow-500/20',
    },
    green: {
        bg: 'from-green-500/10 to-green-600/5',
        border: 'border-green-400/20',
        icon: 'text-green-400',
        glow: 'shadow-green-500/20',
    },
    blue: {
        bg: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-400/20',
        icon: 'text-blue-400',
        glow: 'shadow-blue-500/20',
    },
};

export default function FeatureCard({
    title,
    description,
    icon: Icon,
    index,
    accentColor = 'green'
}: FeatureCardProps) {
    const colors = accentColors[accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative premium-card cursor-pointer overflow-hidden"
        >
            {/* Accent gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Animated border glow */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                <div className={`absolute inset-0 rounded-2xl border ${colors.border} transition-all duration-500`} />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Icon container */}
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-2xl glass flex items-center justify-center mb-5 ${colors.icon}`}
                >
                    <Icon className="w-7 h-7" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {description}
                </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Kente pattern accent (subtle) */}
            <div className="absolute top-0 right-0 w-20 h-1 bg-gradient-to-l from-ghana-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Arrow indicator */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute bottom-6 right-6 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </motion.div>
        </motion.div>
    );
}

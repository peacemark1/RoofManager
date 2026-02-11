'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FloatingCard from '@/components/ar/FloatingCard';
import MediaPanel from '@/components/ar/MediaPanel';
import {
    Shield,
    Zap,
    Calendar,
    Users,
    BarChart,
    Smartphone,
    Star,
    ArrowRight,
    CheckCircle,
    Play
} from 'lucide-react';

export default function HomePage() {
    const features = [
        {
            title: 'AI Estimation',
            description: 'Generate accurate, professional quotes in minutes using our AI-driven estimation engine. Reduce human error and close more deals.',
            icon: Zap,
        },
        {
            title: 'Smart Scheduling',
            description: 'Optimize your crew assignments and job timelines with automated, real-time scheduling. Keep everyone in sync and on time.',
            icon: Calendar,
        },
        {
            title: 'Lead Pipeline',
            description: 'Track every lead from initial contact to final payment. Integrated CRM designed specifically for roofers.',
            icon: Users,
        },
        {
            title: 'Business Analytics',
            description: 'Get deep insights into your business performance, revenue trends, and profit margins.',
            icon: BarChart,
        },
        {
            title: 'Mobile App',
            description: 'Manage your business on the go. Access all features, upload site photos, and get signatures from any device.',
            icon: Smartphone,
        },
        {
            title: 'Secure & Scalable',
            description: 'Enterprise-grade security and multi-tenant architecture. Your data is protected as your business scales.',
            icon: Shield,
        },
    ];

    const testimonials = [
        {
            name: 'Michael Rodriguez',
            role: 'Owner, Rodriguez Roofing',
            quote: 'RoofManager transformed how we handle estimates. We close 40% more jobs now.',
            rating: 5,
        },
        {
            name: 'Sarah Johnson',
            role: 'Operations Manager, Summit Roofers',
            quote: 'The scheduling feature alone saves us 10+ hours every week. Incredible tool.',
            rating: 5,
        },
        {
            name: 'David Chen',
            role: 'Founder, Chen Construction',
            quote: 'Finally, software built for roofers by people who understand the trade.',
            rating: 5,
        },
    ];

    const showcaseItems = [
        {
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1632781293329-12960b6817a8?w=800&q=80',
            alt: 'Roofing project visualization',
            caption: 'AI-Powered 3D Roof Visualization',
        },
        {
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            alt: 'Team collaboration',
            caption: 'Real-time Team Collaboration',
        },
        {
            type: 'image' as const,
            src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
            alt: 'Completed roofing job',
            caption: 'Professional Results Every Time',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen cinematic-bg">
            {/* Navigation */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="px-4 lg:px-8 h-16 flex items-center glass sticky top-0 z-50"
            >
                <Link className="flex items-center justify-center" href="/">
                    <Shield className="h-7 w-7 text-blue-400 mr-2" />
                    <span className="font-bold text-xl tracking-tight text-white">RoofManager</span>
                </Link>
                <nav className="ml-auto flex gap-6 items-center">
                    <Link className="text-sm font-medium text-white/80 hover:text-white transition-colors" href="/login">
                        Login
                    </Link>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </nav>
            </motion.header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        />
                    </div>

                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-center text-center space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/90 mb-4"
                            >
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Now with AI-Powered Estimating
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight"
                            >
                                <span className="text-white drop-shadow-lg">Roofing Management</span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                    Reimagined
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mx-auto max-w-[800px] text-lg md:text-xl text-white/70 leading-relaxed"
                            >
                                The all-in-one platform for estimating, scheduling, and scaling your roofing business.
                                Streamline operations and boost your profits starting today.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-wrap items-center justify-center gap-4"
                            >
                                <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0">
                                    <Link href="/register">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild size="lg" className="px-8 py-6 text-lg glass text-white border-white/30 hover:bg-white/10">
                                    <Link href="/login">
                                        <Play className="mr-2 h-5 w-5" />
                                        Watch Demo
                                    </Link>
                                </Button>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex items-center gap-8 mt-12 text-white/50"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-sm">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-sm">14-day free trial</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-sm">Cancel anytime</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Media Showcase Section */}
                <section className="py-24 px-4 relative">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                See RoofManager in Action
                            </h2>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                Experience the power of modern roofing management with our immersive interface.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {showcaseItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <MediaPanel
                                        type={item.type}
                                        src={item.src}
                                        alt={item.alt}
                                        caption={item.caption}
                                        parallaxIntensity={30}
                                        className="aspect-video"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-4 relative">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Everything you need to scale
                            </h2>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                Our comprehensive suite of tools helps you manage every aspect of your business from any device.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <FloatingCard
                                        title={feature.title}
                                        description={feature.description}
                                        icon={feature.icon}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 px-4 relative">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Trusted by Professionals
                            </h2>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto">
                                Join hundreds of professional roofing contractors who trust RoofManager.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <FloatingCard
                                        title={testimonial.name}
                                        description={testimonial.quote}
                                        icon={Star}
                                    />
                                    <div className="mt-4 text-center">
                                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50" />
                    <div className="absolute inset-0 aurora-glow opacity-20" />

                    <div className="container mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Ready to transform your business?
                            </h2>
                            <p className="text-white/70 text-lg max-w-600px mb-10">
                                Join hundreds of professional roofing contractors who trust RoofManager to power their growth.
                            </p>
                            <Button asChild size="lg" className="px-10 py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0">
                                <Link href="/register">Get Started Free</Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 px-4 glass mt-auto">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/50">© 2026 RoofManager Inc. All rights reserved.</p>
                    <nav className="flex gap-6">
                        <Link className="text-sm text-white/50 hover:text-white transition-colors" href="#">
                            Terms of Service
                        </Link>
                        <Link className="text-sm text-white/50 hover:text-white transition-colors" href="#">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

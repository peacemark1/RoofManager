import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Calendar, Users, BarChart, Smartphone } from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <Shield className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="font-bold text-xl tracking-tight">RoofManager</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Login
                    </Link>
                    <Button asChild size="sm">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-slate-50 border-b">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                    Roofing Management <span className="text-blue-600 font-black">AI-Powered</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400">
                                    The all-in-one platform for estimating, scheduling, and scaling your roofing business.
                                    Streamline operations and boost your profits starting today.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button asChild size="lg" className="px-8 shadow-lg shadow-blue-200">
                                    <Link href="/register">Start Free Trial</Link>
                                </Button>
                                <Button variant="outline" asChild size="lg" className="px-8">
                                    <Link href="/login">Book a Demo</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to scale</h2>
                                <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-400">
                                    Our comprehensive suite of tools helps you manage every aspect of your business from any device.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="hover:shadow-xl transition-all duration-300 border-slate-100">
                                <CardHeader>
                                    <Zap className="h-10 w-10 text-blue-600 mb-2 p-2 bg-blue-50 rounded-lg" />
                                    <CardTitle>AI Estimation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Generate accurate, professional quotes in minutes using our AI-driven estimation engine. Reduce human error and close more deals.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-xl transition-all duration-300 border-slate-100">
                                <CardHeader>
                                    <Calendar className="h-10 w-10 text-blue-600 mb-2 p-2 bg-blue-50 rounded-lg" />
                                    <CardTitle>Smart Scheduling</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Optimize your crew assignments and job timelines with automated, real-time scheduling. Keep everyone in sync and on time.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-xl transition-all duration-300 border-slate-100">
                                <CardHeader>
                                    <Users className="h-10 w-10 text-blue-600 mb-2 p-2 bg-blue-50 rounded-lg" />
                                    <CardTitle>Lead Pipeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Never lose a customer. Track every lead from initial contact to final payment. Integrated CRM designed specifically for roofers.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-xl transition-all duration-300 border-slate-100">
                                <CardHeader>
                                    <BarChart className="h-10 w-10 text-blue-600 mb-2 p-2 bg-blue-50 rounded-lg" />
                                    <CardTitle>Business Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Get deep insights into your business performance, revenue trends, and profit margins. Data-driven decisions for maximum growth.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-xl transition-all duration-300 border-slate-100">
                                <CardHeader>
                                    <Smartphone className="h-10 w-10 text-blue-600 mb-2 p-2 bg-blue-50 rounded-lg" />
                                    <CardTitle>Mobile App</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Manage your business on the go. Access all features, upload site photos, and get signatures from any smartphone or tablet.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-xl transition-all duration-300 border-slate-100">
                                <CardHeader>
                                    <Shield className="h-10 w-10 text-blue-600 mb-2 p-2 bg-blue-50 rounded-lg" />
                                    <CardTitle>Secure & Scalable</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Enterprise-grade security and multi-tenant architecture. Your data is protected as your business scales from one crew to many.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600 opacity-10 pointer-events-none"></div>
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to transform your business?</h2>
                                <p className="max-w-[600px] text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Join hundreds of professional roofing contractors who trust RoofManager to power their growth.
                                </p>
                            </div>
                            <Button asChild size="lg" variant="secondary" className="px-10 font-bold bg-white text-slate-900 hover:bg-slate-100 border-none transition-all duration-300 scale-100 hover:scale-105">
                                <Link href="/register">Get Started Free</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-slate-50/50">
                <p className="text-xs text-slate-500">© 2026 RoofManager Inc. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:text-blue-600 underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:text-blue-600 underline-offset-4" href="#">
                        Privacy Policy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
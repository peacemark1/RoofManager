'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'How long does it take to set up RoofManager?',
      answer: 'Most roofing companies are up and running within 30 minutes. Simply sign up, add your company details, and start creating estimates. Our guided setup wizard will walk you through everything.'
    },
    {
      question: 'Can I try RoofManager for free?',
      answer: 'Yes! All plans include a 14-day free trial with full access to all features. No credit card required to start your trial.'
    },
    {
      question: 'What payment methods can I accept?',
      answer: 'RoofManager integrates with PayStack and Stripe, allowing you to accept credit cards, debit cards, bank transfers, and mobile money. All payments are processed securely.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption (AES-256) to protect your data. All data is backed up daily and stored in secure, SOC 2 compliant data centers.'
    },
    {
      question: 'Can I use RoofManager on mobile?',
      answer: 'Yes! RoofManager is fully responsive and works great on smartphones and tablets. We also have native iOS and Android apps with offline capabilities for field work.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
          linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                RoofManager
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-sky-400 transition-colors text-sm font-medium">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-sky-400 transition-colors text-sm font-medium">Pricing</a>
              <a href="#faq" className="text-slate-300 hover:text-sky-400 transition-colors text-sm font-medium">FAQ</a>
              <a href="#contact" className="text-slate-300 hover:text-sky-400 transition-colors text-sm font-medium">Contact</a>
            </div>
            
            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="#" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Sign In</Link>
              <Link href="#" className="px-5 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-sky-400/25 transition-all">
                Get Started
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              aria-label="Mobile menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-slate-300 hover:text-sky-400 transition-colors">Features</a>
              <a href="#pricing" className="block text-slate-300 hover:text-sky-400 transition-colors">Pricing</a>
              <a href="#faq" className="block text-slate-300 hover:text-sky-400 transition-colors">FAQ</a>
              <a href="#contact" className="block text-slate-300 hover:text-sky-400 transition-colors">Contact</a>
              <div className="pt-3 border-t border-slate-700/50 space-y-2">
                <Link href="#" className="block text-slate-300 hover:text-white transition-colors">Sign In</Link>
                <Link href="#" className="block w-full py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-lg font-medium text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-full mb-6 animate-fade-in-up">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-ping"></span>
                <span className="text-slate-300 text-sm">Now with AI-Powered Estimates</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
                <span className="text-white">Manage Your</span><br />
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">Roofing Business</span><br />
                <span className="text-white">Like Never Before</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                Streamline operations, impress clients, and grow your revenue with the all-in-one platform designed specifically for roofing professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
                <Link href="#" className="px-8 py-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-sky-400/25 transition-all flex items-center justify-center gap-2">
                  Start Free Trial
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="#" className="px-8 py-4 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 text-white rounded-xl font-semibold text-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-slate-500 text-sm">Roofing Companies</div>
                </div>
                <div className="w-px h-12 bg-slate-700"></div>
                <div>
                  <div className="text-3xl font-bold text-white">$50M+</div>
                  <div className="text-slate-500 text-sm">Estimates Generated</div>
                </div>
                <div className="w-px h-12 bg-slate-700"></div>
                <div>
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-slate-500 text-sm">Customer Satisfaction</div>
                </div>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="relative animate-float">
              {/* Dashboard Container */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-sky-400/10 border border-slate-700/50">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>John&#39;s Roofing LLC</span>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* Metric Cards */}
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-green-400 text-xs">+12%</span>
                    </div>
                    <div className="text-xl font-bold text-white">$24,500</div>
                    <div className="text-slate-500 text-xs">Revenue</div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sky-400 text-xs">+5</span>
                    </div>
                    <div className="text-xl font-bold text-white">12</div>
                    <div className="text-slate-500 text-xs">Active Jobs</div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <svg className="text-purple-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-green-400 text-xs">+3</span>
                    </div>
                    <div className="text-xl font-bold text-white">48</div>
                    <div className="text-slate-500 text-xs">Leads</div>
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300 text-sm font-medium">Revenue Overview</span>
                    <select className="bg-slate-700 text-slate-300 text-xs rounded px-2 py-1" aria-label="Time period">
                      <option>This Month</option>
                    </select>
                  </div>
                  {/* Fake Chart */}
                  <div className="flex items-end gap-2 h-24">
                    <div className="flex-1 bg-sky-400/30 rounded-t" style={{ height: '40%' }}></div>
                    <div className="flex-1 bg-sky-400/40 rounded-t" style={{ height: '55%' }}></div>
                    <div className="flex-1 bg-sky-400/50 rounded-t" style={{ height: '45%' }}></div>
                    <div className="flex-1 bg-indigo-500/50 rounded-t" style={{ height: '70%' }}></div>
                    <div className="flex-1 bg-indigo-500/60 rounded-t" style={{ height: '60%' }}></div>
                    <div className="flex-1 bg-sky-400/60 rounded-t" style={{ height: '85%' }}></div>
                    <div className="flex-1 bg-sky-400/70 rounded-t" style={{ height: '75%' }}></div>
                  </div>
                </div>
                
                {/* Jobs List */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-2">
                    <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                      <svg className="text-green-400 text-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Smith Residence</div>
                      <div className="text-slate-500 text-xs">Roof Replacement • $8,500</div>
                    </div>
                    <span className="text-slate-400 text-xs">In Progress</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-2">
                    <div className="w-8 h-8 rounded bg-sky-400/20 flex items-center justify-center">
                      <svg className="text-sky-400 text-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Johnson Estate</div>
                      <div className="text-slate-500 text-xs">Repair Job • $2,200</div>
                    </div>
                    <span className="text-slate-400 text-xs">Scheduled</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-slate-900/60 backdrop-blur-xl rounded-xl p-3 shadow-xl shadow-indigo-500/10 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-white text-sm font-medium">New Lead!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-slate-900/60 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <svg className="text-green-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-white text-sm font-medium">Estimate Sent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof / Trust Badges */}
      <section className="py-12 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm mb-8">Trusted by leading roofing companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {/* Company Logos */}
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold">RoofPro</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold">SummitRoof</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              <span className="font-semibold">ApexRoofing</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-semibold">GuardianRoof</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-semibold">RoyalRoofs</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-full mb-4">
              <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sky-400 text-sm font-medium">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Everything You Need to</span><br />
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Run Your Business</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Powerful tools designed specifically for roofing contractors to save time, reduce paperwork, and increase profits.
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Large Feature Card 1 */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-sky-400/30 hover:shadow-xl hover:shadow-sky-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mb-4">
                <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Estimates</h3>
              <p className="text-slate-400 mb-4">Generate professional estimates in minutes with our AI-powered calculator. Includes material costs, labor, and overhead.</p>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-3 text-sm">
                  <svg className="text-green-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">Instant calculations</span>
                </div>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <svg className="text-green-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">Export to PDF</span>
                </div>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <svg className="text-green-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-300">Email directly to clients</span>
                </div>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-400/30 hover:shadow-xl hover:shadow-indigo-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Job Scheduling</h3>
              <p className="text-slate-400 mb-4">Drag-and-drop scheduling with crew management and automatic reminders.</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-sky-400/20 text-sky-400 text-xs rounded">Calendar</span>
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded">Crews</span>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-400/30 hover:shadow-xl hover:shadow-green-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Invoicing</h3>
              <p className="text-slate-400 mb-4">Create and send invoices with one click. Accept payments online.</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">PayStack</span>
                <span className="px-2 py-1 bg-sky-400/20 text-sky-400 text-xs rounded">Stripe</span>
              </div>
            </div>
            
            {/* Feature Card 4 */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-orange-400/30 hover:shadow-xl hover:shadow-orange-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0">
                  <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Customer Portal</h3>
                  <p className="text-slate-400 mb-4">Give your clients a dedicated portal to view quotes, approve jobs, make payments, and track progress in real-time.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <svg className="text-sky-400 mb-1" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <div className="text-white text-sm font-medium">Live Updates</div>
                      <div className="text-slate-500 text-xs">Real-time notifications</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <svg className="text-green-400 mb-1" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="text-white text-sm font-medium">Secure Access</div>
                      <div className="text-slate-500 text-xs">Token-based links</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature Card 5 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-pink-400/30 hover:shadow-xl hover:shadow-pink-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-4">
                <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
              <p className="text-slate-400 mb-4">Track revenue, jobs, and customer satisfaction with beautiful dashboards.</p>
              <div className="h-16 bg-slate-800/50 rounded-lg flex items-end gap-1 p-2">
                <div className="flex-1 bg-sky-400/50 rounded-t" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-sky-400/50 rounded-t" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-indigo-500/50 rounded-t" style={{ height: '50%' }}></div>
                <div className="flex-1 bg-indigo-500/50 rounded-t" style={{ height: '90%' }}></div>
                <div className="flex-1 bg-sky-400/50 rounded-t" style={{ height: '70%' }}></div>
              </div>
            </div>
            
            {/* Feature Card 6 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mb-4">
                <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">SMS Notifications</h3>
              <p className="text-slate-400 mb-4">Automated SMS updates for appointments, payments, and job completions.</p>
              <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300">
                &ldquo;Your roof replacement is scheduled for...&rdquo;
              </div>
            </div>
            
            {/* Feature Card 7 */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-violet-400/30 hover:shadow-xl hover:shadow-violet-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                  <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Material Tracking</h3>
                  <p className="text-slate-400">Manage inventory and track material costs per job.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">156</div>
                  <div className="text-slate-500 text-xs">Items in Stock</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">$12.4k</div>
                  <div className="text-slate-500 text-xs">Material Value</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">8</div>
                  <div className="text-slate-500 text-xs">Low Stock Alerts</div>
                </div>
              </div>
            </div>
            
            {/* Feature Card 8 */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-amber-400/30 hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                  <svg className="text-white text-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Document Management</h3>
                  <p className="text-slate-400 mb-4">Store contracts, permits, and photos all in one place. Attach directly to jobs for easy access.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg">Contracts</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg">Permits</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg">Photos</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg">Insurance</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-lg">Warranties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-sky-400/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-full mb-4">
              <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sky-400 text-sm font-medium">Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Simple, Transparent</span><br />
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Pricing Plans</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-sky-400/30 hover:shadow-xl hover:shadow-sky-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <p className="text-slate-400 text-sm">Perfect for small roofing businesses</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-1">$49</div>
                <div className="text-slate-500 text-sm">per month</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-green-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Up to 10 active jobs
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-green-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Unlimited estimates
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-green-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic scheduling
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-green-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Email support
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-green-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mobile app access
                </li>
              </ul>
              
              <Link href="#" className="block w-full py-3 bg-slate-800/50 text-white text-center rounded-xl font-medium hover:bg-sky-400/20 hover:text-sky-400 transition-all">
                Start Free Trial
              </Link>
            </div>
            
            {/* Growth Plan (Featured) */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-sky-400/30 shadow-2xl shadow-sky-400/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full text-white text-sm font-medium">
                Most Popular
              </div>
              
              <div className="text-center mb-6 pt-3">
                <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                <p className="text-slate-400 text-sm">For growing roofing companies</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-1">$99</div>
                <div className="text-slate-500 text-sm">per month</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Unlimited active jobs
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  AI-powered estimates
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Advanced scheduling
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Online payments
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Customer portal
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  SMS notifications
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
              
              <Link href="#" className="block w-full py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white text-center rounded-xl font-medium hover:shadow-lg hover:shadow-sky-400/25 transition-all">
                Start Free Trial
              </Link>
            </div>
            
            {/* Scale Plan */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-400/30 hover:shadow-xl hover:shadow-indigo-400/10 transition-all duration-300 hover:-translate-y-1">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Scale</h3>
                <p className="text-slate-400 text-sm">For large roofing enterprises</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-1">Custom</div>
                <div className="text-slate-500 text-sm">Contact for pricing</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Everything in Growth
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Multi-location support
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dedicated support
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <svg className="text-indigo-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Training & onboarding
                </li>
              </ul>
              
              <Link href="#" className="block w-full py-3 bg-slate-800/50 text-white text-center rounded-xl font-medium hover:bg-indigo-500/20 hover:text-indigo-400 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-full mb-4">
              <svg className="text-sky-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sky-400 text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-white">Frequently Asked</span><br />
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-900/60 backdrop-blur-xl rounded-xl overflow-hidden border border-slate-700/50">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <svg 
                    className={`text-sky-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                    width="20" 
                    height="20" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-indigo-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl shadow-indigo-500/10 border border-slate-700/50">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Ready to Transform</span><br />
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Your Roofing Business?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join 500+ roofing companies already using RoofManager to streamline their operations and grow their business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="#" className="px-8 py-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-sky-400/25 transition-all flex items-center justify-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="#" className="px-8 py-4 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 text-white rounded-xl font-semibold text-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Demo
              </Link>
            </div>
            
            <p className="text-slate-500 text-sm">
              <svg className="inline text-green-400 mr-1" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">RoofManager</span>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                The complete roofing business management platform. Streamline operations, impress clients, and grow revenue.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Integrations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Mobile App</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">API</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Press</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Community</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Status</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 RoofManager. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                English
              </span>
              <span className="flex items-center gap-1">
                <svg className="text-green-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SOC 2 Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

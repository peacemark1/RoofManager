'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingHeaderProps {
  onGetStarted?: () => void;
}

export default function LandingHeader({ onGetStarted }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ghana-red to-ghana-red/80 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-white">
              Roof<span className="text-ghana-gold">Manager</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href.slice(1))}
                className="text-slate-300 hover:text-white font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ghana-gold transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-ghana-green/10 border border-ghana-green/30 hover:bg-ghana-green/20 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ghana-green/50"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-ghana-red to-ghana-red/80 hover:from-ghana-red/90 hover:to-ghana-red/70 transition-all hover:scale-105 shadow-lg shadow-ghana-red/25 focus:outline-none focus:ring-2 focus:ring-ghana-red/50"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-ghana-gold transition-colors focus:outline-none focus:ring-2 focus:ring-ghana-gold/50 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/98 backdrop-blur-lg border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href.slice(1))}
                  className="block w-full text-left py-3 text-slate-300 hover:text-white font-medium transition-colors border-b border-slate-800/50 focus:outline-none focus:text-ghana-gold"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <button
                  onClick={onGetStarted}
                  className="w-full py-3 rounded-lg font-medium text-white bg-ghana-green/10 border border-ghana-green/30 hover:bg-ghana-green/20 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </button>
                <button
                  onClick={onGetStarted}
                  className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-ghana-red to-ghana-red/80 hover:from-ghana-red/90 hover:to-ghana-red/70 transition-all flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface VideoHeroProps {
  videoPath?: string;
  posterPath?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  onCTAClick?: () => void;
}

export default function VideoHero({
  videoPath = '/videos/hero-video.mp4',
  posterPath = '/images/hero.svg',
  headline = 'Professional Roofing Services',
  subheadline = 'Quality craftsmanship, reliable service, and competitive pricing for all your roofing needs.',
  ctaText = 'Get Free Quote',
  onCTAClick,
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (isPlaying) {
        video.play().catch(() => {
          setHasError(true);
        });
      }
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => setHasError(true));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {!hasError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterPath}
            muted={isMuted}
            loop
            playsInline
            autoPlay
          >
            <source src={videoPath} type="video/mp4" />
          </video>
        ) : (
          // Fallback to hero image if video fails
          <div className="absolute inset-0">
            <Image
              src={posterPath}
              alt="Roofing Services"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/80 via-brand-blue/60 to-brand-orange/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>

      {/* Video Controls */}
      {!hasError && (
        <div className="absolute top-24 right-4 z-20 flex gap-2">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/20 backdrop-blur-md border border-brand-orange/30 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
            </span>
            <span className="text-sm font-medium text-white">Professional Roofing Services</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {headline}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={onCTAClick}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-brand-orange hover:bg-brand-orange/90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-brand-orange/25"
            >
              {ctaText}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={togglePlay}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Watch Our Work
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: '20+', label: 'Years Experience' },
              { value: '2500+', label: 'Roofs Installed' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

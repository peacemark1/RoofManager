'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

export interface MediaPanelProps {
  type: 'image' | 'gif' | 'video';
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  parallaxIntensity?: number;
  blurIntensity?: number;
}

export function MediaPanel({
  type,
  src,
  alt = '',
  caption,
  className = '',
  priority = false,
  parallaxIntensity = 50,
  blurIntensity = 0,
}: MediaPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [isLoading, setIsLoading] = useState(true);
  
  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxIntensity, -parallaxIntensity]
  );
  
  // Smooth entry animation using spring physics
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  const opacity = useTransform(springProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(springProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95]);
  
  // Depth of field blur effect based on scroll position
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [blurIntensity, 0, 0, blurIntensity]);
  
  // Handle loading state
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // Loading placeholder animation
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  };
  
  return (
    <motion.figure
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Parallax container */}
      <motion.div
        style={{
          y,
          opacity,
          scale,
          filter: `blur(${blur}px)`,
        }}
        className="relative w-full h-full"
      >
        {/* Media content */}
        {type === 'video' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleLoad}
            aria-label={alt}
          />
        ) : (
          <img
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            className="w-full h-full object-cover rounded-lg transition-all duration-700"
            style={{
              opacity: isLoading ? 0 : 1,
            }}
          />
        )}
        
        {/* Loading skeleton overlay */}
        {isLoading && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={shimmerVariants}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        )}
        
        {/* Glassmorphism overlay for depth */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none rounded-lg"
        />
      </motion.div>
      
      {/* Caption with glassmorphism */}
      {caption && (
        <motion.figcaption
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="px-4 py-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
            <p className="text-white text-sm font-medium drop-shadow-md">
              {caption}
            </p>
          </div>
        </motion.figcaption>
      )}
    </motion.figure>
  );
}

export default MediaPanel;

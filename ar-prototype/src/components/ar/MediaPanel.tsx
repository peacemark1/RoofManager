'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaPanelProps {
  type: 'image' | 'video' | 'gif';
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

/**
 * MediaPanel Component
 * 
 * A high-performance media display component designed for AR-style prototypes.
 * Features:
 * - Support for images, GIFs, and videos.
 * - Lazy loading using native browser support and Framer Motion's `whileInView`.
 * - Smooth entry animations (fade-in + slide-up).
 * - Parallax scrolling effect.
 * - Depth-of-field blur effect using CSS filters.
 * - Glassmorphism overlays for captions.
 */
export const MediaPanel: React.FC<MediaPanelProps> = ({
  type,
  src,
  alt,
  caption,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  
  // Parallax effect setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [10, 0, 0, 10]);

  const renderMedia = () => {
    switch (type) {
      case 'video':
        return (
          <video
            src={src}
            title={alt}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        );
      case 'gif':
      case 'image':
      default:
        return (
          <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            initial={{ filter: 'blur(10px)' }}
            animate={{ filter: isInView ? 'blur(0px)' : 'blur(10px)' }}
            transition={{ duration: 0.8 }}
          />
        );
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl",
        "aspect-video md:aspect-[21/9] lg:aspect-[3/1]",
        className
      )}
    >
      {/* Parallax Media Container */}
      <motion.div 
        style={{ y, filter: `blur(${blur}px)` }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {renderMedia()}
      </motion.div>

      {/* Glassmorphism Caption Overlay */}
      {caption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto max-w-md"
        >
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
            <p className="text-white text-lg font-medium leading-relaxed">
              {caption}
            </p>
          </div>
        </motion.div>
      )}

      {/* Depth of Field / Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </motion.div>
  );
};

export default MediaPanel;

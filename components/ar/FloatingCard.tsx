'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FloatingCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  backgroundImage?: string;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  title,
  description,
  icon: Icon,
  backgroundImage,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Transform tilt values to rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  // Parallax transforms for internal elements
  const textX = useTransform(mouseXSpring, [-0.5, 0.5], ['-10px', '10px']);
  const textY = useTransform(mouseYSpring, [-0.5, 0.5], ['-10px', '10px']);
  const iconX = useTransform(mouseXSpring, [-0.5, 0.5], ['-20px', '20px']);
  const iconY = useTransform(mouseYSpring, [-0.5, 0.5], ['-20px', '20px']);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.05 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Background Image or Gradient */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        )}
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl" />

      {/* Content */}
      <div className="relative z-20 h-full p-8 flex flex-col items-center justify-center text-center gap-4">
        <motion.div
          style={{ x: iconX, y: iconY, translateZ: 50 }}
          className="mb-4"
        >
          <Icon className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div style={{ x: textX, y: textY, translateZ: 30 }}>
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
            {title}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default FloatingCard;

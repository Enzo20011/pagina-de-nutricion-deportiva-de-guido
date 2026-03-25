'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Particle = ({ delay }: { delay: number }) => {
  const size = useMemo(() => Math.random() * 2 + 1, []);
  const initialX = useMemo(() => Math.random() * 100, []);
  const initialY = useMemo(() => Math.random() * 100, []);
  
  return (
    <motion.div
      className="absolute rounded-full bg-white opacity-10"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        opacity: [0.05, 0.15, 0.05],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

const LightOrb = ({ color, size, top, left, delay }: { color: string, size: string, top: string, left: string, delay: number }) => (
  <motion.div
    className={`absolute rounded-full blur-[120px] opacity-10 ${color}`}
    style={{
      width: size,
      height: size,
      top,
      left,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.05, 0.1, 0.05],
      x: [0, 30, 0],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

export default function AnimatedBackground() {
  const [mounted, setMounted] = React.useState(false);
  const particles = useMemo(() => Array.from({ length: 40 }), []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-[#070c14] overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-[#070c14] overflow-hidden pointer-events-none">
      {/* Dynamic Orbs */}
      <LightOrb color="bg-[#3b82f6]" size="600px" top="-10%" left="-10%" delay={0} />
      <LightOrb color="bg-[#1e40af]" size="500px" top="60%" left="70%" delay={5} />
      <LightOrb color="bg-[#3b82f6]" size="400px" top="20%" left="40%" delay={2} />
      
      {/* Floating Particles */}
      {particles.map((_, i) => (
        <Particle key={i} delay={i * 0.5} />
      ))}
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}

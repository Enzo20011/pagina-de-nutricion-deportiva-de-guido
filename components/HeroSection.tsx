"use client";

import React, { useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HeroSectionProps {
  onBookingClick?: () => void;
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const WORD = {
  hidden: { opacity: 0, y: 28, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function HeroSection({ onBookingClick = () => {} }: HeroSectionProps) {
  const titleWords = ["NUTRICIÓN", "CLÍNICA", "Y", "DEPORTIVA"];

  // Spotlight Logic
  const [mousePosition, setMousePosition] = useState({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Magnetic Button Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const handleButtonMouse = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate distance from center (max pull = 15px)
    const xPct = (mouseX / width - 0.5) * 30;
    const yPct = (mouseY / height - 0.5) * 30;
    
    x.set(xPct);
    y.set(yPct);
  };

  const resetButtonMouse = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      className="relative flex flex-col items-center justify-center min-h-[90vh] py-24 px-4 overflow-hidden bg-[#070C14] text-[#F8FAFC]"
      onMouseMove={handleMouseMove}
    >
      {/* Fondo Dinámico Elite Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Interactive Spotlight */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-screen transition-opacity duration-300"
          animate={{
            background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.12), transparent 40%)`
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        />
        
        <div className="absolute inset-0 bg-[#070C14] animate-mesh" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)' 
             }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        
        {/* Blue accent orb - restored */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#3B82F6] rounded-full blur-[160px]"
        />
        
        {/* Floating Particles (Simulated via simple divs) */}
        {[...Array(8)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               y: [0, -100 - Math.random() * 100], 
               opacity: [0, 0.4, 0],
               x: [0, (Math.random() - 0.5) * 50]
             }}
             transition={{ 
               duration: 3 + Math.random() * 4, 
               repeat: Infinity, 
               delay: Math.random() * 2 
             }}
             className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
             style={{
               left: `${10 + Math.random() * 80}%`,
               top: `${60 + Math.random() * 40}%`
             }}
           />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/25 backdrop-blur-sm"
      >
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[#3B82F6]"
        />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3B82F6]">
          Sistema Nutricional Elite · Lic. Guido Martin Operuk
        </span>
      </motion.div>

      {/* Word-by-word animated title */}
      <motion.h1
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-tight text-center flex flex-wrap justify-center gap-x-4 gap-y-1"
      >
        {titleWords.map((word, i) => (
          <motion.span key={i} variants={WORD}>
            {word}
          </motion.span>
        ))}
      </motion.h1>

      {/* Name subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className="text-xl md:text-2xl font-bold mt-6 text-center text-[#3B82F6]"
      >
        Lic. Guido Martin Operuk
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.55, ease: "easeOut" }}
        className="max-w-xl mt-5 text-base md:text-lg font-light text-center text-[#F8FAFC]/60 leading-relaxed"
      >
        Ciencia, evidencia y tecnología aplicadas a tu rendimiento y composición corporal.
      </motion.p>

      {/* Staggered badges */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.95 } } }}
        className="flex flex-wrap gap-3 mt-9 justify-center"
      >
        {["+10 años de experiencia", "Online y presencial", "Resultados reales"].map((label, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.85, y: 8 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
            }}
            whileHover={{ scale: 1.06 }}
            className="bg-[#3B82F6]/12 text-[#3B82F6] font-black px-5 py-2 rounded-full text-xs uppercase tracking-widest border border-[#3B82F6]/20 cursor-default"
          >
            {label}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA — elegant pill with shimmer and magnetic effect */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
        className="mt-10"
      >
        <motion.button
          onClick={onBookingClick}
          onMouseMove={handleButtonMouse}
          onMouseLeave={resetButtonMouse}
          style={{ x: mouseXSpring, y: mouseYSpring }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 55px rgba(59,130,246,0.55), 0 20px 50px rgba(0,0,0,0.4)",
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="relative px-8 py-3.5 rounded-full font-black uppercase tracking-[0.2em] text-sm md:text-base bg-[#3B82F6] text-[#070C14] shadow-[0_0_35px_rgba(59,130,246,0.45)] overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
        >
          {/* Automatic Shimmer loop */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-loop pointer-events-none" />
          <span className="relative z-10 block pointer-events-none">Agendar mi consulta</span>
        </motion.button>
      </motion.div>

      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070C14] to-transparent pointer-events-none" />
    </section>
  );
}

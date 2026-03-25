"use client";
import React, { MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  onBookingClick?: () => void;
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0 } },
};

const WORD = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.4) 1px, transparent 1px)`;

export default function HeroSection({ onBookingClick = () => {} }: HeroSectionProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const handleButtonMouse = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };
  const resetButtonMouse = () => { x.set(0); y.set(0); };

  return (
    <section className="relative bg-[#0a0f14] pt-24 pb-16 px-8 overflow-hidden">
      {/* Performance dot grid and Ambient glow removed for cleaner look */}

      <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}

          {/* Main title — word-by-word */}
          <motion.h1
            variants={STAGGER}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.9] text-white mb-4"
          >
            {["NUTRICIÓN", "DEPORTIVA"].map((word, i) => (
              <motion.span key={i} variants={WORD} className="block">
                {word}
              </motion.span>
            ))}
            <motion.span variants={WORD} className="block text-[#3b82f6]">
              Y CLÍNICA
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <div className="flex flex-col items-center gap-2 mb-6 px-4">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a7abb2]/40"
            >
              Ciencia aplicada al alto rendimiento
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative px-8 py-px"
            >
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#eaeef6] via-[#3b82f6] to-[#eaeef6] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-slow tracking-tight">
                Nutrición real, sin vueltas.
              </h2>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-5"
          >
            <motion.button
              onClick={onBookingClick}
              onMouseMove={handleButtonMouse}
              onMouseLeave={resetButtonMouse}
              style={{ 
                x: mouseXSpring, 
                y: mouseYSpring,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)", 
                color: "#ffffff" 
              }}
              whileHover={{ boxShadow: "0 0 30px rgba(59,130,246,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="relative px-8 py-3.5 font-bold text-[10px] tracking-[0.15em] uppercase rounded-sm overflow-hidden shadow-xl"
            >
              AGENDAR CONSULTA
            </motion.button>
          </motion.div>

        </div>

        {/* NUTRITION PHOTO */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block group"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const xPct = mouseX / rect.width - 0.5;
            const yPct = mouseY / rect.height - 0.5;
            x.set(xPct * 20);
            y.set(yPct * -20);
          }}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
          style={{
            rotateX: mouseYSpring,
            rotateY: mouseXSpring,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Removed dark gradients to satisfy user preference for a cleaner look */}
          <div 
            className="relative w-full max-w-[480px] mx-auto aspect-square rounded-sm overflow-hidden border border-[#1f262e] transition-all duration-700 group-hover:border-[#3b82f6]/30 shadow-2xl group-hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]"
            style={{ transform: "translateZ(50px)" }}
          >
             <Image 
                src="/hero_elite_nutrition_macro.png"
                alt="Nutrición"
                fill
                className="object-cover object-center hover:scale-105 transition-all duration-1000"
                priority
             />
             {/* Cleaner image presentation without scanner effect */}
          </div>
          {/* Cleaner image presentation without decorations */}
        </motion.div>
      </div>

      {/* Bottom gradient fade removed */}
    </section>
  );
}

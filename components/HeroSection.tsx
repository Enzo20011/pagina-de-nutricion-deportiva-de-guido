"use client";
import React, { MouseEvent, useState, useEffect } from "react";
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
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.4) 1px, transparent 1px)`;

export default function HeroSection({ onBookingClick = () => {} }: HeroSectionProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  const handleButtonMouse = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };
  const resetButtonMouse = () => { x.set(0); y.set(0); };

  return (
    <section className="relative bg-[#0a0f14] pt-24 pb-0 px-5 sm:px-8 overflow-hidden">
      <div className="dot-grid-overlay opacity-5" />

      <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="flex flex-col items-center text-center">
          {/* Editorial top label */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-6 bg-[#3b82f6]/60" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#3b82f6]/70">
              Lic. Guido Operuk · MP 778
            </span>
            <span className="h-px w-6 bg-[#3b82f6]/60" />
          </motion.div>

          {/* Main title — word-by-word */}
          <motion.h1
            variants={STAGGER}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.75] text-white mb-6"
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

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#a7abb2]"
          >
            Ciencia aplicada al alto rendimiento
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative px-8 py-px"
          >
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#eaeef6] via-[#3b82f6] to-[#eaeef6] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-slow tracking-tight">
              Nutrición real, sin vueltas.
            </h2>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-5 mt-8"
          >
            <motion.button
              onClick={onBookingClick}
              onMouseMove={handleButtonMouse}
              onMouseLeave={resetButtonMouse}
              aria-label="Agendar consulta nutricional con el Lic. Guido Operuk"
              style={{
                x: mouseXSpring,
                y: mouseYSpring,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#ffffff"
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(59,130,246,0.4), inset 0 0 15px rgba(255,255,255,0.2)",
                filter: "brightness(1.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative px-10 py-4 font-bold text-[12px] tracking-[0.2em] uppercase rounded-sm overflow-hidden shadow-2xl transition-all after:content-[''] after:absolute after:inset-0 after:bg-white/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity hidden md:flex items-center"
            >
              AGENDAR CONSULTA
            </motion.button>
          </motion.div>

        </div>

        {/* NUTRITION PHOTO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative mt-8 lg:mt-0 group"
          onMouseMove={(e) => {
            if (window.innerWidth < 1024) return;
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
            rotateX: isDesktop ? mouseYSpring : 0,
            rotateY: isDesktop ? mouseXSpring : 0,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[480px] mx-auto aspect-square rounded-sm overflow-hidden border border-[#1f262e] transition-all duration-700 group-hover:border-[#3b82f6]/30 shadow-2xl group-hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]"
            style={{ transform: isDesktop ? "translateZ(50px)" : "none" }}
          >
              <Image
                src="/hero_elite_nutrition_macro.png"
                alt="Plato de comida saludable - Nutrición Deportiva"
                fill
                className="object-cover object-center hover:scale-105 transition-all duration-1000"
                priority
                loading="eager"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, (max-width: 1200px) 50vw, 600px"
             />
          </div>
          {/* Gradient fade al fondo en mobile para fluir a la siguiente sección */}
          <div className="absolute -bottom-1 left-0 right-0 h-24 lg:hidden pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0a0f14, transparent)' }} />
        </motion.div>
      </div>

      {/* Separador inferior de sección */}
      <div className="relative mt-10 lg:mt-16 pb-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}

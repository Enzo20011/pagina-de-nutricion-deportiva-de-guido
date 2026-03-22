"use client";
import React from 'react';
import HeroSection from './HeroSection';
import HomeMiniSobreMi from './HomeMiniSobreMi';
import { motion, useScroll, useTransform } from 'framer-motion';
import ServiciosSection from './ServiciosSection';
import ScientificAvales from './ScientificAvales';
import CalculadoraMetabolica from './CalculadoraMetabolica';
import { useTurnero } from '@/components/TurneroContext';
import { TiltCard } from './ui/TiltCard';

export default function LandingPage() {
  const { openTurnero } = useTurnero();
  
  // Parallax for footer background
  const { scrollYProgress } = useScroll();
  const yFooterBg = useTransform(scrollYProgress, [0.8, 1], ["-20%", "20%"]);

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const }
    })
  };

  return (
    <div className="min-h-screen w-full bg-[#070C14] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#3B82F6]/20 overflow-x-hidden">
      {/* SECCIÓN INICIO / HERO */}
      <div id="inicio">
        <HeroSection onBookingClick={openTurnero} />
      </div>

      {/* MINI BIO PROFESIONAL - Mascarilla para fusionar con Hero */}
      <div className="mask-section-top">
        <HomeMiniSobreMi />
      </div>

      {/* FILOSOFÍA NUTRICIONAL */}
      <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-visible">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex-1 space-y-8"
        >
          <motion.div custom={1} variants={textRevealVariants} className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-accentBlue/10 border border-accentBlue/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accentBlue animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accentBlue">Filosofía Nutricional</span>
          </motion.div>
          
          <motion.h2 custom={2} variants={textRevealVariants} className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            La base es la <br/> <span className="text-accentBlue">Ciencia aplicada.</span>
          </motion.h2>
          
          <motion.p custom={3} variants={textRevealVariants} className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
            Cada plato es un sistema de información para tu genoma. No contamos solo calorías, optimizamos señales biológicas para alcanzar tu máximo potencial físico y mental.
          </motion.p>
          
          <motion.ul custom={4} variants={textRevealVariants} className="space-y-4 text-sm font-bold uppercase tracking-widest text-[#F8FAFC]/60">
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-accentBlue" /> Micro-nutrición personalizada</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-accentBlue" /> Bioquímica del rendimiento</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-accentBlue" /> Sostenibilidad a largo plazo</li>
          </motion.ul>
        </motion.div>
        
        <div className="flex-1 relative group w-full perspective-[1000px]">
          <div className="absolute inset-0 bg-accentBlue/20 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
          <TiltCard className="w-full">
            <div className="relative rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <img 
                src="/assets/nutrition-premium.png" 
                alt="Plato nutrición premium" 
                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </TiltCard>
        </div>
      </section>

      {/* SECCIÓN CALCULADORA - Mascarilla para fusionar con Bio */}
      <div id="calculadora" className="py-24 bg-gradient-to-b from-[#070C14] to-[#0F1A2A] relative overflow-hidden mask-section-top">
        {/* Background Tech Image */}
        <div className="absolute inset-0 -z-10 opacity-20 grayscale brightness-50">
          <img 
            src="/assets/metabolic-tech.png" 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070C14] via-transparent to-[#070C14] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-black uppercase italic text-[#3B82F6] mb-3">
              Motor <span className="text-white">Metabólico</span>
            </h3>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Cuantificá tu biología para resultados exactos</p>
          </motion.div>
          <CalculadoraMetabolica />
        </div>
      </div>

      {/* SECCIÓN SERVICIOS */}
      <div id="servicios">
        <ServiciosSection onBookingClick={openTurnero} />
      </div>

      {/* SECCIÓN AVALES CIENTÍFICOS */}
      <div className="py-12 bg-[#070C14]">
         <ScientificAvales />
      </div>

      {/* BOTÓN AGENDAR DESTACADO ANTES DEL FOOTER */}
      <section className="py-24 flex flex-col items-center justify-center relative overflow-hidden h-[600px]">
         {/* Background clinical image con Parallax */}
         <motion.div 
           style={{ y: yFooterBg }}
           className="absolute inset-x-0 -top-32 bottom-[-100px] -z-10 opacity-20 grayscale brightness-75 w-full"
         >
            <img 
               src="/assets/clinical-setup.png" 
               alt="" 
               className="w-full h-full object-cover" 
            />
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-t from-darkNavy via-darkNavy/80 to-darkNavy -z-10" />
         
         <div className="absolute inset-0 bg-[#3B82F6]/5 blur-[120px] rounded-full -translate-y-1/2" />
         <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase italic text-center mb-8 z-10 px-4">
            Empezá hoy tu camino <br/> al <span className="text-[#3B82F6]">Rendimiento Élite</span>
         </h2>
         <motion.button 
           whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59,130,246,0.6)" }}
           whileTap={{ scale: 0.95 }}
           onClick={openTurnero}
           className="relative overflow-hidden px-8 py-4 md:px-10 md:py-5 rounded-full font-black uppercase tracking-[0.2em] text-base md:text-lg bg-[#3B82F6] text-white shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10 border-4 border-white/20 transition-all cursor-pointer"
         >
            {/* Automatic Shimmer loop */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-loop pointer-events-none" />
            <span className="relative">Agendar Mi Consulta</span>
         </motion.button>
      </section>
    </div>
  );
}

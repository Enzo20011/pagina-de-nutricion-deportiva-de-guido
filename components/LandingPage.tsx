"use client";
import React from 'react';
import HeroSection from './HeroSection';
import ServiciosSection from './ServiciosSection';
import ScientificAvales from './ScientificAvales';
import CalculadoraMetabolica from './CalculadoraMetabolica';
import Testimonios from './Testimonios';
import { useTurnero } from '@/components/TurneroContext';
import { motion } from 'framer-motion';

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.4) 1px, transparent 1px)`;

export default function LandingPage() {
  const { openTurnero } = useTurnero();

  return (
    <div className="bg-[#0a0f14]">
      {/* HERO */}
      <HeroSection onBookingClick={openTurnero} />

      {/* SERVICIOS */}
      <ServiciosSection onBookingClick={openTurnero} />

      {/* CALCULADORA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0a0f14] py-8 px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{ backgroundImage: DOT_GRID, backgroundSize: "20px 20px" }} />
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
          
          <div className="max-w-2xl w-full text-center mb-6">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4 text-white"
            >
              ANÁLISIS<br />
              <span className="text-[#3b82f6]">METABÓLICO</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium text-[#a7abb2] leading-relaxed mx-auto max-w-xl"
            >
              Calculá tu gasto energético basal y total con algoritmos de precisión científica. Primer paso para un plan de nutrición inteligente.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-[1100px] relative"
          >
            <CalculadoraMetabolica />
          </motion.div>
        </div>
      </motion.section>

      {/* TESTIMONIOS */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Testimonios />
      </motion.section>

      {/* AVALES */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ScientificAvales />
      </motion.section>

      {/* FINAL CTA */}
      <section className="bg-[#0e1419] py-20 px-8 border-t border-[#1f262e] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-none mb-10 text-white">
              INICIAR<br />
              <span className="text-[#3b82f6]">TU PLAN</span>
            </h2>
            <button
              onClick={openTurnero}
              className="px-12 py-5 rounded-sm font-bold text-[13px] tracking-[0.2em] uppercase hover:shadow-[0_0_60px_rgba(59,130,246,0.35)] transition-all duration-500 shadow-xl"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#ffffff" }}
            >
              AGENDAR CONSULTA
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

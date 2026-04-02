"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './HeroSection';
import ServiciosSection from './ServiciosSection';
import { useTurnero } from '@/components/TurneroContext';
import { motion } from 'framer-motion';

const CalculadoraMetabolica = dynamic(() => import('./CalculadoraMetabolica'), { ssr: false });
const Testimonios = dynamic(() => import('./Testimonios'));
const ScientificAvales = dynamic(() => import('./ScientificAvales'));

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.4) 1px, transparent 1px)`;

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 mb-5"
    >
      <span className="text-[9px] font-black text-[#3b82f6]/40 tracking-[0.3em] tabular-nums">{number}</span>
      <span className="h-px flex-1 max-w-[32px] bg-[#3b82f6]/30" />
      <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">{label}</span>
    </motion.div>
  );
}

function SectionDivider() {
  return (
    <div className="relative py-2">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  const { openTurnero } = useTurnero();

  return (
    <div className="bg-transparent">
      {/* HERO */}
      <HeroSection onBookingClick={openTurnero} />

      <SectionDivider />

      {/* SERVICIOS */}
      <div className="px-0 sm:px-8 pt-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-0">
          <SectionLabel number="01" label="Servicios" />
        </div>
      </div>
      <ServiciosSection onBookingClick={openTurnero} />

      <SectionDivider />

      {/* CALCULADORA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#0a0f14] py-8 px-0 sm:px-8 relative overflow-hidden will-change-transform"
      >
        <div className="dot-grid-overlay opacity-10" />
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center px-5 sm:px-0">
          <SectionLabel number="02" label="Herramientas" />
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
            transition={{ delay: 0.15, duration: 0.4 }}
            className="w-full max-w-[1100px] relative"
          >
            <CalculadoraMetabolica />
          </motion.div>
        </div>
      </motion.section>

      <SectionDivider />

      {/* TESTIMONIOS */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="will-change-opacity px-0 sm:px-8 pt-4"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-0">
          <SectionLabel number="03" label="Testimonios" />
        </div>
        <Testimonios />
      </motion.section>

      <SectionDivider />

      {/* AVALES */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="will-change-transform px-0 sm:px-8 pt-4"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-0">
          <SectionLabel number="04" label="Respaldo Científico" />
        </div>
        <ScientificAvales />
      </motion.section>

      <SectionDivider />

      {/* FINAL CTA */}
      <section className="bg-[#0e1419] py-20 px-0 sm:px-8 border-t border-white/5 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none opacity-50"
          style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
        <div className="max-w-[1200px] mx-auto text-center relative z-10 px-5 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#3b82f6]/60 mb-4">Comenzá hoy</p>
            <h2 className="heading-xl text-[#212529] dark:text-white mb-10">
              Inicia tu plan
            </h2>
            <button
              onClick={openTurnero}
              className="w-full sm:w-auto px-12 py-5 bg-[#3b82f6] text-white font-black text-[11px] tracking-[0.25em] uppercase hover:bg-[#2563eb] transition-all duration-500 shadow-2xl rounded-sm"
            >
              AGENDAR CONSULTA_
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


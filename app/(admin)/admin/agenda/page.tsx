
'use client';

import React from 'react';
import { Calendar as CalendarIcon, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgendaPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-12 text-bone selection:bg-accentBlue/20 pb-20">
      <header className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 text-accentBlue font-black uppercase text-[10px] tracking-[0.4em]">
            <Sparkles className="w-4 h-4 opacity-50" /> Módulo de Programación
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
            Agenda <br />
            <span className="text-accentBlue not-italic">Elite.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mt-4">
            Gestión de tiempos y flujos de pacientes optimizada
          </p>
        </motion.div>
      </header>
      <div className="bg-cardDark/40 p-20 rounded-[5rem] border border-white/5 shadow-3xl flex flex-col items-center justify-center text-center space-y-10 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accentBlue/5 rounded-full blur-[120px]" />
        <div className="w-32 h-32 bg-darkNavy rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl group">
          <CalendarIcon className="w-16 h-16 text-accentBlue/30 group-hover:scale-110 transition-transform duration-1000" />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Módulo en <span className="text-accentBlue">Sincronización</span></h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] max-w-md mx-auto leading-relaxed">
            Estamos integrando la API de Google Calendar y Mercado Pago para automatizar tus recordatorios y cobros de señas.
          </p>
        </div>
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-darkNavy rounded-full border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-accentBlue animate-pulse">
          <Clock className="w-4 h-4" /> Lanzamiento Próximamente
        </div>
      </div>
    </div>
  );
}

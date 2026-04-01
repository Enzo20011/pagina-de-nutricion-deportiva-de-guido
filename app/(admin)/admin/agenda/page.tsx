
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const AgendaViewer = dynamic(() => import('@/components/AgendaViewer'));
import { Sparkles } from 'lucide-react';

export default function AgendaPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 text-[#eaeef6] px-4 md:px-8 bg-[#0a0f14]">
      <header className="space-y-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#3b82f6] font-label text-[10px] uppercase tracking-[0.3em] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> Gestión de Consultas
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight uppercase leading-none">
            Control de <br />
            <span className="text-[#3b82f6]">Agenda</span>
          </h1>
          <p className="text-[#a7abb2] font-label font-bold uppercase text-[9px] tracking-widest mt-4">
            Gestión centralizada de sesiones y turnos
          </p>
        </motion.div>
      </header>

      <AgendaViewer />
    </div>
  );
}


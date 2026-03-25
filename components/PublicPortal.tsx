'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  X,
  Activity,
  Heart,
  Leaf,
  FlaskConical,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TurneroInteractivo from './TurneroInteractivo';

const SCIENTIFIC_SOURCES = [
  { text: "BEDCA (2023). Tablas de composición nutricional de alimentos.", icon: Leaf },
  { text: "USDA (2023). Food Data Central.", icon: FlaskConical },
  { text: "OMS (2020). Directrices sobre ingesta de nutrientes.", icon: Heart },
  { text: "Academy of Nutrition and Dietetics (2022). Health Implications.", icon: ShieldCheck },
  { text: "Martínez-González & Sánchez-Villegas (2021). European Journal.", icon: Activity },
];

export default function LandingPage({ 
  onBookingClick, 
  isBookingOpen, 
  onCloseBooking 
}: { 
  onBookingClick: () => void;
  isBookingOpen?: boolean;
  onCloseBooking?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'reserva' | 'ciencia' | 'contacto'>('reserva');

  return (
    <div className="h-screen w-full bg-darkNavy text-white overflow-hidden flex flex-col font-sans selection:bg-accentBlue/20">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accentBlue/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] -translate-x-1/4" />
      </div>

      {/* STARK INTEGRATED NAVBAR */}
      <nav className="border-b border-white/5 py-4 px-10 flex items-center justify-between bg-darkNavy/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8 flex items-center justify-center">
             <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tighter text-white uppercase leading-none italic">Operuk<span className="text-accentBlue">.</span></span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">Portal Clinico</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {[
            { label: 'Reservar', id: 'reserva' },
            { label: 'Ciencia', id: 'ciencia' },
            { label: 'Contacto', id: 'contacto' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === item.id ? 'text-accentBlue' : 'text-white/30 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* PORTAL CORE */}
      <main className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'reserva' && (
            <motion.div 
              key="reserva"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="w-full max-w-2xl bg-cardDark/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] p-10 lg:p-16 flex flex-col max-h-[90%]"
            >
              <div className="mb-10 text-center flex flex-col items-center">
                 <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                 </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none italic mb-3">
                    Agendar <span className="text-accentBlue not-italic">Turno</span>
                  </h2>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                 <TurneroInteractivo />
              </div>
            </motion.div>
          )}

          {activeTab === 'ciencia' && (
            <motion.div 
              key="ciencia"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[80vh] p-4 custom-scrollbar"
            >
              {SCIENTIFIC_SOURCES.map((source, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4 hover:border-accentBlue/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-accentBlue/20 text-accentBlue flex items-center justify-center group-hover:scale-110 transition-transform">
                    <source.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-bone/60 group-hover:text-white transition-colors">{source.text}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'contacto' && (
            <motion.div 
              key="contacto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl glass p-12 lg:p-16 rounded-[4rem] text-center space-y-12"
            >
               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Contacto <br /><span className="text-accentBlue not-italic">Directo.</span></h2>
                  <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.5em]">Soporte clínico 24/7</p>
               </div>
               <div className="flex flex-col gap-4">
                  <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="p-7 bg-white text-darkNavy font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-accentBlue hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3">
                    WhatsApp Mensaje <ArrowRight className="w-4 h-4" />
                  </a>
                  <div className="p-7 bg-white/5 border border-white/10 text-white font-black rounded-3xl uppercase tracking-widest text-[10px]">guido@operuk.com</div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="py-6 px-10 border-t border-white/5 flex justify-between items-center bg-darkNavy/50 text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
        <span>© 2026 GUIDO OPERUK</span>
        <div className="flex gap-6">
           <span className="text-accentBlue/20">Antropometría</span>
           <span className="text-accentBlue/20">Nutrición Deportiva</span>
        </div>
      </footer>
    </div>
  );
}

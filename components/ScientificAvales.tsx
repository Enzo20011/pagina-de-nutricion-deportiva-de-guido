"use client";

import { motion } from 'framer-motion';

const AVALES = ['UBA', 'BEDCA', 'USDA', 'OMS', 'ACADEMY', 'M-GONZÁLEZ', 'ISSN', 'CONICET'];

export default function ScientificAvales({ className = "" }) {
  return (
    <section
      className={`w-full max-w-6xl mx-auto flex flex-col items-center gap-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-2xl p-16 relative overflow-hidden group ${className}`}
      role="region"
      aria-label="Aval científico y académico"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accentBlue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accentBlue/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="text-center space-y-12 relative z-10 w-full">
        <div className="space-y-4">
           <h5 className="text-[11px] font-black text-accentBlue uppercase tracking-[0.6em] animate-pulse">
             Protocolos de Precisión
           </h5>
           <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
             Respaldo Científico <span className="text-accentBlue">&</span> Académico
           </h2>
        </div>

        {/* Carrusel Infinito */}
        <div className="relative overflow-hidden w-full py-10 before:absolute before:left-0 before:top-0 before:h-full before:w-32 before:bg-gradient-to-r before:from-[#070C14] before:to-transparent before:z-20 after:absolute after:right-0 after:top-0 after:h-full after:w-32 after:bg-gradient-to-l after:from-[#070C14] after:to-transparent after:z-20">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            className="flex gap-20 w-fit items-center"
          >
            {[...AVALES, ...AVALES].map((aval, idx) => (
              <div key={`${aval}-${idx}`} className="flex flex-col items-center gap-4 cursor-default shrink-0">
                <div className="px-10 py-5 bg-darkNavy/40 rounded-2xl flex items-center justify-center border border-white/5 hover:border-accentBlue/50 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] shadow-inner group">
                  <span className="text-sm md:text-md text-slate-500 font-extrabold tracking-[0.2em] uppercase group-hover:text-white transition-colors duration-500">{aval}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

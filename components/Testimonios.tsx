'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIOS = [
  {
    nombre: 'Paula S.',
    resultado: 'Cambio de hábitos real',
    disciplina: 'Entrenamiento funcional',
    texto: 'Me cambió la cabeza. Antes probaba dietas de esas "milagrosas" y no bajaba un gramo. Con Guido aprendí a comer de verdad y los resultados se notan al toque.',
  },
  {
    nombre: 'Lucas M.',
    resultado: 'Mejora en rendimiento',
    disciplina: 'Crossfit & Gym',
    texto: 'Increíble cómo mejoré la potencia entrenando. No perdí ni un poquito de fuerza y me siento mucho más ágil. El plan es a medida, nada de fotocopias genéricas.',
  },
  {
    nombre: 'Sofía R.',
    resultado: 'Bienestar general',
    disciplina: 'Vida activa',
    texto: 'Lo mejor es que no es una dieta sufrida. Como rico, entiendo lo que hago y rindo mejor que nunca en el laburo y cuando voy a entrenar. Es otra vida, de verdad.',
  },
];

export default function Testimonios() {
  const [active, setActive] = useState(0);
  const prev = () => setActive(i => (i - 1 + TESTIMONIOS.length) % TESTIMONIOS.length);
  const next = () => setActive(i => (i + 1) % TESTIMONIOS.length);
  const t = TESTIMONIOS[active];

  return (
    <section className="bg-[#0a0f14] py-16 px-8">
      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: heading */}
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] text-white">
              RESULTADOS<br />
              <span className="text-[#3b82f6]">REALES</span>
            </h2>
          </div>

          {/* Right: testimonial card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-[#0e1419] p-8 md:p-10 relative border border-[#1f262e] rounded-sm shadow-2xl"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" 
                  style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }} />
                
                <Quote className="w-8 h-8 text-[#3b82f6]/20 mb-6" />
                <p className="text-sm md:text-base text-[#eaeef6] leading-relaxed mb-8 italic font-medium">
                  "{t.texto}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#1a2027] flex items-center justify-center border border-[#2a3040]">
                    <span className="font-bold text-sm text-[#3b82f6]">
                      {t.nombre.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#eaeef6]">{t.nombre}</p>
                    <p className="text-[10px] font-medium text-[#a7abb2]">{t.resultado} · {t.disciplina}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={prev}
                className="w-10 h-10 bg-[#1a2027] hover:bg-[#3b82f6] text-[#a7abb2] hover:text-white rounded-sm flex items-center justify-center border border-[#2a3040] transition-all duration-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIOS.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-[2px] transition-all duration-300 ${i === active ? 'w-8 bg-[#3b82f6]' : 'w-4 bg-[#2a3040]'}`} />
                ))}
              </div>
              <button onClick={next}
                className="w-10 h-10 bg-[#1a2027] hover:bg-[#3b82f6] text-[#a7abb2] hover:text-white rounded-sm flex items-center justify-center border border-[#2a3040] transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

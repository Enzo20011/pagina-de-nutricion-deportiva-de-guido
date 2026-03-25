'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin, ArrowUpRight, Award, Users, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TiltCard from './TiltCard';

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.4) 1px, transparent 1px)`;

export default function SobreMiSection({ onBookingClick = () => {} }: { onBookingClick?: () => void }) {
  return (
    <div className="bg-[#0a0f14]">
      {/* Hero */}
      <section className="relative py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: DOT_GRID, backgroundSize: "20px 20px" }} />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] text-white mb-4">
                GUIDO<br />
                <span className="text-[#3b82f6]">OPERUK</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a7abb2]/60 mb-8">
                LICENCIADO EN NUTRICIÓN · ESPECIALISTA EN RENDIMIENTO
              </p>

              <div className="border-l border-[#3b82f6]/30 pl-5 mb-8 space-y-4">
                <p className="text-sm text-[#a7abb2] leading-relaxed">
                  ¡Hola! Soy Guido Martin Operuk, Licenciado en Nutrición, con formación en nutrición deportiva. Creo en una nutrición basada en evidencia, pero también en un enfoque realista, cercano y aplicable al día a día.
                </p>
                <p className="text-sm text-[#a7abb2] leading-relaxed">
                  En este espacio comparto información clara sobre alimentación, salud y rendimiento, con herramientas prácticas para mejorar tus hábitos y construir una relación más saludable con la comida.
                </p>
                <p className="text-sm text-[#a7abb2] leading-relaxed">
                  La idea es que este perfil se convierta en una herramienta útil para acompañarte en tu proceso de cambio, tanto si buscás mejorar tu alimentación cotidiana como si entrenás y querés optimizar tu rendimiento.
                </p>
                <p className="text-sm text-[#eaeef6] font-bold italic pt-2">
                  "Pequeños cambios sostenidos en el tiempo pueden generar grandes resultados en la salud y en el bienestar."
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBookingClick}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#eaeef6] hover:bg-[#3b82f6] hover:text-white transition-all duration-300 bg-[#1a2027] border border-[#2a3040] px-6 py-3 rounded-sm shadow-xl">
                  AGENDAR CONSULTA <ArrowUpRight className="w-4 h-4" />
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(193, 53, 132, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/lic.guidooperuk/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a7abb2] hover:text-white transition-all duration-300 bg-transparent border border-[#2a3040] px-6 py-3 rounded-sm">
                  <Instagram className="w-4 h-4" /> Instagram
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative group pr-4"
            >
              <TiltCard>
                <div className="relative aspect-square md:aspect-video rounded-sm overflow-hidden w-full max-w-3xl mx-auto border border-[#1f262e] transition-all duration-700 group-hover:border-[#3b82f6]/50 shadow-2xl"
                  style={{ boxShadow: "0 0 80px rgba(59,130,246,0.08)" }}>
                  
                  <Image 
                    src="/guido.jpg"
                    alt="Lic. Guido Operuk"
                    fill
                    className="object-cover object-center transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14] via-transparent to-transparent opacity-60 z-10" />
                  
                  {/* Neon corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#3b82f6]/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#3b82f6]/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </TiltCard>
            </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0e1419] py-16 px-8 border-t border-[#1f262e]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#eaeef6] mb-2">TRABAJEMOS JUNTOS</h2>
            <p className="text-sm font-medium text-[#a7abb2]">Encontremos juntos tu mejor versión sustentable.</p>
          </div>
          <button onClick={onBookingClick}
            className="px-10 py-4 rounded-sm font-bold text-[11px] tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-shadow duration-500"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#ffffff" }}>
            AGENDAR CONSULTA
          </button>
        </div>
      </section>
    </div>
  );
}

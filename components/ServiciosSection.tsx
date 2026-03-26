'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, BarChart3, Trophy, Stethoscope, Zap, Video } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TiltCard from './TiltCard';

const services = [
  {
    icon: BarChart3,
    title: 'Plan Alimentario Personalizado',
    description: 'Nutrición de precisión ajustada a tus requerimientos específicos. Periodización nutricional adaptada a tu carga de entrenamiento.',
    tag: 'MÁS SOLICITADO',
    image: '/precision_nutrition_lab.png'
  },
  {
    icon: Dumbbell,
    title: 'Evaluación Antropométrica ISAK',
    description: 'Perfilado corporal de nivel olímpico. Método ISAK de máxima precisión para el mapeo graso y muscular.',
    tag: 'PRÓXIMAMENTE',
    image: '/scientific_metabolic_tracking.png',
    disabled: true
  },
  {
    icon: Stethoscope,
    title: 'Nutrición Clínica',
    description: 'Gestión de patologías metabólicas y salud integral. Abordaje multidisciplinario respaldado en evidencia científica.',
    tag: 'CLÍNICO',
    image: '/precision_nutrition_lab.png'
  },
  {
    icon: Zap,
    title: 'Seguimiento y Monitoreo',
    description: 'Soporte continuo y ajuste de planes en tiempo real. Métricas de progreso y análisis de adherencia.',
    tag: 'CONTINUO',
    image: '/scientific_metabolic_tracking.png'
  },
  {
    icon: Video,
    title: 'Consulta Online',
    description: 'Acceso a ciencia nutricional avanzada desde cualquier lugar. Sesiones de consultoría profesional vía videoconferencia.',
    tag: 'ONLINE',
    image: '/pro_nutrition_ingredients.png'
  },
];

type Service = { icon: any; title: string; description: string; tag: string; image: string; disabled?: boolean };

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.4) 1px, transparent 1px)`;

export default function ServiciosSection({ onBookingClick = () => {} }: { onBookingClick?: () => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#0a0f14] py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: DOT_GRID, backgroundSize: "20px 20px" }} />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] text-white hover:text-[#3b82f6] transition-colors mb-6">
              SERVICIOS DE<br />
              <span className="text-[#3b82f6]">ALTO NIVEL</span>
            </h2>
            <p className="body-text max-w-xl">
              Ciencia aplicada a cada objetivo. Planes diseñados con precisión profesional para resultados medibles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-[#0e1419] py-16 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a2027] border border-[#1f262e]">
            {(services as Service[]).map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative group h-full"
                >
                  <TiltCard className="h-full">
                    <div
                      onClick={service.disabled ? undefined : onBookingClick}
                      className={`relative bg-[#0e1419] p-8 h-full group transition-all duration-700 overflow-hidden border border-[#1f262e] ${service.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#141a20] group-hover:border-[#3b82f6]/30 cursor-pointer'}`}
                    >
                      {/* Background Image */}
                      {!service.disabled && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 scale-110 group-hover:scale-100 transition-transform duration-1000">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Top neon accent on hover */}
                      {!service.disabled && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
                          style={{ boxShadow: "0 0 20px rgba(59,130,246,0.8)" }} />
                      )}

                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-8">
                          <motion.div
                            whileHover={service.disabled ? {} : { scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 bg-[#1a2027] rounded-sm flex items-center justify-center border border-[#1f262e] group-hover:border-[#3b82f6]/40 transition-colors duration-500"
                          >
                            <Icon className={`w-5 h-5 ${service.disabled ? 'text-[#43484e]' : 'text-[#3b82f6]'}`} />
                          </motion.div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1 rounded-sm transition-colors ${service.disabled ? 'text-[#a7abb2] border-[#3b82f6]/30 bg-[#3b82f6]/5' : 'text-[#a7abb2] border-[#1f262e] group-hover:border-[#3b82f6]/20'}`}>
                            {service.tag}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold uppercase tracking-tight mb-4 leading-tight group-hover:text-white transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-[#a7abb2] font-medium leading-relaxed mb-8 flex-grow">
                          {service.description}
                        </p>

                        {!service.disabled && (
                          <button
                            onClick={onBookingClick}
                            className="flex items-center gap-2 font-bold text-[10px] tracking-[0.2em] uppercase text-[#3b82f6] group/btn hover:text-white transition-all duration-500"
                          >
                            SABER MÁS <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}

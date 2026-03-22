"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Dumbbell, Utensils, ArrowRight } from "lucide-react";
import { TiltCard } from "./ui/TiltCard";
import { SpotlightCard } from "./ui/SpotlightCard";

interface ServiciosSectionProps {
  onBookingClick?: () => void;
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function ServiciosSection({ onBookingClick = () => {} }: ServiciosSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const services = [
    {
      icon: Dumbbell,
      title: "Nutrición Deportiva",
      desc: "Optimización de rendimiento, recomposición corporal y planes personalizados para atletas y entusiastas del deporte.",
      img: "/assets/sport-tech.png",
      glow: "rgba(59,130,246,0.5)",
      badge: "Rendimiento",
    },
    {
      icon: Utensils,
      title: "Nutrición Clínica / Cotidiana",
      desc: "Mejora de hábitos, prevención y tratamiento de enfermedades, educación nutricional y acompañamiento integral.",
      img: "/assets/wellness-foods.png",
      glow: "rgba(16,185,129,0.5)",
      badge: "Salud",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center py-24 px-4 bg-gradient-to-br from-[#070C14] via-[#0F1A2A] to-[#1e293b] text-[#F8FAFC] overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -20, 0] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#3B82F6]/8 rounded-full blur-[160px]"
        />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#3B82F6]/4 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3B82F6]">Lo que ofrezco</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-black uppercase italic text-white drop-shadow-lg">
            Mis <span className="text-[#3B82F6]">Servicios</span>
          </h3>
        </motion.div>

        {/* Service cards — scroll reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="w-full relative"
            >
              <TiltCard>
                <SpotlightCard 
                  spotlightColor={service.glow}
                  className="group bg-[#0F1A2A] border border-white/15 hover:border-white/25 rounded-[2.5rem] shadow-2xl backdrop-blur-xl p-8 md:p-12 flex flex-col items-center text-center cursor-pointer overflow-hidden transition-all duration-300 h-full w-full"
                >
                  {/* Background image — always subtly visible */}
                  <div className="absolute inset-0 -z-10 opacity-[0.12] group-hover:opacity-20 transition-opacity duration-500">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
                    transition={{ duration: 0.5 }}
                    className="w-18 h-18 w-20 h-20 bg-accentBlue/10 rounded-3xl flex items-center justify-center mb-6 border border-accentBlue/20 group-hover:bg-accentBlue/20 transition-colors"
                  >
                    <service.icon className="text-[#3B82F6] w-9 h-9" />
                  </motion.div>

              {/* Badge */}
              <span className="mb-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                {service.badge}
              </span>

              <h4 className="text-2xl font-black uppercase mb-4 tracking-tight group-hover:text-accentBlue transition-colors">
                {service.title}
              </h4>
              <p className="text-[#F8FAFC]/70 text-base font-light leading-relaxed mb-8">
                {service.desc}
              </p>

              {/* Animated CTA */}
              <motion.span
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 mt-auto text-xs font-black uppercase tracking-widest text-[#3B82F6]/80 group-hover:text-white transition-colors bg-accentBlue/10 group-hover:bg-accentBlue/30 px-5 py-2.5 rounded-full border border-accentBlue/20"
              >
                Conocer más <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
                </SpotlightCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mt-16"
        >
          <motion.button
            onClick={onBookingClick}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 50px rgba(59,130,246,0.5), 0 20px 40px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="relative px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#070C14] shadow-[0_0_40px_rgba(59,130,246,0.5)] border-4 border-white/10 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative">Agendar consulta</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

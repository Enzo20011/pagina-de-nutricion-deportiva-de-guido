"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Mail, ChevronRight, Award, Users, Star } from "lucide-react";

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const ITEM = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stats = [
  { icon: Award, label: "Años de experiencia", value: "+10" },
  { icon: Users, label: "Pacientes acompañados", value: "+500" },
  { icon: Star, label: "Calificación promedio", value: "4.9★" },
];

export default function SobreMiSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center py-20 px-4 bg-[#070C14] text-[#F8FAFC] overflow-hidden"
    >
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#3B82F6]/5 rounded-full blur-[150px] -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl mx-auto bg-[#0F1A2A]/95 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-md p-10 md:p-16 flex flex-col gap-10 relative overflow-hidden group"
      >
        {/* Background image crossfade */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-1000">
          <img src="/assets/academic-office.png" alt="" className="w-full h-full object-cover grayscale brightness-50" />
        </div>

        {/* Top glint line on hover */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accentBlue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#3B82F6]">Acerca del profesional</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black uppercase italic text-white mb-1">
            Sobre <span className="text-[#3B82F6]">Mí</span>
          </h3>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">& Respaldo Científico</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={ITEM}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(59,130,246,0.15)" }}
              className="flex flex-col items-center gap-2 p-5 bg-white/[0.03] border border-white/8 rounded-2xl text-center cursor-default transition-all"
            >
              <stat.icon className="w-5 h-5 text-accentBlue" />
              <span className="text-2xl font-black text-white tracking-tighter">{stat.value}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 leading-tight">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col items-center gap-5"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.4)" }}
              transition={{ duration: 0.4 }}
              className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#3B82F6] shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              <img
                src="/assets/guido.jpg"
                alt="Guido Martin Operuk"
                className="object-cover w-full h-full brightness-110 group-hover:brightness-125 transition-all duration-700"
              />
            </motion.div>
            <span className="text-xs font-black uppercase tracking-widest text-[#3B82F6]">Lic. Guido Martin Operuk</span>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { href: "https://www.instagram.com/lic.guidooperuk/", icon: Instagram, label: "Instagram" },
                { href: "mailto:guido@email.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  whileHover={{ scale: 1.15, backgroundColor: "rgba(59,130,246,0.2)", borderColor: "rgba(59,130,246,0.4)" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-accentBlue transition-all"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex-1 text-left space-y-5"
          >
            <motion.p variants={ITEM} className="text-base md:text-lg text-[#F8FAFC]/80 font-light leading-relaxed">
              <span className="font-black text-[#3B82F6]">Filosofía:</span> Enfoque realista y aplicable. Pequeños cambios sostenidos para grandes resultados físicos.
              <span className="block mt-3">Mi misión es acompañarte con ciencia, empatía y compromiso, adaptando cada plan a tus necesidades únicas.</span>
            </motion.p>

            <motion.ul variants={STAGGER} className="space-y-3">
              {[
                "Especialista en Nutrición Clínica y Deportiva",
                "+10 años de experiencia",
                "Atención presencial y online",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={ITEM}
                  className="flex items-center gap-3 text-[#F8FAFC]/70 text-sm font-medium"
                >
                  <ChevronRight className="w-4 h-4 text-accentBlue shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={ITEM}
              whileHover={{ borderColor: "rgba(59,130,246,0.4)", backgroundColor: "rgba(59,130,246,0.12)" }}
              className="bg-[#3B82F6]/8 border border-[#3B82F6]/15 rounded-2xl p-6 transition-all duration-300"
            >
              <h5 className="text-sm font-black text-[#3B82F6] uppercase tracking-widest mb-3">Valores diferenciales</h5>
              <ul className="space-y-2">
                {[
                  "Atención 100% personalizada y humana",
                  "Actualización científica permanente",
                  "Resultados sostenibles y realistas",
                  "Empatía, escucha y acompañamiento integral",
                ].map((v, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#F8FAFC]/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accentBlue/60 shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

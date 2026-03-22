"use client";
import { Instagram, Mail, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SpotlightCard } from "./ui/SpotlightCard";

export default function HomeMiniSobreMi() {
  const { scrollYProgress } = useScroll();
  const yPic = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <SpotlightCard className="w-full max-w-5xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center gap-12 bg-cardDark/40 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl my-12 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accentBlue/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex-shrink-0 flex flex-col items-center relative z-10 w-32 md:w-40 perspective-[1000px]">
        <motion.div 
          style={{ y: yPic }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-darkNavy shadow-2xl shadow-accentBlue/20 mb-6 group-hover:scale-105 transition-transform duration-500"
        >
          <img src="/assets/guido.jpg" alt="Guido Martin Operuk" className="object-cover w-full h-full brightness-110 scale-[1.15]" />
        </motion.div>
        <span className="text-sm font-black uppercase tracking-[0.3em] text-accentBlue italic">Lic. Guido M. Operuk</span>
      </div>

      <div className="flex-1 text-center md:text-left space-y-6 relative z-10">
        <div className="space-y-2">
          <h4 className="text-xs font-black text-accentBlue uppercase tracking-[0.5em]">El Profesional Detrás</h4>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Pasión, Ciencia <br/> & Compromiso.</h3>
        </div>
        
        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl italic">
          "Mi enfoque no se basa solo en dietas, sino en sistemas de alimentación optimizados para la biología y el rendimiento humano."
        </p>
        
        <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-4 items-center">
            <div className="flex gap-4">
                <a href="https://www.instagram.com/lic.guidooperuk/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-accentBlue text-white rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-lg">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="mailto:guido@email.com" className="w-10 h-10 bg-white/5 hover:bg-accentBlue text-white rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-lg">
                    <Mail className="w-5 h-5" />
                </a>
            </div>
            <a href="/sobre-mi" className="text-[10px] font-black uppercase tracking-[0.4em] text-accentBlue hover:text-white flex items-center gap-3 transition-colors group/btn">
                Ver perfil completo <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
            </a>
        </div>
      </div>
    </SpotlightCard>
  );
}
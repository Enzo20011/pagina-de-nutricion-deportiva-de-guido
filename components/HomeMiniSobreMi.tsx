import { motion } from "framer-motion";
import { Instagram, Mail, ArrowRight } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function HomeMiniSobreMi() {
  return (
    <section className="bg-[#0a0f14] py-24 px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Photo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] rounded-sm overflow-hidden group shadow-3xl border border-white/5"
        >
          <Image 
            src="/guido_portrait_professional.png"
            alt="Lic. Guido Operuk"
            fill
            className="object-cover object-top transition-transform duration-[2s] group-hover:scale-105"
          />
          {/* Scientific Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#0a0f14] via-[#0a0f14]/80 to-transparent z-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-1">Lic. Guido M. Operuk_</p>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Antropometrista ISAK 2 · Especialista en Nutrición Deportiva</p>
          </div>
          
          {/* Subtle Frame */}
          <div className="absolute inset-4 border border-white/10 pointer-events-none z-10 group-hover:inset-6 transition-all duration-700" />
        </motion.div>

        {/* Content Side */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#3b82f6]/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#3b82f6]">Autoridad_</span>
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white italic">
              CIENCIA <br />
              <span className="text-white/20 not-italic">& RESULTADOS_</span>
            </h2>
            
            <div className="relative">
              <p className="text-lg text-[#a7abb2] font-medium leading-relaxed italic border-l-2 border-[#3b82f6] pl-8 py-2">
                "Mi enfoque transgrede la nutrición tradicional, fusionando la bioquímica deportiva con la optimización antropométrica para atletas de élite."
              </p>
              {/* Decorative Quote Mark */}
              <span className="absolute -top-4 -left-2 text-6xl font-serif text-[#3b82f6]/10 pointer-events-none">"</span>
            </div>

            <p className="text-sm text-[#a7abb2]/60 leading-relaxed max-w-lg">
              Con más de {new Date().getFullYear() - 2018} años de experiencia clínica y deportiva, he desarrollado un ecosistema de evaluación que elimina las suposiciones y se centra en los datos biológicos reales de cada paciente.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            <Link href="/sobre-mi" 
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-[#3b82f6] hover:border-[#3b82f6] transition-all duration-500 shadow-xl flex items-center gap-4 group">
              VER PERFIL COMPLETO <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/lic.guidooperuk/" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-[#a7abb2] hover:text-[#3b82f6] hover:border-[#3b82f6] transition-all duration-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:consultas@guidonutricion.com"
                className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-[#a7abb2] hover:text-[#3b82f6] hover:border-[#3b82f6] transition-all duration-500">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
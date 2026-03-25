import { motion } from "framer-motion";
import { Instagram, Mail, ArrowRight } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function HomeMiniSobreMi() {
  return (
    <section className="bg-[#0e1419] py-16 px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Photo placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square rounded-sm overflow-hidden max-w-sm border border-[#1f262e] group shadow-2xl"
          style={{ boxShadow: "0 0 60px rgba(59,130,246,0.06)" }}
        >
          <Image 
            src="/guido_portrait_professional.png"
            alt="Lic. Guido Operuk"
            fill
            className="object-cover object-top transition-all duration-700"
          />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#3b82f6]/30 z-20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#3b82f6]/30 z-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1419] via-transparent to-transparent z-10 opacity-60" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a7abb2]">LA MISIÓN</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.9] text-white mb-6">
              EVOLUCIÓN,<br />
              CIENCIA &<br />
              <span className="text-[#3b82f6]">RESULTADOS</span>
            </h2>
            <p className="text-sm text-[#a7abb2] border-l border-[#3b82f6]/30 pl-5 italic font-medium leading-relaxed">
              "Especialista en nutrición deportiva avanzada. Mi enfoque combina la bioquímica aplicada con la practicidad necesaria en el campo de entrenamiento."
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <a href="https://www.instagram.com/lic.guidooperuk/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-[#1a2027] hover:bg-[#3b82f6] text-[#a7abb2] hover:text-white rounded-sm flex items-center justify-center border border-[#2a3040] transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:guido@email.com"
              className="w-10 h-10 bg-[#1a2027] hover:bg-[#3b82f6] text-[#a7abb2] hover:text-white rounded-sm flex items-center justify-center border border-[#2a3040] transition-all duration-300">
              <Mail className="w-4 h-4" />
            </a>
            <Link href="/sobre-mi"
              className="flex items-center gap-2 font-bold text-[10px] tracking-[0.2em] uppercase text-[#3b82f6] hover:text-white transition-all group ml-4">
              PERFIL COMPLETO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
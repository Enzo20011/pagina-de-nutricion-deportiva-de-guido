'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_DISPLAY } from '@/lib/constants';

export default function ContactoSection() {
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('Nutrición Deportiva');
  const [mensaje, setMensaje] = useState('');

  const handleWhatsAppSend = () => {
    if (!nombre.trim() || !mensaje.trim()) return;
    const text = `Hola Guido! Mi nombre es ${nombre}. Mi objetivo es: ${objetivo}. %0A%0A${mensaje}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contacto" className="py-24 px-8 bg-[#0a0f14] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Info Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 text-[#3b82f6]"
              >
                <div className="h-[2px] w-12 bg-[#3b82f6]" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Conectemos_</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.85]"
              >
                ¿Listo para <br />
                <span className="text-[#3b82f6] not-italic">empezar?</span>
              </motion.h2>
            </div>

            <div className="space-y-8">
              {[
                { icon: MessageSquare, label: "WhatsApp Directo", val: PHONE_DISPLAY, href: `https://wa.me/${WHATSAPP_NUMBER}` },
                { icon: MapPin, label: "Ubicación Clínica", val: "Posadas, Misiones, Arg.", href: null },
              ].map((item, i) => {
                const inner = (
                  <>
                    <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center border border-white/5 transition-all duration-500 group-hover:bg-[#3b82f6] group-hover:border-[#3b82f6] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <item.icon className="w-5 h-5 text-[#a7abb2] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#a7abb2]/40 mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-white group-hover:text-[#3b82f6] transition-colors">{item.val}</p>
                    </div>
                  </>
                );
                return item.href ? (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-6 group hover:translate-x-2 transition-transform duration-500"
                  >
                    {inner}
                  </motion.a>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-6 group"
                  >
                    {inner}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/5 p-8 md:p-12 rounded-sm backdrop-blur-3xl shadow-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
            
            <form className="space-y-8 relative z-10" onSubmit={(e) => { e.preventDefault(); handleWhatsAppSend(); }}>
              <div className="space-y-3">
                <label htmlFor="contacto-nombre" className="text-[10px] font-black uppercase tracking-widest text-white/20 pl-4">Tu Nombre_</label>
                <input 
                  id="contacto-nombre"
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Guido O." 
                  className="w-full bg-white/5 border border-white/5 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-all placeholder:text-white/10" 
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="contacto-objetivo" className="text-[10px] font-black uppercase tracking-widest text-white/20 pl-4">Objetivo Visualizado_</label>
                <select 
                  id="contacto-objetivo"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-sm px-8 py-4 text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-[#0a0f14]">Nutrición Deportiva</option>
                  <option className="bg-[#0a0f14]">Descenso de Grasa</option>
                  <option className="bg-[#0a0f14]">Aumento de Masa Muscular</option>
                  <option className="bg-[#0a0f14]">Salud Integral</option>
                </select>
              </div>

              <div className="space-y-3">
                <label htmlFor="contacto-mensaje" className="text-[10px] font-black uppercase tracking-widest text-white/20 pl-4">Mensaje Adicional_</label>
                <textarea 
                  id="contacto-mensaje"
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntame más sobre tu meta..."
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-sm px-8 py-4 text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-all placeholder:text-white/10 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-sm text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-3 shadow-xl transition-all"
                type="submit"
              >
                ENVIAR A WHATSAPP_ <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

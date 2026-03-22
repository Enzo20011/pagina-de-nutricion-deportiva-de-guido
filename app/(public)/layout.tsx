'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TurneroInteractivo from '@/components/TurneroInteractivo';
import { TurneroProvider, useTurnero } from '@/components/TurneroContext';

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, closeTurnero, openTurnero } = useTurnero();

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar onBookingClick={openTurnero} />
      
      <main className="flex-grow bg-darkNavy text-bone">
        {children}
      </main>

      <Footer onBookingClick={openTurnero} />
      <WhatsAppButton />

      {/* GLOBAL MODAL DEL TURNERO */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTurnero}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-cardDark border border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={closeTurnero}
                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all border border-white/10 z-50"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white tracking-tighter">
                    Reserva tu <span className="text-accentBlue">Sesión.</span>
                </h2>
                <p className="text-slate-500 text-sm font-black uppercase tracking-widest mt-2">Selecciona fecha y hora para tu consulta online</p>
              </div>

              <TurneroInteractivo />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TurneroProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </TurneroProvider>
  );
}

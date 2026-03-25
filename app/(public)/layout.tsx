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
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[95vh] bg-[#0B1120]/60 border border-white/5 rounded-sm shadow-3xl p-6 md:p-10 overflow-y-auto custom-scrollbar backdrop-blur-3xl"
            >
              <button 
                onClick={closeTurnero}
                className="absolute top-4 right-4 p-3 bg-white/5 hover:bg-white hover:text-[#1B365D] rounded-sm text-white transition-all duration-500 border border-white/10 z-50 shadow-2xl group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
              
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white !mb-0">AGENDAR TURNO</h2>
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

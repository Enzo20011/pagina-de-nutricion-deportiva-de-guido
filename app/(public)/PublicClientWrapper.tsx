'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactoSection from '@/components/ContactoSection';
import TurneroInteractivo from '@/components/TurneroInteractivo';
import { TurneroProvider, useTurnero } from '@/components/TurneroContext';
import AnimatedBackground from '@/components/AnimatedBackground';

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, closeTurnero, openTurnero } = useTurnero();
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const handleScroll = () => setShowStickyCTA(window.scrollY > 420);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsDark(localStorage.getItem('theme') !== 'light');
    check();
    window.addEventListener('storage', check);
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { window.removeEventListener('storage', check); observer.disconnect(); };
  }, []);

  // En login no mostramos ningún chrome del sitio público
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#3b82f6] z-[200] origin-left"
      />

      <AnimatedBackground />
      <Navbar onBookingClick={openTurnero} />

      <main className={`flex-grow ${isDark ? 'bg-[#0a0f14] text-bone' : 'bg-[#f4f6fa] text-[#0a0f14]'}`}>
        {children}
      </main>

      <ContactoSection />
      <Footer onBookingClick={openTurnero} />
      <WhatsAppButton raised={showStickyCTA} />

      {/* Sticky mobile CTA — sólo visible en mobile, aparece tras scrollear */}
      <AnimatePresence>
        {showStickyCTA && !isOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          >
            <div className="px-4 pb-6 pt-3 bg-gradient-top">
              <button
                onClick={openTurnero}
                className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] text-white font-black text-[11px] tracking-[0.3em] uppercase rounded-sm shadow-[0_0_40px_rgba(59,130,246,0.35)] transition-colors"
              >
                AGENDAR CONSULTA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL MODAL DEL TURNERO */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTurnero}
              className={`absolute inset-0 backdrop-blur-md ${isDark ? 'bg-black/80' : 'bg-black/30'}`}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[95vh] rounded-sm shadow-2xl p-6 md:p-10 overflow-y-auto custom-scrollbar backdrop-blur-3xl ${isDark ? 'bg-[#0B1120]/60 border border-white/5' : 'bg-white border border-black/10'}`}
            >
              <button
                onClick={closeTurnero}
                aria-label="Cerrar modal"
                className={`absolute top-4 right-4 p-3 rounded-sm transition-all duration-500 border z-50 shadow-2xl group ${isDark ? 'bg-white/5 hover:bg-white hover:text-[#1B365D] text-white border-white/10' : 'bg-black/5 hover:bg-black/10 text-[#0a0f14] border-black/10'}`}
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>

              <div className="mb-6 text-center">
                <h2 className={`text-2xl font-black uppercase tracking-tight !mb-0 ${isDark ? 'text-white' : 'text-[#0a0f14]'}`}>AGENDAR TURNO</h2>
              </div>

              <TurneroInteractivo />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicClientWrapper({
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

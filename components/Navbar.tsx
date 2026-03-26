'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onBookingClick?: () => void;
  activeTab?: string;
  setActiveTab?: (tab?: string) => void;
}

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Sobre Mí', path: '/sobre-mi' },
];

const Navbar = ({ 
  onBookingClick = () => {}, 
  setActiveTab = () => {} 
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  });

  const handleBooking = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onBookingClick();
    setMobileMenuOpen(false);
  }, [onBookingClick]);

  if (pathname === '/login') return null;

  return (
    <>
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <header 
        className={`pointer-events-auto transition-all duration-500 ease-[0.16,1,0.3,1] border rounded-full overflow-hidden ${
          isScrolled 
            ? 'bg-[#0a0f14]/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-2 py-1' 
            : 'bg-[#0a0f14]/40 backdrop-blur-md border-white/5 px-4 py-2'
        }`}
      >
        <div className="flex items-center gap-4 md:gap-8 h-12 md:h-14 px-4">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group outline-none focus:ring-0"
            onClick={() => { setActiveTab('/'); setMobileMenuOpen(false); }}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full overflow-hidden p-1 transition-transform duration-300 group-hover:scale-110 shadow-lg">
              <Image src="/logo.png" alt="Logo Guido Operuk - Nutricionista" width={24} height={24} className="w-full h-full object-contain" priority />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">Guido Operuk</span>
              <span className="text-[7px] font-bold text-[#a7abb2] leading-none mt-1 uppercase tracking-widest opacity-60">MP 778</span>
            </div>
          </Link>
          
          {/* Separator */}
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setActiveTab(link.path)}
                  className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${
                    active ? 'text-[#3b82f6]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#3b82f6] rounded-full" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
               className="w-10 h-10 flex flex-col items-center justify-center bg-white/5 rounded-full border border-white/10 transition-all hover:bg-white/15 outline-none focus:ring-0"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
               aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-5 h-5 flex flex-col justify-center gap-[6px]">
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: 45, y: 4, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                  className="block h-[2px] bg-white rounded-full transition-all duration-300"
                />
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: -45, y: -4, width: "100%" } : { rotate: 0, y: 0, width: "60%" }}
                  className="block h-[2px] bg-white rounded-full transition-all duration-300 self-end"
                />
              </div>
            </button>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[#0a0f14]/90 backdrop-blur-3xl flex flex-col pt-32 pb-12 px-10 md:hidden overflow-hidden"
          >
            {/* Background decorative glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/5 rounded-full blur-[120px] pointer-events-none" />

            <nav className="flex flex-col gap-8 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    href={link.path}
                    onClick={() => { setActiveTab(link.path); setMobileMenuOpen(false); }}
                    className={`text-6xl font-black italic uppercase tracking-tighter transition-all duration-300 block ${
                      pathname === link.path 
                        ? 'text-white' 
                        : 'text-white/20 hover:text-white/40'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto relative z-10 space-y-8">
              {/* Professional Footer inside Menu */}
              <motion.div 
 className="border-t border-white/10 pt-8"
              >
                <p className="text-[10px] font-black italic text-white tracking-[0.2em] uppercase mb-1">Lic. Guido Operuk</p>
                <p className="text-[8px] font-bold text-[#a7abb2] tracking-[0.2em] uppercase opacity-60">Matrícula Profesional 778</p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleBooking}
                className="w-full py-5 bg-white text-black font-black text-[12px] tracking-[0.3em] uppercase rounded-sm shadow-2xl active:scale-[0.98] transition-all"
              >
                AGENDAR AHORA
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

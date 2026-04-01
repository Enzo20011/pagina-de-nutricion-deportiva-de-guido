'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { X, ArrowRight, Sun, Moon } from 'lucide-react';
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
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    const stored = localStorage.getItem('theme');
    const dark = stored !== 'light';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light-mode', !dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light-mode', !next);
  };
  
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
            ? isDark
              ? 'bg-[#0a0f14]/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-2 py-1'
              : 'bg-white/95 backdrop-blur-xl border-black/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-2 py-1'
            : isDark
              ? 'bg-[#0a0f14]/40 backdrop-blur-md border-white/5 px-4 py-2'
              : 'bg-white/85 backdrop-blur-md border-black/10 px-4 py-2'
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
              <span className={`text-[10px] font-black leading-none uppercase tracking-tighter ${isDark ? 'text-white' : 'text-[#0a0f14]'}`}>Guido Operuk</span>
              <span className={`text-[7px] font-bold leading-none mt-1 uppercase tracking-widest opacity-60 ${isDark ? 'text-[#a7abb2]' : 'text-[#4a5568]'}`}>MP 778</span>
            </div>
          </Link>
          
          {/* Separator */}
          <div className={`h-4 w-[1px] hidden md:block ${isDark ? 'bg-white/10' : 'bg-black/15'}`} />

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
                    active ? 'text-[#3b82f6]' : isDark ? 'text-white/60 hover:text-white' : 'text-[#4a5568] hover:text-[#0a0f14]'
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

          {/* Dark/Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all outline-none ${isDark ? 'bg-white/5 hover:bg-white/15 border-white/10' : 'bg-black/5 hover:bg-black/10 border-black/15'}`}
          >
            {isDark ? <Sun className="w-4 h-4 text-white/60" /> : <Moon className="w-4 h-4 text-[#4a5568]" />}
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
               className={`w-10 h-10 flex flex-col items-center justify-center rounded-full border transition-all outline-none focus:ring-0 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/15' : 'bg-black/10 border-black/25 hover:bg-black/15'}`}
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
               aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-5 h-5 flex flex-col justify-center gap-[6px]">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 4, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                  className={`block h-[2px] rounded-full transition-all duration-300 ${isDark ? 'bg-white' : 'bg-[#0a0f14]'}`}
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -4, width: "100%" } : { rotate: 0, y: 0, width: "60%" }}
                  className={`block h-[2px] rounded-full transition-all duration-300 self-end ${isDark ? 'bg-white' : 'bg-[#0a0f14]'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile Menu — Drawer lateral */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className={`fixed inset-0 z-[54] md:hidden ${isDark ? 'bg-black/70' : 'bg-black/30'} backdrop-blur-sm`}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className={`fixed top-0 right-0 bottom-0 w-[80vw] max-w-[300px] z-[55] md:hidden flex flex-col shadow-2xl ${
                isDark ? 'bg-[#0a0f14] border-l border-white/5' : 'bg-white border-l border-black/10'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-6 pt-8 pb-6 border-b ${isDark ? 'border-white/5' : 'border-black/8'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full overflow-hidden p-1 shadow">
                    <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-[#0a0f14]'}`}>Guido Operuk</p>
                    <p className={`text-[7px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? 'text-white/30' : 'text-[#4a5568]/60'}`}>MP 778</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${isDark ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/5' : 'border-black/10 text-[#4a5568] hover:text-[#0a0f14] hover:bg-black/5'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                {navLinks.map((link, i) => {
                  const active = pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.07 }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => { setActiveTab(link.path); setMobileMenuOpen(false); }}
                        className={`flex items-center justify-between px-4 py-4 rounded-xl transition-all group ${
                          active
                            ? 'bg-[#3b82f6] text-white'
                            : isDark
                              ? 'text-white/60 hover:text-white hover:bg-white/5'
                              : 'text-[#4a5568] hover:text-[#0a0f14] hover:bg-black/5'
                        }`}
                      >
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{link.name}</span>
                        <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${active ? 'opacity-100' : 'opacity-30'}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className={`px-4 pb-8 pt-4 border-t space-y-3 ${isDark ? 'border-white/5' : 'border-black/8'}`}>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isDark
                      ? 'border-white/10 text-white/40 hover:text-white hover:bg-white/5'
                      : 'border-black/10 text-[#4a5568] hover:text-[#0a0f14] hover:bg-black/5'
                  }`}
                >
                  {isDark ? <><Sun className="w-3.5 h-3.5" /> Modo Claro</> : <><Moon className="w-3.5 h-3.5" /> Modo Oscuro</>}
                </button>
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleBooking}
                  className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-[11px] tracking-[0.3em] uppercase rounded-xl shadow-lg shadow-[#3b82f6]/20 active:scale-[0.98] transition-all"
                >
                  Agendar Consulta
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

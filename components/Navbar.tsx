'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
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
  activeTab = 'inicio', 
  setActiveTab = () => {} 
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100 && !mobileMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [mobileMenuOpen]);

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    onBookingClick();
    setMobileMenuOpen(false);
  };

  if (pathname === '/login') return null;

  return (
    <>
      <motion.header 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        initial="visible"
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          (isScrolled || mobileMenuOpen)
            ? 'bg-[#0a0f14]/90 backdrop-blur-xl border-b border-[#1f262e]' 
            : 'bg-transparent'
        }`}
      >

        <div className="max-w-[1200px] mx-auto px-8 lg:px-20 flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group z-50"
            onClick={() => { setActiveTab('/'); setMobileMenuOpen(false); }}
          >
            <div className="w-11 h-11 flex items-center justify-center bg-white rounded-xl overflow-hidden p-1.5 transition-transform duration-500 group-hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col gap-0">
              <span className="heading-sm !text-md !text-[#eaeef6] group-hover:text-[#3b82f6] leading-none transition-colors duration-500 whitespace-nowrap">Guido M. Operuk</span>
              <span className="eyebrow !text-[#a7abb2] leading-none mt-1">MP 778</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setActiveTab(link.path)}
                  className={`font-label text-[11px] tracking-[0.12em] uppercase transition-all duration-300 relative group ${
                    active ? 'text-[#3b82f6]' : 'text-[#a7abb2] hover:text-[#eaeef6]'
                  }`}
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="block"
                  >
                    {link.name}
                  </motion.span>
                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-[1px] bg-[#3b82f6] transition-all duration-500 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                    layoutId="underline"
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4 z-50">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBooking}
              className="hidden md:flex items-center gap-3 px-6 py-2.5 rounded-sm font-label text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#ffffff" }}
            >
              RESERVAR <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-[#1a2027] hover:bg-[#1f262e] rounded-sm border border-[#2a3040] transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#eaeef6]" /> : <Menu className="w-5 h-5 text-[#eaeef6]" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0f14] flex flex-col pt-28 pb-16 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-8 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => { setActiveTab(link.path); setMobileMenuOpen(false); }}
                    className={`heading-lg mb-4 block transition-colors duration-300 ${
                      pathname === link.path ? 'text-[#3b82f6]' : 'text-[#1f262e] hover:text-[#eaeef6]'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto">
              <div className="h-px bg-[#1f262e] mb-8" />
              <button
                onClick={handleBooking}
                className="w-full py-5 rounded-sm font-label font-semibold text-sm tracking-[0.12em] uppercase"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#ffffff" }}
              >
                AGENDAR CONSULTA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

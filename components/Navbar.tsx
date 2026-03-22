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
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Auto-hide logic based on scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Hide if scrolling down past 120px and menu is NOT open
    if (latest > previous && latest > 120 && !mobileMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Sobre Mí', path: '/sobre-mi' },
  ];

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBookingClick) {
      onBookingClick();
    }
    setMobileMenuOpen(false);
  };

  if (pathname === '/login') return null;

  return (
    <>
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        initial="visible"
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          (isScrolled || mobileMenuOpen)
            ? 'bg-[#070C14]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'bg-transparent border-transparent'
        )}
      >
        {/* Top Scroll Indicator */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2px] bg-accentBlue origin-left z-50"
          style={{ scaleX }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group z-50 relative"
            onClick={() => { setActiveTab('/'); setMobileMenuOpen(false); }}
          >
            <div className="absolute -inset-2 bg-accentBlue/0 group-hover:bg-accentBlue/20 blur-xl rounded-full transition-all duration-700" />
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[5deg] border-2 border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] relative z-10 p-0.5 shrink-0">
              <Image 
                src="/logo.png" 
                alt="Logo Guido Operuk" 
                width={56}
                height={56}
                className="w-full h-full object-contain mix-blend-multiply"
                priority
              />
            </div>
            <span className="font-sans font-black tracking-tighter text-xl md:text-2xl text-white uppercase italic relative z-10 transition-colors group-hover:text-white/90">
              Operuk<span className="text-accentBlue font-light group-hover:animate-pulse">.</span>
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setActiveTab(link.path)}
                className={clsx(
                  "relative text-xs font-bold uppercase tracking-[0.2em] transition-colors py-2 group",
                  activeTab === link.path ? 'text-white' : 'text-white/40 hover:text-white'
                )}
              >
                {link.name}
                <div className={clsx(
                  "absolute -bottom-1 left-0 h-[2px] bg-accentBlue transition-all duration-300",
                  activeTab === link.path ? 'w-full' : 'w-0 group-hover:w-full opacity-50'
                )} />
              </Link>
            ))}
          </nav>

          {/* Right CTA / Mobile Toggle */}
          <div className="flex items-center gap-4 z-50">
            <button
              onClick={handleBooking}
              className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-accentBlue border border-white/10 hover:border-accentBlue py-2.5 px-6 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all group overflow-hidden relative"
            >
               <span className="relative z-10 flex items-center gap-2">
                 Reservar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
               </span>
            </button>
            <button 
              className="md:hidden flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div animate={{ rotate: mobileMenuOpen ? 180 : 0 }}>
                {mobileMenuOpen ? (
                  <X className="text-white w-5 h-5" />
                ) : (
                  <Menu className="text-white w-5 h-5" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full Screen Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#070C14] flex flex-col pt-24 pb-12 px-6 md:hidden"
          >
             <div className="flex flex-col h-full relative">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-accentBlue/10 blur-[150px] rounded-full pointer-events-none" />

                <nav className="flex flex-col gap-8 mt-10">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => {
                          setActiveTab(link.path);
                          setMobileMenuOpen(false);
                        }}
                        className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white/50 hover:text-white transition-colors flex items-center gap-4 group"
                      >
                         <span className={clsx(
                           "w-0 h-0.5 bg-accentBlue transition-all duration-300 object-left",
                           activeTab === link.path ? 'w-8' : 'group-hover:w-4'
                         )} />
                         <span className={activeTab === link.path ? "text-white" : ""}>{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto space-y-6">
                   <div className="w-full h-px bg-white/10" />
                   <div className="flex flex-wrap gap-4">
                      <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-accentBlue hover:bg-white/5 transition-colors">
                         IG
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-accentBlue hover:bg-white/5 transition-colors">
                         IN
                      </a>
                   </div>
                   <button
                     onClick={handleBooking}
                     className="w-full bg-accentBlue hover:bg-blue-600 text-white py-6 rounded-2xl text-center font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(59,130,246,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     Reservar Turno Ahora <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Navbar;

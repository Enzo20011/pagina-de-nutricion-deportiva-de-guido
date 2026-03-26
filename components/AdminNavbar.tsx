"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Users,
  Calendar,
  ClipboardList,
  LogOut,
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { icon: Users, label: 'Pacientes', href: '/admin/pacientes' },
  { icon: Calendar, label: 'Agenda', href: '/admin/agenda' },
  { icon: DollarSign, label: 'Finanzas', href: '/admin/finanzas' },
  { icon: ClipboardList, label: 'Consultas', href: '/admin/consulta' },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'}|null>(null);

  const handleSignOut = () => {
    setToast({ msg: 'Sesión cerrada correctamente', type: 'success' });
    setTimeout(() => {
      setToast(null);
      signOut({ callbackUrl: `${window.location.origin}/login`, redirect: true });
    }, 300);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0f14]/95 backdrop-blur-xl border-b border-[#1f262e] px-4 md:px-10 py-3 md:py-4 flex items-center justify-between"
        aria-label="Barra de navegación administrativa"
      >
        {/* Branding Area */}
        <div className="flex items-center gap-3 md:gap-6 group/brand overflow-hidden">
          <Link href="/admin" className="flex items-center gap-3 md:gap-4 relative shrink-0">
            <div className="relative group/logo w-10 h-10 md:w-12 md:h-12 bg-white flex items-center justify-center transition-all duration-500 hover:scale-105 rounded-sm overflow-hidden p-1 border border-white/20">
              <Image 
                src="/logo.png" 
                alt="Logo Guido Operuk" 
                width={48}
                height={48}
                className="w-full h-full object-contain mix-blend-multiply relative z-10"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm md:text-xl tracking-tighter text-white uppercase leading-none truncate block">
                Guido <span className="hidden sm:inline">Operuk</span>
              </span>
              <span className="text-[9px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#3b82f6]/60 mt-1 truncate">PORTAL ADMIN</span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-center px-10">
          <ul className="flex gap-4 md:gap-8 lg:gap-10 items-center bg-[#0B1120]/40 p-1 rounded-sm border border-white/5">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-sm transition-all relative group focus:outline-none ${
                      isActive 
                        ? 'text-white bg-[#3b82f6]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 border border-white/5 hover:border-red-400/20 transition-all text-[9px] font-bold uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SALIR</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="p-3 min-w-[44px] min-h-[44px] bg-white/5 border border-white/10 rounded-sm text-white/70 hover:text-white transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#3b82f6] outline-none"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[75vw] max-w-[280px] bg-[#0a0f14] border-l border-white/5 z-[80] p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-[10px] font-bold text-[#3b82f6] tracking-[0.3em] uppercase">NAVEGACIÓN</span>
                <button onClick={toggleMobileMenu} className="text-white/20 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {MENU_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className={`flex items-center gap-4 p-4 rounded-sm transition-all border ${
                        isActive 
                          ? 'bg-[#3b82f6] border-[#3b82f6] text-white' 
                          : 'bg-white/5 border-white/5 text-[#a7abb2] hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto pt-10 border-t border-white/5">
                <button
                  onClick={() => { handleSignOut(); toggleMobileMenu(); }}
                  className="w-full flex items-center justify-center gap-4 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
                >
                  <LogOut className="w-5 h-5" />
                  CERRAR SESIÓN
                </button>
                <div className="mt-8 text-center">
                  <p className="text-[7px] font-bold text-white/10 tracking-[0.4em] uppercase">Elite Clinical System v2.1</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

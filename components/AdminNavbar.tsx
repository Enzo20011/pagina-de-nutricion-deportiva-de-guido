"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Users,
  Calendar,
  ClipboardList,
  LogOut,
  TrendingUp,
  LayoutDashboard,
  UserCircle,
  DollarSign,
  Command
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'framer-motion';
import CommandPalette from './CommandPalette';

const MENU_ITEMS = [
  { icon: Users, label: 'Pacientes', href: '/admin/pacientes' },
  { icon: Calendar, label: 'Agenda', href: '/admin/agenda' },
  { icon: DollarSign, label: 'Finanzas', href: '/admin/finanzas' },
  { icon: ClipboardList, label: 'Consultas', href: '/admin/consulta' }
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'}|null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSignOut = () => {
    setToast({ msg: 'Sesión cerrada correctamente', type: 'success' });
    setTimeout(() => {
      setToast(null);
      signOut({ callbackUrl: `${window.location.origin}/login`, redirect: true });
    }, 1200);
  };

  const handleNuevoRegistro = () => {
    setToast({ msg: 'Nuevo registro creado (demo)', type: 'success' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-darkNavy/90 backdrop-blur-2xl elite-border flex items-center justify-between px-8 py-4 shadow-[0_8px_32px_0_rgba(59,130,246,0.10)] overflow-hidden"
        aria-label="Barra de navegación principal"
      >
        <div className="absolute inset-0 -z-10 opacity-5">
           <img src="/assets/clinical-bg.png" alt="" className="w-full h-full object-cover grayscale brightness-200" />
        </div>
      {/* Branding */}
      <div className="flex items-center gap-8 pr-6 group/brand" tabIndex={0} aria-label="Branding Guido Operuk Nutrición Elite">
        {/* Separador visual */}
        <span className="hidden md:inline-block h-10 w-[2px] bg-accentBlue/20 mx-8 rounded-full" aria-hidden="true"></span>
        
        <Link href="/admin" className="flex items-center gap-3 relative">
          <div className="relative group/logo w-10 h-10 md:w-12 md:h-12 bg-white flex items-center justify-center transition-transform duration-500 hover:scale-110 hover:rotate-[5deg] shrink-0 rounded-full overflow-hidden p-0.5 border-2 border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <div className="absolute -inset-2 bg-accentBlue/0 group-hover/logo:bg-accentBlue/20 blur-xl rounded-full transition-all duration-700 pointer-events-none" />
            <Image 
              src="/logo.png" 
              alt="Logo Guido Operuk" 
              width={56}
              height={56}
              className="w-full h-full object-contain mix-blend-multiply relative z-10"
              priority
            />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase italic leading-none hidden md:block font-sans transition-colors group-hover/brand:text-white/90">
            Guido Operuk<span className="text-accentBlue not-italic group-hover/brand:animate-pulse">.</span>
          </span>
        </Link>
      </div>
      {/* Menu */}
      <div className="flex-1 flex justify-start">
        <ul className="flex gap-2 sm:gap-6 md:gap-10 lg:gap-16 xl:gap-20 items-center">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue/80 font-sans ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={0}
                  aria-label={item.label}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-accentBlue' : 'group-hover:text-accentBlue'} transition-colors`} aria-hidden="true" />
                  </motion.div>
                  <span className="hidden sm:inline font-bold tracking-tight">{item.label}</span>
                  {/* Active sliding underline */}
                  {isActive && (
                    <motion.span
                      layoutId="adminNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accentBlue shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* ⌘K Button */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest"
          aria-label="Abrir búsqueda global (Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span>K</span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2 rounded-2xl text-rose-400/80 hover:text-white hover:bg-rose-400/10 focus-visible:ring-2 focus-visible:ring-rose-400/80 transition-all font-bold text-base border border-transparent hover:border-rose-400/40"
          tabIndex={0}
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-6 h-6" aria-hidden="true" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
      </nav>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

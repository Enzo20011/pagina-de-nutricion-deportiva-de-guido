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
  TrendingUp,
  LayoutDashboard,
  UserCircle,
  DollarSign
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'}|null>(null);



  const handleSignOut = () => {
    setToast({ msg: 'Sesión cerrada correctamente', type: 'success' });
    setTimeout(() => {
      setToast(null);
      signOut({ callbackUrl: `${window.location.origin}/login`, redirect: true });
    }, 1200);
  };


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f14]/95 backdrop-blur-xl border-b border-[#1f262e] flex items-center justify-between px-10 py-4 overflow-hidden"
        aria-label="Barra de navegación principal"
      >
        <div className="absolute inset-0 -z-10 opacity-5" 
          style={{ background: "linear-gradient(90deg, rgba(170,255,220,0.1), transparent)" }} />
      
      {/* Branding */}
      <div className="flex items-center gap-6 group/brand">
        <Link href="/admin" className="flex items-center gap-4 relative">
          <div className="relative group/logo w-12 h-12 bg-white flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] shrink-0 rounded-sm overflow-hidden p-1 border border-white/20">
            <Image 
              src="/logo.png" 
              alt="Logo Guido Operuk" 
              width={64}
              height={64}
              className="w-full h-full object-contain mix-blend-multiply relative z-10"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white uppercase leading-none transition-colors group-hover/brand:text-white/90">
              Guido Operuk
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#3b82f6]/60 mt-1">Portal Admin</span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 flex justify-center px-10">
        <ul className="flex gap-4 md:gap-8 lg:gap-12 items-center bg-[#0B1120]/40 p-1.5 rounded-sm border border-white/5">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-sm transition-all relative group focus:outline-none ${
                    isActive 
                      ? 'text-white' 
                      : 'text-white/40 hover:text-white'
                  }`}
                  style={isActive ? { background: '#3b82f6' } : {}}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#00654b]' : 'text-[#a7abb2] group-hover:text-[#aaffdc]'} transition-colors`} aria-hidden="true" />
                  <span className="hidden lg:inline text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="adminNavUnderline"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#aaffdc] lg:hidden"
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
      <div className="flex items-center gap-5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-sm text-white/20 hover:text-red-400 hover:bg-red-400/10 border border-white/5 hover:border-red-400/30 transition-all"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-[0.1em]">Salir</span>
        </button>
      </div>
      </nav>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

    </>
  );
}

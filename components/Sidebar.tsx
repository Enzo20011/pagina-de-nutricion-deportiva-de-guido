'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Settings, 
  Home,
  LogOut,
  TrendingUp,
  PlusCircle,
  LayoutDashboard,
  Search
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Pacientes', href: '/admin/pacientes' },
  { icon: Calendar, label: 'Agenda', href: '/admin/agenda' },
  { icon: TrendingUp, label: 'Evolución', href: '/admin/finanzas' },
  { icon: ClipboardList, label: 'Consultas', href: '/admin/consulta' }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  // Responsive: modo compacto en pantallas chicas
  React.useEffect(() => {
    const handleResize = () => {
      setCompact(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`h-screen bg-[#0a0f14] border-r border-white/5 flex flex-col p-4 fixed left-0 top-0 z-[100] shadow-2xl transition-all duration-300 ${compact ? 'w-20' : 'w-72'} group/sidebar`}
      aria-label="Barra lateral de navegación"
    >
      {/* BRANDING */}
      <div className={`flex items-center gap-4 mb-10 px-2 transition-all duration-300 ${compact ? 'justify-center' : ''} group/brand`}>
        <div className="relative group/logo w-10 h-10 bg-white rounded-sm overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-110 shrink-0 p-1 border border-white/10">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={40}
            height={40}
            className="w-full h-full object-contain mix-blend-multiply relative z-10"
            priority
          />
        </div>
        {!compact && (
          <div>
             <span className="block font-bold text-lg tracking-tight text-white uppercase leading-none transition-colors group-hover/brand:text-white/90">
              Guido Operuk
             </span>
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#3b82f6]/40 mt-1 block">
              Nutrición Profesional
             </span>
          </div>
        )}
      </div>

      {/* QUICK SEARCH */}
      {!compact && (
        <div className="px-2 mb-8 relative group/search">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within/search:text-[#3b82f6] transition-colors" />
           <input 
             type="text" 
             placeholder="BUSCAR..." 
             className="w-full bg-white/5 border border-white/5 rounded-sm py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest text-white outline-none focus:border-[#3b82f6]/20 transition-all placeholder:text-white/5"
           />
        </div>
      )}

      {/* QUICK ACTION */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`items-center w-full p-5 bg-[#3b82f6] text-white rounded-sm mb-12 shadow-xl border border-[#3b82f6]/20 group relative overflow-hidden ${compact ? 'justify-center flex' : 'flex gap-4'}`}
        tabIndex={0}
        aria-label="Nuevo Registro"
        onMouseEnter={() => setTooltip('Nuevo Registro')}
        onMouseLeave={() => setTooltip(null)}
      >
        <PlusCircle className="w-5 h-5 text-white transition-transform relative z-10" />
        {!compact && <span className="font-bold text-[10px] uppercase tracking-[0.2em] relative z-10">NUEVO REGISTRO</span>}
        {compact && tooltip === 'Nuevo Registro' && (
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#0a0f14] text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase shadow-2xl border border-white/10 whitespace-nowrap z-50">NUEVO REGISTRO</span>
        )}
      </motion.button>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2" aria-label="Navegación principal">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${compact ? 'justify-center' : 'gap-4'} px-4 py-4 rounded-sm transition-all relative group focus:outline-none overflow-hidden ${
                isActive
                ? 'text-white bg-white/5 border border-white/10'
                : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              tabIndex={0}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              onMouseEnter={() => setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Active left indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBorder"
                  className="absolute left-0 top-3 bottom-3 w-[2px] bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#3b82f6]' : 'group-hover:text-[#3b82f6]'} transition-colors relative z-10`} />

              {!compact && (
                <span className={`font-bold text-[11px] uppercase tracking-widest relative z-10 transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                  {item.label}
                </span>
              )}
              {compact && tooltip === item.label && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#0a0f14] text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase shadow-2xl border border-white/10 whitespace-nowrap z-50"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className={`mt-auto space-y-2 pt-8 border-t border-white/5 ${compact ? 'flex flex-col items-center' : ''}`}>
        <button
          className={`flex items-center ${compact ? 'justify-center' : 'gap-4'} px-4 py-4 w-full rounded-sm text-white/20 hover:text-white transition-colors group focus:outline-none`}
          tabIndex={0}
          aria-label="Configuración"
          onMouseEnter={() => setTooltip('Configuración')}
          onMouseLeave={() => setTooltip(null)}
        >
          <Settings className="w-4 h-4" />
          {!compact && <span className="font-bold text-[10px] uppercase tracking-widest">Configuración</span>}
          {compact && tooltip === 'Configuración' && (
            <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#0a0f14] text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase shadow-2xl border border-white/10 whitespace-nowrap z-50">Configuración</span>
          )}
        </button>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center ${compact ? 'justify-center' : 'gap-4'} px-4 py-4 w-full rounded-sm text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold text-[10px] uppercase tracking-widest focus:outline-none`}
          tabIndex={0}
          aria-label="Salir"
          onMouseEnter={() => setTooltip('Salir')}
          onMouseLeave={() => setTooltip(null)}
        >
          <LogOut className="w-4 h-4" />
          {!compact && <span>Salir</span>}
          {compact && tooltip === 'Salir' && (
            <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#0a0f14] text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase shadow-2xl border border-white/10 whitespace-nowrap z-50">Salir</span>
          )}
        </button>
      </div>
    </aside>
  );
}

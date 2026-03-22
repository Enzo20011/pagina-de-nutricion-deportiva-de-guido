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
      className={`h-screen bg-darkNavy border-r border-white/5 flex flex-col p-3 fixed left-0 top-0 z-[100] shadow-2xl transition-all duration-300 ${compact ? 'w-20' : 'w-72'} group/sidebar`}
      aria-label="Barra lateral de navegación"
    >
      {/* BRANDING */}
      <div className={`flex items-center gap-4 mb-10 px-2 transition-all duration-300 ${compact ? 'justify-center' : ''} group/brand`}>
        <div className="relative group/logo w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-110 hover:rotate-[5deg] shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0 p-1 border-2 border-white/20">
          <div className="absolute -inset-2 bg-accentBlue/0 group-hover/logo:bg-accentBlue/20 blur-xl rounded-full transition-all duration-700 pointer-events-none" />
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={56}
            height={56}
            className="w-full h-full object-contain mix-blend-multiply relative z-10"
            priority
          />
        </div>
        {!compact && (
          <div>
             <span className="block font-black text-lg tracking-tighter text-white uppercase italic leading-none transition-colors group-hover/brand:text-white/90">
              Guido Operuk<span className="text-accentBlue not-italic group-hover/brand:animate-pulse">.</span>
             </span>
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accentBlue/40 mt-1 block">
              Nutrición Elite
             </span>
          </div>
        )}
      </div>

      {/* QUICK SEARCH */}
      {!compact && (
        <div className="px-2 mb-6 relative group/search">
           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-accentBlue transition-colors">
              <Search className="w-4 h-4" />
           </div>
           <input 
             type="text" 
             placeholder="Buscar paciente..." 
             className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-accentBlue/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
           />
        </div>
      )}

      {/* QUICK ACTION */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`items-center w-full p-4 bg-cardDark text-white rounded-2xl mb-8 hover:border-accentBlue/30 transition-all shadow-2xl border border-white/5 group relative overflow-hidden ${compact ? 'justify-center flex' : 'flex gap-4'}`}
        tabIndex={0}
        aria-label="Nuevo Registro"
        onMouseEnter={() => setTooltip('Nuevo Registro')}
        onMouseLeave={() => setTooltip(null)}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-accentBlue/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <PlusCircle className="w-6 h-6 text-accentBlue group-hover:rotate-90 transition-transform relative z-10" />
        {!compact && <span className="font-black text-[11px] uppercase tracking-widest relative z-10">Nuevo Registro</span>}
        {compact && tooltip === 'Nuevo Registro' && (
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-darkNavy text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xl border border-white/10 animate-fade-in">Nuevo Registro</span>
        )}
      </motion.button>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1" aria-label="Navegación principal">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${compact ? 'justify-center' : 'gap-3'} px-3 py-3.5 rounded-xl transition-all relative group focus:outline-none focus:ring-2 focus:ring-accentBlue/60 overflow-hidden ${
                isActive
                ? 'text-white bg-white/10 border border-accentBlue/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              tabIndex={0}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              onMouseEnter={() => setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Active left border indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBorder"
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-accentBlue shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {/* Hover left highlight (inactive) */}
              {!isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-white/20 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-200" />
              )}

              <motion.div
                whileHover={{ scale: isActive ? 1 : 1.15, rotate: isActive ? 0 : -5 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 shrink-0"
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-accentBlue drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'group-hover:text-accentBlue'} transition-colors`} />
              </motion.div>

              {!compact && (
                <span className={`font-semibold text-sm relative z-10 transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                  {item.label}
                </span>
              )}
              {compact && tooltip === item.label && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-darkNavy text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl border border-white/10 whitespace-nowrap z-50"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className={`mt-auto space-y-1 pt-6 border-t border-white/5 ${compact ? 'flex flex-col items-center' : ''}`}>
        <button
          className={`flex items-center ${compact ? 'justify-center' : 'gap-3'} px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-accentBlue/60`}
          tabIndex={0}
          aria-label="Configuración"
          onMouseEnter={() => setTooltip('Configuración')}
          onMouseLeave={() => setTooltip(null)}
        >
          <Settings className="w-4 h-4" />
          {!compact && <span className="font-medium text-xs uppercase tracking-widest">Configuración</span>}
          {compact && tooltip === 'Configuración' && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-darkNavy text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xl border border-white/10 animate-fade-in">Configuración</span>
          )}
        </button>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={`flex items-center ${compact ? 'justify-center' : 'gap-3'} px-4 py-3 w-full rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 transition-all font-medium text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-400/60`}
          tabIndex={0}
          aria-label="Salir"
          onMouseEnter={() => setTooltip('Salir')}
          onMouseLeave={() => setTooltip(null)}
        >
          <LogOut className="w-4 h-4" />
          {!compact && <span>Salir</span>}
          {compact && tooltip === 'Salir' && (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-darkNavy text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xl border border-white/10 animate-fade-in">Salir</span>
          )}
        </button>
      </div>
    </aside>
  );
}

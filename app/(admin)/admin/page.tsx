'use client';

import React, { useState, useEffect } from 'react';
import Sparkline from '@/components/Sparkline';
import { 
  Users, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Activity, 
  TrendingUp,
  Clock,
  Sparkles,
  Search,
  Zap,
  FileText,
  Play
} from 'lucide-react';
import clsx from 'clsx';
import { DashboardSkeleton } from '@/components/Skeleton';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notif, setNotif] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Simulación de autocompletado
  useEffect(() => {
    if (search.length > 1) {
      setSuggestions([
        'Juan Pérez',
        'María López',
        'Carlos Ruiz',
        'Ana García',
      ].filter(n => n.toLowerCase().includes(search.toLowerCase())));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [search]);

  if (loading) return (
    <div className="p-8 bg-navy-dark min-h-screen">
      <DashboardSkeleton />
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 text-bone">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3 text-accentBlue font-bold uppercase text-[10px] tracking-[0.4em]">
             <Sparkles className="w-4 h-4 opacity-50" /> Portal Profesional Elite · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
            Panel de <span className="text-accentBlue not-italic">Control.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Próxima sesión: 16:30hs · Juan Díaz
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 w-full lg:w-auto"
        >
          <div className="relative group flex-1 lg:w-[360px] lg:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accentBlue transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(search.length > 1)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:border-accentBlue/50 outline-none w-full transition-all font-semibold text-sm text-white placeholder:text-white/20 backdrop-blur-md"
              aria-label="Buscar paciente"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 top-full mt-2 w-full bg-darkNavy border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
                {suggestions.map((s, i) => (
                  <li key={i} className="px-5 py-3 text-white hover:bg-accentBlue/10 cursor-pointer text-sm font-semibold transition-colors" onMouseDown={() => { setSearch(s); setShowSuggestions(false); }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-accentBlue/20 border border-accentBlue/30 text-accentBlue text-xs font-black uppercase tracking-widest hover:bg-accentBlue hover:text-white transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo
          </motion.button>
          {notif > 0 && (
            <div className="relative shrink-0">
              <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white/40" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-darkNavy">{notif}</span>
            </div>
          )}
        </motion.div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {[
          { label: 'Pacientes', value: 128, growth: '+12%', trend: '+5.2%', trendLabel: 'vs mes anterior', icon: Users, accent: false, spark: [110, 115, 120, 128], href: '/admin/pacientes' },
          { label: 'Turnos Hoy', value: 8, growth: 'Próximo: 16:30', trend: '+2', trendLabel: 'promedio diario', icon: Calendar, accent: true, spark: [5, 7, 6, 8], href: '/admin/agenda' },
          { label: 'Actividad', value: 94, growth: 'Escala Max', trend: '+14%', trendLabel: 'uso del sistema', icon: Zap, accent: false, spark: [80, 85, 90, 94], href: '/admin' },
          { label: 'Evolución', value: 18.2, growth: 'Objetivo OK', trend: '+3.1%', trendLabel: 'crecimiento anual', icon: TrendingUp, accent: false, spark: [10, 12, 15, 18.2], href: '/admin/finanzas' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            className={`rounded-3xl backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 ${
              stat.accent 
                ? 'bg-accentBlue/90 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)] text-white border-white/20' 
                : 'bg-cardDark/40 text-bone hover:border-white/20 hover:bg-cardDark/60'
            }`}
          >
            <Link href={stat.href} className="p-6 lg:p-8 block w-full h-full">
              {/* Dynamic Background Glow */}
              {!stat.accent && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-accentBlue/5 rounded-full blur-[60px] group-hover:bg-accentBlue/10 transition-colors" />
              )}

              <div className={`w-14 h-14 ${stat.accent ? 'bg-white/20 text-white' : 'bg-darkNavy text-accentBlue'} rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 duration-500 shadow-xl border-2 border-accentBlue/20`}>
                <stat.icon className="w-7 h-7 drop-shadow-[0_0_8px_rgba(59,130,246,0.15)]" />
              </div>
              {/* Sparkline */}
              <div className="absolute bottom-6 right-6">
                <Sparkline data={stat.spark} color={stat.accent ? '#fff' : '#3B82F6'} />
              </div>
              <div className="space-y-2">
                <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${stat.accent ? 'text-white/70' : 'text-accentBlue/80'}`}>{stat.label}</p>
                <h3 className={`text-4xl lg:text-5xl font-black tracking-tighter font-outfit ${stat.accent ? 'text-white' : 'text-white'}`}>{stat.value}{stat.label === 'Evolución' && <span className="text-base font-bold opacity-40 ml-1">%</span>}</h3>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${stat.accent ? 'bg-white/10 text-white border-white/20' : 'bg-accentBlue/10 text-accentBlue border-accentBlue/20'}`}>
                        {stat.growth}
                      </span>
                      {!stat.accent && <ArrowRight className="w-4 h-4 text-accentBlue/40 group-hover:text-accentBlue translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />}
                    </div>
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${stat.accent ? 'text-white/40' : 'text-slate-500'}`}>
                      <span className={stat.accent ? 'text-white' : 'text-emerald-500'}>{stat.trend}</span> {stat.trendLabel}
                    </p>
                  </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* RECENT SESIONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-cardDark/40 p-8 rounded-[2rem] backdrop-blur-3xl border border-white/5 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                Próximas <span className="text-accentBlue not-italic">Sesiones</span>
              </h2>
            </div>
            <Link href="/admin/agenda" className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-accentBlue transition-colors border-b border-transparent hover:border-accentBlue pb-1">Ver Agenda Full</Link>
          </div>
          
          <div className="space-y-6">
            {[
              { id: '1', paciente: 'Juan Díaz', hora: '16:30HS', tipo: 'Control Antropométrico', status: 'Activa' },
              { id: '2', paciente: 'Maria Silva', hora: '17:45HS', tipo: 'Plan Alimentario', status: 'Aceptada' },
              { id: '3', paciente: 'Carlos Ruiz', hora: '19:00HS', tipo: 'Primera Consulta', status: 'Activa' },
            ].map((session, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 5, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                  className="p-6 bg-darkNavy/50 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-darkNavy text-accentBlue rounded-xl flex items-center justify-center font-black text-xl italic shadow-inner border border-white/5 group-hover:bg-accentBlue group-hover:text-white transition-all">
                      {session.paciente.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[10px] text-accentBlue font-bold uppercase tracking-[0.4em] mb-1.5">{session.hora} - {session.tipo}</p>
                      <h4 className="text-xl font-black text-white tracking-tight italic uppercase">{session.paciente}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                      <FileText className="w-3.5 h-3.5" /> Ficha
                    </button>
                    <button className={clsx(
                      "px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2",
                      session.status === 'Activa' 
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                        : 'bg-accentBlue/20 text-accentBlue hover:bg-accentBlue hover:text-white'
                    )}>
                      {session.status === 'Activa' ? <><Play className="w-3.5 h-3.5" /> Iniciar</> : 'Aceptada'}
                    </button>
                  </div>
                </motion.div>
            ))}
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accentBlue p-8 rounded-[2rem] text-white shadow-[0_20px_50px_-10px_rgba(59,130,246,0.3)] relative overflow-hidden flex flex-col justify-between"
        >
          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-0">Accesos <br/> Rápidos.</h2>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                   <Zap className="w-6 h-6" />
                </div>
            </div>

            <div className="space-y-4">
                  <Link href="/admin/pacientes/nuevo" className="p-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-4 transition-all group border border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-widest italic">Alta Paciente</span>
                  </Link>
                  <Link href="/admin/agenda" className="p-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-4 transition-all group border border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-widest italic">Calendario</span>
                  </Link>
                  <Link href="/admin/finanzas" className="p-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-4 transition-all group border border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-widest italic">Facturación</span>
                  </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MOTOR CLÍNICO NUTRICIONAL */}
      <div className="pt-10">
        <h2 className="text-xl font-black text-white mb-8 uppercase tracking-tighter flex items-center gap-3 px-4">
          <Activity className="w-6 h-6 text-accentBlue" /> Motor Clínico Nutricional
        </h2>
        <div className="bg-white/5 p-1 rounded-[3rem] border border-white/5 overflow-hidden">
             <div className="bg-navy-dark rounded-[2.8rem] p-8 min-h-[400px]">
                <p className="text-slate-500 text-center py-20 font-bold uppercase tracking-widest text-xs">Cargando Herramientas Clínicas...</p>
             </div>
        </div>
      </div>

    </div>
  );
}

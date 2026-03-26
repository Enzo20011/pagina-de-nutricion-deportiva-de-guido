'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Play,
  User
} from 'lucide-react';
import clsx from 'clsx';
import { DashboardSkeleton } from '@/components/Skeleton';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notif, setNotif] = useState(3);

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setFormattedDate(new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }));
    
    // Cargar Estadísticas Real
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Búsqueda real de pacientes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 1) {
        try {
          const res = await fetch(`/api/admin/pacientes/search?q=${search}`);
          const { data } = await res.json();
          setSuggestions(data || []);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading || !stats) return (
    <div className="p-8 bg-[#0a0f14] min-h-screen">
      <DashboardSkeleton />
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 text-[#eaeef6] px-4 md:px-8">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#3b82f6] font-label text-[10px] uppercase tracking-[0.3em] font-bold">
             <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" /> {mounted ? formattedDate : ''}
          </div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tight uppercase leading-none">
            Resumen de <span className="text-[#3b82f6]">Actividad</span>
          </h1>
          <p className="text-[#a7abb2] font-label uppercase text-[9px] tracking-widest flex items-center gap-2">
            Próximo paciente: {stats?.proximoTurno ? `${stats.proximoTurno.hora}hs · ${stats.proximoTurno.nombre}` : 'Sin turnos hoy'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto"
        >
          <div className="relative group flex-1 lg:w-[320px] lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a7abb2]/40 group-focus-within:text-[#3b82f6] transition-colors" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(search.length > 1)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="pl-11 pr-4 py-3 bg-[#0e1419] border border-[#1f262e] rounded-sm focus:border-[#3b82f6]/50 outline-none w-full transition-all font-label uppercase tracking-widest text-base md:text-[10px] text-white placeholder:text-[#a7abb2]/20"
              aria-label="Buscar paciente"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e1419] border border-[#1f262e] rounded-sm shadow-2xl z-[100] overflow-hidden">
                {suggestions.map((s: any, i) => (
                  <Link
                    key={i}
                    href={`/admin/pacientes?id=${s.id}`}
                    className="w-full px-6 py-4 text-left text-white/60 hover:text-white hover:bg-[#3b82f6]/10 transition-all border-b border-[#1f262e] last:border-none flex items-center gap-4 group"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <User className="w-4 h-4 text-[#a7abb2] group-hover:text-[#3b82f6]" />
                    <span className="text-[10px] font-label font-bold uppercase tracking-widest">{s.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pacientes?action=new"
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3 min-h-[44px] rounded-sm bg-[#3b82f6] text-white text-[10px] font-label font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#3b82f6]/10 hover:bg-[#3b82f6]/90 transition-all font-bold"
            >
              <Plus className="w-4 h-4" /> Nuevo Registro
            </Link>
          </div>
        </motion.div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Pacientes Totales', value: stats?.totalPacientes || 0, growth: '+100%', trend: 'Total', trendLabel: 'Actuales', icon: Users, accent: false, spark: [110, 115, 120, stats?.totalPacientes || 0], href: '/admin/pacientes' },
          { label: 'Agenda de Hoy', value: stats?.agendaHoy || 0, growth: stats?.proximoTurno ? `Prox: ${stats.proximoTurno.hora}` : 'Sin turnos', trend: 'Hoy', trendLabel: 'Turnos', icon: Calendar, accent: true, spark: [5, 7, 6, stats?.agendaHoy || 0], href: '/admin/agenda' },
          { label: 'Estado Sistema', value: 100, growth: 'Operativo', trend: 'ACTIVO', trendLabel: 'Tiempo Real', icon: Zap, accent: false, spark: [90, 95, 98, 100], href: '/admin' },
          { label: 'Ingresos Mes', value: `$${stats?.montoMensual?.toLocaleString() || 0}`, growth: 'Confirmados', trend: 'Mensual', trendLabel: 'Pesos', icon: TrendingUp, accent: false, spark: [10, 12, 15, stats?.montoMensual || 0], href: '/admin/finanzas' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={clsx(
              "rounded-sm border p-4 md:p-5 transition-all duration-75 relative overflow-hidden group h-full flex flex-col justify-between",
              stat.accent 
                ? "bg-[#3b82f6] border-[#3b82f6] text-white" 
                : "bg-[#0e1419] border-[#1f262e] text-[#eaeef6] hover:border-[#3b82f6]/30"
            )}
          >
            <Link href={stat.href} className="flex flex-col h-full gap-6">
              <div className={clsx(
                "w-10 h-10 rounded-sm flex items-center justify-center transition-all",
                stat.accent ? "bg-white/10 text-white" : "bg-[#1f262e] text-[#3b82f6]"
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              
              <div className="space-y-1">
                <p className={clsx(
                  "font-label text-[8px] font-bold uppercase tracking-[0.2em]",
                  stat.accent ? "text-white/60" : "text-[#a7abb2]"
                )}>{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-heading font-black tracking-tight leading-none">{stat.value}</h3>
                  {stat.label === 'Crecimiento' && <span className="text-sm font-bold opacity-40">%</span>}
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className={clsx(
                      "px-2 py-0.5 rounded-sm text-[7px] font-label font-bold uppercase tracking-widest border",
                      stat.accent ? "bg-white/10 border-white/20 text-white" : "bg-[#1f262e] border-[#1a2027] text-[#3b82f6]"
                    )}>
                      {stat.growth}
                    </span>
                    <Sparkline data={stat.spark} color={stat.accent ? '#ffffff' : '#3b82f6'} />
                 </div>
                 <p className={clsx(
                   "font-label text-[7px] uppercase tracking-[0.1em] font-bold",
                   stat.accent ? "text-white/40" : "text-[#43484e]"
                 )}>
                   <span className={stat.accent ? "text-white" : "text-[#a7abb2]"}>{stat.trend}</span> {stat.trendLabel}
                 </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* RECENT SESIONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-[#0e1419] p-6 md:p-10 rounded-sm border border-[#1f262e] space-y-8"
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
              <h2 className="text-2xl font-heading font-black text-white tracking-tight uppercase">
                Próximas <span className="text-[#3b82f6]">Sesiones</span>
              </h2>
            </div>
            <Link href="/admin/agenda" className="text-[9px] font-label font-bold text-[#a7abb2] uppercase tracking-[0.2em] hover:text-[#3b82f6] transition-all border-b border-[#1f262e] pb-1">Ver Calendario</Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {(stats?.proximasSesiones || []).map((session: any, i: number) => (
                <motion.div 
                  key={i}
                  className="p-6 bg-[#141a20]/40 rounded-sm border border-[#1f262e] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-[#3b82f6]/20 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#1f262e] text-[#3b82f6] rounded-sm flex items-center justify-center font-heading font-black text-xl border border-[#3b82f6]/10 group-hover:bg-[#3b82f6] group-hover:text-white transition-all duration-300">
                      {session.nombre.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[8px] text-[#a7abb2] font-label font-bold uppercase tracking-widest mb-1">{session.hora}hs · Turno Sincronizado</p>
                      <h4 className="text-xl font-heading font-black text-white tracking-tight uppercase">{session.nombre}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.pacienteId ? (
                      <Link
                        href={`/admin/pacientes?id=${session.pacienteId}`}
                        className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-sm border border-[#1f262e] text-[9px] font-label font-bold uppercase tracking-widest text-[#a7abb2] hover:text-[#eaeef6] hover:bg-[#1a2027] transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" /> Ficha
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-sm border border-[#1f262e] text-[9px] font-label font-bold uppercase tracking-widest text-[#43484e] cursor-not-allowed">
                        <FileText className="w-3.5 h-3.5" /> Ficha
                      </span>
                    )}
                    {session.pacienteId ? (
                      <Link
                        href={`/admin/consulta/${session.pacienteId}`}
                        className="px-6 py-3 min-h-[44px] rounded-sm bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 shadow-lg shadow-[#3b82f6]/10 text-[9px] font-label font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5" /> Iniciar Sesión
                      </Link>
                    ) : (
                      <Link
                        href={`/admin/pacientes?action=new&nombre=${encodeURIComponent(session.nombre)}&email=${encodeURIComponent(session.email)}`}
                        className="px-6 py-3 min-h-[44px] rounded-sm bg-[#1f262e] text-[#a7abb2] border border-[#3b82f6]/20 hover:bg-[#3b82f6] hover:text-white text-[9px] font-label font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                        title="Paciente sin ficha registrada — crear ahora"
                      >
                        <Plus className="w-3.5 h-3.5" /> Crear Ficha
                      </Link>
                    )}
                    {session.pacienteId && (
                      <Link
                        href={`/admin/pacientes?id=${session.pacienteId}`}
                        className="px-6 py-3 min-h-[44px] rounded-sm bg-[#1f262e] text-[#43484e] border border-[#1a2027] text-[9px] font-label font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                      >
                        Ver Perfil
                      </Link>
                    )}
                  </div>
                </motion.div>
            ))}
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0e1419] p-6 md:p-10 rounded-sm text-white border border-[#1f262e] relative overflow-hidden flex flex-col justify-between h-full"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-heading font-black tracking-tight uppercase leading-none">Accesos</h2>
                  <h2 className="text-2xl font-heading font-black tracking-tight uppercase text-white/10">Rápidos</h2>
                </div>
                <div className="w-12 h-12 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center shadow-lg shadow-[#3b82f6]/20">
                   <Zap className="w-6 h-6" />
                </div>
            </div>

            <div className="space-y-3">
                  <Link href="/admin/pacientes?action=new" className="p-5 bg-white/5 hover:bg-[#3b82f6] hover:text-white rounded-sm flex items-center gap-5 transition-all group border border-white/5">
                    <div className="w-10 h-10 bg-[#1f262e] text-[#3b82f6] rounded-sm flex items-center justify-center group-hover:bg-white group-hover:text-[#3b82f6] transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-label font-bold uppercase tracking-widest">Alta de Paciente</span>
                  </Link>
                  <Link href="/admin/agenda" className="p-5 bg-white/5 hover:bg-[#3b82f6] hover:text-white rounded-sm flex items-center gap-5 transition-all group border border-white/5">
                    <div className="w-10 h-10 bg-[#1f262e] text-[#3b82f6] rounded-sm flex items-center justify-center group-hover:bg-white group-hover:text-[#3b82f6] transition-all">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-label font-bold uppercase tracking-widest">Calendario</span>
                  </Link>
                  <Link href="/admin/finanzas" className="p-5 bg-white/5 hover:bg-[#3b82f6] hover:text-white rounded-sm flex items-center gap-5 transition-all group border border-white/5">
                    <div className="w-10 h-10 bg-[#1f262e] text-[#3b82f6] rounded-sm flex items-center justify-center group-hover:bg-white group-hover:text-[#3b82f6] transition-all">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-label font-bold uppercase tracking-widest">Ingresos</span>
                  </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER INDICATOR */}
      <div className="pt-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0e1419] border border-[#1f262e] rounded-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
           <p className="text-[#a7abb2] font-label font-bold uppercase tracking-[0.3em] text-[8px] hidden sm:block">Sistema de Sincronización Profesional Activo</p>
           <p className="text-[#a7abb2] font-label font-bold uppercase tracking-[0.2em] text-[8px] sm:hidden">Sincronización Activa</p>
        </div>
      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Users,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ModalRegistroPago = dynamic(() => import('../../../../components/ModalRegistroPago'), { ssr: false });

export default function FinanzasPage() {
  const [stats, setStats] = useState<any>(null);
  const [recientes, setRecientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [periodo, setPeriodo] = useState<'mes' | 'mes_anterior' | 'anio'>('mes');

  const PERIODOS = [
    { id: 'mes', label: 'Este mes' },
    { id: 'mes_anterior', label: 'Mes anterior' },
    { id: 'anio', label: 'Este año' },
  ] as const;

  const fetchStats = async (p = periodo) => {
    try {
      const res = await fetch(`/api/finance/stats?periodo=${p}`);
      const data = await res.json();
      setStats(data?.stats || null);
      setRecientes(data?.recientes || []);
    } catch (err) {
      setStats(null);
      setRecientes([]);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats('mes');
  }, []);

  const handlePeriodo = (p: typeof periodo) => {
    setPeriodo(p);
    setLoading(true);
    fetchStats(p);
  };

  // No loading spinner as per user request (no animaciones de carga en admin)

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 text-[#eaeef6] px-4 md:px-8 bg-[#0a0f14]">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#3b82f6] font-label text-[10px] uppercase tracking-[0.3em] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" /> Gestión Financiera
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight uppercase leading-none">
            Reporte de <br />
            <span className="text-[#3b82f6]">Rendimiento</span>
          </h1>
          <p className="text-[#a7abb2] font-label font-bold uppercase text-[9px] tracking-widest mt-4">
            Análisis detallado de ingresos y facturación
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 w-full lg:w-auto"
        >
          <div className="relative group flex-1 lg:w-72 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a7abb2]/40 group-focus-within:text-[#3b82f6] transition-colors" />
            <input 
              type="text" 
              placeholder="Filtrar reporte..." 
              className="pl-11 pr-4 py-3 bg-[#0e1419] border border-[#1f262e] rounded-sm focus:border-[#3b82f6]/50 outline-none w-full transition-all font-label uppercase tracking-widest text-base md:text-[10px] text-white placeholder:text-[#a7abb2]/20"
            />
          </div>
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 flex items-center gap-3 px-6 py-3 rounded-sm bg-[#3b82f6] text-white text-[10px] font-label font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#3b82f6]/10 hover:bg-[#3b82f6]/90 transition-all font-bold"
          >
            <Plus className="w-4 h-4" /> Nuevo Registro
          </motion.button>
        </motion.div>
      </header>

      {/* OPERATIONAL RANGE SELECTOR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-[#1f262e]">
        <div className="flex items-center gap-2 p-1 bg-[#0e1419] border border-[#1f262e] rounded-sm shadow-inner">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePeriodo(p.id)}
              className={clsx(
                "px-4 py-2 rounded-sm text-[10px] font-label font-bold uppercase tracking-[0.1em] transition-all duration-300",
                periodo === p.id
                  ? 'bg-[#3b82f6] text-white shadow-md shadow-[#3b82f6]/10'
                  : 'text-[#a7abb2] hover:text-white hover:bg-[#1f262e]'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[#a7abb2] text-[10px] font-label font-bold uppercase tracking-[0.1em]">
          <Calendar className="w-4 h-4 opacity-60" />
          <span>Periodo: <span className="text-white">{PERIODOS.find(p => p.id === periodo)?.label}</span></span>
        </div>
      </div>

      {/* CORE TELEMETRY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Ingresos Totales', value: `$${(stats?.totalHistorico || 0).toLocaleString()}`, growth: '+15.2%', icon: TrendingUp, accent: true, trend: 'En aumento' },
          { label: 'Sesiones Totales', value: stats?.count || 0, growth: '+8.1%', icon: CreditCard, accent: false, trend: 'Sostenido' },
          { label: 'Ticket Promedio', value: `$${Math.round((stats?.totalHistorico || 0) / (stats?.count || 1)).toLocaleString()}`, growth: '+2.4%', icon: DollarSign, accent: false, trend: 'Estable' },
          { label: 'Cumplimiento', value: '100.0%', growth: '+1.2%', icon: Users, accent: false, trend: 'Alta' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={clsx(
              "p-5 md:p-6 rounded-sm border transition-all duration-300 relative overflow-hidden group h-full flex flex-col justify-between",
              stat.accent 
                ? "bg-[#3b82f6] border-[#3b82f6] text-white shadow-xl shadow-[#3b82f6]/10" 
                : "bg-[#0e1419] border-[#1f262e] text-[#eaeef6] hover:border-[#3b82f6]/30"
            )}
          >
            <div className="flex flex-col gap-8 h-full">
              <div className={clsx(
                "w-12 h-12 rounded-sm flex items-center justify-center border",
                stat.accent ? "bg-white/10 border-white/20 text-white" : "bg-[#1f262e] border-[#1a2027] text-[#3b82f6]"
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className={clsx(
                  "text-[9px] font-label font-bold uppercase tracking-[0.2em]",
                  stat.accent ? "text-white/60" : "text-[#a7abb2]"
                )}>{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-heading font-black tracking-tight leading-none">{stat.value || '0'}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={clsx(
                  "px-3 py-1 rounded-sm text-[8px] font-label font-bold uppercase tracking-widest border",
                  stat.accent ? "bg-white/10 border-white/20 text-white" : "bg-[#1f262e] border-[#1a2027] text-[#3b82f6]"
                )}>
                  {stat.growth}
                </span>
                <span className={clsx("text-[8px] font-label font-bold uppercase tracking-widest", stat.accent ? "text-white/40" : "text-[#43484e]")}>
                   {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CHART SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-[#0e1419] p-6 md:p-10 rounded-sm border border-[#1f262e] shadow-xl space-y-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
               <h2 className="text-2xl font-heading font-black text-white tracking-tight uppercase">Historial de <span className="text-[#3b82f6]">Ingresos</span></h2>
            </div>
          </div>
          <div className="h-[400px] w-full bg-[#141a20]/40 rounded-sm border border-[#1f262e] flex flex-col items-center justify-center border-dashed relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-[#3b82f6]/5 to-transparent pointer-events-none" />
             <div className="flex flex-col items-center gap-6 opacity-20">
                <PieChartIcon className="w-20 h-20 text-white" />
                <p className="text-[10px] font-label font-bold uppercase tracking-[0.4em] text-white text-center">Gráficos de Rendimiento Activos</p>
             </div>
          </div>
        </motion.div>

        {/* SIDEBAR: RECENT MOVEMENTS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0e1419] p-8 md:p-10 rounded-sm border border-[#1f262e] shadow-xl space-y-10"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-black text-white tracking-tight uppercase">Últimos <span className="text-[#3b82f6]">Movimientos</span></h2>
            <div className="w-10 h-1 bg-[#3b82f6]/20" />
          </div>

          <div className="space-y-4">
            {recientes?.map((move, i) => (
              <div key={i} className="group p-5 bg-[#141a20]/40 border border-[#1f262e] rounded-sm hover:border-[#3b82f6]/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-heading font-black text-white tracking-tight uppercase">{move.concepto}</h4>
                  <span className="text-sm font-heading font-black text-[#3b82f6]">+${move.monto.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-label font-bold text-[#a7abb2] tracking-widest uppercase">{new Date(move.fecha).toLocaleDateString()}</p>
                  <span className="text-[8px] font-label font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20">{move.metodo}</span>
                </div>
              </div>
            ))}
            {recientes.length === 0 && (
              <div className="text-center py-20 opacity-20 text-[9px] font-label font-bold uppercase tracking-widest">No hay movimientos registrados</div>
            )}
          </div>
        </motion.div>
      </div>

      {showModal && (
        <ModalRegistroPago 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            fetchStats();
          }} 
        />
      )}
    </div>
  );
}

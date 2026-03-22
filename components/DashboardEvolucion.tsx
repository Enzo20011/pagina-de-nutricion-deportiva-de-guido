'use client';

import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Target, 
  ArrowUpRight,
  History,
  Info,
  Download,
  Sparkles,
  Zap,
  Scale
} from 'lucide-react';
import BotonCompartir from './BotonCompartir';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export default function DashboardEvolucion({ pacienteId }: { pacienteId: string }) {
  // Query DB History
  const { data: historialDb, isLoading } = useQuery({
    queryKey: ['historial-antropometria', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/antropometria?pacienteId=${pacienteId}`);
      const json = await res.json();
      return json.data || [];
    }
  });

  const historial = (historialDb && historialDb.length > 0) 
    ? historialDb.map((entry: any) => ({
        fecha: new Date(entry.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        peso: entry.peso || 0,
        grasa: entry.resultados?.porcentajeGrasa || 0,
        masaMagra: entry.resultados?.masaMagraKg || 0
      }))
    : [{ fecha: 'Sin Datos', peso: 0, grasa: 0, masaMagra: 0 }];

  const actual = historial[historial.length - 1];
  const anterior = historial.length > 1 ? historial[historial.length - 2] : actual;

  const deltaPeso = actual.peso > 0 ? (actual.peso - anterior.peso).toFixed(1) : '-';
  const deltaGrasa = actual.grasa > 0 ? (actual.grasa - anterior.grasa).toFixed(1) : '-';
  const magraActual = actual.masaMagra > 0 ? actual.masaMagra.toFixed(1) : '-';
  const deltaMagra = actual.masaMagra > 0 ? (actual.masaMagra - anterior.masaMagra).toFixed(1) : '-';

  const dataCompartir = {
    paciente: 'Paciente Activo',
    peso: actual.peso,
    grasa: actual.grasa,
    get: 2150 // Mocked for now
  };

  return (
    <div className="space-y-12 pb-20 text-bone selection:bg-accentBlue/20">
      
      {/* HEADER DASHBOARD - PREMIUM NAVY */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-white/[0.03] backdrop-blur-md p-10 lg:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accentBlue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-6 bg-darkNavy text-white rounded-[2.5rem] shadow-2xl border border-white/5 group-hover:scale-110 transition-transform duration-700">
            <Activity className="w-10 h-10 text-accentBlue" />
          </div>
          <div>
             <div className="flex items-center gap-2 text-accentBlue font-black uppercase text-xs tracking-[0.4em] mb-4">
               <Sparkles className="w-4 h-4 opacity-80" /> Reporte de Rendimiento Elite
             </div>
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9] italic mb-6">Evolución <br /> <span className="text-white/40 not-italic">Clínica.</span></h2>
             <div className="bg-emerald-500/10 text-emerald-400 px-6 py-2.5 rounded-2xl text-xs font-black inline-flex items-center gap-3 uppercase tracking-widest border border-emerald-500/20 shadow-lg">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Adherencia al Protocolo: 100%
             </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10 w-full lg:w-auto">
          <BotonCompartir data={dataCompartir} />
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 lg:flex-none bg-white text-navy hover:bg-accentBlue hover:text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all shadow-2xl"
          >
            <Download className="w-5 h-5" /> Exportar Plan
          </motion.button>
        </div>
      </header>

      {/* METRICS GRID - HIGH IMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Peso Corporal', val: actual.peso || '-', unit: 'KG', delta: Number(deltaPeso) > 0 ? `+${deltaPeso}` : deltaPeso, icon: Scale, trend: Number(deltaPeso) <= 0 ? 'down' : 'up', color: 'text-emerald-400', bg: 'bg-darkNavy/50' },
          { label: 'Grasa Adiposa', val: actual.grasa?.toFixed(1) || '-', unit: '%', delta: Number(deltaGrasa) > 0 ? `+${deltaGrasa}` : deltaGrasa, icon: Zap, trend: Number(deltaGrasa) <= 0 ? 'down' : 'up', color: 'text-emerald-400', bg: 'bg-darkNavy/50' },
          { label: 'Masa Magra', val: magraActual, unit: 'KG', delta: Number(deltaMagra) > 0 ? `+${deltaMagra}` : deltaMagra, icon: ArrowUpRight, trend: Number(deltaMagra) >= 0 ? 'up' : 'down', color: 'text-accentBlue', bg: 'bg-accentBlue/5' },
          { label: 'Ingesta Sugerida', val: dataCompartir.get, unit: 'KCAL', delta: 'Objetivo OK', icon: Target, trend: 'stable', color: 'text-slate-500', bg: 'bg-darkNavy/50' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={clsx(
              "p-10 rounded-[3rem] border shadow-2xl transition-all duration-500 group relative overflow-hidden backdrop-blur-md",
              stat.bg,
              stat.bg === 'bg-accentBlue/5' ? 'border-accentBlue/20' : 'border-white/5 hover:border-white/10'
            )}
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[60px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700" />
             <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 leading-none group-hover:text-white transition-colors">{stat.label}</p>
             <h4 className="text-4xl font-black text-white mb-8 italic tracking-tighter leading-none">{stat.val} <span className="text-sm opacity-20 italic ml-1">{stat.unit}</span></h4>
             <div className={clsx(
               "flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-inner transition-transform group-hover:translate-y-[-2px]",
               stat.color,
               stat.color === 'text-emerald-400' ? 'bg-emerald-500/10 border-emerald-500/10' : 
               stat.color === 'text-accentBlue' ? 'bg-accentBlue/10 border-accentBlue/10' : 'bg-white/5 border-white/10'
             )}>
                {stat.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <Target className="w-4 h-4" />} 
                {stat.delta} {stat.unit === 'KCAL' ? '' : 'vs Anterior'}
             </div>
          </motion.div>
        ))}
      </div>

      {/* HISTORY TABLE - PREMIUM NAVY */}
      <div className="bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl relative backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accentBlue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <h3 className="font-black text-white uppercase italic tracking-tighter flex items-center gap-6 text-2xl">
             <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center border border-white/5 shadow-inner group">
                <History className="w-7 h-7 text-accentBlue group-hover:rotate-[-45deg] transition-transform duration-700" />
             </div>
             Índice de Evolución <span className="text-white/20 not-italic">Antropométrica</span>
          </h3>
          <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-white transition-colors">Digitalizar Historial Completo</button>
        </div>
        
        <div className="overflow-x-auto relative z-10 px-6 pb-6">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
                <th className="px-10 py-6">Fecha Control</th>
                <th className="px-10 py-6">Masa (KG)</th>
                <th className="px-10 py-6">Grasa (%)</th>
                <th className="px-10 py-6">Magro (KG)</th>
                <th className="px-10 py-6 text-right">Estatus Clínico</th>
              </tr>
            </thead>
            <tbody className="">
              {historial.map((entry, i) => (
                <tr key={i} className="hover:translate-x-1 transition-all group bg-navy/40 rounded-3xl">
                  <td className="px-10 py-8 text-sm font-black text-white/50 group-hover:text-white uppercase tracking-tighter italic border-y border-l border-white/5 rounded-l-[2.5rem]">{entry.fecha}</td>
                  <td className="px-10 py-8 border-y border-white/5">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-white tracking-tighter leading-none italic group-hover:text-accentBlue transition-colors">{entry.peso}</span>
                        <span className="text-[10px] font-black text-white/10 uppercase italic leading-none pt-1">KG</span>
                     </div>
                  </td>
                  <td className="px-10 py-8 border-y border-white/5">
                     <span className="text-xl font-black text-white italic tracking-tighter leading-none">{entry.grasa ? entry.grasa.toFixed(1) : '-'}<span className="text-xs opacity-20 ml-1">%</span></span>
                  </td>
                  <td className="px-10 py-8 text-sm font-black text-white/20 italic border-y border-white/5">{entry.masaMagra ? entry.masaMagra.toFixed(1) : '-'} KG</td>
                  <td className="px-10 py-8 text-right border-y border-r border-white/5 rounded-r-[2.5rem]">
                    <span className="px-6 py-2.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-2xl uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">OPTIMIZACIÓN ALTA</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPECIALIST OBSERVATION */}
      <div className="bg-darkNavy/80 p-12 rounded-[4rem] border border-white/5 flex flex-col lg:flex-row items-center gap-10 shadow-2xl group transition-all relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accentBlue/5 rounded-full blur-[80px]" />
        <div className="p-8 bg-white/5 rounded-[2.5rem] shadow-inner text-accentBlue group-hover:scale-105 transition-transform duration-700 relative z-10 border border-white/10">
          <Info className="w-14 h-14" />
        </div>
        <div className="space-y-4 flex-1 text-center lg:text-left relative z-10">
          <div className="flex items-center justify-center lg:justify-start gap-4">
             <div className="w-2.5 h-2.5 rounded-full bg-accentBlue animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
             <h5 className="font-black text-white uppercase tracking-tighter italic text-2xl leading-none">Dictamen del Especialista</h5>
          </div>
          <p className="text-sm text-bone/40 leading-relaxed italic font-bold max-w-5xl">
            "El perfil metabólico demuestra una respuesta excepcional al protocolo. Se valida la reducción de la densidad adiposa en zonas críticas. La síntesis proteica se mantiene estable con un balance nitrogenado positivo. Se recomienda mantener el protocolo de micro-nutrición elite y el esquema de carga actual por 4 semanas adicionales."
          </p>
        </div>
        <div className="w-full lg:w-auto relative z-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-12 py-6 bg-white text-darkNavy hover:bg-accentBlue hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all"
          >
            Imprimir Certificación
          </motion.button>
        </div>
      </div>

    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

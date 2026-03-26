'use client';

import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Target, 
  ArrowUpRight,
  History,
  Sparkles,
  Zap,
  Scale
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';

export default function DashboardEvolucion({ 
  pacienteId, 
  paciente, 
  sessionData 
}: { 
  pacienteId: string, 
  paciente: any, 
  sessionData: any 
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Query DB History
  const { data: historialDb, isLoading } = useQuery({
    queryKey: ['historial-antropometria', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/biometria?pacienteId=${pacienteId}`);
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

  // Extract GEB/Maintenance from sessionData (PanelClinico results)
  const getCalculated = sessionData?.anamnesis?.targetKcal || sessionData?.anamnesis?.resultados?.mantenimiento || 2000;



  return (
    <div className="space-y-12 pb-20 text-bone selection:bg-accentBlue/20">
      
      {/* HEADER DASHBOARD */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/5 p-6 rounded-sm border border-white/5 shadow-xl relative overflow-hidden group">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-14 h-14 bg-[#3b82f6] text-white rounded-sm shadow-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-700">
            <Activity className="w-8 h-8" />
          </div>
          <div>
             <div className="flex items-center gap-2 text-[#3b82f6] font-bold uppercase text-[10px] tracking-widest mb-2">
               <Sparkles className="w-4 h-4" /> Reporte de Evolución
             </div>
             <h2 className="text-xl font-bold text-white uppercase tracking-tight leading-none">Historial de <span className="text-white/40 font-medium">Progreso</span></h2>
             <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Estado Actual: En Proceso</span>
             </div>
          </div>
        </div>
      </header>

      {/* METRICS GRID - HIGH IMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Peso Corporal', val: actual.peso || '-', unit: 'KG', delta: Number(deltaPeso) > 0 ? `+${deltaPeso}` : deltaPeso, icon: Scale, trend: Number(deltaPeso) <= 0 ? 'down' : 'up', color: 'text-emerald-400', bg: 'bg-white/5' },
          { label: 'Grasa Adiposa', val: actual.grasa?.toFixed(1) || '-', unit: '%', delta: Number(deltaGrasa) > 0 ? `+${deltaGrasa}` : deltaGrasa, icon: Zap, trend: Number(deltaGrasa) <= 0 ? 'down' : 'up', color: 'text-emerald-400', bg: 'bg-white/5' },
          { label: 'Masa Magra', val: magraActual, unit: 'KG', delta: Number(deltaMagra) > 0 ? `+${deltaMagra}` : deltaMagra, icon: ArrowUpRight, trend: Number(deltaMagra) >= 0 ? 'up' : 'down', color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/5' },
          { label: 'Ingesta Sugerida', val: Math.round(getCalculated), unit: 'KCAL', delta: 'Objetivo OK', icon: Target, trend: 'stable', color: 'text-white/20', bg: 'bg-white/5' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={clsx(
              "p-6 rounded-sm border shadow-xl transition-all duration-500 group relative overflow-hidden",
              stat.bg,
              stat.bg === 'bg-[#3b82f6]/5' ? 'border-[#3b82f6]/30' : 'border-white/5 hover:border-white/10'
            )}
          >
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 group-hover:text-white/40 transition-colors">{stat.label}</p>
             <h4 className="text-2xl font-bold text-white mb-6 tracking-tight leading-none">{stat.val} <span className="text-sm opacity-20 font-medium ml-1">{stat.unit}</span></h4>
             <div className={clsx(
               "flex items-center gap-2 px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest border transition-transform",
               stat.color,
               stat.color === 'text-emerald-400' ? 'bg-emerald-500/10 border-emerald-500/10' : 
               stat.color === 'text-[#3b82f6]' ? 'bg-[#3b82f6]/10 border-[#3b82f6]/10' : 'bg-white/5 border-white/10'
             )}>
                {stat.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : stat.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <Target className="w-3.5 h-3.5" />} 
                {stat.delta} {stat.unit === 'KCAL' ? '' : 'vs Ant.'}
             </div>
          </motion.div>
        ))}
      </div>

      {/* CHART SECTION - VISUAL PERFORMANCE */}
      <div className="bg-white/5 p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-10 relative z-10">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-[#3b82f6]" />
            Tendencia de Evolución
          </h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest">Peso (KG)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest">Grasa (%)</span>
             </div>
          </div>
        </div>

        <div className="h-[350px] w-full relative z-10" style={{ minHeight: '350px' }}>
          {mounted && historial.length > 1 && historial[0].fecha !== 'Sin Datos' ? (
            <ResponsiveContainer width="100%" height="100%" debounce={1}>
              <LineChart data={historial}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="fecha" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight="black" 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight="black" 
                  tickLine={false} 
                  axisLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  fontWeight="black" 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 40]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} 
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="grasa" 
                  stroke="#ffffff" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }} 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="masaMagra" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ fill: '#10B981', r: 4 }} 
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
              </LineChart>
            </ResponsiveContainer>
          ) : !mounted ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-center px-8">
               <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5">
                 <History className="w-10 h-10 text-accentBlue/30" />
               </div>
               <div className="space-y-2">
                 <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
                   Necesitás mínimo 2 controles
                 </p>
                 <p className="text-xs text-slate-600 font-medium max-w-xs">
                   Registrá una segunda medición en la pestaña <span className="text-accentBlue font-black">Medidas</span> para visualizar la progresión.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* METABOLIC HISTORY - NEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white/5 p-6 rounded-sm border border-white/5 shadow-xl space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6] flex items-center gap-2">
                 <Zap className="w-4 h-4" /> Evolución del Gasto Energético
              </h3>
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">Mantenimiento vs Base</span>
           </div>
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-sm border border-white/5 flex flex-col items-center gap-1">
                 <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Inicial</span>
                 <span className="text-lg font-bold text-white">{historial[0]?.peso || 0} <span className="text-[10px] opacity-10">KG</span></span>
              </div>
              <div className="bg-[#3b82f6]/10 p-4 rounded-sm border border-[#3b82f6]/20 flex flex-col items-center gap-1">
                 <span className="text-[8px] font-bold text-[#3b82f6] uppercase tracking-widest">Actual</span>
                 <span className="text-lg font-bold text-white">{actual.peso} <span className="text-[10px] opacity-10">KG</span></span>
              </div>
              <div className="bg-emerald-500/10 p-4 rounded-sm border border-emerald-500/20 flex flex-col items-center gap-1">
                 <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Cambio</span>
                 <span className="text-lg font-bold text-white">{((actual.peso - (historial[0]?.peso || actual.peso))).toFixed(1)} <span className="text-[10px] opacity-10">KG</span></span>
              </div>
           </div>
        </div>
        
        <div className="lg:col-span-4 bg-[#3b82f6] p-6 rounded-sm shadow-xl flex flex-col justify-center space-y-4 relative overflow-hidden">
           <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Objetivo Performance</p>
           <h4 className="text-2xl font-bold text-white uppercase tracking-tight leading-none">Carga Progresiva</h4>
           <p className="text-[11px] text-white/70 font-medium leading-relaxed">
             El balance sugiere una optimización positiva en la síntesis proteica y composición corporal.
           </p>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white/5 rounded-sm border border-white/5 overflow-hidden shadow-xl relative">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <h3 className="font-bold text-white uppercase tracking-tight flex items-center gap-4 text-lg">
             <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 shadow-inner group">
                <History className="w-6 h-6 text-[#3b82f6] group-hover:rotate-[-12deg] transition-transform duration-700" />
             </div>
             Historial de Mediciones
          </h3>
          <button className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">Digitalizar Historial</button>
        </div>
        
        <div className="overflow-x-auto relative z-10 px-6 pb-6">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
                <th className="px-6 py-4">Fecha Control</th>
                <th className="px-6 py-4">Masa (KG)</th>
                <th className="px-6 py-4">Grasa (%)</th>
                <th className="px-6 py-4">Magro (KG)</th>
                <th className="px-6 py-4 text-right">Estatus Clínico</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((entry, i) => (
                <tr key={i} className="hover:bg-white/5 transition-all group rounded-sm">
                  <td className="px-6 py-4 text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-tight border-y border-l border-white/5 rounded-l-sm">{entry.fecha}</td>
                  <td className="px-6 py-4 border-y border-white/5">
                     <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white tracking-tight group-hover:text-[#3b82f6] transition-colors">{entry.peso}</span>
                        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest pt-1">KG</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 border-y border-white/5">
                     <span className="text-base font-bold text-white tracking-tight">{entry.grasa ? entry.grasa.toFixed(1) : '-'}<span className="text-xs opacity-20 ml-1">%</span></span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-white/20 border-y border-white/5">{entry.masaMagra ? entry.masaMagra.toFixed(1) : '-'} KG</td>
                  <td className="px-6 py-4 text-right border-y border-r border-white/5 rounded-r-sm">
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded-sm uppercase tracking-widest border border-emerald-500/10 shadow-sm">ESTABLE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

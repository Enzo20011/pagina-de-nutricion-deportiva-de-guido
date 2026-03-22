'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  Plus, 
  Search,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import ModalRegistroPago from '../../../../components/ModalRegistroPago';

export default function FinanzasPage() {
  const [stats, setStats] = useState<any>(null);
  const [recientes, setRecientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/finance/stats');
      const data = await res.json();
      setStats(data.stats);
      setRecientes(data.recientes);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentBlue"></div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 text-bone">
      {/* HEADER TÁCTICO */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 bg-cardDark/60 backdrop-blur-3xl p-12 lg:p-14 rounded-[3.5rem] border border-white/10 shadow-3xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-80 h-80 bg-accentBlue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accentBlue/10 transition-colors" />
         
         <div className="relative z-10">
           <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-accentBlue/20 rounded-2xl border border-accentBlue/30">
               <TrendingUp className="w-8 h-8 text-accentBlue" />
             </div>
             <div className="px-5 py-1.5 bg-accentBlue/10 border border-accentBlue/20 rounded-full text-accentBlue text-sm font-black tracking-[0.2em] uppercase italic">Financial Command</div>
           </div>
           <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
             Gestor <span className="text-accentBlue not-italic">Financiero</span>
           </h1>
           <p className="text-slate-400 mt-6 text-xl max-w-2xl font-medium leading-relaxed">
             Conciliación omnicanal de ingresos y monitoreo de flujo de caja en tiempo real.
           </p>
         </div>

         <div className="flex gap-4 relative z-10">
           <button 
             onClick={() => setShowModal(true)}
             className="flex items-center gap-3 px-8 py-5 bg-accentBlue hover:bg-accentBlue/90 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest transition-all shadow-[0_15px_35px_-10px_rgba(59,130,246,0.5)] active:scale-95 group"
           >
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
             Registro Manual
           </button>
           <button className="flex items-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest transition-all border border-white/10 shadow-xl active:scale-95">
             <Download className="w-5 h-5" />
             Reporte
           </button>
         </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Ingresos Totales', value: `$${stats?.totalHistorico?.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Transacciones', value: stats?.count, icon: ArrowUpRight, color: 'text-accentBlue', bg: 'bg-accentBlue/10' },
          { label: 'Ticket Promedio', value: `$${Math.round(stats?.totalHistorico / stats?.count || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Conciliación', value: '100%', icon: PieChart, color: 'text-purple-400', bg: 'bg-purple-400/10' }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-cardDark/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className={`p-4 ${kpi.bg} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
              <kpi.icon className={`w-7 h-7 ${kpi.color}`} />
            </div>
            <div className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">{kpi.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter italic">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* GRÁFICO POR CATEGORÍA */}
        <div className="xl:col-span-8 bg-cardDark/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Distribución de Ingresos</h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Por canal y categoría</p>
            </div>
            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10">
              <button className="px-6 py-2 bg-accentBlue text-white rounded-xl font-bold text-sm tracking-tight shadow-lg">Categoría</button>
              <button className="px-6 py-2 text-slate-400 rounded-xl font-bold text-sm tracking-tight">Método</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(stats?.porCategoria || {}).map(([cat, val]: any, i) => (
              <div key={cat} className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 text-center">
                <div className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-2">{cat}</div>
                <div className="text-2xl font-black text-white italic tracking-tighter">$ {val.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ÚLTIMOS MOVIMIENTOS */}
        <div className="xl:col-span-4 bg-cardDark/40 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">Movimientos <span className="text-accentBlue">Recientes</span></h2>
          <div className="space-y-6">
            {recientes.map((mov, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-all">
                <div>
                  <div className="font-black text-white tracking-tight uppercase italic">{mov.concepto}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{mov.metodo} • {new Date(mov.fecha).toLocaleDateString()}</div>
                </div>
                <div className="text-lg font-black text-emerald-400 italic">+$ {mov.monto.toLocaleString()}</div>
              </div>
            ))}
            {recientes.length === 0 && (
              <div className="text-center py-10 text-slate-500 font-bold uppercase tracking-widest text-sm italic">Sin movimientos registrados</div>
            )}
          </div>
        </div>
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

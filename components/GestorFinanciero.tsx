'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Plus, 
  CheckCircle2,
  Clock,
  Filter,
  Activity,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';

const MOCK_INGRESOS = [
  { id: '1', paciente: 'Juan Pérez', monto: 2500, metodo: 'Mercado Pago', estado: 'Pagado', fecha: 'Hoy, 10:30', concepto: 'Seña Turno' },
  { id: '2', paciente: 'María López', monto: 15000, metodo: 'Efectivo', estado: 'Pagado', fecha: 'Hoy, 12:45', concepto: 'Consulta Completa' },
  { id: '3', paciente: 'Carlos Ruiz', monto: 2500, metodo: 'Mercado Pago', estado: 'Pendiente', fecha: 'Mañana, 09:00', concepto: 'Seña Turno' },
  { id: '4', paciente: 'Ana García', monto: 12500, metodo: 'Transferencia', estado: 'Pagado', fecha: 'Ayer, 18:20', concepto: 'Planificar Dieta' },
];

export default function GestorFinanciero() {
  const [ingresos, setIngresos] = useState(MOCK_INGRESOS);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 text-bone selection:bg-accentBlue/20">
      
      {/* HEADER ELITE FINANCE */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 text-accentBlue font-bold uppercase text-[10px] tracking-[0.4em]">
             <Sparkles className="w-4 h-4 opacity-50" /> Consola de Evolución Financiera
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
            Gestor <br />
            <span className="text-accentBlue not-italic">Elite.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            Mercado Pago & Cash Flow Sincronizado
          </p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className="relative overflow-hidden bg-accentBlue text-white hover:bg-accentBlue/90 px-6 py-4 lg:px-10 lg:py-5 rounded-[2rem] text-[10px] lg:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_15px_40px_rgba(59,130,246,0.3)] border border-white/20 w-full lg:w-auto"
        >
           <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-loop pointer-events-none" />
           <Plus className="w-5 h-5 text-white" /> <span className="relative">Nuevo Registro</span>
        </motion.button>
      </header>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         <motion.div 
            whileHover={{ y: -8 }}
            className="bg-cardDark/40 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group backdrop-blur-3xl"
         >
            <div className="absolute top-0 right-0 w-48 h-48 bg-accentBlue/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 space-y-10">
               <div className="w-16 h-16 bg-darkNavy text-accentBlue rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-xl border border-white/5">
                  <Wallet className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-6xl font-black tracking-tighter italic text-white">$342.500</h3>
                  <div className="flex items-center gap-4 mt-6">
                     <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> +12%
                     </span>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">vs Mes Anterior</p>
                  </div>
               </div>
            </div>
         </motion.div>

         <motion.div 
            whileHover={{ y: -8 }}
            className="bg-cardDark/40 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10 group backdrop-blur-3xl"
         >
            <div className="w-16 h-16 bg-darkNavy text-blue-400 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-xl border border-white/5">
               <Globe className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-5xl font-black tracking-tighter italic text-white">$128.000</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-6 italic">Vía Mercado Pago</p>
            </div>
         </motion.div>

         <motion.div 
            whileHover={{ y: -8 }}
            className="bg-cardDark/40 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10 group backdrop-blur-3xl"
         >
            <div className="w-16 h-16 bg-darkNavy text-emerald-400 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-xl border border-white/5">
               <CreditCard className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-5xl font-black tracking-tighter italic text-white">$214.500</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-6 italic">Efectivo / Transf.</p>
            </div>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
         {/* TABLE INTEGRATION */}
         <div className="xl:col-span-8 space-y-10">
            <div className="bg-cardDark/40 rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-3xl">
               <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-5 text-white">
                     <Activity className="w-8 h-8 text-accentBlue border border-white/10 p-1.5 rounded-lg" /> Movimientos
                  </h2>
                  <div className="flex gap-4">
                     <button className="p-4 bg-darkNavy rounded-2xl text-slate-500 hover:text-white transition-all border border-white/5 shadow-inner">
                        <Filter className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-white/5">
                        <tr className="text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                           <th className="px-12 py-8">Detalle Paciente</th>
                           <th className="px-12 py-8">Concepto</th>
                           <th className="px-12 py-8 text-right">Monto</th>
                           <th className="px-12 py-8">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {ingresos.map((item) => (
                           <tr key={item.id} className="hover:bg-white/5 transition-all group cursor-default">
                              <td className="px-12 py-10">
                                 <p className="font-black text-white uppercase text-sm tracking-tight italic group-hover:text-accentBlue transition-colors">{item.paciente}</p>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">{item.fecha}</p>
                              </td>
                              <td className="px-12 py-10">
                                 <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{item.concepto}</span>
                                    <span className="text-[9px] font-bold text-accentBlue/40 uppercase tracking-widest italic">{item.metodo}</span>
                                 </div>
                              </td>
                              <td className="px-12 py-10 text-right">
                                 <span className="text-3xl font-black text-white tracking-tighter italic group-hover:scale-110 inline-block transition-transform">${item.monto}</span>
                              </td>
                              <td className="px-12 py-10">
                                 <div className={clsx(
                                    "inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg",
                                    item.estado === 'Pagado' 
                                     ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                                     : 'bg-accentBlue/10 text-accentBlue border-accentBlue/10 animate-pulse'
                                 )}>
                                    {item.estado === 'Pagado' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    {item.estado}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* LATERAL ALERTS */}
         <div className="xl:col-span-4 space-y-10">
            <div className="bg-cardDark/40 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-12 backdrop-blur-3xl">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                  <Sparkles className="w-6 h-6 text-accentBlue" /> Automatización
               </h3>
               <div className="space-y-8">
                  <div className="p-10 bg-darkNavy/50 rounded-[3rem] border border-white/5 space-y-6 shadow-inner relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex items-center justify-between relative z-10">
                        <p className="text-[11px] font-black text-accentBlue uppercase tracking-[0.5em]">Conciliador MP</p>
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Activo</span>
                        </div>
                     </div>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic relative z-10">
                        Validación de señas automática. Sistema sincronizado vía V.3 Webhooks.
                     </p>
                  </div>

                  <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-8 backdrop-blur-md">
                     <p className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Próximos Cobros</p>
                     <div className="space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="flex justify-between items-center bg-darkNavy p-5 rounded-2xl border border-white/5 group hover:border-accentBlue/30 transition-all shadow-xl">
                             <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Turno #882{i}</span>
                                <span className="text-[8px] text-accentBlue/40 uppercase tracking-widest font-black">Pendiente</span>
                             </div>
                             <span className="text-xl font-black text-white italic tracking-tighter shadow-sm group-hover:text-accentBlue transition-colors">$2.500</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

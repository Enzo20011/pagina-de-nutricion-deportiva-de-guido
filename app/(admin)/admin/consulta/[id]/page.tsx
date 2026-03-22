'use client';

import React, { useState } from 'react';
import PanelClinico from '@/components/PanelClinico';
import PanelAntropometria from '@/components/PanelAntropometria';
import PlanAlimentario from '@/components/PlanAlimentario';
import DashboardEvolucion from '@/components/DashboardEvolucion';
import { 
  User, 
  ClipboardList, 
  Ruler, 
  ChevronLeft,
  Calendar,
  Utensils,
  TrendingUp,
  Sparkles,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';

export default function ConsultaPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'anamnesis' | 'antropometria' | 'dieta' | 'evolucion'>('anamnesis');
  const [consultaData, setConsultaData] = useState({
    anamnesis: null,
    antropometria: null,
    dieta: null
  });

  const { data: paciente, isLoading } = useQuery({
    queryKey: ['paciente', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/pacientes/${params.id}`);
      if (!res.ok) throw new Error('Error al cargar paciente');
      return res.json();
    }
  });

  if (isLoading) return <Loader />;
  if (!paciente) return <div className="p-10 text-center text-white font-black text-xl">Paciente no encontrado.</div>;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 text-bone selection:bg-accentBlue/20">
      
      {/* HEADER DE IMPRESIÓN (Solo visible en PDF) */}
      <div className="print-header">
        <div className="flex justify-between items-end border-b-2 border-accentBlue pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Guido <span className="text-accentBlue">Nutrición</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Protocolo Clínico de Alta Performance</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black uppercase tracking-widest text-[#0f172a]">Paciente: {paciente.nombre} {paciente.apellido}</p>
            <p className="text-[10px] font-bold text-accentBlue mt-1 uppercase">Fecha: {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* HEADER CONSULTA - PREMIUM ELITE */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 bg-cardDark/60 backdrop-blur-3xl p-12 lg:p-14 rounded-[3.5rem] border border-white/10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accentBlue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col md:flex-row md:items-center gap-10 relative z-10">
          <Link href="/admin/pacientes" className="w-16 h-16 bg-darkNavy rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:border-accentBlue/50 border border-white/5 transition-all shadow-2xl group">
             <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-darkNavy rounded-[2.5rem] border border-white/5 flex items-center justify-center text-accentBlue shadow-2xl group relative overflow-hidden">
               <div className="absolute inset-0 bg-accentBlue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <User className="w-12 h-12 relative z-10" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-accentBlue font-black uppercase text-[10px] tracking-[0.5em] opacity-80">
                <Sparkles className="w-4 h-4" /> SECTOR EVOLUCIÓN
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">{paciente.nombre} <span className="text-white/40 not-italic">{paciente.apellido}.</span></h1>
              <div className="flex items-center gap-6">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.4em] flex items-center gap-3">
                   <Calendar className="w-4 h-4 text-accentBlue/50" /> {new Date(paciente.createdAt || Date.now()).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()} • PROTOCOLO {paciente.status?.toUpperCase() || 'ACTIVO'}
                </p>
                <button 
                  onClick={async () => {
                    const { exportarConsultaLazy } = await import('@/utils/exportPdfAction');
                    await exportarConsultaLazy(paciente, consultaData);
                  }}
                  className="bg-accentBlue border border-accentBlue/50 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  <FileText className="w-4 h-4" /> Exportar Sesión PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex bg-darkNavy/80 p-3 rounded-[2rem] border border-white/5 relative z-10 shadow-inner backdrop-blur-3xl">
          {[
            { id: 'anamnesis', label: 'Historial', icon: ClipboardList },
            { id: 'antropometria', label: 'Medidas', icon: Ruler },
            { id: 'dieta', label: 'Plan', icon: Utensils },
            { id: 'evolucion', label: 'Evolución', icon: TrendingUp },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 relative overflow-hidden",
                activeTab === tab.id 
                ? 'bg-white text-darkNavy shadow-[0_10px_30px_-5px_rgba(255,255,255,0.2)]' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              )}
            >
              <tab.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* DINAMIC CONTENT AREA */}
      <motion.main 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[700px]"
      >
        <div className="bg-cardDark/40 rounded-[4rem] border border-white/5 p-6 shadow-3xl backdrop-blur-3xl overflow-hidden min-h-[700px]">
           <div className="bg-darkNavy/40 rounded-[3.5rem] p-12 lg:p-16 min-h-[600px] shadow-inner border border-white/5">
             <div className={activeTab === 'anamnesis' ? 'block' : 'hidden'}>
               <PanelClinico pacienteId={params.id} onSync={(d) => setConsultaData(prev => ({...prev, anamnesis: d as any}))} />
             </div>
             <div className={activeTab === 'antropometria' ? 'block' : 'hidden'}>
               <PanelAntropometria pacienteId={params.id} onSync={(d) => setConsultaData(prev => ({...prev, antropometria: d as any}))} />
             </div>
             <div className={activeTab === 'dieta' ? 'block' : 'hidden'}>
               <PlanAlimentario pacienteId={params.id} onSync={(d) => setConsultaData(prev => ({...prev, dieta: d as any}))} />
             </div>
             <div className={activeTab === 'evolucion' ? 'block' : 'hidden'}>
               <DashboardEvolucion pacienteId={params.id} />
             </div>
           </div>
        </div>
      </motion.main>

    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

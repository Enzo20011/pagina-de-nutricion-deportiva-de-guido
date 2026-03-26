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

import clsx from 'clsx';
import { useConsultaStore } from '@/store/useConsultaStore';

export default function ConsultaPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'anamnesis' | 'antropometria' | 'dieta' | 'evolucion'>('anamnesis');
  const [isExporting, setIsExporting] = useState(false);
  
  const { 
    anamnesis, 
    antropometria, 
    dieta, 
    setAnamnesis, 
    setAntropometria, 
    setDieta,
    clearSession
  } = useConsultaStore();

  // Clear session if ID changes to avoid cross-patient data leaks
  const lastPatientIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (params.id && params.id !== lastPatientIdRef.current) {
       clearSession();
       lastPatientIdRef.current = params.id;
    }
  }, [params.id, clearSession]);

  const consultaData = { anamnesis, antropometria, dieta };

  const { data: paciente, isLoading } = useQuery({
    queryKey: ['paciente', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/pacientes/${params.id}`);
      if (!res.ok) throw new Error('Error al cargar paciente');
      return res.json();
    }
  });

  if (!paciente && !isLoading) return <div className="p-10 text-center text-white font-bold text-xl uppercase tracking-widest">Paciente no encontrado</div>;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-32 p-6 selection:bg-white/5">
      
      {/* PRINT HEADER SYSTEM */}
      <div className="print-header hidden">
        <div className="flex justify-between items-end border-b-4 border-black pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-heading font-black uppercase tracking-tight">Guido <span className="text-[#3b82f6]">Nutrición</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a7abb2] mt-2">Protocolo de Intervención Clínica</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold uppercase tracking-widest">Expediente: {paciente?.data?.nombre} {paciente?.data?.apellido}</p>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Sincronización: {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* STRATEGIC CONSULTATION HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0a0f14] p-4 sm:p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8 relative z-10">
          <Link href="/admin/pacientes" className="w-11 h-11 min-h-[44px] bg-white/5 rounded-sm flex items-center justify-center text-white/20 hover:text-white hover:border-white/10 border border-white/5 transition-all duration-75 shadow-xl group/back shrink-0">
             <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#3b82f6] rounded-sm flex items-center justify-center text-white shadow-xl shrink-0 relative overflow-hidden">
               <User className="w-7 h-7 sm:w-10 sm:h-10 relative z-10" />
            </div>
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-4 text-[#3b82f6]/60 font-bold uppercase text-[9px] tracking-[0.4em]">
                SINCRONIZACIÓN ACTIVA
              </div>
              {isLoading ? (
                <div className="h-8 w-48 bg-white/5 rounded-sm animate-pulse" />
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight uppercase leading-none break-words line-clamp-2">{paciente?.data?.nombre} <span className="text-white/20">{paciente?.data?.apellido}</span></h1>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                   <Calendar className="w-3 h-3 opacity-40" /> {isLoading ? '...' : new Date(paciente?.data?.createdAt || Date.now()).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()} <span className="w-1 h-1 rounded-full bg-white/10" /> {paciente?.data?.status?.toUpperCase() || 'ACTIVO'}
                </p>
                 <button
                  onClick={async () => {
                    if (isExporting) return;
                    setIsExporting(true);
                    try {
                      const { exportarConsultaLazy } = await import('@/utils/exportPdfAction');
                      await exportarConsultaLazy(paciente, consultaData);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsExporting(false);
                    }
                  }}
                  disabled={isExporting}
                  className={clsx(
                    "bg-white px-5 py-3 min-h-[44px] rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] text-[#0a0f14] transition-all duration-75 flex items-center gap-3 shadow-xl",
                    isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-white/90"
                  )}
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-[#0a0f14]/20 border-t-[#0a0f14] rounded-full animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {isExporting ? "Generando..." : "PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION TABS */}
        <div className="flex bg-[#070C14]/60 p-1.5 rounded-sm border border-white/5 relative z-10 shadow-inner backdrop-blur-3xl mt-4 lg:mt-0 items-center w-full lg:w-fit max-w-full overflow-x-auto scrollbar-hide shrink-0 gap-0.5">
          {[
            { id: 'anamnesis', label: 'Historial', shortLabel: 'Hist.', icon: ClipboardList, hasData: !!anamnesis },
            { id: 'antropometria', label: 'Biometría', shortLabel: 'Bio.', icon: Ruler, hasData: !!antropometria },
            { id: 'dieta', label: 'Plan Nutricional', shortLabel: 'Plan', icon: Utensils, hasData: !!dieta },
            { id: 'evolucion', label: 'Evolución', shortLabel: 'Evol.', icon: TrendingUp, hasData: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex-1 lg:flex-none px-3 sm:px-4 py-3 min-h-[44px] rounded-sm text-[9px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-75 relative group/tab shrink-0",
                activeTab === tab.id
                ? 'bg-[#3b82f6] text-white shadow-xl'
                : 'text-white/20 hover:text-white hover:bg-white/5'
              )}
            >
              <tab.icon className={clsx("w-3.5 h-3.5 shrink-0 transition-transform duration-75", activeTab === tab.id ? "scale-110" : "opacity-30 group-hover/tab:opacity-100")} />
              <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
              <span className="sm:hidden whitespace-nowrap">{tab.shortLabel}</span>
              <div className={clsx(
                "w-1 h-1 rounded-full transition-all duration-75 shrink-0",
                tab.hasData ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/5'
              )} />
            </button>
          ))}
        </div>
      </header>

      {/* DYNAMIC PRECISION CONTENT AREA */}
      <main className="relative min-h-[600px]">
        <div className="bg-[#0e1419] rounded-sm border border-white/5 p-3 sm:p-6 shadow-xl overflow-hidden min-h-[600px] relative">
           <div className="bg-[#0a0f14]/40 rounded-sm p-3 sm:p-6 lg:p-10 min-h-[500px] shadow-inner border border-white/5">
             {activeTab === 'anamnesis' && (
               <PanelClinico
                 pacienteId={params.id}
                 onSync={setAnamnesis}
                 pacienteInitialData={paciente?.data}
                 antropometriaData={antropometria}
               />
             )}
             {activeTab === 'antropometria' && (
               <PanelAntropometria
                 pacienteId={params.id}
                 onSync={setAntropometria}
                 pacienteInitialData={paciente?.data}
                 anamnesisData={anamnesis}
               />
             )}
             {activeTab === 'dieta' && (
               <PlanAlimentario
                pacienteId={params.id}
                onSync={setDieta}
                anamnesisData={anamnesis}
               />
             )}
             {activeTab === 'evolucion' && (
               <DashboardEvolucion
                pacienteId={params.id}
                paciente={paciente || {}}
                sessionData={consultaData}
               />
             )}
           </div>
        </div>
      </main>

    </div>
  );
}

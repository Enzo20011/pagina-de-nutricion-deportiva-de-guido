'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { usePatientStore } from '@/store/usePatientStore';
import Toast from './Toast';
import Loader from './Loader';
import PapeleraPacientes from './PapeleraPacientes';
import NuevoPacienteModal from './NuevoPacienteModal';
import EditarPacienteModal from './EditarPacienteModal';
import { PatientListSkeleton } from '@/components/ui/Skeletons';
import { 
  Users, Search, Plus, User, Phone, MessageCircle, TrendingUp, 
  ClipboardList, ChevronRight, Calendar, Weight, ArrowUpRight, 
  Sparkles, Trash2, Archive, AlertCircle, RefreshCw, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Paciente {
  _id: string;
  id?: string;
  nombre: string;
  apellido: string;
  peso?: number;
  objetivo?: string;
  ultimaConsulta?: string;
  status?: string;
  whatsapp?: string;
  email?: string;
  telefono?: string;
}

export default function BasePacientes() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { selectedPatientId: selectedId, setSelectedPatientId: setSelectedId, searchQuery, setSearchQuery, page, setPage } = usePatientStore();
   
   const [perPage, setPerPage] = useState(5);
   const [statusFilter, setStatusFilter] = useState('');
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
   const [showPapelera, setShowPapelera] = useState(false);
   const [showNewPatient, setShowNewPatient] = useState(false);
   const [patientToEdit, setPatientToEdit] = useState<Paciente | null>(null);

   // Real API fetch with React Query & Server pagination
   const { data, isLoading: loading, isError, error, refetch } = useQuery({
     queryKey: ['pacientes', { page, limit: perPage, search: searchQuery }],
     queryFn: async () => {
       const res = await fetch(`/api/pacientes?page=${page}&limit=${perPage}&search=${searchQuery}`);
       if (!res.ok) throw new Error(`Error ${res.status}`);
       return res.json();
     },
   });

   const apiError = isError ? (error as Error).message || 'Error de conexión' : null;

   const deleteMutation = useMutation({
     mutationFn: async (id: string) => {
       const res = await fetch(`/api/pacientes/${id}`, { method: 'DELETE' });
       if (!res.ok) throw new Error('Failed to delete');
       return id;
     },
      onSuccess: (deletedId) => {
        setToast({ message: `Paciente archivado correctamente.`, type: 'info' });
        if (selectedId === deletedId) setSelectedId(null);
        queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      },
      onError: () => setToast({ message: 'Error al desactivar registro', type: 'error' })
   });

   const deleting = deleteMutation.isPending ? deleteMutation.variables : null;

    const handleSoftDelete = (id: string, nombre: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!window.confirm(`¿Desactivar a ${nombre}? El registro se archivará.`)) return;
      deleteMutation.mutate(id);
    };

   // Datos paginados estandarizados desde la API
   const pacientes: Paciente[] = data?.data || [];
   const totalPages = data?.pagination?.totalPages || 1;
   const totalRecords = data?.pagination?.total || 0;

   // Status filter still local or can be pushed to query (for now local)
   const filteredPacientes = statusFilter ? pacientes.filter(p => p.status === statusFilter) : pacientes;
   const pacientesPage = filteredPacientes;

   const selectedPaciente = pacientes.find(p => (p._id || p.id) === selectedId);

   return (
       <div className="max-w-[1200px] mx-auto space-y-12 text-white selection:bg-[#3b82f6]/20 p-6 md:p-8 bg-[#0a0f14] min-h-screen">
         {loading && <Loader />}
         {toast && (
           <AnimatePresence>
             <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
           </AnimatePresence>
         )}

         {apiError && (
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex items-center gap-6 p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-red-500 italic font-black uppercase text-[10px] tracking-widest"
           >
             <AlertCircle className="w-5 h-5 shrink-0" />
             <span>{apiError}</span>
             <button
                onClick={() => refetch()}
                className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#0a0f14] hover:bg-white/90 transition-all text-[9px] font-black uppercase tracking-widest"
              >
                <RefreshCw className="w-3.5 h-3.5" /> RE-INTENTAR
              </button>
           </motion.div>
         )}

      {/* STRATEGIC HEADER */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/5 pb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight leading-none">
              Gestión de<br />
              <span className="text-[#3b82f6]">Pacientes</span>
            </h1>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
              Registro Activo: {pacientesPage.length} <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mx-2 inline-block opacity-40" /> Total: {totalRecords}
            </p>
          </motion.div>

           <div className="flex flex-wrap gap-6 items-center">
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPapelera(true)}
                className="flex items-center gap-4 px-8 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
             >
                <Archive className="w-4 h-4" /> PAPELERA
             </motion.button>
             <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59,130,246,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewPatient(true)}
                className="bg-[#3b82f6] text-white px-10 py-5 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-3xl"
             >
                 <Plus className="w-5 h-5" /> NUEVO PACIENTE
             </motion.button>
           </div>
      </header>

      {/* CORE OPERATIONAL GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">

        {/* SIDE BAR LIST */}
        <div className="xl:col-span-4 space-y-8">
                <div className="bg-[#0e1419] p-6 md:p-8 rounded-[3rem] border border-white/5 shadow-3xl backdrop-blur-3xl space-y-10 relative overflow-hidden group">
                     {/* Bio-glow indicator */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -mr-10 -mt-10" />

                     <div className="flex flex-col gap-6">
                         <div className="relative group/input">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within/input:text-[#3b82f6] transition-all duration-700" />
                            <input
                               type="text"
                               placeholder="BUSCAR PACIENTE..."
                               value={searchQuery}
                               onChange={e => { setPage(1); setSearchQuery(e.target.value); }}
                               className="w-full bg-[#0a0f14]/60 pl-16 pr-8 py-6 rounded-sm outline-none border border-white/5 focus:border-[#3b82f6]/30 transition-all font-bold uppercase tracking-[0.2em] text-[10px] text-white placeholder:text-white/5"
                            />
                         </div>
                         <div className="flex justify-between items-center px-4">
                            <div className="flex items-center gap-4">
                               <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.5em]">Estado</span>
                               <select value={statusFilter} onChange={e => { setPage(1); setStatusFilter(e.target.value); }} className="bg-transparent border-none text-[9px] text-white font-bold uppercase tracking-[0.3em] focus:ring-0 cursor-pointer outline-none">
                                  <option value="" className="bg-[#0a0f14]">TODOS</option>
                                  <option value="Activo" className="bg-[#0a0f14]">ACTIVO</option>
                                  <option value="En Pausa" className="bg-[#0a0f14]">PAUSA</option>
                               </select>
                            </div>
                         </div>
                      </div>

                     <div className="space-y-5 max-h-[800px] overflow-y-auto custom-scrollbar pr-4">
                          {loading && pacientes.length === 0 && (
                              <PatientListSkeleton />
                          )}
                           {pacientesPage.length === 0 && !loading && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 flex flex-col items-center gap-8"
                              >
                                <div className="w-20 h-20 bg-white/[0.02] rounded-[2.5rem] flex items-center justify-center border border-white/5">
                                  <Users className="w-10 h-10 text-white/5" />
                                </div>
                                <div className="space-y-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                                    Lista Vacía
                                  </p>
                                </div>
                              </motion.div>
                           )}
                          {pacientesPage.map((p, idx) => (
                              <motion.div
                                key={p._id || p.id}
                                className="relative group/card"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <motion.button
                                   whileHover={{ x: 5 }}
                                   onClick={() => setSelectedId(p._id || p.id || null)}
                                   className={clsx(
                                      "w-full p-6 rounded-sm flex items-center justify-between transition-all duration-700 group relative border shadow-xl",
                                      (selectedId === p._id || selectedId === p.id)
                                        ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                                        : 'bg-[#0a0f14]/40 border-white/5 hover:border-[#3b82f6]/30 text-white'
                                   )}
                                >
                                   <div className="flex items-center gap-6 relative z-10">
                                        <div className={clsx(
                                           "w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-700 border",
                                           (selectedId === p._id || selectedId === p.id)
                                             ? 'bg-white/10 border-white/20'
                                             : 'bg-white/5 border-white/5'
                                        )}>
                                            <User className={clsx("w-6 h-6", (selectedId === p._id || selectedId === p.id) ? 'text-white' : 'text-white/20 group-hover:text-white')} />
                                        </div>
                                        <div className="text-left space-y-1">
                                            <p className="font-bold uppercase text-base tracking-tight leading-none">
                                              {p.nombre} <span className="opacity-40">{p.apellido}</span>
                                            </p>
                                            <div className="flex items-center gap-3">
                                               <span className={clsx(
                                                 "text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm border transition-all duration-700",
                                                 (selectedId === p._id || selectedId === p.id)
                                                   ? "bg-white/10 border-white/20 text-white"
                                                   : "bg-white/5 border-white/5 text-white/20"
                                               )}>
                                                 {p.objetivo || 'PLAN NUTRICIONAL'}
                                               </span>
                                            </div>
                                        </div>
                                   </div>
                                   <div className={clsx(
                                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700",
                                      (selectedId === p._id || selectedId === p.id)
                                        ? 'opacity-100'
                                        : 'opacity-0 translate-x-2'
                                   )}>
                                        <ChevronRight className="w-5 h-5 text-white" />
                                   </div>
                                </motion.button>
                                <button
                                  className="absolute top-6 right-8 z-20 text-white/5 hover:text-red-500 p-2 rounded-xl transition-all hover:bg-red-500/5"
                                  disabled={deleting === (p._id || p.id)}
                                  onClick={(e) => handleSoftDelete(p._id || p.id || '', `${p.nombre} ${p.apellido}`, e)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </motion.div>
                          ))}
                     </div>

                     {/* Strategic Pagination */}
                     <div className="flex justify-between items-center pt-10 border-t border-white/5">
                        <div className="flex gap-4">
                           <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-[#3b82f6] transition-all disabled:opacity-10">
                              <ChevronRight className="w-5 h-5 rotate-180" />
                           </button>
                           <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0} className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-[#3b82f6] transition-all disabled:opacity-10">
                              <ChevronRight className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">BLOQUE {page} / {totalPages || 1}</p>
                            <div className="flex items-center gap-3 mt-1.5 justify-end">
                               <label className="text-[8px] font-bold text-white/10 uppercase tracking-widest">FILAS</label>
                               <select value={perPage} onChange={e => { setPage(1); setPerPage(Number(e.target.value)); }} className="bg-transparent border-none text-[9px] font-bold text-white/40 outline-none cursor-pointer">
                                  {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                               </select>
                            </div>
                         </div>
                     </div>
                </div>
        </div>

         {/* DETAIL PANEL */}
         <div className="xl:col-span-8">
            <AnimatePresence mode="wait">
              {selectedPaciente ? (
                <motion.div
                  key={selectedPaciente.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-12"
                >
                  {/* PATIENT HEADER */}
                    <motion.div
                     className="sticky top-[100px] z-30 flex items-center justify-between px-8 py-6 bg-[#0a0f14] border border-white/10 rounded-sm shadow-xl mb-8 group"
                   >
                     <div className="flex items-center gap-8 relative z-10">
                       <div className="w-16 h-16 rounded-sm bg-[#3b82f6] flex items-center justify-center shadow-xl p-1 transition-all duration-700">
                         <User className="w-8 h-8 text-white" />
                       </div>
                       <div>
                         <p className="text-white font-bold uppercase tracking-tight text-2xl leading-none">{selectedPaciente.nombre} <span className="opacity-40">{selectedPaciente.apellido}</span></p>
                         <div className="flex items-center gap-5 mt-4">
                            <span className="px-4 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">ID #{selectedPaciente._id?.substring(0,8) || 'N/A'}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] opacity-40 animate-pulse" />
                            <p className="text-white/20 font-bold text-[9px] uppercase tracking-[0.3em]">{selectedPaciente.objetivo || 'PLAN ESTÁNDAR'}</p>
                         </div>
                       </div>
                     </div>
                     <div className="hidden xl:flex items-center gap-4 text-right relative z-10">
                       <button
                          onClick={() => router.push(`/admin/consulta/${selectedPaciente._id || selectedPaciente.id}`)}
                          className="px-8 py-4 rounded-sm bg-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#2563eb] transition-all duration-700 flex items-center gap-4 group/consult"
                       >
                          NUEVA CONSULTA
                          <Sparkles className="w-4 h-4 group-hover/consult:animate-pulse" />
                       </button>
                       <button
                          onClick={() => setPatientToEdit(selectedPaciente)}
                          className="w-14 h-14 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all duration-700"
                       >
                          <Settings className="w-5 h-5" />
                       </button>
                     </div>
                   </motion.div>

                  {/* Operational Telemetry Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { label: 'ESTADO', value: selectedPaciente.status, icon: TrendingUp, status: true },
                        { label: 'PESO ACTUAL', value: `${selectedPaciente.peso || '??'} KG`, icon: Weight },
                        { label: 'ÚLTIMA VISITA', value: selectedPaciente.ultimaConsulta || 'SIN FECHA', icon: Calendar },
                      ].map((card, i) => (
                        <div key={i} className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl group hover:border-[#3b82f6]/30 transition-all duration-700 relative overflow-hidden">
                           <div className="flex flex-col gap-10 relative z-10">
                              <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 group-hover:bg-[#3b82f6]/10 transition-all duration-700">
                                 <card.icon className="w-5 h-5 text-white/40 group-hover:text-[#3b82f6] transition-colors" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">{card.label}</p>
                                 {card.status ? (
                                    <span className={clsx(
                                       "px-5 py-2 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] inline-block border",
                                       card.value === 'Activo' ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    )}>{card.value || 'N/A'}</span>
                                 ) : (
                                    <h4 className="text-2xl font-bold text-white tracking-tight leading-none">{card.value}</h4>
                                 )}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>

                  {/* Professional Modules */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                     {/* HISTORIAL */}
                      <div className="lg:col-span-7 bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl space-y-12 relative overflow-hidden group">
                         <header className="flex items-center justify-between relative z-10">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-5">
                               <ClipboardList className="w-6 h-6 text-[#3b82f6]" /> REGISTROS
                            </h3>
                         </header>
                         <div className="space-y-4 relative z-10">
                            {[1, 2].map(i => (
                              <motion.div
                                 key={i}
                                 whileHover={{ x: 5 }}
                                 className="p-6 bg-[#0a0f14] rounded-sm border border-white/5 flex items-center justify-between group/item hover:border-[#3b82f6]/30 transition-all cursor-pointer shadow-inner"
                              >
                                 <div className="flex items-center gap-8 relative z-10">
                                    <div className="w-12 h-12 bg-white/5 text-white/20 rounded-sm flex items-center justify-center group-hover/item:text-[#3b82f6] group-hover/item:bg-[#3b82f6]/10 transition-all border border-white/5">
                                       <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <p className="font-bold text-white uppercase text-base tracking-tight leading-none">CONSULTA NUTRICIONAL V{i}</p>
                                       <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] mt-3 flex items-center gap-3">
                                          COMPLETO <span className="w-1 h-1 rounded-full bg-[#3b82f6]" /> ENE 2024
                                       </p>
                                    </div>
                                 </div>
                              </motion.div>
                            ))}
                         </div>
                      </div>

                     {/* CONTACTO */}
                      <div className="lg:col-span-5 bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl space-y-12 flex flex-col justify-between">
                          <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-5">CONTACTO</h3>
                          <div className="p-8 bg-[#0a0f14] rounded-sm border border-white/5 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                             <div className="w-20 h-20 bg-[#3b82f6] text-white rounded-full flex items-center justify-center shadow-xl">
                                <MessageCircle className="w-8 h-8" />
                             </div>
                             <div className="space-y-4">
                                <p className="text-xl font-bold text-white tracking-widest leading-none border-b border-white/5 pb-4">{selectedPaciente.whatsapp || 'SIN REGISTRO'}</p>
                             </div>
                             <a
                                href={`https://wa.me/${selectedPaciente.whatsapp?.replace('+', '') || ''}`}
                                target="_blank"
                                className="w-full py-5 bg-white text-[#0a0f14] hover:bg-white/90 rounded-sm font-bold uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-4 group/wa"
                             >
                                ENVIAR MENSAJE
                                <Sparkles className="w-4 h-4 group-hover/wa:animate-pulse text-[#3b82f6]" />
                             </a>
                          </div>
                      </div>
                   </div>
                </motion.div>
              ) : (
               <div className="h-[700px] border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center gap-12 group bg-[#0a0f14]/20 relative overflow-hidden">
                   <div className="w-32 h-32 bg-[#0a0f14] rounded-sm flex items-center justify-center border border-white/5 group-hover:border-[#3b82f6]/30 transition-all duration-1000 p-2 relative z-10">
                     <Users className="w-16 h-16 text-white/5" />
                   </div>
                   <div className="text-center space-y-6 relative z-10 px-10">
                      <p className="text-3xl font-bold uppercase tracking-tight text-white leading-none">PANEL EN ESPERA</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 max-w-sm mx-auto leading-loose">SELECCIONA UN PACIENTE PARA COMENZAR</p>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>
      </div>

      <AnimatePresence>
        {showPapelera && (
          <PapeleraPacientes
            onClose={() => setShowPapelera(false)}
            onRestored={() => setToast({ message: 'Paciente restaurado exitosamente', type: 'success' })}
          />
        )}
      </AnimatePresence>

      <NuevoPacienteModal 
        isOpen={showNewPatient} 
        onClose={() => setShowNewPatient(false)} 
        onSuccess={(newId) => {
          setToast({ message: 'Paciente creado. Abriendo consola clínica...', type: 'success' });
          if (newId) {
            setTimeout(() => {
              router.push(`/admin/consulta/${newId}`);
            }, 800);
          }
        }}
      />

      {patientToEdit && (
        <EditarPacienteModal 
          isOpen={true} 
          paciente={patientToEdit}
          onClose={() => setPatientToEdit(null)} 
          onSuccess={() => setToast({ message: 'Paciente actualizado exitosamente', type: 'success' })}
        />
      )}

    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

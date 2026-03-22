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
  Sparkles, Trash2, Archive, AlertCircle, RefreshCw
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
       setToast({ message: `Paciente archivado. Recuperalo en Papelera.`, type: 'info' });
       if (selectedId === deletedId) setSelectedId(null);
       queryClient.invalidateQueries({ queryKey: ['pacientes'] });
     },
     onError: () => setToast({ message: 'Error al archivar el paciente', type: 'error' })
   });

   const deleting = deleteMutation.isPending ? deleteMutation.variables : null;

   const handleSoftDelete = (id: string, nombre: string, e: React.MouseEvent) => {
     e.stopPropagation();
     if (!window.confirm(`¿Archivar a ${nombre}? Su historia clínica se preservará y podrá recuperarse desde la Papelera.`)) return;
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
      <div className="max-w-[1400px] mx-auto space-y-12 text-bone selection:bg-accentBlue/20">
         {loading && <Loader />}
         {toast && (
           <AnimatePresence>
             <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
           </AnimatePresence>
         )}
         {/* API error banner */}
         {apiError && (
           <motion.div
             initial={{ opacity: 0, y: -8 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400"
           >
             <AlertCircle className="w-5 h-5 shrink-0" />
             <span className="font-bold text-sm">{apiError}</span>
             <button
               onClick={() => refetch()}
               className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 transition-all text-xs font-black uppercase tracking-wider"
             >
               <RefreshCw className="w-3.5 h-3.5" /> Reintentar
             </button>
           </motion.div>
         )}
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 lg:gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 text-accentBlue font-bold uppercase text-[10px] tracking-[0.4em]">
             <Sparkles className="w-4 h-4 opacity-50" /> Gestión de Pacientes
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
            Base de <br />
            <span className="text-accentBlue not-italic">Pacientes.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
            Mostrando {pacientesPage.length} registros (Total: {totalRecords})
          </p>
        </motion.div>

          <div className="flex gap-3">
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowPapelera(true)}
               className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 transition-all"
               aria-label="Papelera de pacientes archivados"
            >
               <Archive className="w-4 h-4" /> Papelera
            </motion.button>
                <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setShowNewPatient(true)}
                   className="relative overflow-hidden bg-accentBlue text-white hover:bg-accentBlue/90 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/20 w-full lg:w-auto"
                   tabIndex={0}
                   aria-label="Nuevo Registro"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-loop pointer-events-none" />
                    <Plus className="w-5 h-5 text-white" /> <span className="relative">Nuevo Registro</span>
                </motion.button>
          </div>
      </header>

      {/* LISTADO LATERAL */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
        
        <div className="xl:col-span-4 space-y-8">
                <div className="bg-cardDark/40 p-6 xl:p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-3xl space-y-6">
                     <div className="flex flex-col gap-4">
                        <div className="relative group">
                           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-accentBlue transition-colors" />
                           <input 
                              type="text" 
                              placeholder="Buscar en el índice..." 
                              value={searchQuery}
                              onChange={e => { setPage(1); setSearchQuery(e.target.value); }}
                              className="w-full bg-darkNavy pl-14 pr-6 py-4 rounded-2xl outline-none border border-white/5 focus:border-accentBlue/30 transition-all font-bold text-white placeholder:text-white/10 shadow-inner text-sm"
                              aria-label="Buscar paciente"
                           />
                        </div>
                        <div className="flex gap-2 items-center">
                           <label htmlFor="statusFilter" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filtrar:</label>
                           <select id="statusFilter" value={statusFilter} onChange={e => { setPage(1); setStatusFilter(e.target.value); }} className="bg-darkNavy border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-bold focus:border-accentBlue/30">
                              <option value="">Todos</option>
                              <option value="Activo">Activo</option>
                              <option value="En Pausa">En Pausa</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-3">
                         {/* Loading skeleton */}
                         {loading && pacientes.length === 0 && (
                             <PatientListSkeleton />
                         )}
                         {pacientesPage.length === 0 && !loading && (
                            <div className="text-center text-slate-500 font-bold py-10">No se encontraron pacientes.</div>
                         )}
                         {pacientesPage.map((p, idx) => (
                             <motion.div
                               key={p._id || p.id}
                               className="relative group"
                               initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                               whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                               viewport={{ once: true }}
                               transition={{ 
                                  delay: idx * 0.1, 
                                  duration: 0.8, 
                                  ease: [0.22, 1, 0.36, 1] 
                               }}
                             >
                               <motion.button 
                                  whileHover={{ x: 6, scale: 1.01, backgroundColor: "rgba(59, 130, 246, 0.95)" }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setSelectedId(p._id || p.id || null)}
                                  className={clsx(
                                     "w-full p-6 lg:p-7 rounded-2xl flex items-center justify-between transition-all group relative overflow-hidden border-2 font-outfit shadow-2xl backdrop-blur-3xl",
                                     (selectedId === p._id || selectedId === p.id)
                                       ? 'bg-accentBlue/90 border-white/20 shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] text-white' 
                                       : 'bg-cardDark/40 border-white/5 hover:border-accentBlue/40 text-white/90'
                                  )}
                                  tabIndex={0}
                                  aria-label={`Seleccionar paciente ${p.nombre}`}
                               >
                                  {/* Glass highlight effect */}
                                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                  <div className="flex items-center gap-5 relative z-10">
                                       <div className={clsx(
                                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700 border-2",
                                          (selectedId === p._id || selectedId === p.id) 
                                            ? 'bg-white/20 border-white/30' 
                                            : 'bg-darkNavy border-accentBlue/20 shadow-inner'
                                       )}>
                                           <User className={clsx("w-6 h-6", (selectedId === p._id || selectedId === p.id) ? 'text-white' : 'text-accentBlue')} />
                                       </div>
                                       <div className="text-left space-y-1">
                                           <p className={clsx("font-black uppercase text-base lg:text-lg tracking-tight italic", (selectedId === p._id || selectedId === p.id) ? 'text-white' : 'text-white')}>
                                             {p.nombre} <span className="text-accentBlue lg:group-hover:text-white transition-colors">{p.apellido}</span>
                                           </p>
                                           <div className="flex items-center gap-3">
                                              <span className={clsx(
                                                "text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border",
                                                (selectedId === p._id || selectedId === p.id)
                                                  ? "bg-white/10 border-white/20 text-white"
                                                  : "bg-accentBlue/10 border-accentBlue/20 text-accentBlue"
                                              )}>
                                                {p.objetivo || 'Paciente'}
                                              </span>
                                           </div>
                                       </div>
                                  </div>
                                  <div className={clsx(
                                     "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
                                     (selectedId === p._id || selectedId === p.id) 
                                       ? 'bg-white/20 border-white/30 opacity-100 translate-x-0' 
                                       : 'opacity-0 translate-x-4 border-accentBlue/20'
                                  )}>
                                       <ChevronRight className="w-5 h-5 text-white" />
                                  </div>
                               </motion.button>
                               <button
                                 className="absolute top-4 right-4 z-20 text-red-500/40 hover:text-red-500 p-2.5 rounded-2xl transition-all bg-white/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 disabled:opacity-30"
                                 aria-label={`Archivar paciente ${p.nombre}`}
                                 disabled={deleting === (p._id || p.id)}
                                  onClick={(e) => handleSoftDelete(p._id || p.id || '', `${p.nombre} ${p.apellido}`, e)}
                               >
                                 <Trash2 className={`w-4 h-4 ${deleting === (p._id || p.id) ? "animate-pulse" : ""}`} />
                               </button>
                             </motion.div>
                          ))}
                     </div>
                     {/* Paginación Real Async */}
                     <div className="flex justify-between items-center pt-6">
                        <div className="flex gap-2">
                           <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl bg-darkNavy border border-white/10 text-white/50 hover:bg-accentBlue/10 hover:text-white disabled:opacity-30 font-bold text-xs transition-all">Anterior</button>
                           <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0} className="px-4 py-2 rounded-xl bg-darkNavy border border-white/10 text-white/50 hover:bg-accentBlue/10 hover:text-white disabled:opacity-30 font-bold text-xs transition-all">Siguiente</button>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">Página {page} de {totalPages || 1}</span>
                        <div>
                           <label htmlFor="perPage" className="text-xs text-slate-400 font-bold mr-2">Ver</label>
                           <select id="perPage" value={perPage} onChange={e => { setPage(1); setPerPage(Number(e.target.value)); }} className="bg-darkNavy border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-bold focus:border-accentBlue/30">
                              {[2, 3, 4, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                           </select>
                        </div>
                     </div>
                </div>
        </div>

         {/* DETALLE DEL PACIENTE */}
         <div className="xl:col-span-8">
            <AnimatePresence mode="wait">
              {selectedPaciente ? (
                <motion.div 
                  key={selectedPaciente.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-12"
                >
                  {/* ── STICKY PATIENT HEADER ── */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-[72px] z-30 flex items-center justify-between px-8 py-4 bg-cardDark/85 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-2"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-2xl bg-accentBlue/20 border border-accentBlue/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-accentBlue" />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase italic tracking-tight text-base leading-none">{selectedPaciente.nombre} {selectedPaciente.apellido}</p>
                        <p className="text-accentBlue/70 font-bold text-[10px] uppercase tracking-[0.3em] mt-0.5">{selectedPaciente.objetivo}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-right">
                      <button 
                         onClick={() => router.push(`/admin/consulta/${selectedPaciente._id || selectedPaciente.id}`)}
                         className="px-5 py-2.5 rounded-xl bg-accentBlue hover:bg-blue-500 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-accentBlue/20 transition-all flex items-center gap-2"
                      >
                         <Sparkles className="w-4 h-4" /> Entrar a Consulta
                      </button>
                      <button 
                         onClick={() => setPatientToEdit(selectedPaciente)}
                         className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                         Editar
                      </button>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Peso</p>
                        <p className="text-white font-black text-sm">{selectedPaciente.peso || '--'} kg</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Última cita</p>
                        <p className="text-white font-black text-sm">{selectedPaciente.ultimaConsulta}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <span className={clsx(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          selectedPaciente.status === 'Activo'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                        )}>
                          {selectedPaciente.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                     {[
                       { label: 'Status Evolución', value: selectedPaciente.status, icon: TrendingUp, color: 'text-accentBlue' },
                       { label: 'Último Peso', value: `${selectedPaciente.peso} Kg`, icon: Weight, color: 'text-emerald-400' },
                       { label: 'Última Cita', value: selectedPaciente.ultimaConsulta, icon: Calendar, color: 'text-white/40' },
                     ].map((card, i) => (
                       <div key={i} className="bg-cardDark/40 p-6 lg:p-8 rounded-3xl border border-white/5 shadow-2xl group hover:border-white/20 transition-all backdrop-blur-3xl">
                          <div className="flex flex-col gap-6">
                             <div className={clsx("w-12 h-12 bg-darkNavy rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg border border-white/5", card.color)}>
                                <card.icon className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1.5">{card.label}</p>
                                <h4 className="text-2xl font-black text-white italic tracking-tighter">{card.value}</h4>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Main Content Area */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     {/* Historial Section */}
                     <div className="bg-cardDark/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8 backdrop-blur-3xl">
                        <header className="flex items-center justify-between">
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                              <ClipboardList className="w-6 h-6 text-accentBlue" /> Planes
                           </h3>
                           <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Ver Todo</button>
                        </header>
                        <div className="space-y-5">
                           {[1, 2].map(i => (
                             <motion.div 
                               key={i} 
                               whileHover={{ x: 5 }}
                               className="p-6 bg-darkNavy/50 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-darkNavy hover:border-accentBlue/30 transition-all cursor-pointer shadow-inner"
                             >
                                <div className="flex items-center gap-5">
                                   <div className="w-10 h-10 bg-darkNavy text-accentBlue rounded-xl flex items-center justify-center group-hover:bg-accentBlue group-hover:text-white transition-all shadow-xl border border-white/5">
                                      <ArrowUpRight className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <p className="font-black text-white uppercase text-sm tracking-tight italic">Protocolo v{i}.0</p>
                                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Sincronizado • Ene 26</p>
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </div>

                     {/* Contact Section */}
                     <div className="bg-cardDark/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8 backdrop-blur-3xl">
                         <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Contacto</h3>
                         <div className="p-8 bg-darkNavy rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group shadow-inner">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px]" />
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-2xl">
                               <MessageCircle className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-xl md:text-2xl font-black text-white tracking-widest">{selectedPaciente.whatsapp}</p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.5em]">Consola de Mensajería</p>
                            </div>
                            <a 
                               href={`https://wa.me/${selectedPaciente.whatsapp.replace('+', '')}`}
                               target="_blank"
                               className="relative overflow-hidden w-full py-4 bg-accentBlue text-white hover:bg-accentBlue/90 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_15px_40px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 group-hover:translate-y-[-4px]"
                            >
                               <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-loop pointer-events-none" />
                               <span className="relative flex items-center gap-4">Enviar Alerta <Sparkles className="w-4 h-4" /></span>
                            </a>
                         </div>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[600px] bg-cardDark/20 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-8 opacity-30 group backdrop-blur-sm">
                   <div className="w-32 h-32 bg-darkNavy rounded-full flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-1000 shadow-2xl">
                     <Users className="w-16 h-16 text-accentBlue/40" />
                   </div>
                   <div className="text-center space-y-4">
                      <p className="text-2xl md:text-3xl font-black uppercase tracking-[0.4em] italic">Auditoria <span className="text-accentBlue">Activa</span></p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-slate-500">Selecciona un perfil para iniciar</p>
                   </div>
                </div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {/* PAPELERA MODAL */}
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

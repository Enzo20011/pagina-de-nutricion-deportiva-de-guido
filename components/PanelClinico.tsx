'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calculator, 
  ClipboardList, 
  Activity, 
  Save, 
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  ArrowDown,
  ArrowUp,
  Equal,
  User,
  Zap
} from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { anamnesisSchema, draftAnamnesisSchema, type AnamnesisInput } from '@/schemas/anamnesisSchema';
import { 
  calcularGastoEnergetico, 
  calcularMacros, 
  type Sexo, 
  type FactorActividad 
} from '@/utils/calculosNutricionales';

export default function PanelClinico({ 
  pacienteId, 
  onSync,
  pacienteInitialData
}: { 
  pacienteId: string, 
  onSync?: (data: any) => void,
  pacienteInitialData?: any
}) {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch data from server
  const { data: serverData, isLoading } = useQuery({
    queryKey: ['anamnesis', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/anamnesis?pacienteId=${pacienteId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Error al cargar anamnesis');
      return res.json();
    },
    enabled: !!pacienteId
  });

  // 1.5 Fetch Biometry for Calculator Sync (FALLBACK if no Anamnesis data)
  const { data: antroData } = useQuery({
    queryKey: ['antropometria', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/biometria?pacienteId=${pacienteId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Error');
      return res.json();
    },
    enabled: !!pacienteId && !serverData?.data?.peso // Only if anamnesis doesn't have peso yet
  });

  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AnamnesisInput>({
    resolver: zodResolver(anamnesisSchema),
    mode: 'onChange',
    defaultValues: {
      pacienteId: pacienteId,
      motivoConsulta: pacienteInitialData?.objetivo || '',
      alergiasIntolerancias: 'Ninguna',
      nivelActividad: 'Sedentario' as any,
      ritmoIntestinal: 'Normal' as any,
      horasSueno: 8,
      nivelEstres: 5,
      peso: pacienteInitialData?.weight || pacienteInitialData?.peso || 70,
      altura: pacienteInitialData?.height || pacienteInitialData?.altura || 170,
      edad: pacienteInitialData?.fechaNacimiento ? 
            new Date().getFullYear() - new Date(pacienteInitialData.fechaNacimiento).getFullYear() : 30,
      sexo: pacienteInitialData?.sexo || 'masculino',
      tipoObjetivo: 'mantenimiento',
    }
  });

  const watchedFields = watch();

  // Sync server data to form only ONCE per patient load
  const hasLoadedRef = React.useRef(false);
  React.useEffect(() => {
    if (serverData?.data && !hasLoadedRef.current) {
      const data = serverData.data;
      // Only reset if we have saved data to hydrate
      if (Object.keys(data).length > 2) { // 2 keys usually: _id, pacienteId
        reset({
          ...watchedFields,
          ...data,
          pacienteId: pacienteId
        });
        hasLoadedRef.current = true;
      }
    } else if (pacienteInitialData && !hasLoadedRef.current && !serverData?.data) {
       // Fallback to patient root data if no anamnesis yet
       reset({
         ...watchedFields,
         motivoConsulta: pacienteInitialData.objetivo || '',
         peso: pacienteInitialData.weight || pacienteInitialData.peso || 70,
         altura: pacienteInitialData.height || pacienteInitialData.altura || 170,
         sexo: pacienteInitialData.sexo || 'masculino',
         edad: pacienteInitialData.fechaNacimiento ? 
               new Date().getFullYear() - new Date(pacienteInitialData.fechaNacimiento).getFullYear() : 30,
       });
       hasLoadedRef.current = true;
    }
  }, [serverData, reset, pacienteId, pacienteInitialData]);

  // Sync latest biometry to form ONLY if form is still at default (new patient session)
  React.useEffect(() => {
     if (antroData?.data?.length > 0 && !serverData?.data?.peso) {
        const latest = antroData.data[antroData.data.length - 1];
        if (latest.peso) reset({ ...watchedFields, peso: latest.peso });
        if (latest.altura) reset({ ...watchedFields, altura: latest.altura });
     }
  }, [antroData]);

  // Reset flag when patient changes
  React.useEffect(() => {
    hasLoadedRef.current = false;
  }, [pacienteId]);

  const [macrosPct, setMacrosPct] = useState({ carbos: 50, proteinas: 20, grasas: 30 });
  
  const resultados = React.useMemo(() => calcularGastoEnergetico(
    watchedFields.peso || 70,
    watchedFields.altura || 170,
    watchedFields.edad || 30,
    (watchedFields.sexo as any) || 'masculino',
    (watchedFields.nivelActividad?.toLowerCase() as any) || 'sedentario'
  ), [watchedFields.peso, watchedFields.altura, watchedFields.edad, watchedFields.sexo, watchedFields.nivelActividad]);
  
  const deficit = Math.round(resultados.get - 500);
  const mantenimiento = Math.round(resultados.get);
  const superavit = Math.round(resultados.get + 500);

  const currentTargetKcal = React.useMemo(() => {
    if (watchedFields.tipoObjetivo === 'deficit') return deficit;
    if (watchedFields.tipoObjetivo === 'superavit') return superavit;
    return mantenimiento;
  }, [watchedFields.tipoObjetivo, deficit, mantenimiento, superavit]);

  // Sync currentTargetKcal to form field for persistence
  React.useEffect(() => {
    setValue('caloriasObjetivo', currentTargetKcal);
  }, [currentTargetKcal, setValue]);

  const macros = React.useMemo(() => calcularMacros(
    currentTargetKcal,
    macrosPct.carbos,
    macrosPct.proteinas,
    macrosPct.grasas
  ), [currentTargetKcal, macrosPct]);

  // 2. Mutation for saving
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/anamnesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || 'Error al guardar');
      }
      return res.json();
    },
    onSuccess: (res) => {
      if (!res.data.isDraft) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
      // Uniform structure: always { data: ... }
      queryClient.setQueryData(['anamnesis', pacienteId], { data: res.data });
    },
    onError: (err: any) => {
       setError(err.message);
       setTimeout(() => setError(null), 5000);
    }
  });

  // Sync state to parent for PDF/Preview
  const lastSyncRef = React.useRef<string>('');
  
  React.useEffect(() => {
    if (onSync) {
      const syncObj = {
        anamnesis: watchedFields,
        resultados,
        macros,
        objetivos: { deficit, mantenimiento, superavit },
        targetKcal: currentTargetKcal,
        tipoObjetivo: watchedFields.tipoObjetivo
      };
      
      const syncStr = JSON.stringify(syncObj);
      if (syncStr !== lastSyncRef.current) {
        lastSyncRef.current = syncStr;
        onSync(syncObj);
      }
    }
  }, [watchedFields, resultados, macros, onSync, deficit, mantenimiento, superavit, currentTargetKcal]);

  // Autosave debounced — saves using DRAFT schema to allow partial data
  const autoSaveRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (!watchedFields.pacienteId) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      // Validate with draft schema before sending
      const validation = draftAnamnesisSchema.safeParse(watchedFields);
      if (validation.success) {
        saveMutation.mutate({ ...watchedFields, isDraft: true });
      }
    }, 1500);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [watchedFields]);

  const onSubmit = (data: AnamnesisInput) => {
    saveMutation.mutate({ ...data, isDraft: false });
  };

  const inputStyles = "w-full p-4 bg-[#0a0f14]/60 border border-white/5 focus:border-[#3b82f6]/30 rounded-sm outline-none transition-all duration-75 font-bold uppercase text-[10px] tracking-[0.15em] text-white placeholder:text-white/5 shadow-xl";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-white">
      
      {/* LEFT SECTION: ANAMNESIS FORM */}
      <div className="xl:col-span-7 space-y-12">
        <header className="flex items-center gap-8 bg-[#0e1419] p-6 rounded-sm shadow-xl border border-white/5 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="w-16 h-16 bg-[#3b82f6] rounded-sm flex items-center justify-center transition-all duration-75 shadow-xl relative z-10">
             <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold uppercase tracking-tight leading-none text-white">ANAMNESIS</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-4">ANÁLISIS DE HÁBITOS Y ANTECEDENTES</p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl space-y-12 group/form relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] -ml-48 -mb-48" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            <div className="space-y-4">
              <label htmlFor="motivoConsulta" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Motivo de Consulta</label>
              {/* Persistent Objective Fields */}
              <input type="hidden" {...register('tipoObjetivo')} id="tipoObjetivo-hidden" />
              <input type="hidden" {...register('caloriasObjetivo')} id="caloriasObjetivo-hidden" />
              
              <textarea 
                id="motivoConsulta"
                {...register('motivoConsulta')}
                className={clsx(inputStyles, "h-32 resize-none py-6")}
                placeholder="Descripción del cuadro clínico..."
                aria-label="Motivo de la consulta nutricional"
              />
              {errors.motivoConsulta && <p className="text-red-500 text-[10px] font-black uppercase mt-2 pl-6 italic tracking-widest">{errors.motivoConsulta.message}</p>}
            </div>

            <div className="space-y-4">
              <label htmlFor="horariosTrabajo" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Entorno / Laboral</label>
              <textarea 
                id="horariosTrabajo"
                {...register('horariosTrabajo')}
                className={clsx(inputStyles, "h-32 resize-none py-6")}
                placeholder="Turnos, horarios, nivel de actividad laboral..."
                aria-label="Descripción del entorno laboral y horarios"
              />
            </div>

            {[
              { label: 'Patologías', key: 'patologias', ph: 'Ninguna', id: 'patologias' },
              { label: 'Alergias', key: 'alergiasIntolerancias', ph: 'Sin alergias reportadas', id: 'alergias' },
              { label: 'Medicación', key: 'medicacionActual', ph: 'Uso de fármacos o suplementos', id: 'medicacion' },
            ].map(f => (
              <div key={f.key} className="space-y-4">
                <label htmlFor={f.id} className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">{f.label}</label>
                <input 
                  id={f.id}
                  {...register(f.key as any)} 
                  className={inputStyles} 
                  placeholder={f.ph} 
                  aria-label={`Ingresar ${f.label}`}
                />
                {(errors as any)[f.key] && <p className="text-red-500 text-[9px] font-black uppercase mt-1 pl-6 italic tracking-widest">{(errors as any)[f.key].message}</p>}
              </div>
            ))}

            <div className="space-y-4">
              <label htmlFor="nivelActividad" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Nivel de Actividad</label>
              <select 
                id="nivelActividad"
                {...register('nivelActividad')} 
                className={clsx(inputStyles, "text-white/40 appearance-none")}
                aria-label="Seleccionar nivel de actividad física diaria"
              >
                <option value="Sedentario" className="bg-[#0a0f14] text-white">Sedentario</option>
                <option value="Ligero" className="bg-[#0a0f14] text-white">Ligero</option>
                <option value="Moderado" className="bg-[#0a0f14] text-white">Moderado</option>
                <option value="Intenso" className="bg-[#0a0f14] text-white">Intenso</option>
                <option value="Atleta" className="bg-[#0a0f14] text-white">Atleta</option>
              </select>
            </div>

            <div className="space-y-4">
              <label htmlFor="ritmoIntestinal" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Ritmo Intestinal</label>
              <select 
                id="ritmoIntestinal"
                {...register('ritmoIntestinal')} 
                className={clsx(inputStyles, "text-white/40 appearance-none")}
                aria-label="Seleccionar ritmo intestinal del paciente"
              >
                <option value="Normal" className="bg-[#0a0f14] text-white">Normal</option>
                <option value="Estreñimiento" className="bg-[#0a0f14] text-white">Estreñimiento</option>
                <option value="Diarrea" className="bg-[#0a0f14] text-white">Diarrea</option>
                <option value="Irregular" className="bg-[#0a0f14] text-white">Irregular</option>
              </select>
            </div>

            <div className="space-y-4">
              <label htmlFor="aversionesAlimentarias" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Aversiones</label>
              <input id="aversionesAlimentarias" {...register('aversionesAlimentarias')} className={inputStyles} placeholder="Alimentos que rechaza" aria-label="Ingresar alimentos que el paciente rechaza" />
            </div>

            <div className="space-y-4">
              <label htmlFor="horasSueno" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Horas de Sueño</label>
              <input id="horasSueno" type="number" {...register('horasSueno', { valueAsNumber: true })} className={inputStyles} placeholder="Ej. 8" aria-label="Ingresar horas de sueño por noche" />
            </div>

            <div className="space-y-4">
              <label htmlFor="nivelEstres" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Nivel de Estrés (1-10)</label>
              <input id="nivelEstres" type="number" {...register('nivelEstres', { valueAsNumber: true })} className={inputStyles} placeholder="Ej. 5" min={1} max={10} aria-label="Ingresar nivel de estrés percibido del 1 al 10" />
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 pt-8 border-t border-white/5 relative z-10">
            <button 
              type="submit"
              disabled={saveMutation.isPending}
              className={clsx(
                "flex items-center gap-4 px-10 py-5 rounded-sm font-bold uppercase text-[11px] tracking-[0.3em] transition-all duration-75 shadow-2xl group/save relative overflow-hidden",
                saveMutation.isPending 
                  ? "bg-white/5 text-white/20 cursor-wait" 
                  : "bg-white text-[#0a0f14] hover:bg-white/90 active:scale-95"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/save:translate-x-full transition-transform duration-1000" />
              {saveMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="relative z-10">{saveMutation.isPending ? 'Sincronizando...' : 'Guardar Clínica'}</span>
            </button>

            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-4 text-emerald-400 font-bold uppercase text-[10px] tracking-[0.2em] bg-emerald-500/10 px-10 py-4 rounded-sm border border-emerald-500/20 shadow-2xl">
                  <CheckCircle2 className="w-5 h-5 shadow-lg" /> CAMBIOS PERMANENTES GUARDADOS
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-4 text-red-400 font-bold uppercase text-[10px] tracking-[0.2em] bg-red-500/10 px-10 py-4 rounded-sm border border-red-500/20 shadow-2xl">
                  <AlertCircle className="w-5 h-5" /> ERROR CRÍTICO: {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      {/* RIGHT SECTION: STRATEGIC CALCULATOR & BIO-ANALYSIS */}
      <div className="xl:col-span-5 space-y-12">
        <header className="flex items-center gap-8 bg-[#0e1419] p-6 rounded-sm border border-white/5 shadow-xl group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="w-16 h-16 bg-[#3b82f6] rounded-sm flex items-center justify-center transition-all duration-75 shadow-xl relative z-10">
             <Calculator className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold uppercase tracking-tight leading-none text-white">CÁLCULOS</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-4">GASTO ENERGÉTICO Y MACROS</p>
          </div>
        </header>

        <section className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/[0.01] rounded-full blur-[90px] -ml-40 -mt-40" />
          
          <div className="grid grid-cols-2 gap-10 mb-16 relative z-10">
            {[
               { label: 'SEXO', key: 'sexo', icon: User, type: 'select', options: ['masculino', 'femenino'], id: 'calc-sexo' },
               { label: 'ACTIVIDAD', key: 'nivelActividad', icon: Zap, type: 'select', options: ['Sedentario', 'Ligero', 'Moderado', 'Intenso', 'Atleta'], id: 'calc-actividad' },
               { label: 'PESO (KG)', key: 'peso', icon: Activity, type: 'number', id: 'calc-peso' },
               { label: 'ALTURA (CM)', key: 'altura', icon: Sparkles, type: 'number', id: 'calc-altura' },
               { label: 'EDAD', key: 'edad', icon: Clock, type: 'number', id: 'calc-edad' },
            ].map(item => (
              <div key={item.key} className="space-y-4">
                <label htmlFor={item.id} className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">{item.label}</label>
                <div className="relative group/input">
                  {item.type === 'select' ? (
                    <select 
                      id={item.id}
                      {...register(item.key as any)}
                      className="w-full p-4 bg-[#0a0f14]/60 border border-white/5 rounded-sm font-bold text-[10px] uppercase text-white focus:border-[#3b82f6]/30 outline-none shadow-inner tracking-[0.2em] appearance-none cursor-pointer"
                      aria-label={`Seleccionar ${item.label.toLowerCase()}`}
                    >
                      {item.options?.map(opt => (
                        <option key={opt} value={item.key === 'sexo' ? opt.toLowerCase() : opt} className="bg-[#0a0f14] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      id={item.id}
                      type="number" 
                      step={item.key === 'edad' ? '1' : '0.1'}
                      {...register(item.key as any, { valueAsNumber: true })}
                      className="w-full p-4 bg-[#0a0f14]/60 border border-white/5 rounded-sm text-2xl font-bold text-white focus:border-[#3b82f6]/30 outline-none transition-all duration-75 shadow-inner group-hover/input:border-white/10 tracking-tight" 
                      aria-label={`Ingresar ${item.label.toLowerCase()}`}
                    />
                  )}
                  <item.icon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/5 group-focus-within/input:text-[#3b82f6]/40 transition-all duration-75 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12 relative group">
             <div className="relative flex items-center justify-between p-10 bg-[#3b82f6] text-white rounded-sm shadow-xl overflow-hidden group-hover:-translate-y-1 transition-all duration-500">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-6 leading-none">TOTAL DIARIO (GET)</p>
                  <p className="text-4xl font-bold tracking-tight leading-none"><AnimatedNumber value={resultados.get} /> <span className="text-xl opacity-40 font-bold pr-2">KCAL</span></p>
                </div>
                <Activity className="w-24 h-24 opacity-10 absolute right-[-10px] bottom-[-20px]" />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full mb-12 relative z-10">
              { [
               { id: 'deficit', label: 'Déficit', val: deficit, color: 'text-red-400', activeBg: 'bg-red-500/10 border-red-500/30', icon: ArrowDown },
               { id: 'mantenimiento', label: 'Mantener', val: mantenimiento, color: 'text-white/20', activeBg: 'bg-white/5 border-white/20', icon: Equal },
               { id: 'superavit', label: 'Superávit', val: superavit, color: 'text-emerald-400', activeBg: 'bg-emerald-500/10 border-emerald-500/30', icon: ArrowUp }
              ].map((opt, i) => (
                 <button 
                   key={i} 
                   type="button"
                   onClick={() => setValue('tipoObjetivo', opt.id as any)}
                   aria-pressed={watchedFields.tipoObjetivo === opt.id}
                   aria-label={`Establecer objetivo de ${opt.label}: ${opt.val} calorías por día`}
                   className={clsx(
                     "rounded-sm p-6 flex flex-col items-center justify-center text-center gap-6 shadow-xl group/opt transition-all duration-75 border",
                     watchedFields.tipoObjetivo === opt.id 
                       ? opt.activeBg 
                       : "bg-[#0a0f14]/60 border-white/5 hover:border-white/20"
                   )}
                 >
                   <opt.icon className={clsx(
                     "w-8 h-8 transition-transform duration-75",
                     watchedFields.tipoObjetivo === opt.id ? opt.color : "text-white/10 group-hover/opt:scale-110"
                   )} />
                   <div className="space-y-2">
                     <span className={clsx(
                       "text-[9px] font-bold uppercase tracking-[0.4em] transition-colors",
                       watchedFields.tipoObjetivo === opt.id ? "text-white" : "text-white/10"
                     )}>{opt.label}</span>
                     <div className="text-2xl font-bold text-white tracking-tight"><AnimatedNumber value={opt.val} /></div>
                     <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest leading-none">cal/día</span>
                   </div>
                 </button>
              ))}
          </div>

          <div className="space-y-12 relative z-10">
            <h3 className="font-bold uppercase text-[10px] tracking-[0.5em] text-white/10 flex items-center gap-6">
               <Sparkles className="w-4 h-4 text-[#3b82f6]" /> MACROS
            </h3>
            
            <div className="space-y-8">
               {[
                 { label: 'Carbohidratos', key: 'carbos', g: macros.carbohidratos, color: 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' },
                 { label: 'Proteínas', key: 'proteinas', g: macros.proteinas, color: 'bg-[#1B365D] shadow-[0_0_30px_rgba(27,54,93,0.3)] border border-white/10' },
                 { label: 'Grasas', key: 'grasas', g: macros.grasas, color: 'bg-white/5' }
               ].map((macro) => (
                 <div key={macro.key} className="space-y-4 group cursor-default">
                   <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.3em]">
                     <span className="text-white/20 group-hover:text-white transition-all duration-75">{macro.label} ({macrosPct[macro.key as keyof typeof macrosPct]}%)</span>
                     <span className="text-white text-2xl tracking-tight">{macro.g}g</span>
                   </div>
                   <div 
                    className="w-full h-2 bg-[#070C14]/80 rounded-full overflow-hidden relative border border-white/5"
                    role="progressbar"
                    aria-valuenow={macrosPct[macro.key as keyof typeof macrosPct]}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Porcentaje de ${macro.label.toLowerCase()}: ${macrosPct[macro.key as keyof typeof macrosPct]}%`}
                   >
                     <motion.div 
                       layout
                       initial={{ width: 0 }}
                       animate={{ width: `${macrosPct[macro.key as keyof typeof macrosPct]}%` }}
                       transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                       className={`h-full ${macro.color} rounded-full`} 
                     />
                   </div>
                 </div>
               ))}
            </div>

            <div className="mt-12 p-8 bg-[#0a0f14]/60 rounded-sm border border-white/5 flex items-start gap-8 group transition-all duration-75">
               <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-[#3b82f6]/40" />
               </div>
               <p className="text-[11px] text-white/10 font-bold leading-relaxed uppercase tracking-[0.15em] group-hover:text-white/20 transition-all duration-75">
                 METODOLOGÍA HARRIS-BENEDICT OPTIMIZADA PARA NUTRICIÓN DEPORTIVA Y CLÍNICA. CÁLCULO DE ALTA PRECISIÓN.
               </p>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

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
  Zap,
  Copy,
  Check
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
  pacienteInitialData,
  antropometriaData,
  isActive
}: { 
  pacienteId: string, 
  onSync?: (data: any) => void,
  pacienteInitialData?: any,
  antropometriaData?: any,
  isActive?: boolean
}) {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch data from server
  const { data: serverData, isLoading, isFetched: anamnesisF } = useQuery({
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
  const [copied, setCopied] = useState(false);

  // RESET ON PATIENT CHANGE (V6 STABILIZATION)
  React.useEffect(() => {
    hasLoadedRef.current = false;
    // Clear form briefly while loading new patient
    reset({
      pacienteId: pacienteId,
      motivoConsulta: '',
      alergiasIntolerancias: 'Ninguna',
      nivelActividad: 'Sedentario',
      ritmoIntestinal: 'Normal',
      horasSueno: 8,
      nivelEstres: 5,
      peso: 70,
      altura: 170,
      sexo: 'masculino',
      tipoObjetivo: 'mantenimiento'
    } as any);
  }, [pacienteId, reset]);

  const handleCopyResults = () => {
    const text = `Resultados Clínicos - ${pacienteInitialData?.nombre || 'Paciente'}\n` +
                 `Peso: ${watchedFields.peso}kg | Altura: ${watchedFields.altura}cm | Edad: ${watchedFields.edad}\n` +
                 `GET: ${resultados.get} kcal\n` +
                 `Proteínas: ${macros.proteinas}g | Carbohidratos: ${macros.carbos}g | Grasas: ${macros.grasas}g`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const lastSyncedPesoRef = React.useRef<number | null>(null);
  const lastSyncedAlturaRef = React.useRef<number | null>(null);
  const isInternalUpdateRef = React.useRef(false);
 

  // Hidratar desde localStorage INMEDIATAMENTE (antes de que responda el servidor)
  React.useEffect(() => {
    if (hasLoadedRef.current) return;
    const cached = localStorage.getItem(`anamnesis-${pacienteId}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        reset({ ...parsed, pacienteId });
        hasLoadedRef.current = true;
      } catch {}
    }
  }, [pacienteId]);

  React.useEffect(() => {
    if (serverData?.data && !hasLoadedRef.current) {
      const data = serverData.data;
      if (Object.keys(data).length > 2) {
        reset({ ...watchedFields, ...data, pacienteId });
        if (!macrosLoadedRef.current) {
          if (data.caloriasOffset != null) setCaloriasOffset(data.caloriasOffset);
          if (data.macrosCarbos != null && data.macrosProteinas != null && data.macrosGrasas != null) {
            setMacrosPct({ carbos: data.macrosCarbos, proteinas: data.macrosProteinas, grasas: data.macrosGrasas });
          }
          macrosLoadedRef.current = true;
        }
        hasLoadedRef.current = true;
      }
    } else if (serverData?.data && hasLoadedRef.current) {
      // Ya hidratado desde localStorage, solo restaurar macros si los tiene el servidor
      const data = serverData.data;
      if (!macrosLoadedRef.current && data.macrosCarbos != null) {
        if (data.caloriasOffset != null) setCaloriasOffset(data.caloriasOffset);
        setMacrosPct({ carbos: data.macrosCarbos, proteinas: data.macrosProteinas, grasas: data.macrosGrasas });
        macrosLoadedRef.current = true;
      }
    } else if (pacienteInitialData && !hasLoadedRef.current && anamnesisF && !serverData?.data) {
       const initialValues = {
         ...watchedFields,
         motivoConsulta: pacienteInitialData.objetivo || '',
         peso: pacienteInitialData.peso || 70,
         altura: pacienteInitialData.altura || 170,
         sexo: pacienteInitialData.sexo || 'masculino',
         edad: pacienteInitialData.fechaNacimiento ?
               new Date().getFullYear() - new Date(pacienteInitialData.fechaNacimiento).getFullYear() : 30,
       };
       reset(initialValues);
       hasLoadedRef.current = true;
       saveMutation.mutate({ ...initialValues, isDraft: false });
    }
  }, [serverData, anamnesisF, reset, pacienteId, pacienteInitialData]);

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
    macrosLoadedRef.current = false;
    setCaloriasOffset(0);
    setMacrosPct({ carbos: 50, proteinas: 20, grasas: 30 });
  }, [pacienteId]);

  // PROACTIVE SYNC: If patient root data changes (e.g. edited in modal), update clinical form
  // ONLY if form is not "locked" or values match previous ones
  React.useEffect(() => {
    if (pacienteInitialData && hasLoadedRef.current) {
        const currentPeso = watchedFields.peso;
        const currentAltura = watchedFields.altura;
        
        // If profile has new data and anamnesis is still at default or matches old profile, update
        const profilePeso = pacienteInitialData.peso;
        const profileAltura = pacienteInitialData.altura;
        
        if (profilePeso && profilePeso !== currentPeso) {
            setValue('peso', profilePeso);
        }
        if (profileAltura && profileAltura !== currentAltura) {
            setValue('altura', profileAltura);
        }
    }
  }, [pacienteInitialData?.peso, pacienteInitialData?.altura, setValue]);

  // REACTIVE SYNC FROM BIOMETRY (ANTROPOMETRIA)
  // If user edits weight in Biometry tab, it should reflect here instantly
  // WE SYNC EVEN IF INACTIVE: This keeps our internal form updated so we don't back-sync OLD data when we become active.
  React.useEffect(() => {
    if (antropometriaData?.mediciones) {
        const clPeso = Number(antropometriaData.mediciones.peso);
        const clAltura = Number(antropometriaData.mediciones.altura);

        // REGRESIÓN DE BUCLE: Solo sincronizar si el usuario NO está editando estos campos aquí
        const isPesoFocused = document.activeElement?.id === 'calc-peso';
        const isAlturaFocused = document.activeElement?.id === 'calc-altura';

        // Threshold comparison to break floating point loops + Focus lock
        if (clPeso && !isPesoFocused && Math.abs(clPeso - (lastSyncedPesoRef.current || 0)) > 0.01) {
            isInternalUpdateRef.current = true;
            setValue('peso', clPeso, { shouldDirty: false });
            lastSyncedPesoRef.current = clPeso;
            setTimeout(() => { isInternalUpdateRef.current = false; }, 100);
        }
        
        if (clAltura && !isAlturaFocused && Math.abs(clAltura - (lastSyncedAlturaRef.current || 0)) > 0.01) {
            isInternalUpdateRef.current = true;
            setValue('altura', clAltura, { shouldDirty: false });
            lastSyncedAlturaRef.current = clAltura;
            setTimeout(() => { isInternalUpdateRef.current = false; }, 100);
        }
    }
  }, [antropometriaData?.mediciones?.peso, antropometriaData?.mediciones?.altura, setValue, isActive]);
 
 

  const [macrosPct, setMacrosPct] = useState({ carbos: 50, proteinas: 20, grasas: 30 });
  const [caloriasOffset, setCaloriasOffset] = useState(0);
  const macrosLoadedRef = React.useRef(false);

  const handleMacroPctChange = (changedKey: 'carbos' | 'proteinas' | 'grasas', newVal: number) => {
    const clamped = Math.max(0, Math.min(100, newVal));
    setMacrosPct(prev => ({ ...prev, [changedKey]: clamped }));
  };

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
    let base = mantenimiento;
    if (watchedFields.tipoObjetivo === 'deficit') base = deficit;
    if (watchedFields.tipoObjetivo === 'superavit') base = superavit;
    return Math.max(0, base + caloriasOffset);
  }, [watchedFields.tipoObjetivo, deficit, mantenimiento, superavit, caloriasOffset]);

  // Sync currentTargetKcal to form field for persistence
  React.useEffect(() => {
    setValue('caloriasObjetivo', currentTargetKcal);
  }, [currentTargetKcal, setValue]);

  // Sync caloriasOffset and macrosPct to form for persistence
  React.useEffect(() => {
    setValue('caloriasOffset' as any, caloriasOffset);
  }, [caloriasOffset, setValue]);
  React.useEffect(() => {
    setValue('macrosCarbos' as any, macrosPct.carbos);
    setValue('macrosProteinas' as any, macrosPct.proteinas);
    setValue('macrosGrasas' as any, macrosPct.grasas);
  }, [macrosPct, setValue]);

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
      // Invalidate evolutionary history to reflect changes in Dashboard
      queryClient.invalidateQueries({ queryKey: ['historial-antropometria', pacienteId] });
      queryClient.invalidateQueries({ queryKey: ['biometria', pacienteId] });
      queryClient.invalidateQueries({ queryKey: ['paciente', pacienteId] });
    },
    onError: (err: any) => {
       setError(err.message);
       setTimeout(() => setError(null), 5000);
    }
  });

  // Sync state to parent for PDF/Preview
  const lastSyncRef = React.useRef<string>('');
  
  React.useEffect(() => {
    if (!isActive) return; // PROCESO DE ESTABILIZACIÓN V4
    if (onSync) {
      if (isInternalUpdateRef.current) return; // Break Loop

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
 

  // Guardar en localStorage en cada cambio (backup instantáneo ante F5)
  React.useEffect(() => {
    if (!hasLoadedRef.current || !pacienteId) return;
    localStorage.setItem(`anamnesis-${pacienteId}`, JSON.stringify(watchedFields));
  }, [watchedFields, pacienteId]);

  // Autosave debounced al servidor (reducido a 800ms)
  const autoSaveRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (!watchedFields.pacienteId) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      if (!hasLoadedRef.current) return;
      const validation = draftAnamnesisSchema.safeParse(watchedFields);
      if (validation.success) {
        saveMutation.mutate({ ...watchedFields, isDraft: false });
      }
    }, 800);
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
        <header className="flex flex-col sm:flex-row sm:items-center gap-6 bg-[#0e1419] p-6 rounded-sm shadow-xl border border-white/5 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="w-16 h-16 bg-[#3b82f6] rounded-sm flex items-center justify-center transition-all duration-75 shadow-xl relative z-10 shrink-0">
             <ClipboardList className="w-8 h-8 text-white" />
          </div>
           <div className="relative z-10 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight leading-none text-white">ANAMNESIS</h2>
              <div className={clsx(
                "flex items-center justify-center gap-3 px-3 py-1.5 rounded-sm border transition-all duration-75 uppercase text-[7px] sm:text-[8px] font-black tracking-[0.2em] whitespace-nowrap self-start sm:self-center",
                saveMutation.isPending ? "bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/40"
              )}>
                {saveMutation.isPending ? (
                  <>
                    <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-2 h-2" />
                    Sincronizado
                  </>
                )}
              </div>
            </div>
            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-3">ANÁLISIS DE HÁBITOS Y ANTECEDENTES</p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0e1419] p-4 sm:p-8 rounded-sm border border-white/5 shadow-xl space-y-8 sm:space-y-12 group/form relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] -ml-48 -mb-48" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
            
            <div className="space-y-4">
              <label htmlFor="motivoConsulta" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-6">Motivo de Consulta</label>
              {/* Persistent Objective Fields */}
              <input type="hidden" {...register('tipoObjetivo')} id="tipoObjetivo-hidden" />
              <input type="hidden" {...register('caloriasObjetivo')} id="caloriasObjetivo-hidden" />
              <input type="hidden" {...register('caloriasOffset' as any)} id="caloriasOffset-hidden" />
              <input type="hidden" {...register('macrosCarbos' as any)} id="macrosCarbos-hidden" />
              <input type="hidden" {...register('macrosProteinas' as any)} id="macrosProteinas-hidden" />
              <input type="hidden" {...register('macrosGrasas' as any)} id="macrosGrasas-hidden" />
              
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

        <section className="bg-[#0e1419] p-4 sm:p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/[0.01] rounded-full blur-[90px] -ml-40 -mt-40" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-16 relative z-10">
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
                      className="w-full p-3 sm:p-4 pr-10 bg-[#0a0f14]/60 border border-white/5 rounded-sm text-xl sm:text-2xl font-bold text-white focus:border-[#3b82f6]/30 outline-none transition-all duration-75 shadow-inner group-hover/input:border-white/10 tracking-tight tabular-nums"
                      aria-label={`Ingresar ${item.label.toLowerCase()}`}
                    />
                  )}
                  <item.icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-transparent group-focus-within/input:text-[#3b82f6]/50 transition-colors duration-150 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12 relative group">
             <div className="relative flex items-center justify-between p-6 sm:p-10 bg-[#3b82f6] text-white rounded-sm shadow-xl overflow-hidden group-hover:-translate-y-1 transition-all duration-500">
                <div className="relative z-10 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-6 leading-none">TOTAL DIARIO (GET)</p>
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight leading-none"><AnimatedNumber value={resultados.get} /> <span className="text-lg sm:text-xl opacity-40 font-bold pr-2">KCAL</span></p>
                </div>
                <div className="flex flex-col gap-4 relative z-10">
                   <button 
                     type="button"
                     onClick={handleCopyResults}
                     className="p-3 bg-white/10 hover:bg-white/20 rounded-sm border border-white/10 transition-all group/copy"
                   >
                     {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40 group-hover/copy:text-white" />}
                   </button>
                   <Activity className="w-12 h-12 opacity-10" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full mb-12 relative z-10">
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

          {/* #3 — Ajuste manual de calorías */}
          <div className="mb-12 bg-[#0e1419] border border-white/5 rounded-sm p-6 space-y-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Ajuste manual de calorías</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Restar 50 calorías"
                onClick={() => setCaloriasOffset(o => o - 50)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm text-white font-bold text-lg transition-colors"
              >−</button>
              <div className="flex-1 text-center">
                <span className={clsx("text-2xl font-bold tracking-tight", caloriasOffset > 0 ? "text-emerald-400" : caloriasOffset < 0 ? "text-red-400" : "text-white/20")}>
                  {caloriasOffset > 0 ? '+' : ''}{caloriasOffset}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/10 block">kcal de ajuste</span>
              </div>
              <button
                type="button"
                aria-label="Sumar 50 calorías"
                onClick={() => setCaloriasOffset(o => o + 50)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm text-white font-bold text-lg transition-colors"
              >+</button>
            </div>
            {caloriasOffset !== 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Total objetivo</span>
                <span className="text-lg font-bold text-white">{currentTargetKcal} <span className="text-sm opacity-30">kcal</span></span>
              </div>
            )}
            {caloriasOffset !== 0 && (
              <button type="button" onClick={() => setCaloriasOffset(0)} className="text-[8px] font-bold uppercase tracking-widest text-white/10 hover:text-white/40 transition-colors">
                Resetear ajuste
              </button>
            )}
          </div>

          <div className="space-y-12 relative z-10">
            <h3 className="font-bold uppercase text-[10px] tracking-[0.5em] text-white/10 flex items-center gap-6">
               <Sparkles className="w-4 h-4 text-[#3b82f6]" /> MACROS
            </h3>

            {/* #4 — Macros editables */}
            <div className="space-y-8">
               {([
                 { label: 'Carbohidratos', key: 'carbos' as const, g: macros.carbohidratos, color: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
                 { label: 'Proteínas', key: 'proteinas' as const, g: macros.proteinas, color: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
                 { label: 'Grasas', key: 'grasas' as const, g: macros.grasas, color: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' }
               ]).map((macro) => (
                 <div key={macro.key} className="space-y-4 group">
                   <div className="flex items-center gap-3">
                     <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-all duration-75 flex-1 min-w-0 truncate">{macro.label}</span>
                     <div className="flex items-center gap-2 shrink-0">
                       <input
                         type="number"
                         min={0}
                         max={100}
                         value={macrosPct[macro.key]}
                         onChange={e => handleMacroPctChange(macro.key, parseInt(e.target.value) || 0)}
                         aria-label={`Porcentaje de ${macro.label}`}
                         className="w-14 text-center bg-[#0a0f14] border border-white/10 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm py-1.5 px-1 tabular-nums"
                       />
                       <span className="text-white/20 font-bold text-sm">%</span>
                     </div>
                     <span className="text-white text-lg tracking-tight font-bold shrink-0 w-16 text-right tabular-nums">{macro.g}g</span>
                   </div>
                   <div
                    className="w-full h-2 bg-[#070C14]/80 rounded-full overflow-hidden relative border border-white/5"
                    role="progressbar"
                    aria-valuenow={macrosPct[macro.key]}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Porcentaje de ${macro.label.toLowerCase()}: ${macrosPct[macro.key]}%`}
                   >
                     <motion.div
                       layout
                       initial={{ width: 0 }}
                       animate={{ width: `${macrosPct[macro.key]}%` }}
                       transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                       className={`h-full ${macro.color} rounded-full`}
                     />
                   </div>
                 </div>
               ))}
            </div>

            {/* Total indicator */}
            {(() => {
              const total = macrosPct.carbos + macrosPct.proteinas + macrosPct.grasas;
              return (
                <div className={`flex items-center justify-between px-3 py-2 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition-all duration-75 ${total === 100 ? 'border-emerald-500/20 text-emerald-500/40' : 'border-red-500/30 text-red-400/60'}`}>
                  <span>Total</span>
                  <span>{total}%{total !== 100 ? ` (faltan ${100 - total}%)` : ' ✓'}</span>
                </div>
              );
            })()}

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

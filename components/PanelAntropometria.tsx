'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Ruler, 
  Scale, 
  TrendingDown,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  FileText,
  Trash2,
  Paperclip,
  UploadCloud,
  Plus
} from 'lucide-react';
import { 
  calcularIMC, 
  calcularGrasaFaulkner, 
  calcularComposicionCorporal,
  clasificarIMC 
} from '@/utils/calculosAntropometricos';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { antropometriaSchema } from '@/schemas/antropometriaSchema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConsultaStore } from '@/store/useConsultaStore';


export default function PanelAntropometria({ 
  pacienteId, 
  onSync,
  pacienteInitialData,
  anamnesisData,
  isActive
}: { 
  pacienteId: string, 
  onSync?: (data: any) => void,
  pacienteInitialData?: any,
  anamnesisData?: any,
  isActive?: boolean
}) {
  const queryClient = useQueryClient();
  const setStoreAntro = useConsultaStore(state => state.setAntropometria);
  const storeAntro = useConsultaStore(state => state.antropometria);

  const { register, watch, reset, setValue, formState: { isValid } } = useForm({
    resolver: zodResolver(antropometriaSchema),
    mode: 'onChange',
    defaultValues: {
      pacienteId: pacienteId,
      peso: pacienteInitialData?.peso || 70,
      altura: pacienteInitialData?.altura || 170,
      pliegues: { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18, muslo: 15 },
      perimetros: { cintura: 80, cadera: 95 }
    }
  });

  // 1. Fetch History
  const { data: serverData } = useQuery({
    queryKey: ['antropometria', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/biometria?pacienteId=${pacienteId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Error al cargar antropometría');
      return res.json();
    },
    enabled: !!pacienteId
  });

  const { data: anamnesisRaw } = useQuery({
    queryKey: ['anamnesis', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/anamnesis?pacienteId=${pacienteId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Error');
      return res.json();
    },
    enabled: !!pacienteId && (!serverData?.data || serverData.data.length === 0)
  });

  const hasLoadedRef = React.useRef(false);
  const isInternalUpdateRef = React.useRef(false);
  const lastSyncedPesoRef = React.useRef<number | null>(null);
  const lastSyncedAlturaRef = React.useRef<number | null>(null);
 
  // RESET ON PATIENT CHANGE (V6 STABILIZATION)
  React.useEffect(() => {
    hasLoadedRef.current = false;
    reset({
      pacienteId: pacienteId,
      peso: 70,
      altura: 170,
      pliegues: { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18, muslo: 15 },
      perimetros: { cintura: 80, cadera: 95 }
    });
  }, [pacienteId, reset]);

  React.useEffect(() => {
    // Session fallback (Instant restoration before server responds)
    if (storeAntro && !hasLoadedRef.current) {
        reset({
            pacienteId,
            ...storeAntro.mediciones,
            pliegues: storeAntro.mediciones?.pliegues || { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18, muslo: 15 },
            perimetros: storeAntro.mediciones?.perimetros || { cintura: 80, cadera: 95 }
        });
        hasLoadedRef.current = true;
    }
    
    // Server data secondary hydration
    if (serverData?.data && serverData.data.length > 0 && !hasLoadedRef.current) {
      const latest = serverData.data[serverData.data.length - 1];
      reset({ 
        pacienteId: pacienteId,
        peso: latest.peso || 70, 
        altura: latest.altura || 170, 
        pliegues: latest.pliegues || { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18, muslo: 15 },
        perimetros: latest.perimetros || { cintura: 80, cadera: 95 }
      });
      hasLoadedRef.current = true;
      return;
    }

    if (anamnesisRaw?.data && !hasLoadedRef.current) {
      reset({
        pacienteId: pacienteId,
        peso: anamnesisRaw.data.peso || 70,
        altura: anamnesisRaw.data.altura || 170,
        pliegues: { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18, muslo: 15 },
        perimetros: { cintura: 80, cadera: 95 }
      });
      hasLoadedRef.current = true;
      return;
    }
  }, [serverData, anamnesisRaw, reset, pacienteId, storeAntro]);

  // Reactive sync from clinical panel (anamnesisData prop)
  // WE SYNC EVEN IF INACTIVE: This keeps our internal form updated so we don't back-sync OLD data when we become active.
  React.useEffect(() => {
    if (anamnesisData?.anamnesis && hasLoadedRef.current) {
        const clPeso = Number(anamnesisData.anamnesis.peso);
        const clAltura = Number(anamnesisData.anamnesis.altura);
        
        // REGRESIÓN DE BUCLE: Si el usuario tiene el foco aquí, ignorar señal externa
        const isPesoFocused = (document.activeElement?.id === 'peso');
        const isAlturaFocused = (document.activeElement?.id === 'altura');

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
  }, [anamnesisData?.anamnesis?.peso, anamnesisData?.anamnesis?.altura, isActive]);
 

  React.useEffect(() => { hasLoadedRef.current = false; }, [pacienteId]);

  const peso = watch('peso');
  const altura = watch('altura');
  const pliegues = watch('pliegues');
  const perimetros = watch('perimetros');
  
  const imc = React.useMemo(() => calcularIMC(peso, altura), [peso, altura]);
  const grasaPct = React.useMemo(() => calcularGrasaFaulkner(
    pliegues?.triceps || 0, 
    pliegues?.subescapular || 0, 
    pliegues?.suprailiaco || 0, 
    pliegues?.abdominal || 0
  ), [pliegues]);
  const comp = React.useMemo(() => calcularComposicionCorporal(peso, grasaPct), [peso, grasaPct]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/biometria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al guardar');
      return res.json();
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['antropometria', pacienteId], (old: any) => {
        const newData = Array.isArray(old?.data) ? [...old.data] : [];
        const latestIdx = newData.findIndex((d: any) => new Date(d.createdAt).toDateString() === new Date().toDateString());
        if (latestIdx > -1) newData[latestIdx] = res.data;
        else newData.push(res.data);
        return { data: newData };
      });
      queryClient.invalidateQueries({ queryKey: ['paciente', pacienteId] });
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pacienteId', pacienteId);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Error al subir');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antropometria', pacienteId] });
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (url: string) => {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId, url }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antropometria', pacienteId] });
    }
  });

  const lastSyncRef = React.useRef<string>('');
  React.useEffect(() => {
    if (!isActive) return; // PROCESO DE ESTABILIZACIÓN V4
    const activeValues = { peso, altura, pliegues, perimetros };
    if (onSync) {
      if (isInternalUpdateRef.current) return; // Break Loop

      const syncObj = {
        mediciones: activeValues,
        resultados: { imc, clasificacionIMC: clasificarIMC(imc), porcentajeGrasa: grasaPct, masaMagraKg: comp.masaMagraKg, masaGordaKg: comp.masaGordaKg }
      };
      const syncStr = JSON.stringify(syncObj);
      if (syncStr !== lastSyncRef.current) {
        lastSyncRef.current = syncStr;
        onSync(syncObj);
        // Instant sync to session store
        setStoreAntro(syncObj);
        // Keep track of our own synced values to avoid loops
        lastSyncedPesoRef.current = Number(peso);
        lastSyncedAlturaRef.current = Number(altura);
      }
    }
 
    const timer = setTimeout(() => {
      if (isValid && pacienteId) {
        saveMutation.mutate({ pacienteId, peso, altura, pliegues, perimetros, resultados: { porcentajeGrasa: grasaPct, imc, masaGordaKg: comp.masaGordaKg, masaMagraKg: comp.masaMagraKg } });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [peso, altura, pliegues, perimetros, imc, grasaPct, comp, isValid, pacienteId, onSync, setStoreAntro]);
 

  const inputStyles = "w-full p-5 bg-[#0a0f14]/60 border border-white/5 focus:border-[#3b82f6]/30 rounded-sm outline-none transition-all duration-75 font-bold uppercase text-[10px] tracking-[0.2em] text-white placeholder:text-white/5 shadow-xl";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-white">
      <div className="xl:col-span-8 space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-center gap-6 bg-[#0e1419] p-6 rounded-sm border border-white/5 shadow-xl group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="w-16 h-16 bg-[#3b82f6] rounded-sm flex items-center justify-center transition-all duration-75 shadow-xl relative z-10 shrink-0">
             <Ruler className="w-8 h-8 text-white" />
          </div>
           <div className="relative z-10 flex-1 w-full">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
               <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight leading-none text-white">ANTROPOMETRÍA</h2>
               <div className={clsx(
                 "flex items-center justify-center gap-3 px-3 py-1.5 rounded-sm border transition-all duration-75 uppercase text-[7px] sm:text-[8px] font-black tracking-[0.2em] whitespace-nowrap self-start sm:self-center",
                 saveMutation.isPending ? "bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/40"
               )}>
                 {saveMutation.isPending ? "Sincronizando..." : "Sincronizado"}
               </div>
             </div>
             <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-3">MEDICIONES Y COMPOSICIÓN CORPORAL</p>
           </div>
         </header>

        <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden group">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            <div className="col-span-full pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white/30" />
                </div>
                <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/10 text-white/20">MÉTRICAS FUNDAMENTALES</h3>
              </div>
              <div className="bg-[#0a0f14] px-6 py-2.5 rounded-sm border border-white/5 flex items-center gap-6 shadow-xl transition-all duration-75">
                <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] leading-none">STATUS:</span>
                <span className="text-xl font-bold text-white tracking-tight leading-none uppercase">{clasificarIMC(imc)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="peso" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Peso (KG)</label>
              <input id="peso" type="number" {...register('peso', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-4">
              <label htmlFor="altura" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Estatura (CM)</label>
              <input id="altura" type="number" {...register('altura', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-4 bg-[#0a0f14] p-6 rounded-sm border border-white/5 text-center flex flex-col justify-center shadow-xl group/bmi transition-all duration-75 relative overflow-hidden">
               <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mb-4 leading-none group-hover/bmi:text-white transition-all duration-75 relative z-10">IMC</span>
               <span className="text-4xl font-bold text-white tracking-tight relative z-10">{imc}</span>
            </div>

            {/* SECCIÓN RESTAURADA: PERÍMETROS */}
            <div className="col-span-full pt-10 pb-4 border-b border-white/5 flex items-center gap-6">
              <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center">
                <Ruler className="w-5 h-5 text-white/30" />
              </div>
              <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/20">Cintura y Cadera (CM)</h3>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Cintura</label>
              <input type="number" step="0.1" {...register('perimetros.cintura', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Cadera</label>
              <input type="number" step="0.1" {...register('perimetros.cadera', { valueAsNumber: true })} className={inputStyles} />
            </div>

            {/* RESTORED FILE UPLOAD SECTION */}
            <div className="col-span-full pt-8 pb-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-sm flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/10">ARCHIVOS / ADJUNTOS</h3>
              </div>
              <label className="cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-3">
                <Plus className="w-3.5 h-3.5" />
                {uploadMutation.isPending ? 'SUBIENDO...' : 'SUBIR ARCHIVO'}
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if(file) uploadMutation.mutate(file); }} />
              </label>
            </div>

            <div className="col-span-full">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serverData?.data && serverData.data.length > 0 && 
                    serverData.data.flatMap((d: any) => d.archivos || []).map((file: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#0a0f14]/60 border border-white/5 rounded-sm group/file hover:border-[#3b82f6]/20 transition-all duration-300">
                       <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center shrink-0">
                             {file.tipo?.includes('image') ? <Sparkles className="w-5 h-5 text-[#3b82f6]/60" /> : <FileText className="w-5 h-5 text-emerald-500/60" />}
                          </div>
                          <div className="min-w-0">
                             <p className="text-[10px] font-bold text-white uppercase truncate tracking-tight">{file.nombre}</p>
                             <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">{new Date(file.fecha).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 shrink-0 text-white/20">
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-[#3b82f6] transition-colors"><CheckCircle2 className="w-4 h-4" /></a>
                          <button onClick={() => deleteFileMutation.mutate(file.url)} className="p-2 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  ))}
                  {(!serverData?.data || serverData.data.flatMap((d: any) => d.archivos || []).length === 0) && (
                     <div className="col-span-full py-10 border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center gap-4 text-white/10 transition-all">
                        <Paperclip className="w-8 h-8 opacity-20" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Sin archivos adjuntos</p>
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-12">
        <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl h-full relative overflow-hidden group">
          <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-6 relative z-10 uppercase tracking-tight">
            <div className="w-10 h-10 bg-[#3b82f6] rounded-sm flex items-center justify-center shadow-xl"><TrendingDown className="w-5 h-5 text-white" /></div>RESULTADOS
          </h3>
          <div className="bg-white/5 p-8 rounded-sm text-white/20 flex items-start gap-6 border border-white/5">
            <Info className="w-8 h-8 shrink-0 text-[#3b82f6]/40" />
            <p className="text-[10px] leading-relaxed font-bold uppercase tracking-widest italic">Los datos antropométricos se registran correctamente. Para análisis de composición corporal consulte con el profesional.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function clsx(...classes: any[]) { return classes.filter(Boolean).join(' '); }

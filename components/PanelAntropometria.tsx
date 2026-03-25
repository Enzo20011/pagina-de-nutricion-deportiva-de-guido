'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Ruler, 
  Dna, 
  Scale, 
  TrendingDown,
  Sparkles,
  Zap,
  Info
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

export default function PanelAntropometria({ 
  pacienteId, 
  onSync,
  pacienteInitialData
}: { 
  pacienteId: string, 
  onSync?: (data: any) => void,
  pacienteInitialData?: any
}) {
  const queryClient = useQueryClient();
  const { register, watch, reset, formState: { isValid } } = useForm({
    resolver: zodResolver(antropometriaSchema),
    mode: 'onChange',
    defaultValues: {
      pacienteId: pacienteId,
      peso: pacienteInitialData?.peso || 70,
      altura: pacienteInitialData?.altura || 170,
      pliegues: {
        triceps: 10,
        subescapular: 12,
        suprailiaco: 15,
        abdominal: 18,
      }
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

  // 1.5 Fetch Anamnesis for Fallback (Peso/Altura)
  const { data: anamnesisRaw } = useQuery({
    queryKey: ['anamnesis', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/anamnesis?pacienteId=${pacienteId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Error');
      return res.json();
    },
    enabled: !!pacienteId && (!serverData?.data || serverData.data.length === 0)
  });

  // Sync server data to form only ONCE per patient load
  const hasLoadedRef = React.useRef(false);
  React.useEffect(() => {
    // 1. Prioridad: Datos guardados de Biometría (Histórico)
    if (serverData?.data && serverData.data.length > 0 && !hasLoadedRef.current) {
      const latest = serverData.data[serverData.data.length - 1];
      reset({ 
        pacienteId: pacienteId,
        peso: latest.peso || 70, 
        altura: latest.altura || 170, 
        pliegues: { 
          triceps: latest.pliegues?.triceps || 10,
          subescapular: latest.pliegues?.subescapular || 12,
          suprailiaco: latest.pliegues?.suprailiaco || 15,
          abdominal: latest.pliegues?.abdominal || 18,
        },
      });
      hasLoadedRef.current = true;
      return;
    }

    // 2. Segunda prioridad: Datos de Anamnesis (si ya se llenó en el primer paso)
    if (anamnesisRaw?.data && !hasLoadedRef.current) {
      reset({
        pacienteId: pacienteId,
        peso: anamnesisRaw.data.peso || 70,
        altura: anamnesisRaw.data.altura || 170,
        pliegues: { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18 }
      });
      hasLoadedRef.current = true;
      return;
    }

    // 3. Tercera prioridad: Datos del registro inicial del paciente
    if (pacienteInitialData && !hasLoadedRef.current && serverData && (!serverData.data || serverData.data.length === 0)) {
      reset({
        pacienteId: pacienteId,
        peso: pacienteInitialData.weight || pacienteInitialData.peso || 70,
        altura: pacienteInitialData.height || pacienteInitialData.altura || 170,
        pliegues: { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18 }
      });
      hasLoadedRef.current = true;
    }
  }, [serverData, anamnesisRaw, reset, pacienteId, pacienteInitialData]);

  // Reset flag when patient changes
  React.useEffect(() => {
    hasLoadedRef.current = false;
  }, [pacienteId]);

  const peso = watch('peso');
  const altura = watch('altura');
  const pliegues = watch('pliegues');
  
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
        // If it's a new entry for today, add or update it in the history array
        const latestIdx = newData.findIndex((d: any) => new Date(d.createdAt).toDateString() === new Date().toDateString());
        if (latestIdx > -1) newData[latestIdx] = res.data;
        else newData.push(res.data);
        return { data: newData };
      });
      
      const el = document.getElementById('biometria-success');
      if (el) {
        el.style.opacity = '1';
        setTimeout(() => { if (el) el.style.opacity = '0'; }, 3000);
      }
    }
  });

  const lastSyncRef = React.useRef<string>('');

  React.useEffect(() => {
    const activeValues = { peso, altura, pliegues };
    if (onSync) {
      const syncObj = {
        mediciones: activeValues,
        imc,
        clasificacionIMC: clasificarIMC(imc),
        grasaPct,
        masaMagraKg: comp.masaMagraKg,
        masaGordaKg: comp.masaGordaKg
      };
      
      const syncStr = JSON.stringify(syncObj);
      if (syncStr !== lastSyncRef.current) {
        lastSyncRef.current = syncStr;
        onSync(syncObj);
      }
    }
    const timer = setTimeout(() => {
      if (isValid && pacienteId) {
        saveMutation.mutate({ 
          pacienteId,
          peso,
          altura,
          pliegues,
          resultados: { porcentajeGrasa: grasaPct, imc, masaGordaKg: comp.masaGordaKg, masaMagraKg: comp.masaMagraKg }
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [peso, altura, pliegues, imc, grasaPct, comp, isValid, pacienteId, onSync]);

  const inputStyles = "w-full p-5 bg-[#0a0f14]/60 border border-white/5 focus:border-[#3b82f6]/30 rounded-sm outline-none transition-all duration-700 font-bold uppercase text-[10px] tracking-[0.2em] text-white placeholder:text-white/5 shadow-xl";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-white">
      
      {/* LEFT SECTION: MEASUREMENTS PROTOCOL */}
      <div className="xl:col-span-8 space-y-12">
        <header className="flex items-center gap-8 bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="w-16 h-16 bg-[#3b82f6] rounded-sm flex items-center justify-center transition-all duration-700 shadow-xl relative z-10">
             <Ruler className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
             <h2 className="text-2xl font-bold uppercase tracking-tight leading-none text-white">ANTROPOMETRÍA</h2>
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-4">MEDICIONES Y COMPOSICIÓN CORPORAL</p>
          </div>
        </header>

        <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden group">
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/[0.01] rounded-full translate-x-1/2 translate-y-1/2 blur-[120px]" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            
            {/* Fundamental Measures Tactical */}
            <div className="col-span-full pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white/30" />
                </div>
                <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/10 text-white/20">MÉTRICAS FUNDAMENTALES</h3>
              </div>
              <div className="bg-[#0a0f14] px-6 py-2.5 rounded-sm border border-white/5 flex items-center gap-6 shadow-xl transition-all duration-700">
                <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] leading-none">STATUS:</span>
                <span className="text-xl font-bold text-white tracking-tight leading-none uppercase">{clasificarIMC(imc)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Peso (KG)</label>
              <input type="number" {...register('peso', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Estatura (CM)</label>
              <input type="number" {...register('altura', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-4 bg-[#0a0f14] p-6 rounded-sm border border-white/5 text-center flex flex-col justify-center shadow-xl group/bmi transition-all duration-700 relative overflow-hidden">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mb-4 leading-none group-hover/bmi:text-white transition-all duration-700 relative z-10">IMC</span>
              <span className="text-4xl font-bold text-white tracking-tight relative z-10">{imc} <span className="text-[9px] text-white/10 block mt-4 font-bold tracking-[0.2em] uppercase">VALOR CALCULADO</span></span>
            </div>

            {/* Skinfolds Tactical Protocol */}
            <div className="col-span-full pt-8 pb-6 border-b border-white/5 flex items-center gap-6">
              <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center">
                <Dna className="w-5 h-5 text-[#3b82f6]/50" />
              </div>
              <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/10">PLIEGUES CUTÁNEOS (MM)</h3>
            </div>

            {[
              { label: 'Tríceps', key: 'pliegues.triceps' },
              { label: 'Subescapular', key: 'pliegues.subescapular' },
              { label: 'Suprailíaco', key: 'pliegues.suprailiaco' },
              { label: 'Abdominal', key: 'pliegues.abdominal' }
            ].map(f => (
              <div key={f.key} className="space-y-4 group/fold">
                <label className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4 group-hover/fold:text-white transition-all duration-700">{f.label}</label>
                <input type="number" {...register(f.key as any, { valueAsNumber: true })} className="w-full p-5 bg-[#0a0f14] border border-white/5 rounded-sm outline-none text-xl font-bold text-white focus:border-[#3b82f6]/30 transition-all duration-700 shadow-xl tracking-tight" />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* RIGHT SECTION: CORE RESULTS */}
      <div className="xl:col-span-4 space-y-12">
        <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl h-full relative overflow-hidden group">
          <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-6 relative z-10 uppercase tracking-tight">
            <div className="w-10 h-10 bg-[#3b82f6] rounded-sm flex items-center justify-center shadow-xl">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            RESULTADOS
          </h3>

          <div className="space-y-16 relative z-10">
            <div className="relative group/grasa">
              <div className="flex mb-8 items-end justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/10 block mb-3 leading-none group-hover/grasa:text-white transition-all duration-700">GRASA (FAULKNER)</span>
                  <span className="text-2xl font-bold uppercase text-white leading-none tracking-tight">
                    PORCENTAJE
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white tracking-tight drop-shadow-2xl">
                    {grasaPct}<span className="text-xl opacity-20 ml-2">%</span>
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-12 bg-[#070C14] rounded-full shadow-inner relative transition-all duration-700 border border-white/5">
                <motion.div 
                  layout
                  initial={{ width: 0 }}
                  animate={{ width: `${grasaPct}%` }}
                  className="h-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-[#0a0f14] rounded-sm border border-white/5 text-center flex flex-col items-center justify-center space-y-4 shadow-xl relative overflow-hidden group/magra">
                <p className="text-[9px] font-bold text-white/5 uppercase tracking-[0.4em] leading-none mb-2 italic relative z-10">Masa Magra</p>
                <div className="flex items-center gap-6 relative z-10">
                  <Zap className="w-8 h-8 text-[#3b82f6]/50 group-hover/magra:text-[#3b82f6] transition-all duration-700" />
                  <p className="text-2xl font-bold text-white tracking-tight leading-none">{comp.masaMagraKg} <span className="text-xl opacity-10 ml-2">KG</span></p>
                </div>
              </div>
              
              <div className="p-6 bg-[#0a0f14] rounded-sm border border-white/5 text-center flex flex-col items-center justify-center space-y-4 shadow-xl relative overflow-hidden">
                <p className="text-[9px] font-bold text-white/5 uppercase tracking-[0.4em] leading-none mb-2 italic relative z-10">Masa Gorda</p>
                <p className="text-2xl font-bold text-white tracking-tight leading-none relative z-10">{comp.masaGordaKg} <span className="text-xl opacity-10 ml-2">KG</span></p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-sm text-white/20 flex items-start gap-6 border border-white/5 relative group/info hover:border-white/10 transition-all duration-700">
              <Info className="w-8 h-8 shrink-0 text-[#3b82f6]/40" />
              <p className="text-[10px] leading-relaxed font-bold uppercase tracking-widest italic">
                Cálculos validados. Interpretación profesional basada en valores antropométricos estandarizados.
              </p>
            </div>

            <button
               onClick={() => {
                 saveMutation.mutate({ 
                   pacienteId,
                   peso,
                   altura,
                   pliegues,
                   resultados: { porcentajeGrasa: grasaPct, imc, masaGordaKg: comp.masaGordaKg, masaMagraKg: comp.masaMagraKg }
                 });
               }}
               disabled={saveMutation.isPending}
               className={clsx(
                 "w-full py-6 rounded-sm font-bold uppercase text-[11px] tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group/save",
                 saveMutation.isPending ? "bg-white/5 text-white/20" : "bg-white text-[#0a0f14] hover:bg-white/90"
               )}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/save:translate-x-full transition-transform duration-1000" />
               {saveMutation.isPending ? (
                 <div className="w-4 h-4 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
               ) : (
                 <Save className="w-5 h-5" />
               )}
               {saveMutation.isPending ? 'Sincronizando...' : 'Guardar Biometría'}
            </button>
            <div id="biometria-success" className="text-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest opacity-0 transition-opacity duration-700">
               ✓ Mediciones guardadas correctamente
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

import { Save } from 'lucide-react';

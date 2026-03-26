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
  Info,
  CheckCircle2
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
  pacienteInitialData,
  anamnesisData
}: { 
  pacienteId: string, 
  onSync?: (data: any) => void,
  pacienteInitialData?: any,
  anamnesisData?: any
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
        muslo: 15,
      },
      perimetros: {
        cintura: 80,
        cadera: 95,
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
          muslo: latest.pliegues?.muslo || 15,
        },
        perimetros: {
          cintura: latest.perimetros?.cintura || 80,
          cadera: latest.perimetros?.cadera || 95,
        }
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
        pliegues: { triceps: 10, subescapular: 12, suprailiaco: 15, abdominal: 18, muslo: 15 },
        perimetros: { cintura: 80, cadera: 95 }
      });
      hasLoadedRef.current = true;
    }
  }, [serverData, anamnesisRaw, reset, pacienteId, pacienteInitialData]);

  // Reset flag when patient changes
  React.useEffect(() => {
    hasLoadedRef.current = false;
  }, [pacienteId]);

  // PROACTIVE SYNC: If patient root data changes (e.g. edited in modal), update measurements
  // Only if form is hydrated and values differ
  React.useEffect(() => {
    if (pacienteInitialData && hasLoadedRef.current) {
        const profilePeso = pacienteInitialData.peso;
        const profileAltura = pacienteInitialData.altura;
        
        if (profilePeso && profilePeso !== peso) {
            reset({ ...watch(), peso: profilePeso });
        }
        if (profileAltura && profileAltura !== altura) {
            reset({ ...watch(), altura: profileAltura });
        }
    }
  }, [pacienteInitialData?.peso, pacienteInitialData?.altura, reset, watch]);

  // REACTIVE SYNC FROM ANAMNESIS (PANEL CLINICO)
  // If user edits weight in Clinical tab, it should reflect here instantly
  React.useEffect(() => {
    if (anamnesisData) {
        const { peso: anamPeso, altura: anamAltura } = anamnesisData;
        
        if (anamPeso && anamPeso !== peso) {
            reset({ ...watch(), peso: anamPeso });
        }
        if (anamAltura && anamAltura !== altura) {
            reset({ ...watch(), altura: anamAltura });
        }
    }
  }, [anamnesisData?.peso, anamnesisData?.altura, reset, watch]);

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
        // If it's a new entry for today, add or update it in the history array
        const latestIdx = newData.findIndex((d: any) => new Date(d.createdAt).toDateString() === new Date().toDateString());
        if (latestIdx > -1) newData[latestIdx] = res.data;
        else newData.push(res.data);
        return { data: newData };
      });
      // Invalidate evolutionary history to reflect changes in Dashboard
      queryClient.invalidateQueries({ queryKey: ['historial-antropometria', pacienteId] });
      queryClient.invalidateQueries({ queryKey: ['paciente', pacienteId] });
      
      const el = document.getElementById('biometria-success');
      if (el) {
        el.style.opacity = '1';
        setTimeout(() => { if (el) el.style.opacity = '0'; }, 3000);
      }
    }
  });

  const lastSyncRef = React.useRef<string>('');

  React.useEffect(() => {
    const activeValues = { peso, altura, pliegues, perimetros };
    if (onSync) {
      const syncObj = {
        mediciones: activeValues,
        resultados: {
          imc,
          clasificacionIMC: clasificarIMC(imc),
          porcentajeGrasa: grasaPct,
          masaMagraKg: comp.masaMagraKg,
          masaGordaKg: comp.masaGordaKg
        }
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
          perimetros,
          resultados: { porcentajeGrasa: grasaPct, imc, masaGordaKg: comp.masaGordaKg, masaMagraKg: comp.masaMagraKg }
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [peso, altura, pliegues, perimetros, imc, grasaPct, comp, isValid, pacienteId, onSync]);

  const inputStyles = "w-full p-5 bg-[#0a0f14]/60 border border-white/5 focus:border-[#3b82f6]/30 rounded-sm outline-none transition-all duration-75 font-bold uppercase text-[10px] tracking-[0.2em] text-white placeholder:text-white/5 shadow-xl";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-white">
      
      {/* LEFT SECTION: MEASUREMENTS PROTOCOL */}
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
             <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-3">MEDICIONES Y COMPOSICIÓN CORPORAL</p>
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
              <div className="bg-[#0a0f14] px-6 py-2.5 rounded-sm border border-white/5 flex items-center gap-6 shadow-xl transition-all duration-75">
                <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] leading-none">STATUS:</span>
                <span className="text-xl font-bold text-white tracking-tight leading-none uppercase">{clasificarIMC(imc)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="peso" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Peso (KG)</label>
              <input 
                id="peso"
                type="number" 
                {...register('peso', { valueAsNumber: true })} 
                className={inputStyles} 
                aria-label="Ingresar peso en kilogramos"
              />
            </div>
            <div className="space-y-4">
              <label htmlFor="altura" className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4">Estatura (CM)</label>
              <input 
                id="altura"
                type="number" 
                {...register('altura', { valueAsNumber: true })} 
                className={inputStyles} 
                aria-label="Ingresar estatura en centímetros"
              />
            </div>
            <div className="space-y-4 bg-[#0a0f14] p-6 rounded-sm border border-white/5 text-center flex flex-col justify-center shadow-xl group/bmi transition-all duration-75 relative overflow-hidden" aria-live="polite">
              <span className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mb-4 leading-none group-hover/bmi:text-white transition-all duration-75 relative z-10" id="label-imc">IMC</span>
              <span className="text-4xl font-bold text-white tracking-tight relative z-10" aria-labelledby="label-imc">{imc} <span className="text-[9px] text-white/10 block mt-4 font-bold tracking-[0.2em] uppercase">VALOR CALCULADO</span></span>
            </div>

            {/* Skinfolds Tactical Protocol */}
            <div className="col-span-full pt-8 pb-6 border-b border-white/5 flex items-center gap-6">
              <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center">
                <Dna className="w-5 h-5 text-[#3b82f6]/50" />
              </div>
              <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/10">PLIEGUES CUTÁNEOS (MM)</h3>
            </div>

            {[
              { label: 'Tríceps', key: 'pliegues.triceps', id: 'triceps' },
              { label: 'Subescapular', key: 'pliegues.subescapular', id: 'subescapular' },
              { label: 'Suprailíaco', key: 'pliegues.suprailiaco', id: 'suprailiaco' },
              { label: 'Abdominal', key: 'pliegues.abdominal', id: 'abdominal' },
              { label: 'Muslo', key: 'pliegues.muslo', id: 'muslo' }
            ].map(f => (
              <div key={f.key} className="space-y-2 group/fold">
                <label htmlFor={f.id} className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4 group-hover/fold:text-white transition-all duration-75">{f.label}</label>
                <input 
                  id={f.id}
                  type="number" 
                  {...register(f.key as any, { valueAsNumber: true })} 
                  className="w-full p-5 bg-[#0a0f14] border border-white/5 rounded-sm outline-none text-xl font-bold text-white focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-75 shadow-xl tracking-tight" 
                  aria-label={`Ingresar pliegue ${f.label} en milímetros`}
                />
              </div>
            ))}

            {/* Perimeters Tactical Protocol */}
            <div className="col-span-full pt-8 pb-6 border-b border-white/5 flex items-center gap-6">
              <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center">
                <Ruler className="w-5 h-5 text-[#3b82f6]/50" />
              </div>
              <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-white/10">PERÍMETROS (CM)</h3>
            </div>

            {[
              { label: 'Cintura', key: 'perimetros.cintura', id: 'cintura' },
              { label: 'Cadera', key: 'perimetros.cadera', id: 'cadera' }
            ].map(f => (
              <div key={f.key} className="space-y-2 group/fold">
                <label htmlFor={f.id} className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] pl-4 group-hover/fold:text-white transition-all duration-75">{f.label}</label>
                <input 
                  id={f.id}
                  type="number" 
                  {...register(f.key as any, { valueAsNumber: true })} 
                  className="w-full p-5 bg-[#0a0f14] border border-white/5 rounded-sm outline-none text-xl font-bold text-white focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-75 shadow-xl tracking-tight" 
                  aria-label={`Ingresar perímetro ${f.label} en centímetros`}
                />
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
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/10 block mb-3 leading-none group-hover/grasa:text-white transition-all duration-75">GRASA (FAULKNER)</span>
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
              <div 
                className="overflow-hidden h-3 mb-12 bg-[#070C14] rounded-full shadow-inner relative transition-all duration-75 border border-white/5"
                role="progressbar"
                aria-valuenow={grasaPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Porcentaje de grasa corporal calculado"
              >
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
                  <Zap className="w-8 h-8 text-[#3b82f6]/50 group-hover/magra:text-[#3b82f6] transition-all duration-75" />
                  <p className="text-2xl font-bold text-white tracking-tight leading-none">{comp.masaMagraKg} <span className="text-xl opacity-10 ml-2">KG</span></p>
                </div>
              </div>
              
              <div className="p-6 bg-[#0a0f14] rounded-sm border border-white/5 text-center flex flex-col items-center justify-center space-y-4 shadow-xl relative overflow-hidden">
                <p className="text-[9px] font-bold text-white/5 uppercase tracking-[0.4em] leading-none mb-2 italic relative z-10">Masa Gorda</p>
                <p className="text-2xl font-bold text-white tracking-tight leading-none relative z-10">{comp.masaGordaKg} <span className="text-xl opacity-10 ml-2">KG</span></p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-sm text-white/20 flex items-start gap-6 border border-white/5 relative group/info hover:border-white/10 transition-all duration-75">
              <Info className="w-8 h-8 shrink-0 text-[#3b82f6]/40" />
              <p className="text-[10px] leading-relaxed font-bold uppercase tracking-widest italic">
                Cálculos validados. Interpretación profesional basada en valores antropométricos estandarizados.
              </p>
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


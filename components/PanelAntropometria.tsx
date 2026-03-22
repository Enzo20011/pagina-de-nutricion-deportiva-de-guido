'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Ruler, 
  Dna, 
  Scale, 
  TrendingDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  calcularIMC, 
  calcularGrasaFaulkner, 
  calcularComposicionCorporal,
  clasificarIMC 
} from '@/utils/calculosAntropometricos';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function PanelAntropometria({ pacienteId, onSync }: { pacienteId: string, onSync?: (data: any) => void }) {
  const queryClient = useQueryClient();
  const { register, watch, reset, formState: { isValid } } = useForm({
    defaultValues: {
      peso: 70,
      altura: 170,
      triceps: 10,
      subescapular: 12,
      suprailiaco: 15,
      abdominal: 18,
    }
  });

  // 1. Fetch History
  const { data: serverData } = useQuery({
    queryKey: ['antropometria', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/antropometria?pacienteId=${pacienteId}`);
      if (!res.ok) throw new Error('Error al cargar antropometría');
      return res.json();
    },
    enabled: !!pacienteId
  });

  // Sync latest record to form
  React.useEffect(() => {
    if (serverData?.data && serverData.data.length > 0) {
      const latest = serverData.data[serverData.data.length - 1];
      reset({ 
        peso: latest.peso || 70, 
        altura: latest.altura || 170, 
        triceps: latest.pliegues?.triceps || 10,
        subescapular: latest.pliegues?.subescapular || 12,
        suprailiaco: latest.pliegues?.suprailiaco || 15,
        abdominal: latest.pliegues?.abdominal || 18,
      });
    }
  }, [serverData, reset]);

  const values = watch();
  
  const imc = calcularIMC(values.peso, values.altura);
  const grasaPct = calcularGrasaFaulkner(
    values.triceps, 
    values.subescapular, 
    values.suprailiaco, 
    values.abdominal
  );
  const comp = calcularComposicionCorporal(values.peso, grasaPct);
  
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/antropometria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al guardar');
      return res.json();
    },
    onSuccess: (res) => {
      // Optimizacion: invalidate queries to show history update if needed
      // queryClient.invalidateQueries({ queryKey: ['antropometria', pacienteId] });
    }
  });

  React.useEffect(() => {
    if (onSync) {
      onSync({
        mediciones: values,
        imc,
        clasificacionIMC: clasificarIMC(imc),
        grasaPct,
        masaMagraKg: comp.masaMagraKg,
        masaGordaKg: comp.masaGordaKg
      });
    }
    const timer = setTimeout(() => {
      if (isValid && pacienteId) {
        saveMutation.mutate({ 
          pacienteId, 
          peso: values.peso, 
          altura: values.altura, 
          pliegues: { triceps: values.triceps, subescapular: values.subescapular, suprailiaco: values.suprailiaco, abdominal: values.abdominal },
          resultados: { porcentajeGrasa: grasaPct, imc, masaGordaKg: comp.masaGordaKg, masaMagraKg: comp.masaMagraKg }
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [values, imc, grasaPct, comp, isValid, pacienteId, onSync]);

  const inputStyles = "w-full p-6 bg-navy border border-white/5 rounded-2xl outline-none text-2xl font-black text-white shadow-inner focus:border-accentBlue/40 transition-all placeholder:text-white/5";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-bone">
      
      {/* LEFT SECTION: MEASUREMENTS */}
      <div className="xl:col-span-8 space-y-10">
        <header className="flex items-center gap-5 bg-navy text-white p-8 rounded-[2.5rem] border border-white/5 shadow-xl group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentBlue/10 rounded-full blur-2xl" />
          <Ruler className="w-10 h-10 text-accentBlue group-hover:rotate-12 transition-transform relative z-10" />
          <div className="relative z-10">
             <h2 className="text-2xl font-black uppercase tracking-tighter leading-none italic">Mediciones Clínicas</h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Antropometría de Alta Performance</p>
          </div>
        </header>

        <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 shadow-inner relative overflow-hidden group">
           <div className="absolute bottom-0 right-0 w-80 h-80 bg-accentBlue/5 rounded-full translate-x-1/2 translate-y-1/2 blur-[100px]" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            
            {/* Fundamental Measures */}
            <div className="col-span-full pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Scale className="w-6 h-6 text-accentBlue" />
                <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-500">Métricas Fundamentales</h3>
              </div>
              <div className="bg-navy/80 px-8 py-3 rounded-2xl border border-white/5 flex items-center gap-6 shadow-xl">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Status IMC:</span>
                <span className="text-2xl font-black text-accentBlue italic tracking-tighter leading-none">{clasificarIMC(imc)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Peso (KG)</label>
              <input type="number" {...register('peso', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Estatura (CM)</label>
              <input type="number" {...register('altura', { valueAsNumber: true })} className={inputStyles} />
            </div>
            <div className="space-y-3 bg-navy/50 p-6 rounded-[2rem] border border-white/5 text-center flex flex-col justify-center shadow-inner group/bmi">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none group-hover:text-accentBlue transition-colors">Índice Nutricional</span>
              <span className="text-5xl font-black text-white tracking-tighter italic">{imc} <span className="text-xs text-accentBlue/40 block mt-1 not-italic font-bold">BMI OPTIMIZED</span></span>
            </div>

            {/* Skinfolds Protocol */}
            <div className="col-span-full pt-10 pb-8 border-b border-white/5 flex items-center gap-4 text-slate-500">
              <Dna className="w-6 h-6 text-emerald-400" />
              <h3 className="font-black uppercase tracking-[0.4em] text-[10px]">Protocolo de Pliegues (mm)</h3>
            </div>

            {[
              { label: 'Tríceps', key: 'triceps' },
              { label: 'Subescapular', key: 'subescapular' },
              { label: 'Suprailíaco', key: 'suprailiaco' },
              { label: 'Abdominal', key: 'abdominal' }
            ].map(f => (
              <div key={f.key} className="space-y-3 group/fold">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-4 group-hover/fold:text-white transition-colors">{f.label}</label>
                <input type="number" {...register(f.key as any, { valueAsNumber: true })} className="w-full p-6 bg-navy/80 border border-white/5 rounded-2xl outline-none text-xl font-black text-white focus:border-accentBlue/30 transition-all shadow-inner" />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* RIGHT SECTION: RESULTS */}
      <div className="xl:col-span-4 space-y-10">
        <div className="bg-navy/40 p-10 rounded-[4rem] border border-white/5 shadow-2xl h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accentBlue/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <h3 className="text-xl font-black text-white mb-16 flex items-center gap-4 relative z-10 italic uppercase tracking-tighter">
            <TrendingDown className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
            Composición Corporal
          </h3>

          <div className="space-y-14 relative z-10">
            <div className="relative group/grasa">
              <div className="flex mb-8 items-end justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-2 leading-none group-hover/grasa:text-accentBlue transition-colors">Densidad Adiposa</span>
                  <span className="text-2xl font-black uppercase text-white leading-none italic">
                    Grasa <span className="text-white/20 not-italic">(Faulkner)</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-6xl font-black text-white tracking-tighter italic drop-shadow-2xl">
                    {grasaPct}<span className="text-xl opacity-20 ml-2">%</span>
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-10 bg-navy rounded-full shadow-inner relative group-hover/grasa:h-3 transition-all duration-300">
                <motion.div 
                  layout
                  initial={{ width: 0 }}
                  animate={{ width: `${grasaPct}%` }}
                  className="h-full bg-accentBlue shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-full" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="p-10 bg-navy/80 rounded-[3rem] border border-white/5 text-center flex flex-col items-center justify-center space-y-4 hover:border-emerald-500/30 transition-all group/magra shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] leading-none mb-2">Masa Magra (Músculo)</p>
                <div className="flex items-center gap-5">
                  <Zap className="w-10 h-10 text-emerald-400 opacity-20 group-hover/magra:opacity-100 group-hover/magra:scale-110 transition-all" />
                  <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{comp.masaMagraKg} <span className="text-lg opacity-20 ml-2 not-italic font-bold">KG</span></p>
                </div>
              </div>
              
              <div className="p-10 bg-navy/80 rounded-[3rem] border border-white/5 text-center flex flex-col items-center justify-center space-y-4 hover:border-rose-500/30 transition-all group/gorda shadow-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] leading-none mb-2">Masa Gorda (Adiposa)</p>
                <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{comp.masaGordaKg} <span className="text-lg opacity-20 ml-2 not-italic font-bold">KG</span></p>
              </div>
            </div>

            <div className="bg-accentBlue p-8 rounded-[2.5rem] text-white flex items-start gap-5 group shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 shrink-0 text-white/50 group-hover:scale-110 transition-transform relative z-10" />
              <p className="text-[11px] leading-relaxed font-black uppercase tracking-tight relative z-10">
                Protocolo clínico validado. Interpretación Elite basada en valores metabólicos de reposo y actividad.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

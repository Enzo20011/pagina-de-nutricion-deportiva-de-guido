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
  Equal
} from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { anamnesisSchema, type AnamnesisInput } from '@/schemas/anamnesisSchema';
import { 
  calcularGastoEnergetico, 
  calcularMacros, 
  type Sexo, 
  type FactorActividad 
} from '@/utils/calculosNutricionales';

export default function PanelClinico({ pacienteId, onSync }: { pacienteId: string, onSync?: (data: any) => void }) {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // 1. Fetch data from server
  const { data: serverData, isLoading } = useQuery({
    queryKey: ['anamnesis', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/anamnesis?pacienteId=${pacienteId}`);
      if (!res.ok) throw new Error('Error al cargar anamnesis');
      return res.json();
    },
    enabled: !!pacienteId
  });

  const [calcData, setCalcData] = useState({
    peso: 70,
    altura: 170,
    edad: 30,
    sexo: 'masculino' as Sexo,
    actividad: 'sedentario' as FactorActividad
  });
  const [macrosPct, setMacrosPct] = useState({ carbos: 50, proteinas: 20, grasas: 30 });
  
  const resultados = calcularGastoEnergetico(
    calcData.peso,
    calcData.altura,
    calcData.edad,
    calcData.sexo,
    calcData.actividad
  );
  
  const deficit = Math.round(resultados.get - 500);
  const mantenimiento = Math.round(resultados.get);
  const superavit = Math.round(resultados.get + 500);

  const macros = calcularMacros(
    resultados.get,
    macrosPct.carbos,
    macrosPct.proteinas,
    macrosPct.grasas
  );

  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<AnamnesisInput>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues: {
      pacienteId: pacienteId,
      nivelActividad: 'Sedentario' as any,
      ritmoIntestinal: 'Normal' as any,
      horasSueno: 8,
      nivelEstres: 5,
    }
  });

  // Sync server data to form when available
  React.useEffect(() => {
    if (serverData?.data) {
      reset({
        ...serverData.data,
        pacienteId: pacienteId // ensure ID is correct
      });
    }
  }, [serverData, reset, pacienteId]);

  const watchedFields = watch();

  // 2. Mutation for saving
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/anamnesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al guardar');
      return res.json();
    },
    onSuccess: (res) => {
      if (!res.data.isDraft) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
      const now = new Date();
      setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      queryClient.setQueryData(['anamnesis', pacienteId], res);
    },
    onError: (err: any) => {
       setError(err.message);
       setTimeout(() => setError(null), 5000);
    }
  });

  // Sync state to parent for PDF/Preview
  React.useEffect(() => {
    if (onSync) {
      onSync({
        anamnesis: watchedFields,
        resultados,
        macros,
        objetivos: { deficit, mantenimiento, superavit }
      });
    }
  }, [watchedFields, resultados, macros, onSync, deficit, mantenimiento, superavit]);

  // Autoguardado silencioso
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isValid && watchedFields.pacienteId) {
        saveMutation.mutate({ ...watchedFields, isDraft: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [watchedFields, isValid]);

  const onSubmit = async (data: AnamnesisInput) => {
    saveMutation.mutate({ ...data, isDraft: false });
  };

  const inputStyles = "w-full p-8 bg-navy/20 backdrop-blur-md border border-white/5 focus:border-accentBlue/30 rounded-[2rem] outline-none transition-all font-bold text-bone placeholder:text-white/10 shadow-inner";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-bone">
      
      {/* LEFT SECTION: ANAMNESIS FORM */}
      <div className="xl:col-span-7 space-y-8">
        <header className="flex items-center gap-6 bg-cardDark/60 backdrop-blur-xl p-10 rounded-[3.5rem] shadow-3xl border border-white/10 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accentBlue/5 rounded-full blur-[80px]" />
          <div className="w-16 h-16 bg-darkNavy rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform relative z-10 shadow-xl">
             <ClipboardList className="w-8 h-8 text-accentBlue" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none italic text-white">Anamnesis</h2>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Protocolo Clínico • Registro de Hábitos</p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-cardDark/40 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-12 group/form backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Motivo de Consulta</label>
              <textarea 
                {...register('motivoConsulta')}
                className={clsx(inputStyles, "h-32 resize-none")}
                placeholder="Descripción del cuadro clínico..."
              />
              {errors.motivoConsulta && <p className="text-rose-500 text-[10px] font-black uppercase mt-1 pl-4">{errors.motivoConsulta.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Entorno / Laboral</label>
              <textarea 
                {...register('horariosTrabajo')}
                className={clsx(inputStyles, "h-32 resize-none")}
                placeholder="Turnos, horarios, nivel de actividad laboral..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Patologías</label>
              <input {...register('patologias')} className={inputStyles} placeholder="Ninguna" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Alergias</label>
              <input {...register('alergiasIntolerancias')} className={inputStyles} placeholder="Sin alergias reportadas" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Medicanción</label>
              <input {...register('medicacionActual')} className={inputStyles} placeholder="Uso de fármacos o suplementos" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Nivel de Actividad</label>
              <select {...register('nivelActividad')} className={clsx(inputStyles, "font-black uppercase tracking-[0.2em] text-xs font-bold text-accentBlue")}>
                <option value="Sedentario" className="bg-darkNavy text-white">Sedentario</option>
                <option value="Ligero" className="bg-darkNavy text-white">Ligero</option>
                <option value="Moderado" className="bg-darkNavy text-white">Moderado</option>
                <option value="Intenso" className="bg-darkNavy text-white">Intenso</option>
                <option value="Atleta" className="bg-darkNavy text-white">Atleta</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Ritmo Intestinal</label>
              <select {...register('ritmoIntestinal')} className={clsx(inputStyles, "font-black uppercase tracking-[0.2em] text-xs font-bold text-white")}>
                <option value="Normal" className="bg-darkNavy text-white">Normal</option>
                <option value="Estreñimiento" className="bg-darkNavy text-white">Estreñimiento</option>
                <option value="Diarrea" className="bg-darkNavy text-white">Diarrea</option>
                <option value="Irregular" className="bg-darkNavy text-white">Irregular</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Aversiones</label>
              <input {...register('aversionesAlimentarias')} className={inputStyles} placeholder="Alimentos que rechaza" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Horas de Sueño</label>
              <input type="number" {...register('horasSueno', { valueAsNumber: true })} className={inputStyles} placeholder="Ej. 8" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Nivel de Estrés (1-10)</label>
              <input type="number" {...register('nivelEstres', { valueAsNumber: true })} className={inputStyles} placeholder="Ej. 5" min={1} max={10} />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-white/5">
            <div className="flex-1 w-full">
              <AnimatePresence>
                {lastSaved && !success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[9px] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
                    Borrador: {lastSaved}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 text-emerald-400 font-black uppercase text-xs tracking-widest bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="w-4 h-4" /> Registro de Anamnesis Guardado
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 text-rose-400 font-black uppercase text-xs tracking-widest bg-rose-500/10 px-6 py-2.5 rounded-full border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={saveMutation.isPending}
              className="w-full sm:w-auto bg-white text-navy px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
            >
              <Save className="w-5 h-5 text-accentBlue group-hover:rotate-12 transition-transform" />
              {saveMutation.isPending ? 'Sincronizando...' : 'Finalizar Bloque'}
            </motion.button>
          </div>
        </form>
      </div>

      {/* RIGHT SECTION: CALCULATOR & MACROS */}
      <div className="xl:col-span-5 space-y-8">
        <header className="flex items-center gap-6 bg-cardDark/60 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-3xl group overflow-hidden relative">
          <div className="w-16 h-16 bg-darkNavy rounded-2xl flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform shadow-xl">
             <Calculator className="w-8 h-8 text-accentBlue" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none italic text-white">Motor Clínico</h2>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Cálculo de Bioquímica Energética</p>
          </div>
        </header>

        <section className="bg-cardDark/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
            {[
               { label: 'Peso (KG)', val: calcData.peso, key: 'peso', icon: Activity },
               { label: 'Altura (CM)', val: calcData.altura, key: 'altura', icon: Sparkles },
               { label: 'Edad', val: calcData.edad, key: 'edad', icon: Clock },
            ].map(item => (
              <div key={item.key} className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-2">{item.label}</label>
                <div className="relative group/input">
                  <input 
                    type="number" 
                    value={item.val} 
                    onChange={e => setCalcData({...calcData, [item.key]: +e.target.value})} 
                    className="w-full p-6 bg-darkNavy/50 border border-white/5 rounded-2xl text-3xl font-black text-white focus:border-accentBlue/50 outline-none transition-all shadow-inner group-hover/input:border-white/10" 
                  />
                  <item.icon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/5 group-focus-within/input:text-accentBlue/20 transition-colors" />
                </div>
              </div>
            ))}
             <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pl-2">Actividad</label>
                <select 
                  value={calcData.actividad} 
                  onChange={e => setCalcData({...calcData, actividad: e.target.value as any})} 
                  className="w-full p-[1.85rem] bg-darkNavy/50 border border-white/5 rounded-2xl font-black text-xs uppercase text-bone focus:border-accentBlue/50 outline-none shadow-inner"
                >
                  {['sedentario', 'ligero', 'moderado', 'intenso', 'atleta'].map(o => <option key={o} value={o} className="bg-darkNavy text-white">{o}</option>)}
                </select>
              </div>
          </div>

          <div className="mb-8 relative group">
             <div className="absolute inset-0 bg-accentBlue rounded-[2.5rem] blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity" />
             <div className="relative flex items-center justify-between p-10 bg-accentBlue text-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 transition-all group-hover:translate-y-[-4px]">
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.5em] text-white/50 mb-3 leading-none italic">Total Diario (GET)</p>
                  <p className="text-6xl font-black tracking-tighter leading-none italic drop-shadow-lg"><AnimatedNumber value={resultados.get} /> <span className="text-xl opacity-40 italic not-italic font-medium pr-2">KCAL</span></p>
                </div>
                <Activity className="w-20 h-20 opacity-10 absolute right-[-10px] bottom-[-20px] group-hover:scale-125 transition-transform duration-1000" />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mb-12">
             <div className="bg-darkNavy border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3">
                <ArrowDown className="w-6 h-6 text-[#E06C75]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Déficit</span>
                <span className="text-xl font-black text-white"><AnimatedNumber value={deficit} /></span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">cal/día</span>
             </div>
             <div className="bg-darkNavy border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3">
                <Equal className="w-6 h-6 text-[#4285F4]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Mantener</span>
                <span className="text-xl font-black text-white"><AnimatedNumber value={mantenimiento} /></span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">cal/día</span>
             </div>
             <div className="bg-darkNavy border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3">
                <ArrowUp className="w-6 h-6 text-[#54B47B]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Superávit</span>
                <span className="text-xl font-black text-white"><AnimatedNumber value={superavit} /></span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">cal/día</span>
             </div>
          </div>

          <div className="space-y-10 relative z-10">
            <h3 className="font-black uppercase text-xs tracking-[0.4em] text-slate-500 flex items-center gap-3">
               <Sparkles className="w-4 h-4 text-accentBlue" /> Desglose Macroquímico
            </h3>
            
            <div className="space-y-8">
              {[
                { label: 'Carbohidratos', key: 'carbos', g: macros.carbohidratos, color: 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' },
                { label: 'Proteínas', key: 'proteinas', g: macros.proteinas, color: 'bg-accentBlue shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
                { label: 'Grasas', key: 'grasas', g: macros.grasas, color: 'bg-slate-400' }
              ].map((macro) => (
                <div key={macro.key} className="space-y-3 group cursor-default">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-500 group-hover:text-white transition-colors">{macro.label} ({macrosPct[macro.key as keyof typeof macrosPct]}%)</span>
                    <span className="text-white text-base tracking-tighter italic">{macro.g}g</span>
                  </div>
                  <div className="w-full h-1.5 bg-darkNavy rounded-full overflow-hidden relative">
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

            <div className="mt-10 p-8 bg-darkNavy/80 rounded-[2.5rem] border border-white/10 flex items-start gap-5 group">
               <Info className="w-5 h-5 text-accentBlue mt-1 shrink-0 group-hover:scale-110 transition-transform" />
               <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                 Metodología Harris-Benedict optimizada para entornos deportivos y nutrición clínica de alta precisión.
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

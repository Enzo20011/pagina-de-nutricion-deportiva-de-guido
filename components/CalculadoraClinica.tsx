'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  TrendingDown, 
  TrendingUp, 
  Sparkles,
  Search,
  Zap,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { calcularGastoEnergetico, calcularMacros, Sexo, FactorActividad } from '../utils/calculosNutricionales';
import { mockAlimentos } from '../utils/mockAlimentos';

const actividadOptions: { label: string; value: FactorActividad; icon: any; desc: string }[] = [
  { label: 'Sedentario', value: 'sedentario', icon: Clock, desc: 'Poco o ningún ejercicio' },
  { label: 'Ligero', value: 'ligero', icon: Activity, desc: '1-3 días p/sem' },
  { label: 'Moderado', value: 'moderado', icon: TrendingUp, desc: '3-5 días p/sem' },
  { label: 'Intenso', value: 'intenso', icon: Zap, desc: '6-7 días p/sem' },
  { label: 'Atleta', value: 'atleta', icon: Sparkles, desc: 'Rendimiento Elite' },
];

export default function CalculadoraClinica() {
  const [sexo, setSexo] = useState<Sexo>('masculino');
  const [peso, setPeso] = useState(70);
  const [altura, setAltura] = useState(170);
  const [edad, setEdad] = useState(30);
  const [actividad, setActividad] = useState<FactorActividad>('ligero');

  const [pctCarbos, setPctCarbos] = useState(50);
  const [pctProteinas, setPctProteinas] = useState(25);
  const [pctGrasas, setPctGrasas] = useState(25);

  const { tmb, get } = calcularGastoEnergetico(peso, altura, edad, sexo, actividad);
  const deficit = Math.round(get * 0.8);
  const surplus = Math.round(get * 1.15);
  const macros = calcularMacros(get, pctCarbos, pctProteinas, pctGrasas);

  const handleMacroChange = (macro: 'carbos' | 'proteinas' | 'grasas', value: number) => {
    let total = pctCarbos + pctProteinas + pctGrasas;
    if (macro === 'carbos') { setPctCarbos(value); total = value + pctProteinas + pctGrasas; }
    else if (macro === 'proteinas') { setPctProteinas(value); total = pctCarbos + value + pctGrasas; }
    else { setPctGrasas(value); total = pctCarbos + pctProteinas + value; }
    
    if (total > 100) {
      const exceso = total - 100;
      if (macro !== 'carbos' && pctCarbos > 0) setPctCarbos(Math.max(0, pctCarbos - exceso));
      else if (macro !== 'proteinas' && pctProteinas > 0) setPctProteinas(Math.max(0, pctProteinas - exceso));
      else if (macro !== 'grasas' && pctGrasas > 0) setPctGrasas(Math.max(0, pctGrasas - exceso));
    }
  };

  const sliderStyles = "w-full h-1.5 bg-navy rounded-full appearance-none cursor-pointer accent-accentBlue";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 text-bone selection:bg-accentBlue/20">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* INPUT COLUMN */}
        <div className="xl:col-span-12">
            <header className="flex items-center gap-5 bg-navy text-white p-8 rounded-[2.5rem] border border-white/5 shadow-xl group overflow-hidden relative mb-10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accentBlue/10 rounded-full blur-2xl" />
               <Activity className="w-10 h-10 text-accentBlue group-hover:scale-110 transition-transform relative z-10" />
               <div className="relative z-10">
                 <h2 className="text-2xl font-black uppercase tracking-tighter leading-none italic">Motor de Ingeniería Metabólica</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Algoritmo Harris-Benedict Elite</p>
               </div>
            </header>
        </div>

        <div className="xl:col-span-7 space-y-8">
           <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-inner backdrop-blur-md space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Sexo Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Variable Biológica</label>
                  <div className="flex bg-navy p-2 rounded-2xl border border-white/5 shadow-inner">
                    <button 
                      onClick={() => setSexo('masculino')}
                      className={clsx("flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", sexo === 'masculino' ? 'bg-white text-navy' : 'text-slate-500 hover:text-white')}
                    >Hombre</button>
                    <button 
                      onClick={() => setSexo('femenino')}
                      className={clsx("flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", sexo === 'femenino' ? 'bg-white text-navy' : 'text-slate-500 hover:text-white')}
                    >Mujer</button>
                  </div>
                </div>

                {/* Actividad Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-4">Factor Térmico (Actividad)</label>
                  <select 
                    value={actividad} 
                    onChange={e => setActividad(e.target.value as any)}
                    className="w-full p-5 bg-navy border border-white/5 rounded-2xl font-black text-xs uppercase text-bone focus:border-accentBlue shadow-inner outline-none"
                    title="Seleccionar nivel de actividad"
                  >
                    {actividadOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                {/* Sliders */}
                {[
                  { label: 'Peso Corporal', val: peso, min: 30, max: 180, unit: 'KG', set: setPeso },
                  { label: 'Estatura', val: altura, min: 120, max: 220, unit: 'CM', set: setAltura },
                  { label: 'Edad Cronológica', val: edad, min: 10, max: 90, unit: 'AÑOS', set: setEdad },
                ].map((s, i) => (
                  <div key={i} className="space-y-4 p-8 bg-navy/40 rounded-3xl border border-white/5 shadow-inner group">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                      <span>{s.label}</span>
                      <span className="text-accentBlue italic text-lg">{s.val} <span className="text-[8px] opacity-40 not-italic">{s.unit}</span></span>
                    </div>
                    <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className={sliderStyles} title={s.label} />
                  </div>
                ))}

                <div className="p-8 bg-accentBlue rounded-3xl text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Sparkles className="w-8 h-8 opacity-40 mb-3 group-hover:scale-110 transition-transform" />
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Status de Cálculo</p>
                   <p className="text-xl font-black uppercase italic tracking-tighter">Sincronizado</p>
                </div>
              </div>
           </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="xl:col-span-5 space-y-8">
           <div className="bg-navy/40 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accentBlue/10 rounded-full blur-[100px]" />
              
              <div className="space-y-12 relative z-10">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 leading-none">Mantenimiento (GET)</p>
                    <div className="flex items-baseline gap-4">
                       <h4 className="text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl">{get}</h4>
                       <span className="text-xl font-black text-accentBlue opacity-40 italic">KCAL</span>
                    </div>
                 </div>

                 {/* Objective Cards */}
                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { l: 'Deficit Proyectado', v: deficit, c: 'text-rose-400', b: 'bg-rose-500/10' },
                      { l: 'Surplus Proyectado', v: surplus, c: 'text-emerald-400', b: 'bg-emerald-500/10' },
                    ].map((card, i) => (
                      <div key={i} className={clsx("p-8 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all", card.b)}>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{card.l}</p>
                          <p className={clsx("text-3xl font-black italic tracking-tighter", card.c)}>{card.v} <span className="text-xs opacity-20">KC</span></p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-white/5 group-hover:text-white/20 transition-colors" />
                      </div>
                    ))}
                 </div>

                 {/* Macros Simulation */}
                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-slate-500">
                       <Zap className="w-4 h-4 text-accentBlue" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">Optimización de Macros</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { l: 'Carbos', v: macros.carbohidratos, c: 'text-white' },
                         { l: 'Protes', v: macros.proteinas, c: 'text-white' },
                         { l: 'Grasas', v: macros.grasas, c: 'text-white' },
                       ].map((m, i) => (
                         <div key={i} className="text-center p-6 bg-navy/80 rounded-2xl border border-white/5 shadow-inner">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.l}</p>
                            <p className="text-xl font-black italic tracking-tighter text-white">{m.v}<span className="text-[10px] opacity-20 ml-1">G</span></p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-12 p-8 bg-white/5 rounded-[2rem] border border-white/5 relative z-10 flex items-start gap-4">
                 <Info className="w-5 h-5 text-accentBlue mt-1 shrink-0" />
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                    Resultados sincronizados con la base de datos de ingeniería nutricional. Estos valores forman el benchmark para el Plan de Alimentación Elite.
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

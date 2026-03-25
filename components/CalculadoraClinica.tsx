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
  { label: 'Atleta', value: 'atleta', icon: Sparkles, desc: 'Nivel Avanzado' },
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

  retur    <div className="max-w-[1200px] mx-auto space-y-12 text-[#eaeef6] selection:bg-[#3b82f6]/20 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* INPUT COLUMN */}
        <div className="xl:col-span-12">
            <header className="flex items-center gap-6 bg-[#0a0f14] text-white p-8 rounded-sm border border-white/5 shadow-xl group overflow-hidden relative mb-10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-2xl" />
               <Activity className="w-10 h-10 text-[#3b82f6] group-hover:scale-110 transition-transform relative z-10" />
               <div className="relative z-10">
                 <h2 className="text-2xl font-heading font-black uppercase tracking-tight leading-none">Cálculo Metabólico</h2>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a7abb2] mt-1">Algoritmo Harris-Benedict Avanzado</p>
               </div>
            </header>
        </div>

        <div className="xl:col-span-7 space-y-8">
           <div className="bg-[#0a0f14] p-10 rounded-sm border border-white/5 shadow-xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Sexo Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#a7abb2] uppercase tracking-[0.4em] pl-2">Sexo Biológico</label>
                  <div className="flex bg-black/20 p-2 rounded-sm border border-white/5">
                    <button 
                      onClick={() => setSexo('masculino')}
                      className={clsx("flex-1 py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all", sexo === 'masculino' ? 'bg-white text-[#0a0f14]' : 'text-[#a7abb2] hover:text-white')}
                    >Hombre</button>
                    <button 
                      onClick={() => setSexo('femenino')}
                      className={clsx("flex-1 py-4 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all", sexo === 'femenino' ? 'bg-white text-[#0a0f14]' : 'text-[#a7abb2] hover:text-white')}
                    >Mujer</button>
                  </div>
                </div>

                {/* Actividad Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#a7abb2] uppercase tracking-[0.4em] pl-2">Nivel de Actividad</label>
                  <select 
                    value={actividad} 
                    onChange={e => setActividad(e.target.value as any)}
                    className="w-full p-5 bg-black/20 border border-white/5 rounded-sm font-bold text-[11px] uppercase text-white focus:border-[#3b82f6]/30 shadow-inner outline-none appearance-none cursor-pointer"
                    title="Seleccionar nivel de actividad"
                  >
                    {actividadOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-[#0a0f14]">{opt.label}</option>)}
                  </select>
                </div>

                {/* Sliders */}
                {[
                  { label: 'Peso Corporal', val: peso, min: 30, max: 180, unit: 'KG', set: setPeso },
                  { label: 'Estatura', val: altura, min: 120, max: 220, unit: 'CM', set: setAltura },
                  { label: 'Edad', val: edad, min: 10, max: 90, unit: 'AÑOS', set: setEdad },
                ].map((s, i) => (
                  <div key={i} className="space-y-4 p-6 bg-black/20 rounded-sm border border-white/5 group transition-colors hover:border-white/10">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#a7abb2] group-hover:text-white transition-colors">
                      <span>{s.label}</span>
                      <span className="text-[#3b82f6] text-xl font-black tracking-tight">{s.val} <span className="text-[9px] opacity-40 uppercase tracking-widest ml-1 font-bold">{s.unit}</span></span>
                    </div>
                    <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#3b82f6]" title={s.label} />
                  </div>
                ))}

                <div className="p-8 bg-[#3b82f6] rounded-sm text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
                   <Zap className="w-8 h-8 opacity-40 mb-3 group-hover:scale-110 transition-transform" />
                   <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Status de Cálculo</p>
                   <p className="text-xl font-heading font-black uppercase tracking-tight">Sincronizado</p>
                </div>
              </div>
           </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="xl:col-span-5 space-y-8">
           <div className="bg-[#0a0f14] p-10 rounded-sm border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[100px]" />
              
              <div className="space-y-12 relative z-10">
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#a7abb2] leading-none">Mantenimiento (GET)</p>
                    <div className="flex items-baseline gap-4">
                       <h4 className="text-6xl font-heading font-black text-white tracking-tight drop-shadow-2xl">{get}</h4>
                       <span className="text-sm font-bold text-[#3b82f6] opacity-60 uppercase tracking-widest">Kcal</span>
                    </div>
                 </div>

                 {/* Objective Cards */}
                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { l: 'Déficit Proyectado', v: deficit, c: 'text-rose-400', b: 'bg-rose-500/5 border-rose-500/10' },
                      { l: 'Superávit Proyectado', v: surplus, c: 'text-emerald-400', b: 'bg-emerald-500/5 border-emerald-500/10' },
                    ].map((card, i) => (
                      <div key={i} className={clsx("p-8 rounded-sm border flex items-center justify-between group hover:brightness-110 transition-all", card.b)}>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[#a7abb2]">{card.l}</p>
                          <p className={clsx("text-3xl font-heading font-black tracking-tight", card.c)}>{card.v} <span className="text-xs opacity-40 uppercase tracking-widest ml-1 font-bold font-body">Kcal</span></p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-white/5 group-hover:text-white/20 transition-colors" />
                      </div>
                    ))}
                 </div>

                 {/* Macros Simulation */}
                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[#a7abb2]">
                       <Zap className="w-4 h-4 text-[#3b82f6]" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Optimización de Macronutrientes</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { l: 'Carbos', v: macros.carbohidratos },
                         { l: 'Proteínas', v: macros.proteinas },
                         { l: 'Grasas', v: macros.grasas },
                       ].map((m, i) => (
                         <div key={i} className="text-center p-6 bg-black/20 rounded-sm border border-white/5 transition-colors hover:border-white/10">
                            <p className="text-[8px] font-bold text-[#a7abb2] uppercase tracking-widest mb-1">{m.l}</p>
                            <p className="text-xl font-heading font-black tracking-tight text-white">{m.v}<span className="text-[10px] opacity-20 ml-1 font-bold">G</span></p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-12 p-8 bg-white/5 rounded-sm border border-white/5 relative z-10 flex items-start gap-4">
                 <Info className="w-5 h-5 text-[#3b82f6] mt-1 shrink-0" />
                 <p className="text-[10px] text-[#a7abb2] font-bold leading-relaxed uppercase tracking-wider">
                    Resultados sincronizados con la base de datos profesional. Estos valores forman el benchmark para el Plan de Alimentación Personalizado.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
>

    </div>
  );
}

// Minimal clsx helper
function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

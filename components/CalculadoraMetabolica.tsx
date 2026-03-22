'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Equal,
  Sofa,
  Footprints,
  Activity as ActivityIcon,
  Flame,
  Zap
} from 'lucide-react';
import { 
  calcularGastoEnergetico, 
  type Sexo, 
  type FactorActividad 
} from '@/utils/calculosNutricionales';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';
import { z } from 'zod';
import clsx from 'clsx';

const metabolicSchema = z.object({
  peso: z.number().min(20).max(350),
  altura: z.number().min(100).max(260),
  edad: z.number().min(13).max(110),
  sexo: z.enum(['masculino', 'femenino']),
  actividad: z.enum(['sedentario', 'ligero', 'moderado', 'intenso', 'atleta'])
});

const ACT_LEVELS: FactorActividad[] = ['sedentario', 'ligero', 'moderado', 'intenso', 'atleta'];
const ACT_LABELS = ['Sedentario', 'Ligero', 'Moderado', 'Intenso', 'Muy Intenso'];
const ACT_DESC = [
  'Poco o ningún ejercicio',
  'Ejercicio ligero 1-3 días a la semana',
  'Ejercicio moderado 3-5 días a la semana',
  'Ejercicio fuerte 6-7 días a la semana',
  'Ejercicio muy fuerte o trabajo físico'
];

export default function CalculadoraMetabolica() {
  const [data, setData] = useState({
    peso: 70,
    altura: 170,
    edad: 30,
    sexo: 'masculino' as Sexo,
    actividad: 'ligero' as FactorActividad
  });

  const resultados = useMemo(() => {
    const sanitizedPeso = Math.max(1, Math.min(600, data.peso));
    const sanitizedAltura = Math.max(1, Math.min(300, data.altura));
    const sanitizedEdad = Math.max(1, Math.min(120, data.edad));
    return calcularGastoEnergetico(sanitizedPeso, sanitizedAltura, sanitizedEdad, data.sexo, data.actividad);
  }, [data.peso, data.altura, data.edad, data.sexo, data.actividad]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Derived goals
  const deficit = useMemo(() => Math.round(resultados.get - 500), [resultados.get]);
  const mantenimiento = useMemo(() => Math.round(resultados.get), [resultados.get]);
  const superavit = useMemo(() => Math.round(resultados.get + 500), [resultados.get]);

  // Chart scaling
  const maxCal = useMemo(() => Math.max(3000, superavit + 200), [superavit]);
  // Custom colors purely for the chart as requested
  const COLOR_PERDER = "#E06C75"; // Rose/Coral
  const COLOR_MANTENER = "#4285F4"; // Google Blue matches the image
  const COLOR_GANAR = "#54B47B"; // Emerald Green matches the image

  const activityIndex = useMemo(() => ACT_LEVELS.indexOf(data.actividad), [data.actividad]);

  return (
    <div className="w-full max-w-6xl mx-auto text-white selection:bg-accentBlue/20">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- LEFT COLUMN: INTRODUCE TUS DATOS --- */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl space-y-8 flex flex-col">
           <h2 className="text-2xl md:text-3xl font-bold text-center text-accentBlue mb-2">Introduce tus datos</h2>
           
           {/* Género */}
           <div className="space-y-4">
              <label className="text-sm font-semibold text-white/80">Género</label>
              <div className="flex bg-darkNavy/60 rounded-xl border border-white/10 p-1 w-full">
                <button
                  onClick={() => handleFieldChange('sexo', 'masculino')}
                  className={clsx(
                    "flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all",
                    data.sexo === 'masculino' ? "bg-accentBlue text-white shadow-lg" : "text-white/50 hover:text-white"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">♂ Hombre</span>
                </button>
                <button
                  onClick={() => handleFieldChange('sexo', 'femenino')}
                  className={clsx(
                    "flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all",
                    data.sexo === 'femenino' ? "bg-accentBlue text-white shadow-lg" : "text-white/50 hover:text-white"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">♀ Mujer</span>
                </button>
              </div>
           </div>

           {/* Sliders: Peso, Altura, Edad */}
           {[
             { label: 'Peso', val: data.peso, unit: 'kg', min: 30, max: 200, key: 'peso' },
             { label: 'Altura', val: data.altura, unit: 'cm', min: 100, max: 220, key: 'altura' },
             { label: 'Edad', val: data.edad, unit: 'años', min: 15, max: 90, key: 'edad' },
           ].map((field) => (
             <div key={field.key} className="space-y-4">
                <div className="flex justify-between items-end">
                   <label className="text-sm font-semibold text-white/80">{field.label}</label>
                   <div className="flex items-center gap-1">
                     <span className="text-lg font-bold text-white">{field.val}</span>
                     <span className="text-sm text-white/50">{field.unit}</span>
                   </div>
                </div>
                
                <div className="relative group/slider pb-6">
                  <div className="w-full relative h-2 bg-darkNavy rounded-full border border-white/10 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-accentBlue transition-all"
                      style={{ width: `${((field.val - field.min) / (field.max - field.min)) * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={field.val}
                    onChange={e => handleFieldChange(field.key, +e.target.value)}
                    className="absolute inset-x-0 top-[-6px] w-full h-5 opacity-0 cursor-pointer z-20"
                  />
                  {/* Fake thumb */}
                  <div 
                    className="absolute top-[-4px] w-4 h-4 bg-white border-[3px] border-accentBlue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] pointer-events-none transition-transform group-hover/slider:scale-125 z-10"
                    style={{ left: `calc(${((field.val - field.min) / (field.max - field.min)) * 100}% - 8px)` }}
                  />
                  <div className="absolute top-4 inset-x-0 flex justify-between text-[10px] text-white/40 font-semibold tracking-wider">
                     <span>{field.min}{field.key === 'edad' ? '' : field.unit}</span>
                     <span>{field.max}{field.key === 'edad' ? '' : field.unit}</span>
                  </div>
                </div>
             </div>
           ))}

           {/* Nivel de Actividad */}
           <div className="space-y-4 pt-2">
              <label className="text-sm font-semibold text-white/80">Nivel de Actividad</label>
              
              <div className="relative group/activity pb-14 mt-2">
                <div className="w-full relative h-2 bg-darkNavy rounded-full border border-white/10 overflow-hidden">
                   <div 
                      className="absolute top-0 left-0 h-full bg-accentBlue transition-all"
                      style={{ width: `${(activityIndex / 4) * 100}%` }}
                   />
                </div>
                <input
                   type="range"
                   min="0"
                   max="4"
                   step="1"
                   value={activityIndex}
                   onChange={e => handleFieldChange('actividad', ACT_LEVELS[+e.target.value])}
                   className="absolute inset-x-0 top-[-6px] w-full h-5 opacity-0 cursor-pointer z-20"
                />
                <div 
                   className="absolute top-[-4px] w-4 h-4 bg-white border-[3px] border-accentBlue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] pointer-events-none transition-transform group-hover/activity:scale-125 z-10"
                   style={{ left: `calc(${(activityIndex / 4) * 100}% - 8px)` }}
                />
                
                {/* Labels under slider */}
                <div className="absolute top-4 inset-x-0 flex justify-between px-1">
                   {[
                     { i: Sofa }, { i: Footprints }, { i: ActivityIcon }, { i: Flame }, { i: Zap }
                   ].map((Item, i) => (
                      <div key={i} className={clsx(
                        "flex flex-col items-center gap-1.5 transition-colors cursor-pointer w-16",
                        activityIndex === i ? "text-accentBlue" : "text-white/30 hover:text-white/60"
                      )} onClick={() => handleFieldChange('actividad', ACT_LEVELS[i])}>
                        <Item.i className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-center">{ACT_LABELS[i]}</span>
                      </div>
                   ))}
                </div>
              </div>
              
              <div className="text-center pt-2">
                 <p className="text-sm font-bold text-accentBlue">{ACT_LABELS[activityIndex]}</p>
                 <p className="text-xs text-white/40">{ACT_DESC[activityIndex]}</p>
              </div>
           </div>

        </div>

        {/* --- RIGHT COLUMN: TUS RESULTADOS --- */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl space-y-10 flex flex-col">
           <h2 className="text-2xl md:text-3xl font-bold text-center text-accentBlue mb-2">Tus resultados</h2>

           {/* Progress Bars (TMB & TDEE) */}
           <div className="space-y-8">
              <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold text-white">Metabolismo Basal (TMB)</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-black text-white"><AnimatedNumber value={resultados.tmb} /></span>
                       <span className="text-[10px] text-white/50 uppercase">calorías/día</span>
                    </div>
                 </div>
                 <div className="w-full h-3 bg-darkNavy rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${(resultados.tmb / maxCal) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold text-white">Necesidades Calóricas (TDEE)</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-black text-white"><AnimatedNumber value={resultados.get} /></span>
                       <span className="text-[10px] text-white/50 uppercase">calorías/día</span>
                    </div>
                 </div>
                 <div className="w-full h-3 bg-darkNavy rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-accentBlue"
                      initial={{ width: 0 }}
                      animate={{ width: `${(resultados.get / maxCal) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                 </div>
              </div>
           </div>

           {/* THE BAR CHART (Custom Image Colors) */}
           <div className="bg-darkNavy/40 border border-white/5 rounded-2xl p-6 relative">
              <div className="flex h-56 relative w-full pt-4 pr-2">
                 {/* Y Axis Labels & Grid Lines */}
                 <div className="absolute inset-y-0 left-0 w-12 flex flex-col justify-between py-4 text-[9px] text-white/30 font-bold items-end pr-2 opacity-50 z-0">
                    <span>3.000</span>
                    <span>2.500</span>
                    <span>2.000</span>
                    <span>1.500</span>
                    <span>1.000</span>
                    <span>500</span>
                    <span>0</span>
                 </div>
                 <div className="absolute inset-y-0 left-12 right-0 flex flex-col justify-between py-4 pointer-events-none z-0">
                    <div className="border-t border-white/5 w-full h-[1px]"></div>
                    <div className="border-t border-white/5 w-full h-[1px]"></div>
                    <div className="border-t border-white/5 w-full h-[1px]"></div>
                    <div className="border-t border-white/5 w-full h-[1px]"></div>
                    <div className="border-t border-white/5 w-full h-[1px]"></div>
                    <div className="border-t border-white/5 w-full h-[1px]"></div>
                    <div className="border-t border-white/20 w-full h-[1px]"></div>
                 </div>

                 {/* Bars Container */}
                 <div className="flex justify-around items-end ml-12 w-full pb-4 gap-4 z-10 relative">
                    {/* Bar 1: Perder */}
                    <div className="w-1/3 max-w-[80px] group flex flex-col justify-end items-center h-full">
                       <motion.div 
                         className="w-full"
                         style={{ backgroundColor: COLOR_PERDER }}
                         initial={{ height: 0 }}
                         animate={{ height: `${(deficit / 3000) * 100}%` }}
                         transition={{ duration: 0.8, ease: "easeOut" }}
                       />
                       <span className="text-[10px] text-white/50 font-semibold absolute -bottom-5">Perder</span>
                    </div>

                    {/* Bar 2: Mantener */}
                    <div className="w-1/3 max-w-[80px] group flex flex-col justify-end items-center h-full">
                       <motion.div 
                         className="w-full"
                         style={{ backgroundColor: COLOR_MANTENER }}
                         initial={{ height: 0 }}
                         animate={{ height: `${(mantenimiento / 3000) * 100}%` }}
                         transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                       />
                       <span className="text-[10px] text-white/50 font-semibold absolute -bottom-5">Mantener</span>
                    </div>

                    {/* Bar 3: Ganar */}
                    <div className="w-1/3 max-w-[80px] group flex flex-col justify-end items-center h-full">
                       <motion.div 
                         className="w-full"
                         style={{ backgroundColor: COLOR_GANAR }}
                         initial={{ height: 0 }}
                         animate={{ height: `${(superavit / 3000) * 100}%` }}
                         transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                       />
                       <span className="text-[10px] text-white/50 font-semibold absolute -bottom-5">Ganar</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -left-4 top-1/2 -rotate-90 text-[10px] font-bold text-white/30 uppercase tracking-widest origin-center translate-y-[-50%]">Calorías</div>
           </div>

           {/* Objetivos calóricos CARDS */}
           <div className="flex flex-col items-center">
             <h3 className="text-xl font-bold text-accentBlue mb-6 mt-2">Objetivos calóricos</h3>
             
             <div className="grid grid-cols-3 gap-3 w-full">
                {/* Perder */}
                <div className="bg-darkNavy border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                   <ArrowDown className="w-5 h-5 text-[#E06C75]" />
                   <span className="text-xs font-semibold text-white/70">Perder</span>
                   <span className="text-lg font-black text-white"><AnimatedNumber value={deficit} /></span>
                   <span className="text-[10px] text-white/40">cal/día</span>
                </div>
                {/* Mantener */}
                <div className="bg-darkNavy border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                   <Equal className="w-5 h-5 text-[#4285F4]" />
                   <span className="text-xs font-semibold text-white/70">Mantener</span>
                   <span className="text-lg font-black text-white"><AnimatedNumber value={mantenimiento} /></span>
                   <span className="text-[10px] text-white/40">cal/día</span>
                </div>
                {/* Ganar */}
                <div className="bg-darkNavy border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                   <ArrowUp className="w-5 h-5 text-[#54B47B]" />
                   <span className="text-xs font-semibold text-white/70">Ganar</span>
                   <span className="text-lg font-black text-white"><AnimatedNumber value={superavit} /></span>
                   <span className="text-[10px] text-white/40">cal/día</span>
                </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}

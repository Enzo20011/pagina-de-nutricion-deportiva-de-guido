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
  Zap,
  Info,
  ChevronRight,
  BookOpen,
  Target
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  const accentColor = data.sexo === 'masculino' ? '#3b82f6' : '#f43f5e';
  const accentClass = data.sexo === 'masculino' ? 'text-[#3b82f6]' : 'text-[#f43f5e]';
  const accentBg = data.sexo === 'masculino' ? 'bg-[#3b82f6]' : 'bg-[#f43f5e]';
  const accentBorder = data.sexo === 'masculino' ? 'border-[#3b82f6]' : 'border-[#f43f5e]';
  const accentShadow = data.sexo === 'masculino' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(244, 63, 94, 0.5)';

  const handleFieldChange = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const deficit = useMemo(() => Math.round(resultados.get - 500), [resultados.get]);
  const mantenimiento = useMemo(() => Math.round(resultados.get), [resultados.get]);
  const superavit = useMemo(() => Math.round(resultados.get + 500), [resultados.get]);

  const chartData = [
    { name: 'Perder', kcal: deficit, color: '#ff4d4d' },
    { name: 'Mantener', kcal: mantenimiento, color: '#3b82f6' },
    { name: 'Ganar', kcal: superavit, color: '#22c55e' },
  ];
  
  const activityIndex = useMemo(() => ACT_LEVELS.indexOf(data.actividad), [data.actividad]);

  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto text-[#eaeef6] pb-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* --- LEFT COLUMN: INPUTS --- */}
        <div className="bg-[#0e1419] border border-[#1f262e] rounded-sm p-3 space-y-3 flex flex-col relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <ActivityIcon className="w-32 h-32 text-white" />
           </div>

           <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a7abb2] mb-2 flex items-center gap-3 relative z-10">
             <Info className={clsx("w-4 h-4", accentClass)} /> PARÁMETROS BIOMÉTRICOS
           </h2>
           
           {/* Género */}
           <div className="space-y-2 relative z-10">
              <label className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#a7abb2]">Género Biológico</label>
              <div className="grid grid-cols-2 bg-[#1a2027] rounded-sm border border-[#2a3040] p-1 gap-1">
                <button
                  onClick={() => handleFieldChange('sexo', 'masculino')}
                  className={clsx(
                    "py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all relative overflow-hidden",
                    data.sexo === 'masculino' ? "text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "text-[#a7abb2] hover:bg-[#1f262e]"
                  )}
                >
                  {data.sexo === 'masculino' && <motion.div layoutId="gender-bg" className="absolute inset-0 bg-[#3b82f6] -z-10" />}
                  Hombre
                </button>
                <button
                  onClick={() => handleFieldChange('sexo', 'femenino')}
                  className={clsx(
                    "py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all relative overflow-hidden",
                    data.sexo === 'femenino' ? "text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]" : "text-[#a7abb2] hover:bg-[#1f262e]"
                  )}
                >
                  {data.sexo === 'femenino' && <motion.div layoutId="gender-bg" className="absolute inset-0 bg-[#f43f5e] -z-10" />}
                  Mujer
                </button>
              </div>
           </div>

           {/* Sliders */}
           {[
             { label: 'Peso Corporal', val: data.peso, unit: 'KG', min: 30, max: 200, key: 'peso' },
             { label: 'Altura', val: data.altura, unit: 'CM', min: 100, max: 220, key: 'altura' },
             { label: 'Edad', val: data.edad, unit: 'Años', min: 15, max: 90, key: 'edad' },
           ].map((field) => (
             <div key={field.key} className="space-y-2 relative z-10">
                <div className="flex justify-between items-end">
                   <label className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#a7abb2]">{field.label}</label>
                   <div className="flex items-baseline gap-2">
                     <span className="text-xl font-black italic tracking-tighter text-white leading-none">{field.val}</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-[#43484e]">{field.unit}</span>
                   </div>
                </div>
                
                <div className="relative h-4 flex items-center group">
                  <div className="w-full h-[2px] bg-[#1a2027] relative">
                    <motion.div 
                      className={clsx("absolute top-0 left-0 h-full", accentBg)}
                      style={{ width: `${((field.val - field.min) / (field.max - field.min)) * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={field.val}
                    onChange={e => handleFieldChange(field.key, +e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                   <div 
                    className={clsx("absolute w-4 h-4 rounded-full bg-[#eaeef6] border-2 shadow-lg pointer-events-none transition-transform group-hover:scale-125 z-10", accentBorder)}
                    style={{ left: `calc(${((field.val - field.min) / (field.max - field.min)) * 100}% - 8px)`, boxShadow: `0 0 10px ${accentShadow}` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-bold text-[#43484e] uppercase tracking-widest px-1">
                   <span>{field.min}{field.unit}</span>
                   <span>{field.max}{field.unit}</span>
                </div>
             </div>
           ))}

           {/* Actividad */}
           <div className="space-y-6 pt-2 relative z-10">
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#a7abb2]">Nivel de Actividad Física</label>
              
              <div className="relative group/activity pb-8 mt-1">
                <div className="w-full h-[2px] bg-[#1a2027] relative">
                   <motion.div 
                      className={clsx("absolute top-0 left-0 h-full opacity-40", accentBg)}
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
                   className="absolute inset-x-0 top-0 w-full h-4 opacity-0 cursor-pointer z-20"
                />
                 <div 
                    className={clsx("absolute w-4 h-4 rounded-full pointer-events-none z-10", accentBg)}
                    style={{ left: `calc(${(activityIndex / 4) * 100}% - 8px)`, top: '-6px', boxShadow: `0 0 15px ${accentShadow}` }}
                 />
                
                <div className="flex justify-between mt-6">
                   {[Sofa, Footprints, ActivityIcon, Flame, Zap].map((Icon, i) => (
                      <div key={i} className={clsx(
                        "flex flex-col items-center gap-2 cursor-pointer transition-all",
                        activityIndex === i ? accentClass + " scale-110" : "text-[#43484e] grayscale opacity-50 hover:opacity-100"
                      )} onClick={() => handleFieldChange('actividad', ACT_LEVELS[i])}>
                        <Icon className="w-4 h-4" />
                        <span className="text-[7px] font-bold uppercase tracking-tighter text-center">{ACT_LABELS[i]}</span>
                      </div>
                   ))}
                </div>
              </div>
              
              <div className={clsx("bg-[#141a20]/50 p-4 rounded-sm border border-[#1f262e] border-l-4 transition-all")}>
                 <p className={clsx("text-[9px] font-bold uppercase tracking-[0.2em] mb-1", accentClass)}>{ACT_LABELS[activityIndex]}</p>
                 <p className="text-[11px] text-[#a7abb2] font-medium leading-tight">"{ACT_DESC[activityIndex]}"</p>
              </div>
           </div>
        </div>

        {/* --- RIGHT COLUMN: RESULTS --- */}
        <div className="space-y-4">
           
           <div className="bg-[#0e1419] border border-[#1f262e] rounded-sm p-4 flex flex-col shadow-2xl">
              <h2 className="font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a7abb2] mb-4 flex items-center gap-3">
                <Target className={clsx("w-4 h-4", accentClass)} /> TUS RESULTADOS_
              </h2>

               <div className="space-y-4 mb-4">
                  {/* TMB and TDEE in a more compact layout */}
                  {/* TMB */}
                  <div className="space-y-1">
                     <div className="flex justify-between items-baseline">
                        <span className="font-label text-[9px] font-bold uppercase tracking-[0.15em] text-[#eaeef6]">Metabolismo Basal (TMB)</span>
                        <div className="flex items-baseline gap-1">
                           <span className="stat-val !text-2xl"><AnimatedNumber value={resultados.tmb} /></span>
                           <span className="eyebrow !text-[8px] !text-[#43484e]">kcal</span>
                        </div>
                     </div>
                     <div className="w-full h-2 bg-[#1a2027] rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                         initial={{ width: 0 }}
                         animate={{ width: `${(resultados.tmb / 3000) * 100}%` }}
                         transition={{ duration: 1.2, ease: "easeOut" }}
                       />
                    </div>
                  </div>

                 {/* TDEE */}
                  <div className="space-y-1">
                     <div className="flex justify-between items-baseline">
                        <span className={clsx("font-label text-[9px] font-bold uppercase tracking-[0.15em]", accentClass)}>Gasto Calórico (TDEE)</span>
                        <div className="flex items-baseline gap-1">
                           <span className={clsx("stat-val !text-2xl", accentClass)}><AnimatedNumber value={resultados.get} /></span>
                           <span className="eyebrow !text-[8px] !text-[#43484e]">kcal</span>
                        </div>
                     </div>
                     <div className="w-full h-2 bg-[#1a2027] rounded-full overflow-hidden">
                       <motion.div 
                         className={clsx("h-full", accentBg)}
                         style={{ boxShadow: `0 0 20px ${accentShadow}` }}
                         initial={{ width: 0 }}
                         animate={{ width: `${(resultados.get / 3000) * 100}%` }}
                         transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                       />
                    </div>
                  </div>
               </div>
                        {/* Central Chart */}
               <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-full h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 40, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f262e" opacity={0.5} />
                        <XAxis 
                           dataKey="name" 
                           axisLine={{ stroke: '#1f262e' }} 
                           tickLine={false} 
                           tick={{ fill: '#a7abb2', fontSize: 10, fontWeight: 'medium' }} 
                           dy={10}
                        />
                        <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: '#43484e', fontSize: 9 }} 
                           label={{ value: 'Calorías', angle: -90, position: 'insideLeft', offset: -30, fill: '#43484e', fontSize: 9, fontWeight: 'bold' }}
                           domain={[0, 'dataMax + 500']}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className={clsx("bg-[#1a2027] border p-2 shadow-2xl rounded-sm", accentBorder)}>
                                  <p className="font-label text-[8px] uppercase tracking-widest text-[#a7abb2] mb-1">{payload[0].payload.name}</p>
                                  <p className="font-heading font-black text-lg text-[#eaeef6]">{payload[0].value} kcal</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="kcal" radius={[2, 2, 0, 0]} barSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <h3 className="font-label text-[9px] font-bold uppercase tracking-[0.4em] text-[#3b82f6] mt-4 mb-3">Objetivos calóricos_</h3>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-0">
                 {[
                   { label: 'Perder', val: deficit, icon: ArrowDown, color: 'text-[#ff4d4d]', border: 'border-[#ff4d4d]/10' },
                   { label: 'Mantener', val: mantenimiento, icon: Equal, color: 'text-[#3b82f6]', border: 'border-[#3b82f6]/20' },
                   { label: 'Ganar', val: superavit, icon: ArrowUp, color: 'text-[#22c55e]', border: 'border-[#22c55e]/10' },
                 ].map((card, i) => {
                   const Icon = card.icon;
                   return (
                     <div key={i} className={clsx(
                        "bg-[#141a20]/40 border p-2.5 rounded-sm flex flex-col items-center gap-1 transition-all hover:bg-[#141a20]",
                        card.border
                      )}>
                        <Icon className={clsx("w-3 h-3", card.color)} />
                        <p className="font-label text-[7px] font-bold uppercase tracking-[0.05em] text-[#a7abb2]">{card.label}</p>
                        <p className="font-heading font-black text-base text-[#eaeef6] leading-none">
                          <AnimatedNumber value={card.val} />
                        </p>
                        <p className="font-label text-[6px] uppercase text-[#43484e]">cal/día</p>
                      </div>
                   );
                 })}
               </div>

              </div>
           </div>
        </div>
      </div>

      {/* --- INFORMATION SECTION: HARRIS BENEDICT --- */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 border-t border-[#1f262e] pt-20"
      >
        <div className="max-w-4xl mx-auto space-y-16 px-4">
          <div className="text-center space-y-4">
            <h2 className="heading-lg">
              ¿QUÉ ES LA CALCULADORA <br/>
              <span className={accentClass}>HARRIS BENEDICT?</span>
            </h2>
            <div className={clsx("w-20 h-1 mx-auto rounded-full", accentBg)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="body-text">
                La calculadora Harris Benedict es una herramienta fundamental para determinar tus necesidades calóricas diarias basándose en tu metabolismo basal (TMB) y nivel de actividad física.
              </p>
              <p className="body-text">
                Esta ecuación, desarrollada por los nutricionistas J. Arthur Harris y Francis G. Benedict en 1919 y actualizada en varias ocasiones, es ampliamente utilizada por profesionales de la nutrición.
              </p>
            </div>
            <div className="bg-[#0e1419] border border-[#1f262e] p-8 rounded-sm relative group overflow-hidden">
               <div className={clsx("absolute top-0 left-0 w-1 h-full", accentBg)} style={{ boxShadow: `0 0 15px ${accentShadow}` }} />
               <h3 className="heading-sm mb-6 flex items-center gap-2">
                 <BookOpen className={clsx("w-4 h-4", accentClass)} /> Fórmulas Actualizadas
               </h3>
               <div className={clsx("space-y-6 font-mono text-[11px]", accentClass)}>
                 <div className="p-3 bg-black/20 rounded-sm">
                   <p className="text-white mb-2 eyebrow opacity-50 font-sans">Mujeres:</p>
                   TMB = 447.593 + (9.247 × kg) + (3.098 × cm) - (4.330 × años)
                 </div>
                 <div className="p-3 bg-black/20 rounded-sm">
                   <p className="text-white mb-2 eyebrow opacity-50 font-sans">Hombres:</p>
                   TMB = 88.362 + (13.397 × kg) + (4.799 × cm) - (5.677 × años)
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
            {[
              {
                title: "Cálculo del TMB",
                text: "Primero, calculamos tu Tasa Metabólica Basal, la cantidad de energía que tu cuerpo necesita en reposo absoluto para funciones vitales.",
                num: "01"
              },
              {
                title: "Factor de Actividad",
                text: "Multiplicamos tu TMB por un factor basado en tu nivel de actividad diaria, de sedentario a extremadamente activo.",
                num: "02"
              },
              {
                title: "Gasto Diario (TDEE)",
                text: "Obtenemos tus necesidades totales, indicando cuántas calorías necesitas para mantener tu peso actual.",
                num: "03"
              },
              {
                title: "Ajuste de Objetivos",
                text: "Calculamos variaciones para perder, mantener o aumentar peso, aplicando déficits o superávits científicos.",
                num: "04"
              }
            ].map((step, i) => (
              <div key={i} className="bg-[#0e1419] border border-[#1f262e] p-6 rounded-sm hover:border-[#3b82f6]/30 transition-all group">
                <span className="heading-sm text-[#1f262e] group-hover:text-[#3b82f6]/20 transition-colors block mb-2">{step.num}</span>
                <h4 className="heading-sm !text-[12px] opacity-90 mb-4">{step.title}</h4>
                <p className="body-sm">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-8 rounded-sm mx-4 md:mx-0">
             <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className={clsx("w-12 h-12 rounded-sm flex items-center justify-center shrink-0", accentBg)}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h3 className="heading-sm mb-2 text-white">Dato importante</h3>
                   <p className="body-text !text-sm italic">
                     "Este método científico proporciona una base sólida para planificar tu alimentación diaria. Sin embargo, recuerda que es una estimación y puede requerir ajustes según tu respuesta individual y monitoreo profesional."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

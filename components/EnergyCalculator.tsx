'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  User, 
  User2, 
  Scale, 
  Ruler, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Info,
  ChevronDown,
  TrendingDown,
  Minus,
  TrendingUp,
  BarChart3,
  Zap,
  Activity,
  Target,
  PersonStanding,
  Accessibility,
  Dumbbell,
  Flame,
  Equal
} from 'lucide-react';

type Sexo = 'hombre' | 'mujer';
type Actividad = 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy-intenso';

const ACTIVIDAD_FACTORES: Record<Actividad, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  'muy-intenso': 1.9,
};

const ACTIVIDAD_LABELS: Record<Actividad, string> = {
  sedentario: 'Sedentario',
  ligero: 'Ligeramente activo',
  moderado: 'Moderadamente activo',
  intenso: 'Muy activo',
  'muy-intenso': 'Extremadamente activo',
};

export default function EnergyCalculator() {
  const [peso, setPeso] = useState(70);
  const [altura, setAltura] = useState(170);
  const [edad, setEdad] = useState(30);
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [actividad, setActividad] = useState<Actividad>('ligero');
  const [tmb, setTmb] = useState(0);
  const [tdee, setTdee] = useState(0);

  useEffect(() => {
    let tmbVal = 0;
    if (sexo === 'hombre') {
      tmbVal = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else {
      tmbVal = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }
    setTmb(Math.round(tmbVal));
    setTdee(Math.round(tmbVal * ACTIVIDAD_FACTORES[actividad]));
  }, [peso, altura, edad, sexo, actividad]);

    const accentColor = sexo === 'hombre' ? 'blue-500' : 'rose-500';
    const accentText = sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500';
    const accentBg = sexo === 'hombre' ? 'bg-blue-500' : 'bg-rose-500';
    const accentBorder = sexo === 'hombre' ? 'border-blue-500' : 'border-rose-500';

    return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</label>
        <span className={`text-xl font-black italic ${accentText} tracking-tighter`}>{value} <span className="text-[10px] opacity-40 not-italic">{unit}</span></span>
      </div>
      <div className="relative flex items-center group">
        <input title="Campo de entrada" 
          type="range"
          min={min}
          max={max}
          value={value}
          onInput={(e: any) => onChange(parseInt(e.target.value))}
          className="professional-slider w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer transition-all hover:bg-white/10"
          style={{
            // @ts-ignore
            '--slider-gradient': `linear-gradient(to right, ${sexo === 'hombre' ? '#3b82f6' : '#f43f5e'} ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.05) ${(value - min) / (max - min) * 100}%)`,
            // @ts-ignore
            '--thumb-color': sexo === 'hombre' ? '#3b82f6' : '#f43f5e',
            // @ts-ignore
            '--thumb-shadow': sexo === 'hombre' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(244, 63, 94, 0.4)'
          }}
        />
      </div>
      <div className="flex justify-between text-[8px] font-bold text-white/10 uppercase tracking-widest">
        <span>Min {min}</span>
        <span>Max {max}</span>
      </div>
    </div>
  );

  return (
    <section id="calculadora" className="py-24 md:py-40 px-6 relative overflow-hidden bg-darkNavy scroll-mt-24">
      <style jsx global>{`
        .professional-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: var(--thumb-color, #10b981);
          border: 4px solid #020617;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px var(--thumb-shadow, rgba(16, 185, 129, 0.4));
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .professional-slider:active::-webkit-slider-thumb {
          transform: scale(1.15);
          box-shadow: 0 0 30px var(--thumb-shadow, rgba(16, 185, 129, 0.6));
        }
        .professional-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: var(--thumb-color, #10b981);
          border: 4px solid #020617;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px var(--thumb-shadow, rgba(16, 185, 129, 0.4));
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] -mr-64 -mt-64 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] -ml-40 -mb-40 rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="mb-20 md:mb-32 space-y-6">
          <div className={`flex items-center gap-4 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'}`}>
            <div className={`h-[2px] w-12 ${sexo === 'hombre' ? 'bg-blue-500' : 'bg-rose-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Bio-Stats Engine</span>
          </div>
          <h2 className="text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-[0.85] font-playfair">
            Calcular <br />
            <span className={`${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'} not-italic`}>Energía.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          {/* LEFT: INPUTS */}
          <div className="space-y-12">
            <div className="bg-black/40 border border-white/5 p-10 lg:p-14 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
               <div className="flex items-center gap-4 mb-16">
                  <div className={`w-10 h-10 rounded-2xl ${sexo === 'hombre' ? 'bg-blue-600/20 border-blue-500/30' : 'bg-rose-600/20 border-rose-500/30'} flex items-center justify-center border`}>
                    <User className={`w-5 h-5 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'}`} />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Introduce tus datos</h3>
               </div>

               <div className="space-y-12">
                {/* GÉNERO */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Biología</label>
                  <div className="grid grid-cols-2 bg-white/5 p-1 rounded-2xl border border-white/5 relative overflow-hidden">
                    {(['hombre', 'mujer'] as Sexo[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSexo(s)}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all relative z-10 ${
                          sexo === s ? 'text-white' : 'text-white/20 hover:text-white/40'
                        }`}
                      >
                        {sexo === s && (
                          <motion.div 
                            layoutId="sexo-pill"
                            className={`absolute inset-0 ${s === 'hombre' ? 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)]'} rounded-xl -z-10`}
                          />
                        )}
                        {s === 'hombre' ? <User className="w-3 h-3" /> : <User2 className="w-3 h-3" />}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS */}
                <CustomSlider label="Peso Actual" value={peso} min={40} max={200} onChange={setPeso} unit="kg" />
                <CustomSlider label="Estatura" value={altura} min={120} max={230} onChange={setAltura} unit="cm" />
                <CustomSlider label="Edad" value={edad} min={15} max={100} onChange={setEdad} unit="años" />

                {/* ACTIVIDAD */}
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Frecuencia de Actividad</label>
                      <span className={`text-[11px] font-black ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'} uppercase tracking-widest`}>{ACTIVIDAD_LABELS[actividad]}</span>
                   </div>
                   <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5 relative group">
                      <input title="Campo de entrada"
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={['sedentario', 'ligero', 'moderado', 'intenso', 'muy-intenso'].indexOf(actividad)}
                        onInput={(e: any) => setActividad(['sedentario', 'ligero', 'moderado', 'intenso', 'muy-intenso'][parseInt(e.target.value)] as Actividad)}
                        className="professional-slider w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                            <div className="flex justify-between mt-8 text-[7px] font-black text-white/20 uppercase tracking-[0.1em]">
                        <div className="flex flex-col items-center gap-2 flex-1 text-center">
                          <PersonStanding className={`w-4 h-4 transition-colors ${actividad === 'sedentario' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : 'text-white/20'}`} />
                          <span className={actividad === 'sedentario' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : ''}>Sedentario</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 text-center">
                          <Accessibility className={`w-4 h-4 transition-colors ${actividad === 'ligero' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : 'text-white/20'}`} />
                          <span className={actividad === 'ligero' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : ''}>Ligero</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 text-center">
                          <Dumbbell className={`w-4 h-4 transition-colors ${actividad === 'moderado' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : 'text-white/20'}`} />
                          <span className={actividad === 'moderado' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : ''}>Moderado</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 text-center">
                          <Zap className={`w-4 h-4 transition-colors ${actividad === 'intenso' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : 'text-white/20'}`} />
                          <span className={actividad === 'intenso' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : ''}>Intenso</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 text-center">
                          <Flame className={`w-4 h-4 transition-colors ${actividad === 'muy-intenso' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : 'text-white/20'}`} />
                          <span className={actividad === 'muy-intenso' ? (sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500') : ''}>Atleta</span>
                        </div>
                      </div>
iv>
                   </div>
                </div>
               </div>
            </div>
          </div>

          {/* RIGHT: RESULTS - HIGH IMPACT */}
          <div className="space-y-8 flex flex-col h-full">
            <div className="flex-1 bg-white/[0.03] border border-white/10 p-8 lg:p-12 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
               <div className="relative z-10 space-y-12">
                  <div className="flex justify-between items-center border-b border-white/5 pb-8">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Tus resultados</h3>
                    <BarChart3 className={`w-5 h-5 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'} opacity-40`} />
                  </div>
                  
                  <div className="space-y-10">
                    {/* BMR Indicator */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Metabolismo Basal (TMB)</p>
                          <p className="text-2xl font-black italic text-white tracking-tighter">{tmb} <span className="text-[9px] opacity-40 not-italic uppercase">cal/día</span></p>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(tmb / 3000) * 100}%` }}
                            className="h-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                          />
                        </div>
                    </div>

                    {/* TDEE Indicator */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Gasto Energético (TDEE)</p>
                          <p className={`text-2xl font-black italic ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'} tracking-tighter`}>{tdee} <span className="text-[9px] opacity-40 not-italic uppercase">cal/día</span></p>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(tdee / 4000) * 100}%` }}
                            className={`h-full ${sexo === 'hombre' ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'}`}
                          />
                        </div>
                    </div>

                    {/* BAR CHART */}
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5">
                      <div className="h-56 flex items-end justify-between gap-4 px-2">
                        {[
                          { label: 'Perder', val: tdee - 500, color: 'bg-rose-500/60', text: 'text-rose-400' },
                          { label: 'Mantener', val: tdee, color: sexo === 'hombre' ? 'bg-blue-500/60' : 'bg-rose-400/60', text: sexo === 'hombre' ? 'text-blue-400' : 'text-rose-300' },
                          { label: 'Ganar', val: tdee + 500, color: 'bg-emerald-500/60', text: 'text-emerald-400' }
                        ].map((goal, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full">
                            <div className="flex-1 w-full bg-white/5 rounded-t-xl relative overflow-hidden flex items-end">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(goal.val / (tdee + 1500)) * 100}%` }}
                                className={`w-full ${goal.color} border-t border-white/20`}
                              />
                              <div className="absolute top-2 inset-x-0 text-center">
                                 <span className="text-[7px] font-mono text-white/40">{goal.val}</span>
                              </div>
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${goal.text}`}>{goal.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CALORIC OBJECTIVES CARDS */}
                  <div className="space-y-6 pt-4 border-t border-white/5">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-center text-white/20 italic">Objetivos calóricos</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Perder', val: Math.max(0, tdee - 500), icon: <TrendingDown className="w-4 h-4 text-rose-500" /> },
                        { label: 'Mantener', val: tdee, icon: <Equal className={`w-4 h-4 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-400'}`} /> },
                        { label: 'Ganar', val: tdee + 500, icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> }
                      ].map((obj, i) => (
                        <div key={i} className={`bg-white/5 p-4 rounded-3xl flex flex-col items-center justify-center gap-1 border border-white/5 transition-all hover:bg-white/10 hover:${sexo === 'hombre' ? 'border-blue-500/20' : 'border-rose-500/20'} group/card`}>
                          <div className="mb-1 group-hover/card:scale-110 transition-transform">{obj.icon}</div>
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-tighter">{obj.label}</span>
                          <span className="text-sm font-black text-white">{obj.val}</span>
                          <span className="text-[7px] text-white/20 uppercase">cal/día</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl flex items-center justify-between group cursor-help transition-all hover:bg-white/[0.05]">
               <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-2xl ${sexo === 'hombre' ? 'bg-blue-500/20 border-blue-500/40' : 'bg-rose-500/20 border-rose-500/40'} flex items-center justify-center border`}>
                    <Info className={`w-4 h-4 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'}`} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Bio-Sincronización</h4>
                    <p className="text-[8px] text-white/40 font-medium italic">Cálculos basados en fórmulas clínicas actualizadas.</p>
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        </div>

        {/* METABOLIC GUIDE - SECTION 2 */}
        <div className="mt-40 md:mt-64 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-tight font-playfair">Precision <br /><span className={`${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'} not-italic`}>Equations.</span></h3>
                <div className={`w-20 h-2 ${sexo === 'hombre' ? 'bg-blue-500' : 'bg-rose-500'} rounded-full`} />
              </div>
              <p className="text-xl text-bone/40 font-light leading-relaxed">
                Nuestra plataforma utiliza un ajuste patentado de la fórmula Harris-Benedict revisada, optimizada para objetivos clínicos y deportivos actuales. No se trata solo de números, sino de precisión biológica.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] space-y-4">
                    <p className="text-4xl font-black italic text-white tracking-tighter">01</p>
                    <h4 className="text-[11px] font-black uppercase text-emerald-500 tracking-[0.3em]">BMR Accuracy</h4>
                    <p className="text-xs text-bone/30 font-medium">Cálculo preciso del metabolismo en reposo absoluto.</p>
                 </div>
                 <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] space-y-4">
                    <p className="text-4xl font-black italic text-white tracking-tighter">02</p>
                    <h4 className="text-[11px] font-black uppercase text-emerald-500 tracking-[0.3em]">TDEE Variance</h4>
                    <p className="text-xs text-bone/30 font-medium">Ajuste de termogénesis adaptativa diaria.</p>
                 </div>
              </div>
           </div>
           
            <div className={`relative aspect-square py-12 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'}`}>
               <div className={`absolute inset-0 ${sexo === 'hombre' ? 'bg-blue-500/10' : 'bg-rose-500/10'} blur-[100px] animate-pulse`} />
               <div className="relative h-full rounded-[4rem] border border-white/10 overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-3xl shadow-3xl">
                  <div className="p-12 text-center space-y-8">
                    <Activity className={`w-20 h-20 ${sexo === 'hombre' ? 'text-blue-500' : 'text-rose-500'} mx-auto`} />
                    <code className="text-sm md:text-lg font-black text-white/60 block bg-white/5 p-8 rounded-3xl border border-white/5 leading-relaxed tracking-tighter">
                       TMB = {sexo === 'hombre' ? '88.362 + (13.397 × kg) + (4.799 × cm) - (5.677 × edad)' : '447.593 + (9.247 × kg) + (3.098 × cm) - (4.330 × edad)'}
                    </code>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">The Foundation of Success</p>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Utensils, 
  PieChart, 
  Search,
  Zap,
  Sparkles,
  Database,
  CheckCircle2,
  ArrowRight,
  Minus,
  Dna, 
  Flame, 
  Scale, 
  Save, 
  Download, 
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exportarDietaLazy } from '@/utils/exportPdfAction';

interface FoodItem {
  id: string;
  nombre: string;
  kcal: number;
  proteinas: number;
  carbos: number;
  grasas: number;
  gramos: number;
  origen: 'USDA' | 'Nutrinfo';
}

interface Meal {
  id: string;
  nombre: string;
  items: FoodItem[];
  totalKcal: number;
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
  objetivoSugerido?: { p: number, c: number, g: number };
}

const FOOD_DATABASE: Omit<FoodItem, 'gramos' | 'id'>[] = [
  { nombre: 'Pechuga de Pollo (Cruda)', kcal: 165, proteinas: 31, carbos: 0, grasas: 3.6, origen: 'USDA' },
  { nombre: 'Arroz Integral Cocido', kcal: 111, proteinas: 2.6, carbos: 23, grasas: 0.9, origen: 'USDA' },
  { nombre: 'Palta (Aguacate) Haas', kcal: 160, proteinas: 2, carbos: 8.5, grasas: 14.7, origen: 'USDA' },
  { nombre: 'Yogur Ser Vainilla', kcal: 45, proteinas: 3.5, carbos: 7.2, grasas: 0.1, origen: 'Nutrinfo' },
  { nombre: 'Galletitas Traviata', kcal: 420, proteinas: 10, carbos: 68, grasas: 12, origen: 'Nutrinfo' },
  { nombre: 'Queso Casancrem Light', kcal: 120, proteinas: 9, carbos: 4.8, grasas: 6.8, origen: 'Nutrinfo' },
];

export default function PlanAlimentario({ pacienteId, onSync }: { pacienteId: string, onSync?: (data: any) => void }) {
  const queryClient = useQueryClient();
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', nombre: 'Desayuno', items: [], totalKcal: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 },
    { id: '2', nombre: 'Almuerzo', items: [], totalKcal: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 },
    { id: '3', nombre: 'Merienda', items: [], totalKcal: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 },
    { id: '4', nombre: 'Cena', items: [], totalKcal: 0, totalProteins: 0, totalCarbs: 0, totalFats: 0 },
  ]);
  const [targetKcal, setTargetKcal] = useState(2000);
  const [targetMacros, setTargetMacros] = useState({ p: 30, c: 40, f: 30 });
  const [isExporting, setIsExporting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<'ALL' | 'USDA' | 'Nutrinfo'>('ALL');
  const [numComidas, setNumComidas] = useState<number>(4);

  // 1. Fetch initial data
  const { data: serverData } = useQuery({
    queryKey: ['dieta', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/dieta?pacienteId=${pacienteId}`);
      if (!res.ok) throw new Error('Error al cargar dieta');
      return res.json();
    },
    enabled: !!pacienteId
  });

  // Sync server data to local state once
  React.useEffect(() => {
    if (serverData?.data) {
       const { comidas, objetivoCalorico, macrosObjetivo } = serverData.data;
       if (comidas && comidas.length > 0) {
         // Fix totals if they are not present or differ
         const fixedMeals = comidas.map((m: any, i: number) => ({
           ...m,
           id: m.id || m._id || (i + 1).toString(),
           items: m.items.map((it: any) => ({ ...it, id: it.id || it._id || Math.random().toString() })),
           totalKcal: m.totalKcal || 0,
           totalProteins: m.totalProteins || 0,
           totalCarbs: m.totalCarbs || 0,
           totalFats: m.totalFats || 0,
         }));
         setMeals(fixedMeals);
         setNumComidas(fixedMeals.length);
       }
       if (objetivoCalorico) setTargetKcal(objetivoCalorico);
       if (macrosObjetivo) setTargetMacros(macrosObjetivo);
    }
  }, [serverData]);

  // Dynamic meals handler
  const getMealNames = (num: number) => {
    switch (num) {
      case 1: return ['Dieta Única (OMAD)'];
      case 2: return ['Desayuno', 'Cena'];
      case 3: return ['Desayuno', 'Almuerzo', 'Cena'];
      case 4: return ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
      case 5: return ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Post-entreno'];
      case 6: return ['Desayuno', 'Colación M. Mañana', 'Almuerzo', 'Merienda', 'Cena', 'Colación Nocturna'];
      case 7: return ['Desayuno', 'Colación M. Mañana', 'Almuerzo', 'Colación M. Tarde', 'Merienda', 'Cena', 'Colación Nocturna'];
      case 8: return ['Desayuno', 'Colación M. Mañana', 'Almuerzo', 'Colación M. Tarde', 'Merienda', 'Cena', 'Pre-entreno', 'Post-entreno'];
      case 9: return ['Desayuno', 'Colación M. Mañana', 'Almuerzo', 'Colación M. Tarde', 'Merienda', 'Cena', 'Colación Nocturna', 'Pre-entreno', 'Post-entreno'];
      default: return Array.from({ length: num }).map((_, i) => `Comida ${i + 1}`);
    }
  };

  const handleNumComidasChange = (num: number) => {
    setNumComidas(num);
    const names = getMealNames(num);
    setMeals(prev => {
      return Array.from({ length: num }).map((_, i) => {
        const existingMeal = prev[i];
        return {
          id: (i + 1).toString(),
          nombre: names[i],
          items: existingMeal ? existingMeal.items : [],
          totalKcal: existingMeal ? existingMeal.totalKcal : 0,
          totalProteins: existingMeal ? existingMeal.totalProteins : 0,
          totalCarbs: existingMeal ? existingMeal.totalCarbs : 0,
          totalFats: existingMeal ? existingMeal.totalFats : 0,
        };
      });
    });
  };

  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => {
      meal.items.forEach(item => {
        acc.kcal += (item.kcal * item.gramos) / 100;
        acc.p += (item.proteinas * item.gramos) / 100;
        acc.c += (item.carbos * item.gramos) / 100;
        acc.g += (item.grasas * item.gramos) / 100;
      });
      return acc;
    }, { kcal: 0, p: 0, c: 0, g: 0 });
  }, [meals]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/dieta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al guardar dieta');
      return res.json();
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['dieta', pacienteId], res);
    }
  });

  // Auto-sync with parent (PDF/Summary)
  React.useEffect(() => {
    if (onSync) {
      onSync({
        meals,
        totals,
        targets: { targetKcal, targetMacros }
      });
    }
  }, [meals, totals, targetKcal, targetMacros, onSync]);

  // Autoguardado debounced
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (pacienteId) {
        saveMutation.mutate({
          pacienteId,
          objetivoCalorico: targetKcal,
          comidas: meals,
          macrosObjetivo: targetMacros
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [meals, targetKcal, targetMacros]);

  const searchResults = useMemo(() => {
    return FOOD_DATABASE.filter(f => 
       f.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&
       (filterSource === 'ALL' || f.origen === filterSource)
    );
  }, [searchQuery, filterSource]);

  const addFood = (mealId: string, baseFood: any) => {
    const newFood: FoodItem = {
      ...baseFood,
      id: Math.random().toString(),
      gramos: 100
    };
    setMeals(meals.map(m => m.id === mealId ? { ...m, items: [...m.items, newFood] } : m));
    setSearchQuery('');
  };

  const removeFood = (mealId: string, foodId: string) => {
    setMeals(meals.map(m => m.id === mealId ? { ...m, items: m.items.filter(f => f.id !== foodId) } : m));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-bone">
      
      {/* LEFT SECTION: SEARCH & MEALS */}
      <div className="xl:col-span-8 space-y-10">
        
        {/* SEARCH BAR ELITE */}
        <div className="bg-white/[0.03] p-10 rounded-[4rem] border border-white/5 shadow-inner backdrop-blur-md space-y-8">
           <div className="flex items-center gap-4 text-slate-500 px-2">
              <Database className="w-5 h-5 text-accentBlue" />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Arquitectura Nutricional Dual</span>
           </div>
           
           <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-accentBlue transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Indexar alimento..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="w-full bg-darkNavy/80 pl-16 pr-6 py-6 rounded-2xl outline-none border border-white/5 focus:border-accentBlue/30 transition-all font-bold text-white placeholder:text-white/10 shadow-inner"
                 />
              </div>
              <div className="flex gap-2 bg-darkNavy/50 p-2 rounded-2xl border border-white/5">
                 {['ALL', 'USDA', 'Nutrinfo'].map(s => (
                   <button 
                     key={s}
                     onClick={() => setFilterSource(s as any)}
                     className={clsx(
                       "px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                       filterSource === s ? 'bg-white text-darkNavy shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'
                     )}
                   >
                     {s}
                   </button>
                 ))}
              </div>
           </div>

           {/* Selector de Comidas */}
           <div className="pt-6 border-t border-white/5">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Frecuencia de Ingestas</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Sincroniza el nivel de comidas (1-9)</p>
                </div>
                <div className="flex items-center gap-1.5 bg-darkNavy/50 p-2 rounded-2xl border border-white/5 shadow-inner">
                  <button
                    onClick={() => numComidas > 1 && handleNumComidasChange(numComidas - 1)}
                    disabled={numComidas <= 1}
                    className="w-10 h-10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 text-center">
                    <span className="text-xl font-black text-white italic">{numComidas}</span>
                  </div>
                  <button
                    onClick={() => numComidas < 9 && handleNumComidasChange(numComidas + 1)}
                    disabled={numComidas >= 9}
                    className="w-10 h-10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
             </div>
           </div>

           {/* Results Overlay */}
           <AnimatePresence>
             {searchQuery.length > 1 && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-h-[450px] overflow-y-auto custom-scrollbar p-2"
               >
                  {searchResults.map((food, i) => (
                    <button 
                      key={i}
                      disabled={!activeMealId}
                      onClick={() => activeMealId && addFood(activeMealId, food)}
                      className={clsx(
                        "flex flex-col p-8 rounded-[2.5rem] border transition-all text-left group relative overflow-hidden",
                        activeMealId 
                          ? 'bg-darkNavy/80 border-white/5 hover:border-accentBlue/50 hover:translate-y-[-4px] shadow-lg' 
                          : 'opacity-40 cursor-not-allowed bg-darkNavy/20 border-transparent shadow-none'
                      )}
                    >
                       <div className="flex justify-between items-start mb-6">
                          <span className={clsx(
                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                            food.origen === 'USDA' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-500/10 text-orange-400'
                          )}>
                            {food.origen}
                          </span>
                          <span className="text-xs font-black text-slate-500 group-hover:text-white transition-colors">{food.kcal} <span className="text-xs opacity-40">KCAL</span></span>
                       </div>
                       <p className="text-white font-black uppercase tracking-tight text-base mb-6 group-hover:text-accentBlue transition-colors italic">{food.nombre}</p>
                       <div className="flex gap-6 text-slate-500 group-hover:text-white/60 transition-colors">
                          <div className="text-xs font-black uppercase tracking-widest">P: {food.proteinas}g</div>
                          <div className="text-xs font-black uppercase tracking-widest">C: {food.carbos}g</div>
                          <div className="text-xs font-black uppercase tracking-widest">G: {food.grasas}g</div>
                       </div>
                    </button>
                  ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* MEALS ENGINE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {meals.map(meal => (
             <div 
               key={meal.id} 
               onClick={() => setActiveMealId(meal.id)}
               className={clsx(
                 "bg-white/[0.03] rounded-[4rem] border transition-all cursor-pointer overflow-hidden backdrop-blur-md group",
                 activeMealId === meal.id 
                  ? 'border-accentBlue/50 shadow-[0_0_80px_rgba(59,130,246,0.1)] translate-y-[-4px]' 
                  : 'border-white/5 shadow-xl hover:border-white/10'
               )}
             >
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-darkNavy/20">
                   <div className="flex items-center gap-5">
                      <div className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        activeMealId === meal.id ? 'bg-accentBlue text-white shadow-xl' : 'bg-darkNavy text-slate-500'
                      )}>
                         <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                       <input 
                         type="text"
                         value={meal.nombre}
                         onChange={e => setMeals(meals.map(m => m.id === meal.id ? { ...m, nombre: e.target.value } : m))}
                         className="text-lg font-black text-white uppercase italic tracking-tighter bg-transparent outline-none border-b border-transparent focus:border-accentBlue/50 w-full min-w-[150px] placeholder:text-white/20 transition-colors"
                         placeholder="Nombre Comida"
                       />
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        {activeMealId === meal.id && <div className="w-1.5 h-1.5 rounded-full bg-accentBlue animate-pulse" />}
                        <span className={clsx(
                          "text-xs font-black uppercase tracking-widest leading-none",
                          activeMealId === meal.id ? 'text-accentBlue' : 'text-slate-500'
                        )}>{meal.items.length} ELM</span>
                      </div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                        Target: <span className="text-white ml-0.5">{Math.round(targetKcal / numComidas)}</span> <span className="text-[8px] opacity-50">KCAL</span>
                      </p>
                   </div>
                </div>

                <div className="p-8 space-y-4 min-h-[250px]">
                   {meal.items.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-6 bg-darkNavy/80 rounded-[2.5rem] border border-white/5 group/item transition-all hover:bg-darkNavy">
                        <div className="flex flex-1 items-center gap-5">
                           <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                              <CheckCircle2 className="w-4 h-4 text-accentBlue" />
                           </div>
                           <div className="flex-1">
                              <p className="font-black text-white uppercase italic text-xs tracking-tight truncate max-w-[120px]">{item.nombre}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                 <input 
                                   type="number" 
                                   value={item.gramos} 
                                   onChange={e => {
                                      const newGrams = +e.target.value;
                                      setMeals(meals.map(m => m.id === meal.id ? { ...m, items: m.items.map(i => i.id === item.id ? { ...i, gramos: newGrams } : i) } : m));
                                   }}
                                   className="w-12 bg-transparent border-b border-white/10 text-xs font-black text-accentBlue outline-none focus:border-accentBlue text-center"
                                 />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">G</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right hidden sm:block">
                              <p className="text-base font-black text-white tracking-tighter italic leading-none">{Math.round((item.kcal * item.gramos) / 100)}</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">KCAL</p>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); removeFood(meal.id, item.id); }}
                             className="p-3 bg-darkNavy text-slate-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-white/5"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                   {meal.items.length === 0 && (
                     <div className="text-center py-10 opacity-10">
                        <p className="text-xs font-black uppercase tracking-[0.4em] italic">Auditando Ingesta...</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* RIGHT SECTION: MACRO CONSOLE */}
      <div className="xl:col-span-4">
        <div className="sticky top-12 space-y-8">
           <div className="bg-darkNavy/40 p-10 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accentBlue/10 rounded-full blur-[100px]" />
              
              <header className="flex items-center gap-4 mb-14 relative z-10">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group">
                    <PieChart className="w-6 h-6 text-accentBlue group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Status Macroquímico</h3>
              </header>

              <div className="space-y-10">
                 {/* Kcal Dial */}
                 <div className="p-10 bg-darkNavy/80 rounded-[3.5rem] border border-white/5 text-center space-y-6 shadow-inner relative group">
                    <div className="absolute inset-0 bg-accentBlue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 leading-none">Energía Indexada</p>
                    <div className="flex items-baseline justify-center gap-3">
                       <h4 className="text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl">{Math.round(totals.kcal)}</h4>
                       <span className="text-xl font-black text-accentBlue/30 italic">/{targetKcal}</span>
                    </div>
                    <div className="w-full h-1.5 bg-darkNavy rounded-full overflow-hidden shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min((totals.kcal / targetKcal) * 100, 100)}%` }}
                         className="h-full bg-accentBlue shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-full"
                       />
                    </div>
                 </div>

                 {/* Macros Status */}
                 <div className="grid grid-cols-1 gap-5">
                    {[
                      { l: 'Proteína', v: totals.p, c: 'bg-white', k: 'P' },
                      { l: 'Carbohidratos', v: totals.c, c: 'bg-accentBlue', k: 'C' },
                      { l: 'Lípidos', v: totals.g, c: 'bg-slate-400', k: 'G' }
                    ].map(m => (
                      <div key={m.k} className="p-7 bg-white/[0.03] rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-white/20 transition-all group/item">
                         <div className="flex items-center gap-5">
                            <div className={clsx(
                               "w-12 h-12 rounded-2xl flex items-center justify-center text-darkNavy font-black text-sm italic shadow-lg",
                               m.c
                            )}>
                               {m.k}
                            </div>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/item:text-white transition-colors">{m.l}</span>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{Math.round(m.v)}<span className="text-xs opacity-20 ml-1">G</span></p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-12 p-8 bg-darkNavy/60 border border-white/5 rounded-[2.5rem] space-y-4 group">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-accentBlue group-hover:rotate-12 transition-transform" />
                    <p className="text-xs font-black text-white uppercase tracking-widest">IA de Cuadre Clínico</p>
                 </div>
                 <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                    {totals.kcal < targetKcal 
                      ? `Precisión requerida: faltan ${Math.round(targetKcal - totals.kcal)} KCAL. Ajuste las ingestas para optimizar el balance.`
                      : 'Equilibrio metabólico alcanzado. Sincronización completa.'}
                 </p>
              </div>

              <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    const { exportarDietaLazy } = await import('@/utils/exportPdfAction');
                    await exportarDietaLazy({ nombre: 'Paciente_Elite', edad: 25 }, totals, meals);
                  }}
                  className="w-full mt-12 py-8 bg-white text-darkNavy hover:bg-accentBlue hover:text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-4 group"
                >
                   Exportar Protocolo PDF <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
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

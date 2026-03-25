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

export default function PlanAlimentario({ 
  pacienteId, 
  onSync,
  anamnesisData
}: { 
  pacienteId: string, 
  onSync?: (data: any) => void,
  anamnesisData?: any
}) {
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

  // Sync calories from clinical panel (Anamnesis)
  React.useEffect(() => {
    if (anamnesisData?.targetKcal) {
      setTargetKcal(Math.round(anamnesisData.targetKcal));
    } else if (anamnesisData?.resultados?.get) {
      setTargetKcal(Math.round(anamnesisData.resultados.get));
    }
  }, [anamnesisData]);

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
  const serverHydratedRef = React.useRef(false);
  React.useEffect(() => {
    if (serverData?.data && !serverHydratedRef.current) {
       const { comidas, objetivoCalorico, macrosObjetivo } = serverData.data;
       if (comidas && comidas.length > 0) {
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
       // Only hydrate calories if we have no anamnesis data yet
       if (objetivoCalorico && !anamnesisData?.resultados?.get) {
         setTargetKcal(objetivoCalorico);
       }
       if (macrosObjetivo) setTargetMacros(macrosObjetivo);
       serverHydratedRef.current = true;
    }
  }, [serverData, anamnesisData]);

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
  const lastSyncRef = React.useRef<string>('');
  React.useEffect(() => {
    if (onSync) {
      const syncObj = { meals, totals, targets: { targetKcal, targetMacros } };
      const syncStr = JSON.stringify(syncObj);
      if (syncStr !== lastSyncRef.current) {
        lastSyncRef.current = syncStr;
        onSync(syncObj);
      }
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
  }, [meals, targetKcal, targetMacros, pacienteId]);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search API Call
  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ['alimentos', debouncedSearch, filterSource],
    queryFn: async () => {
      if (debouncedSearch.length < 2) return { data: [] };
      const res = await fetch(`/api/alimentos?q=${debouncedSearch}&categoria=${filterSource}`);
      if (!res.ok) throw new Error('Error buscando alimentos');
      return res.json();
    },
    enabled: debouncedSearch.length >= 2
  });

  React.useEffect(() => {
    if (searchData?.data) {
      setSearchResults(searchData.data);
    }
  }, [searchData]);

  const addFood = (mealId: string, baseFood: any) => {
    const newFood: FoodItem = {
      ...baseFood,
      id: Math.random().toString(),
      gramos: baseFood.porcionBaseGramos || 100,
      carbos: baseFood.carbohidratos !== undefined ? baseFood.carbohidratos : baseFood.carbos,
    };
    setMeals(meals.map(m => m.id === mealId ? { ...m, items: [...m.items, newFood] } : m));
    setSearchQuery('');
  };

  const removeFood = (mealId: string, foodId: string) => {
    setMeals(meals.map(m => m.id === mealId ? { ...m, items: m.items.filter(f => f.id !== foodId) } : m));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-white">
      
      {/* ADVISORY BAR */}
      <div className="xl:col-span-12">
        <div className="bg-white/5 border border-white/10 p-4 rounded-sm flex items-center gap-6 group relative">
          <div className="w-12 h-12 bg-[#3b82f6] rounded-sm flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-700">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-white uppercase tracking-widest leading-none">Gestión de Plan Alimentario</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2">Personalización de ingestas y distribución de macronutrientes.</p>
          </div>
        </div>
      </div>

      {/* LEFT SECTION: STRATEGIC SEARCH & ARCHITECTURE */}
      <div className="xl:col-span-8 space-y-12">
        
        {/* BIO-SEARCH TERMINAL */}
        <div className="bg-[#0e1419] p-6 md:p-8 rounded-sm border border-white/5 shadow-xl space-y-10 relative overflow-hidden group">
           <div className="flex items-center gap-4 text-white/10 px-2">
              <Database className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em]">BASE DE DATOS NUTRICIONAL</span>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 relative group/search">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within/search:text-[#3b82f6]/40 transition-all duration-700" />
               <input 
                 type="text" 
                 placeholder="Buscar alimentos..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full bg-[#0a0f14] pl-16 pr-6 py-4 rounded-sm outline-none border border-white/5 focus:border-[#3b82f6]/30 transition-all duration-700 font-bold text-white placeholder:text-white/5 shadow-inner uppercase tracking-widest text-[10px]"
               />
            </div>
            <div className="flex gap-2 bg-[#0a0f14] p-2 rounded-sm border border-white/5 shadow-xl">
               {['ALL', 'USDA', 'Nutrinfo'].map(s => (
                 <button 
                   key={s}
                   onClick={() => setFilterSource(s as any)}
                   className={clsx(
                     "px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all duration-700",
                     filterSource === s ? 'bg-[#3b82f6] text-white shadow-xl' : 'text-white/20 hover:text-white hover:bg-white/5'
                   )}
                 >
                   {s}
                 </button>
               ))}
            </div>
           </div>

          <div className="pt-8 border-t border-white/5 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
               <div className="space-y-1">
                 <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Número de Ingestas</h3>
                 <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest">DEFINIR FRECUENCIA DIARIA</p>
               </div>
               <div className="flex items-center gap-4 bg-[#0a0f14] p-2 rounded-sm border border-white/5 shadow-inner">
                 <button
                   onClick={() => numComidas > 1 && handleNumComidasChange(numComidas - 1)}
                   disabled={numComidas <= 1}
                   className="w-10 h-10 rounded-sm hover:bg-white/5 transition-all duration-700 flex items-center justify-center text-white/20 hover:text-white disabled:opacity-0"
                 >
                   <Minus className="w-4 h-4" />
                 </button>
                 <div className="w-12 text-center">
                   <span className="text-2xl font-bold text-white tracking-tighter">{numComidas}</span>
                 </div>
                 <button
                   onClick={() => numComidas < 9 && handleNumComidasChange(numComidas + 1)}
                   disabled={numComidas >= 9}
                   className="w-10 h-10 rounded-sm hover:bg-white/5 transition-all duration-700 flex items-center justify-center text-white/20 hover:text-white disabled:opacity-0"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchQuery.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-h-[500px] overflow-y-auto custom-scrollbar p-3 relative z-20"
            >
              {isSearchLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-40 bg-white/5 rounded-sm animate-pulse border border-white/5" />
                ))
              ) : (
                searchResults.map((food, i) => (
                  <button 
                    key={food._id || i}
                    disabled={!activeMealId}
                    onClick={() => activeMealId && addFood(activeMealId, food)}
                    className={clsx(
                      "flex flex-col p-5 rounded-sm border transition-all duration-700 text-left group relative",
                      activeMealId 
                        ? 'bg-[#0a0f14] border-white/5 hover:border-[#3b82f6]/30 shadow-xl' 
                        : 'opacity-20 cursor-not-allowed bg-transparent border-transparent'
                    )}
                  >
                     <div className="flex justify-between items-start mb-6 w-full">
                        <span className="px-3 py-1 bg-white/5 rounded-sm text-[8px] font-bold uppercase tracking-widest text-[#3b82f6]">
                          {food.categoria || 'ALIMENTO'}
                        </span>
                        <span className="text-[10px] font-bold text-white/20 group-hover:text-white transition-all duration-700">{food.kcal} <span className="text-[8px] opacity-40">KCAL</span></span>
                     </div>
                     <p className="text-white font-bold uppercase tracking-tight text-[12px] mb-6 group-hover:text-[#3b82f6] transition-all duration-700 truncate w-full">{food.nombre}</p>
                     <div className="flex gap-6 text-[9px] font-bold uppercase tracking-widest text-white/10 group-hover:text-white/30 transition-all duration-700">
                        <div>P: {food.proteinas}g</div>
                        <div>C: {food.carbohidratos !== undefined ? food.carbohidratos : food.carbos}g</div>
                        <div>G: {food.grasas}g</div>
                     </div>
                  </button>
                ))
              )}
               {!isSearchLoading && searchResults.length === 0 && (
                 <div className="col-span-1 md:col-span-2 text-center py-20 opacity-10">
                    <p className="text-sm font-black uppercase tracking-[0.8em] italic">Sin Coincidencias en Terminal_</p>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {meals.map(meal => (
             <div 
               key={meal.id} 
              onClick={() => setActiveMealId(meal.id)}
              className={clsx(
                "bg-[#0e1419] rounded-sm border transition-all duration-1000 cursor-pointer overflow-hidden group relative",
                activeMealId === meal.id 
                 ? 'border-[#3b82f6]/30 shadow-xl' 
                 : 'border-white/5 shadow-lg hover:border-white/10'
              )}
            >
               <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0a0f14]/40 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={clsx(
                       "w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-700 border",
                       activeMealId === meal.id ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-xl' : 'bg-[#0a0f14] border-white/5 text-white/10'
                     )}>
                        <Utensils className="w-5 h-5" />
                     </div>
                     <div>
                      <input 
                        type="text"
                        value={meal.nombre}
                        onChange={e => setMeals(meals.map(m => m.id === meal.id ? { ...m, nombre: e.target.value } : m))}
                        className="text-[14px] font-bold text-white uppercase tracking-tight bg-transparent outline-none border-b border-transparent focus:border-white/20 w-full min-w-[140px] placeholder:text-white/10 transition-all duration-700"
                        placeholder="Nombre Ingesta"
                      />
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                     <div className="flex items-center gap-2">
                       {activeMealId === meal.id && <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />}
                       <span className={clsx(
                         "text-[9px] font-bold uppercase tracking-widest leading-none",
                         activeMealId === meal.id ? 'text-[#3b82f6]' : 'text-white/10'
                       )}>{meal.items.length} ITEMS</span>
                     </div>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white/5">
                       META: <span className="text-white/30 ml-1">{Math.round(targetKcal / numComidas)}</span> <span className="opacity-20">KCAL</span>
                     </p>
                  </div>
               </div>

                <div className="p-6 space-y-4 relative z-10">
                   {meal.items.map(item => (
                     <div key={item.id} className="flex flex-col items-start justify-between p-4 bg-[#0a0f14] rounded-sm border border-white/5 group/item transition-all duration-700 hover:bg-[#0e1419] gap-4 shadow-inner">
                        <div className="flex flex-1 items-center gap-4 w-full">
                           <div className="w-8 h-8 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-white/20 group-hover/item:text-[#3b82f6] transition-all duration-700" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="font-bold text-white uppercase text-[12px] tracking-tight truncate">{item.nombre}</p>
                              <div className="flex items-center gap-3 mt-2">
                                 <input 
                                   type="number" 
                                   value={item.gramos} 
                                   onChange={e => {
                                      const newGrams = +e.target.value;
                                      setMeals(meals.map(m => m.id === meal.id ? { ...m, items: m.items.map(i => i.id === item.id ? { ...i, gramos: newGrams } : i) } : m));
                                   }}
                                   className="w-16 bg-[#0a0f14] border border-white/5 text-[10px] font-bold text-white outline-none focus:border-[#3b82f6]/30 p-1.5 rounded-sm text-center transition-all duration-700"
                                 />
                                 <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">G</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between gap-8 w-full pt-4 border-t border-white/5">
                           <div className="text-left">
                              <p className="text-lg font-bold text-white tracking-tight leading-none">{Math.round((item.kcal * item.gramos) / 100)}</p>
                              <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1">KCAL</p>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); removeFood(meal.id, item.id); }}
                             className="p-3 bg-white/5 text-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-sm transition-all duration-700 border border-white/5"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                   {meal.items.length === 0 && (
                     <div className="text-center py-16 opacity-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.5em]">Cargando Ingestas</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* RIGHT SECTION: STRATEGIC MACRO CONSOLE */}
      <div className="xl:col-span-4">
        <div className="sticky top-12 space-y-12">
           <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl relative overflow-hidden">
              <header className="flex items-center gap-6 mb-8 relative z-10">
                 <div className="w-12 h-12 bg-[#3b82f6] rounded-sm flex items-center justify-center shadow-xl">
                    <PieChart className="w-6 h-6 text-white" />
                 </div>
                 <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-none">MACRONUTRIENTES</h3>
              </header>

              <div className="space-y-12 relative z-10">
                 <div className="p-8 bg-[#0a0f14] rounded-sm border border-white/5 text-center space-y-6 shadow-inner relative group transition-all duration-1000">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/10 leading-none">ENERGÍA CALCULADA</p>
                    <div className="flex items-baseline justify-center gap-3">
                       <h4 className="text-4xl font-bold text-white tracking-tight">{Math.round(totals.kcal)}</h4>
                       <span className="text-xl font-bold text-white/10 tracking-tight">/{targetKcal}</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#0e1419] rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min((totals.kcal / targetKcal) * 100, 100)}%` }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         className="h-full bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-full"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { l: 'Proteína', v: totals.p, c: 'bg-[#3b82f6]', k: 'P' },
                      { l: 'Carbohidratos', v: totals.c, c: 'bg-white/10', k: 'C' },
                      { l: 'Lípidos', v: totals.g, c: 'bg-white/5', k: 'G' }
                    ].map(m => (
                      <div key={m.k} className="p-6 bg-[#0a0f14] rounded-sm border border-white/5 flex items-center justify-between hover:border-white/10 transition-all duration-700 group/item shadow-inner">
                         <div className="flex items-center gap-4">
                            <div className={clsx(
                               "w-10 h-10 rounded-sm flex items-center justify-center font-bold text-sm shadow-xl transition-all duration-700",
                               m.c,
                               'text-white'
                            )}>
                               {m.k}
                            </div>
                            <span className="text-[11px] font-bold text-white/10 uppercase tracking-widest group-hover/item:text-white transition-all duration-700">{m.l}</span>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-bold text-white tracking-tight leading-none">{Math.round(m.v)}<span className="text-xs opacity-20 ml-1">G</span></p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-12 p-6 bg-[#0a0f14] border border-white/5 rounded-sm space-y-4 group transition-all duration-700 hover:border-[#3b82f6]/20 relative overflow-hidden">
                 <div className="flex items-center gap-4 relative z-10">
                    <Sparkles className="w-5 h-5 text-[#3b82f6]/40" />
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ESTADO DEL PLAN</p>
                 </div>
                 <p className="text-[11px] text-white/10 font-bold leading-relaxed uppercase tracking-widest relative z-10">
                    {totals.kcal < targetKcal 
                      ? `DELTA ENERGÉTICO: ${Math.round(targetKcal - totals.kcal)} KCAL RESTANTES.`
                      : 'EQUILIBRIO METABÓLICO ALCANZADO.'}
                 </p>
              </div>

               <div className={clsx(
                  "flex flex-col gap-4 mt-12 transition-all duration-700",
                  saveMutation.isPending ? "opacity-50" : "opacity-100"
               )}>
                  <button 
                    onClick={() => {
                      saveMutation.mutate({
                        pacienteId,
                        objetivoCalorico: targetKcal,
                        comidas: meals,
                        macrosObjetivo: targetMacros
                      });
                      const el = document.getElementById('dieta-success');
                      if (el) {
                        el.style.opacity = '1';
                        setTimeout(() => { if (el) el.style.opacity = '0'; }, 3000);
                      }
                    }}
                    disabled={saveMutation.isPending}
                    className="w-full py-6 bg-white/10 hover:bg-white/20 text-white rounded-sm font-bold uppercase text-[10px] tracking-widest shadow-xl transition-all duration-700 flex items-center justify-center gap-4 border border-white/5 active:scale-95 group/save overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/save:translate-x-full transition-transform duration-1000" />
                    {saveMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
                    ) : (
                       <Save className="w-5 h-5 text-[#3b82f6]" />
                    )}
                    {saveMutation.isPending ? 'SINCRONIZANDO...' : 'GUARDAR PLAN'}
                  </button>
                  <div id="dieta-success" className="text-center text-[9px] font-bold text-emerald-400 uppercase tracking-[0.4em] opacity-0 transition-opacity duration-700 leading-none">
                     ✓ PLAN NUTRICIONAL ASEGURADO
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

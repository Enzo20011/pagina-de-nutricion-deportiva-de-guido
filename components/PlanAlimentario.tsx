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
import { useConsultaStore } from '@/store/useConsultaStore';

interface FoodItem {
  id: string;
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  gramos: number;
  origen: 'LOCAL' | 'USDA' | 'CUSTOM';
  idExterno?: string;
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
  { nombre: 'Pechuga de Pollo (Cruda)', calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6, origen: 'LOCAL' },
  { nombre: 'Arroz Integral Cocido', calorias: 111, proteinas: 2.6, carbohidratos: 23, grasas: 0.9, origen: 'LOCAL' },
  { nombre: 'Palta (Aguacate) Haas', calorias: 160, proteinas: 2, carbohidratos: 8.5, grasas: 14.7, origen: 'LOCAL' },
  { nombre: 'Yogur Ser Vainilla', calorias: 45, proteinas: 3.5, carbohidratos: 7.2, grasas: 0.1, origen: 'LOCAL' },
  { nombre: 'Galletitas Traviata', calorias: 420, proteinas: 10, carbohidratos: 68, grasas: 12, origen: 'LOCAL' },
  { nombre: 'Queso Casancrem Light', calorias: 120, proteinas: 9, carbohidratos: 4.8, grasas: 6.8, origen: 'LOCAL' },
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
  const [targetMacros, setTargetMacros] = useState({ proteinas: 30, carbohidratos: 40, grasas: 30 });
  const [tablaManual, setTablaManual] = useState<{alimento: string, cantidad: string}[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const setStoreDieta = useConsultaStore(state => state.setDieta);
  const storeDieta = useConsultaStore(state => state.dieta);

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
  const [filterSource, setFilterSource] = useState<'ALL' | 'USDA' | 'ARGENFOODS'>('ALL');
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
           id: m.id || (i + 1).toString(),
           items: m.items.map((it: any) => ({ ...it, id: it.id || Math.random().toString() })),
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
        if (macrosObjetivo) {
          setTargetMacros({
            proteinas: macrosObjetivo.proteinas || macrosObjetivo.p || 30,
            carbohidratos: macrosObjetivo.carbohidratos || macrosObjetivo.carbos || macrosObjetivo.c || 40,
            grasas: macrosObjetivo.grasas || macrosObjetivo.lipidos || macrosObjetivo.f || macrosObjetivo.g || 30
          });
        }
        if (serverData.data.tablaManual) setTablaManual(serverData.data.tablaManual);
        if (serverData.data.recomendaciones) setRecomendaciones(serverData.data.recomendaciones);
        serverHydratedRef.current = true;
    } else if (storeDieta && !serverHydratedRef.current) {
        if (storeDieta.tablaManual) setTablaManual(storeDieta.tablaManual);
        if (storeDieta.recomendaciones) setRecomendaciones(storeDieta.recomendaciones);
        serverHydratedRef.current = true;
    }
  }, [serverData, anamnesisData, storeDieta]);

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
      const itemsPerMeal = Math.floor(prev.reduce((acc, m) => acc + m.items.length, 0) / (num || 1));
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
      (meal.items || []).forEach(item => {
        const cal = item.calorias ?? (item as any).kcal ?? 0;
        const p = item.proteinas ?? 0;
        const c = item.carbohidratos ?? (item as any).carbos ?? 0;
        const g = item.grasas ?? (item as any).lipidos ?? (item as any).f ?? 0;
        const gr = item.gramos ?? 100;

        acc.kcal += (cal * gr) / 100;
        acc.p += (p * gr) / 100;
        acc.c += (c * gr) / 100;
        acc.g += (g * gr) / 100;
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
      const syncObj = { meals, totals, targets: { targetKcal, targetMacros }, tablaManual, recomendaciones };
      const syncStr = JSON.stringify(syncObj);
      if (syncStr !== lastSyncRef.current) {
        lastSyncRef.current = syncStr;
        onSync(syncObj);
        // Instant sync to session store
        setStoreDieta(syncObj);
      }
    }
  }, [meals, totals, targetKcal, targetMacros, tablaManual, recomendaciones, onSync, setStoreDieta]);

  // Autoguardado debounced
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (pacienteId) {
        saveMutation.mutate({
          pacienteId,
          objetivoCalorico: targetKcal,
          comidas: meals,
          macrosObjetivo: targetMacros,
          tablaManual,
          recomendaciones
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [meals, targetKcal, targetMacros, tablaManual, recomendaciones, pacienteId]);

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
      
      // Llamada única al endpoint híbrido del servidor
      const res = await fetch(`/api/alimentos?q=${debouncedSearch}&categoria=${filterSource}`);
      const data = await res.json();
      return { data: data.data || [] };
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
      gramos: 100,
      calorias: baseFood.calorias || baseFood.kcal || 0,
      carbohidratos: baseFood.carbohidratos || baseFood.carbos || 0,
      proteinas: baseFood.proteinas || 0,
      grasas: baseFood.grasas || baseFood.lipidos || baseFood.f || 0,
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
          <div className="w-12 h-12 bg-[#3b82f6] rounded-sm flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-75">
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
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within/search:text-[#3b82f6]/40 transition-all duration-75" />
               <input 
                 id="food-search"
                 type="text" 
                 placeholder="Buscar alimentos..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full bg-[#0a0f14] pl-16 pr-6 py-4 rounded-sm outline-none border border-white/5 focus:border-[#3b82f6]/30 transition-all duration-75 font-bold text-white placeholder:text-white/5 shadow-inner uppercase tracking-widest text-[10px]"
                 aria-label="Buscar alimentos en la base de datos nutricional"
               />
            </div>
            <div className="flex gap-2 bg-[#0a0f14] p-2 rounded-sm border border-white/5 shadow-xl">
               {['ALL', 'ARGENFOODS', 'USDA'].map(s => (
                 <button 
                   key={s}
                   onClick={() => setFilterSource(s as any)}
                   aria-pressed={filterSource === s}
                   aria-label={`Filtrar por fuente: ${s === 'ALL' ? 'Todas' : s}`}
                   className={clsx(
                     "px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all duration-75",
                     filterSource === s ? 'bg-[#3b82f6] text-white shadow-xl' : 'text-white/20 hover:text-white hover:bg-white/5'
                   )}
                 >
                   {s === 'ALL' ? 'TODOS' : s}
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
                   className="w-10 h-10 rounded-sm hover:bg-white/5 transition-all duration-75 flex items-center justify-center text-white/20 hover:text-white disabled:opacity-0"
                 >
                   <Minus className="w-4 h-4" />
                 </button>
                 <div className="w-12 text-center">
                   <span className="text-2xl font-bold text-white tracking-tighter">{numComidas}</span>
                 </div>
                 <button
                   onClick={() => numComidas < 9 && handleNumComidasChange(numComidas + 1)}
                   disabled={numComidas >= 9}
                   aria-label="Aumentar número de ingestas"
                   className="w-10 h-10 rounded-sm hover:bg-white/5 transition-all duration-75 flex items-center justify-center text-white/20 hover:text-white disabled:opacity-0"
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
                    key={food.id || i}
                    disabled={!activeMealId}
                    onClick={() => activeMealId && addFood(activeMealId, food)}
                    className={clsx(
                      "flex flex-col p-5 rounded-sm border transition-all duration-75 text-left group relative",
                      activeMealId 
                        ? 'bg-[#0a0f14] border-white/5 hover:border-[#3b82f6]/30 shadow-xl' 
                        : 'opacity-20 cursor-not-allowed bg-transparent border-transparent'
                    )}
                  >
                     <div className="flex justify-between items-start mb-6 w-full">
                        <div className="flex gap-2">
                           <span className="px-3 py-1 bg-white/5 rounded-sm text-[8px] font-bold uppercase tracking-widest text-[#3b82f6]">
                             {food.categoria || 'ALIMENTO'}
                           </span>
                           <span className={clsx(
                             "px-3 py-1 rounded-sm text-[8px] font-bold uppercase tracking-widest",
                             food.origen === 'USDA' ? 'bg-orange-500/10 text-orange-400' : 
                             food.origen === 'ARGENFOODS' ? 'bg-emerald-500/10 text-emerald-400' : 
                             'bg-white/5 text-white/30'
                           )}>
                             {food.origen}
                           </span>
                        </div>
                        <span className="text-[10px] font-bold text-white/20 group-hover:text-white transition-all duration-75">{food.calorias} <span className="text-[8px] opacity-40">KCAL</span></span>
                     </div>
                     <p className="text-white font-bold uppercase tracking-tight text-[12px] mb-6 group-hover:text-[#3b82f6] transition-all duration-75 truncate w-full">{food.nombre}</p>
                      <div className="flex gap-6 text-[9px] font-bold uppercase tracking-widest text-white/10 group-hover:text-white/30 transition-all duration-75">
                         <div>P: {food.proteinas}g</div>
                         <div>C: {food.carbohidratos !== undefined ? food.carbohidratos : (food as any).carbos}g</div>
                         <div>G: {food.grasas !== undefined ? food.grasas : (food as any).lipidos}g</div>
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
               role="button"
               tabIndex={0}
               aria-label={`Seleccionar ingesta: ${meal.nombre}`}
               aria-current={activeMealId === meal.id}
               onKeyDown={e => e.key === 'Enter' && setActiveMealId(meal.id)}
               className={clsx(
                 "bg-[#0e1419] rounded-sm border transition-all duration-1000 cursor-pointer overflow-hidden group relative outline-none focus-within:ring-2 focus-within:ring-[#3b82f6]/50",
                 activeMealId === meal.id 
                  ? 'border-[#3b82f6]/30 shadow-xl' 
                  : 'border-white/5 shadow-lg hover:border-white/10'
               )}
            >
               <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0a0f14]/40 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={clsx(
                       "w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-75 border",
                       activeMealId === meal.id ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-xl' : 'bg-[#0a0f14] border-white/5 text-white/10'
                     )}>
                        <Utensils className="w-5 h-5" />
                     </div>
                     <div>
                      <input 
                        type="text"
                        value={meal.nombre}
                        onChange={e => setMeals(meals.map(m => m.id === meal.id ? { ...m, nombre: e.target.value } : m))}
                        className="text-[14px] font-bold text-white uppercase tracking-tight bg-transparent outline-none border-b border-transparent focus:border-white/20 w-full min-w-[140px] placeholder:text-white/10 transition-all duration-75"
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
                     <div key={item.id} className="flex flex-col items-start justify-between p-4 bg-[#0a0f14] rounded-sm border border-white/5 group/item transition-all duration-75 hover:bg-[#0e1419] gap-4 shadow-inner">
                        <div className="flex flex-1 items-center gap-4 w-full">
                           <div className="w-8 h-8 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-white/20 group-hover/item:text-[#3b82f6] transition-all duration-75" />
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
                                    aria-label={`Cantidad en gramos para ${item.nombre}`}
                                    className="w-16 bg-[#0a0f14] border border-white/5 text-[10px] font-bold text-white outline-none focus:border-[#3b82f6]/30 p-1.5 rounded-sm text-center transition-all duration-75"
                                  />
                                 <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">G</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between gap-8 w-full pt-4 border-t border-white/5">
                           <div className="text-left">
                              <p className="text-lg font-bold text-white tracking-tight leading-none">{Math.round((item.calorias * item.gramos) / 100)}</p>
                              <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-1">KCAL</p>
                           </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeFood(meal.id, item.id); }}
                              aria-label={`Eliminar ${item.nombre} de ${meal.nombre}`}
                              className="p-3 bg-white/5 text-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-sm transition-all duration-75 border border-white/5"
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

        {/* TABLA DEL PACIENTE SECTION (Restored) */}
        <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl space-y-8 mt-12">
          <div className="flex items-center gap-4 text-white/20 px-2">
             <Sparkles className="w-4 h-4 text-[#3b82f6]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">PLAN ALIMENTARIO — TABLA DEL PACIENTE</span>
          </div>

          <div className="border border-white/5 rounded-sm overflow-hidden bg-[#0a0f14]/40">
             <div className="grid grid-cols-2 bg-[#0a0f14]/80 border-b border-white/5 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-2">ALIMENTO</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-2">CANTIDAD</div>
             </div>
             {tablaManual.map((row, i) => (
                <div key={i} className="grid grid-cols-2 border-b border-white/5 group hover:bg-white/5 transition-colors">
                   <input 
                      autoFocus={i === tablaManual.length - 1 && row.alimento === ''}
                      className="bg-transparent p-5 outline-none text-sm text-white font-bold placeholder:text-white/5 border-r border-white/5 font-sans"
                      placeholder="Ej: Pollo / Carne"
                      value={row.alimento} 
                      onChange={e => {
                        const newTabla = [...tablaManual];
                        newTabla[i].alimento = e.target.value;
                        setTablaManual(newTabla);
                      }}
                   />
                   <div className="flex items-center gap-2 pr-4">
                      <input 
                         className="flex-1 bg-transparent p-5 outline-none text-sm text-white font-bold placeholder:text-white/10 font-sans"
                         placeholder="Ej: 200g / 1 porción"
                         value={row.cantidad} 
                         onChange={e => {
                            const newTabla = [...tablaManual];
                            newTabla[i].cantidad = e.target.value;
                            setTablaManual(newTabla);
                         }}
                      />
                      <button 
                        onClick={() => setTablaManual(tablaManual.filter((_, idx) => idx !== i))}
                        className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             ))}
             <button 
                onClick={() => setTablaManual([...tablaManual, { alimento: '', cantidad: '' }])}
                className="w-full p-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all flex items-center justify-center gap-4"
             >
                <Plus className="w-4 h-4" /> AGREGAR FILA
             </button>
          </div>
        </div>

        {/* RECOMENDACIONES SECTION (Restored) */}
        <div className="bg-[#0e1419] p-8 rounded-sm border border-white/5 shadow-xl space-y-8 mt-12 mb-12">
           <div className="flex items-center gap-4 text-white/20 px-2">
             <Sparkles className="w-4 h-4 text-[#3b82f6]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">RECOMENDACIONES PARA EL PACIENTE</span>
           </div>

           <div className="space-y-4">
              {recomendaciones.map((rec, i) => {
                 const upperRec = rec.toUpperCase();
                 const notaIndex = upperRec.indexOf('NOTA:');
                 const hasNota = notaIndex !== -1;
                 
                 // UI Granular Highlight logic
                 const part1 = hasNota ? rec.substring(0, notaIndex) : rec;
                 const part2 = hasNota ? rec.substring(notaIndex) : '';

                 return (
                   <div key={i} className="flex items-center gap-6 group">
                      <div className={clsx(
                        "w-2 h-2 rounded-full shrink-0 transition-all",
                        hasNota ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-125" : "bg-[#3b82f6]/40 group-hover:bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      )} />
                      <div className="flex-1 relative min-h-[56px] flex items-center">
                         {/* Visual Representation Layer */}
                         <div className={clsx(
                           "absolute inset-0 p-5 rounded-sm border pointer-events-none text-sm font-bold font-sans flex items-center transition-all",
                           hasNota 
                             ? "bg-red-500/5 border-red-500/30 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]" 
                             : "bg-[#0a0f14]/60 border-white/5"
                         )}>
                            <span className="text-white whitespace-pre">{part1}</span>
                            <span className="text-red-400 whitespace-pre">{part2}</span>
                            {rec === '' && <span className="text-white/5">Escribir recomendación...</span>}
                         </div>

                         {/* Real Input Layer (Transparent) */}
                         <input 
                            className="flex-1 w-full p-5 bg-transparent border-none outline-none text-sm font-bold text-transparent caret-white font-sans relative z-10"
                            placeholder="Escribir recomendación..."
                            value={rec}
                            onChange={e => {
                               const newRecs = [...recomendaciones];
                               newRecs[i] = e.target.value;
                               setRecomendaciones(newRecs);
                            }}
                         />
                      </div>
                      <button 
                         onClick={() => setRecomendaciones(recomendaciones.filter((_, idx) => idx !== i))}
                         className="text-white/10 hover:text-red-500 p-3 opacity-20 group-hover:opacity-100 transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 );
              })}
              <button 
                onClick={() => setRecomendaciones([...recomendaciones, ''])}
                className="flex items-center gap-4 px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white hover:bg-white/5 transition-all rounded-sm"
              >
                <Plus className="w-4 h-4" /> AGREGAR RECOMENDACIÓN
              </button>
           </div>
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
                 <div className="p-6 sm:p-8 bg-[#0a0f14] rounded-sm border border-white/5 text-center space-y-4 sm:space-y-6 shadow-inner relative group transition-all duration-1000">
                    <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-white/10 leading-none">ENERGÍA CALCULADA</p>
                    <div className="flex items-baseline justify-center gap-2 sm:gap-3">
                       <h4 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">{Math.round(totals.kcal)}</h4>
                       <span className="text-lg sm:text-xl font-bold text-white/10 tracking-tight">/{targetKcal}</span>
                    </div>
                     <div 
                       className="w-full h-2 sm:h-2.5 bg-[#0e1419] rounded-full overflow-hidden shadow-inner border border-white/5 relative"
                       role="progressbar"
                       aria-valuenow={Math.round((totals.kcal / targetKcal) * 100)}
                       aria-valuemin={0}
                       aria-valuemax={100}
                       aria-label={`Cumplimiento calórico: ${Math.round((totals.kcal / targetKcal) * 100)}%`}
                     >
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
                      <div key={m.k} className="p-4 sm:p-6 bg-[#0a0f14] rounded-sm border border-white/5 flex items-center justify-between hover:border-white/10 transition-all duration-75 group/item shadow-inner">
                         <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                            <div className={clsx(
                               "w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center font-bold text-xs sm:text-sm shadow-xl transition-all duration-75 shrink-0",
                               m.c,
                               'text-white'
                            )}>
                               {m.k}
                            </div>
                            <span className="text-[9px] sm:text-[11px] font-bold text-white/10 uppercase tracking-widest group-hover/item:text-white transition-all duration-75 truncate">{m.l}</span>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none">{Math.round(m.v)}<span className="text-xs opacity-20 ml-1">G</span></p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-12 p-6 bg-[#0a0f14] border border-white/5 rounded-sm space-y-4 group transition-all duration-75 hover:border-[#3b82f6]/20 relative overflow-hidden">
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
                  "flex flex-col gap-4 mt-12 transition-all duration-75 text-center",
                  saveMutation.isPending ? "opacity-100" : "opacity-40"
               )}>
                  <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em]">
                    {saveMutation.isPending ? (
                      <>
                        <div className="w-3 h-3 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
                        Sincronizando Cambios...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Plan Nutricional Asegurado
                      </>
                    )}
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

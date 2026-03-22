'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ClipboardList, 
  Stethoscope, 
  Activity, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Zap,
  Coffee
} from 'lucide-react';
import { anamnesisSchema, type AnamnesisInput } from '@/schemas/anamnesisSchema';

interface Props {
  pacienteId: string;
}

export default function PanelAnamnesis({ pacienteId }: Props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting },
    reset 
  } = useForm<AnamnesisInput>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues: {
      pacienteId: pacienteId,
      nivelActividad: 'Sedentario',
      horasSueno: 8,
      nivelEstres: 5,
      ritmoIntestinal: 'Normal'
    }
  });

  const watchedFields = watch();

  // Autoguardado silencioso (Debounce de 2 segundos de inactividad)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Solo disparar si hay al menos el ID del paciente (mínimo para upsert)
      if (watchedFields.pacienteId) {
        const autoSave = async () => {
          try {
            await fetch('/api/anamnesis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...watchedFields, isDraft: true }),
            });
            const now = new Date();
            setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } catch (e) {
            console.error('Error en autoguardado:', e);
          }
        };
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [watchedFields]);

  const onSubmit = async (data: AnamnesisInput) => {
    setSuccess(false);
    setError(null);
    try {
      const response = await fetch('/api/anamnesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error al guardar la anamnesis');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <header className="flex items-center gap-4 mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-black text-slate-800 tracking-tighter uppercase">Anamnesis Clínica</h1>
          <p className="text-slate-500 font-medium italic">Ficha completa de antecedentes y estilo de vida.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUMNA IZQUIERDA: ANTECEDENTES Y CLÍNICA */}
          <div className="bg-white/80 backdrop-blur-xl p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-serif font-black text-blue-900 uppercase tracking-tight mb-4">
              <Stethoscope className="w-5 h-5" /> Antecedentes & Motivo
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Motivo de Consulta</label>
                <textarea 
                  {...register('motivoConsulta')}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all h-24 font-medium"
                  placeholder="Detalle el motivo principal de la visita..."
                />
                {errors.motivoConsulta && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.motivoConsulta.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Ocupación</label>
                <input 
                  {...register('ocupacion')}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                  placeholder="Ej: Ingeniero, Administrativo..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Patologías</label>
                <textarea 
                  {...register('patologias')}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all h-20 font-medium"
                  placeholder="Enfermedades crónicas, cirugías..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Alergias e Intolerancias *</label>
                <textarea 
                  {...register('alergiasIntolerancias')}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all h-20 font-medium"
                  placeholder="Alimentos, gluten, lactosa, etc."
                />
                {errors.alergiasIntolerancias && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.alergiasIntolerancias.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Medicación Actual</label>
                <textarea 
                  {...register('medicacionActual')}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all h-20 font-medium"
                  placeholder="Fármacos, suplementos, dosis..."
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ESTILO DE VIDA */}
          <div className="bg-white/80 backdrop-blur-xl p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-serif font-black text-blue-900 uppercase tracking-tight mb-4">
              <Activity className="w-5 h-5" /> Estilo de Vida & Hábitos
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Nivel Actividad</label>
                  <select 
                    {...register('nivelActividad')}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-blue-600"
                  >
                    <option value="Sedentario">Sedentario</option>
                    <option value="Ligero">Ligero</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Intenso">Intenso</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 text-center">Ritmo Intestinal</label>
                  <select 
                    {...register('ritmoIntestinal')}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-blue-600"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Estreñimiento">Estreñimiento</option>
                    <option value="Diarrea">Diarrea</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Sueño (horas)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      {...register('horasSueno', { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Estrés (1-10)</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      {...register('nivelEstres', { valueAsNumber: true })}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Aversiones Alimentarias</label>
                <textarea 
                  {...register('aversionesAlimentarias')}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all h-24 font-medium"
                  placeholder="Alimentos que no tolera o no le gustan..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                 <Coffee className="w-5 h-5 text-blue-600 mt-1" />
                 <p className="text-[11px] text-blue-700 font-medium">
                   Mantenemos el enfoque científico en cada dato recolectado para optimizar el plan nutricional del paciente.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-end gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {lastSaved && !success && (
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <span className="w-2 h-2 bg-slate-200 rounded-full animate-pulse" />
              Borrador guardado: {lastSaved}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-5 h-5" /> Ficha Guardada Correctamente
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-xs">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : <><Save className="w-5 h-5" /> Guardar Anamnesis</>}
          </button>
        </div>
      </form>
    </div>
  );
}

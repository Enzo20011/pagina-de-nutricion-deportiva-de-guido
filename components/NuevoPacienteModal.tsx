'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Phone, Mail, Activity, Target } from 'lucide-react';
import { pacienteSchema, PacienteInput } from '@/lib/validations/paciente';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NuevoPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id?: string) => void;
}

export default function NuevoPacienteModal({ isOpen, onClose, onSuccess }: NuevoPacienteModalProps) {
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteInput>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      status: 'Activo',
      sexo: 'masculino',
      fechaNacimiento: new Date().toISOString().split('T')[0] as any
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: PacienteInput) => {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al crear el paciente');
      }
      return res.json();
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      reset();
      if (onSuccess) onSuccess(response?.data?._id);
      onClose();
    },
    onError: (error: Error) => {
      setApiError(error.message);
    }
  });

  const onSubmit = (data: PacienteInput) => {
    setApiError(null);
    createMutation.mutate(data);
  };

  const inputStyles = "w-full p-4 bg-navy/40 border border-white/10 rounded-xl focus:border-accentBlue/50 focus:bg-white/5 outline-none font-bold text-white transition-all text-sm shadow-inner placeholder:text-white/20";
  const labelStyles = "text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-darkNavy/80 backdrop-blur-xl z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-cardDark/90 border border-white/10 rounded-[2.5rem] shadow-3xl z-[101] flex flex-col custom-scrollbar"
          >
            <div className="sticky top-0 bg-cardDark/95 backdrop-blur-3xl border-b border-white/5 px-8 py-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accentBlue flex items-center justify-center shadow-xl">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">Nuevo Paciente</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Alta en sistema Elite</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              {apiError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-sm text-center">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>Nombre *</label>
                  <input {...register('nombre')} className={inputStyles} placeholder="Ej. Juan" />
                  {errors.nombre && <p className="text-rose-400 text-[10px] mt-1 uppercase font-bold">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className={labelStyles}>Apellido *</label>
                  <input {...register('apellido')} className={inputStyles} placeholder="Ej. Pérez" />
                  {errors.apellido && <p className="text-rose-400 text-[10px] mt-1 uppercase font-bold">{errors.apellido.message}</p>}
                </div>

                <div>
                  <label className={labelStyles}>Fecha de Nacimiento *</label>
                  <input type="date" {...register('fechaNacimiento')} className={inputStyles} />
                  {errors.fechaNacimiento && <p className="text-rose-400 text-[10px] mt-1 uppercase font-bold">{errors.fechaNacimiento.message}</p>}
                </div>
                <div>
                  <label className={labelStyles}>Sexo Biológico *</label>
                  <select {...register('sexo')} className={inputStyles}>
                    <option value="masculino" className="bg-darkNavy text-white">Masculino</option>
                    <option value="femenino" className="bg-darkNavy text-white">Femenino</option>
                  </select>
                  {errors.sexo && <p className="text-rose-400 text-[10px] mt-1 uppercase font-bold">{errors.sexo.message}</p>}
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-[10px] uppercase font-black text-accentBlue tracking-widest mb-6">Contacto y Medidas (Opcional)</h3>
                </div>

                <div className="relative">
                  <label className={labelStyles}>WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('whatsapp')} className={`${inputStyles} pl-11`} placeholder="+54 9 11..." />
                  </div>
                </div>
                <div className="relative">
                  <label className={labelStyles}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" {...register('email')} className={`${inputStyles} pl-11`} placeholder="correo@ejemplo.com" />
                  </div>
                </div>

                <div className="relative">
                  <label className={labelStyles}>Objetivo Principal</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input {...register('objetivo')} className={`${inputStyles} pl-11`} placeholder="Ej. Hipertrofia, Descenso" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyles}>Peso (Kg)</label>
                    <input type="number" step="0.1" {...register('peso', { valueAsNumber: true })} className={inputStyles} placeholder="Ej. 70.5" />
                  </div>
                  <div>
                    <label className={labelStyles}>Altura (Cm)</label>
                    <input type="number" step="1" {...register('altura', { valueAsNumber: true })} className={inputStyles} placeholder="Ej. 175" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4 justify-end">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest bg-accentBlue text-white hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Iniciando...' : 'Crear y Armar Anamnesis'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

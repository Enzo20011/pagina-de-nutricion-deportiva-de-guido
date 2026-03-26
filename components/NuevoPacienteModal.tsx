'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Phone, Mail, Activity, Target } from 'lucide-react';
import { pacienteSchema, PacienteInput } from '@/lib/validations/paciente';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';

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
      if (onSuccess) onSuccess(response?.data?.id);
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

  const inputStyles = "w-full p-4 bg-[#0a0f14] border border-white/5 rounded-sm focus:border-[#3b82f6]/30 focus:bg-[#0e1419] outline-none font-bold text-white transition-all text-[10px] uppercase tracking-widest shadow-inner placeholder:text-white/5";
  const labelStyles = "text-[9px] font-bold uppercase tracking-[0.2em] text-[#a7abb2] block mb-2";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#0a0f14]/90 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-[#0a0f14] border border-white/10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[101] flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header - No sticky to avoid issues with parent overflow */}
        <div className="bg-[#0a0f14] border-b border-white/5 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#3b82f6] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-tight">Nuevo Paciente</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#a7abb2]">Alta de expediente clínico</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {apiError && (
              <div className="p-4 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[10px] uppercase tracking-widest text-center">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={labelStyles}>Nombre *</label>
                <input 
                  {...register('nombre')}
                  className={inputStyles}
                  placeholder="EJ. JUAN" 
                />
                {errors.nombre && <p className="text-rose-400 text-[8px] mt-1 uppercase font-bold tracking-widest">{errors.nombre.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelStyles}>Apellido *</label>
                <input 
                  {...register('apellido')}
                  className={inputStyles}
                  placeholder="EJ. PÉREZ" 
                />
                {errors.apellido && <p className="text-rose-400 text-[8px] mt-1 uppercase font-bold tracking-widest">{errors.apellido.message}</p>}
              </div>

              <div>
                <label className={labelStyles}>Fecha de Nacimiento *</label>
                <input type="date" {...register('fechaNacimiento')} className={inputStyles} />
                {errors.fechaNacimiento && <p className="text-rose-400 text-[8px] mt-1 uppercase font-bold tracking-widest">{errors.fechaNacimiento.message}</p>}
              </div>
              <div>
                <label className={labelStyles}>Sexo Biológico *</label>
                <select {...register('sexo')} className={inputStyles}>
                  <option value="masculino" className="bg-[#0a0f14] text-white">Masculino</option>
                  <option value="femenino" className="bg-[#0a0f14] text-white">Femenino</option>
                </select>
                {errors.sexo && <p className="text-rose-400 text-[8px] mt-1 uppercase font-bold tracking-widest">{errors.sexo.message}</p>}
              </div>

              <div className="md:col-span-2 pt-6 border-t border-white/5">
                <h3 className="text-[10px] uppercase font-bold text-[#3b82f6] tracking-[0.3em] mb-2">Información Adicional</h3>
              </div>

              <div className="relative">
                <label className={labelStyles}>WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input {...register('whatsapp')} className={`${inputStyles} pl-11`} placeholder="+54 9 11..." />
                </div>
              </div>
              <div className="relative">
                <label className={labelStyles}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input type="email" {...register('email')} className={`${inputStyles} pl-11`} placeholder="CORREO@EJEMPLO.COM" />
                </div>
              </div>

              <div className="relative">
                <label className={labelStyles}>Objetivo Principal</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                  <input {...register('objetivo')} className={`${inputStyles} pl-11`} placeholder="EJ. HIPERTROFIA, DESCENSO" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyles}>Peso (Kg)</label>
                  <input type="number" step="0.1" {...register('peso', { valueAsNumber: true })} className={inputStyles} placeholder="EJ. 70.5" />
                </div>
                <div>
                  <label className={labelStyles}>Altura (Cm)</label>
                  <input type="number" step="1" {...register('altura', { valueAsNumber: true })} className={inputStyles} placeholder="EJ. 175" />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-[#3b82f6] text-white font-bold uppercase text-[10px] tracking-[0.3em] rounded-sm hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando...' : 'Crear Paciente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

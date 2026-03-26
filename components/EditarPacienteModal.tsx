'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserCog, Phone, Mail, Target } from 'lucide-react';
import { pacienteSchema, PacienteInput } from '@/lib/validations/paciente';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditarPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: any;
  onSuccess?: () => void;
}

export default function EditarPacienteModal({ isOpen, onClose, paciente, onSuccess }: EditarPacienteModalProps) {
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

  useEffect(() => {
    if (paciente) {
      reset({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fechaNacimiento: paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0] as any : new Date().toISOString().split('T')[0] as any,
        sexo: paciente.sexo || 'masculino',
        email: paciente.email || '',
        whatsapp: paciente.whatsapp || '',
        objetivo: paciente.objetivo || '',
        peso: paciente.peso || undefined,
        altura: paciente.altura || undefined,
        status: paciente.status || 'Activo',
      });
    }
  }, [paciente, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: PacienteInput) => {
      const res = await fetch(`/api/pacientes/${paciente._id || paciente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al actualizar el paciente');
      }
      return res.json();
    },
    onSuccess: () => {
      const pId = paciente.id || paciente._id;
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['paciente', pId] });
      queryClient.invalidateQueries({ queryKey: ['anamnesis', pId] });
      queryClient.invalidateQueries({ queryKey: ['antropometria', pId] });
      queryClient.invalidateQueries({ queryKey: ['biometria', pId] });
      
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      setApiError(error.message);
    }
  });

  const onSubmit = (data: PacienteInput) => {
    setApiError(null);
    updateMutation.mutate(data);
  };

  const inputStyles = "w-full p-4 bg-[#0a0f14] border border-white/5 rounded-sm focus:border-[#3b82f6]/30 focus:bg-[#0e1419] outline-none font-bold text-white transition-all text-[10px] uppercase tracking-widest shadow-inner placeholder:text-white/5";
  const labelStyles = "text-[9px] font-bold uppercase tracking-[0.2em] text-[#a7abb2] block mb-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a0f14]/80 backdrop-blur-xl z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-[#0a0f14] border border-white/10 rounded-sm shadow-3xl z-[101] flex flex-col custom-scrollbar"
          >
            <div className="sticky top-0 bg-[#0a0f14]/95 backdrop-blur-3xl border-b border-white/5 px-8 py-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                  <UserCog className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-tight">Editar Paciente</h2>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#a7abb2]">Actualizar información base</p>
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
                <div className="p-4 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[10px] uppercase tracking-widest text-center">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>Nombre *</label>
                  <input {...register('nombre')} className={inputStyles} placeholder="EJ. JUAN" />
                  {errors.nombre && <p className="text-rose-400 text-[8px] mt-1 uppercase font-bold tracking-widest">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className={labelStyles}>Apellido *</label>
                  <input {...register('apellido')} className={inputStyles} placeholder="EJ. PÉREZ" />
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

                <div>
                  <label className={labelStyles}>Estado</label>
                  <select {...register('status')} className={inputStyles}>
                    <option value="Activo" className="bg-[#0a0f14] text-emerald-400">Activo</option>
                    <option value="En Pausa" className="bg-[#0a0f14] text-amber-400">En Pausa</option>
                    <option value="Alta" className="bg-[#0a0f14] text-[#3b82f6]">Alta Clínica</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <h3 className="text-[10px] uppercase font-bold text-[#3b82f6] tracking-[0.3em] mb-6">Contacto y Medidas (Opcional)</h3>
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
                    <label className={labelStyles}>Peso Inicial (Kg)</label>
                    <input type="number" step="0.1" {...register('peso', { valueAsNumber: true })} className={inputStyles} placeholder="EJ. 70.5" />
                  </div>
                  <div>
                    <label className={labelStyles}>Altura (Cm)</label>
                    <input type="number" step="1" {...register('altura', { valueAsNumber: true })} className={inputStyles} placeholder="EJ. 175" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex gap-4 justify-end">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-6 py-3 rounded-sm font-bold uppercase text-[9px] tracking-widest text-white/20 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-sm font-bold uppercase text-[9px] tracking-widest bg-white text-[#0a0f14] hover:bg-white/90 transition-all shadow-xl disabled:opacity-50 flex items-center gap-3"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

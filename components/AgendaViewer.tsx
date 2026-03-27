'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO,
  isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Clock3,
  Calendar as CalendarIcon,
  Search,
  ArrowUpRight,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';

const TIMES = ["09:00","10:00","11:00","15:00","16:00","17:00","18:00"];

export default function AgendaViewer() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', fecha: format(new Date(), 'yyyy-MM-dd'), hora: '09:00' });
  const queryClient = useQueryClient();

  const { data: appointmentsRes, isLoading } = useQuery({
    queryKey: ['appointments', format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      const start = format(startOfWeek(startOfMonth(currentDate)), 'yyyy-MM-dd');
      const end = format(endOfWeek(endOfMonth(currentDate)), 'yyyy-MM-dd');
      const res = await fetch(`/api/appointments/list?start=${start}&end=${end}`);
      if (!res.ok) throw new Error('Error al cargar agenda');
      return res.json();
    }
  });

  const appointments = appointmentsRes?.data || [];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const selectedDayAppointments = useMemo(() => {
    return appointments.filter((app: any) => isSameDay(parseISO(app.fecha), selectedDay));
  }, [appointments, selectedDay]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);
    try {
      const res = await fetch('/api/appointments/admin-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear turno');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowModal(false);
      setForm({ nombre: '', email: '', telefono: '', fecha: format(new Date(), 'yyyy-MM-dd'), hora: '09:00' });
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start p-4 md:p-8">
      
      {/* STRATEGIC CALENDAR CORE */}
      <div className="xl:col-span-8 bg-[#0e1419] rounded-sm border border-[#1f262e] overflow-hidden shadow-xl relative">
        <header className="p-4 md:p-8 border-b border-[#1f262e] flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-[#141a20]/40 relative z-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center shadow-lg shadow-[#3b82f6]/20 shrink-0">
              <CalendarIcon className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-tight leading-none">
                {format(currentDate, 'MMMM', { locale: es })} <span className="text-[#3b82f6] capitalize">{format(currentDate, 'yyyy')}</span>
              </h3>
              <p className="text-[7px] md:text-[9px] font-label font-bold tracking-[0.2em] text-[#a7abb2] uppercase mt-1 md:mt-2">Gestión de Turnos</p>
            </div>
          </div>
          <div className="flex gap-2 justify-center md:justify-end flex-wrap">
            <button type="button" aria-label="Mes anterior" onClick={prevMonth} className="w-9 h-9 md:w-10 md:h-10 bg-[#1f262e] hover:bg-[#3b82f6] text-white rounded-sm transition-all border border-[#1a2027] flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button type="button" onClick={() => setCurrentDate(new Date())} className="flex-1 md:flex-none px-4 md:px-6 h-9 md:h-10 bg-[#3b82f6] text-white rounded-sm text-[8px] md:text-[9px] font-label font-bold uppercase tracking-widest hover:bg-[#3b82f6]/90 transition-all shadow-md">
              Hoy
            </button>
            <button type="button" aria-label="Mes siguiente" onClick={nextMonth} className="w-9 h-9 md:w-10 md:h-10 bg-[#1f262e] hover:bg-[#3b82f6] text-white rounded-sm transition-all border border-[#1a2027] flex items-center justify-center">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 h-9 md:h-10 bg-white text-[#0a0f14] rounded-sm text-[8px] md:text-[9px] font-label font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> Nuevo Turno
            </button>
          </div>
        </header>

        <div className="p-3 md:p-6">
          {/* Days Operational Header */}
          <div className="grid grid-cols-7 mb-4 md:mb-6">
            {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
              <div key={day} className="text-center text-[7px] md:text-[9px] font-label font-bold uppercase tracking-[0.1em] md:tracking-widest text-[#a7abb2]/40">{day}</div>
            ))}
          </div>

          {/* Precision Grid Days */}
          <div className="grid grid-cols-7 gap-0.5 md:gap-2">
            {calendarDays.map((day, i) => {
              const confirmedCount = appointments.filter((a: any) => isSameDay(parseISO(a.fecha), day) && a.status === 'confirmada').length;
              const isSelected = isSameDay(day, selectedDay);
              const isCurrMonth = isSameMonth(day, monthStart);
              const isTodayDay = isToday(day);

              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={clsx(
                    "relative aspect-square rounded-sm border transition-all duration-300 flex flex-col items-center justify-center gap-1 md:gap-2 group/day",
                    isCurrMonth ? "cursor-pointer" : "opacity-5 pointer-events-none",
                    isSelected 
                      ? "bg-[#3b82f6] border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20" 
                      : "bg-transparent border-[#1f262e] hover:border-[#3b82f6]/40",
                    isTodayDay && !isSelected && "bg-[#3b82f6]/5 border-[#3b82f6]/30"
                  )}
                >
                  <span className={clsx(
                    "text-sm md:text-lg font-heading font-black tracking-tighter leading-none",
                    isSelected ? "text-white" : isTodayDay ? "text-[#3b82f6]" : "text-[#eaeef6]"
                  )}>{format(day, 'd')}</span>
                  
                  {confirmedCount > 0 && (
                     <div className="flex gap-0.5 md:gap-1">
                        {Array.from({ length: Math.min(confirmedCount, 3) }).map((_, dotIdx) => (
                           <div key={dotIdx} className={clsx("w-0.5 h-0.5 md:w-1 md:h-1 rounded-full", isSelected ? "bg-white" : "bg-[#3b82f6]")} />
                        ))}
                     </div>
                  )}

                  {isTodayDay && !isSelected && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TACTICAL SIDEBAR: CHRONOGRAM */}
      <div className="xl:col-span-4 space-y-8">
        <motion.div 
          key={selectedDay.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#0e1419] rounded-sm border border-[#1f262e] p-6 md:p-8 shadow-xl space-y-10 relative overflow-hidden"
        >
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-[9px] font-label font-bold uppercase tracking-widest text-[#3b82f6]">
               <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> Cronograma Diario
            </div>
            <h4 className="text-2xl font-heading font-black text-white tracking-tight uppercase leading-none border-b border-[#1f262e] pb-6">
              {format(selectedDay, "eeee d", { locale: es })} <br />
              <span className="text-[#a7abb2] font-label font-bold uppercase text-sm tracking-widest">{format(selectedDay, "MMMM", { locale: es })}</span>
            </h4>
          </div>

          <div className="space-y-4 relative z-10">
            {selectedDayAppointments.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-10">
                <Clock3 className="w-16 h-16 text-white" />
                <p className="text-[9px] font-label font-bold uppercase tracking-[0.2em] text-white">No hay citas registradas</p>
              </div>
            ) : (
              selectedDayAppointments.map((app: any, idx: number) => (
                <div key={idx} className="group relative p-6 bg-[#141a20]/40 border border-[#1f262e] rounded-sm hover:border-[#3b82f6]/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1f262e] rounded-sm flex items-center justify-center border border-[#1a2027] group-hover:bg-[#3b82f6] group-hover:text-white transition-all duration-300">
                        <User className="w-6 h-6 text-[#a7abb2] group-hover:text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-heading font-black text-white uppercase tracking-tight leading-none">{app.nombre}</p>
                        <span className={clsx(
                          "text-[8px] font-label font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border",
                          app.status === 'confirmada' ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        )}>
                          {app.status === 'confirmada' ? 'Confirmado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-[#3b82f6] text-white rounded-sm text-[10px] font-label font-bold tracking-widest shadow-lg">
                      {app.hora}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#1f262e] relative z-10">
                    <div className="flex items-center gap-4 text-[9px] font-label font-bold tracking-widest text-[#a7abb2] uppercase">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> {app.telefono}
                      </div>
                    </div>
                    <Link href={`/admin/pacientes?buscar=${encodeURIComponent(app.nombre)}`} className="w-10 h-10 bg-[#1f262e] hover:bg-[#3b82f6] text-[#a7abb2] hover:text-white rounded-sm transition-all flex items-center justify-center border border-[#1a2027]" title="Buscar paciente">
                       <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* MISSION CRITICAL RECAP */}
        <div className="bg-[#0e1419] rounded-sm p-10 shadow-2xl relative overflow-hidden group border border-[#1f262e]">
          <div className="relative z-10 space-y-10">
            <div className="space-y-2">
               <p className="text-[10px] font-label font-bold uppercase tracking-widest text-[#a7abb2]/40">Métricas Mensuales</p>
               <div className="w-10 h-1 bg-[#3b82f6]/20" />
            </div>
            <div className="space-y-2">
               <p className="text-4xl font-heading font-black text-white tracking-tight leading-none">
                  {appointments.filter((a: any) => a.status === 'confirmada').length}
               </p>
               <p className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-[#a7abb2]/30">Sesiones Verificadas</p>
            </div>
            <Link href="/admin/finanzas" className="w-full py-5 bg-[#3b82f6] text-white rounded-sm font-label font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-[#3b82f6]/90 transition-all flex items-center justify-center gap-4 group/btn">
               Gestionar Finanzas <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    {/* MODAL NUEVO TURNO */}
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-[#0e1419] border border-[#1f262e] rounded-sm shadow-2xl p-8 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#3b82f6] mb-1">Admin</p>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Nuevo Turno</h3>
              </div>
              <button type="button" aria-label="Cerrar" onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminCreate} className="space-y-4">
              {[
                { label: 'Nombre y Apellido *', key: 'nombre', type: 'text', required: true },
                { label: 'Email', key: 'email', type: 'email', required: false },
                { label: 'Teléfono / WhatsApp', key: 'telefono', type: 'tel', required: false },
              ].map(field => (
                <div key={field.key} className="space-y-1">
                  <label htmlFor={`turno-${field.key}`} className="text-[9px] font-bold uppercase tracking-widest text-white/30">{field.label}</label>
                  <input
                    id={`turno-${field.key}`}
                    type={field.type}
                    required={field.required}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141a20] border border-white/5 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm uppercase tracking-wide"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="turno-fecha" className="text-[9px] font-bold uppercase tracking-widest text-white/30">Fecha *</label>
                  <input
                    id="turno-fecha"
                    type="date"
                    required
                    value={form.fecha}
                    onChange={e => setForm({ ...form, fecha: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141a20] border border-white/5 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="turno-hora" className="text-[9px] font-bold uppercase tracking-widest text-white/30">Horario *</label>
                  <select
                    id="turno-hora"
                    required
                    value={form.hora}
                    onChange={e => setForm({ ...form, hora: e.target.value })}
                    className="w-full px-4 py-3 bg-[#141a20] border border-white/5 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm"
                  >
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {modalError && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{modalError}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-sm transition-colors flex items-center justify-center gap-3"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Confirmar Turno'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

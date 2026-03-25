'use client';

import React, { useState, useMemo } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

export default function AgendaViewer() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start p-4 md:p-8">
      
      {/* STRATEGIC CALENDAR CORE */}
      <div className="xl:col-span-8 bg-[#0e1419] rounded-sm border border-[#1f262e] overflow-hidden shadow-xl relative">
        <header className="p-6 md:p-8 border-b border-[#1f262e] flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#141a20]/40 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center shadow-lg shadow-[#3b82f6]/20">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight leading-none">
                {format(currentDate, 'MMMM', { locale: es })} <span className="text-[#3b82f6] capitalize">{format(currentDate, 'yyyy')}</span>
              </h3>
              <p className="text-[9px] font-label font-bold tracking-[0.2em] text-[#a7abb2] uppercase mt-2">Gestión de Turnos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="w-10 h-10 bg-[#1f262e] hover:bg-[#3b82f6] text-white rounded-sm transition-all border border-[#1a2027] flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-6 h-10 bg-[#3b82f6] text-white rounded-sm text-[9px] font-label font-bold uppercase tracking-widest hover:bg-[#3b82f6]/90 transition-all shadow-md">
              Hoy
            </button>
            <button onClick={nextMonth} className="w-10 h-10 bg-[#1f262e] hover:bg-[#3b82f6] text-white rounded-sm transition-all border border-[#1a2027] flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-5 md:p-6">
          {/* Days Operational Header */}
          <div className="grid grid-cols-7 mb-6">
            {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
              <div key={day} className="text-center text-[9px] font-label font-bold uppercase tracking-widest text-[#a7abb2]/40">{day}</div>
            ))}
          </div>

          {/* Precision Grid Days */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarDays.map((day, i) => {
              const confirmedCount = appointments.filter((a: any) => isSameDay(parseISO(a.fecha), day) && a.status === 'confirmada').length;
              const isSelected = isSameDay(day, selectedDay);
              const isCurrMonth = isSameMonth(day, monthStart);
              const isTodayDay = isToday(day);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={clsx(
                    "relative aspect-square rounded-sm border transition-all duration-300 flex flex-col items-center justify-center gap-2 group/day",
                    isCurrMonth ? "cursor-pointer" : "opacity-5 pointer-events-none",
                    isSelected 
                      ? "bg-[#3b82f6] border-[#3b82f6] shadow-lg shadow-[#3b82f6]/20" 
                      : "bg-transparent border-[#1f262e] hover:border-[#3b82f6]/40",
                    isTodayDay && !isSelected && "bg-[#3b82f6]/5 border-[#3b82f6]/30"
                  )}
                >
                  <span className={clsx(
                    "text-lg font-heading font-black tracking-tighter leading-none",
                    isSelected ? "text-white" : isTodayDay ? "text-[#3b82f6]" : "text-[#eaeef6]"
                  )}>{format(day, 'd')}</span>
                  
                  {confirmedCount > 0 && (
                     <div className="flex gap-1">
                        {Array.from({ length: Math.min(confirmedCount, 3) }).map((_, dotIdx) => (
                           <div key={dotIdx} className={clsx("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-[#3b82f6]")} />
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
                    <button className="w-10 h-10 bg-[#1f262e] hover:bg-[#3b82f6] text-[#a7abb2] hover:text-white rounded-sm transition-all flex items-center justify-center border border-[#1a2027]">
                       <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* MISSION CRITICAL RECAP */}
        <div className="bg-white rounded-sm p-10 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-10">
            <div className="space-y-2">
               <p className="text-[10px] font-label font-bold uppercase tracking-widest text-[#0a0f14]/40">Métricas Mensuales</p>
               <div className="w-10 h-1 bg-[#3b82f6]/20" />
            </div>
            <div className="space-y-2">
               <p className="text-4xl font-heading font-black text-[#0a0f14] tracking-tight leading-none">
                  {appointments.filter((a: any) => a.status === 'confirmada').length}
               </p>
               <p className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-[#0a0f14]/30">Sesiones Verificadas</p>
            </div>
            <button className="w-full py-5 bg-[#0a0f14] text-white rounded-sm font-label font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-4 group/btn">
               Optimizar Calendario <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

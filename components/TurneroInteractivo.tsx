'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMES = ["09:00", "10:00", "11:00", "15:00", "16:00", "17:00", "18:00"];

export default function TurneroInteractivo() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [errorSlot, setErrorSlot] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [formData, setFormData] = useState({ nombre: '', email: '', whatsapp: '' });
  
  // NAVEGACIÓN DE CALENDARIO
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDayIdx = firstDay.getDay() - 1;
    if (startDayIdx === -1) startDayIdx = 6; 
    
    const days = [];
    for (let i = 0; i < startDayIdx; i++) {
        days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    return days;
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    const now = new Date();
    now.setDate(1);
    now.setHours(0,0,0,0);
    
    if (nextMonth < now) return;
    
    setCurrentMonth(nextMonth);
    setSelectedDate(null);
    setSelectedTime(null);
    setTakenSlots([]);
  };

  const fetchAvailability = useCallback(async (date: string) => {
    try {
      const resp = await fetch(`/api/appointments/availability?fecha=${date}`);
      const data = await resp.json();
      setTakenSlots(data.takenSlots || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  }, []);

  const handleNextStep = useCallback(async () => {
    if (!selectedDate || !selectedTime) return;
    
    setLoading(true);
    setErrorSlot(null);

    try {
      const resp = await fetch('/api/appointments/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: selectedDate,
          hora: selectedTime,
          sessionId
        })
      });

      if (resp.status === 409) {
        const data = await resp.json();
        setErrorSlot(data.error);
        fetchAvailability(selectedDate);
        setLoading(false);
        return;
      }

      setStep(2);
    } catch (err) {
      console.error('Error locking slot:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedTime, sessionId, fetchAvailability]);

  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const reserveResp = await fetch('/api/appointments/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          email: formData.email,
          phone: formData.whatsapp,
          fecha: selectedDate,
          hora: selectedTime,
          sessionId
        })
      });

      if (!reserveResp.ok) {
        const errorData = await reserveResp.json();
        throw new Error(errorData.error || 'Error al crear la reserva');
      }

      const { reservaId } = await reserveResp.json();

      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          email: formData.email,
          date: selectedDate,
          reservaId,
          monto: 5000
        })
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || 'Error en la pasarela de pago');
      }

      const data = await resp.json();

      // DEV: simular pago aprobado sin pasar por MP
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `/api/checkout/callback?status=success&reserva_id=${reservaId}&preference_id=${data.prefId}`;
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error('Booking Error:', err);
      alert(err.message || 'Ocurrió un error al procesar tu reserva.');
      setLoading(false);
    }
  }, [selectedDate, selectedTime, formData, sessionId]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col">

      <div className="flex-1 px-2">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6]">PASO 01</span>
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">FECHA Y HORA</h2>
                </div>
                
                <div className="flex items-center gap-4 bg-[#141a20] px-4 py-2 border border-[#1f262e] rounded-sm">
                  <button
                    onClick={() => changeMonth(-1)}
                    disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                    aria-label="Mes anterior"
                    className="p-1.5 hover:bg-white/5 disabled:opacity-5 disabled:cursor-not-allowed rounded-sm transition-colors text-white/40 hover:text-white"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-center min-w-[100px]">
                    <p className="text-[7px] font-bold uppercase tracking-widest text-[#43484e] mb-0.5">MES</p>
                    <p className="text-[11px] font-bold text-white uppercase tracking-tight">{currentMonth.toLocaleString('es', { month: 'long', year: 'numeric' }).toUpperCase()}</p>
                  </div>
                  <button onClick={() => changeMonth(1)} aria-label="Próximo mes" className="p-1.5 hover:bg-white/5 rounded-sm transition-colors text-white/40 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-7 text-center mb-1">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <span key={i} className="text-[8px] font-bold uppercase tracking-widest text-[#43484e]">{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5 relative min-h-[160px]">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentMonth.toISOString()}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="contents" // Use contents to keep grid layout
                    >
                      {calendarDays.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="p-2" />;
                        const dateStr = date.toISOString().split('T')[0];
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;
                        const isPassed = date < new Date(new Date().setHours(0,0,0,0));
                        const isSelected = selectedDate === dateStr;

                        return (
                          <motion.button
                            key={dateStr}
                            disabled={isPassed}
                            whileHover={!isPassed ? { backgroundColor: isSelected ? "#3b82f6" : "#1a2027" } : {}}
                            whileTap={!isPassed ? { scale: 0.95 } : {}}
                            onClick={() => {
                              setSelectedDate(dateStr);
                              fetchAvailability(dateStr);
                              setSelectedTime(null);
                            }}
                            className={`relative p-1.5 rounded-sm flex flex-col items-center justify-center transition-all duration-300 border ${
                              isSelected
                              ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10'
                              : isPassed ? 'bg-transparent border-transparent text-white/5 cursor-not-allowed'
                              : 'bg-[#1a2027]/20 border-white/5 text-[#a7abb2] hover:border-white/10'
                            }`}
                          >
                            <span className={`text-[10px] font-bold tracking-tighter leading-none ${isToday && !isSelected ? 'text-[#3b82f6]' : ''}`}>
                              {date.getDate()}
                            </span>
                            {isToday && !isSelected && <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#3b82f6] rounded-full" />}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-3">
                  <label className="flex items-center gap-3 eyebrow !text-[#3b82f6]/40 italic !text-[9px]">
                    <Clock className="w-3.5 h-3.5" /> HORARIOS DISPONIBLES
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {TIMES.map((time) => {
                      const isTaken = takenSlots.includes(time);
                      
                      // Validación: No permitir turnos en el pasado si es hoy
                      const isToday = new Date().toISOString().split('T')[0] === selectedDate;
                      let isPastTime = false;
                      
                      if (isToday) {
                        const now = new Date();
                        const [hours, minutes] = time.split(':').map(Number);
                        const slotTime = new Date();
                        slotTime.setHours(hours, minutes, 0, 0);
                        isPastTime = now > slotTime;
                      }

                      const isDisabled = isTaken || isPastTime;

                      return (
                        <motion.button
                          key={time}
                          disabled={isDisabled}
                          onClick={() => setSelectedTime(time)}
                          className={`relative py-2.5 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all duration-500 border overflow-hidden ${
                            selectedTime === time 
                            ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                            : isDisabled ? 'bg-transparent text-[#1f262e] border-[#1f262e] cursor-not-allowed line-through opacity-10'
                            : 'bg-[#1a2027]/20 border-white/5 text-[#a7abb2] hover:border-white/10'
                          }`}
                        >
                          <span className="relative z-10">{time}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {errorSlot && (
                <div className="flex items-center gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-sm text-[10px] font-bold uppercase tracking-widest text-red-500/80">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {errorSlot}
                </div>
              )}

              <button
                disabled={!selectedDate || !selectedTime || loading}
                onClick={handleNextStep}
                className="w-full mt-4 py-5 bg-[#3b82f6] disabled:bg-[#1f262e] disabled:text-[#43484e] text-white font-bold rounded-sm transition-all shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.3)] eyebrow !text-[10px] flex items-center justify-center gap-4 group overflow-hidden"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>RESERVAR TURNO <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                    <span className="eyebrow !text-[#3b82f6]">TUS DATOS</span>
                  </div>
                  <h2 className="heading-md">DATOS DE CONTACTO</h2>
                </div>
                <button onClick={() => setStep(1)} className="eyebrow !text-[9px] !text-white/20 hover:text-[#3b82f6] transition-colors flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> VOLVER
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { icon: User, placeholder: 'Nombre y Apellido', key: 'nombre', type: 'text' },
                  { icon: Mail, placeholder: 'Email de Contacto', key: 'email', type: 'email' },
                  { icon: Phone, placeholder: 'WhatsApp / Móvil', key: 'whatsapp', type: 'tel' }
                ].map((input) => (
                  <div key={input.key} className="relative group">
                    <input.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-[#3b82f6] transition-all duration-300" />
                    <input 
                      required type={input.type} placeholder={input.placeholder} 
                      value={formData[input.key as keyof typeof formData]}
                      onChange={e => setFormData({...formData, [input.key]: e.target.value})}
                      className="w-full pl-16 pr-6 py-5 bg-white/[0.02] rounded-sm outline-none border border-white/5 focus:border-[#3b82f6]/30 focus:bg-white/[0.04] transition-all duration-300 font-bold text-[#eaeef6] placeholder:text-white/10 text-xs uppercase tracking-widest" 
                    />
                  </div>
                ))}
              </div>

              <motion.button
                disabled={!formData.nombre || !formData.email.includes('@') || formData.whatsapp.length < 8}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="w-full py-6 bg-[#3b82f6] text-white font-bold rounded-sm transition-all shadow-[0_0_40px_rgba(59,130,246,0.1)] eyebrow !text-[10px] flex items-center justify-center gap-4 group disabled:opacity-20 disabled:cursor-not-allowed"
              >
                CONTINUAR <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="space-y-10"
            >
              <div className="bg-[#0e1419] border border-white/5 rounded-sm p-10 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <CheckCircle className="w-32 h-32 text-white" />
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="eyebrow !text-green-500">RESERVA LISTA</span>
                  </div>
                  <h2 className="heading-md !text-white leading-none">DATOS DE TU TURNO</h2>
                  <p className="body-text !text-sm mt-4">Confirmá los detalles para finalizar el proceso.</p>
                </div>

                <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8 relative z-10">
                   <div className="space-y-1">
                      <p className="eyebrow !text-[#43484e] !text-[8px]">FECHA</p>
                      <p className="heading-sm !text-lg !text-white">
                        {new Date(selectedDate || '').toLocaleDateString('es', { day: 'numeric', month: 'long' }).toUpperCase()}
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="eyebrow !text-[#43484e] !text-[8px]">HORARIO</p>
                      <p className="heading-sm !text-lg !text-white">{selectedTime}HS</p>
                   </div>
                   <div className="col-span-full pt-4">
                      <p className="eyebrow !text-[#43484e] !text-[8px]">PACIENTE</p>
                      <p className="heading-sm !text-lg !text-white uppercase">{formData.nombre}</p>
                   </div>
                </div>

                <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 shadow-[0_0_40px_rgba(59,130,246,0.05)]">
                  <div className="space-y-1 min-w-0">
                    <p className="eyebrow !text-[#3b82f6] !text-[8px]">SEÑA</p>
                    <p className="body-text !text-[10px] !text-[#3b82f6]/40 uppercase tracking-widest">Pago para confirmar el compromiso</p>
                  </div>
                  <p className="stat-val !text-3xl text-white italic tracking-tighter shrink-0">$5.000</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-5 border border-white/10 text-white/30 eyebrow !text-[9px] hover:text-white hover:bg-white/5 transition-all">
                   CORREGIR
                </button>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-[2] py-5 bg-[#3b82f6] text-white font-bold rounded-sm transition-all shadow-[0_0_60px_rgba(59,130,246,0.1)] hover:bg-[#2563eb] eyebrow !text-[10px] flex items-center justify-center gap-4 group"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "RESERVAR Y PAGAR"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

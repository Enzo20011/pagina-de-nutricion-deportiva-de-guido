'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, User, Mail, Phone, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx } from 'clsx';

// ─── TIME SLOT SKELETON ──────────────────────────────────────────────────────
function TimeSlotSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full max-w-lg">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="relative h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/5"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', delay: i * 0.1 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── STEP PROGRESS BAR ───────────────────────────────────────────────────────
const STEPS = [
  { title: 'Fecha', icon: <CalendarIcon className="w-4 h-4" /> },
  { title: 'Horario', icon: <Clock className="w-4 h-4" /> },
  { title: 'Datos', icon: <User className="w-4 h-4" /> },
  { title: 'Pago', icon: <CreditCard className="w-4 h-4" /> },
];

function WizardProgress({ step }: { step: number }) {
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.03] backdrop-blur-md space-y-5">
      {/* Animated fill bar */}
      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accentBlue via-blue-400 to-accentBlue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
        {/* Glow pulse */}
        <motion.div
          className="absolute inset-y-0 bg-white/50 w-8 blur-sm rounded-full"
          animate={{ left: [`${progress - 4}%`, `${progress + 2}%`, `${progress - 4}%`] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const isCompleted = step > i + 1;
          const isActive = step === i + 1;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted ? '#3b82f6' : isActive ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  borderColor: isCompleted ? '#3b82f6' : isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.6)' : 'none',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <span className={isActive ? 'text-white' : 'text-white/20'}>{s.icon}</span>
                )}
              </motion.div>
              <motion.span
                animate={{ opacity: isActive ? 1 : 0.25, y: isActive ? 0 : 2 }}
                className="hidden lg:block text-[9px] font-black uppercase tracking-[0.25em] text-white whitespace-nowrap"
              >
                {s.title}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TurneroModerno = () => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [sessionId] = useState(() => typeof window !== 'undefined' ? (window as any).crypto?.randomUUID() : 'ssr-session');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const nextMonths = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return {
        id: d.getMonth(),
        year: d.getFullYear(),
        name: format(d, 'MMMM', { locale: es }),
        date: d
      };
    });
  }, []);

  const daysInMonth = useMemo(() => {
    if (!date) return [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: totalDays }).map((_, i) => {
      return new Date(year, month, i + 1);
    });
  }, [date]);

  const handleNext = async () => {
    if (step === 1) {
      if (!date || !selectedTime) { /* wait, selectedTime is in step 2 */ }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!date || !selectedTime) return;
      setLoadingSlots(true);
      try {
        const res = await fetch('/api/appointments/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fecha: format(date, 'yyyy-MM-dd'), 
            hora: selectedTime, 
            sessionId 
          }),
        });
        if (!res.ok) {
           const err = await res.json();
           alert(err.error || 'Error al bloquear turno');
           return;
        }
        setStep(3);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
      return;
    }

    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 1. Create the Reservation Draft
      const reserveRes = await fetch('/api/appointments/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData, // name, email, phone
          fecha: format(date!, 'yyyy-MM-dd'),
          hora: selectedTime,
          sessionId
        }),
      });

      if (!reserveRes.ok) {
        const err = await reserveRes.json();
        alert(err.error || 'Error al crear reserva');
        setLoading(false);
        return;
      }

      const { reservaId } = await reserveRes.json();

      // 2. Initiate Checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date: format(date!, 'yyyy-MM-dd'),
          reservaId,
          monto: 5000 // Seña
        }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.json();
        alert(err.error || 'Error en pasarela de pago');
        setLoading(false);
        return;
      }

      const { url } = await checkoutRes.json();
      
      // 3. Redirect to Simulation / Payment
      window.location.href = url;

    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-5 py-4 rounded-2xl border-2 border-white/5 focus:border-accentBlue focus:outline-none transition-all duration-300 bg-white/5 text-white placeholder:text-white/20";

  return (
    <div className="w-full text-white relative overflow-hidden rounded-[3rem]">
      {/* Subtle Nutritional Background for Turnero */}
      <div className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none">
        <img 
          src="/assets/wellness-foods.png" 
          alt="" 
          className="w-full h-full object-cover blur-sm" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-darkNavy/40 via-transparent to-darkNavy/40 -z-10" />

      {/* ── ANIMATED PROGRESS HEADER ── */}
      {step <= 4 && <WizardProgress step={step} />}

      <div className="p-10 relative z-10">
        <AnimatePresence mode="wait">

          {/* STEP 1 — Fecha (Rediseñado Avanzado) */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full max-w-2xl mx-auto flex flex-col items-center"
            >
              <div className="text-center mb-10">
                <h4 className="text-4xl font-black mb-3 italic tracking-tight uppercase leading-none">
                  Elige tu <span className="text-accentBlue not-italic">Momento.</span>
                </h4>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Protocolo de Reserva Avanzado</p>
              </div>

              {/* ── CUSTOM MONTH SELECTOR ── */}
              <div className="flex justify-center gap-8 mb-12 border-b border-white/5 pb-6 w-full overflow-x-auto no-scrollbar">
                {nextMonths.map((m) => {
                  const isSelected = date?.getMonth() === m.id && date?.getFullYear() === m.year;
                  return (
                    <button
                      key={`${m.year}-${m.id}`}
                      onClick={() => {
                        const newDate = new Date(m.year, m.id, 1);
                        setDate(newDate);
                      }}
                      className={clsx(
                        "relative px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                        isSelected ? "text-white" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      {m.name}
                      {isSelected && (
                        <motion.div
                          layoutId="monthUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accentBlue shadow-[0_4px_12px_rgba(59,130,246,0.6)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── CUSTOM DAY GRID ── */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 w-full mb-12">
                {daysInMonth.map((d, i) => {
                  const day = d.getDate();
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  const isPast = d < today;
                  const isToday = d.getTime() === today.getTime();
                  const isSelected = date?.getDate() === day && date?.getMonth() === d.getMonth();
                  const dayName = format(d, 'EEE', { locale: es });

                  return (
                    <motion.button
                      key={i}
                      whileHover={!isPast ? { y: -4, scale: 1.05 } : {}}
                      onClick={() => !isPast && setDate(d)}
                      disabled={isPast}
                      className={clsx(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all relative overflow-hidden group",
                        isSelected 
                          ? "bg-accentBlue border-accentBlue shadow-[0_15px_30px_rgba(59,130,246,0.3)]" 
                          : "bg-white/5 border-white/5 hover:border-white/10",
                        isPast && "opacity-10 cursor-not-allowed grayscale"
                      )}
                    >
                      {isSelected && (
                        <motion.div 
                          layoutId="daySelectedGlow"
                          className="absolute inset-0 bg-white/10 blur-xl opacity-50"
                        />
                      )}
                      <span className={clsx(
                        "text-[9px] font-black uppercase tracking-widest mb-1 transition-colors",
                        isSelected ? "text-white/80" : "text-white/20 group-hover:text-white/40"
                      )}>
                        {dayName}
                      </span>
                      <span className={clsx(
                        "text-xl font-black italic tracking-tighter transition-colors",
                        isSelected ? "text-white" : "text-white/40 group-hover:text-white"
                      )}>
                        {day}
                      </span>
                      {isToday && !isSelected && (
                        <div className="absolute bottom-2 w-1 h-1 bg-accentBlue rounded-full shadow-[0_0_8px_#3b82f6]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={handleNext}
                  disabled={!date}
                  className="w-full bg-white text-darkNavy font-black px-12 py-5 rounded-full flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-[0_30px_60px_rgba(255,255,255,0.1)] relative overflow-hidden group"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-accentBlue/20 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="uppercase tracking-[0.2em] text-[11px]">Siguiente Paso</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Horario con Skeleton Loader */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <h4 className="text-2xl font-bold mb-2 text-center">Horarios para el <span className="text-accentBlue">{date ? format(date, "d 'de' MMMM", { locale: es }) : ''}</span></h4>
              <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-10">GMT-3 (Argentina)</p>

              {/* ── SKELETON or TIME SLOTS ── */}
              <AnimatePresence mode="wait">
                {loadingSlots ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TimeSlotSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    key="slots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full max-w-lg"
                  >
                    {timeSlots.map((time, i) => (
                      <motion.button
                        key={time}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedTime(time)}
                        className={clsx(
                          "py-4 rounded-2xl font-black text-sm transition-all border-2",
                          selectedTime === time
                            ? "bg-accentBlue border-accentBlue text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105"
                            : "bg-white/5 border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                        )}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex space-x-4 mt-12 w-full max-w-lg">
                <button onClick={handleBack} className="flex-1 px-8 py-5 border-2 border-white/5 rounded-full font-bold text-white/30 hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-5 h-5 inline mr-1" />Volver
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedTime}
                  className="flex-[2] bg-white text-navy px-12 py-5 rounded-full font-black flex items-center justify-center space-x-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-2xl"
                >
                  <span>Siguiente</span><ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Datos */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 max-w-md mx-auto"
            >
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-2">Tus Datos de <span className="text-accentBlue">Contacto</span></h4>
                <p className="text-white/40 text-xs uppercase tracking-widest font-black">Información de Seguimiento</p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />, type: 'text', placeholder: 'Nombre Completo', field: 'name' },
                  { icon: <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />, type: 'email', placeholder: 'Tu Email', field: 'email' },
                  { icon: <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />, type: 'tel', placeholder: 'WhatsApp', field: 'phone' },
                ].map(({ icon, type, placeholder, field }) => (
                  <div key={field} className="relative">
                    {icon}
                    <input
                      type={type}
                      placeholder={placeholder}
                      className={clsx(inputStyles, "pl-14")}
                      value={(formData as any)[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex space-x-4 pt-4">
                <button onClick={handleBack} className="flex-1 px-8 py-5 border-2 border-white/5 rounded-full font-bold text-white/30 hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-5 h-5 inline mr-1" />Volver
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.email || !formData.phone}
                  className="flex-[2] bg-white text-navy px-12 py-5 rounded-full font-black flex items-center justify-center space-x-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-2xl"
                >
                  <span>Siguiente</span><ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Confirmar */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-sm mx-auto"
            >
              <h4 className="text-3xl font-black mb-8 italic tracking-tighter">Confirmá tu <span className="text-accentBlue">Reserva</span></h4>
              <div className="bg-white/5 rounded-[2.5rem] p-10 mb-10 text-left space-y-6 border border-white/10 shadow-2xl">
                <div className="space-y-4">
                  {[
                    { label: 'Fecha', value: date ? format(date, 'EEEE d MMMM', { locale: es }) : '-' },
                    { label: 'Horario', value: selectedTime ? `${selectedTime} hs` : '-' },
                    { label: 'Paciente', value: formData.name },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                      <span className="font-bold text-white truncate ml-4">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <span className="block text-white/30 text-[9px] font-black uppercase tracking-[0.1em] mb-1">Seña Requerida</span>
                    <span className="text-4xl font-black text-white tracking-tighter">$5.000</span>
                  </div>
                  <div className="bg-[#3b82f6]/10 text-[#3b82f6] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#3b82f6]/20">
                    Garantizado
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button onClick={handleBack} className="flex-1 px-6 py-5 border-2 border-white/5 rounded-full font-bold text-white/30 hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-5 h-5 inline mr-1" />Volver
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-[2] bg-accentBlue text-white py-5 rounded-full font-black text-sm shadow-[0_15px_30px_rgba(59,130,246,0.3)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-30"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><CreditCard className="w-5 h-5" /><span>Confirmar y Pagar</span></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Éxito */}
          {step === 5 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-28 h-28 bg-[#3b82f6]/10 text-[#3b82f6] rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-[#3b82f6]/20"
              >
                <CheckCircle2 className="w-14 h-14" />
              </motion.div>
              <h4 className="text-4xl font-black text-white mb-4 tracking-tighter italic">¡Turno Reservado!</h4>
              <p className="text-slate-400 mb-12 max-w-xs mx-auto text-xl font-medium">
                Excelente, <span className="text-white font-black underline decoration-accentBlue decoration-4 underline-offset-4">{formData.name}</span>. Todo listo.
              </p>
              <div className="bg-white/5 p-8 rounded-[2rem] mb-12 inline-block px-12 border border-white/5">
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mb-4">Detalles de la Cita</p>
                <p className="font-bold text-white text-3xl tracking-tighter">{date ? format(date, "d 'de' MMMM", { locale: es }) : ''}</p>
                <p className="text-accentBlue font-black text-xl mt-2 tracking-widest uppercase">{selectedTime} HS</p>
              </div>
              <br />
              <button
                onClick={() => { setStep(1); setSelectedTime(null); }}
                className="bg-white text-navy px-12 py-5 rounded-full font-black hover:scale-105 transition-all shadow-2xl uppercase tracking-widest text-xs"
              >
                Volver al Panel
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default TurneroModerno;

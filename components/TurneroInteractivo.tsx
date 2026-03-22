'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles
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

  const fetchAvailability = async (date: string) => {
    try {
      const resp = await fetch(`/api/appointments/availability?fecha=${date}`);
      const data = await resp.json();
      setTakenSlots(data.takenSlots || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });

  const handleNextStep = async () => {
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
        fetchAvailability(selectedDate); // Refresh slots
        setLoading(false);
        return;
      }

      setStep(2);
    } catch (err) {
      console.error('Error locking slot:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: selectedDate,
          hora: selectedTime,
          paciente: formData.nombre,
          email: formData.email,
          whatsapp: formData.whatsapp,
          sessionId // Pass session to match the lock
        })
      });
      const data = await resp.json();
      window.location.href = data.url; // Modified from data.init_point to data.url to match mock/real checkout
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col">
      {/* MINIMAL STEP INDICATOR */}
      <div className="flex gap-2 mb-8 px-2">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 space-y-3">
             <div className={`h-1 rounded-full transition-all duration-1000 ${step >= num ? 'bg-accentBlue shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`} />
             <span className={`text-[8px] font-black uppercase tracking-[0.3em] block text-center ${step === num ? 'text-accentBlue' : 'text-white/10'}`}>
               Fase 0{num}
             </span>
          </div>
        ))}
      </div>

      <div className="flex-1 px-2">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div>
                <label className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">
                  <CalendarIcon className="w-4 h-4 text-accentBlue" /> 1. Elegir Fecha
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        fetchAvailability(date);
                        setSelectedTime(null);
                        setErrorSlot(null);
                      }}
                      className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border ${
                        selectedDate === date 
                        ? 'bg-accentBlue border-accentBlue text-white' 
                        : 'bg-white/5 border-white/5 text-bone/40 hover:border-white/20'
                      }`}
                    >
                      <span className="text-[8px] uppercase font-black opacity-40 mb-1">
                        {new Date(date).toLocaleDateString('es', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-black tracking-tighter">
                        {new Date(date).getDate()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">
                    <Clock className="w-4 h-4 text-accentBlue" /> 2. Elegir Horario
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIMES.map((time) => {
                      const isTaken = takenSlots.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isTaken}
                          onClick={() => {
                            setSelectedTime(time);
                            setErrorSlot(null);
                          }}
                          className={`py-4 rounded-xl font-bold text-sm transition-all duration-300 border ${
                            selectedTime === time 
                            ? 'bg-white text-darkNavy border-white shadow-xl scale-105' 
                            : isTaken 
                              ? 'bg-white/5 text-white/5 border-white/5 cursor-not-allowed line-through opacity-30 shadow-none'
                              : 'bg-white/5 text-bone/40 hover:bg-white/10 border-white/5'
                          }`}
                        >
                          {time}hs
                        </button>
                      );
                    })}
                  </div>
                  {errorSlot && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="mt-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse"
                    >
                      <AlertCircle className="w-4 h-4" /> {errorSlot}
                    </motion.div>
                  )}
                </motion.div>
              )}

              <button
                disabled={!selectedDate || !selectedTime || loading}
                onClick={handleNextStep}
                className="w-full mt-8 py-6 bg-white disabled:bg-white/5 disabled:text-white/10 text-darkNavy font-black rounded-2xl transition-all shadow-xl hover:bg-accentBlue hover:text-white uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continuar reserva <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button onClick={() => setStep(1)} className="text-[10px] font-black text-accentBlue flex items-center gap-2 uppercase tracking-[0.3em] mb-10 hover:opacity-60 transition-opacity">
                <ChevronLeft className="w-4 h-4" /> Volver a disponibilidad
              </button>

              <div className="space-y-4">
                {[
                  { icon: User, placeholder: 'Nombre Completo', key: 'nombre', type: 'text' },
                  { icon: Mail, placeholder: 'Tu Email', key: 'email', type: 'email' },
                  { icon: Phone, placeholder: 'WhatsApp / Móvil', key: 'whatsapp', type: 'tel' }
                ].map((input) => (
                  <div key={input.key} className="relative group">
                    <input.icon className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-accentBlue transition-colors" />
                    <input 
                      required 
                      type={input.type} 
                      placeholder={input.placeholder} 
                      value={formData[input.key as keyof typeof formData]}
                      onChange={e => setFormData({...formData, [input.key]: e.target.value})}
                      className="w-full pl-16 pr-8 py-6 bg-slate-950 rounded-[2rem] outline-none border border-white/5 focus:border-accentBlue/30 transition-all font-bold text-white placeholder:text-white/10" 
                    />
                  </div>
                ))}
              </div>

              <button
                disabled={!formData.nombre || !formData.email || !formData.whatsapp}
                onClick={() => setStep(3)}
                className="w-full mt-8 py-6 bg-white text-darkNavy font-black rounded-2xl transition-all shadow-xl hover:bg-accentBlue hover:text-white uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                Revisar selección <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <header className="text-center space-y-4">
                <div className="w-20 h-20 bg-accentBlue/10 rounded-full flex items-center justify-center mx-auto border border-accentBlue/20">
                   <CheckCircle className="w-10 h-10 text-accentBlue" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Confirmación</h3>
                  <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.4em]">Resumen de tu selección</p>
                </div>
              </header>

              <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] space-y-8 border border-white/5 shadow-[inner_0_0_40px_rgba(0,0,0,0.5)]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                    <span>Sincronización</span>
                    <span className="text-accentBlue">Activa</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{new Date(selectedDate || '').toLocaleDateString('es', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xl font-black text-accentBlue italic">{selectedTime}HS</p>
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{formData.nombre}</p>
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="bg-white p-8 rounded-[2.5rem] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] group hover:scale-[1.02] transition-transform">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-darkNavy/40">Seña de Compromiso</p>
                    <p className="text-[9px] font-bold text-darkNavy/20 uppercase">Bloqueo inmediato del turno</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black tracking-tighter text-accentBlue">$2.500</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-7 bg-white/5 rounded-[2.5rem] border border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-accentBlue/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-accentBlue" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Protocolo Anti-Ausencias</p>
                   <p className="text-[10px] text-white/30 font-medium leading-relaxed italic">
                     Para garantizar la excelencia en la atención, el turno se confirma únicamente tras el pago de la seña. Si no se completa la transacción, el horario permanecerá disponible para otros pacientes.
                   </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-accentBlue/5 rounded-[2rem] border border-accentBlue/10">
                <AlertCircle className="w-5 h-5 text-accentBlue mt-1 shrink-0" />
                <p className="text-[11px] text-white/40 font-bold leading-relaxed italic">
                  El sistema bloqueará el turno automáticamente al confirmar el pago. Recibirás las instrucciones en tu email.
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-6 bg-transparent border border-white/10 text-white/20 font-black rounded-[2rem] uppercase tracking-widest text-[10px] hover:text-white transition-all">
                  Corregir
                </button>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-[2.5] py-7 bg-accentBlue text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-accentBlue/20 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 group"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Confirmar en Mercado Pago</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

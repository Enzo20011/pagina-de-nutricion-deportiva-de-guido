'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulación de disponibilidad de DB interna
const MOCK_AVAILABILITY: Record<string, string[]> = {
  '2026-03-20': ['09:00', '10:00', '11:30', '15:00', '16:30'],
  '2026-03-21': ['10:00', '11:00', '14:00', '17:00'],
  '2026-03-23': ['09:00', '10:30', '15:00', '18:00'],
};

export default function TurneroNativo() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fecha: selectedDate,
          hora: selectedTime
        })
      });
      
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-transparent rounded-[3rem] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Progress Bar */}
      <div className="h-1 bg-white/5 flex">
        <motion.div 
          className="bg-blue-600 h-full shadow-[0_0_20px_rgba(37,99,235,0.8)]"
          animate={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-8 lg:p-14">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-black text-white flex items-center gap-3 italic tracking-tighter">
                  <CalendarIcon className="text-blue-500 w-8 h-8" /> Seleccioná Fecha
                </h3>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Slots en tiempo real</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.keys(MOCK_AVAILABILITY).map(date => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
                    className={`p-5 rounded-2xl border transition-all flex items-center justify-between group px-8 ${
                      selectedDate === date 
                      ? 'border-blue-500/30 bg-blue-500/5' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                    }`}
                  >
                    <span className={`text-sm font-medium tracking-tight ${selectedDate === date ? 'text-blue-400' : 'text-white/50'}`}>
                      {new Date(date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    {selectedDate === date ? <CheckCircle2 className="w-4 h-4 text-blue-500" /> : <div className="w-4 h-4 rounded-full border border-white/10" />}
                  </button>
                ))}
              </div>

              {selectedDate && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Horarios Disponibles</p>
                  <div className="grid grid-cols-3 gap-3">
                    {MOCK_AVAILABILITY[selectedDate].map((time, idx) => (
                      <motion.button
                        key={time}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedTime(time)}
                        className={`py-5 rounded-2xl font-black text-[10px] transition-all tracking-widest ${
                          selectedTime === time 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06] border border-white/5'
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={handleNext}
                className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-700 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-4"
              >
                Continuar <ArrowRight className="w-5 h-5" />
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
               <button onClick={handleBack} className="text-blue-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                <ChevronLeft className="w-4 h-4" /> Fecha
              </button>

              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-black text-white flex items-center gap-3 italic tracking-tighter">
                  <User className="text-blue-500 w-8 h-8" /> Tus Datos
                </h3>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Para el recordatorio automático</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: User, key: 'nombre', placeholder: 'Nombre completo' },
                  { icon: Mail, key: 'email', placeholder: 'Email institucional' },
                  { icon: Phone, key: 'telefono', placeholder: 'WhatsApp de contacto' },
                ].map((input) => (
                  <div key={input.key} className="relative group">
                    <input.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/5 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type={input.key === 'email' ? 'email' : 'text'} 
                      placeholder={input.placeholder}
                      className="w-full pl-16 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-2xl focus:border-blue-500/30 focus:bg-white/[0.02] outline-none transition-all font-medium text-sm text-white placeholder:text-white/10"
                      value={(formData as any)[input.key]}
                      onChange={e => setFormData({...formData, [input.key]: e.target.value})}
                    />
                  </div>
                ))}
              </div>

              <button
                disabled={!formData.nombre || !formData.email || !formData.telefono}
                onClick={handleNext}
                className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-700 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-4"
              >
                Revisar Reserva <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <button onClick={handleBack} className="text-blue-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                <ChevronLeft className="w-4 h-4" /> Editar datos
              </button>

              <div className="bg-blue-600/5 p-8 rounded-3xl border border-blue-500/20 text-white space-y-6 relative overflow-hidden">
                <div className="space-y-1">
                  <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">Protocolo de Turno</p>
                  <h4 className="text-3xl font-serif font-black italic tracking-tighter">{formData.nombre.split(' ')[0]}</h4>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-white/20 text-[8px] uppercase font-black tracking-widest">Compromiso Agendado</p>
                    <p className="font-medium text-[11px]">{selectedDate} @ {selectedTime}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Inversión (Seña)</p>
                   <p className="text-3xl font-serif font-black italic">$5.000</p>
                </div>
              </div>

              <div className="space-y-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-8 bg-white text-darkNavy hover:bg-accentBlue hover:text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-darkNavy/20 border-t-darkNavy rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirmar Reserva <CreditCard className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

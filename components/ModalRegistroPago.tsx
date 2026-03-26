'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, User, CreditCard, Calendar as CalendarIcon, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetodoPago, CategoriaPago } from '../types/finance';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalRegistroPago({ onClose, onSuccess }: Props) {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pacienteId: '',
    monto: '',
    metodo: MetodoPago.EFECTIVO,
    categoria: CategoriaPago.CONSULTA,
    concepto: 'Consulta Nutricional',
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetch('/api/pacientes')
      .then(r => r.json())
      .then(data => setPacientes(data?.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/finance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, monto: Number(form.monto) })
      });
      if (res.ok) onSuccess();
    } catch (err) {
      console.error('Error registrando pago:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(p =>
    `${p.nombre} ${p.apellido || ''}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inputClass = "w-full bg-[#0e1419] border border-[#1f262e] rounded-sm py-3.5 text-white text-sm font-bold focus:border-[#3b82f6]/50 focus:outline-none transition-colors placeholder:text-[#43484e]";
  const labelClass = "text-[#a7abb2] font-bold text-[9px] uppercase tracking-[0.25em]";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative z-10 w-full sm:max-w-lg bg-[#0a0f14] border border-[#1f262e] sm:rounded-sm shadow-2xl overflow-hidden rounded-t-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f262e] bg-[#0e1419]">
          <div>
            <h2 className="text-base font-heading font-black text-white uppercase tracking-tight">
              Registrar <span className="text-[#3b82f6]">Cobro</span>
            </h2>
            <p className="text-[#a7abb2] font-label text-[9px] uppercase tracking-[0.25em] mt-0.5">
              Ingreso Manual de Efectivo / Otros
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 flex items-center justify-center bg-[#1f262e] hover:bg-[#2a333d] rounded-sm text-[#a7abb2] hover:text-white transition-colors border border-[#1a2027]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* PACIENTE */}
          <div className="space-y-2">
            <label className={labelClass}>Seleccionar Paciente</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3b82f6]" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setForm({ ...form, pacienteId: '' }); }}
                className={`${inputClass} pl-11 pr-4`}
              />
              {busqueda && filteredPacientes.length > 0 && !form.pacienteId && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e1419] border border-[#1f262e] rounded-sm shadow-xl z-50 max-h-48 overflow-y-auto">
                  {filteredPacientes.slice(0, 6).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, pacienteId: p.id });
                        setBusqueda(`${p.nombre} ${p.apellido || ''}`);
                      }}
                      className="w-full text-left px-4 py-3 text-white text-sm font-bold hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] transition-colors border-b border-[#1f262e] last:border-none flex items-center gap-3"
                    >
                      <User className="w-3.5 h-3.5 opacity-40 shrink-0" />
                      <span className="text-[11px] font-label uppercase tracking-widest">{p.nombre} {p.apellido || ''}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MONTO + CATEGORÍA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Monto ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                <input
                  type="number"
                  required
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  placeholder="0.00"
                  className={`${inputClass} pl-11 pr-4 text-[#22c55e]`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Categoría</label>
              <div className="relative">
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaPago })}
                  title="Categoría de pago"
                  className={`${inputClass} px-4 pr-10 appearance-none`}
                >
                  {Object.values(CategoriaPago).map(cat => (
                    <option key={cat} value={cat} className="bg-[#0e1419]">{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#43484e] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* MÉTODO + FECHA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Método de Pago</label>
              <div className="relative">
                <select
                  value={form.metodo}
                  onChange={(e) => setForm({ ...form, metodo: e.target.value as MetodoPago })}
                  title="Método de pago"
                  className={`${inputClass} px-4 pr-10 appearance-none`}
                >
                  {Object.values(MetodoPago).map(m => (
                    <option key={m} value={m} className="bg-[#0e1419]">{m}</option>
                  ))}
                </select>
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#43484e] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Fecha</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3b82f6]" />
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  title="Fecha del pago"
                  className={`${inputClass} pl-11 pr-4`}
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || !form.pacienteId || !form.monto}
            className="w-full py-4 bg-[#3b82f6] hover:bg-[#3b82f6]/90 disabled:bg-[#1f262e] disabled:text-[#43484e] text-white rounded-sm font-label font-black uppercase text-[10px] tracking-[0.25em] transition-colors shadow-lg shadow-[#3b82f6]/10 flex items-center justify-center gap-3 mt-2"
          >
            {loading ? (
              <span className="animate-pulse">Procesando...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Sincronizar Ingreso
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

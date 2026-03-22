'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  User, 
  CreditCard, 
  Calendar as CalendarIcon, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
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
    const fetchPacientes = async () => {
      try {
        const res = await fetch('/api/pacientes');
        const data = await res.json();
        setPacientes(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };
    fetchPacientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/finance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monto: Number(form.monto)
        })
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error registrando pago:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-darkNavy/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl bg-cardDark border border-white/10 rounded-[3.5rem] shadow-3xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-accentBlue/10 p-10 flex justify-between items-center border-b border-white/5">
           <div>
             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Registrar <span className="text-accentBlue">Cobro</span></h2>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Ingreso Manual de Efectivo / Otros</p>
           </div>
           <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all">
             <X className="w-6 h-6" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          {/* PACIENTE */}
          <div className="space-y-4">
            <label className="text-slate-500 font-black uppercase text-xs tracking-widest pl-2">Seleccionar Paciente</label>
            <div className="relative group">
               <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accentBlue" />
               <input 
                 type="text" 
                 placeholder="Buscar paciente..."
                 value={busqueda}
                 onChange={(e) => setBusqueda(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-white font-bold focus:border-accentBlue/50 focus:ring-4 focus:ring-accentBlue/10 transition-all outline-none"
               />
               
               {busqueda && filteredPacientes.length > 0 && !form.pacienteId && (
                 <div className="absolute top-full left-0 right-0 mt-4 bg-darkNavy border border-white/10 rounded-3xl p-4 shadow-2xl z-50 max-h-60 overflow-y-auto overflow-hidden">
                    {filteredPacientes.slice(0, 5).map(p => (
                      <button 
                        key={p._id}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, pacienteId: p._id });
                          setBusqueda(p.nombre);
                        }}
                        className="w-full text-left p-4 hover:bg-accentBlue/10 rounded-2xl text-white font-bold transition-all border border-transparent hover:border-accentBlue/20"
                      >
                        {p.nombre}
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MONTO */}
            <div className="space-y-4">
              <label className="text-slate-500 font-black uppercase text-xs tracking-widest pl-2 font-sans">Monto ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 font-sans" />
                <input 
                  type="number" 
                  required
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-white text-2xl font-black italic focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* CATEGORIA */}
            <div className="space-y-4">
              <label className="text-slate-500 font-black uppercase text-xs tracking-widest pl-2">Categoría</label>
              <div className="relative">
                <select 
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaPago })}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-white font-bold appearance-none focus:border-accentBlue/50 transition-all outline-none"
                >
                  {Object.values(CategoriaPago).map(cat => (
                    <option key={cat} value={cat} className="bg-darkNavy">{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* METODO */}
            <div className="space-y-4">
              <label className="text-slate-500 font-black uppercase text-xs tracking-widest pl-2">Método de Pago</label>
              <div className="relative">
                <select 
                  value={form.metodo}
                  onChange={(e) => setForm({ ...form, metodo: e.target.value as MetodoPago })}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-white font-bold appearance-none focus:border-accentBlue/50 transition-all outline-none"
                >
                  {Object.values(MetodoPago).map(m => (
                    <option key={m} value={m} className="bg-darkNavy">{m}</option>
                  ))}
                </select>
                <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* FECHA */}
            <div className="space-y-4">
              <label className="text-slate-500 font-black uppercase text-xs tracking-widest pl-2">Fecha</label>
              <div className="relative">
                <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accentBlue" />
                <input 
                  type="date" 
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-16 text-white font-bold focus:border-accentBlue/50 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !form.pacienteId || !form.monto}
            className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-white rounded-[2rem] font-black uppercase text-lg tracking-[0.2em] italic transition-all shadow-2xl flex items-center justify-center gap-4 group"
          >
            {loading ? 'Procesando...' : (
              <>
                <CheckCircle2 className="w-6 h-6 group-hover:scale-125 transition-transform" />
                Sincronizar Ingreso
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

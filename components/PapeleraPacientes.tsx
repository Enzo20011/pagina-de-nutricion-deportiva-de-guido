'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, RotateCcw, X, AlertTriangle, Search, UserX } from 'lucide-react';

interface PacienteArchivado {
  _id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  updatedAt: string;
}

interface Props {
  onClose: () => void;
  onRestored: () => void;
}

export default function PapeleraPacientes({ onClose, onRestored }: Props) {
  const [archivados, setArchivados] = useState<PacienteArchivado[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivados();
  }, []);

  const fetchArchivados = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pacientes?includeDeleted=true&limit=1000');
      const json = await res.json();
      const arrayData: PacienteArchivado[] = Array.isArray(json) ? json : (json.data || []);
      // Only show the deleted ones
      setArchivados(arrayData.filter((p: any) => p.isDeleted === true));
    } catch (err) {
      console.error('Error fetching archivados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    setRestoring(id);
    try {
      const res = await fetch(`/api/pacientes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restore: true }),
      });
      if (res.ok) {
        setArchivados(prev => prev.filter(p => p._id !== id));
        onRestored();
      }
    } catch (err) {
      console.error('Error restaurando paciente:', err);
    } finally {
      setRestoring(null);
    }
  };

  const filtrados = archivados.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-darkNavy/85 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-2xl bg-cardDark border border-white/10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-amber-400/5">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-amber-400/15 rounded-[1.5rem] border border-amber-400/25">
              <Archive className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                Pacientes <span className="text-amber-400">Archivados</span>
              </h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">
                Historial clínico preservado por ley — recuperación disponible
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEGAL NOTICE */}
        <div className="mx-10 mt-8 p-5 bg-amber-400/8 border border-amber-400/20 rounded-3xl flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300/80 text-sm font-bold leading-relaxed">
            Los pacientes archivados <span className="text-amber-400">no se eliminan de la base de datos</span>. 
            Sus historias clínicas, dietas y consultas permanecen intactas por cumplimiento legal.
          </p>
        </div>

        {/* SEARCH */}
        <div className="px-10 mt-6">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar en archivados..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white font-bold focus:border-amber-400/40 outline-none transition-all"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="p-10 space-y-4 max-h-[40vh] overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                {archivados.length === 0 ? 'No hay pacientes archivados' : 'Sin resultados para tu búsqueda'}
              </p>
            </div>
          ) : (
            filtrados.map(p => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-amber-400/20 transition-all group"
              >
                <div>
                  <div className="text-white font-black uppercase italic tracking-tight">
                    {p.apellido}, {p.nombre}
                  </div>
                  <div className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                    {p.email || 'Sin email'} • Archivado el {new Date(p.updatedAt).toLocaleDateString('es-AR')}
                  </div>
                </div>
                <button
                  onClick={() => handleRestore(p._id)}
                  disabled={restoring === p._id}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 hover:border-amber-400/40 text-amber-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                >
                  <RotateCcw className={`w-4 h-4 ${restoring === p._id ? 'animate-spin' : ''}`} />
                  {restoring === p._id ? 'Restaurando...' : 'Restaurar'}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

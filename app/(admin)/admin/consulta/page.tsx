'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, User, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { useQuery } from '@tanstack/react-query';

export default function ConsultaIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pacientes_lista_maestra', searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/pacientes?page=1&limit=50&search=${searchQuery}`);
      if (!res.ok) throw new Error('Error de red');
      return res.json();
    }
  });

  const pacientes = data?.data || [];

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 text-[#eaeef6] selection:bg-white/5 pb-20 p-6 md:p-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#3b82f6] font-label text-[10px] uppercase tracking-[0.3em] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> Consola Clínica
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight leading-none">
            Seleccionar <br />
            <span className="text-[#3b82f6]">Paciente</span>
          </h1>
          <p className="text-[#a7abb2] font-label font-bold uppercase text-[9px] tracking-widest mt-4">Gestión de expedientes y protocolos activos</p>
        </div>

        <div className="flex items-center gap-4 bg-[#0a0f14] p-5 rounded-sm border border-white/5 backdrop-blur-3xl shadow-xl">
          <Activity className="w-5 h-5 text-[#3b82f6] opacity-40" />
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-[#a7abb2] uppercase tracking-widest">Registros Totales</span>
            <span className="text-[11px] font-bold text-white uppercase tracking-widest">{pacientes.length} PACIENTES</span>
          </div>
        </div>
      </header>

      <div className="space-y-10">
        <div className="relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-[#3b82f6] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar paciente por nombre o apellido..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0f14] p-6 pl-16 rounded-sm border border-white/5 focus:border-[#3b82f6]/30 outline-none transition-all font-bold uppercase tracking-widest text-base md:text-[10px] text-white placeholder:text-white/5 shadow-xl"
          />
        </div>
        
        {pacientes.length === 0 && !isLoading && (
          <div className="text-center text-white/20 font-bold uppercase tracking-[0.5em] py-20 text-[10px]">
            No se han encontrado pacientes coincidentes
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pacientes.map((p: any, i: number) => (
            <motion.div
              key={p._id || p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link 
                href={`/admin/consulta/${p._id || p.id}`}
                className="flex items-center justify-between p-8 bg-[#0a0f14] rounded-sm border border-white/5 hover:border-[#3b82f6]/30 hover:bg-[#0e1419] transition-all group shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center gap-6 relative z-10 w-full">
                  <div className="w-14 h-14 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 group-hover:bg-[#3b82f6] group-hover:text-white transition-all duration-500">
                    <User className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[8px] font-bold text-[#a7abb2] uppercase tracking-[0.3em]">{p.objetivo || 'SIN PROTOCOLO'}</p>
                    <h4 className="text-xl font-bold text-white tracking-tight uppercase group-hover:text-[#3b82f6] transition-colors">{p.nombre} {p.apellido}</h4>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-white/5 text-white/20 border border-white/5 group-hover:bg-[#3b82f6] group-hover:text-white group-hover:translate-x-1 transition-all shadow-xl relative z-10 shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

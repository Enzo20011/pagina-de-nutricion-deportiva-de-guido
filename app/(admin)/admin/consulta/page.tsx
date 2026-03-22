'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Users, Search, ChevronRight, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';

export default function ConsultaIndexPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pacientes_lista_maestra', searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/pacientes?page=1&limit=50&search=${searchQuery}`);
      if (!res.ok) throw new Error('Error de red');
      return res.json();
    },
    enabled: status === 'authenticated'
  });

  const pacientes = data?.data || [];

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/login' });
    }
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accentBlue"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="max-w-[1200px] mx-auto space-y-12 text-bone selection:bg-accentBlue/20 pb-20">
        <header className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-accentBlue font-black uppercase text-[10px] tracking-[0.4em]">
              <Sparkles className="w-4 h-4 opacity-50" /> Consola de Consultas
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
              Seleccionar <br />
              <span className="text-accentBlue not-italic">Paciente.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mt-4">
              Inicia un nuevo protocolo clínico o revisa evoluciones activas
            </p>
          </motion.div>
        </header>
        <div className="space-y-10">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-accentBlue transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar en el índice maestro..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-cardDark/40 p-8 pl-20 rounded-[2.5rem] border border-white/5 focus:border-accentBlue/30 outline-none transition-all font-bold text-white placeholder:text-white/10 shadow-3xl backdrop-blur-3xl"
            />
          </div>
          
          {pacientes.length === 0 && !isLoading && (
            <div className="text-center text-slate-500 font-bold py-10 text-xl">No se encontraron pacientes.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pacientes.map((p: any, i: number) => (
              <motion.div
                key={p._id || p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  href={`/admin/consulta/${p._id || p.id}`}
                  className="flex items-center justify-between p-10 bg-cardDark/40 rounded-[3.5rem] border border-white/5 hover:border-accentBlue/30 hover:bg-cardDark/60 transition-all group shadow-2xl relative overflow-hidden backdrop-blur-3xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accentBlue/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-16 h-16 bg-darkNavy rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-accentBlue group-hover:text-white transition-all duration-500 shadow-xl">
                      <User className="w-8 h-8 text-accentBlue group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white tracking-tight uppercase italic">{p.nombre} {p.apellido}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{p.objetivo || 'Sin objetivo'}</p>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-darkNavy text-slate-500 border border-white/5 group-hover:bg-accentBlue group-hover:text-white group-hover:translate-x-2 transition-all shadow-xl relative z-10">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

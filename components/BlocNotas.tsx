'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Save, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Nota {
  id: string;
  titulo: string;
  contenido: string;
  createdAt: string;
}

export default function BlocNotas({ pacienteId }: { pacienteId: string }) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState({ titulo: '', contenido: '' });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['notas', pacienteId],
    queryFn: async () => {
      const res = await fetch(`/api/notas?pacienteId=${pacienteId}`);
      if (!res.ok) throw new Error('Error al cargar notas');
      return res.json();
    },
    enabled: !!pacienteId,
  });

  const notas: Nota[] = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notas?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notas', pacienteId] }),
  });

  const openNota = (nota: Nota) => {
    setActiveId(nota.id);
    setDraft({ titulo: nota.titulo, contenido: nota.contenido });
  };

  const openNew = () => {
    setActiveId('new');
    setDraft({ titulo: '', contenido: '' });
  };

  const handleSave = async () => {
    if (!draft.contenido.trim()) return;
    setSaving(true);
    try {
      const body = activeId === 'new'
        ? { pacienteId, ...draft }
        : { id: activeId, pacienteId, ...draft };

      const res = await fetch('/api/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      queryClient.invalidateQueries({ queryKey: ['notas', pacienteId] });
      setActiveId(json.data.id);
    } finally {
      setSaving(false);
    }
  };

  // Autosave on content change
  const autoSaveRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleContentChange = (val: string) => {
    setDraft(d => ({ ...d, contenido: val }));
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    if (activeId) {
      autoSaveRef.current = setTimeout(() => handleSave(), 1500);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-white min-h-[500px]">

      {/* SIDEBAR — lista de notas */}
      <div className="xl:col-span-4 space-y-3">
        <button
          type="button"
          onClick={openNew}
          className="w-full flex items-center gap-3 px-5 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva Nota
        </button>

        {isLoading && (
          <div className="flex items-center justify-center py-10 opacity-20">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        <div className="space-y-2">
          {notas.map(nota => (
            <button
              type="button"
              key={nota.id}
              onClick={() => openNota(nota)}
              className={`w-full text-left px-5 py-4 rounded-sm border transition-all group relative ${
                activeId === nota.id
                  ? 'bg-[#3b82f6]/10 border-[#3b82f6]/30'
                  : 'bg-[#0a0f14]/60 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60 truncate">
                    {nota.titulo || 'Sin título'}
                  </p>
                  <p className="text-[9px] text-white/20 mt-1 line-clamp-2 leading-relaxed">
                    {nota.contenido || 'Nota vacía'}
                  </p>
                  <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-2">
                    {new Date(nota.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Eliminar nota"
                  onClick={e => { e.stopPropagation(); deleteMutation.mutate(nota.id); if (activeId === nota.id) setActiveId(null); }}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </button>
          ))}

          {!isLoading && notas.length === 0 && activeId !== 'new' && (
            <div className="py-16 flex flex-col items-center gap-4 opacity-10">
              <FileText className="w-12 h-12" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-center">Sin notas todavía</p>
            </div>
          )}
        </div>
      </div>

      {/* EDITOR */}
      <div className="xl:col-span-8">
        <AnimatePresence mode="wait">
          {activeId ? (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#0a0f14]/60 border border-white/5 rounded-sm p-6 space-y-4 h-full flex flex-col"
            >
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Título de la nota..."
                  value={draft.titulo}
                  onChange={e => setDraft(d => ({ ...d, titulo: e.target.value }))}
                  className="flex-1 bg-transparent outline-none text-white font-black text-lg uppercase tracking-tight placeholder:text-white/10 border-b border-white/5 pb-2 focus:border-[#3b82f6]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !draft.contenido.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-30 text-white font-black text-[9px] uppercase tracking-widest rounded-sm transition-colors"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Guardar
                </button>
              </div>

              <textarea
                placeholder="Escribí libremente aquí..."
                value={draft.contenido}
                onChange={e => handleContentChange(e.target.value)}
                className="flex-1 w-full min-h-[400px] bg-transparent outline-none text-white/70 font-body text-sm leading-relaxed resize-none placeholder:text-white/10"
              />

              <p className="text-[8px] font-bold uppercase tracking-widest text-white/10">
                Guardado automático · {draft.contenido.length} caracteres
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] opacity-10 gap-4"
            >
              <FileText className="w-16 h-16" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-center">
                Seleccioná una nota o creá una nueva
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

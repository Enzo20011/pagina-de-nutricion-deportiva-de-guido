'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Lock, User, Clock, Check,
  Bell, Shield, Layout, Database, MapPin, Search, ArrowUpRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [saved, setSaved] = useState(false);

  // Simulación de guardado
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 text-[#eaeef6] px-4 md:px-8 bg-[#0a0f14]">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#3b82f6] font-label text-[10px] uppercase tracking-[0.3em] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> Configuración General
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight uppercase leading-none">
            Ajustes del <br />
            <span className="text-[#3b82f6]">Sistema</span>
          </h1>
          <p className="text-[#a7abb2] font-label font-bold uppercase text-[9px] tracking-widest mt-4">
            Gestión de perfil y preferencias profesionales
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-[#0e1419] p-2 border border-[#1f262e] rounded-sm"
        >
          <div className="px-5 py-3 border-r border-[#1f262e]">
             <p className="text-[8px] font-label font-bold uppercase tracking-widest text-[#a7abb2]/40">ID Registro</p>
             <p className="text-[10px] font-label font-bold uppercase tracking-widest text-[#3b82f6]">GM-2024-PRO</p>
          </div>
          <div className="px-5 py-3">
             <p className="text-[8px] font-label font-bold uppercase tracking-widest text-[#a7abb2]/40">Estado</p>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <p className="text-[10px] font-label font-bold uppercase tracking-widest text-[#eaeef6]">Verificado</p>
             </div>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* NAVIGATION SIDEBAR */}
        <aside className="xl:col-span-3 space-y-2">
           <div className="p-1.5 bg-[#0e1419] border border-[#1f262e] rounded-sm flex flex-col gap-1 shadow-xl">
            {[
              { id: 'perfil', label: 'Perfil Profesional', icon: User },
              { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
              { id: 'privacidad', label: 'Seguridad', icon: Shield },
              { id: 'apariencia', label: 'Interfaz', icon: Layout },
              { id: 'datos', label: 'Almacenamiento', icon: Database },
              { id: 'sucursales', label: 'Consultorios', icon: MapPin },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-label font-bold uppercase tracking-widest transition-all text-left group",
                  activeTab === tab.id 
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20" 
                    : "text-[#a7abb2] hover:bg-[#1f262e] hover:text-[#3b82f6]"
                )}
              >
                <tab.icon className={clsx("w-4 h-4 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-white" : "text-[#43484e]")} />
                {tab.label}
              </button>
            ))}
           </div>

           <div className="p-8 bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-sm space-y-6">
              <div className="flex items-center gap-3">
                 <Shield className="w-4 h-4 text-[#3b82f6]" />
                 <p className="text-[9px] font-label font-bold uppercase tracking-widest text-[#3b82f6]">Acceso Protegido</p>
              </div>
              <p className="text-[10px] text-[#a7abb2] font-label font-bold leading-relaxed uppercase tracking-widest opacity-60">Sus datos están cifrados bajo estándares profesionales de seguridad.</p>
           </div>
        </aside>

        {/* MAIN CONFIGURATION CONTENT */}
        <main className="xl:col-span-9 bg-[#0e1419] border border-[#1f262e] rounded-sm shadow-2xl overflow-hidden min-h-[700px]">
          <div className="p-6 md:p-8 border-b border-[#1f262e] bg-[#141a20]/40 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-[#3b82f6] text-white rounded-sm flex items-center justify-center shadow-lg">
                  {(() => {
                    const tabs = [User, Bell, Shield, Layout, Database, MapPin];
                    const ids = ['perfil', 'notificaciones', 'privacidad', 'apariencia', 'datos', 'sucursales'];
                    const CurIcon = tabs[ids.indexOf(activeTab)] || Settings;
                    return <CurIcon className="w-7 h-7" />
                  })()}
               </div>
               <div>
                  <h2 className="text-2xl font-heading font-black text-white tracking-tight uppercase leading-none">
                     {activeTab === 'perfil' && 'Perfil Profesional'}
                     {activeTab === 'notificaciones' && 'Notificaciones'}
                     {activeTab === 'privacidad' && 'Seguridad y Privacidad'}
                     {activeTab === 'apariencia' && 'Apariencia del Sistema'}
                     {activeTab === 'datos' && 'Gestión de Datos'}
                     {activeTab === 'sucursales' && 'Sedes y Consultorios'}
                  </h2>
                  <p className="text-[9px] font-label font-bold uppercase tracking-widest text-[#a7abb2] mt-2 opacity-40">Módulo de gestión interactiva</p>
               </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 space-y-12">
            {activeTab === 'perfil' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-[#a7abb2]">Nombre Público</label>
                        <input type="text" defaultValue="Guido Martin Operuk" className="w-full bg-[#141a20] border border-[#1f262e] rounded-sm px-6 py-4 text-xs text-white outline-none focus:border-[#3b82f6]/40 transition-all font-label uppercase tracking-widest" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-[#a7abb2]">Especialidad Principal</label>
                        <input type="text" defaultValue="Nutrición Deportiva" className="w-full bg-[#141a20] border border-[#1f262e] rounded-sm px-6 py-4 text-xs text-white outline-none focus:border-[#3b82f6]/40 transition-all font-label uppercase tracking-widest" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-[#a7abb2]">Email Profesional</label>
                        <input type="email" defaultValue="lic.operuk@gmail.com" className="w-full bg-[#141a20] border border-[#1f262e] rounded-sm px-6 py-4 text-xs text-white outline-none focus:border-[#3b82f6]/40 transition-all font-label uppercase tracking-widest" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-label font-bold uppercase tracking-widest text-[#a7abb2]">Matrícula Profesional</label>
                        <input type="text" defaultValue="MP 4592" className="w-full bg-[#141a20] border border-[#1f262e] rounded-sm px-6 py-4 text-xs text-white outline-none focus:border-[#3b82f6]/40 transition-all font-label uppercase tracking-widest" />
                     </div>
                  </div>

                  <div className="p-6 bg-[#141a20] border border-[#1f262e] rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 border-dashed">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#1f262e] rounded-full border-4 border-[#3b82f6]/20 flex items-center justify-center text-3xl font-heading font-black text-white">GO</div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-heading font-black text-white uppercase tracking-tight leading-none">Avatar Profesional</h4>
                           <p className="text-[9px] font-label font-bold uppercase tracking-widest text-[#a7abb2]">Se muestra en los PDF y carné de pacientes</p>
                        </div>
                     </div>
                     <button className="px-8 py-3 bg-[#1f262e] text-white border border-[#1a2027] rounded-sm text-[9px] font-label font-bold uppercase tracking-widest hover:bg-[#3b82f6] transition-all">Cambiar Imagen</button>
                  </div>
               </motion.div>
            )}
            
            {/* OTHER TABS PLACEHOLDER */}
            {activeTab !== 'perfil' && (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 opacity-20">
                <Database className="w-20 h-20 text-white" />
                <p className="text-[10px] font-label font-bold uppercase tracking-[0.4em] text-white">Sección en mantenimiento evolutivo</p>
              </div>
            )}

            <div className="pt-12 border-t border-[#1f262e] flex justify-end gap-4">
               <button className="px-8 py-4 bg-transparent text-[#a7abb2] rounded-sm text-[10px] font-label font-bold uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
               <button 
                onClick={handleSave}
                className={clsx(
                  "px-12 py-4 rounded-sm text-[10px] font-label font-bold uppercase tracking-widest shadow-xl transition-all flex items-center gap-4 group",
                  saved ? "bg-[#22c55e] text-white" : "bg-[#3b82f6] text-white shadow-[#3b82f6]/10 hover:bg-[#3b82f6]/90"
                )}
               >
                  {saved ? (
                    <><Check className="w-4 h-4" /> Guardado</>
                  ) : (
                    <>Guardar Cambios <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
               </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Users,
  Calendar,
  ClipboardList,
  LogOut,
  DollarSign,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

const TIMES = ["09:00","10:00","11:00","15:00","16:00","17:00","18:00"];
import { signOut } from 'next-auth/react';
import Toast from './Toast';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { icon: Users, label: 'Pacientes', href: '/admin/pacientes' },
  { icon: Calendar, label: 'Agenda', href: '/admin/agenda' },
  { icon: DollarSign, label: 'Finanzas', href: '/admin/finanzas' },
  { icon: ClipboardList, label: 'Consultas', href: '/admin/consulta' },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'}|null>(null);
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [turnoForm, setTurnoForm] = useState({ nombre: '', email: '', telefono: '', fecha: format(new Date(), 'yyyy-MM-dd'), hora: '09:00' });
  const [turnoSaving, setTurnoSaving] = useState(false);
  const [turnoError, setTurnoError] = useState<string | null>(null);

  const handleTurnoCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTurnoSaving(true);
    setTurnoError(null);
    try {
      const res = await fetch('/api/appointments/admin-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turnoForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear turno');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowTurnoModal(false);
      setTurnoForm({ nombre: '', email: '', telefono: '', fecha: format(new Date(), 'yyyy-MM-dd'), hora: '09:00' });
      setToast({ msg: 'Turno agendado y sincronizado con Google Calendar', type: 'success' });
    } catch (err: any) {
      setTurnoError(err.message);
    } finally {
      setTurnoSaving(false);
    }
  };

  React.useEffect(() => {
    const stored = localStorage.getItem('theme');
    const dark = stored !== 'light';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light-mode', !dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light-mode', !next);
  };

  const handleSignOut = () => {
    setToast({ msg: 'Sesión cerrada correctamente', type: 'success' });
    setTimeout(() => {
      setToast(null);
      signOut({ callbackUrl: `${window.location.origin}/login`, redirect: true });
    }, 300);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0f14]/95 backdrop-blur-xl border-b border-[#1f262e] px-4 md:px-10 py-3 md:py-4 flex items-center justify-between"
        aria-label="Barra de navegación administrativa"
      >
        {/* Branding Area */}
        <div className="flex items-center gap-3 md:gap-6 group/brand overflow-hidden">
          <Link href="/admin" className="flex items-center gap-3 md:gap-4 relative shrink-0">
            <div className="relative group/logo w-10 h-10 md:w-12 md:h-12 bg-white flex items-center justify-center transition-all duration-500 hover:scale-105 rounded-sm overflow-hidden p-1 border border-white/20">
              <Image 
                src="/logo.png" 
                alt="Logo Guido Operuk" 
                width={48}
                height={48}
                className="w-full h-full object-contain mix-blend-multiply relative z-10"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm md:text-xl tracking-tighter text-white uppercase leading-none truncate block">
                Guido <span className="hidden sm:inline">Operuk</span>
              </span>
              <span className="text-[9px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#3b82f6]/60 mt-1 truncate">PORTAL ADMIN</span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-center px-10">
          <ul className="flex gap-4 md:gap-8 lg:gap-10 items-center bg-[#0B1120]/40 p-1 rounded-sm border border-white/5">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-sm transition-all relative group focus:outline-none ${
                      isActive 
                        ? 'text-white bg-[#3b82f6]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowTurnoModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-sm text-[9px] font-black uppercase tracking-widest transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo Turno
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/15 rounded-sm border border-white/10 transition-all outline-none"
          >
            {isDark ? <Sun className="w-4 h-4 text-white/60" /> : <Moon className="w-4 h-4 text-white/60" />}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 border border-white/5 hover:border-red-400/20 transition-all text-[9px] font-bold uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SALIR</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="p-3 min-w-[44px] min-h-[44px] bg-white/5 border border-white/10 rounded-sm text-white/70 hover:text-white transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#3b82f6] outline-none"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[75vw] max-w-[280px] bg-[#0a0f14] border-l border-white/5 z-[80] p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-[10px] font-bold text-[#3b82f6] tracking-[0.3em] uppercase">NAVEGACIÓN</span>
                <button onClick={toggleMobileMenu} className="text-white/20 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {MENU_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className={`flex items-center gap-4 p-4 rounded-sm transition-all border ${
                        isActive 
                          ? 'bg-[#3b82f6] border-[#3b82f6] text-white' 
                          : 'bg-white/5 border-white/5 text-[#a7abb2] hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto pt-10 border-t border-white/5 space-y-4">
                <button
                  type="button"
                  onClick={() => { setShowTurnoModal(true); toggleMobileMenu(); }}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-[#3b82f6] hover:bg-[#2563eb] rounded-sm transition-all text-xs font-black uppercase tracking-widest text-white"
                >
                  <Plus className="w-4 h-4" /> Nuevo Turno
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-white/15 transition-all text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Modo Claro' : 'Modo Oscuro'}
                </button>
                <button
                  onClick={() => { handleSignOut(); toggleMobileMenu(); }}
                  className="w-full flex items-center justify-center gap-4 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-widest"
                >
                  <LogOut className="w-5 h-5" />
                  CERRAR SESIÓN
                </button>
                <div className="mt-8 text-center">
                  <p className="text-[7px] font-bold text-white/10 tracking-[0.4em] uppercase">Elite Clinical System v2.1</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Nuevo Turno */}
      <AnimatePresence>
        {showTurnoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTurnoModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-[#0e1419] border border-[#1f262e] rounded-sm shadow-2xl p-8 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#3b82f6] mb-1">Admin</p>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Nuevo Turno</h3>
                </div>
                <button type="button" aria-label="Cerrar" onClick={() => setShowTurnoModal(false)}
                  className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTurnoCreate} className="space-y-4">
                {[
                  { label: 'Nombre y Apellido *', key: 'nombre', type: 'text', required: true },
                  { label: 'Email', key: 'email', type: 'email', required: false },
                  { label: 'Teléfono / WhatsApp', key: 'telefono', type: 'tel', required: false },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label htmlFor={`nav-turno-${field.key}`} className="text-[9px] font-bold uppercase tracking-widest text-white/30">{field.label}</label>
                    <input
                      id={`nav-turno-${field.key}`}
                      type={field.type}
                      required={field.required}
                      value={turnoForm[field.key as keyof typeof turnoForm]}
                      onChange={e => setTurnoForm({ ...turnoForm, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-[#141a20] border border-white/5 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm uppercase tracking-wide"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="nav-turno-fecha" className="text-[9px] font-bold uppercase tracking-widest text-white/30">Fecha *</label>
                    <input id="nav-turno-fecha" type="date" required value={turnoForm.fecha}
                      onChange={e => setTurnoForm({ ...turnoForm, fecha: e.target.value })}
                      className="w-full px-4 py-3 bg-[#141a20] border border-white/5 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="nav-turno-hora" className="text-[9px] font-bold uppercase tracking-widest text-white/30">Horario *</label>
                    <select id="nav-turno-hora" required value={turnoForm.hora}
                      onChange={e => setTurnoForm({ ...turnoForm, hora: e.target.value })}
                      className="w-full px-4 py-3 bg-[#141a20] border border-white/5 focus:border-[#3b82f6]/40 rounded-sm outline-none text-white font-bold text-sm">
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {turnoError && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{turnoError}</p>}

                <button type="submit" disabled={turnoSaving}
                  className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-sm transition-colors flex items-center justify-center gap-2">
                  {turnoSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : 'Agendar y Sincronizar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

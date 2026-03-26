'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/admin',
        redirect: false
      });

      if (result?.error) {
        setError('Credenciales no autorizadas por el sistema.');
        setLoading(false);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070c14] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Fondo propio del login — independiente del layout público */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#3b82f6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#1e40af]/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/20 p-2.5 transition-transform hover:scale-105 duration-500">
            <Image src="/logo.png" alt="Logo Guido Operuk" width={48} height={48} className="w-full h-full object-contain" priority />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white flex items-center gap-2 justify-center">
              ADMIN <span className="text-[#3b82f6]">PORTAL</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#a7abb2] mt-2 opacity-50">SISTEMA INTEGRAL DE GESTIÓN NUTRICIONAL</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#0B1120]/40 backdrop-blur-2xl border border-white/5 p-10 rounded-sm shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#a7abb2] uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-[#3b82f6]" /> Identificación Profesional
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@guidooperuk.com"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-sm focus:border-[#3b82f6]/50 focus:bg-white/[0.05] outline-none text-white font-medium text-base transition-all placeholder:text-white/10"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#a7abb2] uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-[#3b82f6]" /> Clave de Seguridad
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-sm focus:border-[#3b82f6]/50 focus:bg-white/[0.05] outline-none text-white font-medium text-base transition-all placeholder:text-white/10"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/5 border border-red-500/20 rounded-sm"
              >
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-[0.3em] rounded-sm transition-all shadow-[0_0_30px_rgba(59,130,246,0.15)] flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <Sparkles className="animate-spin w-4 h-4" />
              ) : (
                <>
                  INGRESAR AL SISTEMA
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-20 group">
          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.4em] text-white">
            <ShieldCheck className="w-3 h-3" />
            CONEXIÓN ENCRIPTADA
          </div>
          <div className="w-1 h-1 bg-white/30 rounded-full" />
          <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-white">
            V 2.1.0
          </div>
        </div>
      </motion.div>
    </div>
  );
}

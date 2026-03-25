'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react';

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

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/admin',
    });

    if (result?.error) {
      setError('Error Bio-Métrico: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f14] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: `radial-gradient(circle, rgba(67,72,78,0.5) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
      {/* Neon glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,253,193,0.05) 0%, transparent 70%)' }} />
      
      {/* Branding Header */}
      <div className="flex flex-col items-center mb-16 relative z-10">
        <div className="w-20 h-20 bg-[#1a2027] rounded-sm overflow-hidden flex items-center justify-center mb-8 border border-[#2a3040] p-2">
           <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-center space-y-2">
            <h1 className="font-heading font-bold text-4xl text-[#eaeef6] tracking-tight uppercase">
              ACCESO <span className="text-[#aaffdc]" style={{ textShadow: '0 0 30px rgba(170,255,220,0.3)' }}>PORTAL</span>
            </h1>
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#a7abb2]">Elite Nutrition Management System</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-12 bg-[#0B1120]/60 border border-white/5 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] shadow-3xl w-full max-w-lg z-10 relative overflow-hidden group"
      >
        {/* Scanning decoration logic */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1 group-hover:translate-y-0 transition-transform duration-1000" />

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic flex items-center gap-3">
                <User className="w-3.5 h-3.5" /> Expediente Profesional_
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="SISTEMA_OPERUK@CONTROL.COM"
              className="w-full px-8 py-6 rounded-2xl bg-white/5 border border-white/5 focus:border-white/20 focus:outline-none text-white placeholder:text-white/5 font-black text-sm uppercase tracking-widest transition-all duration-500 italic"
              autoFocus
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic flex items-center gap-3">
                <Lock className="w-3.5 h-3.5" /> Clave de Seguridad_
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-8 py-6 rounded-2xl bg-white/5 border border-white/5 focus:border-white/20 focus:outline-none text-white placeholder:text-white/5 font-black text-sm uppercase tracking-widest transition-all duration-500 italic"
              required
            />
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-red-500 font-black text-[10px] uppercase tracking-widest text-center bg-red-500/5 border border-red-500/20 rounded-2xl py-5 px-6 italic"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-6 px-10 py-7 rounded-[2rem] bg-white text-[#1B365D] font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:shadow-[0_0_60px_rgba(255,255,255,0.1)] transition-all duration-700 disabled:opacity-20 disabled:cursor-not-allowed group/btn italic relative overflow-hidden"
          disabled={loading}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1B365D]/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          {loading ? (
            <span className="flex items-center gap-4">
              <Sparkles className="animate-spin w-5 h-5" />
              Sincronizando_
            </span>
          ) : (
            <>
              Ingresar Protocolo_
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />
            </>
          )}
        </button>
      </form>

      {/* Footer Info Terminals */}
      <div className="mt-16 flex gap-12 text-[8px] font-black uppercase tracking-[0.5em] text-white/10 italic">
          <span>Encrypted_AES256</span>
          <span className="text-white/5">|</span>
          <span>Elite_System_Terminal</span>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
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

    // NextAuth se encargará de redirigir automáticamente si hay éxito
    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/admin',
    });

    // Si llega a esta línea, es porque hubo un error (ya que el éxito redirige y corta la ejecución)
    if (result?.error) {
      setError('Error: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkNavy flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Cinematic Lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accentBlue/5 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -z-10" />

      {/* Logo superior con animación premium */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-full overflow-hidden flex items-center justify-center mb-6 border-4 border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] p-2 relative z-10 transition-transform hover:scale-105 duration-500">
           <img src="/logo.png" alt="Logo" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl animate-pulse-slow" />
        </div>
        <h1 className="text-2xl font-black text-bone tracking-tight drop-shadow flex items-center gap-2">
          Acceso Profesional
          <Sparkles className="w-6 h-6 text-accentBlue animate-pulse-slow" />
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-cardDark/60 p-10 rounded-3xl shadow-lg w-full max-w-md z-10 animate-fade-in delay-200"
      >
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Credencial de Acceso</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="profesional@operuk.com"
            className="w-full px-4 py-3 rounded-xl bg-navy/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accentBlue/40 text-bone placeholder:text-slate-400 font-semibold transition-all duration-200"
            autoFocus
            required
          />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-navy/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accentBlue/40 text-bone placeholder:text-slate-400 font-semibold transition-all duration-200"
            required
          />
        </div>

        {error && (
          <div className="text-red-400 font-bold text-center animate-fade-in delay-400 bg-white/10 rounded-xl py-2 px-4 border border-red-400/30 shadow">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accentBlue to-accentBlue/80 text-white font-bold text-lg shadow-lg hover:from-accentBlue/90 hover:to-accentBlue/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accentBlue/40 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Ingresando...
            </span>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              Ingresar
            </>
          )}
        </button>
      </form>
    </div>
  );
}

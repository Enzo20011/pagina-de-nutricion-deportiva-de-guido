'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999] bg-[#070c14] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Decorative Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3b82f6]/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f6]/5 blur-[120px] animate-pulse" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Wrapper */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-24 h-24 mb-12"
            >
              <div className="absolute inset-0 bg-white rounded-2xl p-4 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-full h-full object-contain" />
              </div>
              
              {/* Scanline line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-[#3b82f6] shadow-[0_0_15px_#3b82f6] z-20"
              />
            </motion.div>

            {/* Texto de Carga */}
            <div className="text-center space-y-4">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-label text-[10px] font-black uppercase tracking-[0.5em] text-[#3b82f6]"
              >
                Iniciando Protocolo de Precisión_
              </motion.p>
              
              <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#3b82f6]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                  style={{ boxShadow: "0 0 10px #3b82f6" }}
                />
              </div>
              
              <p className="font-label text-[8px] uppercase tracking-[0.3em] text-[#43484e]">
                Sincronizando Motores Biométricos {Math.round(progress)}%
              </p>
            </div>
          </div>

          {/* Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ 
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const VARIANTS = {
  success: {
    bg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
    border: 'border-emerald-400/30',
    glow: 'shadow-[0_0_32px_rgba(16,185,129,0.3)]',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
  },
  error: {
    bg: 'bg-gradient-to-r from-rose-700 to-rose-600',
    border: 'border-rose-400/30',
    glow: 'shadow-[0_0_32px_rgba(239,68,68,0.3)]',
    icon: <XCircle className="w-5 h-5 text-white" />,
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-700 to-blue-600',
    border: 'border-blue-400/30',
    glow: 'shadow-[0_0_32px_rgba(59,130,246,0.3)]',
    icon: <Info className="w-5 h-5 text-white" />,
  },
};

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const v = VARIANTS[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, x: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 px-5 py-4 rounded-2xl border ${v.bg} ${v.border} ${v.glow} backdrop-blur-xl max-w-sm`}
      role="alert"
      aria-live="assertive"
    >
      <div className="shrink-0">{v.icon}</div>
      <span className="text-white font-bold text-sm leading-tight">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 shrink-0 w-7 h-7 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4 text-white/80" />
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3.5, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/30 rounded-b-2xl"
      />
    </motion.div>
  );
}

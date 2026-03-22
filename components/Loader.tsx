"use client";

import { motion } from "framer-motion";

/**
 * Loader — Premium full-screen loading overlay
 * Shows an animated nutrition/DNA-inspired spinner with orbiting dots
 * and a pulsing progress shimmer bar.
 */
export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070C14]/90 backdrop-blur-2xl"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Central spinner with orbital rings */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#3B82F6] border-r-[#3B82F6]/30"
          />
          {/* Mid ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
            className="absolute inset-[8px] rounded-full border-2 border-transparent border-t-[#60A5FA]/70"
          />
          {/* Inner pulsing dot */}
          <motion.div
            animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-[18px] rounded-full bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] shadow-[0_0_30px_rgba(59,130,246,0.7)]"
          />
        </div>

        {/* Progress shimmer bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.2 }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent"
          />
        </div>

        {/* Label */}
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          className="text-[#3B82F6] font-black uppercase tracking-[0.5em] text-xs"
        >
          Cargando
        </motion.span>
      </div>
    </motion.div>
  );
}

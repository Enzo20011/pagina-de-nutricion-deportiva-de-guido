"use client";

import { motion } from 'framer-motion';

export function PatientListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="w-full p-4 lg:p-6 rounded-2xl flex items-center gap-4 bg-cardDark/40 border border-white/5 shadow-2xl overflow-hidden relative"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
          
          <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-white/10 rounded-md w-1/2" />
            <div className="h-3 bg-white/5 rounded-md w-1/3" />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 hidden md:block" />
        </motion.div>
      ))}
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
         <div key={i} className="bg-cardDark/40 rounded-3xl p-6 border border-white/5 relative overflow-hidden h-40">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
            <div className="w-12 h-12 bg-white/10 rounded-2xl mb-4" />
            <div className="h-8 bg-white/10 rounded-md w-1/2 mb-2" />
            <div className="h-4 bg-white/5 rounded-md w-1/3" />
         </div>
      ))}
    </div>
  );
}

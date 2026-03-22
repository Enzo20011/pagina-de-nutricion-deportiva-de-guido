import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const SkeletonElite = ({ className, variant = 'rect' }: SkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={`
        bg-white/[0.03] 
        backdrop-blur-md 
        border border-white/5 
        overflow-hidden 
        relative
        ${variant === 'circle' ? 'rounded-full' : 'rounded-2xl'}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </motion.div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonElite variant="text" className="h-10 w-64" />
          <SkeletonElite variant="text" className="h-4 w-40" />
        </div>
        <SkeletonElite className="h-12 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <SkeletonElite key={item} className="h-40 rounded-[2.5rem]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonElite className="h-[400px] rounded-[3rem]" />
        <SkeletonElite className="h-[400px] rounded-[3rem]" />
      </div>
    </div>
  );
};

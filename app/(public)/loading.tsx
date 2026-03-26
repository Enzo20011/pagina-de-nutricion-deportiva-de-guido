export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#3b82f6] rounded-full animate-spin" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Cargando</span>
      </div>
    </div>
  );
}

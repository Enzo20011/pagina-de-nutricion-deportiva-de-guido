export default function Loading() {
  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-white/5 rounded-sm" />
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-sm border border-white/5" />
        ))}
      </div>
    </div>
  );
}

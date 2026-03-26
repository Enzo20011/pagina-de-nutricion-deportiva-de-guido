export default function Loading() {
  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6 animate-pulse">
      <div className="h-6 w-40 bg-white/5 rounded-sm" />
      <div className="h-[2px] w-full bg-white/5 rounded-sm" />
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-sm border border-white/5" />
        ))}
      </div>
    </div>
  );
}

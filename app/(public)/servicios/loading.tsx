export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070C14] pt-20 animate-pulse">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-16 space-y-14">
        {/* Header */}
        <div className="space-y-5 text-center">
          <div className="h-2 w-16 bg-white/5 rounded-sm mx-auto" />
          <div className="h-14 w-80 bg-white/5 rounded-sm mx-auto" />
          <div className="h-4 w-96 bg-white/5 rounded-sm mx-auto" />
          <div className="h-4 w-72 bg-white/5 rounded-sm mx-auto" />
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 bg-white/5 rounded-sm border border-white/5" />
          ))}
        </div>
        {/* Secondary row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-sm border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

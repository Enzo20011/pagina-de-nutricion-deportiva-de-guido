export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070C14] pt-20 animate-pulse">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Imagen */}
          <div className="aspect-[3/4] max-w-sm mx-auto w-full bg-white/5 rounded-sm border border-white/5" />
          {/* Contenido */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-2 w-16 bg-white/5 rounded-sm" />
              <div className="h-16 w-64 bg-white/5 rounded-sm" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded-sm" />
              <div className="h-4 bg-white/5 rounded-sm w-5/6" />
              <div className="h-4 bg-white/5 rounded-sm w-4/6" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded-sm" />
              <div className="h-4 bg-white/5 rounded-sm w-3/4" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 bg-white/5 rounded-sm" />
              <div className="h-12 w-32 bg-white/5 rounded-sm" />
            </div>
          </div>
        </div>
        {/* Avales row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-sm border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

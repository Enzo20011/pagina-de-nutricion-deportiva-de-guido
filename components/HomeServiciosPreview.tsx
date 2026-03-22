"use client";

export default function HomeServiciosPreview() {
  return (
    <section className="w-full max-w-5xl mx-auto py-16 px-4 flex flex-col gap-12">
      <h3 className="text-2xl md:text-3xl font-black uppercase italic text-center text-[#3B82F6] mb-8">Servicios Destacados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-[#0F1A2A]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-8 flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-[0_0_40px_#3B82F6] cursor-pointer">
          <span className="text-[#3B82F6] text-3xl mb-3">🏋️‍♂️</span>
          <h4 className="text-xl font-black uppercase mb-1">Nutrición Deportiva</h4>
          <p className="text-[#F8FAFC]/80 text-base font-light mb-2">Planes personalizados para atletas y entusiastas del deporte.</p>
        </div>
        <div className="group bg-[#0F1A2A]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-8 flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-[0_0_40px_#3B82F6] cursor-pointer">
          <span className="text-[#3B82F6] text-3xl mb-3">🍏</span>
          <h4 className="text-xl font-black uppercase mb-1">Nutrición Clínica</h4>
          <p className="text-[#F8FAFC]/80 text-base font-light mb-2">Prevención, tratamiento y educación nutricional integral.</p>
        </div>
        <div className="group bg-[#0F1A2A]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md p-8 flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-[0_0_40px_#3B82F6] cursor-pointer">
          <span className="text-[#3B82F6] text-3xl mb-3">📊</span>
          <h4 className="text-xl font-black uppercase mb-1">Antropometría & Online</h4>
          <p className="text-[#F8FAFC]/80 text-base font-light mb-2">Evaluación corporal y asesoría a distancia con tecnología de punta.</p>
        </div>
      </div>
    </section>
  );
}
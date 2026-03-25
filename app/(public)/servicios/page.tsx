"use client";
import ServiciosSection from "@/components/ServiciosSection";
import ScientificAvales from "@/components/ScientificAvales";

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-[#070C14] pt-20">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white/5 to-transparent -z-10 blur-[120px] pointer-events-none" />
      
      <ServiciosSection />
      
      <div className="py-24 bg-[#070C14]">
        <ScientificAvales />
      </div>
    </main>
  );
}

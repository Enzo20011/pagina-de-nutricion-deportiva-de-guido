import type { Metadata } from "next";
import ServiciosPageClient from "@/components/ServiciosPageClient";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Planes de nutrición deportiva y clínica personalizados. Evaluación antropométrica ISAK, seguimiento continuo y consultas presenciales u online en Posadas, Misiones.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    url: "https://guidooperuk.com/servicios",
    title: "Servicios | Guido Operuk Nutrición",
    description: "Planes de nutrición deportiva y clínica personalizados. Evaluación antropométrica ISAK, seguimiento continuo y consultas en Posadas, Misiones.",
  },
};

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-[#070C14] pt-20">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white/5 to-transparent -z-10 blur-[120px] pointer-events-none" />
      <ServiciosPageClient />
    </main>
  );
}

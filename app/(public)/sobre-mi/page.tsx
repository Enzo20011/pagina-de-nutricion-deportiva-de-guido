import type { Metadata } from "next";
import SobreMiPageClient from "@/components/SobreMiPageClient";

export const metadata: Metadata = {
  title: "Sobre Mí",
  description: "Licenciado en Nutrición (MP 778). Especializado en nutrición deportiva, composición corporal y biotipificación individual. Consultá en Posadas, Misiones.",
  alternates: { canonical: "/sobre-mi" },
  openGraph: {
    url: "https://guidooperuk.com/sobre-mi",
    title: "Sobre Mí | Guido Operuk Nutrición",
    description: "Lic. Guido Operuk, MP 778. Nutrición deportiva, composición corporal y biotipificación individual en Posadas, Misiones.",
  },
};

export default function SobreMiPage() {
  return (
    <main className="min-h-screen bg-[#070C14] pt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white/5 to-transparent -z-10 blur-[120px] pointer-events-none" />
      <SobreMiPageClient />
    </main>
  );
}

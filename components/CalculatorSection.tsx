"use client";
// Aquí va la calculadora premium, puedes reutilizar tu lógica previa o pedir que la integre completa.
export default function CalculatorSection() {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 px-4 bg-[#070C14] text-[#F8FAFC]">
      <div className="w-full max-w-3xl mx-auto bg-[#0F1A2A]/90 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-md p-10 md:p-16 flex flex-col gap-10">
        <h3 className="text-3xl md:text-4xl font-black uppercase italic text-center text-[#3B82F6] mb-2">Descubrí tu gasto energético base</h3>
        {/* Aquí van los sliders, toggles y resultados */}
        <div className="text-center text-[#F8FAFC]/80 text-base md:text-lg font-light mt-8">
          Este es tu motor basal. Para optimizar tus macros y llevar tu entrenamiento al siguiente nivel, diseñemos tu plan.
        </div>
        {/* Botón eliminado, turnero está en la home */}
      </div>
    </section>
  );
}

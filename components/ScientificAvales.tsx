'use client';

import { motion } from 'framer-motion';

const avales = [
  { abbr: 'ISSN', name: 'International Society of Sports Nutrition', desc: 'Referente mundial en nutrición deportiva científica' },
  { abbr: 'ISAK', name: 'International Society for the Advancement of Kinanthropometry', desc: 'Estándar de oro en medición de composición corporal' },
  { abbr: 'GSSI', name: 'Gatorade Sports Science Institute', desc: 'Investigación en hidratación y fisiología atlética' },
  { abbr: 'ADA', name: 'Academy of Nutrition and Dietetics', desc: 'Organización líder en ciencias nutricionales aplicadas' },
];

export default function ScientificAvales() {
  return (
    <section className="bg-[#0e1419] py-12 px-8">
      <div className="max-w-[1200px] mx-auto px-4 border-t border-[#1f262e] pt-12 pb-16 flex flex-col md:flex-row gap-10 items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-heading font-black text-white hover:text-[#3b82f6] transition-colors uppercase tracking-tight mb-6">
              AVALES<br />
              <span className="text-[#3b82f6]">CIENTÍFICOS</span>
            </h2>
            <p className="body-sm">
              Metodologías validadas y respaldadas por las instituciones más prestigiosas en nutrición deportiva y ciencias de la salud.
            </p>
          </div>

          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a2027]">
            {avales.map((aval, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
                className="bg-[#0e1419] p-6 group hover:bg-[#141a20] transition-colors duration-500 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.3em] mb-3">{aval.abbr}</p>
                <p className="text-[11px] font-bold text-[#eaeef6] uppercase tracking-wider mb-1">{aval.name}</p>
                <p className="text-[9px] font-bold text-[#43484e] uppercase tracking-widest leading-relaxed">{aval.desc}</p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}

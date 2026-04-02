import { Instagram, Phone, MapPin, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PHONE_DISPLAY } from "@/lib/constants";

interface FooterProps {
  onBookingClick?: () => void;
}

const DOT_GRID = `radial-gradient(circle, rgba(67,72,78,0.5) 1px, transparent 1px)`;

export default function Footer({ onBookingClick = () => {} }: FooterProps) {
  return (
    <footer className="w-full bg-[#0e1419] pt-16 pb-10 px-8 relative overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: DOT_GRID, backgroundSize: "20px 20px" }} />

      {/* Top neon accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }} />
      
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* BRAND */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center bg-white rounded-xl overflow-hidden p-1.5 transition-transform duration-500 hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="heading-sm !text-lg mb-1">Guido M. Operuk</p>
              <p className="eyebrow !text-[#a7abb2] tracking-[0.2em]">MP 778</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.a
              href="https://www.instagram.com/lic.guidooperuk/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: "#3b82f6", color: "#ffffff", boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-[#1a2027] text-[#a7abb2] rounded-sm flex items-center justify-center transition-all duration-300 border border-[#2a3040]"
              aria-label="Instagram de Guido Operuk"
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* NAV */}
        <div className="lg:col-span-2 space-y-8">
          <h4 className="eyebrow !text-[#eaeef6] border-b border-[#1f262e] pb-4">
            NAVEGACIÓN
          </h4>
          <nav className="flex flex-col gap-4 font-label text-[11px] uppercase tracking-[0.12em]">
            {[
              { href: "/", label: "Inicio" },
              { href: "/servicios", label: "Servicios" },
              { href: "/sobre-mi", label: "Sobre Mí" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="group">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-[#a7abb2] hover:text-[#3b82f6] transition-colors duration-300"
                >
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            ))}
            <button onClick={onBookingClick}
              className="flex items-center gap-2 text-[#3b82f6] hover:text-[#2563eb] transition-colors duration-300 group text-left">
              Consulta <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </nav>
        </div>

        {/* CONTACT */}
        <div className="lg:col-span-3 space-y-8">
          <h4 className="eyebrow !text-[#eaeef6] border-b border-[#1f262e] pb-4">
            CONTACTO
          </h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-[#a7abb2] flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs text-[#a7abb2] leading-relaxed">Posadas, Misiones, Argentina.</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-4 h-4 text-[#a7abb2] flex-shrink-0" />
              <p className="font-body text-xs text-[#a7abb2]">{PHONE_DISPLAY}</p>
            </div>
            <div className="flex items-center gap-4 group">
              <Mail className="w-4 h-4 text-[#a7abb2] flex-shrink-0 group-hover:text-[#3b82f6] transition-colors" />
              <a href="mailto:lic.guidooperuk@gmail.com" className="font-body text-xs text-[#a7abb2] hover:text-[#3b82f6] transition-colors">lic.guidooperuk@gmail.com</a>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-[#1f262e] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="body-sm !text-[10px] !text-[#43484e]">
          © {new Date().getFullYear()} Lic. Guido Martin Operuk · Laboratorio Nutricional
        </p>
        <div className="flex gap-8">
          <Link href="/privacidad" className="body-sm !text-[10px] !text-[#43484e] hover:text-[#a7abb2] transition-colors">Privacidad</Link>
          <Link href="/terminos" className="body-sm !text-[10px] !text-[#43484e] hover:text-[#a7abb2] transition-colors">Términos</Link>
        </div>
      </div>
    </footer>
  );
}

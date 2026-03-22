import { Instagram, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  onBookingClick?: () => void;
}

export default function Footer({ onBookingClick = () => {} }: FooterProps) {
  return (
    <footer className="w-full bg-darkNavy border-t border-white/5 pt-24 pb-12 px-6 mt-24 text-slate-500 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-accentBlue/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20 relative z-10">
        
        {/* BRAND COLUMN */}
        <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-xl">
                 <Image src="/logo.png" alt="Logo" width={32} height={32} className="brightness-125" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white uppercase italic tracking-tighter">Operuk<span className="text-accentBlue">.</span></span>
                <span className="text-[9px] font-black text-accentBlue uppercase tracking-[0.4em]">Elite Nutrition</span>
              </div>
            </div>
            
            <p className="text-sm font-medium leading-relaxed max-w-sm italic">
                Sistemas de alimentación de alto rendimiento basados en ciencia, antropometría y biotipificación individual.
            </p>
            
            <div className="flex gap-4">
                <a href="https://www.instagram.com/lic.guidooperuk/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-accentBlue text-white rounded-xl flex items-center justify-center transition-all border border-white/10">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-accentBlue text-white rounded-xl flex items-center justify-center transition-all border border-white/10">
                    <Mail className="w-5 h-5" />
                </a>
            </div>
        </div>

        {/* NAVIGATION COLUMN */}
        <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] border-b border-white/5 pb-4">Navegación</h4>
            <nav className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest">
                <Link href="#inicio" className="hover:text-accentBlue transition-colors flex items-center gap-2 group">Inicio <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link>
                <Link href="#servicios" className="hover:text-accentBlue transition-colors flex items-center gap-2 group">Servicios <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link>
                <Link href="#sobre-mi" className="hover:text-accentBlue transition-colors flex items-center gap-2 group">Sobre Mí <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link>
                <button onClick={onBookingClick} className="hover:text-accentBlue transition-colors flex items-center gap-2 group text-left">Turnos <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></button>
            </nav>
        </div>

        {/* CONTACT COLUMN */}
        <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] border-b border-white/5 pb-4">Contacto</h4>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accentBlue flex-shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">Consultorio Central, <br/> Buenos Aires, Argentina.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-accentBlue flex-shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest">+54 9 11 2233-4455</p>
                </div>
                <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-accentBlue flex-shrink-0" />
                    <p className="text-xs font-black uppercase tracking-widest">guido@operuk.com</p>
                </div>
            </div>
        </div>

        {/* LEGAL COLUMN */}
        <div className="lg:col-span-3 space-y-8">
             <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] border-b border-white/5 pb-4">Newsletter Elite</h4>
             <p className="text-xs font-medium">Suscribite para recibir tips de nutrición deportiva.</p>
             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
                <input type="email" placeholder="Email" className="bg-transparent border-none text-xs px-4 py-2 w-full focus:outline-none text-white" />
                <button className="bg-accentBlue text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">OK</button>
             </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em]">
        <p>© {new Date().getFullYear()} Lic. Guido Martin Operuk - Todos los derechos reservados.</p>
        <div className="flex gap-8">
            <Link href="/privacidad" className="hover:text-accentBlue transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-accentBlue transition-colors">Términos</Link>
            <span className="text-accentBlue/40 italic">Elite Nutrition V.2.0</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Montserrat } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/SessionProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import Footer from '@/components/Footer';

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata = {
  title: 'Guido Nutrición | Sistema Elite de Gestión',
  description: 'Plataforma premium de nutrición clínica y deportiva. Calculadora metabólica, turnos online y servicios personalizados.',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', url: '/icon-192x192.png' }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans bg-darkNavy text-bone min-h-screen`}>
        {/* Navbar pública eliminada del layout global. Usar solo en layout público si se requiere. */}
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
        {/* Footer y WhatsApp solo en landing/público, no en admin */}
      </body>
    </html>
  );
}

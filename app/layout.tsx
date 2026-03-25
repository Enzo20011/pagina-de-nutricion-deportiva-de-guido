import Link from "next/link";
import { Space_Grotesk, Inter, Manrope } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/SessionProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import PageLoader from '@/components/PageLoader';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700']
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700']
});

const manrope = Manrope({ 
  subsets: ['latin'], 
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata = {
  title: {
    default: 'Lic. Guido Operuk | Nutrición Clínica y Deportiva',
    template: '%s | Guido Operuk Nutrición',
  },
  description: 'Sistemas de alimentación de alto rendimiento basados en ciencia, antropometría y biotipificación individual. Consultá online o presencial en Buenos Aires.',
  keywords: ['nutricionista', 'nutrición deportiva', 'nutrición clínica', 'Buenos Aires', 'Guido Operuk', 'plan alimentario', 'composición corporal'],
  authors: [{ name: 'Lic. Guido Martin Operuk' }],
  creator: 'Guido Martin Operuk',
  metadataBase: new URL('https://guidooperuk.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://guidooperuk.com',
    siteName: 'Guido Operuk | Nutrición',
    title: 'Lic. Guido Operuk | Nutrición Clínica y Deportiva',
    description: 'Sistemas de alimentación avanzada basados en ciencia, antropometría y biotipificación individual.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Guido Operuk - Nutrición Clínica y Deportiva',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lic. Guido Operuk | Nutrición Clínica y Deportiva',
    description: 'Sistemas de alimentación de alto rendimiento basados en ciencia.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', url: '/icon-192x192.png' },
  ],
  themeColor: '#070C14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${manrope.variable} font-sans bg-[#0a0f14] text-[#eaeef6] min-h-screen relative`}>
        <AnimatedBackground />
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

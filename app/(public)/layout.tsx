import React from 'react';
import { Metadata } from 'next';
import PublicClientWrapper from './PublicClientWrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | Lic. Guido Operuk',
    default: 'Lic. Guido Operuk | Nutrición Clínica y Deportiva',
  },
  description: 'Especialista en nutrición deportiva y clínica en Posadas, Misiones. Planes personalizados, bioanálisis y optimización del rendimiento.',
  keywords: ['nutrición deportiva', 'nutricionista posadas', 'guido operuk', 'dieta personalizada', 'alto rendimiento'],
  authors: [{ name: 'Guido Martin Operuk' }],
  openGraph: {
    title: 'Lic. Guido Operuk | Nutricion Clínica y Deportiva',
    description: 'Ciencia aplicada al alto rendimiento y salud integral.',
    url: 'https://guidonutricion.com',
    siteName: 'Guido Nutrición',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lic. Guido Operuk - Nutrición Elite',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lic. Guido Operuk | Nutrición Elite',
    description: 'Planes de nutrición basados en ciencia.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicClientWrapper>
      {children}
    </PublicClientWrapper>
  );
}

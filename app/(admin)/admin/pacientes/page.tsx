
'use client';

import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import BasePacientes from '@/components/BasePacientes';

export default function PacientesPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/login' });
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accentBlue"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="pb-20">
        <BasePacientes />
      </div>
    );
  }

  // Si no está autenticado, no renderiza nada (redirige)
  return null;
}

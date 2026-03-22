
'use client';

import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import BasePacientes from '@/components/BasePacientes';

export default function PacientesPage() {
  return (
    <div className="pb-20">
      <BasePacientes />
    </div>
  );
}

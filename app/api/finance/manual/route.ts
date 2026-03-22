import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Ingreso from '@/models/Ingreso';
import { MetodoPago, EstadoPago, CategoriaPago } from '@/types/finance';
import { z } from 'zod';

// ─── AUTH GUARD ────────────────────────────────────────────────────────────────
async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return null;
}

// ─── INPUT VALIDATION ─────────────────────────────────────────────────────────
import { manualPaymentSchema } from '@/lib/validations/finance';

export async function POST(req: Request) {
  // Auth check
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    await dbConnect();
    const rawData = await req.json();

    // Zod validation
    const validation = manualPaymentSchema.safeParse({
      ...rawData,
      monto: Number(rawData.monto),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const nuevoIngreso = await (Ingreso as any).create({
      ...data,
      estado: EstadoPago.PAGADO,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
    });

    return NextResponse.json(nuevoIngreso, { status: 201 });
  } catch (error: any) {
    console.error('Error al registrar pago manual:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

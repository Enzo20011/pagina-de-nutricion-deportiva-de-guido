import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ingreso from '@/models/Ingreso';
import { MetodoPago, EstadoPago, CategoriaPago } from '@/types/finance';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';

// ─── INPUT VALIDATION ─────────────────────────────────────────────────────────
import { manualPaymentSchema } from '@/lib/validations/finance';

export async function POST(req: Request) {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

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

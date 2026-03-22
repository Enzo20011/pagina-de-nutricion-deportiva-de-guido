import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Antropometria, { antropometriaSchema } from '@/models/Antropometria';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const pacienteId = searchParams.get('pacienteId');
  if (!pacienteId) return NextResponse.json({ error: 'Falta pacienteId' }, { status: 400 });

  try {
    const historial = await (Antropometria as any).find({ pacienteId }).sort({ createdAt: 1 });
    return NextResponse.json({ data: historial });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    // SERVER-SIDE ZOD VALIDATION
    const validation = antropometriaSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de antropometría inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { pacienteId, ...data } = validation.data;
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const doc = await (Antropometria as any).findOneAndUpdate(
      { pacienteId, createdAt: { $gte: startOfDay } },
      { pacienteId, ...data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ data: doc });
  } catch(e: any) {
    console.error('Error guardando antropometria:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Antropometria from '@/models/Antropometria';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const pacienteId = searchParams.get('pacienteId');
  if (!pacienteId) return NextResponse.json({ error: 'Falta pacienteId' }, { status: 400 });

  try {
    const historial = await Antropometria.find({ pacienteId }).sort({ createdAt: 1 });
    return NextResponse.json({ data: historial });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const doc = await Antropometria.findOneAndUpdate(
      { pacienteId: body.pacienteId, createdAt: { $gte: startOfDay } },
      body,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ data: doc });
  } catch(e: any) {
    console.error('Error guardando antropometria:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PlanAlimentario from '@/models/PlanAlimentario';
import { dietaSchema } from '@/lib/validations/dieta';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const pacienteId = searchParams.get('pacienteId');
  if (!pacienteId) return NextResponse.json({ error: 'Falta pacienteId' }, { status: 400 });

  try {
    const plan = await PlanAlimentario.findOne({ pacienteId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: plan });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    // SERVER-SIDE ZOD VALIDATION
    const validation = dietaSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos del plan alimentario inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { pacienteId, ...data } = validation.data;
    
    const plan = await PlanAlimentario.findOneAndUpdate(
      { pacienteId },
      { pacienteId, ...data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json({ data: plan });
  } catch(e: any) {
    console.error('Error guardando dieta:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

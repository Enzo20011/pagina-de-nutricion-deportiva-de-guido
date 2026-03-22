import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import SlotLock from '@/models/SlotLock';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get('fecha');

    if (!fecha) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 });
    }

    // 1. Get confirmed appointments
    const confirmedAppointments = await (Reserva as any).find({ 
      fecha, 
      status: 'confirmada',
      isDeleted: false 
    }).select('hora');

    // 2. Get active temporary locks
    const activeLocks = await (SlotLock as any).find({ 
      fecha,
      expiresAt: { $gt: new Date() } 
    }).select('hora');

    const takenSlots = [
      ...confirmedAppointments.map(a => a.hora),
      ...activeLocks.map(l => l.hora)
    ];

    return NextResponse.json({ takenSlots: Array.from(new Set(takenSlots)) });
  } catch (error: any) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

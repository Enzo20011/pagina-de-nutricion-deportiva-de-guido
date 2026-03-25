import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import SlotLock from '@/models/SlotLock';

export async function POST(req: Request) {
  try {
    const { name, email, phone, fecha, hora, sessionId } = await req.json();

    if (!name || !email || !fecha || !hora || !sessionId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    await dbConnect();

    // 1. Verify the lock belongs to this session
    const lock = await (SlotLock as any).findOne({ fecha, hora, sessionId });
    if (!lock) {
      return NextResponse.json({ error: 'La sesión de reserva ha expirado. Intente nuevamente.' }, { status: 410 });
    }

    // 2. Create the Reserva (status: pendiente)
    const nuevaReserva = await (Reserva as any).create({
      nombre: name,
      email,
      telefono: phone,
      fecha,
      hora,
      status: 'pendiente',
      isDeleted: false
    });

    // 3. Optional: Delete the lock now that it's a reservation draft
    await (SlotLock as any).deleteOne({ _id: lock._id });

    return NextResponse.json({ 
      message: 'Reserva creada con éxito', 
      reservaId: nuevaReserva._id 
    });

  } catch (error: any) {
    console.error('Error creating reserva:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, phone, fecha, hora, sessionId } = await req.json();

    if (!name || !email || !phone || !fecha || !hora || !sessionId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // 1. Verify the lock belongs to this session and is still valid
    const lock = await prisma.slotLock.findFirst({
      where: { fecha, hora, sessionId, expiresAt: { gt: new Date() } }
    });
    
    if (!lock) {
      return NextResponse.json({ error: 'La sesión de reserva ha expirado. Intente nuevamente.' }, { status: 410 });
    }

    // 2. Create the Reserva (status: pendiente)
    const nuevaReserva = await prisma.reserva.create({
      data: {
        nombre: name,
        email,
        telefono: phone,
        fecha,
        hora,
        status: 'pendiente',
        isDeleted: false
      }
    });

    // 3. Delete the lock
    await prisma.slotLock.delete({
      where: { id: lock.id }
    });

    // 4. Async Sync to Google Calendar (don't block the response)
    const { syncAppointmentToCalendar } = await import('@/lib/googleCalendar');
    syncAppointmentToCalendar({
      nombre: name,
      email,
      telefono: phone,
      fecha,
      hora
    }).catch(err => console.error('Silent Calendar Sync Error:', err));

    return NextResponse.json({ 
      message: 'Reserva creada con éxito', 
      reservaId: nuevaReserva.id 
    });

  } catch (error: any) {
    console.error('Error creating reserva:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

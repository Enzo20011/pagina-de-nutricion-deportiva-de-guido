import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';

export async function GET(request: Request) {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start'); // YYYY-MM-DD
  const end = searchParams.get('end');     // YYYY-MM-DD

  await dbConnect();

  try {
    const query: any = { isDeleted: false };
    
    if (start && end) {
      query.fecha = { $gte: start, $lte: end };
    } else if (start) {
      query.fecha = { $gte: start };
    }

    const appointments = await (Reserva as any).find(query).sort({ fecha: 1, hora: 1 });
    
    return NextResponse.json({ 
      data: appointments,
      count: appointments.length 
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

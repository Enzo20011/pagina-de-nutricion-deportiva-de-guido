import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import SlotLock from '@/models/SlotLock';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

export async function POST(req: Request) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔒 RATE LIMIT: max 5 lock attempts per IP per minute
  // Prevents bots from blocking the entire agenda
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const ip = getClientIP(req);
  const { ok, remaining, resetAt } = checkRateLimit(`lock:${ip}`, {
    limit: 5,
    windowMs: 60_000, // 1 minute window
  });

  if (!ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Por favor, esperá unos minutos antes de volver a reservar.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((resetAt.getTime() - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const { fecha, hora, sessionId } = await req.json();
    
    if (!fecha || !hora || !sessionId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    await dbConnect();

    // 1. Check if there's a confirmed appointment (Final state check)
    const confirmedReserva = await (Reserva as any).findOne({ 
      fecha, 
      hora, 
      status: 'confirmada',
      isDeleted: false 
    });

    if (confirmedReserva) {
      return NextResponse.json({ error: 'El turno ya ha sido reservado.' }, { status: 409 });
    }

    // 2. ATOMIC LOCK ATTEMPT
    // We use findOneAndUpdate with a query that ONLY matches if:
    // a) The slot is expired (expiresAt <= now)
    // b) The slot is already held by the SAME sessionId (renewal)
    // c) The slot doesn't exist (handled by upsert)
    
    const now = new Date();
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 5);

    try {
      const lock = await (SlotLock as any).findOneAndUpdate(
        { 
          fecha, 
          hora, 
          $or: [
            { expiresAt: { $lte: now } }, 
            { sessionId: sessionId }
          ] 
        }, 
        { 
          $set: { 
            sessionId, 
            expiresAt: expiration 
          } 
        }, 
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true
        }
      );

      return NextResponse.json({ 
        message: 'Turno bloqueado temporalmente', 
        expiresAt: expiration,
        rateLimitRemaining: remaining,
      });

    } catch (innerError: any) {
      // 11000 = Duplicate Key error. 
      // If the upsert fails because {fecha, hora} exists, it means 
      // the filter (expired OR same session) DID NOT match.
      if (innerError.code === 11000) {
        return NextResponse.json({ 
          error: 'Este turno está siendo procesado por otro usuario. Intenta en 5 minutos.' 
        }, { status: 409 });
      }
      throw innerError; // Re-throw for outer catch
    }
  } catch (error: any) {
    if (error.code === 11000) {
       // Duplicate key error on compound index (fecha+hora) means someone else just locked it.
       return NextResponse.json({ error: 'El turno acaba de ser bloqueado por otro paciente.' }, { status: 409 });
    }
    console.error('Error locking slot:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

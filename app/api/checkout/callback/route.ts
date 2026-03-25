import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ingreso from '@/models/Ingreso';
import Reserva from '@/models/Reserva';
import { EstadoPago } from '@/models/Ingreso';
import { sendPaymentConfirmation } from '@/lib/email';

/**
 * REAL MERCADO PAGO CALLBACK
 * Handles redirection after payment (Success, Failure, Pending).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // Real Mercado Pago Query Params
  const status = searchParams.get('status') || searchParams.get('collection_status');
  const reservaId = searchParams.get('reserva_id') || searchParams.get('external_reference');
  const preferenceId = searchParams.get('preference_id');
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');

  console.log(`[PAYMENT CALLBACK] Status: ${status}, Reserva: ${reservaId}, Pref: ${preferenceId}`);

  if (!reservaId || !status) {
    return NextResponse.redirect(new URL('/?error=missing_payment_data', req.url));
  }

  await dbConnect();

  try {
    if (status === 'approved' || status === 'success') {
      // 1. Confirm the Financial Entry
      const ingreso = await (Ingreso as any).findOneAndUpdate(
        { 
          $or: [
            { mpPreferenceId: preferenceId },
            { referenciaExterna: reservaId }
          ]
        },
        { 
          estado: EstadoPago.PAGADO,
          turnoId: paymentId || undefined // Store the actual payment ID from MP
        },
        { new: true }
      );

      // 2. Confirm the Reservation
      const reserva = await (Reserva as any).findByIdAndUpdate(
        reservaId,
        { status: 'confirmada' },
        { new: true }
      );
      
      if (reserva && reserva.email) {
        // 3. Send Confirmation Email (Mock for now)
        await sendPaymentConfirmation(reserva.email, ingreso?.monto || 5000);
      }

      return NextResponse.redirect(new URL(`/success?booking=confirmed&reserva=${reservaId}`, req.url));
    } else {
      // Payment failed or pending
      console.warn(`Payment not approved. Status: ${status}`);
      return NextResponse.redirect(new URL(`/?error=payment_failed&reserva=${reservaId}`, req.url));
    }
  } catch (error: any) {
    console.error('Error in payment callback:', error);
    return NextResponse.redirect(new URL('/?error=internal_callback_error', req.url));
  }
}

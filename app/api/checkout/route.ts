import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { checkoutSchema } from '@/lib/validations/checkout';

export async function POST(req: Request) {
  // 🔒 RATE LIMIT check (already implemented)
  const ip = getClientIP(req);
  const { ok, resetAt } = checkRateLimit(`checkout:${ip}`, {
    limit: 3,
    windowMs: 5 * 60_000,
  });

  if (!ok) {
    const retryAfterSeconds = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Demasiados intentos de pago. Por favor, esperá ${retryAfterSeconds} segundos.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // SERVER-SIDE ZOD VALIDATION
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de checkout inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, date } = validation.data;

    // Simulate backend processing
    console.log('Initiating checkout for:', { name, email, date });

    // Mock response simulating Mercado Pago Checkout URL
    const mockCheckoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock_pref_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({ 
      url: mockCheckoutUrl,
      status: 'pending_payment',
      message: 'Checkout session created successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

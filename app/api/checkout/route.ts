import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

export async function POST(req: Request) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔒 RATE LIMIT: max 3 checkout initiations per IP per 5 minutes
  // Prevents payment spam and fake checkout initiations
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const ip = getClientIP(req);
  const { ok, resetAt } = checkRateLimit(`checkout:${ip}`, {
    limit: 3,
    windowMs: 5 * 60_000, // 5 minute window
  });

  if (!ok) {
    const retryAfterSeconds = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Demasiados intentos de pago. Por favor, esperá ${retryAfterSeconds} segundos.` },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfterSeconds.toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { name, email, date } = body;

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

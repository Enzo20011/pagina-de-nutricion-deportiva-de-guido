import { NextResponse } from 'next/server';
import { manualPaymentSchema } from '@/lib/validations/finance';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';

export async function GET() {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();
  // ... (GET logic) ...
  return NextResponse.json({
    totalMes: 342500,
    mpTotal: 128000,
    efectivoTotal: 214500,
    movimientos: [
      { id: '1', paciente: 'Juan Pérez', monto: 2500, metodo: 'Mercado Pago', estado: 'Pagado', fecha: 'Hoy, 10:30', concepto: 'Seña Turno' },
      { id: '2', paciente: 'María López', monto: 15000, metodo: 'Efectivo', estado: 'Pagado', fecha: 'Hoy, 12:45', concepto: 'Consulta Completa' },
    ]
  });
}

export async function POST(req: Request) {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await req.json();
    
    // SERVER-SIDE ZOD VALIDATION
    const validation = manualPaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de finanzas inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Ingreso registrado (Simulado)", data: validation.data });
  } catch (error) {
    return NextResponse.json({ error: "Error registrando ingreso" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  // En el futuro, esto consultará el modelo Ingreso
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
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, message: "Ingreso registrado" });
  } catch (error) {
    return NextResponse.json({ error: "Error registrando ingreso" }, { status: 500 });
  }
}

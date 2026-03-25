import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ingreso from '@/models/Ingreso';
import { EstadoPago } from '@/types/finance';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';

export async function GET() {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  try {
    await dbConnect();

    const ingresos = await (Ingreso as any).find({ estado: EstadoPago.PAGADO }).sort({ fecha: -1 });

    const totalHistorico = ingresos.reduce((acc, curr) => acc + curr.monto, 0);

    const porCategoria = ingresos.reduce((acc: any, curr) => {
      acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.monto;
      return acc;
    }, {});

    const porMetodo = ingresos.reduce((acc: any, curr) => {
      acc[curr.metodo] = (acc[curr.metodo] || 0) + curr.monto;
      return acc;
    }, {});

    const recientes = ingresos.slice(0, 10);

    return NextResponse.json({
      stats: { totalHistorico, porCategoria, porMetodo, count: ingresos.length },
      recientes
    });
  } catch (error: any) {
    console.error('Error al obtener estadísticas financieras:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

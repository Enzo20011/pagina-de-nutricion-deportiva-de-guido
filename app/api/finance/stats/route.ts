import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Ingreso from '@/models/Ingreso';
import { EstadoPago } from '@/types/finance';

async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

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

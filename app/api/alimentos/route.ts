import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Alimento from '@/models/Alimento';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';
import { searchUSDA } from '@/lib/usdaApi';

export async function GET(req: Request) {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria');

  try {
    const query: any = {};
    
    if (search) {
      query.nombre = { $regex: search, $options: 'i' };
    }
    
    // Si la categoría es USDA o ALL, buscamos en USDA de forma secundaria
    let usdaResults: any[] = [];
    if (categoria === 'USDA' || categoria === 'ALL') {
       usdaResults = await searchUSDA(search);
    }

    if (categoria === 'USDA') {
      return NextResponse.json({ data: usdaResults });
    }

    // Buscamos en local (MongoDB)
    // Filtramos por fuente específica si no es 'ALL' ni 'USDA'
    if (categoria && categoria !== 'ALL' && categoria !== 'USDA') {
      query.fuente = categoria;
    }

    const localAlimentos = await (Alimento as any).find(query).limit(30).lean();
    const formattedLocal = localAlimentos.map((a: any) => ({
      ...a,
      origen: a.fuente || 'Nutrinfo'
    }));

    // Combinación Híbrida Inteligente (Prioridad Local)
    let finalResults = formattedLocal;
    
    if (categoria === 'ALL' || finalResults.length < 10) {
       // Agregar resultados de USDA evitando duplicados de nombre exacto si existen
       const existingNames = new Set(finalResults.map(r => r.nombre.toLowerCase()));
       const filteredUSDA = usdaResults.filter(r => !existingNames.has(r.nombre.toLowerCase()));
       
       finalResults = [...finalResults, ...filteredUSDA].slice(0, 50);
    }

    return NextResponse.json({ data: finalResults });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

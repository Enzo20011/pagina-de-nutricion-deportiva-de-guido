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
    
    // Si la categoría es USDA, solo buscamos en USDA
    if (categoria === 'USDA') {
      const usdaResults = await searchUSDA(search);
      return NextResponse.json({ data: usdaResults });
    }

    if (categoria && categoria !== 'ALL' && categoria !== 'Nutrinfo') {
      query.categoria = categoria;
    }

    // Buscamos en local (Nutrinfo)
    const localAlimentos = await (Alimento as any).find(query).limit(20).lean();
    const formattedLocal = localAlimentos.map((a: any) => ({
      ...a,
      origen: 'Nutrinfo'
    }));

    // Si la categoría es ALL o Nutrinfo, podemos complementar con USDA si la búsqueda es genérica
    let results = formattedLocal;
    if (categoria === 'ALL' || results.length < 5) {
       const usdaResults = await searchUSDA(search);
       // Combinar y evitar duplicados básicos por nombre si es necesario
       results = [...results, ...usdaResults].slice(0, 30);
    }

    return NextResponse.json({ data: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

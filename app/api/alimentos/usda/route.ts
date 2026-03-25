import { NextResponse } from 'next/server';
import translate from 'translate';

translate.engine = 'google';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.USDA_API_KEY;

  if (!query) return NextResponse.json({ error: 'Falta búsqueda' }, { status: 400 });

  try {
    const queryEn = await translate(query, { from: 'es', to: 'en' });
    const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(queryEn)}&api_key=${apiKey}&pageSize=5`);
    const data = await res.json();

    if (!data.foods) return NextResponse.json([]);

    const alimentosLimpios = await Promise.all(data.foods.map(async (food: any) => {
      const getNutrient = (id: number) => food.foodNutrients.find((n: any) => n.nutrientId === id)?.value || 0;
      
      let nombreTraducido = food.description;
      try {
        nombreTraducido = await translate(food.description, { from: 'en', to: 'es' });
      } catch (e) {
        console.error('Error traduciendo descripción USDA:', e);
      }
      
      const nombreFormateado = nombreTraducido.charAt(0).toUpperCase() + nombreTraducido.slice(1).toLowerCase();

      return {
        idExterno: food.fdcId.toString(),
        nombre: nombreFormateado,
        calorias: getNutrient(1008),
        proteinas: getNutrient(1003),
        carbohidratos: getNutrient(1005),
        grasas: getNutrient(1004),
        origen: 'USDA' as const
      };
    }));

    return NextResponse.json(alimentosLimpios);
  } catch (error: any) {
    console.error('USDA API Error:', error);
    return NextResponse.json({ error: 'Error USDA', details: error.message }, { status: 500 });
  }
}

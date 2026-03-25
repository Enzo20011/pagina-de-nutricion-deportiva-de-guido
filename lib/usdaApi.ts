import translate from 'translate';

const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Configurar motor de traducción
translate.engine = 'google';

export interface USDAFood {
  fdcId: number;
  description: string;
  foodNutrients: any[];
}

export async function searchUSDA(query: string) {
  try {
    // 1. Traducir búsqueda de ES a EN para mejor precisión en USDA
    const translatedQuery = await translate(query, { from: 'es', to: 'en' });
    
    const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(translatedQuery)}&pageSize=10`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const foods = data.foods || [];

    const processedFoods = await Promise.all(foods.map(async (f: any) => {
      const nutrients = f.foodNutrients || [];
      
      // Helper to find nutrient value
      const getNutrient = (idOrName: number | string) => {
        const nut = nutrients.find((n: any) => 
          n.nutrientId === idOrName || n.nutrientName?.includes(idOrName)
        );
        return nut ? nut.value : 0;
      };

      // 2. Traducir descripción del alimento al español
      let nombreEsp = f.description;
      try {
        nombreEsp = await translate(f.description, { from: 'en', to: 'es' });
      } catch (e) {
        console.error('Error traduciendo alimento:', e);
      }

      return {
        idExterno: `usda-${f.fdcId}`,
        nombre: nombreEsp,
        calorias: getNutrient(1008) || getNutrient('Energy'),
        proteinas: getNutrient(1003) || getNutrient('Protein'),
        grasas: getNutrient(1004) || getNutrient('Total lipid'),
        carbohidratos: getNutrient(1005) || getNutrient('Carbohydrate'),
        origen: 'USDA' as const
      };
    }));

    return processedFoods;
  } catch (error) {
    console.error('Error searching USDA:', error);
    return [];
  }
}

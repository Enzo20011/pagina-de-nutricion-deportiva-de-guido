const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAFood {
  fdcId: number;
  description: string;
  foodNutrients: any[];
}

export async function searchUSDA(query: string) {
  try {
    const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const foods = data.foods || [];

    return foods.map((f: any) => {
      const nutrients = f.foodNutrients || [];
      
      // Helper to find nutrient value
      const getNutrient = (idOrName: number | string) => {
        const nut = nutrients.find((n: any) => 
          n.nutrientId === idOrName || n.nutrientName?.includes(idOrName)
        );
        return nut ? nut.value : 0;
      };

      return {
        _id: `usda-${f.fdcId}`,
        nombre: f.description,
        categoria: 'USDA',
        kcal: getNutrient(1008) || getNutrient('Energy'),
        proteinas: getNutrient(1003) || getNutrient('Protein'),
        grasas: getNutrient(1004) || getNutrient('Total lipid'),
        carbohidratos: getNutrient(1005) || getNutrient('Carbohydrate'),
        porcionBaseGramos: 100,
        origen: 'USDA'
      };
    });
  } catch (error) {
    console.error('Error searching USDA:', error);
    return [];
  }
}

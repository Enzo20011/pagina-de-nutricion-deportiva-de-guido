import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/guido-nutricion';

const AlimentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, index: true },
  categoria: { type: String, required: true },
  kcal: { type: Number, required: true },
  proteinas: { type: Number, required: true },
  grasas: { type: Number, required: true },
  carbohidratos: { type: Number, required: true },
  porcionBaseGramos: { type: Number, default: 100 },
});

const Alimento = mongoose.models.Alimento || mongoose.model('Alimento', AlimentoSchema);

const CATEGORIES = [
  'Lácteos', 'Carnes', 'Panificados', 'Galletitas', 'Bebidas', 'Frutas', 'Verduras', 'Cereales', 'Snacks'
];

async function scrapeNutrinfo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Conectado a MongoDB...');

    for (const category of CATEGORIES) {
      console.log(`🔍 Buscando categoría: ${category}...`);
      
      // Nutrinfo endpoint discovered by browser agent
      const url = `https://nutrinfo.com/api/vademecum/products?q=${encodeURIComponent(category)}&limit=50`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        console.error(`❌ Error en fetch para ${category}:`, response.status);
        continue;
      }

      const json: any = await response.json();
      const products = json.data || [];

      let imported = 0;
      for (const p of products) {
        // Normalize fields based on Nutrinfo API structure
        const foodData = {
          nombre: p.name,
          categoria: category,
          kcal: p.calories || p.kcal || 0,
          proteinas: p.protein || 0,
          grasas: p.fat || 0,
          carbohidratos: p.carbohydrates || p.carbs || 0,
          porcionBaseGramos: p.serving_size_grams || 100,
        };

        if (foodData.kcal === 0) continue; // Skip items without data

        await Alimento.findOneAndUpdate(
          { nombre: foodData.nombre },
          foodData,
          { upsert: true, new: true }
        );
        imported++;
      }
      console.log(`✅ Importados ${imported} alimentos de ${category}.`);
    }

    console.log('🚀 Finalizado el seeding de Nutrinfo.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
}

scrapeNutrinfo();

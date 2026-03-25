const mongoose = require('mongoose');

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
      
      const url = `https://nutrinfo.com/api/vademecum/products?q=${encodeURIComponent(category)}&limit=50`;
      
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
           console.error(`❌ Error HTTP ${response.status} en ${category}`);
           continue;
        }

        const text = await response.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          console.error(`❌ El servidor no devolvió JSON válido para ${category}. Longitud: ${text.length}`);
          console.log('Primeros 100 caracteres:', text.substring(0, 100));
          continue;
        }

        const products = json.data || json.products || [];

        let imported = 0;
        for (const p of products) {
          const foodData = {
            nombre: p.name || p.nombre,
            categoria: category,
            kcal: p.calories || p.kcal || p.valor_energetico || 0,
            proteinas: p.protein || p.proteinas || 0,
            grasas: p.fat || p.grasas || 0,
            carbohidratos: p.carbohydrates || p.carbs || p.carbohidratos || 0,
            porcionBaseGramos: p.serving_size_grams || 100,
          };

          if (!foodData.nombre || foodData.kcal === 0) continue;

          await Alimento.findOneAndUpdate(
            { nombre: foodData.nombre },
            foodData,
            { upsert: true, new: true }
          );
          imported++;
        }
        console.log(`✅ Importados ${imported} alimentos de ${category}.`);
      } catch (err) {
        console.error(`❌ Error en categoría ${category}:`, err.message);
      }
    }

    console.log('🚀 Finalizado el seeding de Nutrinfo.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
}

scrapeNutrinfo();

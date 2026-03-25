const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const DATA_FILE = path.join(__dirname, '../data/argenfoods.json');

const files = [
    "Carnes.xls", "CarnesAG.xls", "Carnes_y_derivados.xls", "Cereales.xls",
    "Frutas.xls", "Grasas.xls", "Huevo.xls", "Huevos_y_derivados.xls",
    "Leche.xls", "Leche_y_derivados.xls", "Misc.xls", "Pescados.xls",
    "PescadosAG.xls", "ProdAz.xls", "Trans.xls", "Trans1.xls", "Vegetales.xls"
];

function cleanNumber(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = val.toString().replace(',', '.').replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
}

function processFile(filename) {
    const filePath = path.join(SCRIPTS_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Archivo no encontrado: ${filename}`);
        return [];
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let headerIndex = -1;
    let colIndices = { nombre: -1, calorias: -1, proteinas: -1, carbohidratos: -1, grasas: -1 };

    // Buscar fila de encabezados
    for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const row = rows[i];
        if (!row) continue;
        
        const rowText = row.join(' ').toLowerCase();
        if (rowText.includes('alimento') || rowText.includes('descrip')) {
            headerIndex = i;
            row.forEach((cell, idx) => {
                const c = cell?.toString().toLowerCase() || '';
                if (c.includes('alimento') || c.includes('descrip')) colIndices.nombre = idx;
                if (c.includes('energ') || c.includes('kcal')) colIndices.calorias = idx;
                if (c.includes('prote')) colIndices.proteinas = idx;
                if (c.includes('carbo') || c.includes('h. de c')) colIndices.carbohidratos = idx;
                if (c.includes('lípid') || c.includes('lipid') || c.includes('grasas')) colIndices.grasas = idx;
            });
            break;
        }
    }

    if (headerIndex === -1 || colIndices.nombre === -1) {
        console.error(`❌ No se pudieron identificar las columnas en ${filename}`);
        return [];
    }

    const results = [];
    for (let i = headerIndex + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[colIndices.nombre]) continue;

        const entry = {
            nombre: row[colIndices.nombre].toString().trim(),
            calorias: cleanNumber(row[colIndices.calorias]),
            proteinas: cleanNumber(row[colIndices.proteinas]),
            carbohidratos: cleanNumber(row[colIndices.carbohidratos]),
            grasas: cleanNumber(row[colIndices.grasas]),
            origen: 'LOCAL'
        };

        // Filtro básico para evitar filas de sumarios o vacías
        if (entry.nombre.length > 2 && (entry.calorias > 0 || entry.proteinas > 0)) {
            results.push(entry);
        }
    }

    console.log(`✅ ${filename}: ${results.length} alimentos procesados.`);
    return results;
}

let allAlimentos = [];
files.forEach(f => {
    allAlimentos = allAlimentos.concat(processFile(f));
});

// Eliminar duplicados por nombre
const uniqueResults = [];
const seen = new Set();
allAlimentos.forEach(item => {
    if (!seen.has(item.nombre)) {
        seen.add(item.nombre);
        uniqueResults.push(item);
    }
});

fs.writeFileSync(DATA_FILE, JSON.stringify(uniqueResults, null, 2));
console.log(`\n🚀 TOTAL FINAL: ${uniqueResults.length} alimentos guardados en argenfoods.json`);

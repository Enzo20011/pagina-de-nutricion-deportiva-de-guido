# Procedimiento Estándar: Gestión de Datos ARGENFOODS 🇦🇷

Este documento establece el procedimiento oficial para descargar, limpiar e inyectar la base de datos de ARGENFOODS (Universidad Nacional de Luján) dentro del sistema nutricional.

## Fase 1: Descarga de Archivos Fuente

Los datos originales se encuentran en formato Excel (.xls) en la UNLU.

1. Acceder al directorio: [https://www.argenfood.unlu.edu.ar/Tablas/Grupo/](https://www.argenfood.unlu.edu.ar/Tablas/Grupo/)
2. Archivos recomendados:
   * `Carnes.xls`
   * `Leche.xls` (Lácteos)
   * `Vegetales.xls`
   * `Frutas.xls`
   * `Cereales.xls`

## Fase 2: Limpieza y Estandarización (En Excel)

1. **Consolidación:** Crear un único archivo Excel maestro.
2. **Columnas requeridas:** Mantener solo: `nombre`, `calorias`, `proteinas`, `carbohidratos`, `grasas`.
3. **Renombrar encabezados:** Deben estar estrictamente en minúsculas.
4. **Origen:** Agregar columna `origen` y rellenar todas las celdas con el valor `LOCAL`.
5. **Validación:** Cero celdas vacías (usar `0` si no aplica).

## Fase 3: Conversión a Formato JSON

1. **Conversión:** Usar una herramienta "Excel to JSON converter" online.
2. **Destino:** Copiar el resultado en el archivo del proyecto: `data/argenfoods.json`.

## Fase 4: Volcado en Base de Datos (Seeding)

1. **Servidor:** Asegurarse de que Next.js esté corriendo (`npm run dev`).
2. **Petición:** Realizar un **POST** con Postman o similar.
3. **URL:** `http://localhost:3005/api/seed-alimentos`
4. **Confirmación:** El servidor debe devolver: `{"message": "ARGENFOODS inyectada con éxito."}`.

---

> [!TIP]
> Mantener este procedimiento garantiza que los cálculos de macronutrientes en el panel administrativo sean siempre precisos y consistentes con las fuentes nacionales.

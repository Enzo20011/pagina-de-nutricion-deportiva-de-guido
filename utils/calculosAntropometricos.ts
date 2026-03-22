/**
 * Motor Antropométrico
 * Fórmulas para composición corporal.
 */

/**
 * Calcula el Índice de Masa Corporal (IMC).
 * IMC = peso (kg) / altura^2 (m)
 */
export const calcularIMC = (peso: number, alturaCm: number): number => {
  const alturaM = alturaCm / 100;
  return Number((peso / (alturaM * alturaM)).toFixed(1));
};

/**
 * Calcula el porcentaje de grasa usando la fórmula de Faulkner (4 pliegues).
 * % Grasa = (Tríceps + Subescapular + Suprailíaco + Abdominal) * 0.153 + 5.783
 */
export const calcularGrasaFaulkner = (
  triceps: number,
  subescapular: number,
  suprailiaco: number,
  abdominal: number
): number => {
  const sumaPliegues = triceps + subescapular + suprailiaco + abdominal;
  return Number((sumaPliegues * 0.153 + 5.783).toFixed(1));
};

/**
 * Calcula Masa Gorda y Masa Magra en kg.
 */
export const calcularComposicionCorporal = (peso: number, porcentajeGrasa: number) => {
  const masaGorda = (peso * porcentajeGrasa) / 100;
  const masaMagra = peso - masaGorda;

  return {
    masaGordaKg: Number(masaGorda.toFixed(2)),
    masaMagraKg: Number(masaMagra.toFixed(2)),
  };
};

/**
 * Clasificación de IMC según la OMS.
 */
export const clasificarIMC = (imc: number): string => {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidad I';
  if (imc < 40) return 'Obesidad II';
  return 'Obesidad III';
};

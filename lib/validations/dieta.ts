import { z } from 'zod';

export const itemComidaSchema = z.object({
  alimentoId: z.string().optional(),
  nombreAlimento: z.string().min(1, 'Nombre de alimento requerido'),
  cantidadGramos: z.number().positive(),
  kcal: z.number().nonnegative(),
  proteinas: z.number().nonnegative(),
  grasas: z.number().nonnegative(),
  carbohidratos: z.number().nonnegative(),
});

export const comidaSchema = z.object({
  nombre: z.string().min(1, 'Nombre de comida requerido'), // Ej: 'Desayuno'
  items: z.array(itemComidaSchema),
});

export const dietaSchema = z.object({
  pacienteId: z.string().min(1, 'pacienteId es requerido'),
  objetivoCalorico: z.number().positive('El objetivo calórico debe ser positivo'),
  comidas: z.array(comidaSchema),
  macrosObjetivo: z.object({
    proteinasPct: z.number().min(0).max(100),
    grasasPct: z.number().min(0).max(100),
    carbosPct: z.number().min(0).max(100),
  }),
});

export type DietaInput = z.infer<typeof dietaSchema>;

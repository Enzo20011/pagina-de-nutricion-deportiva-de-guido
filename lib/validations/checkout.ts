import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto'),
  email: z.string().email('Email inválido'),
  date: z.string().min(1, 'Fecha requerida'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

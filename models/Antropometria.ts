import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// --- ZOD SCHEMA FOR VALIDATION ---
export const antropometriaSchema = z.object({
  pacienteId: z.string().min(1),
  peso: z.number().min(20).max(300),
  altura: z.number().min(50).max(250),
  // Pliegues (mm)
  triceps: z.number().min(0).optional(),
  subescapular: z.number().min(0).optional(),
  suprailiaco: z.number().min(0).optional(),
  abdominal: z.number().min(0).optional(),
  muslo: z.number().min(0).optional(),
  pierna: z.number().min(0).optional(),
  // Perímetros (cm)
  cintura: z.number().min(0).optional(),
  cadera: z.number().min(0).optional(),
  // Resultados calculados (se pueden guardar o calcular al vuelo)
  porcentajeGrasa: z.number().optional(),
  imc: z.number().optional(),
});

export type AntropometriaInput = z.infer<typeof antropometriaSchema>;

// --- MONGOOSE MODEL ---
export interface IAntropometria extends Document {
  pacienteId: mongoose.Types.ObjectId;
  peso: number;
  altura: number;
  pliegues: {
    triceps?: number;
    subescapular?: number;
    suprailiaco?: number;
    abdominal?: number;
    muslo?: number;
    pierna?: number;
  };
  perimetros: {
    cintura?: number;
    cadera?: number;
  };
  resultados: {
    porcentajeGrasa?: number;
    imc?: number;
    masaGordaKg?: number;
    masaMagraKg?: number;
  };
  createdAt: Date;
}

const AntropometriaSchema: Schema = new Schema(
  {
    pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
    peso: { type: Number, required: true },
    altura: { type: Number, required: true },
    pliegues: {
      triceps: Number,
      subescapular: Number,
      suprailiaco: Number,
      abdominal: Number,
      muslo: Number,
      pierna: Number,
    },
    perimetros: {
      cintura: Number,
      cadera: Number,
    },
    resultados: {
      porcentajeGrasa: Number,
      imc: Number,
      masaGordaKg: Number,
      masaMagraKg: Number,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Antropometria || mongoose.model<IAntropometria>('Antropometria', AntropometriaSchema);

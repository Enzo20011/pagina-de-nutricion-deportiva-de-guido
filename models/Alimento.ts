import mongoose, { Schema, Document } from 'mongoose';

export interface IAlimento extends Document {
  nombre: string;
  categoria: string;
  kcal: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
  porcionBaseGramos: number;
  fuente?: string;
}

const AlimentoSchema: Schema = new Schema({
  nombre: { type: String, required: true, index: true },
  categoria: { type: String, required: true },
  kcal: { type: Number, required: true },
  proteinas: { type: Number, required: true },
  grasas: { type: Number, required: true },
  carbohidratos: { type: Number, required: true },
  porcionBaseGramos: { type: Number, default: 100 },
  fuente: { type: String, default: 'Nutrinfo', index: true },
});

export default mongoose.models.Alimento || mongoose.model<IAlimento>('Alimento', AlimentoSchema);

import mongoose, { Schema, Document, models } from 'mongoose';

export interface IAlimento extends Document {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  origen: 'LOCAL' | 'USDA' | 'CUSTOM';
  idExterno?: string;
}

const alimentoSchema = new Schema({
  nombre: { type: String, required: true },
  calorias: { type: Number, required: true },
  proteinas: { type: Number, required: true },
  carbohidratos: { type: Number, required: true },
  grasas: { type: Number, required: true },
  origen: { 
    type: String, 
    enum: ['LOCAL', 'USDA', 'CUSTOM'], 
    default: 'CUSTOM' 
  },
  idExterno: { type: String, required: false }
});

alimentoSchema.index({ nombre: 'text' });

const Alimento = models.Alimento || mongoose.model<IAlimento>('Alimento', alimentoSchema);
export default Alimento;

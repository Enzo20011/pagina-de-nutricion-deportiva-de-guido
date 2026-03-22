import mongoose, { Schema, Document } from 'mongoose';

export interface IItemComida {
  alimentoId: mongoose.Types.ObjectId;
  nombreAlimento: string; // Redundancia para evitar demasiados joins en UI
  cantidadGramos: number;
  kcal: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}

export interface IComida {
  nombre: string; // Ej: 'Desayuno', 'Almuerzo'
  items: IItemComida[];
}

export interface IPlanAlimentario extends Document {
  pacienteId: mongoose.Types.ObjectId;
  fechaInicio: Date;
  objetivoCalorico: number;
  comidas: IComida[];
  macrosObjetivo: {
    proteinasPct: number;
    grasasPct: number;
    carbosPct: number;
  };
  createdAt: Date;
}

const PlanAlimentarioSchema: Schema = new Schema(
  {
    pacienteId: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
    fechaInicio: { type: Date, default: Date.now },
    objetivoCalorico: { type: Number, required: true },
    comidas: [
      {
        nombre: String,
        items: [
          {
            alimentoId: { type: Schema.Types.ObjectId, ref: 'Alimento' },
            nombreAlimento: String,
            cantidadGramos: Number,
            kcal: Number,
            proteinas: Number,
            grasas: Number,
            carbohidratos: Number,
          },
        ],
      },
    ],
    macrosObjetivo: {
      proteinasPct: Number,
      grasasPct: Number,
      carbosPct: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PlanAlimentario || mongoose.model<IPlanAlimentario>('PlanAlimentario', PlanAlimentarioSchema);

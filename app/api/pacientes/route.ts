import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Paciente from '@/models/Paciente';
import { pacienteSchema } from '@/lib/validations/paciente';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ZodError } from 'zod';

/**
 * GET /api/pacientes
 * Retrieves paginated list of patients.
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const search = url.searchParams.get('search') || '';

    const query: any = includeDeleted ? {} : { isDeleted: false };
    
    if (search) {
      // If search is numeric, prioritize DNI match
      if (/^\d+$/.test(search)) {
        query.$or = [
          { dni: { $regex: search, $options: 'i' } },
          { nombre: { $regex: search, $options: 'i' } },
          { apellido: { $regex: search, $options: 'i' } }
        ];
      } else {
        query.$or = [
          { nombre: { $regex: search, $options: 'i' } },
          { apellido: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
    }

    const skip = (page - 1) * limit;

    const [pacientes, total] = await Promise.all([
      (Paciente as any).find(query).sort({ apellido: 1, nombre: 1 }).skip(skip).limit(limit).lean(),
      (Paciente as any).countDocuments(query)
    ]);

    return apiSuccess(pacientes, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error: any) {
    console.error('Error al obtener pacientes:', error);
    return apiError(error.message, 500);
  }
}

/**
 * POST /api/pacientes
 * Create a new patient with Zod Validation.
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Zod runtime validation
    const validatedData = pacienteSchema.parse(body);

    // 2. Database Insert
    const nuevoPaciente = await (Paciente as any).create({ ...validatedData, isDeleted: false });
    
    return apiSuccess(nuevoPaciente, undefined, 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return apiError('Datos de paciente inválidos', 400, error.errors);
    }
    console.error('Error al crear paciente:', error);
    return apiError(error.message, 500);
  }
}

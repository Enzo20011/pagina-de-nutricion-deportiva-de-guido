import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Paciente from '@/models/Paciente';
import { pacienteSchema } from '@/lib/validations/paciente';

interface Params {
  params: { id: string };
}
/**
 * GET /api/pacientes/[id]
 * Get a single patient by ID (even deleted ones, for recovery purposes).
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    await dbConnect();
    const paciente = await (Paciente as any).findById(params.id);
    if (!paciente) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    return NextResponse.json(paciente);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/pacientes/[id]
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Special "restore" action (Bypasses regular schema validation)
    if (body.restore === true) {
      const updated = await (Paciente as any).findByIdAndUpdate(
        params.id,
        { isDeleted: false },
        { new: true }
      );
      if (!updated) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
      return NextResponse.json({ message: 'Paciente restaurado exitosamente', paciente: updated });
    }

    // 2. Regular update with PARTIAL VALIDATION
    // We use .partial() because PATCH usually only sends changed fields
    const validation = pacienteSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de actualización inválidos', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const safeData = validation.data;
    
    const updated = await (Paciente as any).findByIdAndUpdate(
      params.id,
      { $set: safeData },
      { new: true, runValidators: true }
    );
    if (!updated) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/pacientes/[id]
 * ⚠️  SOFT DELETE — does NOT remove from MongoDB.
 * Sets isDeleted: true to preserve clinical history records.
 * 
 * For permanent deletion, a manual MongoDB operation is required.
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    await dbConnect();

    const updated = await (Paciente as any).findByIdAndUpdate(
      params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Paciente archivado (soft delete). Los datos clínicos se mantienen intactos.',
      id: params.id,
    });
  } catch (error: any) {
    console.error('Error en soft delete de paciente:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

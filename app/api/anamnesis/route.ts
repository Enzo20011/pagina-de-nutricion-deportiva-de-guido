import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Anamnesis from '@/models/Anamnesis';
import { anamnesisSchema, draftAnamnesisSchema } from '@/schemas/anamnesisSchema';

async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return null;
}

/**
 * GET /api/anamnesis?pacienteId=xxx
 * Returns the latest anamnesis for a patient.
 */
export async function GET(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('pacienteId');

    if (!pacienteId) {
      return NextResponse.json({ error: 'pacienteId requerido' }, { status: 400 });
    }

    const anamnesis = await (Anamnesis as any).findOne({
      pacienteId,
      isDeleted: false,
    }).sort({ updatedAt: -1 });

    if (!anamnesis) {
      return NextResponse.json({ data: null, message: 'Sin anamnesis registrada' }, { status: 200 });
    }

    return NextResponse.json({ data: anamnesis });
  } catch (error: any) {
    console.error('Error al obtener anamnesis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/anamnesis
 * Create or update anamnesis (upsert by pacienteId).
 */
export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    await dbConnect();
    const body = await request.json();
    const isDraft = body.isDraft === true;

    const schema = isDraft ? draftAnamnesisSchema : anamnesisSchema;
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: 'Error de validación',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const anamnesisActualizada = await (Anamnesis as any).findOneAndUpdate(
      { pacienteId: validation.data.pacienteId, isDeleted: false },
      { ...validation.data, isDraft },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: isDraft ? 'Borrador guardado' : 'Anamnesis finalizada correctamente',
        data: anamnesisActualizada,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error en API Anamnesis:', error);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/anamnesis?pacienteId=xxx
 * Soft-deletes the anamnesis record (isDeleted: true).
 */
export async function DELETE(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('pacienteId');

    if (!pacienteId) {
      return NextResponse.json({ error: 'pacienteId requerido' }, { status: 400 });
    }

    await (Anamnesis as any).updateMany(
      { pacienteId, isDeleted: false },
      { isDeleted: true }
    );

    return NextResponse.json({ message: 'Anamnesis archivada correctamente' });
  } catch (error: any) {
    console.error('Error al archivar anamnesis:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

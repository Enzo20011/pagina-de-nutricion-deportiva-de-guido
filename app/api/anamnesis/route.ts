import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Anamnesis from '@/models/Anamnesis';
import { anamnesisSchema, draftAnamnesisSchema } from '@/schemas/anamnesisSchema';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function logServerSide(msg: string) {
  const logPath = 'c:/Users/enzul/OneDrive/Escritorio/guido/tmp_api_log.txt';
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ANAMNESIS: ${msg}\n`);
}

export async function GET(request: Request) {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('pacienteId');

    if (!pacienteId) return NextResponse.json({ error: 'pacienteId requerido' }, { status: 400 });

    const cleanId = String(pacienteId).trim();
    if (!/^[0-9a-fA-F]{24}$/.test(cleanId)) {
        return NextResponse.json({ error: 'Formato de ID inválido' }, { status: 400 });
    }

    const pacienteObjectId = new mongoose.Types.ObjectId(cleanId);
    const anamnesis = await (Anamnesis as any).findOne({ pacienteId: pacienteObjectId, isDeleted: false }).sort({ updatedAt: -1 });
    logServerSide(`GET SUCCESS: Paciente=${cleanId}, Found=${!!anamnesis}`);
    return NextResponse.json({ data: anamnesis || null });
  } catch (error: any) {
    logServerSide(`GET ERROR: ${error.message}\n${error.stack}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  try {
    await dbConnect();
    const body = await request.json();
    const isDraft = body.isDraft === true;
    
    logServerSide(`POST START: Draft=${isDraft}, Paciente=${body.pacienteId}, Body=${JSON.stringify(body)}`);

    const schema = isDraft ? draftAnamnesisSchema : anamnesisSchema;
    const validation = schema.safeParse(body);

    if (!validation.success && !isDraft) {
      logServerSide(`VALIDATION FAILED: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
      return NextResponse.json({ message: 'Error de validación', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const dataToSave = validation.success ? validation.data : body;
    const targetId = dataToSave.pacienteId || body.pacienteId;

    if (!targetId) {
      logServerSide('ERROR: NO ID IN BODY');
      return NextResponse.json({ message: 'pacienteId es requerido' }, { status: 400 });
    }

    // Explicit casting to string before ObjectId to avoid [object Object] errors
    const cleanId = String(targetId).trim();
    if (!/^[0-9a-fA-F]{24}$/.test(cleanId)) {
        logServerSide(`ERROR: INVALID ID FORMAT: "${cleanId}"`);
        return NextResponse.json({ message: 'Formato de ID de paciente inválido' }, { status: 400 });
    }

    const pacienteObjectId = new mongoose.Types.ObjectId(cleanId);

    const doc = await (Anamnesis as any).findOneAndUpdate(
      { pacienteId: pacienteObjectId, isDeleted: false },
      { ...dataToSave, pacienteId: pacienteObjectId, isDraft },
      { upsert: true, new: true, runValidators: !isDraft }
    );

    logServerSide(`POST SUCCESS: DocID=${doc._id}`);
    return NextResponse.json({ message: isDraft ? 'Borrador guardado' : 'Guardado finalizado', data: doc });
  } catch (error: any) {
    logServerSide(`POST ERROR: ${error.message}\n${error.stack}`);
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}

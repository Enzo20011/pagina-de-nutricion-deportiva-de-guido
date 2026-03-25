import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PlanAlimentario from '@/models/PlanAlimentario';
import { dietaSchema } from '@/lib/validations/dieta';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';
import mongoose from 'mongoose';
import fs from 'fs';

function log(msg: string) {
  const logPath = 'c:/Users/enzul/OneDrive/Escritorio/guido/tmp_api_log.txt';
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] DIETA_CRITICAL: ${msg}\n`);
}

export async function GET(request: Request) {
  log('GET ATTEMPT');
  try {
    const session = await getValidSession();
    if (!session) {
      log('GET UNAUTHORIZED');
      return unauthorizedResponse();
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const pacienteId = searchParams.get('pacienteId');
    log(`GET FOR PACIENTE: ${pacienteId}`);
    
    if (!pacienteId) return NextResponse.json({ error: 'Falta pacienteId' }, { status: 400 });

    const cleanId = String(pacienteId).trim();
    if (!/^[0-9a-fA-F]{24}$/.test(cleanId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const pId = new mongoose.Types.ObjectId(cleanId);
    const plan = await (PlanAlimentario as any).findOne({ pacienteId: pId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: plan });
  } catch (e: any) {
    log(`GET CRASH: ${e.message}\n${e.stack}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  log('POST ATTEMPT');
  try {
    const session = await getValidSession();
    if (!session) {
      log('POST UNAUTHORIZED');
      return unauthorizedResponse();
    }
    
    await dbConnect();
    const body = await request.json();
    log(`POST BODY RECEIVED for ${body.pacienteId}`);

    const validation = dietaSchema.safeParse(body);
    if (!validation.success) {
      log(`V-FAIL: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
      return NextResponse.json({ error: 'Validación fallida', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { pacienteId: rawId, ...data } = validation.data;
    const cleanId = String(rawId).trim();
    const pId = new mongoose.Types.ObjectId(cleanId);
    
    const plan = await (PlanAlimentario as any).findOneAndUpdate(
      { pacienteId: pId },
      { pacienteId: pId, ...data, updatedAt: new Date() },
      { upsert: true, new: true, runValidators: false }
    );

    log(`POST SUCCESS: ${plan._id}`);
    return NextResponse.json({ data: plan });
  } catch (e: any) {
    log(`POST CRASH: ${e.message}\n${e.stack}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

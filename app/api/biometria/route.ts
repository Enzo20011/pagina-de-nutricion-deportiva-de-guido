import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getValidSession, unauthorizedResponse } from '@/lib/protectApi';
import mongoose from 'mongoose';
import fs from 'fs';

function log(msg: string) {
  const logPath = 'c:/Users/enzul/OneDrive/Escritorio/guido/tmp_api_log.txt';
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] BIOMETRIA_FINAL: ${msg}\n`);
}

export async function GET(request: Request) {
  log('GET START');
  try {
    const session = await getValidSession();
    if (!session) return unauthorizedResponse();
    
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const pId = searchParams.get('pacienteId');
    log(`GET PACIENTE=${pId}`);

    const cleanId = String(pId).trim();
    if (!/^[0-9a-fA-F]{24}$/.test(cleanId)) {
        return NextResponse.json({ error: 'Formato de ID inválido' }, { status: 400 });
    }
    const pacienteObjectId = new mongoose.Types.ObjectId(cleanId);

    const Antropometria = (await import('@/models/Antropometria')).default;
    const data = await (Antropometria as any).find({ pacienteId: pacienteObjectId }).sort({ createdAt: 1 });
    return NextResponse.json({ data });
  } catch(e: any) {
    log(`GET CRASH: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  log('POST START');
  try {
    const session = await getValidSession();
    if (!session) { log('401'); return unauthorizedResponse(); }
    
    await dbConnect();
    const body = await request.json();
    log(`POST BODY FOR ${body.pacienteId}`);

    const { antropometriaSchema } = await import('@/schemas/antropometriaSchema');
    const validation = antropometriaSchema.safeParse(body);
    if (!validation.success) {
      log('V-FAIL');
      return NextResponse.json({ error: 'Validación fallida' }, { status: 400 });
    }

    const Antropometria = (await import('@/models/Antropometria')).default;
    const { pacienteId: rawId, ...data } = validation.data;
    const pId = new mongoose.Types.ObjectId(rawId);
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const doc = await (Antropometria as any).findOneAndUpdate(
      { pacienteId: pId, createdAt: { $gte: startOfDay } },
      { pacienteId: pId, ...data },
      { upsert: true, new: true, runValidators: false }
    );

    log(`POST SUCCESS: ${doc._id}`);
    return NextResponse.json({ data: doc });
  } catch(e: any) {
    log(`POST CRASH: ${e.message}\n${e.stack}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

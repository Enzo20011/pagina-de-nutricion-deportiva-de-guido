
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Anamnesis from '@/models/Anamnesis';
import Antropometria from '@/models/Antropometria';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    const pacienteId = '69bf05dcac13bfc25992d202';
    const objId = new mongoose.Types.ObjectId(pacienteId);

    const report: any = { anamnesis: [], biometria: [] };

    const docsAn = await Anamnesis.find({ 
      $or: [{ pacienteId: pacienteId }, { pacienteId: objId }] 
    }).lean();
    
    report.anamnesis = docsAn.map((d: any) => ({
      id: d._id,
      pacienteId: d.pacienteId,
      pacienteIdType: typeof d.pacienteId,
      isDeleted: d.isDeleted,
      updatedAt: d.updatedAt
    }));

    const docsBio = await Antropometria.find({ 
      $or: [{ pacienteId: pacienteId }, { pacienteId: objId }] 
    }).lean();

    report.biometria = docsBio.map((d: any) => ({
      id: d._id,
      pacienteId: d.pacienteId,
      pacienteIdType: typeof d.pacienteId,
      isDeleted: d.isDeleted,
      updatedAt: d.updatedAt
    }));

    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

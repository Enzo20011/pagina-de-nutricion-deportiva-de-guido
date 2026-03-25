import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Alimento from '@/models/Alimento';
import dbLocal from '@/data/argenfoods.json';

export async function POST() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/guido-nutricion';
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri);
    }
    
    console.log('--- SEED PROCESS START ---');
    console.log('Items to seed:', dbLocal.length);

    // 1. Limpiar registros previos de ARGENFOODS
    const deleteResult = await Alimento.deleteMany({ origen: 'LOCAL' });
    console.log('Cleaned items:', deleteResult.deletedCount);

    // 2. Insertar nuevos registros
    const insertResult = await Alimento.insertMany(dbLocal);
    console.log('Inserted items successfully:', insertResult.length);

    return NextResponse.json({ 
      message: 'ARGENFOODS inyectada con éxito.',
      count: insertResult.length 
    });
  } catch (error: any) {
    console.error('--- SEED PROCESS ERROR ---');
    console.error(error);
    return NextResponse.json({ 
      error: 'Error en el volcado', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

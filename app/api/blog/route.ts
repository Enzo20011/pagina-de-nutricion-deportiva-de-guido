import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { getValidSession } from '@/lib/protectApi';

// GET: Listar posts
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Si no es admin, solo mostrar publicados
    const query = isAdmin ? {} : { publicado: true };
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Crear post (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getValidSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Generar slug si no existe
    if (!body.slug) {
      body.slug = body.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const newPost = await Post.create(body);
    return NextResponse.json(newPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

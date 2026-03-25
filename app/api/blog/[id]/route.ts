import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { getValidSession } from '@/lib/protectApi';

// GET: Post por slug
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug: params.id });
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Editar post (Admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getValidSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const post = await Post.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Borrar post (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getValidSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const post = await Post.findByIdAndDelete(params.id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post eliminado exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

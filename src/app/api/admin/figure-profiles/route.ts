import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const figures = await prisma.figureProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: figures });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat figur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, position, unitKerja, quote, fullStory, photoUrl, isSpotlight } = body;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const newFigure = await prisma.figureProfile.create({
      data: {
        name,
        slug,
        position,
        unitKerja,
        quote,
        fullStory,
        photoUrl,
        isSpotlight: Boolean(isSpotlight),
      },
    });

    await logActivity({
      userId: user.userId,
      action: 'CREATE',
      module: 'FIGURE',
      targetId: newFigure.id,
      description: `Administrator menambahkan figur Kupas Sosok: ${name}`,
    });

    return NextResponse.json({ success: true, message: 'Profil sosok berhasil ditambahkan!', data: newFigure });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan sosok' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    const deleted = await prisma.figureProfile.delete({ where: { id } });

    await logActivity({
      userId: user.userId,
      action: 'DELETE',
      module: 'FIGURE',
      targetId: id,
      description: `Administrator menghapus figur Kupas Sosok: ${deleted.name}`,
    });

    return NextResponse.json({ success: true, message: 'Sosok berhasil dihapus!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus sosok' }, { status: 500 });
  }
}

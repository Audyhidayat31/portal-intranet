import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { position: { contains: search } },
        { quote: { contains: search } },
        { fullStory: { contains: search } },
        { unitKerja: { contains: search } },
      ];
    }

    const figures = await prisma.figureProfile.findMany({
      where,
      orderBy: [{ isSpotlight: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, data: figures });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat kupas sosok' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      position,
      unitKerja,
      quote,
      fullStory,
      photoUrl,
      isSpotlight,
    } = body;

    if (!name || !fullStory) {
      return NextResponse.json(
        { success: false, message: 'Nama dan kisah lengkap wajib diisi' },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newFigure = await prisma.figureProfile.create({
      data: {
        name,
        slug,
        position: position || 'Insan Berprestasi Perpusnas RI',
        unitKerja: unitKerja || 'Perpustakaan Nasional RI',
        quote: quote || 'Mendedikasikan ilmu untuk kemajuan literasi nusantara.',
        fullStory,
        photoUrl:
          photoUrl ||
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop',
        isSpotlight: Boolean(isSpotlight),
      },
    });

    const user = await getCurrentUser();
    if (user) {
      await logActivity({
        userId: user.userId,
        action: 'CREATE',
        module: 'FIGURE',
        targetId: newFigure.id,
        description: `Menambahkan profil Kupas Sosok baru: ${name}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Profil sosok berhasil ditambahkan!',
      data: newFigure,
    });
  } catch (error) {
    console.error('Error creating figure profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan profil sosok' },
      { status: 500 }
    );
  }
}

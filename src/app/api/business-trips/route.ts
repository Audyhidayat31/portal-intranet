import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {
      type: 'BUSINESS_TRIP',
      status: 'TERBIT',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { destinationCity: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      take: 20,
      include: {
        author: {
          select: {
            name: true,
            nip: true,
            profile: { select: { position: true, unitKerja: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching business trips:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat laporan perjalanan dinas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, destinationCity, attachmentName, publishedAt, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan laporan perjalanan dinas wajib diisi' },
        { status: 400 }
      );
    }

    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 400 }
      );
    }

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}-${Date.now()}`;

    const tripStatus = status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';

    const created = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt: excerpt || content.slice(0, 150),
        body: content,
        type: 'BUSINESS_TRIP',
        status: tripStatus,
        destinationCity: destinationCity || 'Nasional',
        attachmentName: attachmentName || null,
        authorId: defaultUser.id,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan perjalanan dinas berhasil dipublikasikan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating business trip report:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan laporan perjalanan dinas' },
      { status: 500 }
    );
  }
}

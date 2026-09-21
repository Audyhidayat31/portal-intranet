import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {
      type: 'ANNOUNCEMENT',
      status: 'TERBIT',
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } },
      ];
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat pengumuman' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, attachmentName, isPinned, publishedAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan isi pengumuman wajib diisi' },
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

    const created = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt: excerpt || content.slice(0, 150),
        body: content,
        type: 'ANNOUNCEMENT',
        status: 'TERBIT',
        isPinned: Boolean(isPinned),
        attachmentName: attachmentName || null,
        authorId: defaultUser.id,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil dipublikasikan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan pengumuman' },
      { status: 500 }
    );
  }
}


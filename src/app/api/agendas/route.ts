import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {
      type: 'AGENDA',
      status: 'TERBIT',
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } },
        { excerpt: { contains: search } },
        { eventLocation: { contains: search } },
      ];
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { eventStartDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching agendas:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat agenda kegiatan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, eventLocation, coverImage, eventStartDate } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan deskripsi agenda wajib diisi' },
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
        type: 'AGENDA',
        status: 'TERBIT',
        eventLocation: eventLocation || 'Perpustakaan Nasional RI',
        coverImage: coverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY',
        authorId: defaultUser.id,
        eventStartDate: eventStartDate ? new Date(eventStartDate) : new Date(),
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Agenda kegiatan berhasil ditambahkan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating agenda:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan agenda kegiatan' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const statusParam = searchParams.get('status');

    const session = await getCurrentUser();
    const isAdmin =
      session?.role?.toUpperCase() === 'ADMINISTRATOR' ||
      session?.role?.toUpperCase() === 'ADMIN';

    const where: any = {
      type: 'AGENDA',
      AND: [],
    };

    if (isAdmin) {
      if (statusParam) {
        where.status = statusParam;
      } else {
        where.status = { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU', 'Menunggu', 'DRAFT'] };
      }
    } else if (session?.userId) {
      if (statusParam === 'MENUNGGU' || statusParam === 'Menunggu') {
        where.status = { in: ['MENUNGGU', 'Menunggu', 'DRAFT'] };
        where.authorId = session.userId;
      } else if (statusParam === 'TERBIT' || statusParam === 'Terbit') {
        where.status = { in: ['TERBIT', 'PUBLISHED'] };
      } else {
        where.AND.push({
          OR: [
            { status: { in: ['TERBIT', 'PUBLISHED'] } },
            {
              AND: [
                { status: { in: ['MENUNGGU', 'Menunggu', 'DRAFT'] } },
                { authorId: session.userId },
              ],
            },
          ],
        });
      }
    } else {
      where.status = { in: ['TERBIT', 'PUBLISHED'] };
    }

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search } },
          { body: { contains: search } },
          { excerpt: { contains: search } },
          { eventLocation: { contains: search } },
        ],
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: { eventStartDate: 'desc' },
      include: {
        author: { select: { name: true, nip: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
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
    const { title, excerpt, content, eventLocation, coverImage, coverImageName, eventStartDate, attachmentName, attachmentUrl, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan deskripsi agenda wajib diisi' },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();
    let authorId = session?.userId;

    if (!authorId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 400 }
        );
      }
      authorId = defaultUser.id;
    }

    const agendaStatus = status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';
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
        status: agendaStatus,
        eventLocation: eventLocation || 'Perpustakaan Nasional RI',
        coverImage: coverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY',
        source: coverImageName || null,
        authorId: authorId,
        attachmentName: attachmentName,
        attachmentUrl: attachmentUrl,
        eventStartDate: eventStartDate ? new Date(eventStartDate) : new Date(),
        publishedAt: new Date(),
      },
    });

    await logActivity({
      userId: authorId,
      action: 'CREATE',
      module: 'AGENDA',
      targetId: created.id,
      description: `Menambahkan agenda baru: ${title}`,
      details: {
        title,
        status: agendaStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
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

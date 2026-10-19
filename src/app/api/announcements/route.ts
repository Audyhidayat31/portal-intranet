import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromRequest } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const session = await getSessionUserFromRequest(request);

    const where: any = {
      type: 'ANNOUNCEMENT',
      AND: [],
    };

    const roleUpper = session?.role?.toUpperCase();
    if (roleUpper === 'ADMINISTRATOR' || roleUpper === 'ADMIN') {
      where.status = { in: ['TERBIT', 'MENUNGGU', 'DRAFT'] };
    } else if (session?.userId) {
      where.AND.push({
        OR: [
          { status: 'TERBIT' },
          { authorId: session.userId }
        ]
      });
    } else {
      where.status = 'TERBIT';
    }

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search } },
          { body: { contains: search } },
        ],
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
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
    const { title, excerpt, content, attachmentName, attachmentUrl, isPinned, publishedAt, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan isi pengumuman wajib diisi' },
        { status: 400 }
      );
    }

    const session = await getSessionUserFromRequest(request);
    let authorId;
    if (session && session.userId) {
      authorId = session.userId;
    } else {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 400 }
        );
      }
      authorId = defaultUser.id;
    }

    const postStatus = status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';

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
        status: postStatus,
        isPinned: Boolean(isPinned),
        attachmentName: attachmentName || null,
        attachmentUrl: attachmentUrl || null,
        authorId,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    try {
      const announceDate = publishedAt ? new Date(publishedAt) : new Date();
      await logActivity({
        userId: authorId,
        action: 'CREATE',
        module: 'ANNOUNCEMENT',
        targetId: created.id,
        description: `Menambah Pengumuman: ${title}`,
        details: {
          title,
          category: 'Pengumuman',
          source: '-',
          tanggal: announceDate.toISOString(),
          attachmentUrl: attachmentUrl || null,
          attachmentName: attachmentName || null,
          status: postStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
          publishedAt: announceDate.toISOString(),
          contentExcerpt: excerpt || content.slice(0, 150),
        },
      });
    } catch (logErr) {
      console.warn('Failed to log announcement create:', logErr);
    }

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


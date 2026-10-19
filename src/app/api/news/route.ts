import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const statusParam = searchParams.get('status');

    const session = await getCurrentUser();
    const isAdmin =
      session?.role?.toUpperCase() === 'ADMINISTRATOR' ||
      session?.role?.toUpperCase() === 'ADMIN';

    const where: any = {
      type: 'NEWS',
      AND: [],
    };

    if (isAdmin) {
      if (statusParam) {
        where.status = statusParam;
      } else {
        where.status = { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU'] };
      }
    } else if (session?.userId) {
      if (statusParam === 'MENUNGGU' || statusParam === 'Menunggu') {
        where.status = { in: ['MENUNGGU', 'Menunggu'] };
        where.authorId = session.userId;
      } else if (statusParam === 'TERBIT' || statusParam === 'Terbit') {
        where.status = { in: ['TERBIT', 'PUBLISHED'] };
      } else {
        where.AND.push({
          OR: [
            { status: { in: ['TERBIT', 'PUBLISHED'] } },
            {
              AND: [
                { status: { in: ['MENUNGGU', 'Menunggu'] } },
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
        ],
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: limit,
        include: {
          author: { select: { name: true, profile: { select: { avatarUrl: true, unitKerja: true } } } },
          category: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat data berita', error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      coverImageName,
      publishedAt,
      status,
      attachmentName,
      attachmentUrl,
      source,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan konten berita wajib diisi' },
        { status: 400 }
      );
    }

    // Try to get current logged in user
    const currentUser = await getCurrentUser();
    let authorId;

    if (currentUser) {
      authorId = currentUser.userId; // handle token payload or user object
    } else {
      // Fallback if somehow not authenticated (API direct call), 
      // though middleware should prevent this.
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 400 }
        );
      }
      authorId = defaultUser.id;
    }

    const postStatus =
      status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';

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
        coverImage: coverImage || '/images/logo-perpusnas.png',
        type: 'NEWS',
        status: postStatus,
        authorId: authorId,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        attachmentName: attachmentName || null,
        attachmentUrl: attachmentUrl || null,
        source: source || null,
      },
    });

    let finalCoverImageName: string | undefined = undefined;
    if (coverImage) {
      if (coverImageName && typeof coverImageName === 'string' && coverImageName.trim()) {
        finalCoverImageName = coverImageName.trim();
      } else if (!coverImage.startsWith('data:')) {
        const clean = coverImage.split('?')[0].split('#')[0];
        const segments = clean.split('/');
        finalCoverImageName = decodeURIComponent(segments[segments.length - 1]);
      } else {
        const slugName = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 35) : 'sampul';
        finalCoverImageName = `${slugName}.jpg`;
      }
    }

    const newsPublishDate = publishedAt ? new Date(publishedAt) : new Date();
    await logActivity({
      userId: authorId,
      action: 'CREATE',
      module: 'NEWS',
      targetId: created.id,
      description: `Menambah Berita: ${title}`,
      details: {
        title,
        category: 'Berita',
        source: source?.trim() ? source.trim() : '-',
        tanggal: newsPublishDate.toISOString(),
        coverImage: coverImage || null,
        coverImageName: finalCoverImageName,
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
        status: postStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
        publishedAt: newsPublishDate.toISOString(),
        contentExcerpt: excerpt || content.slice(0, 200),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dipublikasikan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan berita' },
      { status: 500 }
    );
  }
}


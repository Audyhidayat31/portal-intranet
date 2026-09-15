import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const statusParam = searchParams.get('status');
    const where: any = {
      type: 'NEWS',
    };

    if (statusParam) {
      where.status = statusParam;
    } else {
      where.status = { in: ['PUBLISHED', 'DRAFT'] };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } },
        { excerpt: { contains: search } },
      ];
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
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat data berita' }, { status: 500 });
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
      publishedAt,
      status,
      attachmentName,
      attachmentUrl,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan konten berita wajib diisi' },
        { status: 400 }
      );
    }

    // Default admin author if not logged in
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 400 }
      );
    }

    const postStatus =
      status === 'Menunggu' || status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED';

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
        coverImage: coverImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
        type: 'NEWS',
        status: postStatus,
        authorId: defaultUser.id,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        attachmentName: attachmentName || null,
        attachmentUrl: attachmentUrl || null,
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


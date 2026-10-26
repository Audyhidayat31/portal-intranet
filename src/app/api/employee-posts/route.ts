import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  categorySlug: z.string().min(1, 'Kategori wajib dipilih'),
  body: z.string().min(1, 'Isi postingan minimal 1 karakter'),
  coverImage: z.string().optional(),
  status: z.string().optional(),
  publishedAt: z.string().optional(),
  createdAt: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q') || '';
    const statusParam = searchParams.get('status');

    const where: any = {};

    const user = await getCurrentUser();
    const isAdmin =
      user?.role?.toUpperCase() === 'ADMINISTRATOR' ||
      user?.role?.toUpperCase() === 'ADMIN';

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (isAdmin) {
      if (statusParam) {
        where.status = statusParam;
      }
    } else if (user?.userId) {
      if (statusParam === 'MENUNGGU' || statusParam === 'Menunggu') {
        where.status = { in: ['MENUNGGU', 'Menunggu'] };
        where.authorId = user.userId;
      } else if (statusParam === 'TERBIT' || statusParam === 'Terbit') {
        where.status = { in: ['TERBIT', 'PUBLISHED'] };
      } else {
        where.AND = [
          {
            OR: [
              { status: { in: ['TERBIT', 'PUBLISHED'] } },
              {
                AND: [
                  { status: { in: ['MENUNGGU', 'Menunggu', 'DRAFT'] } },
                  { authorId: user.userId },
                ],
              },
            ],
          },
        ];
      }
    } else {
      where.status = { in: ['TERBIT', 'PUBLISHED'] };
    }

    if (search) {
      const searchCondition = [
        { title: { contains: search } },
        { body: { contains: search } },
      ];
      if (where.AND) {
        where.AND.push({ OR: searchCondition });
      } else {
        where.OR = searchCondition;
      }
    }

    const posts = await prisma.employeePost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            nip: true,
            profile: {
              select: {
                position: true,
                unitKerja: true,
                avatarUrl: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: { select: { name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    let postsWithEditor: any[] = posts;
    try {
      const postIds = posts.map((p) => p.id);
      const updateLogs = await prisma.activityLog.findMany({
        where: {
          targetId: { in: postIds },
          action: 'UPDATE',
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } },
        },
      });

      const editorMap = new Map<string, string>();
      for (const log of updateLogs) {
        if (log.targetId && log.user?.name && !editorMap.has(log.targetId)) {
          editorMap.set(log.targetId, log.user.name);
        }
      }

      postsWithEditor = posts.map((p) => {
        const editorName = editorMap.get(p.id) || null;
        return {
          ...p,
          publishedAt: p.createdAt,
          editor: editorName ? { name: editorName } : null,
          editorName,
        };
      });
    } catch (logErr) {
      console.warn('Failed to query update logs for posts:', logErr);
    }

    return NextResponse.json({ success: true, data: postsWithEditor });
  } catch (error) {
    console.error('Error fetching employee posts:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat postingan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    let authorId = user?.userId;
    if (!authorId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 400 });
      }
      authorId = defaultUser.id;
    }

    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.errors[0].message }, { status: 400 });
    }

    const { title, categorySlug, body: contentBody, coverImage, status, publishedAt, createdAt } = result.data;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const postStatus = status === 'MENUNGGU' || status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT';
    const postCreatedAt = publishedAt ? new Date(publishedAt) : (createdAt ? new Date(createdAt) : new Date());

    const newPost = await prisma.employeePost.create({
      data: {
        title,
        slug,
        categorySlug,
        body: contentBody,
        coverImage: categorySlug === 'kalimat-bijak' ? '/images/logo-perpusnas.png' : (coverImage || null),
        authorId,
        status: postStatus,
        createdAt: postCreatedAt,
      },
    });

    const categoryMap: Record<string, { module: string; label: string }> = {
      'opini': { module: 'OPINION', label: 'Coretan Opini' },
      'olahraga': { module: 'SPORTS', label: 'Olahraga' },
      'tips-gaya-hidup': { module: 'LIFESTYLE', label: 'Tips dan Gaya Hidup' },
      'jelajah-bumi': { module: 'EARTH', label: 'Jelajah Bumi' },
      'tahukah-anda': { module: 'DIDYOUKNOW', label: 'Tahukah Anda' },
      'karya-akademik': { module: 'ACADEMIC', label: 'Karya Akademik' },
      'kabar-keluarga': { module: 'FAMILY', label: 'Kabar Keluarga' },
      'humor': { module: 'HUMOR', label: 'Humor' },
      'kalimat-bijak': { module: 'WISDOM', label: 'Kalimat Bijak' },
      'konsultasi': { module: 'CONSULTATION', label: 'Konsultasi' },
    };
    const catInfo = categoryMap[categorySlug] || { module: 'POSTS', label: 'Postingan Pegawai' };

    await logActivity({
      userId: authorId,
      action: 'CREATE',
      module: catInfo.module,
      targetId: newPost.id,
      description: `Menambah ${catInfo.label}: ${title}`,
      details: {
        title,
        category: catInfo.label,
        source: body.source || '-',
        tanggal: postCreatedAt.toISOString(),
        coverImage: coverImage || null,
        coverImageName: body.coverImageName || (coverImage ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 35) || 'postingan'}.jpg` : undefined),
        attachmentUrl: body.attachmentUrl || null,
        attachmentName: body.attachmentName || null,
        status: postStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
        publishedAt: postCreatedAt.toISOString(),
        contentExcerpt: contentBody.slice(0, 200),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Postingan berhasil dipublikasikan!',
      data: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: 'Gagal membuat postingan' }, { status: 500 });
  }
}

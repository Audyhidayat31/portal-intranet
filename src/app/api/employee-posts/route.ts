import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  categorySlug: z.string().min(1, 'Kategori wajib dipilih'),
  body: z.string().min(10, 'Isi postingan minimal 10 karakter'),
  coverImage: z.string().optional(),
  status: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q') || '';
    const statusParam = searchParams.get('status');

    const where: any = {};

    if (statusParam) {
      where.status = statusParam;
    }

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } },
      ];
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

    return NextResponse.json({ success: true, data: posts });
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

    const { title, categorySlug, body: contentBody, coverImage, status } = result.data;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const postStatus = status === 'DRAFT' || status === 'Menunggu' ? 'DRAFT' : 'PUBLISHED';

    const newPost = await prisma.employeePost.create({
      data: {
        title,
        slug,
        categorySlug,
        body: contentBody,
        coverImage: coverImage || null,
        authorId,
        status: postStatus,
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

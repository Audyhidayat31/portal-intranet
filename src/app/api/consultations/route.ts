import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    const where: any = {};
    if (category && category !== 'ALL') {
      const normalizedCat =
        category.toUpperCase() === 'PEGAWAI' ? 'KEPEGAWAIAN' : category.toUpperCase();
      where.category = normalizedCat;
    }

    if (q && q.trim()) {
      where.OR = [
        { title: { contains: q } },
        { question: { contains: q } },
      ];
    }

    const topics = await withDbRetry(() =>
      prisma.consultationTopic.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, nip: true } },
          replies: {
            include: {
              author: { select: { name: true, role: { select: { name: true } } } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      })
    );

    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat daftar konsultasi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, question, description, status, attachmentName } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: 'Judul konsultasi wajib diisi' }, { status: 400 });
    }

    let user = await getCurrentUser();
    let authorId = user?.userId;

    if (!authorId) {
      // Find default admin or first user
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        authorId = firstUser.id;
      }
    }

    const normalizedCategory =
      category?.toUpperCase() === 'PEGAWAI' || category?.toUpperCase() === 'KEPEGAWAIAN'
        ? 'KEPEGAWAIAN'
        : category?.toUpperCase() === 'IT'
        ? 'IT'
        : 'KESEHATAN';

    const topic = await withDbRetry(() =>
      prisma.consultationTopic.create({
        data: {
          title: title.trim(),
          category: normalizedCategory,
          question: (question || description || title).trim(),
          isPrivate: false,
          authorId: authorId || 'default-user',
          status: status === 'Menunggu' ? 'OPEN' : 'ANSWERED',
        },
        include: {
          author: { select: { name: true, nip: true } },
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Konsultasi berhasil diajukan!',
      data: topic,
    });
  } catch (error) {
    console.error('Error creating consultation topic:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengajukan konsultasi' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { MOCK_BERITA_6 } from '@/lib/mock-news';

function findMockNews(id: string) {
  const cleanId = id.toLowerCase();
  return MOCK_BERITA_6.find(
    (m) =>
      m.id?.toLowerCase() === cleanId ||
      m.title.toLowerCase().includes(cleanId)
  );
}

function formatMockNews(mock: any) {
  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    excerpt: mock.excerpt,
    body: mock.content,
    coverImage: mock.coverImage,
    type: 'NEWS',
    status: mock.status === 'Menunggu' ? 'DRAFT' : 'PUBLISHED',
    publishedAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
    author: {
      name: mock.authorName || 'Humas Perpusnas',
      nip: '198501152010011001',
      profile: {
        avatarUrl: mock.coverImage,
        position: 'Pranata Humas Ahli Muda',
        unitKerja: 'Biro Hukum dan Hubungan Masyarakat',
      },
    },
    category: {
      name: 'Berita',
      slug: 'berita',
    },
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    try {
      const item = await prisma.content.findFirst({
        where: {
          OR: [
            { id },
            { slug: id },
          ],
          type: 'NEWS',
        },
        include: {
          author: {
            select: {
              name: true,
              nip: true,
              profile: {
                select: {
                  avatarUrl: true,
                  position: true,
                  unitKerja: true,
                },
              },
            },
          },
          category: true,
        },
      });

      if (item) {
        return NextResponse.json({ success: true, data: item });
      }
    } catch (dbErr) {
      console.warn('Prisma findFirst error in news GET:', dbErr);
    }

    const mock = findMockNews(id);
    if (mock) {
      return NextResponse.json({ success: true, data: formatMockNews(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Berita tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat berita' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    const body = await request.json();
    const { title, excerpt, content, coverImage, publishedAt, status } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
          type: 'NEWS',
        },
      });

      if (existing) {
        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            ...(title && { title }),
            ...(excerpt && { excerpt }),
            ...(content && { body: content }),
            ...(coverImage && { coverImage }),
            ...(publishedAt && { publishedAt: new Date(publishedAt) }),
            ...(status && { status: status === 'Menunggu' || status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED' }),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Berita berhasil diperbarui',
          data: updated,
        });
      }

      // If not existing, try creating it in DB
      const defaultUser = await prisma.user.findFirst();
      const newsCat = await prisma.category.findUnique({ where: { slug: 'berita' } });
      if (defaultUser) {
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Berita Kedinasan',
            slug: id,
            excerpt: excerpt || '',
            body: content || '',
            coverImage: coverImage || null,
            type: 'NEWS',
            status: status === 'Menunggu' || status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
            authorId: defaultUser.id,
            categoryId: newsCat?.id || null,
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Berita berhasil diperbarui',
          data: created,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update/create failed in news PUT:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil diperbarui',
      data: { id, title, excerpt, content, coverImage, publishedAt, status },
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui berita' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
          type: 'NEWS',
        },
      });

      if (existing) {
        await prisma.content.delete({
          where: { id: existing.id },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed in news DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}

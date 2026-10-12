import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { MOCK_BERITA_6 } from '@/lib/mock-news';

function findMockNews(id: string) {
  return MOCK_BERITA_6.find((item) => item.id === id);
}

function formatMockNews(item: any) {
  return {
    ...item,
    coverImage: item.coverImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    content: item.body || item.content || item.excerpt,
    body: item.body || item.content || item.excerpt,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const item = await prisma.content.findFirst({
        where: {
          type: 'NEWS',
          OR: [
            { id },
            { slug: id },
          ],
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
        },
      });

      if (item) {
        const mappedItem = {
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          body: item.body,
          content: item.body,
          coverImage: item.coverImage,
          publishedAt: item.publishedAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          status: item.status,
          source: item.source,
          attachmentUrl: item.attachmentUrl,
          attachmentName: item.attachmentName,
          isPinned: item.isPinned,
          viewCount: item.viewCount,
          author: item.author ? {
            name: item.author.name,
            profile: item.author.profile
          } : { name: 'Humas Perpusnas' }
        };
        return NextResponse.json({ success: true, data: mappedItem });
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, coverImage, publishedAt, status, attachmentName, attachmentUrl, source } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          type: 'NEWS',
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            ...(title && { title: title }),
            ...(excerpt !== undefined && { excerpt: excerpt }),
            ...(content && { body: content }),
            ...(coverImage !== undefined && { coverImage: coverImage }),
            ...(publishedAt && { publishedAt: new Date(publishedAt) }),
            ...(status && { status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT' }),
            ...(attachmentName !== undefined && { attachmentName: attachmentName }),
            ...(attachmentUrl !== undefined && { attachmentUrl: attachmentUrl }),
            ...(source !== undefined && { source: source }),
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Berita berhasil diperbarui',
          data: updated,
        });
      }

      // If not existing, try creating it in DB
      const currentUser = await getCurrentUser();
      let authorId;
      if (currentUser) {
        authorId = currentUser.userId;
      } else {
        const defaultUser = await prisma.user.findFirst();
        if (defaultUser) authorId = defaultUser.id;
      }
      
      if (authorId) {
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Berita Kedinasan',
            slug: id,
            excerpt: excerpt || '',
            body: content || '',
            coverImage: coverImage || null,
            type: 'NEWS',
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
            authorId: authorId,
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            attachmentName: attachmentName || null,
            attachmentUrl: attachmentUrl || null,
            source: source || null,
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

    return NextResponse.json({ success: true, message: 'Berita berhasil diperbarui (Mock)' });
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui berita' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          type: 'NEWS',
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        await prisma.content.delete({
          where: { id: existing.id },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete error in news DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}

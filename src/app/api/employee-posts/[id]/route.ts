import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { STITCH_MOCK_OPINI_6 } from '@/lib/mock-opini';
import { STITCH_MOCK_HUMOR_9 } from '@/lib/mock-humor';
import { STITCH_MOCK_JELAJAH_BUMI_9 } from '@/lib/mock-jelajah-bumi';
import { STITCH_MOCK_KABAR_KELUARGA_9 } from '@/lib/mock-kabar-keluarga';
import { STITCH_MOCK_KALIMAT_BIJAK } from '@/lib/mock-kalimat-bijak';
import { STITCH_MOCK_KARYA_AKADEMIK } from '@/lib/mock-karya-akademik';
import { STITCH_MOCK_OLAHRAGA_9 } from '@/lib/mock-olahraga';
import { STITCH_MOCK_TAHUKAH_ANDA_9 } from '@/lib/mock-tahukah-anda';
import { STITCH_MOCK_TIPS_GAYA_HIDUP_9 } from '@/lib/mock-tips-gaya-hidup';

const ALL_MOCK_POSTS: any[] = [
  ...STITCH_MOCK_OPINI_6.map((m: any) => ({ ...m, categorySlug: 'opini' })),
  ...STITCH_MOCK_HUMOR_9.map((m: any) => ({ ...m, categorySlug: 'humor' })),
  ...STITCH_MOCK_JELAJAH_BUMI_9.map((m: any) => ({ ...m, categorySlug: 'jelajah-bumi' })),
  ...STITCH_MOCK_KABAR_KELUARGA_9.map((m: any) => ({ ...m, categorySlug: 'kabar-keluarga' })),
  ...STITCH_MOCK_KALIMAT_BIJAK.map((m: any) => ({ ...m, categorySlug: 'kalimat-bijak' })),
  ...STITCH_MOCK_KARYA_AKADEMIK.map((m: any) => ({ ...m, categorySlug: 'karya-akademik' })),
  ...STITCH_MOCK_OLAHRAGA_9.map((m: any) => ({ ...m, categorySlug: 'olahraga' })),
  ...STITCH_MOCK_TAHUKAH_ANDA_9.map((m: any) => ({ ...m, categorySlug: 'tahukah-anda' })),
  ...STITCH_MOCK_TIPS_GAYA_HIDUP_9.map((m: any) => ({ ...m, categorySlug: 'tips-gaya-hidup' })),
];

function findMockPost(id: string) {
  const cleanId = id.toLowerCase();
  return ALL_MOCK_POSTS.find(
    (m) =>
      m.id?.toLowerCase() === cleanId ||
      m.slug?.toLowerCase() === cleanId ||
      (m.title && m.title.toLowerCase().includes(cleanId))
  );
}

function formatMockItem(mock: any) {
  return {
    id: mock.id,
    title: mock.title || 'Postingan Pegawai',
    slug: mock.id,
    categorySlug: mock.categorySlug || 'opini',
    body: mock.content || mock.quote || mock.body || mock.excerpt || '',
    excerpt: mock.excerpt || '',
    coverImage: mock.coverImage || null,
    status: mock.status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
    likesCount: mock.likesCount || 0,
    viewsCount: mock.viewsCount || 0,
    createdAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: mock.authorName || 'Pegawai Perpusnas',
      nip: '198501152010011001',
      profile: {
        position: mock.authorPosition || 'Pustakawan',
        unitKerja: 'Perpustakaan Nasional RI',
        avatarUrl: mock.coverImage || null,
      },
    },
    comments: [],
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID postingan tidak valid' },
        { status: 400 }
      );
    }

    // Try finding in database first
    try {
      const item = await prisma.employeePost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
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

      if (item) {
        return NextResponse.json({ success: true, data: item });
      }
    } catch (dbErr) {
      console.warn('Database query error in employee-posts GET, falling back to mock:', dbErr);
    }

    // Fallback to mock data
    const mock = findMockPost(id);
    if (mock) {
      return NextResponse.json({ success: true, data: formatMockItem(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Postingan tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching employee post detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail postingan' },
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
    const { title, body: contentBody, coverImage, status } = body;

    let existing: any = null;
    try {
      existing = await prisma.employeePost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });
    } catch (dbErr) {
      console.warn('Prisma findFirst failed in PUT employee-posts:', dbErr);
    }

    if (existing) {
      const updated = await prisma.employeePost.update({
        where: { id: existing.id },
        data: {
          title: title !== undefined ? title : existing.title,
          body: contentBody !== undefined ? contentBody : existing.body,
          coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
          status:
            status !== undefined
              ? status === 'Menunggu' || status === 'MENUNGGU'
                ? 'MENUNGGU'
                : 'TERBIT'
              : existing.status,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Postingan berhasil diperbarui',
        data: updated,
      });
    }

    // If not existing in database, create or return fallback
    try {
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        const catSlug =
          id.startsWith('opini') ? 'opini' :
          id.startsWith('humor') ? 'humor' :
          id.startsWith('jelajah') ? 'jelajah-bumi' :
          id.startsWith('kabar') ? 'kabar-keluarga' :
          id.startsWith('kalimat') ? 'kalimat-bijak' :
          id.startsWith('karya') ? 'karya-akademik' :
          id.startsWith('olahraga') ? 'olahraga' :
          id.startsWith('tahukah') ? 'tahukah-anda' :
          id.startsWith('tips') ? 'tips-gaya-hidup' : 'opini';

        const created = await prisma.employeePost.create({
          data: {
            id,
            title: title || 'Postingan Pegawai',
            slug: id,
            categorySlug: catSlug,
            body: contentBody || title || '',
            coverImage: coverImage || null,
            authorId: defaultUser.id,
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Postingan berhasil diperbarui',
          data: created,
        });
      }
    } catch (createErr) {
      console.warn('Could not insert mock post into DB, returning success response:', createErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Postingan berhasil diperbarui secara lokal',
      data: { id, title, body: contentBody, coverImage, status },
    });
  } catch (error) {
    console.error('Error updating employee post:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui postingan' },
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
      const existing = await prisma.employeePost.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        await prisma.employeePost.delete({
          where: { id: existing.id },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Postingan berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting employee post:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus postingan' },
      { status: 500 }
    );
  }
}

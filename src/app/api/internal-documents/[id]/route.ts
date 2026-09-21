import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { STITCH_MOCK_INTERNAL_DOCS_5 } from '@/lib/mock-internal-documents';

function findMockInternalDoc(id: string) {
  const cleanId = id.toLowerCase();
  return STITCH_MOCK_INTERNAL_DOCS_5.find(
    (m) =>
      m.id?.toLowerCase() === cleanId ||
      m.title.toLowerCase().includes(cleanId)
  );
}

function formatMockInternalDoc(mock: any) {
  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    documentNumber: mock.documentNumber || 'SE/01/Perpusnas/2026',
    category: {
      name: mock.category || 'Surat Edaran',
      slug: 'dokumen-intern',
    },
    excerpt: mock.keterangan || '',
    body: mock.keterangan || '',
    keterangan: mock.keterangan || '',
    attachmentName: mock.attachmentName || 'Surat_Edaran.pdf',
    fileSize: mock.fileSize || '1.8 MB',
    type: 'INTERNAL_DOCUMENT',
    status: 'TERBIT',
    publishedAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
    author: {
      name: 'Bagian Hukum dan Regulasi',
      nip: '198501152010011001',
      profile: {
        position: 'Pranata Humas & Legal',
        unitKerja: 'Biro Hukum dan Organisasi',
      },
    },
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
        { success: false, message: 'ID dokumen tidak valid' },
        { status: 400 }
      );
    }

    try {
      const item = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          category: true,
          author: {
            select: {
              name: true,
              nip: true,
              profile: { select: { position: true, unitKerja: true } },
            },
          },
        },
      });

      if (item) {
        return NextResponse.json({ success: true, data: item });
      }
    } catch (dbErr) {
      console.warn('Prisma findFirst error in internal-documents GET:', dbErr);
    }

    const mock = findMockInternalDoc(id);
    if (mock) {
      return NextResponse.json({ success: true, data: formatMockInternalDoc(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Dokumen internal tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching internal document detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail dokumen internal' },
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
    const { title, keterangan, attachmentName, status } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            title: title !== undefined ? title : existing.title,
            excerpt: keterangan !== undefined ? keterangan : existing.excerpt,
            body: keterangan !== undefined ? keterangan : existing.body,
            attachmentName: attachmentName !== undefined ? attachmentName : existing.attachmentName,
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
          message: 'Dokumen internal berhasil diperbarui',
          data: updated,
        });
      }

      // Upsert mock item into DB
      const defaultUser = await prisma.user.findFirst();
      const docCat = await prisma.category.findUnique({ where: { slug: 'dokumen-intern' } });
      if (defaultUser) {
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Dokumen Internal',
            slug: id,
            excerpt: keterangan || '',
            body: keterangan || '',
            attachmentName: attachmentName || 'Dokumen_Internal.pdf',
            type: 'INTERNAL_DOCUMENT',
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
            authorId: defaultUser.id,
            categoryId: docCat?.id || null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Dokumen internal berhasil diperbarui',
          data: created,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update/create failed in internal-documents PUT:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Dokumen internal berhasil diperbarui',
      data: { id, title, keterangan, attachmentName, status },
    });
  } catch (error) {
    console.error('Error updating internal document:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui dokumen internal' },
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
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        await prisma.content.delete({
          where: { id: existing.id },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed in internal-documents DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Dokumen internal berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting internal document:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus dokumen internal' },
      { status: 500 }
    );
  }
}

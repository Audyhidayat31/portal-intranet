import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
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
        const isWaiting =
          item.status === 'MENUNGGU' ||
          item.status === 'Menunggu' ||
          item.status === 'DRAFT';

        if (isWaiting) {
          const session = await getCurrentUser();
          const isAdmin =
            session?.role?.toUpperCase() === 'ADMINISTRATOR' ||
            session?.role?.toUpperCase() === 'ADMIN';
          const isAuthor = Boolean(session?.userId && item.authorId === session.userId);

          if (!isAdmin && !isAuthor) {
            return NextResponse.json(
              { success: false, message: 'Anda tidak memiliki hak akses untuk melihat dokumen ini' },
              { status: 403 }
            );
          }
        }

        let editorName = null;
        try {
          const updateLog = await prisma.activityLog.findFirst({
            where: {
              targetId: item.id,
              action: { in: ['UPDATE', 'CHANGE_STATUS'] },
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } },
          });
          if (updateLog?.user?.name) {
            editorName = updateLog.user.name;
          }
        } catch (e) {}

        let docNumber = item.source || '';
        let cleanBody = item.body || item.excerpt || '';
        if (!docNumber && item.body && item.body.startsWith('[') && item.body.includes(']')) {
          const closeIdx = item.body.indexOf(']');
          docNumber = item.body.slice(1, closeIdx);
          cleanBody = item.body.slice(closeIdx + 1).trim();
        } else if (item.body && item.body.startsWith('[') && item.body.includes(']')) {
          const closeIdx = item.body.indexOf(']');
          cleanBody = item.body.slice(closeIdx + 1).trim();
        }

        return NextResponse.json({
          success: true,
          data: {
            ...item,
            documentNumber: docNumber,
            keterangan: cleanBody,
            editor: editorName ? { name: editorName } : null,
            editorName: editorName || null,
          },
        });
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
    const { title, keterangan, attachmentName, status, categoryName, documentNumber, publishedAt } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        let categoryId = existing.categoryId;
        if (categoryName) {
          const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          let cat = await prisma.category.findFirst({
            where: { name: categoryName },
          });
          if (!cat) {
            cat = await prisma.category.create({
              data: {
                name: categoryName,
                slug: catSlug,
                group: 'KABAR_KEDINASAN',
                description: `Kategori dokumen: ${categoryName}`,
              },
            });
          }
          categoryId = cat.id;
        }

        const formattedKeterangan = documentNumber
          ? `[${documentNumber}] ${keterangan || ''}`
          : keterangan;

        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            title: title !== undefined ? title : existing.title,
            excerpt: keterangan !== undefined ? keterangan : existing.excerpt,
            body: formattedKeterangan !== undefined ? formattedKeterangan : existing.body,
            attachmentName: attachmentName !== undefined ? (attachmentName || null) : existing.attachmentName,
            attachmentUrl: body.attachmentUrl !== undefined ? (body.attachmentUrl || null) : existing.attachmentUrl,
            fileSize: attachmentName !== undefined ? (attachmentName ? (body.fileSize || existing.fileSize || '1.5 MB') : null) : existing.fileSize,
            publishedAt: publishedAt ? new Date(publishedAt) : existing.publishedAt,
            categoryId,
            source: documentNumber !== undefined ? documentNumber : existing.source,
            status:
              status !== undefined
                ? status === 'Menunggu' || status === 'MENUNGGU'
                  ? 'MENUNGGU'
                  : 'TERBIT'
                : existing.status,
          },
        });

        const session = await getCurrentUser();
        const actorId = session?.userId || existing.authorId;
        const editorUser = actorId ? await prisma.user.findUnique({ where: { id: actorId }, select: { name: true } }) : null;
        const currentEditorName = editorUser?.name || session?.name || 'Administrator Perpusnas';

        await logActivity({
          userId: actorId,
          action: 'UPDATE',
          module: 'INTERNAL_DOCUMENT',
          targetId: existing.id,
          description: `Mengubah dokumen internal: ${title || existing.title}`,
        });

        return NextResponse.json({
          success: true,
          message: 'Dokumen internal berhasil diperbarui',
          data: {
            ...updated,
            documentNumber: documentNumber !== undefined ? documentNumber : (updated.source || ''),
            keterangan: keterangan !== undefined ? keterangan : (updated.excerpt || ''),
            editor: { name: currentEditorName },
            editorName: currentEditorName,
          },
        });
      }

      // Upsert mock item into DB
      const defaultUser = await prisma.user.findFirst();
      const docCat = await prisma.category.findUnique({ where: { slug: 'dokumen-intern' } });
      if (defaultUser) {
        const upsertKeterangan = documentNumber ? `[${documentNumber}] ${keterangan || ''}` : (keterangan || '');
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Dokumen Internal',
            slug: id,
            source: documentNumber || null,
            excerpt: keterangan || '',
            body: upsertKeterangan || '',
            attachmentName: attachmentName ? attachmentName : null,
            attachmentUrl: body.attachmentUrl ? body.attachmentUrl : null,
            fileSize: attachmentName ? (body.fileSize || '1.5 MB') : null,
            type: 'INTERNAL_DOCUMENT',
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
            authorId: defaultUser.id,
            categoryId: docCat?.id || null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Dokumen internal berhasil diperbarui',
          data: {
            ...created,
            documentNumber: documentNumber || '',
            keterangan: keterangan || '',
          },
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

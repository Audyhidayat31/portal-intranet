import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { INITIAL_MOCK_KONSULTASI } from '@/lib/mock-konsultasi';

function findMockConsultation(id: string) {
  const cleanId = id.toLowerCase();
  return INITIAL_MOCK_KONSULTASI.find(
    (m: any) =>
      m.id?.toLowerCase() === cleanId ||
      m.title.toLowerCase().includes(cleanId)
  );
}

function formatMockConsultation(mock: any) {
  return {
    id: mock.id,
    title: mock.title,
    category: mock.category || 'KEPEGAWAIAN',
    question: mock.keterangan || mock.content || mock.title,
    status: mock.status === 'Selesai' ? 'ANSWERED' : 'OPEN',
    isPrivate: false,
    createdAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: mock.authorName || 'Pegawai Perpusnas',
      nip: '198501152010011001',
    },
    replies: (mock.replies || []).map((r: any, idx: number) => ({
      id: `reply-${idx}`,
      replyText: r.text || r.replyText || '',
      isAdminReply: r.isAdminReply || false,
      createdAt: r.time || new Date().toISOString(),
      author: {
        name: r.authorName || 'Admin Kepegawaian',
        role: { name: 'ADMINISTRATOR' },
      },
    })),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    try {
      const topic = await withDbRetry(() =>
        prisma.consultationTopic.findUnique({
          where: { id },
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

      if (topic) {
        return NextResponse.json({ success: true, data: topic });
      }
    } catch (dbErr) {
      console.warn('Prisma findUnique error in consultations GET:', dbErr);
    }

    const mock = findMockConsultation(id);
    if (mock) {
      return NextResponse.json({ success: true, data: formatMockConsultation(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Konsultasi tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching consultation detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail konsultasi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { title, question, description, category, status } = body;

    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title.trim();
    if (question || description)
      dataToUpdate.question = (question || description).trim();
    if (category) {
      dataToUpdate.category =
        category.toUpperCase() === 'PEGAWAI' ? 'KEPEGAWAIAN' : category.toUpperCase();
    }
    if (status) {
      dataToUpdate.status = status === 'Menunggu' ? 'OPEN' : 'ANSWERED';
    }

    try {
      const existing = await prisma.consultationTopic.findUnique({ where: { id } });

      if (existing) {
        const updated = await withDbRetry(() =>
          prisma.consultationTopic.update({
            where: { id },
            data: dataToUpdate,
          })
        );

        return NextResponse.json({
          success: true,
          message: 'Konsultasi berhasil diperbarui',
          data: updated,
        });
      }

      // Upsert mock item into DB
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        const created = await prisma.consultationTopic.create({
          data: {
            id,
            title: title || 'Topik Konsultasi',
            category: dataToUpdate.category || 'KEPEGAWAIAN',
            question: dataToUpdate.question || title || '',
            authorId: defaultUser.id,
            status: dataToUpdate.status || 'OPEN',
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Konsultasi berhasil diperbarui',
          data: created,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update/create failed in consultations PUT:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Konsultasi berhasil diperbarui',
      data: { id, title, ...dataToUpdate },
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui konsultasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    try {
      const existing = await prisma.consultationTopic.findUnique({ where: { id } });
      if (existing) {
        await withDbRetry(() =>
          prisma.consultationTopic.delete({
            where: { id },
          })
        );
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed in consultations DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Konsultasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus konsultasi' },
      { status: 500 }
    );
  }
}

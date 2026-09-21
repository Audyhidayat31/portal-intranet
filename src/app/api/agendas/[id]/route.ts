import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { STITCH_MOCK_AGENDAS_6 } from '@/lib/mock-agendas';

function findMockAgenda(id: string) {
  const cleanId = id.toLowerCase();
  return STITCH_MOCK_AGENDAS_6.find(
    (m) =>
      m.id?.toLowerCase() === cleanId ||
      m.title.toLowerCase().includes(cleanId)
  );
}

function formatMockAgenda(mock: any) {
  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    excerpt: mock.excerpt,
    body: mock.content,
    coverImage: mock.coverImage,
    type: 'AGENDA',
    status: mock.status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
    eventStartDate: mock.eventStartDate ? new Date(mock.eventStartDate).toISOString() : new Date().toISOString(),
    eventLocation: mock.eventLocation || 'Gedung Perpustakaan Nasional RI',
    publishedAt: mock.publishedAt ? new Date().toISOString() : new Date().toISOString(),
    author: {
      name: mock.authorName || 'Biro Umum dan Pengadaan',
      nip: '198501152010011001',
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
        { success: false, message: 'ID agenda tidak valid' },
        { status: 400 }
      );
    }

    try {
      const item = await prisma.content.findFirst({
        where: {
          type: 'AGENDA',
          OR: [{ id }, { slug: id }],
        },
        include: {
          author: { select: { name: true, nip: true } },
        },
      });

      if (item) {
        return NextResponse.json({ success: true, data: item });
      }
    } catch (dbErr) {
      console.warn('Prisma findFirst error in agendas GET:', dbErr);
    }

    const mock = findMockAgenda(id);
    if (mock) {
      return NextResponse.json({ success: true, data: formatMockAgenda(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Agenda kegiatan tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching agenda detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail agenda' },
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
    const { title, content, body: contentBody, eventLocation, eventStartDate, status } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          type: 'AGENDA',
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            title: title || existing.title,
            body: content || contentBody || existing.body,
            excerpt: content || contentBody ? (content || contentBody).slice(0, 150) : existing.excerpt,
            eventLocation: eventLocation || existing.eventLocation,
            eventStartDate: eventStartDate ? new Date(eventStartDate) : existing.eventStartDate,
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
          message: 'Agenda kegiatan berhasil diperbarui',
          data: updated,
        });
      }

      // Upsert mock item into DB
      const defaultUser = await prisma.user.findFirst();
      const agendaCat = await prisma.category.findUnique({ where: { slug: 'agenda' } });
      if (defaultUser) {
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Agenda Kegiatan',
            slug: id,
            body: content || contentBody || '',
            excerpt: (content || contentBody || '').slice(0, 150),
            type: 'AGENDA',
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
            eventLocation: eventLocation || 'Gedung Perpustakaan Nasional RI',
            eventStartDate: eventStartDate ? new Date(eventStartDate) : new Date(),
            authorId: defaultUser.id,
            categoryId: agendaCat?.id || null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Agenda kegiatan berhasil diperbarui',
          data: created,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update/create failed in agendas PUT:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Agenda kegiatan berhasil diperbarui',
      data: { id, title, body: content || contentBody, eventLocation, eventStartDate, status },
    });
  } catch (error) {
    console.error('Error updating agenda:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui agenda' },
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
          type: 'AGENDA',
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        await prisma.content.delete({
          where: { id: existing.id },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma delete failed in agendas DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Agenda kegiatan berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting agenda:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus agenda' },
      { status: 500 }
    );
  }
}

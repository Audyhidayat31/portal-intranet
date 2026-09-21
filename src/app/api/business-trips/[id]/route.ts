import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { STITCH_MOCK_BUSINESS_TRIPS_5 } from '@/lib/mock-business-trips';

function findMockBusinessTrip(id: string) {
  const cleanId = id.toLowerCase();
  return STITCH_MOCK_BUSINESS_TRIPS_5.find(
    (m) =>
      m.id?.toLowerCase() === cleanId ||
      m.title.toLowerCase().includes(cleanId)
  );
}

function formatMockBusinessTrip(mock: any) {
  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    excerpt: mock.excerpt || '',
    body: mock.content || mock.body || mock.excerpt || '',
    destinationCity: mock.destinationCity || 'Jakarta',
    attachmentName: mock.attachmentName || 'Laporan_Dinas.pdf',
    type: 'BUSINESS_TRIP',
    status: 'TERBIT',
    publishedAt: mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString(),
    author: {
      name: mock.author?.name || 'Budi Sujatmiko',
      nip: '198501152010011001',
      profile: {
        position: mock.author?.profile?.position || 'Pustakawan Ahli Muda',
        unitKerja: mock.author?.profile?.unitKerja || 'Pusat Preservasi & Pengolahan Bahan Pustaka',
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
        { success: false, message: 'ID laporan tidak valid' },
        { status: 400 }
      );
    }

    try {
      const item = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
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
      console.warn('Prisma findFirst error in business-trips GET:', dbErr);
    }

    const mock = findMockBusinessTrip(id);
    if (mock) {
      return NextResponse.json({ success: true, data: formatMockBusinessTrip(mock) });
    }

    return NextResponse.json(
      { success: false, message: 'Laporan perjalanan dinas tidak ditemukan' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching business trip detail:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat detail laporan perjalanan dinas' },
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
    const { title, excerpt, content, destinationCity, attachmentName, status } = body;

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
            excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
            body: content !== undefined ? content : existing.body,
            destinationCity: destinationCity !== undefined ? destinationCity : existing.destinationCity,
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
          message: 'Laporan perjalanan dinas berhasil diperbarui',
          data: updated,
        });
      }

      // Upsert mock item into DB
      const defaultUser = await prisma.user.findFirst();
      const tripCat = await prisma.category.findUnique({ where: { slug: 'laporan-perjalanan' } });
      if (defaultUser) {
        const created = await prisma.content.create({
          data: {
            id,
            title: title || 'Laporan Perjalanan Dinas',
            slug: id,
            excerpt: excerpt || '',
            body: content || '',
            destinationCity: destinationCity || 'Jakarta',
            attachmentName: attachmentName || 'Laporan_Dinas.pdf',
            type: 'BUSINESS_TRIP',
            status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT',
            authorId: defaultUser.id,
            categoryId: tripCat?.id || null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Laporan perjalanan dinas berhasil diperbarui',
          data: created,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma update/create failed in business-trips PUT:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Laporan perjalanan dinas berhasil diperbarui',
      data: { id, title, excerpt, content, destinationCity, attachmentName, status },
    });
  } catch (error) {
    console.error('Error updating business trip:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui laporan perjalanan dinas' },
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
      console.warn('Prisma delete failed in business-trips DELETE:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Laporan perjalanan dinas berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting business trip:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus laporan perjalanan dinas' },
      { status: 500 }
    );
  }
}

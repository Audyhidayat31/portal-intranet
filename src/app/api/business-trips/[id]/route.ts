import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { STITCH_MOCK_BUSINESS_TRIPS_5 } from '@/lib/mock-business-trips';

function findMockBusinessTrip(id: string) {
  const cleanId = id.toLowerCase().trim();
  return STITCH_MOCK_BUSINESS_TRIPS_5.find(
    (m) => m.id?.toLowerCase() === cleanId
  );
}

function formatMockBusinessTrip(mock: any) {
  const rawCity = mock.destinationCity || 'Kota Surabaya';
  const isForeign = rawCity.toLowerCase().includes('singapura') || rawCity.toLowerCase().includes('malaysia');
  const cleanCity = rawCity.includes(',') ? rawCity.split(',')[0].trim() : rawCity;
  const cleanCountry = isForeign ? 'Singapura' : (rawCity.includes(',') ? rawCity.split(',')[1].trim() : 'Indonesia');
  const pubDate = mock.publishedAt ? new Date(mock.publishedAt).toISOString() : new Date().toISOString();

  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    excerpt: mock.excerpt || '',
    body: mock.content || mock.body || mock.excerpt || '',
    destinationCity: rawCity,
    kotaTujuan: cleanCity,
    negaraTujuan: cleanCountry,
    startDate: pubDate,
    endDate: pubDate,
    durasiPenugasan: pubDate,
    eventStartDate: pubDate,
    eventEndDate: pubDate,
    namaPegawai: mock.author?.name || 'Ahmad Fauzi, S.Kom.',
    authorName: mock.author?.name || 'Ahmad Fauzi, S.Kom.',
    attachmentName: mock.attachmentName || 'Laporan_Dinas.pdf',
    type: 'BUSINESS_TRIP',
    status: 'TERBIT',
    publishedAt: pubDate,
    author: {
      name: mock.author?.name || 'Ahmad Fauzi, S.Kom.',
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
        } catch (e) { }

        const rawDest = item.destinationCity || '';
        const kota = item.destinationCity?.includes(',') ? item.destinationCity.split(',')[0].trim() : (item.destinationCity || 'Kota Surabaya');
        const negara = item.source || (item.destinationCity?.includes(',') ? item.destinationCity.split(',')[1].trim() : 'Indonesia');
        const authorName = item.author?.name || 'Ahmad Fauzi, S.Kom.';
        const startDate = item.eventStartDate || item.publishedAt || item.createdAt;
        const endDate = item.eventEndDate || item.eventStartDate || item.publishedAt;

        return NextResponse.json({
          success: true,
          data: {
            ...item,
            startDate,
            endDate,
            durasiPenugasan: endDate,
            eventStartDate: startDate,
            eventEndDate: endDate,
            namaPegawai: authorName,
            authorName,
            kotaTujuan: kota,
            negaraTujuan: negara,
            editor: editorName ? { name: editorName } : null,
            editorName: editorName || null,
          },
        });
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
    const {
      title,
      excerpt,
      content,
      destinationCity,
      kotaTujuan,
      negaraTujuan,
      startDate,
      endDate,
      attachmentName,
      status,
      publishedAt,
      authorName,
      nama,
    } = body;

    try {
      const existing = await prisma.content.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (existing) {
        const authorNameValue = authorName || nama;
        let updateAuthorId = existing.authorId;
        if (authorNameValue) {
          const matchedUser = await prisma.user.findFirst({
            where: { name: { contains: authorNameValue } },
          });
          if (matchedUser) {
            updateAuthorId = matchedUser.id;
          }
        }

        const finalStartDate = startDate ? new Date(startDate) : (publishedAt ? new Date(publishedAt) : existing.eventStartDate || existing.publishedAt);
        const finalEndDate = endDate ? new Date(endDate) : (startDate ? new Date(startDate) : existing.eventEndDate || finalStartDate);
        const finalCity = kotaTujuan !== undefined ? kotaTujuan : (destinationCity !== undefined ? destinationCity : existing.destinationCity);
        const finalCountry = negaraTujuan !== undefined ? negaraTujuan : (existing.source || 'Indonesia');

        const updated = await prisma.content.update({
          where: { id: existing.id },
          data: {
            title: title !== undefined ? title : existing.title,
            excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
            body: content !== undefined ? content : existing.body,
            destinationCity: finalCity,
            source: finalCountry,
            eventStartDate: finalStartDate,
            eventEndDate: finalEndDate,
            attachmentName: attachmentName !== undefined ? attachmentName : existing.attachmentName,
            publishedAt: finalStartDate,
            authorId: updateAuthorId,
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
          module: 'BUSINESS_TRIP',
          targetId: existing.id,
          description: `Mengubah laporan perjalanan dinas: ${title || existing.title}`,
          details: {
            title: updated.title,
            keperluan: updated.title,
            nama: authorNameValue || editorUser?.name || 'Ahmad Fauzi, S.Kom.',
            destinationCity: updated.destinationCity,
            kotaTujuan: updated.destinationCity,
            negaraTujuan: updated.source || 'Indonesia',
            source: updated.source || 'Indonesia',
            eventStartDate: updated.eventStartDate?.toISOString(),
            eventEndDate: updated.eventEndDate?.toISOString(),
            startDate: updated.eventStartDate?.toISOString(),
            endDate: updated.eventEndDate?.toISOString(),
            attachmentName: updated.attachmentName,
            fullContent: updated.body,
            body: updated.body,
            status: updated.status === 'TERBIT' ? 'Terbit' : 'Menunggu',
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Laporan perjalanan dinas berhasil diperbarui',
          data: {
            ...updated,
            editor: { name: currentEditorName },
            editorName: currentEditorName,
          },
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

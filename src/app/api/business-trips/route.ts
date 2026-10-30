import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {
      type: 'BUSINESS_TRIP',
      status: { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU', 'Menunggu', 'DRAFT'] },
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } },
        { excerpt: { contains: search } },
        { destinationCity: { contains: search } },
      ];
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      take: 20,
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

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching business trips:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat laporan perjalanan dinas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      publishedAt,
      status,
      authorName,
      nama,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan laporan perjalanan dinas wajib diisi' },
        { status: 400 }
      );
    }

    const session = await getCurrentUser();
    let authorId = session?.userId;

    const authorNameValue = authorName || nama;
    if (authorNameValue) {
      const matchedUser = await prisma.user.findFirst({
        where: { name: { contains: authorNameValue } },
      });
      if (matchedUser) {
        authorId = matchedUser.id;
      }
    }

    if (!authorId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json(
          { success: false, message: 'User tidak ditemukan' },
          { status: 400 }
        );
      }
      authorId = defaultUser.id;
    }

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}-${Date.now()}`;

    const tripStatus = status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';
    const finalStartDate = startDate ? new Date(startDate) : (publishedAt ? new Date(publishedAt) : new Date());
    const finalEndDate = endDate ? new Date(endDate) : finalStartDate;
    const finalCity = kotaTujuan || destinationCity || 'Kota Surabaya';
    const finalCountry = negaraTujuan || (destinationCity?.includes(',') ? destinationCity.split(',')[1].trim() : 'Indonesia');

    const created = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt: excerpt || content.slice(0, 150),
        body: content,
        type: 'BUSINESS_TRIP',
        status: tripStatus,
        destinationCity: finalCity,
        source: finalCountry,
        eventStartDate: finalStartDate,
        eventEndDate: finalEndDate,
        attachmentName: attachmentName || null,
        authorId,
        publishedAt: finalStartDate,
      },
    });

    await logActivity({
      userId: authorId,
      action: 'CREATE',
      module: 'BUSINESS_TRIP',
      targetId: created.id,
      description: `Menambahkan laporan perjalanan dinas: ${title}`,
      details: {
        title,
        keperluan: title,
        nama: authorNameValue || session?.name || 'Ahmad Fauzi, S.Kom.',
        destinationCity: finalCity,
        kotaTujuan: finalCity,
        negaraTujuan: finalCountry,
        source: finalCountry,
        eventStartDate: finalStartDate.toISOString(),
        eventEndDate: finalEndDate.toISOString(),
        startDate: finalStartDate.toISOString(),
        endDate: finalEndDate.toISOString(),
        attachmentName: attachmentName || null,
        fullContent: content,
        body: content,
        status: tripStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan perjalanan dinas berhasil dipublikasikan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating business trip report:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan laporan perjalanan dinas' },
      { status: 500 }
    );
  }
}

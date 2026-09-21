import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    const where: any = {
      type: 'INTERNAL_DOCUMENT',
      status: 'TERBIT',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
        { attachmentName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        category: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching internal documents:', error);
    return NextResponse.json({ success: false, message: 'Gagal memuat dokumen intern' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, documentNumber, categoryName, keterangan, attachmentName, publishedAt, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Judul dokumen wajib diisi' },
        { status: 400 }
      );
    }

    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 400 }
      );
    }

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}-${Date.now()}`;

    // Find or connect category if provided
    let categoryId: string | undefined = undefined;
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
      : keterangan || '';

    const docStatus = status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';

    const created = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt: keterangan || title,
        body: formattedKeterangan || title,
        type: 'INTERNAL_DOCUMENT',
        status: docStatus,
        categoryId,
        attachmentName: attachmentName || 'Dokumen_Internal.pdf',
        fileSize: '1.5 MB',
        authorId: defaultUser.id,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Dokumen internal berhasil disimpan',
      data: created,
    });
  } catch (error) {
    console.error('Error creating internal document:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan dokumen internal' },
      { status: 500 }
    );
  }
}

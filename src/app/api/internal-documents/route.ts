import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const statusParam = searchParams.get('status');

    const session = await getCurrentUser();
    const isAdmin =
      session?.role?.toUpperCase() === 'ADMINISTRATOR' ||
      session?.role?.toUpperCase() === 'ADMIN';

    const where: any = {
      type: 'INTERNAL_DOCUMENT',
      AND: [],
    };

    if (isAdmin) {
      if (statusParam) {
        where.status = statusParam;
      } else {
        where.status = { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU', 'Menunggu', 'DRAFT'] };
      }
    } else if (session?.userId) {
      if (statusParam === 'MENUNGGU' || statusParam === 'Menunggu') {
        where.status = { in: ['MENUNGGU', 'Menunggu', 'DRAFT'] };
        where.authorId = session.userId;
      } else if (statusParam === 'TERBIT' || statusParam === 'Terbit') {
        where.status = { in: ['TERBIT', 'PUBLISHED'] };
      } else {
        where.AND.push({
          OR: [
            { status: { in: ['TERBIT', 'PUBLISHED'] } },
            {
              AND: [
                { status: { in: ['MENUNGGU', 'Menunggu', 'DRAFT'] } },
                { authorId: session.userId },
              ],
            },
          ],
        });
      }
    } else {
      where.status = { in: ['TERBIT', 'PUBLISHED'] };
    }

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search } },
          { excerpt: { contains: search } },
          { body: { contains: search } },
          { attachmentName: { contains: search } },
        ],
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const items = await prisma.content.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            nip: true,
          },
        },
      },
    });

    const formattedItems = items.map((item) => {
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
      return {
        ...item,
        documentNumber: docNumber,
        keterangan: cleanBody,
      };
    });

    return NextResponse.json({ success: true, data: formattedItems });
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

    // Validasi ukuran berkas maksimal 5MB per file
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (body.attachmentUrl) {
      try {
        const parsed = JSON.parse(body.attachmentUrl);
        const urlList = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of urlList) {
          if (typeof item === 'string' && item.startsWith('data:')) {
            const approxBytes = Math.round((item.length - (item.indexOf(',') + 1)) * 0.75);
            if (approxBytes > MAX_FILE_SIZE) {
              return NextResponse.json(
                { success: false, message: 'Ukuran berkas melebihi batas maksimal 5MB per file' },
                { status: 400 }
              );
            }
          }
        }
      } catch {}
    }

    const session = await getCurrentUser();
    let authorId = session?.userId;

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

    const docNumber = documentNumber ? documentNumber.trim() : null;
    const cleanKeterangan = keterangan ? keterangan.trim() : '';
    const formattedKeterangan = docNumber
      ? `[${docNumber}] ${cleanKeterangan}`
      : cleanKeterangan;

    const docStatus = status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT';

    const created = await prisma.content.create({
      data: {
        title,
        slug,
        source: docNumber,
        excerpt: cleanKeterangan || title,
        body: formattedKeterangan || title,
        type: 'INTERNAL_DOCUMENT',
        status: docStatus,
        categoryId,
        attachmentName: attachmentName ? attachmentName.trim() : null,
        attachmentUrl: body.attachmentUrl ? body.attachmentUrl : null,
        fileSize: attachmentName ? (body.fileSize || '1.5 MB') : null,
        authorId: authorId,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: {
        category: true,
      },
    });

    await logActivity({
      userId: authorId,
      action: 'CREATE',
      module: 'INTERNAL_DOCUMENT',
      targetId: created.id,
      description: `Menambahkan dokumen internal: ${title}`,
      details: {
        title,
        documentNumber: docNumber,
        nomorDokumen: docNumber,
        categoryName: categoryName || created.category?.name || 'Dokumen Internal',
        attachmentName: created.attachmentName,
        attachmentUrl: created.attachmentUrl,
        fullContent: cleanKeterangan,
        keterangan: cleanKeterangan,
        tanggal: created.publishedAt?.toISOString(),
        status: docStatus === 'TERBIT' ? 'Terbit' : 'Menunggu',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Dokumen internal berhasil disimpan',
      data: {
        ...created,
        documentNumber: docNumber,
        keterangan: cleanKeterangan,
      },
    });
  } catch (error) {
    console.error('Error creating internal document:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan dokumen internal' },
      { status: 500 }
    );
  }
}

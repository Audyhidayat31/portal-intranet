import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const contents = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat konten' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      body: contentBody,
      coverImage,
      type,
      status,
      isPinned,
      eventStartDate,
      eventLocation,
      destinationCity,
      attachmentName,
      fileSize,
    } = body;

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const newContent = await prisma.content.create({
      data: {
        title,
        slug,
        excerpt,
        body: contentBody,
        coverImage,
        type: type || 'NEWS',
        status: status || 'TERBIT',
        isPinned: Boolean(isPinned),
        eventStartDate: eventStartDate ? new Date(eventStartDate) : null,
        eventLocation,
        destinationCity,
        attachmentName,
        fileSize,
        attachmentUrl: attachmentName ? `/files/${attachmentName}` : null,
        authorId: user.userId,
      },
    });

    await logActivity({
      userId: user.userId,
      action: 'CREATE',
      module: 'NEWS',
      targetId: newContent.id,
      description: `Administrator membuat konten [${type}]: ${title}`,
    });

    return NextResponse.json({ success: true, message: 'Konten berhasil disimpan!', data: newContent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal membuat konten' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, excerpt, body: contentBody, coverImage, status, isPinned, eventLocation, destinationCity } = body;

    const updated = await prisma.content.update({
      where: { id },
      data: {
        title,
        excerpt,
        body: contentBody,
        coverImage,
        status,
        isPinned: Boolean(isPinned),
        eventLocation,
        destinationCity,
      },
    });

    await logActivity({
      userId: user.userId,
      action: 'UPDATE',
      module: 'NEWS',
      targetId: id,
      description: `Administrator mengubah konten: ${title}`,
    });

    return NextResponse.json({ success: true, message: 'Konten berhasil diperbarui!', data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memperbarui konten' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    const deleted = await prisma.content.delete({ where: { id } });

    await logActivity({
      userId: user.userId,
      action: 'DELETE',
      module: 'NEWS',
      targetId: id,
      description: `Administrator menghapus konten: ${deleted.title}`,
    });

    return NextResponse.json({ success: true, message: 'Konten berhasil dihapus!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus konten' }, { status: 500 });
  }
}

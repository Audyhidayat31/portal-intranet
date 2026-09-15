import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    const item = await prisma.content.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
        type: 'NEWS',
      },
      include: {
        author: {
          select: {
            name: true,
            nip: true,
            profile: {
              select: {
                avatarUrl: true,
                position: true,
                unitKerja: true,
              },
            },
          },
        },
        category: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat berita' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Harap login terlebih dahulu' },
        { status: 401 }
      );
    }

    const id = params?.id;
    const body = await request.json();
    const { title, excerpt, content, coverImage, publishedAt } = body;

    const updated = await prisma.content.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { body: content }),
        ...(coverImage && { coverImage }),
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui berita' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Harap login terlebih dahulu' },
        { status: 401 }
      );
    }

    const id = params?.id;

    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}

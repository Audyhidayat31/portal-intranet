import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        type: 'ANNOUNCEMENT',
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
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Pengumuman tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching announcement item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat pengumuman' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    const body = await request.json();
    const { title, excerpt, content, attachmentName, publishedAt } = body;

    const updated = await prisma.content.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { body: content }),
        ...(attachmentName !== undefined && { attachmentName }),
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui pengumuman' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus pengumuman' },
      { status: 500 }
    );
  }
}

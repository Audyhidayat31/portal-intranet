import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
    } catch (e) {}

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        editor: editorName ? { name: editorName } : null,
        editorName: editorName || null,
      },
    });
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, attachmentName, attachmentUrl, publishedAt, status } = body;

    const updated = await prisma.content.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { body: content }),
        ...(attachmentName !== undefined && { attachmentName: attachmentName || null }),
        ...(attachmentUrl !== undefined && { attachmentUrl: attachmentUrl || null }),
        ...(status && { status: status === 'Menunggu' || status === 'MENUNGGU' ? 'MENUNGGU' : 'TERBIT' }),
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });

    const session = await getCurrentUser();
    const actorId = session?.userId || updated.authorId;
    const editorUser = actorId ? await prisma.user.findUnique({ where: { id: actorId }, select: { name: true } }) : null;
    const currentEditorName = editorUser?.name || session?.name || 'Administrator Perpusnas';

    await logActivity({
      userId: actorId,
      action: 'UPDATE',
      module: 'ANNOUNCEMENT',
      targetId: id,
      description: `Mengubah pengumuman: ${title || updated.title}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Pengumuman berhasil diperbarui',
      data: {
        ...updated,
        editor: { name: currentEditorName },
        editorName: currentEditorName,
      },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

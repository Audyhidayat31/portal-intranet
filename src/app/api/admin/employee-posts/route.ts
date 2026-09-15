import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const posts = await prisma.employeePost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, nip: true } },
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal memuat postingan' }, { status: 500 });
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

    const post = await prisma.employeePost.delete({ where: { id } });

    await logActivity({
      userId: user.userId,
      action: 'DELETE',
      module: 'POSTS',
      targetId: id,
      description: `Administrator menghapus postingan pegawai: ${post.title}`,
    });

    return NextResponse.json({ success: true, message: 'Postingan berhasil dihapus!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menghapus postingan' }, { status: 500 });
  }
}

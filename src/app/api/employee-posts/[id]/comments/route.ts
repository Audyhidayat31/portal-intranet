import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Harap login terlebih dahulu' }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: 'Komentar tidak boleh kosong' }, { status: 400 });
    }

    const comment = await prisma.postComment.create({
      data: {
        postId: params.id,
        authorId: user.userId,
        content: content.trim(),
      },
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menambahkan komentar' }, { status: 500 });
  }
}

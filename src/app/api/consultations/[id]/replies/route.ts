import { NextRequest, NextResponse } from 'next/server';
import { prisma, withDbRetry } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const topicId = (await params).id;
    const body = await request.json();
    const { content, replyText, authorName } = body;

    const text = content || replyText;
    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: 'Tanggapan tidak boleh kosong' },
        { status: 400 }
      );
    }

    let user = await getCurrentUser();
    let authorId = user?.userId;
    if (!authorId) {
      const firstUser = await withDbRetry(() => prisma.user.findFirst());
      if (firstUser) authorId = firstUser.id;
    }

    const reply = await withDbRetry(() =>
      prisma.consultationReply.create({
        data: {
          topicId,
          authorId: authorId || 'default-user',
          replyText: text.trim(),
          isAdminReply: false,
        },
        include: {
          author: { select: { name: true, role: { select: { name: true } } } },
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Tanggapan berhasil dikirim',
      data: reply,
    });
  } catch (error) {
    console.error('Error creating consultation reply:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim tanggapan' },
      { status: 500 }
    );
  }
}

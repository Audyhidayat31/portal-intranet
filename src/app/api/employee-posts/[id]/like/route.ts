import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const post = await prisma.employeePost.update({
      where: { id: (await params).id },
      data: {
        likesCount: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, likesCount: post.likesCount });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal menyukai postingan' }, { status: 500 });
  }
}

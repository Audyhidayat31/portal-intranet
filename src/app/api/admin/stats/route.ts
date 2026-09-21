import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const [
      totalUsers,
      totalContents,
      totalPosts,
      totalAgendas,
      recentLogs,
      recentContents,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.content.count({ where: { status: 'TERBIT' } }),
      prisma.employeePost.count({ where: { status: 'TERBIT' } }),
      prisma.content.count({ where: { type: 'AGENDA' } }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { user: { select: { name: true, nip: true } } },
      }),
      prisma.content.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { author: { select: { name: true } } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalContents,
          totalPosts,
          totalAgendas,
        },
        recentLogs,
        recentContents,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Gagal memuat statistik admin' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      setting,
      latestNews,
      announcements,
      upcomingAgendas,
      latestPosts,
      spotlightFigure,
      allProfiles,
      totalEmployees,
      totalPosts,
    ] = await Promise.all([
      prisma.homepageSetting.findFirst(),
      prisma.content.findMany({
        where: { type: 'NEWS', status: 'PUBLISHED' },
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        take: 4,
        include: { author: { select: { name: true } }, category: true },
      }),
      prisma.content.findMany({
        where: { type: 'ANNOUNCEMENT', status: 'PUBLISHED' },
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        take: 4,
        include: { category: true },
      }),
      prisma.content.findMany({
        where: { type: 'AGENDA', status: 'PUBLISHED' },
        orderBy: { eventStartDate: 'asc' },
        take: 4,
      }),
      prisma.employeePost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: { author: { select: { name: true, profile: { select: { avatarUrl: true, unitKerja: true } } } } },
      }),
      prisma.figureProfile.findFirst({
        where: { isSpotlight: true },
      }) || prisma.figureProfile.findFirst({ orderBy: { createdAt: 'desc' } }),
      prisma.employeeProfile.findMany({
        select: {
          id: true,
          fullName: true,
          position: true,
          unitKerja: true,
          birthDate: true,
          avatarUrl: true,
        },
      }),
      prisma.user.count({ where: { role: { name: 'PEGAWAI' }, status: 'ACTIVE' } }),
      prisma.employeePost.count({ where: { status: 'PUBLISHED' } }),
    ]);

    // Calculate birthdays this month
    const currentMonth = new Date().getMonth();
    const birthdaysThisMonth = allProfiles.filter((p) => {
      if (!p.birthDate) return false;
      const bDate = new Date(p.birthDate);
      return bDate.getMonth() === currentMonth;
    }).slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        setting: setting || {
          heroTitle: 'Selamat Datang di Portal Intranet Perpusnas RI',
          heroSubtitle: 'Pusat Informasi Internal, Layanan Kedinasan, dan Interaksi Pegawai Perpustakaan Nasional Republik Indonesia',
          heroBadge: 'Portal Terpadu Aparatur Sipil Negara Perpusnas',
          quoteText: 'Membaca adalah jembatan emas menuju peradaban bangsa yang unggul dan berkarakter.',
          quoteAuthor: 'Pimpinan Perpustakaan Nasional RI',
          quoteAuthorRole: 'Perpustakaan Nasional Republik Indonesia',
          announcementTicker: 'Pemberitahuan: Seluruh pegawai dihimbau melengkapi data profil kepegawaian terkini sebelum akhir bulan.',
        },
        latestNews,
        announcements,
        upcomingAgendas,
        latestPosts,
        spotlightFigure,
        birthdaysThisMonth,
        stats: {
          totalEmployees: totalEmployees || 1280,
          totalPosts: totalPosts || 42,
          activeAgendas: upcomingAgendas.length,
          totalDigitalDocs: 350,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching homepage summary:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data ringkasan beranda' },
      { status: 500 }
    );
  }
}

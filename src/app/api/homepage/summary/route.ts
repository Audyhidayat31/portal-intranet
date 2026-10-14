import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdmin =
      user?.role?.toUpperCase() === 'ADMINISTRATOR' ||
      user?.role?.toUpperCase() === 'ADMIN';

    let newsWhere: any = { type: 'NEWS' };
    if (isAdmin) {
      newsWhere.status = { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU'] };
    } else if (user?.userId) {
      newsWhere.OR = [
        { status: { in: ['TERBIT', 'PUBLISHED'] } },
        {
          AND: [
            { status: { in: ['MENUNGGU', 'Menunggu'] } },
            { authorId: user.userId },
          ],
        },
      ];
    } else {
      newsWhere.status = { in: ['TERBIT', 'PUBLISHED'] };
    }

    let postsWhere: any = {};
    if (isAdmin) {
      postsWhere.status = { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU'] };
    } else if (user?.userId) {
      postsWhere.OR = [
        { status: { in: ['TERBIT', 'PUBLISHED'] } },
        {
          AND: [
            { status: { in: ['MENUNGGU', 'Menunggu'] } },
            { authorId: user.userId },
          ],
        },
      ];
    } else {
      postsWhere.status = { in: ['TERBIT', 'PUBLISHED'] };
    }

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
      totalNews,
      totalOpini,
      totalTips,
      latestKalimatBijak,
    ] = await Promise.all([
      prisma.homepageSetting.findFirst(),
      prisma.content.findMany({
        where: newsWhere,
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        take: 4,
        include: { author: { select: { name: true, profile: { select: { avatarUrl: true, unitKerja: true } } } } },
      }),
      prisma.pengumuman.findMany({
        where: { status: { in: ['TERBIT', 'PUBLISHED'] } },
        orderBy: [{ disematkan: 'desc' }, { tanggalTerbit: 'desc' }],
        take: 4,
      }),
      prisma.agendaKegiatan.findMany({
        where: { status: { in: ['TERBIT', 'PUBLISHED'] } },
        orderBy: { tanggalMulai: 'asc' },
        take: 4,
      }),
      // For "latest posts" on homepage
      prisma.employeePost.findMany({
        where: postsWhere,
        orderBy: { createdAt: 'desc' },
        take: 9,
        include: { author: { select: { name: true, profile: { select: { avatarUrl: true, unitKerja: true } } } } },
      }),
      prisma.figureProfile.findFirst({
        orderBy: [{ isSpotlight: 'desc' }, { createdAt: 'desc' }],
      }),
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
      prisma.user.count({
        where: {
          status: 'ACTIVE',
          role: {
            name: {
              not: 'ADMINISTRATOR'
            }
          }
        }
      }),
      prisma.employeePost.count({ where: postsWhere }),
      prisma.content.count({ where: newsWhere }).catch(() => 0),
      prisma.employeePost.count({ where: { categorySlug: 'opini', ...postsWhere } }).catch(() => 0),
      prisma.employeePost.count({ where: { categorySlug: 'tips-gaya-hidup', ...postsWhere } }).catch(() => 0),
      prisma.employeePost.findFirst({
        where: {
          categorySlug: 'kalimat-bijak',
          ...postsWhere,
        },
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      }).catch(() => null),
    ]);

    // Calculate birthdays this month
    const currentMonth = new Date().getMonth();
    const birthdaysThisMonth = allProfiles.filter((p) => {
      if (!p.birthDate) return false;
      const bDate = new Date(p.birthDate);
      return bDate.getMonth() === currentMonth;
    }).slice(0, 5);

    // Map Content to News format
    const mappedNews = latestNews.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || (item.body ? item.body.slice(0, 110) + '...' : ''),
      content: item.body || item.excerpt || '',
      coverImage: item.coverImage && !item.coverImage.includes('berita-arsip.webp') ? item.coverImage : '/images/logo-perpusnas.png',
      publishedAt: item.publishedAt,
      status: item.status === 'MENUNGGU' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
      author: item.author ? { name: item.author.name } : { name: 'Humas Perpusnas' },
    }));

    // Map Pengumuman to Announcement format
    const mappedAnnouncements = announcements.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.judul,
      excerpt: item.ringkasan,
      publishedAt: item.tanggalTerbit,
    }));

    // Map AgendaKegiatan to Agenda format
    const mappedAgendas = upcomingAgendas.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.namaKegiatan,
      eventStartDate: item.tanggalMulai,
      eventEndDate: item.tanggalSelesai,
      location: item.lokasi,
    }));

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
        latestNews: mappedNews,
        announcements: mappedAnnouncements,
        upcomingAgendas: mappedAgendas,
        latestPosts,
        kalimatBijak: latestKalimatBijak
          ? {
            id: latestKalimatBijak.id,
            title: latestKalimatBijak.title,
            quote: latestKalimatBijak.body || latestKalimatBijak.title,
            figure: latestKalimatBijak.title || 'Tokoh Bangsa',
            author: latestKalimatBijak.author?.name || 'Ahmad Fauzi, S.Kom.',
          }
          : null,
        spotlightFigure: spotlightFigure
          ? {
            ...spotlightFigure,
            title: spotlightFigure.position
              ? `${spotlightFigure.name.toUpperCase()} : ${spotlightFigure.position.toUpperCase()}`
              : spotlightFigure.name.toUpperCase(),
            bio:
              spotlightFigure.fullStory ||
              spotlightFigure.quote ||
              '',
            avatarUrl: spotlightFigure.photoUrl || null,
          }
          : null,
        birthdaysThisMonth,
        stats: {
          totalEmployees: totalEmployees ?? 0,
          totalNews: totalNews ?? 0,
          totalOpini: totalOpini ?? 0,
          totalTips: totalTips ?? 0,
          totalPosts: totalPosts ?? 0,
          activeAgendas: upcomingAgendas.length,
          totalDigitalDocs: 350,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching homepage summary:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat ringkasan beranda' },
      { status: 500 }
    );
  }
}

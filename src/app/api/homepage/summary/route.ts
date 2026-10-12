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
      totalNews,
      totalOpini,
      totalTips,
      latestKalimatBijak,
    ] = await Promise.all([
      prisma.homepageSetting.findFirst(),
      prisma.berita.findMany({
        where: { status: { in: ['TERBIT', 'PUBLISHED'] } },
        orderBy: [{ disematkan: 'desc' }, { tanggalTerbit: 'desc' }],
        take: 4,
        include: { penulis: { select: { name: true } } },
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
      // For "latest posts" on homepage, we can query from a generic table or just mix and match
      prisma.employeePost.findMany({
        where: { status: { in: ['TERBIT', 'PUBLISHED'] } },
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
      prisma.employeePost.count({ where: { status: { in: ['TERBIT', 'PUBLISHED'] } } }),
      prisma.content.count({ where: { type: 'NEWS', status: { in: ['TERBIT', 'PUBLISHED', 'MENUNGGU'] } } }).catch(() => 0),
      prisma.employeePost.count({ where: { categorySlug: 'opini', status: { in: ['TERBIT', 'PUBLISHED'] } } }).catch(() => 0),
      prisma.employeePost.count({ where: { categorySlug: 'tips-gaya-hidup', status: { in: ['TERBIT', 'PUBLISHED'] } } }).catch(() => 0),
      prisma.employeePost.findFirst({
        where: {
          categorySlug: 'kalimat-bijak',
          status: { in: ['TERBIT', 'PUBLISHED'] },
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

    // Map Berita to News format
    const mappedNews = latestNews.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.judul,
      excerpt: item.ringkasan,
      coverImage: item.gambarSampul,
      publishedAt: item.tanggalTerbit,
      author: item.penulis ? { name: item.penulis.name } : { name: item.namaPenulis },
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

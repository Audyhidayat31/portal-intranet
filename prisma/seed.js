const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Perpusnas Intranet Database...');

  // 1. Roles & Permissions
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMINISTRATOR' },
    update: {},
    create: {
      name: 'ADMINISTRATOR',
      description: 'Pengelola penuh sistem, pengguna, hak akses, homepage, konten, dan log aktivitas.',
    },
  });

  const pegawaiRole = await prisma.role.upsert({
    where: { name: 'PEGAWAI' },
    update: {},
    create: {
      name: 'PEGAWAI',
      description: 'Pegawai internal Perpustakaan Nasional RI pengguna modul informasi & interaksi portal.',
    },
  });

  const permissions = [
    { code: 'USERS_MANAGE', module: 'USERS', description: 'Mengelola data pengguna dan NIP' },
    { code: 'ROLES_MANAGE', module: 'ROLES', description: 'Mengelola role dan hak akses' },
    { code: 'HOMEPAGE_MANAGE', module: 'HOMEPAGE', description: 'Mengelola tata letak dan banner homepage' },
    { code: 'NEWS_MANAGE', module: 'CONTENTS', description: 'Mengelola berita kedinasan' },
    { code: 'ANNOUNCEMENTS_MANAGE', module: 'CONTENTS', description: 'Mengelola pengumuman dinas' },
    { code: 'AGENDAS_MANAGE', module: 'CONTENTS', description: 'Mengelola kalender agenda dinas' },
    { code: 'DOCUMENTS_MANAGE', module: 'CONTENTS', description: 'Mengelola repositori dokumen intern' },
    { code: 'POSTS_MODERATE', module: 'POSTS', description: 'Moderasi dan pengelolaan konten antar pegawai' },
    { code: 'FIGURE_MANAGE', module: 'FIGURE', description: 'Mengelola artikel profil Kupas Sosok' },
    { code: 'LOGS_VIEW', module: 'LOGS', description: 'Melihat riwayat audit log aktivitas' },
  ];

  for (const perm of permissions) {
    const createdPerm = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: createdPerm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: createdPerm.id,
      },
    });
  }

  // 2. Categories
  const categories = [
    // Kabar Kedinasan
    { name: 'Berita', slug: 'berita', group: 'KABAR_KEDINASAN', description: 'Berita resmi kedinasan Perpusnas' },
    { name: 'Pengumuman', slug: 'pengumuman', group: 'KABAR_KEDINASAN', description: 'Surat edaran dan pengumuman kedinasan' },
    { name: 'Agenda Kegiatan', slug: 'agenda', group: 'KABAR_KEDINASAN', description: 'Jadwal agenda kegiatan kedinasan' },
    { name: 'Laporan Perjalanan Dinas', slug: 'laporan-perjalanan', group: 'KABAR_KEDINASAN', description: 'Laporan hasil tugas perjalanan dinas' },
    { name: 'Dokumen Intern', slug: 'dokumen-intern', group: 'KABAR_KEDINASAN', description: 'Dokumen, panduan, dan regulasi internal' },

    // Antar Pegawai
    { name: 'Coretan Opini Pegawai', slug: 'opini', group: 'ANTAR_PEGAWAI', description: 'Opini dan gagasan pegawai' },
    { name: 'Humor', slug: 'humor', group: 'ANTAR_PEGAWAI', description: 'Pojok humor dan relaksasi' },
    { name: 'Jelajah Bumi', slug: 'jelajah-bumi', group: 'ANTAR_PEGAWAI', description: 'Catatan traveling dan petualangan' },
    { name: 'Kabar Keluarga', slug: 'kabar-keluarga', group: 'ANTAR_PEGAWAI', description: 'Berita suka dan duka keluarga besar pegawai' },
    { name: 'Kalimat Bijak', slug: 'kalimat-bijak', group: 'ANTAR_PEGAWAI', description: 'Kutipan motivasi dan mutiara kata' },
    { name: 'Karya Akademik Pegawai', slug: 'karya-akademik', group: 'ANTAR_PEGAWAI', description: 'Jurnal, riset, dan karya ilmiah pegawai' },
    { name: 'Tips dan Gaya Hidup', slug: 'tips-gaya-hidup', group: 'ANTAR_PEGAWAI', description: 'Tips kesehatan, keuangan, dan hobi' },
    { name: 'Konsultasi Kepegawaian', slug: 'konsultasi-kepegawaian', group: 'ANTAR_PEGAWAI', description: 'Layanan tanya-jawab kepegawaian' },
    { name: 'Konsultasi IT', slug: 'konsultasi-it', group: 'ANTAR_PEGAWAI', description: 'Bantuan teknis dan sistem informasi' },
    { name: 'Konsultasi Kesehatan', slug: 'konsultasi-kesehatan', group: 'ANTAR_PEGAWAI', description: 'Konsultasi medis dan kesehatan kerja' },
    { name: 'Olahraga', slug: 'olahraga', group: 'ANTAR_PEGAWAI', description: 'Komunitas dan kegiatan olahraga' },
    { name: 'Tahukah Anda', slug: 'tahukah-anda', group: 'ANTAR_PEGAWAI', description: 'Trivia dan fakta unik perpustakaan' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 3. Users & Profiles
  const defaultPasswordHash = await bcrypt.hash('admin123', 10);
  const pegawaiPasswordHash = await bcrypt.hash('pegawai123', 10);

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { nip: 'ADMIN001' },
    update: {
      password: defaultPasswordHash,
      roleId: adminRole.id,
      status: 'ACTIVE',
    },
    create: {
      nip: 'ADMIN001',
      name: 'Administrator Perpusnas',
      email: 'admin@perpusnas.go.id',
      password: defaultPasswordHash,
      roleId: adminRole.id,
      status: 'ACTIVE',
      profile: {
        create: {
          nip: 'ADMIN001',
          fullName: 'Administrator Sistem Perpusnas RI',
          position: 'Pranata Komputer Ahli Madya',
          unitKerja: 'Pusat Data dan Informasi (Pusdatin)',
          golRuang: 'IV/a - Pembina',
          phone: '081299988776',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
          birthDate: new Date('1985-05-10'),
          education: 'S2 Magister Teknologi Informasi Universitas Indonesia',
          careerHistory: 'Staff Pusdatin (2010-2015), Kasubbag Infrastruktur IT (2016-2021), Pranata Komputer Ahli Madya (2022-Sekarang)',
          achievements: 'Inovator Terbaik Transformasi Layanan Digital Perpusnas 2024',
          bio: 'Mengabdi untuk keandalan infrastruktur dan inovasi sistem digital Perpustakaan Nasional RI.',
        },
      },
    },
  });

  // Pegawai 1
  const pegawai1 = await prisma.user.upsert({
    where: { nip: '198501152010011001' },
    update: {
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
    },
    create: {
      nip: '198501152010011001',
      name: 'Drs. Bambang Sudirman, M.Hum.',
      email: 'bambang.sudirman@perpusnas.go.id',
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
      profile: {
        create: {
          nip: '198501152010011001',
          fullName: 'Drs. Bambang Sudirman, M.Hum.',
          position: 'Pustakawan Ahli Madya',
          unitKerja: 'Direktorat Deposit dan Pengembangan Koleksi Bahan Pustaka',
          golRuang: 'IV/b - Pembina Tingkat I',
          phone: '081122334455',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
          birthDate: new Date('1985-01-15'),
          education: 'S2 Ilmu Perpustakaan dan Informasi Universitas Indonesia',
          careerHistory: 'Pustakawan Pertama (2010-2015), Pustakawan Muda (2015-2020), Pustakawan Madya (2020-Sekarang)',
          achievements: 'Pustakawan Berprestasi Tingkat Nasional Kategori Pelestarian Naskah Kuno 2023',
          bio: 'Pencinta manuskrip Nusantara dan penggerak digitalisasi naskah kuno nusantara.',
        },
      },
    },
  });

  // Pegawai 2
  const pegawai2 = await prisma.user.upsert({
    where: { nip: '199003202015022003' },
    update: {
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
    },
    create: {
      nip: '199003202015022003',
      name: 'Siti Nurhaliza, S.Sos.',
      email: 'siti.nurhaliza@perpusnas.go.id',
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
      profile: {
        create: {
          nip: '199003202015022003',
          fullName: 'Siti Nurhaliza, S.Sos.',
          position: 'Pranata Humas Ahli Muda',
          unitKerja: 'Biro Hukum, Organisasi, Kerja Sama, dan Hubungan Masyarakat',
          golRuang: 'III/c - Penata',
          phone: '081344556677',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
          birthDate: new Date('1990-03-20'),
          education: 'S1 Ilmu Komunikasi Universitas Gadjah Mada',
          careerHistory: 'Staf Humas (2015-2019), Pranata Humas Ahli Pertama (2019-2023), Pranata Humas Ahli Muda (2023-Sekarang)',
          achievements: 'Penulis Siaran Pers Terbaik Kementerian/Lembaga Anugerah Media Humas 2024',
          bio: 'Menyampaikan kabar literasi bangsa dengan integritas, keramahan, dan kreativitas.',
        },
      },
    },
  });

  // Pegawai 3
  const pegawai3 = await prisma.user.upsert({
    where: { nip: '199208142018011005' },
    update: {
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
    },
    create: {
      nip: '199208142018011005',
      name: 'Ahmad Fauzi, S.Kom.',
      email: 'ahmad.fauzi@perpusnas.go.id',
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
      profile: {
        create: {
          nip: '199208142018011005',
          fullName: 'Ahmad Fauzi, S.Kom.',
          position: 'Pranata Komputer Ahli Pertama',
          unitKerja: 'Pusat Data dan Informasi (Pusdatin)',
          golRuang: 'III/b - Penata Muda Tingkat I',
          phone: '081566778899',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
          birthDate: new Date('1992-08-14'),
          education: 'S1 Teknik Informatika Institut Teknologi Bandung',
          careerHistory: 'Fullstack Developer Pusdatin Perpusnas (2018-Sekarang)',
          achievements: 'Pengembang Sistem Integrasi iPusnas dan Katalog Terdistribusi Nasional',
          bio: 'Pengembang software antusias yang berdedikasi membangun aplikasi perpustakaan modern.',
        },
      },
    },
  });

  // Pegawai 4
  const pegawai4 = await prisma.user.upsert({
    where: { nip: '198811052012012002' },
    update: {
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
    },
    create: {
      nip: '198811052012012002',
      name: 'Dr. Ratna Dewi, M.Si.',
      email: 'ratna.dewi@perpusnas.go.id',
      password: pegawaiPasswordHash,
      roleId: pegawaiRole.id,
      status: 'ACTIVE',
      profile: {
        create: {
          nip: '198811052012012002',
          fullName: 'Dr. Ratna Dewi, M.Si.',
          position: 'Pustakawan Ahli Utama',
          unitKerja: 'Pusat Pengembangan Perpustakaan Sekolah/Madrasah dan Perguruan Tinggi',
          golRuang: 'IV/c - Pembina Utama Muda',
          phone: '081277889900',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
          birthDate: new Date('1988-11-05'),
          education: 'S3 Manajemen Kebijakan Publik Universitas Indonesia',
          careerHistory: 'Koordinator Standardisasi Perpustakaan (2018-2022), Peneliti Kebijakan Literasi (2022-Sekarang)',
          achievements: 'Penerima Satyalancana Karya Satya X Tahun dari Presiden Republik Indonesia',
          bio: 'Memajukan perpustakaan ramah inklusi dan standardisasi mutu perpustakaan se-Indonesia.',
        },
      },
    },
  });

  // 4. Homepage Settings
  await prisma.homepageSetting.upsert({
    where: { id: 'default-setting' },
    update: {},
    create: {
      id: 'default-setting',
      heroTitle: 'Selamat Datang di Portal Intranet Perpusnas RI',
      heroSubtitle: 'Satu pintu akses informasi kedinasan, kolaborasi antarpegawai, pengembangan kompetensi, dan layanan terpadu Perpustakaan Nasional Republik Indonesia.',
      heroBadge: 'Portal Terpadu Aparatur Sipil Negara Perpusnas',
      heroBannerUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop',
      quoteText: 'Membaca dan melestarikan khazanah literasi adalah ikhtiar luhur merajut martabat dan masa depan bangsa.',
      quoteAuthor: 'Pimpinan Perpustakaan Nasional RI',
      quoteAuthorRole: 'Gedung Fasilitas Layanan Perpusnas Jl. Medan Merdeka Selatan No. 11 Jakarta',
      announcementTicker: 'Pemberitahuan Resmi: Pelaksanaan Penilaian Kinerja Triwulan III dan Pembaruan Data Pegawai dapat diakses melalui portal sebelum 31 Agustus 2026.',
    },
  });

  // 5. Contents - Kabar Kedinasan
  const newsCategory = await prisma.category.findUnique({ where: { slug: 'berita' } });
  const annCategory = await prisma.category.findUnique({ where: { slug: 'pengumuman' } });
  const agendaCategory = await prisma.category.findUnique({ where: { slug: 'agenda' } });
  const tripCategory = await prisma.category.findUnique({ where: { slug: 'laporan-perjalanan' } });
  const docCategory = await prisma.category.findUnique({ where: { slug: 'dokumen-intern' } });

  // News
  const newsData = [
    {
      title: 'Perpusnas Resmikan Layanan Digital Koleksi Naskah Kuno Berbasis AI',
      slug: 'perpusnas-resmikan-layanan-digital-koleksi-naskah-kuno-ai',
      excerpt: 'Inovasi teknologi kecerdasan buatan kini diintegrasikan untuk transkripsi dan transliterasi otomatis naskah nusantara berumur ratusan tahun.',
      body: `Perpustakaan Nasional Republik Indonesia secara resmi meluncurkan pembaruan platform preservasi digital naskah kuno nusantara dengan dukungan AI. Layanan ini memungkinkan para peneliti, akademisi, dan masyarakat umum untuk membaca naskah beraksara Pegon, Jawa, Bali, dan Sunda kuno dengan terjemahan instan ke dalam Bahasa Indonesia modern.\n\nDalam sambutannya, Kepala Perpustakaan Nasional menegaskan bahwa langkah ini adalah bukti nyata komitmen lembaga dalam mengawal amanat pelestarian warisan budaya bangsa sekaligus merespons disrupsi teknologi abad ke-21 secara proaktif.\n\nPegawai di seluruh unit kerja diharapkan turut menyosialisasikan layanan kebanggaan ini kepada para pemustaka di seluruh penjuru tanah air.`,
      coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be8510d2?w=800&auto=format&fit=crop',
      type: 'NEWS',
      status: 'TERBIT',
      categoryId: newsCategory.id,
      authorId: adminUser.id,
      isPinned: true,
      viewCount: 1420,
    },
    {
      title: 'Kunjungan Delegasi Perpustakaan Nasional Australia (NLA) Perkuat Kerja Sama Bilateral',
      slug: 'kunjungan-delegasi-perpustakaan-nasional-australia-2026',
      excerpt: 'Pertemuan bilateral membahas pertukaran arsip digital, program magang pustakawan muda, dan pelestarian peta sejarah maritim Asia-Pasifik.',
      body: `Delegasi tingkat tinggi dari National Library of Australia (NLA) mengunjungi Gedung Fasilitas Layanan Perpustakaan Nasional RI di Jalan Medan Merdeka Selatan No. 11, Jakarta. Kunjungan diplomatik dan teknis ini menghasilkan kesepakatan pembaruan MoU terkait pertukaran data bibliografi serta transfer teknologi konservasi kertas langka.\n\nSeluruh tim kerja Pusat Preservasi dan Alih Media Bahan Perpustakaan turut mendampingi proses workshop bersama yang diselenggarakan di lantai 8.`,
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop',
      type: 'NEWS',
      status: 'TERBIT',
      categoryId: newsCategory.id,
      authorId: adminUser.id,
      viewCount: 890,
    },
    {
      title: 'Pekan Literasi Kebangsaan 2026 Sukses Digelar di 38 Provinsi',
      slug: 'pekan-literasi-kebangsaan-2026-sukses-digelar',
      excerpt: 'Rangkaian festival buku keliling, bedah buku tematik, dan lomba bertutur daerah berhasil menjangkau lebih dari 2 juta generasi muda Indonesia.',
      body: `Pekan Literasi Kebangsaan 2026 yang diinisiasi oleh Perpustakaan Nasional RI bersama Dinas Perpustakaan dan Kearsipan Daerah di seluruh Indonesia berakhir dengan sukses. Tingkat partisipasi masyarakat meningkat 34% dibanding tahun sebelumnya, didorong oleh kolaborasi perpustakaan desa ramah anak dan armada perpustakaan keliling modern.`,
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop',
      type: 'NEWS',
      status: 'TERBIT',
      categoryId: newsCategory.id,
      authorId: adminUser.id,
      viewCount: 650,
    },
  ];

  for (const n of newsData) {
    await prisma.content.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    });
  }

  // Announcements
  const announcements = [
    {
      title: 'Surat Edaran: Tata Tertib Presensi Online dan Kerja Fleksibel (FWA) TW III 2026',
      slug: 'surat-edaran-presensi-fwa-tw-3-2026',
      excerpt: 'Pemberlakuan panduan teknis Flexible Working Arrangement bagi seluruh ASN dan PPNPN di lingkungan Perpustakaan Nasional RI.',
      body: `Menindaklanjuti Keputusan Kepala Perpustakaan Nasional RI terkait tata kelola aparatur sipil negara modern, diberitahukan kepada seluruh pegawai bahwa sistem presensi geolokasi dan laporan harian wajib diinput sebelum pukul 17.30 WIB setiap hari kerja.\n\nDetail ketentuan FWA dan pengecualian unit layanan operasional dapat diunduh pada lampiran dokumen terlampir.`,
      type: 'ANNOUNCEMENT',
      status: 'TERBIT',
      categoryId: annCategory.id,
      authorId: adminUser.id,
      attachmentUrl: '/files/SE_Presensi_FWA_Perpusnas_2026.pdf',
      attachmentName: 'SE_Presensi_FWA_Perpusnas_2026.pdf',
      fileSize: '1.4 MB',
      isPinned: true,
    },
    {
      title: 'Jadwal Pemeriksaan Kesehatan Berkala (Medical Check-Up) Pegawai Perpusnas 2026',
      slug: 'jadwal-mcu-pegawai-perpusnas-2026',
      excerpt: 'Pelaksanaan MCU gratis di Poliklinik Gedung Salemba dan Merdeka Selatan mulai tanggal 25 Agustus s.d. 5 September 2026.',
      body: `Biro Umum dan Kepegawaian menyelenggarakan kegiatan Medical Check-Up tahunan. Seluruh pegawai dimohon mendaftar pada shift jadwal unit kerja masing-masing guna menghindari antrean.`,
      type: 'ANNOUNCEMENT',
      status: 'TERBIT',
      categoryId: annCategory.id,
      authorId: adminUser.id,
      attachmentUrl: '/files/Jadwal_MCU_Pegawai_2026.pdf',
      attachmentName: 'Jadwal_MCU_Pegawai_2026.pdf',
      fileSize: '820 KB',
      isPinned: false,
    },
  ];

  for (const ann of announcements) {
    await prisma.content.upsert({
      where: { slug: ann.slug },
      update: ann,
      create: ann,
    });
  }

  // Agendas
  const agendas = [
    {
      title: 'Rapat Koordinasi Nasional (Rakornas) Bidang Perpustakaan 2026',
      slug: 'rakornas-bidang-perpustakaan-2026',
      excerpt: 'Sinergi Pusat dan Daerah Menuju Ekosistem Perpustakaan Berkelanjutan.',
      body: 'Rapat pleno tahunan mengundang perwakilan Dinas Perpustakaan Provinsi/Kabupaten/Kota, pengelola perpustakaan perguruan tinggi, dan asosiasi kepustakawanan.',
      type: 'AGENDA',
      status: 'TERBIT',
      categoryId: agendaCategory.id,
      authorId: adminUser.id,
      eventStartDate: new Date('2026-08-25T08:30:00'),
      eventEndDate: new Date('2026-08-27T17:00:00'),
      eventLocation: 'Auditorium Gd. Teater Jakarta & Lt. 2 Hall Perpusnas',
    },
    {
      title: 'Workshop Kurasi dan Digital Preservation Format 3D Koleksi Bernilai Sejarah',
      slug: 'workshop-digital-preservation-3d-2026',
      excerpt: 'Pelatihan teknis pemindaian fotogrametri dan pemodelan 3D artefak perpustakaan.',
      body: 'Bimbingan teknis intensif bagi pranata komputer dan pustakawan konservasi bekerja sama dengan Laboratorium Digital ITB.',
      type: 'AGENDA',
      status: 'TERBIT',
      categoryId: agendaCategory.id,
      authorId: adminUser.id,
      eventStartDate: new Date('2026-09-02T09:00:00'),
      eventEndDate: new Date('2026-09-03T16:00:00'),
      eventLocation: 'Ruang Workshop Lab Preservasi Lt. 8 Salemba',
    },
    {
      title: 'Bedah Buku dan Diskusi Literasi: Menelusuri Jejak Pustaka Nusantara Abad 18',
      slug: 'bedah-buku-jejak-pustaka-nusantara',
      excerpt: 'Narasumber ahli filologi dan sastrawan nasional mengupas manuskrip langka koleksi deposit.',
      body: 'Terbuka untuk seluruh pegawai dan sivitas akademika. Disediakan sertifikat e-learning bagi peserta internal.',
      type: 'AGENDA',
      status: 'TERBIT',
      categoryId: agendaCategory.id,
      authorId: adminUser.id,
      eventStartDate: new Date('2026-09-10T13:30:00'),
      eventEndDate: new Date('2026-09-10T16:30:00'),
      eventLocation: 'Lantai 24 Lounge Eksekutif Perpusnas',
    },
  ];

  for (const ag of agendas) {
    await prisma.content.upsert({
      where: { slug: ag.slug },
      update: ag,
      create: ag,
    });
  }

  // Business Trip Reports
  const businessTrips = [
    {
      title: 'Laporan Tugas Monitoring dan Supervisi Perpustakaan Daerah Provinsi DI Yogyakarta',
      slug: 'lap-perjadin-monitoring-perpusda-diy-2026',
      excerpt: 'Evaluasi akreditasi 45 perpustakaan sekolah dan desa di wilayah Kabupaten Kulon Progo dan Sleman.',
      body: `Tim Direktorat Pengembangan Perpustakaan Umum melaksanakan monitoring lapangan pada 10-14 Agustus 2026. Temuan penting mencakup tingginya adopsi katalog otomasi berbasis INLISLite di 85% titik layanan serta usulan penguatan hibah pojok baca digital (POCADI).`,
      type: 'BUSINESS_TRIP',
      status: 'TERBIT',
      categoryId: tripCategory.id,
      authorId: pegawai1.id,
      destinationCity: 'Yogyakarta & Sleman',
      attachmentUrl: '/files/Laporan_Perjadin_DIY_Agustus2026.pdf',
      attachmentName: 'Laporan_Perjadin_DIY_Agustus2026.pdf',
      fileSize: '3.1 MB',
    },
    {
      title: 'Laporan Delegasi Workshop Kepustakawanan Asia Tenggara (CONSAL) di Singapura',
      slug: 'lap-perjadin-consal-singapura-2026',
      excerpt: 'Partisipasi aktif dalam perumusan standar interoperabilitas data metadata katalog perpustakaan ASEAN.',
      body: `Perpusnas mengutus 3 orang pejabat fungsional pustakawan utama untuk menyampaikan makalah best practice penanganan manuskrip tropis dan big data analitik pengguna perpustakaan digital.`,
      type: 'BUSINESS_TRIP',
      status: 'TERBIT',
      categoryId: tripCategory.id,
      authorId: pegawai4.id,
      destinationCity: 'Singapura',
      attachmentUrl: '/files/Laporan_Delegasi_CONSAL_2026.pdf',
      attachmentName: 'Laporan_Delegasi_CONSAL_2026.pdf',
      fileSize: '4.8 MB',
    },
  ];

  for (const bt of businessTrips) {
    await prisma.content.upsert({
      where: { slug: bt.slug },
      update: bt,
      create: bt,
    });
  }

  // Internal Documents
  const internalDocs = [
    {
      title: 'Pedoman Standar Operasional Prosedur (SOP) Layanan Referensi & Deposit 2026',
      slug: 'sop-layanan-referensi-deposit-2026',
      excerpt: 'Buku panduan baku alur kerja penyerahan karya cetak dan karya rekam (KCKR) serta alur layanan pemustaka riset.',
      body: 'Dokumen ini mengikat seluruh staf direktorat deposit dan layanan informasi dalam memastikan kepatuhan UU No. 13 Tahun 2018.',
      type: 'INTERNAL_DOCUMENT',
      status: 'TERBIT',
      categoryId: docCategory.id,
      authorId: adminUser.id,
      attachmentUrl: '/files/SOP_Layanan_Deposit_2026_Final.pdf',
      attachmentName: 'SOP_Layanan_Deposit_2026_Final.pdf',
      fileSize: '5.2 MB',
    },
    {
      title: 'Pedoman Teknis Keselamatan Kerja dan Tanggap Darurat Gedung Fasilitas Layanan',
      slug: 'pedoman-k3-evakuasi-gedung-2026',
      excerpt: 'Instruksi kerja evakuasi, penanganan kebakaran koleksi bahan langka, dan nomor darurat internal gedung 27 lantai.',
      body: 'Wajib dipahami oleh seluruh floor captain dan pegawai di lingkungan Medan Merdeka Selatan No. 11.',
      type: 'INTERNAL_DOCUMENT',
      status: 'TERBIT',
      categoryId: docCategory.id,
      authorId: adminUser.id,
      attachmentUrl: '/files/Buku_Saku_K3_Perpusnas_2026.pdf',
      attachmentName: 'Buku_Saku_K3_Perpusnas_2026.pdf',
      fileSize: '2.9 MB',
    },
  ];

  for (const doc of internalDocs) {
    await prisma.content.upsert({
      where: { slug: doc.slug },
      update: doc,
      create: doc,
    });
  }

  // 6. Employee Posts (12 Categories of Antar Pegawai)
  const employeePostsData = [
    {
      title: 'Membangun Ekosistem Knowledge Sharing yang Nyaman di Lingkungan Birokrasi',
      slug: 'membangun-ekosistem-knowledge-sharing-perpusnas',
      categorySlug: 'opini',
      authorId: pegawai1.id,
      body: 'Birokrasi sering diidentikkan dengan sekat-sekat unit kerja yang kaku. Namun di Perpustakaan Nasional, kekayaan ilmu dari para pustakawan senior dan energi inovatif dari generasi muda ASN sejatinya dapat berpadu indah jika ruang bertukar ide informal terus dipupuk. Mari aktif menuliskan catatan lapangan, metode baru, dan inspirasi harian di portal ini!',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
      likesCount: 28,
      viewsCount: 310,
    },
    {
      title: 'Ketika Pembaca Bertanya: "Buku Ini Masih di Rak atau Sudah Dipinjam?"',
      slug: 'humor-pustakawan-rak-buku-lucu',
      categorySlug: 'humor',
      authorId: pegawai2.id,
      body: 'Pustakawan layanan referensi sering menghadapi momen menggelitik. Suatu siang seorang pemustaka bertanya: "Mbak, saya cari buku yang sampulnya warna biru, tebalnya sejengkal, penulisnya kalau tidak salah pakai kacamata..." Dengan jurus pencarian katalog sakti dan senyum ramah, akhirnya buku tersebut ketemu juga dalam waktu 2 menit! Salam hangat untuk kawan-kawan front office!',
      coverImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
      likesCount: 45,
      viewsCount: 520,
    },
    {
      title: 'Menyusuri Jejak Manuskrip Kuno di Pedalaman Lembah Baliem Papua',
      slug: 'jelajah-bumi-ekspedisi-papua-2026',
      categorySlug: 'jelajah-bumi',
      authorId: pegawai1.id,
      body: 'Menjalankan tugas dinas preservasi naskah daerah memberi kesempatan menikmati keagungan alam Lembah Baliem. Udara dingin pegunungan, keramahan tetua suku, dan tradisi tutur yang kaya mengajarkan kita bahwa perpustakaan sejati hidup dalam denyut nadi masyarakat adat.',
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
      likesCount: 39,
      viewsCount: 430,
    },
    {
      title: 'Selamat Atas Kelahiran Putri Pertama Rekanita Siti Nurhaliza',
      slug: 'kabar-keluarga-kelahiran-putri-siti',
      categorySlug: 'kabar-keluarga',
      authorId: pegawai3.id,
      body: 'Keluarga besar Biro Humas dan Pusdatin mengucapkan selamat dan penuh suka cita kepada Ibu Siti Nurhaliza atas kelahiran putri pertama bernama "Aisyah Literasi Putri" pada 12 Agustus 2026. Semoga tumbuh menjadi anak yang sholehah, cerdas, dan membanggakan keluarga serta nusa bangsa.',
      coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop',
      likesCount: 62,
      viewsCount: 710,
    },
    {
      title: 'Kutipan Pekan Ini: Nilai Sejati Sebuah Buku',
      slug: 'kalimat-bijak-nilai-buku-dan-manusia',
      categorySlug: 'kalimat-bijak',
      authorId: pegawai4.id,
      body: '"Perpustakaan bukan sekadar bangunan bertingkat penyimpan kertas berjilid. Perpustakaan adalah suaka peradaban tempat gagasan terbaik manusia sepanjang masa saling bertegur sapa melintasi zaman."',
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop',
      likesCount: 84,
      viewsCount: 920,
    },
    {
      title: 'Studi Analisis Perilaku Penelusuran Informasi Generasi Z pada Portal iPusnas',
      slug: 'karya-akademik-analisis-generasi-z-ipusnas',
      categorySlug: 'karya-akademik',
      authorId: pegawai4.id,
      body: 'Abstrak: Penelitian ini mengkaji pola retensi dan kecenderungan genre bacaan digital pada 50.000 pengguna aktif muda. Hasil riset menunjukkan format e-book interaktif dan gamifikasi pencapaian membaca meningkatkan waktu baca harian hingga 42%. Makalah lengkap siap dipresentasikan pada simposium internasional.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
      likesCount: 31,
      viewsCount: 380,
    },
    {
      title: '5 Tips Ergonomis Menjaga Kesehatan Mata dan Postur Tubuh di Depan Layar Komputer',
      slug: 'tips-gaya-hidup-ergonomi-kantor',
      categorySlug: 'tips-gaya-hidup',
      authorId: pegawai3.id,
      body: 'Pekerjaan digital dan penataan katalog seharian sering membuat leher kaku dan mata lelah. Terapkan aturan 20-20-20 (setiap 20 menit, lihat objek sejauh 20 kaki selama 20 detik), atur ketinggian monitor sejajar mata, dan luangkan waktu stretching 3 menit di sela jam kerja!',
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop',
      likesCount: 47,
      viewsCount: 560,
    },
    {
      title: 'Jadwal Latihan Rutin Komunitas Badminton Perpusnas Setiap Kamis Malam',
      slug: 'olahraga-komunitas-badminton-perpusnas',
      categorySlug: 'olahraga',
      authorId: pegawai3.id,
      body: 'Untuk menjaga kebugaran dan mempererat tali silaturahmi antardeputi, Komunitas Bulutangkis Perpusnas rutin mengadakan sparring setiap hari Kamis pukul 18.30 WIB di GOR Senayan. Semua pegawai, baik pemula maupun pro, sangat disambut hangat untuk bergabung!',
      coverImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop',
      likesCount: 35,
      viewsCount: 410,
    },
    {
      title: 'Tahukah Anda? Gedung Perpusnas Merdeka Selatan Merupakan Gedung Perpustakaan Nasional Tertinggi di Dunia',
      slug: 'tahukah-anda-gedung-perpusnas-tertinggi',
      categorySlug: 'tahukah-anda',
      authorId: pegawai2.id,
      body: 'Dengan 27 lantai dan ketinggian mencapai 126,3 meter, fasilitas layanan Perpusnas di Jalan Medan Merdeka Selatan dinobatkan sebagai gedung perpustakaan nasional tertinggi di dunia! Gedung ini dirancang dengan konsep green building ramah lingkungan dan mampu menampung jutaan koleksi pustaka serta ribuan pengunjung setiap harinya.',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop',
      likesCount: 92,
      viewsCount: 1100,
    },
  ];

  for (const post of employeePostsData) {
    const createdPost = await prisma.employeePost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });

    // Add some sample comments
    await prisma.postComment.create({
      data: {
        postId: createdPost.id,
        authorId: pegawai2.id,
        content: 'Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!',
      },
    }).catch(() => {});
  }

  // 7. Consultation Topics
  const topic1 = await prisma.consultationTopic.create({
    data: {
      title: 'Prosedur Pengusulan Angka Kredit (PAK) Jabatan Fungsional Pustakawan 2026',
      category: 'KEPEGAWAIAN',
      question: 'Mohon info batas waktu pengunggahan berkas dupak/e-kinerja periode penilaian kenaikan pangkat Oktober mendatang bagi fungsional muda ke madya.',
      authorId: pegawai3.id,
      status: 'ANSWERED',
      replies: {
        create: [
          {
            authorId: adminUser.id,
            replyText: 'Batas waktu pengunggahan dokumen kelengkapan di aplikasi SI-ASN adalah tanggal 31 Agustus 2026 pukul 23.59 WIB. Tim penilai akan memverifikasi pada minggu pertama September.',
            isAdminReply: true,
          },
        ],
      },
    },
  });

  const topic2 = await prisma.consultationTopic.create({
    data: {
      title: 'Kendala Akses VPN Internal saat Work From Home',
      category: 'IT',
      question: 'Koneksi VPN Pusdatin sering terputus setelah 15 menit saat mengakses server repositori naskah dari rumah. Bagaimana solusinya?',
      authorId: pegawai1.id,
      status: 'ANSWERED',
      replies: {
        create: [
          {
            authorId: adminUser.id,
            replyText: 'Halo Pak Bambang, silakan perbarui client OpenVPN ke versi 2.6.8 dan gunakan profil konfigurasi VPN-Cluster-B yang baru diunduh dari modul Dokumen Intern.',
            isAdminReply: true,
          },
        ],
      },
    },
  });

  // 8. Kupas Sosok
  const figureProfiles = [
    {
      name: 'Dra. Sri Sumekar, M.Si.',
      slug: 'dra-sri-sumekar-m-si',
      position: 'Pustakawan Ahli Utama & Tokoh Pelestari Manuskrip Langka',
      unitKerja: 'Deputi Bidang Pengembangan Bahan Pustaka dan Jasa Informasi',
      quote: 'Setiap helai naskah kuno yang kita selamatkan adalah satu nyawa ingatan peradaban leluhur yang kita wariskan kepada generasi emas masa depan.',
      fullStory: `Lebih dari 35 tahun mendedikasikan hidupnya di lingkungan Perpustakaan Nasional Republik Indonesia, Ibu Sri Sumekar telah menjelajahi ratusan pelosok tanah air dari ujung barat Sabang hingga Merauke demi melacak keberadaan manuskrip daun lontar, kulit kayu, dan kertas dluwang kuno.\n\nDengan ketekunan luar biasa, beliau memimpin pembentukan laboratorium kimia konservasi bahan perpustakaan pertama di Asia Tenggara yang memenuhi standar internasional IFLA-PAC. Kepemimpinan beliau yang humanis dan penuh keteladanan telah menginspirasi ratusan pustakawan muda di seluruh Indonesia.`,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
      achievements: JSON.stringify([
        'Lifetime Achievement Award Ikatan Pustakawan Indonesia (IPI) 2024',
        'Pustakawan Teladan Nasional Kementerian Pendidikan & Kebudayaan RI',
        'Ketua Komite Akreditasi Preservasi Manuskrip Asia-Pasifik (2020-2024)',
      ]),
      careerHistory: JSON.stringify([
        { year: '1989-1998', role: 'Konservator Bahan Pustaka Kertas Langka' },
        { year: '1998-2008', role: 'Kepala Seksi Preservasi Fisik Naskah Kuno' },
        { year: '2008-2018', role: 'Direktur Deposit Bahan Pustaka' },
        { year: '2018-Sekarang', role: 'Pustakawan Ahli Utama Perpusnas RI' },
      ]),
      isSpotlight: true,
    },
    {
      name: 'Ir. Hendro Wicaksono, M.Eng.',
      slug: 'ir-hendro-wicaksono-m-eng',
      position: 'Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu',
      unitKerja: 'Pusat Data dan Informasi (Pusdatin)',
      quote: 'Teknologi adalah sarana, tetapi semangat melayani pemustaka dengan sepenuh hati adalah jiwa dari setiap baris kode yang kita bangun.',
      fullStory: `Ir. Hendro Wicaksono memimpin transformasi sistem perpustakaan dari era kartu katalog fisik menuju jaringan katalog daring terdistribusi nasional (INLISLite). Inovasi sistem otomasi open-source ini kini digunakan oleh lebih dari 25.000 perpustakaan sekolah, kampus, dan daerah di seluruh Indonesia secara cuma-cuma, menghemat anggaran negara puluhan miliar rupiah.`,
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop',
      achievements: JSON.stringify([
        'Top 10 Inovasi Pelayanan Publik KemenPAN-RB (Inovasi INLISLite)',
        'Anugerah Ksatria Bakti Literasi Teknologi 2023',
      ]),
      careerHistory: JSON.stringify([
        { year: '2005-2012', role: 'System Analyst & Database Architect Pusdatin' },
        { year: '2012-2020', role: 'Lead Architect INLISLite National Open System' },
        { year: '2020-Sekarang', role: 'Pranata Komputer Ahli Madya Pusdatin' },
      ]),
      isSpotlight: false,
    },
  ];

  for (const fig of figureProfiles) {
    await prisma.figureProfile.upsert({
      where: { slug: fig.slug },
      update: fig,
      create: fig,
    });
  }

  // 9. Initial Activity Logs
  const initialLogs = [
    {
      userId: adminUser.id,
      action: 'LOGIN',
      module: 'AUTH',
      description: 'Administrator berhasil login ke sistem',
      ipAddress: '127.0.0.1',
    },
    {
      userId: adminUser.id,
      action: 'CREATE',
      module: 'HOMEPAGE',
      description: 'Pembaruan banner hero dan kalimat bijak portal intranet',
      ipAddress: '127.0.0.1',
    },
    {
      userId: adminUser.id,
      action: 'CREATE',
      module: 'NEWS',
      description: 'Publikasi berita: Perpusnas Resmikan Layanan Digital Koleksi Naskah Kuno Berbasis AI',
      ipAddress: '127.0.0.1',
    },
  ];

  for (const log of initialLogs) {
    await prisma.activityLog.create({
      data: log,
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log('--- Kredensial Akun untuk Testing ---');
  console.log('1. Akun Administrator: NIP "ADMIN001" | Password "admin123"');
  console.log('2. Akun Pegawai 1: NIP "198501152010011001" | Password "pegawai123"');
  console.log('3. Akun Pegawai 2: NIP "199003202015022003" | Password "pegawai123"');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

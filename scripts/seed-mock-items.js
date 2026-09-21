const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding all mock items to database with matching IDs...');

  const defaultUser = await prisma.user.findFirst();
  if (!defaultUser) {
    console.error('❌ No user found in database. Run npm run prisma:seed first.');
    return;
  }
  const authorId = defaultUser.id;

  // Categories
  const categories = await prisma.category.findMany();
  const catMap = {};
  categories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // 1. BERITA (Content type NEWS)
  const beritaItems = [
    {
      id: 'stitch-1',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku di berbagai daerah mengalami peningkatan signifikan...',
      body: 'Menurut penelitian yang dirilis pada tanggal 19 Agustus 2026, indeks kegemaran membaca masyarakat Indonesia mengalami lonjakan positif. Hal ini didorong oleh peningkatan penetrasi perpustakaan digital, penyediaan pojok baca terpadu di ruang publik, serta optimalisasi layanan perpustakaan berbasis inklusi sosial yang gencar dilaksanakan oleh Perpustakaan Nasional RI bersama seluruh pemangku kepentingan daerah.',
      coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
      status: 'TERBIT',
    },
    {
      id: 'stitch-2',
      title: 'Perpustakaan Digital Terpadu Dukung Pembelajaran Jarak Jauh',
      excerpt: 'Integrasi teknologi dalam membaca dokumen digital melalui tablet cerdas semakin memudahkan pemustaka dalam menjangkau koleksi naskah kuno...',
      body: 'Integrasi teknologi dalam membaca dokumen digital melalui tablet dan gawai cerdas semakin memudahkan masyarakat dalam menjangkau koleksi naskah kuno, jurnal penelitian, serta buku teks terakreditasi melalui portal iPusnas dan IOS.',
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      status: 'MENUNGGU',
    },
    {
      id: 'stitch-3',
      title: 'Gedung Layanan Merdeka Selatan Catatkan Rekor Kunjungan Tertinggi',
      excerpt: 'Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian...',
      body: 'Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian hingga mencapai rekor tertinggi pada kuartal ketiga tahun ini.',
      coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      status: 'TERBIT',
    },
    {
      id: 'stitch-4',
      title: 'Diskusi Standardisasi Kurikulum Literasi Informasi Era Modern',
      excerpt: 'Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi...',
      body: 'Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi di era komputasi awan.',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      status: 'MENUNGGU',
    },
    {
      id: 'stitch-5',
      title: 'Penataan Rak Buku Tematik dan Sistem Otomasi RFID Terbaru',
      excerpt: 'Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu koleksi...',
      body: 'Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu kembali koleksi referensi.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      status: 'TERBIT',
    },
    {
      id: 'stitch-6',
      title: 'Peningkatan Aksesibilitas Fasilitas Inklusi Ramah Disabilitas',
      excerpt: 'Layanan ruang baca lansia dan disabilitas dilengkapi fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra...',
      body: 'Layanan ruang baca lansia dan disabilitas dilengkapi dengan fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra demi pemerataan akses informasi.',
      coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
      status: 'TERBIT',
    },
  ];

  for (const b of beritaItems) {
    await prisma.content.upsert({
      where: { id: b.id },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        body: b.body,
        coverImage: b.coverImage,
        status: b.status,
      },
      create: {
        id: b.id,
        title: b.title,
        slug: b.id,
        excerpt: b.excerpt,
        body: b.body,
        coverImage: b.coverImage,
        type: 'NEWS',
        status: b.status,
        authorId,
        categoryId: catMap['berita'] || null,
        publishedAt: new Date(),
      },
    });
  }
  console.log('✅ Seeded 6 Berita Kedinasan items.');

  // 2. EMPLOYEE POSTS (Antar Pegawai)
  const employeeCategories = [
    { prefix: 'opini', slug: 'opini', count: 6, titlePrefix: 'Coretan Opini' },
    { prefix: 'humor', slug: 'humor', count: 6, titlePrefix: 'Humor Pegawai' },
    { prefix: 'jelajah', slug: 'jelajah-bumi', count: 6, titlePrefix: 'Jelajah Bumi' },
    { prefix: 'kabar-keluarga', slug: 'kabar-keluarga', count: 6, titlePrefix: 'Kabar Keluarga' },
    { prefix: 'kalimat-bijak', slug: 'kalimat-bijak', count: 6, titlePrefix: 'Kalimat Bijak' },
    { prefix: 'karya', slug: 'karya-akademik', count: 6, titlePrefix: 'Karya Akademik' },
    { prefix: 'olahraga', slug: 'olahraga', count: 6, titlePrefix: 'Kegiatan Olahraga' },
    { prefix: 'tahukah', slug: 'tahukah-anda', count: 6, titlePrefix: 'Tahukah Anda' },
    { prefix: 'tips-gaya-hidup', slug: 'tips-gaya-hidup', count: 9, titlePrefix: 'Tips & Gaya Hidup' },
  ];

  const defaultBodies = {
    opini: 'Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.',
    humor: 'Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!',
    'jelajah-bumi': 'Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.',
    'kabar-keluarga': 'Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.',
    'kalimat-bijak': '"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman."',
    'karya-akademik': 'Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.',
    olahraga: 'Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.',
    'tahukah-anda': 'Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.',
    'tips-gaya-hidup': 'Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.',
  };

  for (const cat of employeeCategories) {
    for (let i = 1; i <= cat.count; i++) {
      const id = `${cat.prefix}-${i}`;
      const title = `${cat.titlePrefix} #${i}: Minat Membaca & Kemajuan Perpusnas`;
      const body = defaultBodies[cat.slug] || 'Konten artikel antar pegawai Perpustakaan Nasional RI.';
      const status = i % 2 === 0 ? 'MENUNGGU' : 'TERBIT';

      await prisma.employeePost.upsert({
        where: { id },
        update: {
          title,
          body,
          categorySlug: cat.slug,
          status,
        },
        create: {
          id,
          title,
          slug: id,
          categorySlug: cat.slug,
          body,
          coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop',
          authorId,
          status,
          likesCount: 15 + i * 3,
          viewsCount: 120 + i * 25,
        },
      });
    }
  }
  console.log('✅ Seeded all Antar Pegawai mock items (57 total items).');

  // 3. AGENDAS (Content type AGENDA)
  for (let i = 1; i <= 6; i++) {
    const id = `agenda-${i}`;
    const title = `Agenda Kedinasan #${i}: Rapat Koordinasi Nasional Perpusnas RI`;
    await prisma.content.upsert({
      where: { id },
      update: { title },
      create: {
        id,
        title,
        slug: id,
        excerpt: 'Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.',
        body: 'Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.',
        type: 'AGENDA',
        status: i % 2 === 0 ? 'MENUNGGU' : 'TERBIT',
        eventLocation: 'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',
        eventStartDate: new Date('2026-08-25T08:30:00.000Z'),
        coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop',
        authorId,
        categoryId: catMap['agenda'] || null,
        publishedAt: new Date(),
      },
    });
  }
  console.log('✅ Seeded 6 Agenda items.');

  // 4. BUSINESS TRIPS (Content type BUSINESS_TRIP)
  const trips = [
    { id: 'trip-1', city: 'Singapura', title: 'Laporan Delegasi Workshop Kepustakawanan Asia Tenggara (CONSAL) di Singapura' },
    { id: 'trip-2', city: 'Yogyakarta', title: 'Laporan Perjalanan Dinas Pelatihan Kearsipan Digital di Yogyakarta' },
    { id: 'trip-3', city: 'Surabaya', title: 'Laporan Pendampingan Akreditasi Perpustakaan Daerah di Surabaya' },
    { id: 'trip-4', city: 'Denpasar', title: 'Laporan Preservasi dan Konservasi Lontar Kuno di Denpasar Bali' },
    { id: 'trip-5', city: 'Medan', title: 'Laporan Monitoring dan Evaluasi Bantuan Pojok Baca di Medan' },
  ];

  for (const t of trips) {
    await prisma.content.upsert({
      where: { id: t.id },
      update: { title: t.title, destinationCity: t.city },
      create: {
        id: t.id,
        title: t.title,
        slug: t.id,
        excerpt: `Pelaksanaan tugas kedinasan di kota ${t.city} dalam rangka penguatan layanan kepustakawanan.`,
        body: `Perjalanan dinas ini dilaksanakan dengan penuh tanggung jawab demi memastikan ketercapaian sasaran strategis program kerja Perpusnas RI di wilayah ${t.city}. Seluruh agenda koordinasi dan lokakarya berjalan lancar.`,
        destinationCity: t.city,
        attachmentName: `Laporan_Dinas_${t.city}.pdf`,
        type: 'BUSINESS_TRIP',
        status: 'TERBIT',
        authorId,
        categoryId: catMap['laporan-perjalanan'] || null,
        publishedAt: new Date(),
      },
    });
  }
  console.log('✅ Seeded 5 Laporan Perjalanan Dinas items.');

  // 5. INTERNAL DOCUMENTS (Content type INTERNAL_DOCUMENT)
  for (let i = 1; i <= 5; i++) {
    const id = `doc-${i}`;
    const title = `Dokumen Internal #${i}: Surat Edaran & Panduan Operasional Perpusnas`;
    await prisma.content.upsert({
      where: { id },
      update: { title },
      create: {
        id,
        title,
        slug: id,
        excerpt: 'Panduan tata kelola administrasi kedinasan, jam kerja, dan standar operasional prosedur internal.',
        body: 'Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',
        attachmentName: `Surat_Edaran_${i}.pdf`,
        fileSize: '2.1 MB',
        type: 'INTERNAL_DOCUMENT',
        status: 'TERBIT',
        authorId,
        categoryId: catMap['dokumen-intern'] || null,
        publishedAt: new Date(),
      },
    });
  }
  console.log('✅ Seeded 5 Dokumen Intern items.');

  // 6. FIGURE PROFILES (Kupas Sosok)
  const figures = [
    {
      id: 'fig-1',
      slug: 'dra-sri-sumekar-msi',
      name: 'Dra. Sri Sumekar, M.Si.',
      position: 'Pustakawan Ahli Utama & Tokoh Pelestari Manuskrip Langka',
      unitKerja: 'Deputi Bidang Pengembangan Bahan Pustaka dan Jasa Informasi',
      quote: 'Setiap helai naskah kuno yang kita selamatkan adalah satu nyawa ingatan peradaban leluhur yang kita wariskan kepada generasi emas masa depan.',
    },
    {
      id: 'fig-2',
      slug: 'ir-hendro-wicaksono-meng',
      name: 'Ir. Hendro Wicaksono, M.Eng.',
      position: 'Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu',
      unitKerja: 'Pusat Data dan Informasi Perpustakaan Nasional RI',
      quote: 'Teknologi adalah sarana, tetapi semangat melayani pemustaka dengan sepenuh hati adalah jiwa dari setiap baris kode yang kita bangun.',
    },
    {
      id: 'fig-3',
      slug: 'drs-supriyanto-mhum',
      name: 'Drs. Supriyanto, M.Hum.',
      position: 'Pustakawan Madya & Kurator Koleksi Khusus Nusantara',
      unitKerja: 'Direktorat Deposit dan Pengembangan Koleksi Perpustakaan',
      quote: 'Koleksi perpustakaan adalah jembatan pengetahuan yang menghubungkan kebijaksanaan masa lalu dengan penjelajahan masa depan.',
    },
    {
      id: 'fig-4',
      slug: 'prof-dr-sulistyo-basuki',
      name: 'Prof. Dr. Sulistyo Basuki',
      position: 'Pakar Ilmu Perpustakaan & Tokoh Pendidikan Kepustakawanan',
      unitKerja: 'Pusat Pembinaan Pustakawan Perpusnas RI',
      quote: 'Profesi pustakawan bukan sekadar penjaga buku, melainkan navigator peradaban di tengah samudera informasi dunia.',
    },
    {
      id: 'fig-5',
      slug: 'dr-adi-wibowo-msi',
      name: 'Dr. Adi Wibowo, M.Si.',
      position: 'Peneliti Konservasi Kertas Kuno & Bahan Repositori Tropis',
      unitKerja: 'Pusat Preservasi dan Alih Media Bahan Perpustakaan',
      quote: 'Merawat lembaran rapuh naskah sejarah membutuhkan ketelitian sains dan ketulusan hati.',
    },
    {
      id: 'fig-6',
      slug: 'nurcahyono-ss-msi',
      name: 'Nurcahyono, S.S., M.Si.',
      position: 'Pegiat Transformasi Layanan Digital & Budaya Baca Pemustaka',
      unitKerja: 'Pusat Pengembangan Perpustakaan Sekolah/Madrasah dan PT',
      quote: 'Inovasi ruang baca digital membuka gerbang tak terbatas bagi anak-anak pelosok untuk menggapai mimpi setinggi langit.',
    },
  ];

  for (const f of figures) {
    await prisma.figureProfile.upsert({
      where: { id: f.id },
      update: { slug: f.slug, name: f.name, position: f.position, unitKerja: f.unitKerja, quote: f.quote },
      create: {
        id: f.id,
        slug: f.slug,
        name: f.name,
        position: f.position,
        unitKerja: f.unitKerja,
        quote: f.quote,
        fullStory: `${f.name} dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.`,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
        isSpotlight: true,
      },
    });
  }
  console.log('✅ Seeded 6 Kupas Sosok items.');

  // 7. CONSULTATIONS
  for (let i = 1; i <= 6; i++) {
    const id = `kon-${i}`;
    const title = `Topik Konsultasi #${i}: Penyesuaian Angka Kredit Pustakawan`;
    await prisma.consultationTopic.upsert({
      where: { id },
      update: { title },
      create: {
        id,
        title,
        category: i % 2 === 0 ? 'IT' : 'KEPEGAWAIAN',
        question: 'Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?',
        authorId,
        status: i % 2 === 0 ? 'OPEN' : 'ANSWERED',
      },
    });
  }
  console.log('✅ Seeded 6 Konsultasi items.');

  console.log('🎉 All mock items successfully seeded to database!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export interface KabarKeluargaItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  categoryType?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_KABAR_KELUARGA_ATTACHMENTS_5 = [
  { id: 1, label: 'Foto Kegiatan 1', src: '/images/kabar-keluarga/card-1.jpg' },
  { id: 2, label: 'Foto Kegiatan 2', src: '/images/kabar-keluarga/card-2.jpg' },
  { id: 3, label: 'Foto Kegiatan 3', src: '/images/kabar-keluarga/card-3.jpg' },
  { id: 4, label: 'Foto Kegiatan 4', src: '/images/kabar-keluarga/card-4.jpg' },
  { id: 5, label: 'Foto Kegiatan 5', src: '/images/kabar-keluarga/card-5.jpg' },
];

export const CATEGORY_TYPES_KABAR_KELUARGA = [
  'Semua',
  'Kelahiran',
  'Pernikahan',
  'Duka Cita',
  'Prestasi Putra-Putri',
  'Purna Tugas',
  'Keluarga Sehat',
  'Kebersamaan',
];

export const STITCH_MOCK_KABAR_KELUARGA_9: KabarKeluargaItem[] = [
  {
    id: 'kabar-keluarga-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Budaya membaca yang tumbuh subur berawal dari kehangatan keluarga di rumah. 

Keluarga besar Perpustakaan Nasional senantiasa mendukung para pegawai dalam menumbuhkan minat baca anak sejak dini melalui pojok baca keluarga dan kebersamaan membaca buku di akhir pekan. Semoga semangat literasi ini terus mengakar kuat dalam setiap rumah tangga keluarga besar Perpusnas RI.`,
    coverImage: '/images/kabar-keluarga/card-1.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Biro SDM & Umum Perpusnas',
    categoryType: 'Kebersamaan',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-2',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Kebersamaan putra-putri pegawai Perpusnas dalam program *Kids Reading Club* di layanan anak menunjukkan kegembiraan eksplorasi buku dan dongeng nusantara.

Aktivitas membaca bersama tidak hanya mempererat ikatan kekeluargaan, namun juga melatih daya imajinasi serta kepekaan sosial generasi penerus bangsa.`,
    coverImage: '/images/kabar-keluarga/card-2.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pengurus KORPRI Perpusnas',
    categoryType: 'Prestasi Putra-Putri',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-3',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Pemanfaatan gawai secara bijak di lingkungan keluarga kini didorong melalui aplikasi perpustakaan digital iPusnas dan BintangPusnas.

Orang tua kini dapat mendampingi putra-putri membaca naskah klasik dan cerita rakyat bermutu langsung dari genggaman tanpa batasan jarak dan waktu.`,
    coverImage: '/images/kabar-keluarga/card-3.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Humas Perpustakaan Nasional',
    categoryType: 'Keluarga Sehat',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-4',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Warta suka cita datang dari keluarga besar Bapak Ahmad Subagyo (Pustakawan Madya) atas kelulusan dan apresiasi karya penulisan putri tercinta di tingkat nasional.

Semoga pencapaian ini menjadi inspirasi bagi segenap keluarga besar civitas Perpusnas untuk terus memupuk ketekunan dan kecintaan terhadap literasi.`,
    coverImage: '/images/kabar-keluarga/card-4.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Paguyuban Pegawai Perpusnas',
    categoryType: 'Prestasi Putra-Putri',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-5',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Kunjungan silaturahmi keluarga pegawai Perpusnas ke gedung pusat riset literasi nusantara berlangsung hangat dan penuh inspirasi.

Kegiatan temu keluarga tahunan ini menjadi momentum penting saling menguatkan silaturahmi antar keluarga pegawai dari seluruh unit kerja.`,
    coverImage: '/images/kabar-keluarga/card-5.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Biro SDM & Umum Perpusnas',
    categoryType: 'Kebersamaan',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-6',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Piknik literasi akhir pekan bersama keluarga pegawai di taman kota menjadi wahana rekreasi sekaligus edukasi yang menyegarkan pikiran.

Anak-anak antusias mendengarkan cerita interaktif sementara para orang tua saling bertukar pengalaman mendampingi tumbuh kembang anak di era digital.`,
    coverImage: '/images/kabar-keluarga/card-6.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Keluarga Besar Perpusnas',
    categoryType: 'Kebersamaan',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-7',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Berdasarkan data evaluasi triwulan II, indeks keterbacaan artikel keluarga internal mencapai peningkatan hingga 42% dibanding periode sebelumnya.

Apresiasi setinggi-tingginya kepada segenap kontributor berita keluarga yang rutin mengirimkan warta suka duka serta inspirasi hangat dari keluarga masing-masing.`,
    coverImage: '/images/kabar-keluarga/card-7.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pusat Data & Informasi',
    categoryType: 'Kebersamaan',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-8',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Program donasi buku untuk perpustakaan keluarga di rumah dinas pegawai perpusnas terus berjalan dengan sambutan hangat.

Koleksi buku bacaan anak, ensiklopedia mini, serta novel inspiratif kini telah terdistribusi ke lebih dari 50 keluarga pegawai.`,
    coverImage: '/images/kabar-keluarga/card-8.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'KORPRI Perpusnas',
    categoryType: 'Kebersamaan',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
  {
    id: 'kabar-keluarga-9',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Ucapan selamat kami haturkan kepada putra Bapak Ir. Bambang Setiadi yang telah menuntaskan sidang sarjana ilmu perpustakaan dan informasi dengan predikat memuaskan (*cumlaude*).

Semoga ilmu yang diraih berkah dan dapat berkontribusi besar bagi kemajuan literasi bangsa.`,
    coverImage: '/images/kabar-keluarga/card-9.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Paguyuban Pegawai Perpusnas',
    categoryType: 'Prestasi Putra-Putri',
    attachments: MOCK_KABAR_KELUARGA_ATTACHMENTS_5,
  },
];

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
}

// 6 Curated Mock News with authentic high-resolution Perpusnas & library images
export const MOCK_BERITA_6: NewsItem[] = [
  {
    id: 'stitch-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku di berbagai daerah mengalami peningkatan signifikan...',
    content: 'Menurut penelitian yang dirilis pada tanggal 19 Agustus 2026, indeks kegemaran membaca masyarakat Indonesia mengalami lonjakan positif. Hal ini didorong oleh peningkatan penetrasi perpustakaan digital, penyediaan pojok baca terpadu di ruang publik, serta optimalisasi layanan perpustakaan berbasis inklusi sosial yang gencar dilaksanakan oleh Perpustakaan Nasional RI bersama seluruh pemangku kepentingan daerah.',
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Humas Perpusnas',
  },
  {
    id: 'stitch-2',
    title: 'Perpustakaan Digital Terpadu Dukung Pembelajaran Jarak Jauh',
    excerpt: 'Integrasi teknologi dalam membaca dokumen digital melalui tablet cerdas semakin memudahkan pemustaka dalam menjangkau koleksi naskah kuno...',
    content: 'Integrasi teknologi dalam membaca dokumen digital melalui tablet dan gawai cerdas semakin memudahkan masyarakat dalam menjangkau koleksi naskah kuno, jurnal penelitian, serta buku teks terakreditasi melalui portal iPusnas dan IOS.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pusat Preservasi',
  },
  {
    id: 'stitch-3',
    title: 'Gedung Layanan Merdeka Selatan Catatkan Rekor Kunjungan Tertinggi',
    excerpt: 'Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian...',
    content: 'Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian hingga mencapai rekor tertinggi pada kuartal ketiga tahun ini.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Biro Hukum & Kerjasama',
  },
  {
    id: 'stitch-4',
    title: 'Diskusi Standardisasi Kurikulum Literasi Informasi Era Modern',
    excerpt: 'Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi...',
    content: 'Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi di era komputasi awan.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pusat Bibliografi',
  },
  {
    id: 'stitch-5',
    title: 'Penataan Rak Buku Tematik dan Sistem Otomasi RFID Terbaru',
    excerpt: 'Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu koleksi...',
    content: 'Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu kembali koleksi referensi.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Direktorat Deposit',
  },
  {
    id: 'stitch-6',
    title: 'Peningkatan Aksesibilitas Fasilitas Inklusi Ramah Disabilitas',
    excerpt: 'Layanan ruang baca lansia dan disabilitas dilengkapi fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra...',
    content: 'Layanan ruang baca lansia dan disabilitas dilengkapi dengan fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra demi pemerataan akses informasi.',
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Layanan Pemustaka',
  },
];

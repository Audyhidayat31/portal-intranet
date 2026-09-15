export interface OpiniItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
}

export const STITCH_MOCK_OPINI_6: OpiniItem[] = [
  {
    id: 'opini-1',
    title: 'Membangun Ekosistem Knowledge Sharing yang Nyaman di Lingkungan Perpusnas',
    excerpt: 'Budaya berbagi pengetahuan antarpegawai merupakan kunci akselerasi inovasi layanan kepustakawanan modern.',
    content: `Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan di berbagai daerah pelosok.

Faktor pendorong utama:
• Transformasi digital perpustakaan berbasis inklusi sosial.
• Penyediaan pojok baca terpadu di fasilitas umum dan transportasi publik.
• Kampanye gemar membaca yang masif melalui media sosial dan duta baca nasional.

Ke depan, kesinambungan program ini memerlukan kolaborasi lintas lembaga dan dukungan penuh ketersediaan bahan bacaan berkualitas.`,
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Dra. Sri Wahyuni, M.Hum.',
  },
  {
    id: 'opini-2',
    title: 'Minat Membaca Warga Indonesia dan Transformasi Perpustakaan Digital',
    excerpt: 'Menurut kajian terkini, kolaborasi platform daring dan koleksi buku fisik memicu lonjakan antusiasme pemustaka.',
    content: `Modernisasi perpustakaan tidak hanya berbicara mengenai infrastruktur gedung, melainkan bagaimana menumbuhkan ekosistem membaca yang hidup dan menyenangkan bagi generasi muda.

Poin penting penguatan ekosistem:
• Integrasi teknologi kecerdasan buatan dalam rekomendasi bahan bacaan.
• Pelatihan literasi kritis untuk membedakan fakta dan misinformasi digital.
• Pemberdayaan komunitas baca akar rumput sebagai motor penggerak literasi desa.`,
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Bambang Sudiro, S.Sos.',
  },
  {
    id: 'opini-3',
    title: 'Pemanfaatan Teknologi Preservasi Digital dalam Perlindungan Naskah Nusantara',
    excerpt: 'Digitalisasi naskah kuno nusantara menjadi jembatan antara memori intelektual masa lalu dengan kebutuhan riset masa depan.',
    content: `Preservasi naskah kuno nusantara merupakan benteng pertahanan memori kolektif bangsa. Digitalisasi naskah menjadi jembatan antara kekayaan intelektual masa lalu dengan kebutuhan riset masa depan.`,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Ni Made Suastini',
  },
  {
    id: 'opini-4',
    title: 'Perpustakaan sebagai Third Place yang Inklusif bagi Pemberdayaan Masyarakat',
    excerpt: 'Perpustakaan masa kini bertransformasi menjadi ruang interaksi kreatif, dialog terbuka, dan pelatihan keterampilan publik.',
    content: `Perpustakaan masa kini bertransformasi menjadi ruang ketiga (third place) yang inklusif, tempat bertemunya ide, kreativitas, dan pemberdayaan ekonomi masyarakat.`,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Rahmat Hidayat, M.M.',
  },
  {
    id: 'opini-5',
    title: 'Optimalisasi Layanan Katalog Digital Cloud Nasional untuk Akselerasi Riset',
    excerpt: 'Kemudahan integrasi e-resources dan sistem temu kembali informasi mempercepat akses peneliti ke referensi primer.',
    content: `Kemudahan akses katalog digital nasional dan aplikasi peminjaman buku berbasis cloud telah membuka cakrawala baru bagi para pembaca di era serba cepat.`,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Dr. Hendrawan, S.I.P.',
  },
  {
    id: 'opini-6',
    title: 'Strategi Penguatan Literasi Kritis Pegawai dalam Mengantisipasi Disinformasi',
    excerpt: 'Pentingnya keahlian verifikasi data dan kurasi informasi terpercaya dalam menghadapi gelombang informasi instan.',
    content: `Komunitas literasi di berbagai daerah terbukti efektif mengikis kesenjangan informasi dan meningkatkan minat baca masyarakat secara berkelanjutan.`,
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Siti Rahmawati, S.Sos.',
  },
];

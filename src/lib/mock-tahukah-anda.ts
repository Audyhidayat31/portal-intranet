export interface TahukahAndaItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_TAHUKAH_ANDA_ATTACHMENTS_5 = [
  {
    id: 1,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe7ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
  },
];

export const DEFAULT_STITCH_TAHUKAH_ANDA_DETAIL: TahukahAndaItem = {
  id: 'penerbitan-karya-sastra-prof',
  title:
    'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
  excerpt:
    'Uraian Artikel Tahukah Anda mengenai sejarah, fakta menarik kepustakaan nusantara, dan khazanah literasi di lingkungan Perpustakaan Nasional RI.',
  content: `Uraian Artikel Tahukah Anda

Tahukah Anda bahwa Perpustakaan Nasional Republik Indonesia memiliki gedung fasilitas layanan tertinggi di dunia? Menjulang setinggi 27 lantai dengan ketinggian 126,3 meter di Medan Merdeka Selatan, Jakarta, gedung ini menyimpan jutaan koleksi monograf, naskah kuno nusantara, surat kabar langka, hingga pameran naskah bersejarah berharga tinggi.

Selain itu, naskah kuno La Galigo yang diakui UNESCO sebagai Memory of the World juga dirawat dan dilestarikan menggunakan teknologi preservasi mutakhir oleh para pustakawan dan kurator ahli Perpusnas RI. Upaya ini memastikan warisan intelektual bangsa tetap terjaga bagi generasi mendatang.`,
  coverImage:
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  publishedAt: '2026-08-20',
  status: 'Terbit',
  authorName: 'Budi Sujatmiko',
  attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
};

export const STITCH_MOCK_TAHUKAH_ANDA_9: TahukahAndaItem[] = [
  {
    id: 'tahukah-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Layanan perpustakaan digital dan Pojok Baca Digital (POCADI) berkontribusi besar dalam mempermudah akses bahan bacaan berkualitas bagi masyarakat luas.`,
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-2',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Tahukah Anda bahwa koleksi naskah kuno daun lontar di Perpusnas dirawat dengan minyak atsiri tradisional serai wangi untuk mencegah serangan serangga secara alami?`,
    coverImage:
      'https://images.unsplash.com/photo-1507842229451-7f01be7fe7ab?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-3',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Fakta menarik menunjukkan bahwa sistem klasifikasi DDC (Dewey Decimal Classification) edisi pertama terbit pada tahun 1876 hanya setebal 44 halaman.`,
    coverImage:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-4',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Perpustakaan Nasional RI telah mendigitalkan lebih dari ratusan ribu judul buku langka yang dapat diakses publik melalui portal resmi secara gratis.`,
    coverImage:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-5',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Tahukah Anda istilah 'Bibliofil' merujuk kepada seseorang yang memiliki kecintaan luar biasa terhadap buku dan seni penjilidan?`,
    coverImage:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-6',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Huruf cetak tertua di dunia yang dapat dipindah-pindahkan (movable metal type) pertama kali dibuat di Semenanjung Korea pada awal abad ke-13 sebelum Gutenberg.`,
    coverImage:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-7',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Layanan keanggotaan online Perpustakaan Nasional memungkinkan warga negara Indonesia meminjam koleksi digital secara mandiri dari mana saja.`,
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-8',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Fakta unik mengungkap bahwa aroma buku tua disebabkan oleh degradasi senyawa kimia organik seperti vanilin dan selulosa seiring berjalannya waktu.`,
    coverImage:
      'https://images.unsplash.com/photo-1507842229451-7f01be7fe7ab?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
  {
    id: 'tahukah-9',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Gerakan literasi nasional berfokus pada inklusi sosial agar membaca membawa dampak langsung terhadap peningkatan kesejahteraan masyarakat.`,
    coverImage:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
  },
];

const STORAGE_KEY = 'portal_tahukah_anda_items_v1';

export function getStoredTahukahAnda(): TahukahAndaItem[] {
  if (typeof window === 'undefined') {
    return STITCH_MOCK_TAHUKAH_ANDA_9;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STITCH_MOCK_TAHUKAH_ANDA_9));
      return STITCH_MOCK_TAHUKAH_ANDA_9;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STITCH_MOCK_TAHUKAH_ANDA_9));
    return STITCH_MOCK_TAHUKAH_ANDA_9;
  } catch {
    return STITCH_MOCK_TAHUKAH_ANDA_9;
  }
}

export function saveStoredTahukahAnda(items: TahukahAndaItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save tahukah-anda items to localStorage', err);
  }
}

export function getTahukahAndaById(id: string): TahukahAndaItem | undefined {
  const list = getStoredTahukahAnda();
  return list.find((item) => item.id === id || item.id === String(id));
}

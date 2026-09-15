export interface OlahragaItem {
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

export const MOCK_OLAHRAGA_ATTACHMENTS_5 = [
  {
    id: 1,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    label: 'Gambar',
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  },
];

export const DEFAULT_STITCH_OLAHRAGA_DETAIL: OlahragaItem = {
  id: 'penerbitan-karya-olahraga',
  title:
    'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
  excerpt:
    'Uraian Artikel Olahraga mengenai turnamen tahunan, kebugaran jasmani, dan kebersamaan seluruh pegawai di lingkungan Perpustakaan Nasional RI.',
  content: `Uraian Artikel Olahraga

Komunitas Olahraga Perpustakaan Nasional RI menyelenggarakan rangkaian kegiatan pekan olahraga antar-unit kerja sebagai wadah mempererat silaturahmi, sportivitas, dan kebugaran pegawai. Rangkaian acara meliputi turnamen bulu tangkis, tenis meja, futsal persahabatan, serta senam kebugaran jasmani yang rutin diadakan setiap Jumat pagi di halaman fasilitas layanan Salemba dan Medan Merdeka Selatan.

Partisipasi aktif dari pimpinan, pejabat fungsional pustakawan, hingga staf pelaksana membuktikan antusiasme tinggi keluarga besar Perpusnas dalam mengimbangi produktivitas kerja dengan pola hidup sehat. Pameran dokumentasi kegiatan dan penyerahan piala bergilir turut memeriahkan seremoni penutupan.`,
  coverImage:
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  publishedAt: '2026-08-20',
  status: 'Terbit',
  authorName: 'Budi Sujatmiko',
  attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
};

export const STITCH_MOCK_OLAHRAGA_9: OlahragaItem[] = [
  {
    id: 'olahraga-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Sinergi antara aktivitas fisik dan literasi tercermin dari maraknya klub baca yang memadukan kegiatan jogging santai dengan diskusi buku di taman kota.

Program ini diinisiasi oleh komunitas olahraga Perpusnas untuk mempromosikan gaya hidup aktif sekaligus gemar membaca. Kegiatan mingguan ini berhasil menarik antusiasme ratusan peserta dari berbagai lintas generasi.`,
    coverImage:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-2',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Turnamen tenis meja antar-kedeputian tahun ini menghadirkan pertandingan sengit dan penuh keakraban antarpegawai Perpusnas.`,
    coverImage:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-3',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Pertandingan persahabatan futsal Perpusnas melawan instansi kementerian mitra sukses diselenggarakan dengan penuh sportivitas.`,
    coverImage:
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-4',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Latihan rutin bulu tangkis di GOR Perpusnas setiap Rabu malam menjadi ajang pelepas penat setelah seharian memberikan layanan kepustakawanan prima.`,
    coverImage:
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-5',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Senam yoga dan peregangan ergonomis di ruang serbaguna lantai 4 terbukti efektif menurunkan tingkat kejenuhan kerja bagi para pustakawan katalogisasi.`,
    coverImage:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-6',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Komunitas sepeda santai (gowes) Perpusnas menjelajahi rute bersejarah Monas-Salemba dalam rangka menyambut Hari Kunjung Perpustakaan.`,
    coverImage:
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-7',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Kebugaran jasmani dan ketahanan tubuh seluruh staf layanan disiapkan menjelang pameran akbar buku nasional tahun depan.`,
    coverImage:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-8',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Perlombaan catur cepat antar-unit kerja memacu konsentrasi dan strategi berpikir analitis para pustakawan.`,
    coverImage:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
  {
    id: 'olahraga-9',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt:
      'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Penyerahan medali penghargaan bagi pemenang turnamen bulu tangkis ganda putra dan putri menutup pekan olahraga pegawai Perpusnas.`,
    coverImage:
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
  },
];

const STORAGE_KEY = 'portal_olahraga_items_v1';

export function getStoredOlahraga(): OlahragaItem[] {
  if (typeof window === 'undefined') {
    return STITCH_MOCK_OLAHRAGA_9;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STITCH_MOCK_OLAHRAGA_9));
      return STITCH_MOCK_OLAHRAGA_9;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STITCH_MOCK_OLAHRAGA_9));
    return STITCH_MOCK_OLAHRAGA_9;
  } catch {
    return STITCH_MOCK_OLAHRAGA_9;
  }
}

export function saveStoredOlahraga(items: OlahragaItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save olahraga items to localStorage', err);
  }
}

export function getOlahragaById(id: string): OlahragaItem | undefined {
  const list = getStoredOlahraga();
  return list.find((item) => item.id === id || item.id === String(id));
}

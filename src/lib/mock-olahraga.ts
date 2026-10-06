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
  authorName: 'Ahmad Fauzi',
  attachments: MOCK_OLAHRAGA_ATTACHMENTS_5,
};

export const STITCH_MOCK_OLAHRAGA_9: OlahragaItem[] = [
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

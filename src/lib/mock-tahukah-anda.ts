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
  authorName: 'Ahmad Fauzi',
  attachments: MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
};

export const STITCH_MOCK_TAHUKAH_ANDA_9: TahukahAndaItem[] = [
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

export interface TahukahAndaItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  authorId?: string;
  editorName?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_TAHUKAH_ANDA_ATTACHMENTS_5 = [
  {
    id: 1,
    label: 'Gambar',
    src: '/images/logo-perpusnas.png',
  },
  {
    id: 2,
    label: 'Gambar',
    src: '/images/logo-perpusnas.png',
  },
  {
    id: 3,
    label: 'Gambar',
    src: '/images/logo-perpusnas.png',
  },
  {
    id: 4,
    label: 'Gambar',
    src: '/images/logo-perpusnas.png',
  },
  {
    id: 5,
    label: 'Gambar',
    src: '/images/logo-perpusnas.png',
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
    '/images/logo-perpusnas.png',
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

const DELETED_KEY = 'portal_deleted_tahukah_anda_ids_v1';

export function getDeletedTahukahAnda(): { ids: string[]; titles: string[] } {
  if (typeof window === 'undefined') return { ids: [], titles: [] };
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    if (!raw) return { ids: [], titles: [] };
    const parsed = JSON.parse(raw);
    return {
      ids: Array.isArray(parsed?.ids) ? parsed.ids : [],
      titles: Array.isArray(parsed?.titles) ? parsed.titles : [],
    };
  } catch {
    return { ids: [], titles: [] };
  }
}

export function markTahukahAndaAsDeleted(id: string, title?: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedTahukahAnda();
    const cleanTitle = (title || '').trim().toLowerCase();
    const newIds = current.ids.includes(id) ? current.ids : [...current.ids, id];
    const newTitles =
      cleanTitle && !current.titles.includes(cleanTitle)
        ? [...current.titles, cleanTitle]
        : current.titles;
    localStorage.setItem(DELETED_KEY, JSON.stringify({ ids: newIds, titles: newTitles }));

    // Also remove from stored items
    const list = getStoredTahukahAnda();
    const filtered = list.filter(
      (it) => it.id !== id && (!cleanTitle || (it.title || '').trim().toLowerCase() !== cleanTitle)
    );
    saveStoredTahukahAnda(filtered);
  } catch (err) {
    console.error('Failed to mark tahukah-anda as deleted', err);
  }
}

export function isTahukahAndaDeleted(id: string, title?: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getDeletedTahukahAnda();
  if (current.ids.includes(id)) return true;
  if (title) {
    const cleanTitle = title.trim().toLowerCase();
    if (current.titles.includes(cleanTitle)) return true;
  }
  return false;
}


export interface ConsultationReplyItem {
  id: string;
  authorName: string;
  date: string;
  content: string;
}

export interface ConsultationItem {
  id: string;
  title: string;
  category: 'IT' | 'Kesehatan' | 'Pegawai';
  date: string;
  status: 'Terbit' | 'Menunggu';
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
  authorName: string;
  authorId?: string;
  author?: any;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  editor?: { name: string } | null;
  editorName?: string | null;
  replies?: ConsultationReplyItem[];
}

export const INITIAL_MOCK_KONSULTASI: ConsultationItem[] = [];

const STORAGE_KEY = 'portal_konsultasi_items_v1';
const DB_NAME = 'portal_konsultasi_db_v1';
const STORE_NAME = 'consultation_items';
const DB_VERSION = 1;

let memoryCache: ConsultationItem[] | null = null;

function getIDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveConsultationToIDB(item: ConsultationItem): Promise<void> {
  try {
    const db = await getIDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(item);
  } catch {
    // ignore
  }
}

export async function getConsultationFromIDB(id: string): Promise<ConsultationItem | null> {
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function getStoredConsultations(): ConsultationItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  if (memoryCache && memoryCache.length > 0) {
    return memoryCache;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleaned = parsed.filter(
        (item: any) =>
          item &&
          !item.title?.includes('Topik Konsultasi #') &&
          !item.title?.includes('Penyesuaian Angka Kredit Pustakawan') &&
          !String(item.id).startsWith('kon-') &&
          item.id !== '6' &&
          item.id !== '7' &&
          item.id !== '8' &&
          item.id !== '9' &&
          item.id !== '10'
      );
      memoryCache = cleaned;
      return cleaned;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredConsultations(items: ConsultationItem[]) {
  if (typeof window === 'undefined') return;

  // 1. Simpan ke memory cache
  memoryCache = items;

  // 2. Simpan setiap item ke IndexedDB secara asynchronous
  // IndexedDB mendukung file besar (hingga ratusan MB) tanpa batas 5MB
  if (typeof window !== 'undefined' && window.indexedDB) {
    items.forEach((item) => {
      saveConsultationToIDB(item);
    });
  }

  // 3. Simpan ke localStorage dengan proteksi kuota (menghindari QuotaExceededError)
  try {
    // Siapkan versi yang aman untuk kuota 5MB localStorage:
    // Jika attachmentUrl berukuran sangat panjang (base64 > 20KB), kita potong di localStorage
    // karena data utuhnya sudah tersimpan di IndexedDB dan memory cache.
    const safeItems = items.map((item) => {
      if (item.attachmentUrl && item.attachmentUrl.length > 20000) {
        return {
          ...item,
          attachmentUrl: 'idb-stored',
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeItems));
  } catch {
    try {
      // Fallback jika localStorage sudah hampir penuh oleh data lain di browser
      const strippedItems = items.map((item) => ({
        ...item,
        attachmentUrl: undefined,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strippedItems));
    } catch {
      // Biarkan tersimpan di memoryCache dan IndexedDB
    }
  }
}

export function getConsultationById(id: string): ConsultationItem | undefined {
  const list = getStoredConsultations();
  return list.find((item) => item.id === id || item.id === String(id));
}

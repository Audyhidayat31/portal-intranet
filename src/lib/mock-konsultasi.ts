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

export function getStoredConsultations(): ConsultationItem[] {
  if (typeof window === 'undefined') {
    return [];
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
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredConsultations(items: ConsultationItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save consultations to localStorage', err);
  }
}

export function getConsultationById(id: string): ConsultationItem | undefined {
  const list = getStoredConsultations();
  return list.find((item) => item.id === id || item.id === String(id));
}

export interface JelajahBumiItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  authorId?: string;
  author?: any;
  location?: string;
  coverImageName?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_JELAJAH_ATTACHMENTS_5: Array<{ id: number; label: string; src: string }> = [];

export const DEFAULT_STITCH_JELAJAH_DETAIL: JelajahBumiItem = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  coverImage: '/images/logo-perpusnas.png',
  publishedAt: '',
  status: 'Terbit',
  authorName: 'Perpustakaan Nasional Republik Indonesia',
  location: 'Indonesia',
  attachments: [],
};

// Kosongkan mock data - data diambil murni dari database sesuai instruksi
export const STITCH_MOCK_JELAJAH_BUMI_9: JelajahBumiItem[] = [];

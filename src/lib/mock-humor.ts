export interface HumorItem {
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
}

// Kosongkan mock data - data diambil murni dari database sesuai instruksi
export const STITCH_MOCK_HUMOR_9: HumorItem[] = [];

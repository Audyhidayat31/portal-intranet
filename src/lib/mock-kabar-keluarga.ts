export interface KabarKeluargaItem {
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
  categoryType?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_KABAR_KELUARGA_ATTACHMENTS_5: Array<{ id: number; label: string; src: string }> = [];

export const CATEGORY_TYPES_KABAR_KELUARGA = [
  'Semua',
  'Kelahiran',
  'Pernikahan',
  'Duka Cita',
  'Prestasi Putra-Putri',
  'Purna Tugas',
  'Keluarga Sehat',
  'Kebersamaan',
];

// Kosongkan mock data - data diambil murni dari database sesuai instruksi
export const STITCH_MOCK_KABAR_KELUARGA_9: KabarKeluargaItem[] = [];

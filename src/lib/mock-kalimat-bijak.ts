export interface KalimatBijakAttachment {
  id: number;
  label: string;
  src: string;
  fileName?: string;
  size?: string;
}

export interface KalimatBijakItem {
  id: string;
  title: string;
  quote: string;
  excerpt?: string;
  content?: string;
  figure: string;
  figureDate: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  createdAt?: string;
  updatedAt?: string;
  coverImage?: string;
  authorName?: string;
  authorPosition?: string;
  editorName?: string;
  editor?: { name: string };
  attachments?: KalimatBijakAttachment[];
}

export const MOCK_KALIMAT_BIJAK_ATTACHMENTS_5: KalimatBijakAttachment[] = [
  { id: 1, label: 'Kutipan & Poster', src: '/images/logo-perpusnas.png', fileName: 'kutipan_inspirasi_perpusnas.jpg', size: '1.8 MB' },
  { id: 2, label: 'Dokumentasi Tokoh', src: '/images/logo-perpusnas.png', fileName: 'arsip_tokoh_bangsa.jpg', size: '2.1 MB' },
  { id: 3, label: 'Transkrip Pidato Asli', src: '/images/logo-perpusnas.png', fileName: 'naskah_pidato_otentik.pdf', size: '950 KB' },
  { id: 4, label: 'Sesi Diskusi Literasi', src: '/images/logo-perpusnas.png', fileName: 'dokumentasi_literasi.jpg', size: '2.4 MB' },
  { id: 5, label: 'Bahan Siar Pustaka', src: '/images/logo-perpusnas.png', fileName: 'lembar_informasi_pustaka.pdf', size: '640 KB' },
];

export const STITCH_MOCK_KALIMAT_BIJAK: KalimatBijakItem[] = [
];

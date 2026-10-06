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
  coverImage?: string;
  authorName?: string;
  authorPosition?: string;
  attachments?: KalimatBijakAttachment[];
}

export const MOCK_KALIMAT_BIJAK_ATTACHMENTS_5: KalimatBijakAttachment[] = [
  { id: 1, label: 'Kutipan & Poster', src: '/images/kabar-keluarga/card-1.jpg', fileName: 'kutipan_inspirasi_perpusnas.jpg', size: '1.8 MB' },
  { id: 2, label: 'Dokumentasi Tokoh', src: '/images/kabar-keluarga/card-2.jpg', fileName: 'arsip_tokoh_bangsa.jpg', size: '2.1 MB' },
  { id: 3, label: 'Transkrip Pidato Asli', src: '/images/kabar-keluarga/card-3.jpg', fileName: 'naskah_pidato_otentik.pdf', size: '950 KB' },
  { id: 4, label: 'Sesi Diskusi Literasi', src: '/images/kabar-keluarga/card-4.jpg', fileName: 'dokumentasi_literasi.jpg', size: '2.4 MB' },
  { id: 5, label: 'Bahan Siar Pustaka', src: '/images/kabar-keluarga/card-5.jpg', fileName: 'lembar_informasi_pustaka.pdf', size: '640 KB' },
];

export const STITCH_MOCK_KALIMAT_BIJAK: KalimatBijakItem[] = [
];

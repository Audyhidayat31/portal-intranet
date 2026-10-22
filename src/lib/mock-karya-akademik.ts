export interface KaryaAkademikAttachment {
  id: number;
  label: string;
  src: string;
  fileName?: string;
  size?: string;
}

export interface KaryaAkademikItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  createdAt?: string;
  updatedAt?: string;
  authorName: string;
  authorPosition?: string;
  authorUnit?: string;
  authorAvatar?: string;
  attachments?: KaryaAkademikAttachment[];
  editor?: { name: string } | null;
  editorName?: string | null;
}

export const MOCK_KARYA_AKADEMIK_ATTACHMENTS_5: KaryaAkademikAttachment[] = [
  { id: 1, label: 'Cover Buku & Naskah', src: '/images/logo-perpusnas.png', fileName: 'cover_buku_sastra_prof.jpg', size: '2.4 MB' },
  { id: 2, label: 'Dokumentasi Penyerahan', src: '/images/logo-perpusnas.png', fileName: 'penyerahan_koleksi_perpusnas.jpg', size: '1.8 MB' },
  { id: 3, label: 'Kata Pengantar & Sinopsis', src: '/images/logo-perpusnas.png', fileName: 'sinopsis_karya_sastra.pdf', size: '850 KB' },
  { id: 4, label: 'Sesi Diskusi Bedah Buku', src: '/images/logo-perpusnas.png', fileName: 'bedah_buku_auditorium.jpg', size: '3.1 MB' },
  { id: 5, label: 'Sertifikat Registrasi ISBN', src: '/images/logo-perpusnas.png', fileName: 'sertifikat_deposit_isbn.pdf', size: '620 KB' },
];

export const STITCH_MOCK_KARYA_AKADEMIK: KaryaAkademikItem[] = [];


export interface AgendaItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  eventStartDate?: string;
  eventLocation?: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  attachments?: Array<{ id: number; label: string; src: string; fileName?: string }>;
}

export const MOCK_AGENDA_ATTACHMENTS_5 = [
  { id: 1, label: 'Gambar', src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80', fileName: 'rundown_kegiatan_agenda.jpg' },
  { id: 2, label: 'Gambar', src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', fileName: 'denah_ruangan_acara.jpg' },
  { id: 3, label: 'Gambar', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80', fileName: 'daftar_undangan_resmi.pdf' },
  { id: 4, label: 'Gambar', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80', fileName: 'materi_presentasi_narasumber.pdf' },
  { id: 5, label: 'Gambar', src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', fileName: 'surat_edaran_kedinasan.pdf' },
];

export const STITCH_MOCK_AGENDAS_6: AgendaItem[] = [
  {
    id: 'agenda-1',
    title: 'Membangun Ekosistem Perpustakaan Digital Nasional Masa Depan',
    excerpt: 'Rapat koordinasi nasional dan pemaparan hasil riset indeks kegemaran membaca masyarakat Indonesia bersama pemangku kepentingan perpustakaan daerah...',
    content: `Rapat koordinasi nasional dan pemaparan hasil riset indeks kegemaran membaca masyarakat Indonesia bersama pemangku kepentingan perpustakaan daerah. Menampilkan inovasi pojok baca terpadu dan layanan perpustakaan digital inklusif.

Kegiatan ini berfokus pada sinkronisasi data repositori daerah dengan server induk Perpustakaan Nasional RI demi mendukung satu data literasi nusantara.`,
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    publishedAt: '19 Agustus 2026',
    eventStartDate: '2026-08-19T08:30:00.000Z',
    eventLocation: 'Ruang Teater Lt. 2, Gedung Perpusnas Medan Merdeka Selatan',
    status: 'Terbit',
    authorName: 'Biro Hukum & Humas Perpusnas',
    attachments: MOCK_AGENDA_ATTACHMENTS_5,
  },
  {
    id: 'agenda-2',
    title: 'Membangun Ekosistem Perpustakaan Ramah Anak dan Disabilitas',
    excerpt: 'Workshop peningkatan standar operasional prosedur penerimaan kunjungan pemustaka khusus dan pengenalan fasilitas ruang baca braille interaktif...',
    content: `Workshop peningkatan standar operasional prosedur penerimaan kunjungan pemustaka khusus dan pengenalan fasilitas ruang baca braille interaktif.

Para peserta akan dibekali keahlian interaksi dan pemanfaatan alat bantu audio-visual cerdas untuk mendampingi pemustaka berkebutuhan khusus.`,
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    publishedAt: '19 Agustus 2026',
    eventStartDate: '2026-08-19T09:30:00.000Z',
    eventLocation: 'Layanan Pemustaka Khusus Lt. 7, Gedung Perpusnas',
    status: 'Terbit',
    authorName: 'Direktorat Layanan Perpustakaan',
    attachments: MOCK_AGENDA_ATTACHMENTS_5,
  },
  {
    id: 'agenda-3',
    title: 'Minat Membaca Warga Indonesia dan Transformasi Sosial Inklusi',
    excerpt: 'Evaluasi berkala pelaksanaan program perpustakaan berbasis inklusi sosial tingkat nasional untuk pengentasan kemiskinan dan pemberdayaan ekonomi...',
    content: `Evaluasi berkala pelaksanaan program perpustakaan berbasis inklusi sosial tingkat nasional untuk pengentasan kemiskinan dan pemberdayaan ekonomi masyarakat desa binaan.

Menghadirkan kisah sukses pustakawan penggerak dari berbagai pelosok tanah air.`,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    publishedAt: '19 Agustus 2026',
    eventStartDate: '2026-08-19T13:00:00.000Z',
    eventLocation: 'Auditorium Utama Lt. 4, Gedung Perpusnas Merdeka Selatan',
    status: 'Menunggu',
    authorName: 'Pusat Pengembangan Perpustakaan',
    attachments: MOCK_AGENDA_ATTACHMENTS_5,
  },
  {
    id: 'agenda-4',
    title: 'Seminar Restorasi dan Preservasi Naskah Kuno Nusantara',
    excerpt: 'Kajian teknologi laboratorium kimia dan digitalisasi berkas kuno dalam mengamankan fisik naskah lontar abad ke-16 dari degradasi kelembapan...',
    content: `Kajian teknologi laboratorium kimia dan digitalisasi berkas kuno dalam mengamankan fisik naskah lontar abad ke-16 dari degradasi kelembapan dan mikroorganisme perusak bahan organik.`,
    coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80',
    publishedAt: '19 Agustus 2026',
    eventStartDate: '2026-08-19T10:00:00.000Z',
    eventLocation: 'Laboratorium Preservasi Bahan Pustaka, Salemba Raya',
    status: 'Terbit',
    authorName: 'Pusat Preservasi & Konservasi',
    attachments: MOCK_AGENDA_ATTACHMENTS_5,
  },
  {
    id: 'agenda-5',
    title: 'Peluncuran Aplikasi Katalog Induk Nasional Terintegrasi AI',
    excerpt: 'Sosialisasi implementasi kecerdasan artifisial generasi terbaru dalam percepatan temu balik informasi repositori bahan pustaka nasional...',
    content: `Sosialisasi implementasi kecerdasan artifisial generasi terbaru dalam percepatan temu balik informasi repositori bahan pustaka nasional. Pemustaka dapat mencari kutipan naskah berbasis deskripsi suara dan gambar.`,
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    publishedAt: '18 Agustus 2026',
    eventStartDate: '2026-08-18T14:00:00.000Z',
    eventLocation: 'Pusat Data dan Informasi (Pusdatin)',
    status: 'Menunggu',
    authorName: 'Pusdatin Perpusnas RI',
    attachments: MOCK_AGENDA_ATTACHMENTS_5,
  },
  {
    id: 'agenda-6',
    title: 'Bimbingan Teknis Standarisasi Bibliografi ISBD Pegawai',
    excerpt: 'Pelatihan teknis pengkatalogan bahan tercetak dan naskah rekam bagi para pustakawan pertama dan muda se-Indonesia...',
    content: `Pelatihan teknis pengkatalogan bahan tercetak dan naskah rekam bagi para pustakawan pertama dan muda se-Indonesia guna menyelaraskan kepatuhan pada standar internasional pengolahan metadata.`,
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    publishedAt: '15 Agustus 2026',
    eventStartDate: '2026-08-15T09:00:00.000Z',
    eventLocation: 'Ruang Rapat Pusdiklat Perpusnas, Gunung Putri',
    status: 'Terbit',
    authorName: 'Pusat Pendidikan & Pelatihan',
    attachments: MOCK_AGENDA_ATTACHMENTS_5,
  },
];

const STORAGE_KEY_AGENDAS = 'portal_agendas_data';

export const getStoredAgendas = (): AgendaItem[] => {
  if (typeof window === 'undefined') return STITCH_MOCK_AGENDAS_6;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AGENDAS);
    if (!raw) return STITCH_MOCK_AGENDAS_6;
    return JSON.parse(raw);
  } catch {
    return STITCH_MOCK_AGENDAS_6;
  }
};

export const saveStoredAgendas = (items: AgendaItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_AGENDAS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save agendas to storage', err);
  }
};


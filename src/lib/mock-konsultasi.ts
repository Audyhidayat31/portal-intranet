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
  replies?: ConsultationReplyItem[];
}

export const INITIAL_MOCK_KONSULTASI: ConsultationItem[] = [
  {
    id: '6',
    title: 'Alur Pengajuan Mutasi Antar-Unit Kerja dan Kebutuhan Formasi Pustakawan',
    category: 'Pegawai',
    date: '19 Agustus 2026',
    status: 'Terbit',
    description:
      'Pemberitahuan mengenai tata cara mengajukan permohonan alih tugas internal untuk penyegaran unit kerja dan pemetaan kompetensi staf layanan.',
    attachmentName: 'Konsultasi Pegawai.pdf',
    attachmentUrl: '#',
    authorName: 'Siti Rahmawati',
    replies: [],
  },
  {
    id: '7',
    title: 'Pembaruan Antivirus Terpusat dan Kebijakan Pemindaian Flashdisk di PC Layanan',
    category: 'IT',
    date: '18 Agustus 2026',
    status: 'Terbit',
    description:
      'Sosialisasi jadwal update patch keamanan OS dan instalasi endpoint security pada seluruh workstation bagian layanan pemustaka.',
    attachmentName: 'Konsultasi IT.pdf',
    attachmentUrl: '#',
    authorName: 'Rian Pratama',
    replies: [],
  },
  {
    id: '8',
    title: 'Jadwal Medical Check-Up Tahunan Pegawai dan Vaksinasi Influenza',
    category: 'Kesehatan',
    date: '17 Agustus 2026',
    status: 'Terbit',
    description:
      'Informasi pendaftaran pemeriksaan kesehatan berkala bagi seluruh ASN dan PPNPN di lingkungan Perpustakaan Nasional RI.',
    attachmentName: 'Konsultasi Kesehatan.pdf',
    attachmentUrl: '#',
    authorName: 'dr. Anita Wijaya',
    replies: [],
  },
  {
    id: '9',
    title: 'Tata Cara Usul Kenaikan Pangkat Reguler dan Jalur Ijazah Periode Oktober',
    category: 'Pegawai',
    date: '16 Agustus 2026',
    status: 'Terbit',
    description:
      'Kelengkapan berkas administrasi dan batas akhir pengunggahan dokumen SKP pada sistem SI-ASN untuk periode kenaikan pangkat mendatang.',
    attachmentName: 'Konsultasi Pegawai.pdf',
    attachmentUrl: '#',
    authorName: 'Biro SDM',
    replies: [],
  },
  {
    id: '10',
    title: 'Troubleshooting Printer Barcode dan Scanner Sirkulasi di Lantai 4',
    category: 'IT',
    date: '15 Agustus 2026',
    status: 'Menunggu',
    description:
      'Laporan dan konsultasi penanganan driver printer thermal yang kerap terputus saat pencetakan label barcode buku koleksi baru.',
    attachmentName: 'Konsultasi IT.pdf',
    attachmentUrl: '#',
    authorName: 'Ahmad Fauzi',
    replies: [],
  },
];

const STORAGE_KEY = 'portal_konsultasi_items_v1';

export function getStoredConsultations(): ConsultationItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_KONSULTASI;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_KONSULTASI));
      return INITIAL_MOCK_KONSULTASI;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_KONSULTASI));
    return INITIAL_MOCK_KONSULTASI;
  } catch {
    return INITIAL_MOCK_KONSULTASI;
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

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
    id: '1',
    title: 'Musim Batuk & Flu Massal Tiba: Jaga Diri dan Pertahanan Tubuh Anda',
    category: 'Kesehatan',
    date: '20 Agustus 2026',
    status: 'Terbit',
    description:
      'Musim peralihan cuaca seringkali membawa lonjakan kasus batuk dan flu di lingkungan kerja. Mari tingkatkan daya tahan tubuh dengan menjaga hidrasi, konsumsi vitamin C, istirahat cukup, dan mengenakan masker saat berada di ruang kerja bersama untuk mencegah penularan droplet.',
    attachmentName: 'Konsultasi Kesehatan.pdf',
    attachmentUrl: '#',
    authorName: 'Budi Sujatmiko',
    replies: [
      {
        id: 'rep-1',
        authorName: 'Budi Sujatmiko',
        date: '20 Agustus 2026',
        content: 'Terima kasih informasinya. Apakah di poliklinik lantai 3 tersedia multivitamin dan masker tambahan bagi pegawai yang mulai bergejala?',
      },
      {
        id: 'rep-2',
        authorName: 'Budi Sujatmiko',
        date: '20 Agustus 2026',
        content: 'Sudah disediakan paket vitamin harian di loket poliklinik, silakan rekan-rekan mengambil dengan menunjukkan kartu pegawai.',
      },
      {
        id: 'rep-3',
        authorName: 'Budi Sujatmiko',
        date: '20 Agustus 2026',
        content: 'Sangat bermanfaat untuk menjaga kebersihan ruangan kerja, kami juga sudah mengusulkan disinfeksi berkala di ruang baca utama.',
      },
      {
        id: 'rep-4',
        authorName: 'Budi Sujatmiko',
        date: '20 Agustus 2026',
        content: 'Semoga seluruh rekan-rekan lekas pulih dan tetap menjaga protokol kebersihan bersama.',
      },
    ],
  },
  {
    id: '2',
    title: 'Pedoman Pengajuan Cuti Sakit dan Surat Keterangan Dokter di Era Digital',
    category: 'Kesehatan',
    date: '20 Agustus 2026',
    status: 'Terbit',
    description:
      'Penjelasan mengenai alur unggah surat keterangan sakit melalui portal kepegawaian mandiri bagi pegawai yang berhalangan hadir lebih dari satu hari kerja serta validasi dari dokter poliklinik.',
    attachmentName: 'Konsultasi Kesehatan.pdf',
    attachmentUrl: '#',
    authorName: 'Budi Sujatmiko',
    replies: [
      {
        id: 'rep-201',
        authorName: 'Budi Sujatmiko',
        date: '20 Agustus 2026',
        content: 'Format surat sakit dari fasilitas kesehatan luar harus menyertakan nomor SIP dokter yang merawat secara jelas.',
      },
    ],
  },
  {
    id: '3',
    title: 'Prosedur Akses VPN dan Jaringan Intranet Perpusnas dari Luar Kantor',
    category: 'IT',
    date: '20 Agustus 2026',
    status: 'Terbit',
    description:
      'Panduan konfigurasi profil OpenVPN dan otentikasi dua faktor untuk mengakses aplikasi kedinasan internal saat dinas luar atau WFH secara aman dan terenkripsi.',
    attachmentName: 'Konsultasi IT.pdf',
    attachmentUrl: '#',
    authorName: 'Budi Sujatmiko',
    replies: [
      {
        id: 'rep-301',
        authorName: 'Budi Sujatmiko',
        date: '20 Agustus 2026',
        content: 'Pastikan sertifikat VPN terbaru telah diunduh dari portal Pusdatin sebelum mencoba koneksi.',
      },
    ],
  },
  {
    id: '4',
    title: 'Kendala Otentikasi Akun Email Dinas dan Pemulihan Password SSO',
    category: 'IT',
    date: '20 Agustus 2026',
    status: 'Menunggu',
    description:
      'Langkah-langkah penanganan bagi pegawai yang mengalami penguncian akun email dinas setelah pembaruan sistem keamanan server terpusat dan permohonan reset sandi.',
    attachmentName: 'Konsultasi IT.pdf',
    attachmentUrl: '#',
    authorName: 'Budi Sujatmiko',
    replies: [],
  },
  {
    id: '5',
    title: 'Penyesuaian Angka Kredit Jabatan Fungsional Pustakawan Berdasarkan PermenPAN-RB',
    category: 'Pegawai',
    date: '20 Agustus 2026',
    status: 'Menunggu',
    description:
      'Konsultasi seputar konversi predikat kinerja tahunan ke dalam angka kredit integrasi bagi pustakawan tingkat ahli pertama hingga utama sesuai aturan kepegawaian terbaru.',
    attachmentName: 'Konsultasi Pegawai.pdf',
    attachmentUrl: '#',
    authorName: 'Budi Sujatmiko',
    replies: [],
  },
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

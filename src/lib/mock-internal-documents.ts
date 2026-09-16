export interface InternalDocument {
  id: string;
  title: string;
  documentNumber: string;
  category: 'Surat Edaran' | 'Surat Keputusan' | 'Formulir' | 'SOP & Regulasi' | string;
  keterangan: string;
  attachmentName: string;
  fileSize?: string;
  publishedAt: string;
  authorName?: string;
}

export const STITCH_MOCK_INTERNAL_DOCS_5: InternalDocument[] = [
  {
    id: 'doc-1',
    title: 'Surat Edaran Jam Kerja Pegawai Selama Periode Triwulan III',
    documentNumber: 'SE/101/VII/2026',
    category: 'Surat Edaran',
    publishedAt: '2026-08-20',
    keterangan: 'Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',
    attachmentName: 'Surat Edaran.pdf',
    fileSize: '1.8 MB',
  },
  {
    id: 'doc-2',
    title: 'Surat Edaran Pelaksanaan Evaluasi Kinerja dan Sasaran Kinerja Pegawai (SKP)',
    documentNumber: 'SE/102/VIII/2026',
    category: 'Surat Edaran',
    publishedAt: '2026-08-20',
    keterangan: 'Instruksi pengisian capaian target SKP semester gasal melalui portal kepegawaian internal sebelum batas akhir verifikasi atasan langsung.',
    attachmentName: 'Surat Edaran.pdf',
    fileSize: '2.4 MB',
  },
  {
    id: 'doc-3',
    title: 'Surat Keputusan Pembentukan Tim Gugus Tugas Penguatan Tata Kelola Literasi Digital',
    documentNumber: 'SK/45/Perpusnas/2026',
    category: 'Surat Keputusan',
    publishedAt: '2026-08-20',
    keterangan: 'Penetapan susunan keanggotaan pokja percepatan transformasi perpustakaan berbasis digital dan interoperabilitas data arsip nasional.',
    attachmentName: 'Surat Keputusan.pdf',
    fileSize: '3.1 MB',
  },
  {
    id: 'doc-4',
    title: 'Formulir Pengajuan Cuti Tahunan dan Izin Alasan Penting Pegawai',
    documentNumber: 'FORM/08/KS/2026',
    category: 'Formulir',
    publishedAt: '2026-08-20',
    keterangan: 'Blangko resmi pengajuan izin dan cuti terintegrasi dengan persetujuan berjenjang pimpinan unit kerja.',
    attachmentName: 'Form_Pengajuan.docx',
    fileSize: '450 KB',
  },
  {
    id: 'doc-5',
    title: 'Formulir Permohonan Pemeliharaan Perangkat Keras dan Sarana TI',
    documentNumber: 'FORM/09/KS/2026',
    category: 'Formulir',
    publishedAt: '2026-08-20',
    keterangan: 'Formulir permohonan perbaikan perangkat komputer, koneksi jaringan intranet, dan lisensi perangkat lunak kerja dinas.',
    attachmentName: 'Form_Pengajuan.docx',
    fileSize: '520 KB',
  },
];

const STORAGE_KEY_INTERNAL_DOCS = 'portal_internal_docs_data';

export const getStoredInternalDocs = (): InternalDocument[] => {
  if (typeof window === 'undefined') return STITCH_MOCK_INTERNAL_DOCS_5;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERNAL_DOCS);
    if (!raw) return STITCH_MOCK_INTERNAL_DOCS_5;
    return JSON.parse(raw);
  } catch {
    return STITCH_MOCK_INTERNAL_DOCS_5;
  }
};

export const saveStoredInternalDocs = (items: InternalDocument[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_INTERNAL_DOCS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save internal docs to storage', err);
  }
};

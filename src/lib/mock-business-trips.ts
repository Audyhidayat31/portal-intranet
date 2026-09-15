// 5 Distinct Mock Business Trip Reports
export interface MockBusinessTrip {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  body?: string;
  destinationCity: string;
  publishedAt: string;
  attachmentName: string;
  author: {
    name: string;
    profile: {
      position: string;
      unitKerja: string;
    };
  };
}

export const STITCH_MOCK_BUSINESS_TRIPS_5: MockBusinessTrip[] = [
  {
    id: 'trip-1',
    title: 'Laporan Delegasi Workshop Kepustakawanan Asia Tenggara (CONSAL) di Singapura',
    excerpt: 'Partisipasi aktif dalam perumusan standar interoperabilitas data metadata katalog perpustakaan ASEAN.',
    content: `Perjalanan dinas ini dilaksanakan dalam rangka menghadiri Workshop Kepustakawanan Asia Tenggara (Congress of Southeast Asian Librarians - CONSAL) yang diselenggarakan di National Library Board Singapura.

Fokus utama delegasi:
• Perumusan standar pertukaran metadata bibliografi antar-perpustakaan nasional ASEAN.
• Integrasi repositori digital naskah bersejarah kawasan Asia Tenggara.
• Sesi diskusi penguatan kapasitas pustakawan dalam menghadapi era transformasi AI dan data science.

Hasil kegiatan ini menjadi pijakan strategis bagi Perpusnas RI dalam memimpin inisiatif jejaring katalog digital regional ASEAN.`,
    destinationCity: 'Singapura',
    publishedAt: '2026-08-19',
    attachmentName: 'Laporan_Delegasi_CONSAL_Singapura_2026.pdf',
    author: { name: 'Drs. Bambang Sudiro, M.Hum.', profile: { position: 'Pustakawan Ahli Utama', unitKerja: 'Direktorat Kerja Sama Antarlembaga' } },
  },
  {
    id: 'trip-2',
    title: 'Laporan Tugas Monitoring dan Supervisi Perpustakaan Daerah Provinsi DI Yogyakarta',
    excerpt: 'Evaluasi akreditasi 45 perpustakaan sekolah dan desa di wilayah Kabupaten Kulon Progo dan Sleman.',
    content: `Monitoring lapangan dan pendampingan akreditasi perpustakaan sekolah/madrasah serta perpustakaan kelurahan di wilayah DI Yogyakarta.

Poin evaluasi:
• Pemeriksaan kesesuaian sarana prasarana dengan Standar Nasional Perpustakaan (SNP).
• Evaluasi pemanfaatan pojok baca digital dan integrasi koleksi lokal.
• Bimbingan teknis otomasi perpustakaan menggunakan aplikasi berbasis cloud.

Rekomendasi tindak lanjut: 38 perpustakaan memenuhi syarat peningkatan akreditasi menjadi predikat A.`,
    destinationCity: 'Yogyakarta & Sleman',
    publishedAt: '2026-08-19',
    attachmentName: 'Laporan_Supervisi_Perpustakaan_Jogja.pdf',
    author: { name: 'Siti Rahmawati, S.Sos.', profile: { position: 'Pustakawan Ahli Muda', unitKerja: 'Pusat Pengembangan Perpustakaan' } },
  },
  {
    id: 'trip-3',
    title: 'Laporan Perjalanan Dinas Pelatihan Kearsipan Digital di Yogyakarta',
    excerpt: 'Implementasi sistem pengarsipan berbasis cloud untuk institusi pemerintahan dan strategi migrasi arsip fisik ke format digital.',
    content: `Perjalanan dinas ini dilaksanakan dalam rangka mengikuti Pelatihan Kearsipan Digital Tingkat Lanjut yang diselenggarakan oleh Arsip Nasional Republik Indonesia (ANRI) cabang Yogyakarta. Pelatihan berlangsung selama tiga hari, mulai tanggal 15 hingga 17 Agustus 2026, bertempat di Hotel Tentrem, Yogyakarta.

Fokus utama dari pelatihan ini adalah pada implementasi sistem pengarsipan berbasis cloud untuk institusi pemerintahan dan strategi migrasi dari arsip fisik ke format digital dengan standar keamanan tinggi. Sesi-sesi meliputi:
• Standarisasi Metadata Arsip Digital (Pembicara: Dr. Hendrawan).
• Keamanan Data Siber dalam Sistem Pengarsipan Terpusat.
• Workshop Praktis: Migrasi Data Skala Besar menggunakan Sistem Manajemen Arsip Dinamis (SRIKANDI).

Hasil dari pelatihan ini sangat relevan dengan inisiatif digitalisasi yang sedang berlangsung di Perpusnas RI. Pengetahuan yang didapat akan segera dideseminasikan kepada tim IT dan kearsipan internal dalam sesi knowledge sharing minggu depan. Diharapkan kita dapat mengadopsi beberapa protokol keamanan baru yang diperkenalkan selama pelatihan.`,
    destinationCity: 'Yogyakarta',
    publishedAt: '2026-08-20',
    attachmentName: 'Laporan_Dinas_Kearsipan_Digital_Yogyakarta_2026.pdf',
    author: { name: 'Budi Sujatmiko', profile: { position: 'Pustakawan Ahli Muda', unitKerja: 'Pusat Preservasi & Pengolahan Bahan Pustaka' } },
  },
  {
    id: 'trip-4',
    title: 'Laporan Workshop Konservasi & Preservasi Naskah Lontar Kuno di Denpasar Bali',
    excerpt: 'Pelaksanaan bimbingan teknis pembersihan jamur dan alih media digital 120 kropak naskah kuno nusantara.',
    content: `Perjalanan dinas ini dilaksanakan dalam rangka kegiatan Konservasi dan Digitalisasi Naskah Kuno Nusantara di Provinsi Bali. Tim preservasi bahan pustaka Perpusnas bekerja sama dengan Dinas Kearsipan dan Perpustakaan Provinsi Bali serta tokoh adat setempat.

Pencapaian utama:
• Perawatan fisik dan laminasi manual untuk 120 kropak naskah daun lontar peninggalan abad ke-17.
• Pemindaian resolusi tinggi 600 DPI dan pembuatan master digital untuk repositori Khazanah Budaya Nusantara.
• Pelatihan singkat metode penyimpanan ramah iklim tropis bagi pengelola naskah lokal.`,
    destinationCity: 'Denpasar',
    publishedAt: '2026-08-20',
    attachmentName: 'Laporan_Preservasi_Lontar_Bali.pdf',
    author: { name: 'Ni Made Suastini, M.Si.', profile: { position: 'Konservator Bahan Pustaka', unitKerja: 'Pusat Preservasi & Alih Media' } },
  },
  {
    id: 'trip-5',
    title: 'Laporan Evaluasi Dampak Transformasi Perpustakaan Berbasis Inklusi Sosial di Medan',
    excerpt: 'Peninjauan dampak pelatihan keterampilan literasi terapan terhadap peningkatan ekonomi komunitas binaan di Sumatera Utara.',
    content: `Kegiatan pemantauan dan evaluasi terpadu program Transformasi Perpustakaan Berbasis Inklusi Sosial (TPBIS) di wilayah Sumatera Utara.

Hasil evaluasi:
• Terjadi peningkatan partisipasi masyarakat sebesar 42% pada kelas literasi kewirausahaan di 12 perpustakaan desa.
• Produk olahan UMKM binaan perpustakaan berhasil memperoleh sertifikasi halal dan izin P-IRT.
• Koordinasi dengan Bappeda setempat untuk alokasi dana desa mendukung keberlanjutan fasilitas pojok baca digital.`,
    destinationCity: 'Medan',
    publishedAt: '2026-08-20',
    attachmentName: 'Laporan_Evaluasi_Inklusi_Medan.pdf',
    author: { name: 'Rahmat Hidayat, M.M.', profile: { position: 'Pustakawan Ahli Muda', unitKerja: 'Pusat Pengembangan Perpustakaan' } },
  },
];

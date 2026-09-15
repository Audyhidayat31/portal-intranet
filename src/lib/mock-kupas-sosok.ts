export interface FigureItem {
  id: string;
  name: string;
  slug: string;
  position: string;
  unitKerja: string;
  quote: string;
  fullStory: string;
  photoUrl: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  isSpotlight?: boolean;
  achievements?: string[];
  careerHistory?: { year: string; role: string }[];
}

export const STITCH_MOCK_FIGURES_6: FigureItem[] = [
  {
    id: 'fig-1',
    name: 'Dra. Sri Sumekar, M.Si.',
    slug: 'dra-sri-sumekar-msi',
    position: 'Pustakawan Ahli Utama & Tokoh Pelestari Manuskrip Langka',
    unitKerja: 'Deputi Bidang Pengembangan Bahan Pustaka dan Jasa Informasi',
    quote: 'Setiap helai naskah kuno yang kita selamatkan adalah satu nyawa ingatan peradaban leluhur yang kita wariskan kepada generasi emas masa depan.',
    fullStory: `Dra. Sri Sumekar, M.Si. telah mengabdikan lebih dari 30 tahun hidupnya dalam bidang pelestarian dan konservasi naskah kuno Nusantara. Kiprahnya bermula saat ia memimpin tim restorasi naskah lontar dan daluwang di pelosok Nusantara.

Dengan ketekunan tinggi, beliau berhasil menginisiasi laboratorium digitalisasi manuskrip modern di lingkungan Perpustakaan Nasional RI, menyelamatkan puluhan ribu halaman naskah bersejarah dari kerusakan iklim tropis.

Di bawah bimbingannya, pustakawan-pustakawan muda dilatih teknik filologi, kodikologi, dan penanganan fisik manuskrip langka. Dedikasi tanpa henti ini mengantarkan beliau menerima berbagai anugerah kepustakawanan tingkat nasional dan internasional.`,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    isSpotlight: true,
    achievements: [
      'Pustakawan Berprestasi Tingkat Nasional (2018)',
      'Inisiator Laboratorium Konservasi Manuskrip Kuno Perpusnas (2020)',
      'Penulis Buku Panduan Restorasi Fisik Lontar & Kertas Kuno (2023)',
    ],
    careerHistory: [
      { year: '2022 - Sekarang', role: 'Pustakawan Ahli Utama Perpusnas RI' },
      { year: '2016 - 2022', role: 'Koordinator Preservasi Bahan Pustaka' },
      { year: '2010 - 2016', role: 'Pustakawan Madya Koleksi Khusus Naskah Kuno' },
    ],
  },
  {
    id: 'fig-2',
    name: 'Ir. Hendro Wicaksono, M.Eng.',
    slug: 'ir-hendro-wicaksono-meng',
    position: 'Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu',
    unitKerja: 'Pusat Data dan Informasi Perpustakaan Nasional RI',
    quote: 'Teknologi adalah sarana, tetapi semangat melayani pemustaka dengan sepenuh hati adalah jiwa dari setiap baris kode yang kita bangun.',
    fullStory: `Ir. Hendro Wicaksono, M.Eng. dikenal sebagai pelopor transformasi komputasi dan arsitektur data perpustakaan modern di Indonesia. Berbekal latar belakang rekayasa perangkat lunak dan kecintaan pada literasi, ia merancang fondasi sistem otomasi perpustakaan terbuka yang kini digunakan oleh ribuan lembaga di seluruh Nusantara.

Beliau memimpin proyek integrasi katalog induk nasional dan layanan akses repositori digital terdistribusi, memungkinkan pemustaka di seluruh pelosok mengakses koleksi ilmiah secara instan dan andal.

Prinsip open-source dan kolaborasi antarpengembang menjadi pilar penting yang terus ia tularkan kepada para pranata komputer di lingkungan Perpusnas RI.`,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    isSpotlight: true,
    achievements: [
      'Penghargaan ASN Berprestasi Kategori Inovatif (2019)',
      'Pencetus Framework Otomasi Koleksi Digital Nasional (2021)',
      'Arsitek Utama Sistem Cloud Katalog Induk Terpadu (2024)',
    ],
    careerHistory: [
      { year: '2021 - Sekarang', role: 'Pranata Komputer Ahli Madya Pusdatin Perpusnas' },
      { year: '2015 - 2021', role: 'Ketua Tim Pengembangan Arsitektur Perangkat Lunak' },
      { year: '2009 - 2015', role: 'Perekayasa Sistem Jaringan & Basis Data' },
    ],
  },
  {
    id: 'fig-3',
    name: 'Drs. Supriyanto, M.Hum.',
    slug: 'drs-supriyanto-mhum',
    position: 'Pustakawan Madya & Kurator Koleksi Khusus Nusantara',
    unitKerja: 'Direktorat Deposit dan Pengembangan Koleksi Perpustakaan',
    quote: 'Koleksi perpustakaan adalah jembatan pengetahuan yang menghubungkan kebijaksanaan masa lalu dengan penjelajahan masa depan.',
    fullStory: `Drs. Supriyanto, M.Hum. mendedikasikan kariernya dalam mengidentifikasi, mengkaji, dan melestarikan karya cetak dan karya rekam bangsa Indonesia. Kejelian beliau dalam menelusuri penerbitan langka telah memperkaya khazanah deposit nasional dengan ribuan dokumen penting.

Ia aktif memberikan edukasi tentang arti penting Undang-Undang Serah Simpan Karya Cetak dan Karya Rekam kepada asosiasi penerbit, universitas, dan produser media independen di seluruh tanah air.`,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    achievements: [
      'Kurator Terbaik Deposit Nasional (2021)',
      'Penggagas Program Akuisisi Karya Daerah Terpadu (2023)',
    ],
    careerHistory: [
      { year: '2020 - Sekarang', role: 'Pustakawan Madya Deposit Bahan Pustaka' },
      { year: '2014 - 2020', role: 'Kurator Koleksi Surat Kabar Langka' },
    ],
  },
  {
    id: 'fig-4',
    name: 'Prof. Dr. Sulistyo Basuki',
    slug: 'prof-dr-sulistyo-basuki',
    position: 'Pakar Ilmu Perpustakaan & Tokoh Pendidikan Kepustakawanan',
    unitKerja: 'Pusat Pembinaan Pustakawan Perpusnas RI',
    quote: 'Profesi pustakawan bukan sekadar penjaga buku, melainkan navigator peradaban di tengah samudera informasi dunia.',
    fullStory: `Prof. Dr. Sulistyo Basuki merupakan mahaguru kepustakawanan Indonesia yang telah meletakkan landasan teoritis dan praktis ilmu perpustakaan dan informasi. Karya tulis, buku ajar, dan kajian ilmiah beliau menjadi rujukan wajib di seluruh program studi perpustakaan di Indonesia.

Melalui kemitraan erat dengan Perpustakaan Nasional RI, beliau tiada henti mendorong standardisasi kompetensi profesi pustakawan Indonesia agar berdaya saing global.`,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    achievements: [
      'Lifetime Achievement Award Ikatan Pustakawan Indonesia (2017)',
      'Penulis Ensiklopedia Kepustakawanan Indonesia (2019)',
    ],
    careerHistory: [
      { year: '2018 - Sekarang', role: 'Dewan Pakar Pembinaan Pustakawan Perpusnas' },
      { year: '1995 - 2018', role: 'Guru Besar Ilmu Perpustakaan dan Informasi' },
    ],
  },
  {
    id: 'fig-5',
    name: 'Dr. Adin Bondar, M.Si.',
    slug: 'dr-adin-bondar-msi',
    position: 'Deputi Bidang Pengembangan Sumber Daya Perpustakaan',
    unitKerja: 'Kedeputian Pengembangan Sumber Daya Perpustakaan Perpusnas RI',
    quote: 'Transformasi perpustakaan berbasis inklusi sosial adalah langkah nyata mencerdaskan kehidupan bangsa secara berkeadilan.',
    fullStory: `Dr. Adin Bondar, M.Si. memimpin berbagai terobosan strategis dalam penguatan budaya literasi masyarakat, khususnya di daerah 3T (Tertinggal, Terdepan, dan Terluar). Pendekatan humanis dan inovatif yang diusungnya menekankan peran perpustakaan sebagai pengungkit kesejahteraan masyarakat melalui kecakapan hidup.

Sinergi dengan pemerintah daerah, komunitas taman baca masyarakat (TBM), dan sektor swasta terus dikembangkan demi mewujudkan kedaulatan literasi di seluruh penjuru Indonesia.`,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    achievements: [
      'Pemrakarsa Program Perpustakaan Inklusi Sosial Berkelanjutan (2022)',
      'Penghargaan Tokoh Penggerak Literasi Daerah (2024)',
    ],
    careerHistory: [
      { year: '2022 - Sekarang', role: 'Deputi Bidang Pengembangan Sumber Daya Perpustakaan' },
      { year: '2017 - 2022', role: 'Direktur Standardisasi dan Akreditasi Perpustakaan' },
    ],
  },
  {
    id: 'fig-6',
    name: 'Nurcahyono, S.S., M.Si.',
    slug: 'nurcahyono-ss-msi',
    position: 'Pegiat Transformasi Layanan Digital & Budaya Baca Pemustaka',
    unitKerja: 'Pusat Pengembangan Perpustakaan Sekolah/Madrasah dan PT',
    quote: 'Inovasi ruang baca digital membuka gerbang tak terbatas bagi anak-anak pelosok untuk menggapai mimpi setinggi langit.',
    fullStory: `Nurcahyono, S.S., M.Si. aktif merancang program literasi digital dan festival literasi pemuda yang menjangkau ribuan sekolah dan madrasah di Indonesia. Kemampuannya mengemas program membaca dengan format multimedia modern berhasil menarik minat generasi Z untuk mencintai buku.

Beliau juga memelopori pojok baca ramah anak berbasis kearifan lokal di berbagai perpustakaan daerah dan komunitas belajar masyarakat.`,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    achievements: [
      'Inovator Layanan Baca Edukatif Ramah Anak (2020)',
      'Koordinator Festival Literasi Pelajar Nasional (2023)',
    ],
    careerHistory: [
      { year: '2021 - Sekarang', role: 'Koordinator Pengembangan Literasi Sekolah Pusbang Perpusnas' },
      { year: '2015 - 2021', role: 'Pustakawan Layanan Khusus Anak & Remaja' },
    ],
  },
];

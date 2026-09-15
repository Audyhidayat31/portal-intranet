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
  authorName: string;
  authorPosition?: string;
  authorUnit?: string;
  authorAvatar?: string;
  attachments?: KaryaAkademikAttachment[];
}

export const MOCK_KARYA_AKADEMIK_ATTACHMENTS_5: KaryaAkademikAttachment[] = [
  { id: 1, label: 'Cover Buku & Naskah', src: '/images/kabar-keluarga/card-1.jpg', fileName: 'cover_buku_sastra_prof.jpg', size: '2.4 MB' },
  { id: 2, label: 'Dokumentasi Penyerahan', src: '/images/kabar-keluarga/card-2.jpg', fileName: 'penyerahan_koleksi_perpusnas.jpg', size: '1.8 MB' },
  { id: 3, label: 'Kata Pengantar & Sinopsis', src: '/images/kabar-keluarga/card-3.jpg', fileName: 'sinopsis_karya_sastra.pdf', size: '850 KB' },
  { id: 4, label: 'Sesi Diskusi Bedah Buku', src: '/images/kabar-keluarga/card-4.jpg', fileName: 'bedah_buku_auditorium.jpg', size: '3.1 MB' },
  { id: 5, label: 'Sertifikat Registrasi ISBN', src: '/images/kabar-keluarga/card-5.jpg', fileName: 'sertifikat_deposit_isbn.pdf', size: '620 KB' },
];

export const STITCH_MOCK_KARYA_AKADEMIK: KaryaAkademikItem[] = [
  {
    id: 'karya-akademik-1',
    title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
    excerpt: 'Perpustakaan Nasional Republik Indonesia menyelenggarakan peluncuran dan apresiasi karya sastra monumental yang merangkum khazanah tradisi lisan dan manuskrip nusantara sebagai warisan peradaban bangsa.',
    content: `Perpustakaan Nasional Republik Indonesia menyelenggarakan peluncuran dan apresiasi karya sastra monumental yang merangkum khazanah tradisi lisan dan manuskrip nusantara sebagai warisan peradaban bangsa.

Acara ini dihadiri oleh para sastrawan nasional, sivitas akademika, peneliti pernaskahan kuno, serta jajaran pustakawan ahli dari berbagai wilayah. Kegiatan ini tidak hanya memaparkan kontribusi keilmuan kontemporer, tetapi juga menjadi momentum penting bagi penguatan deposit karya cetak dan karya rekam nasional sebagaimana diamanatkan oleh regulasi keperpustakaan.

Melalui telaah kritis atas karya sastra ini, diharapkan generasi muda dan peneliti kebudayaan dapat mengeksplorasi kembali nilai-nilai luhur dan kearifan lokal yang terekam dalam naskah nusantara guna menjawab tantangan literasi di era disrupsi digital.`,
    coverImage: '/images/kabar-keluarga/card-1.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    authorUnit: 'Pusat Preservasi dan Alih Media Bahan Perpustakaan',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
  {
    id: 'karya-akademik-2',
    title: 'Analisis Bibliometrik Publikasi Ilmiah Manuskrip Kuno Nusantara Periode 2015-2025',
    excerpt: 'Kajian komprehensif mengenai pemetaan riset dan sitasi pernaskahan nusantara dalam jurnal bereputasi internasional menggunakan pendekatan analisis jaringan sitasi VOSviewer.',
    content: `Penelitian ini menyajikan pemetaan komprehensif perkembangan publikasi ilmiah mengenai manuskrip kuno nusantara yang terindeks dalam pangkalan data internasional selama kurun waktu satu dekade.

Hasil analisis menunjukkan peningkatan tren riset kolaboratif antarbangsa dengan fokus dominan pada alih aksara, kodikologi, dan digitalisasi preservasi naskah lontar dan daluwang. Kajian ini memberikan arah strategis bagi prioritas akuisisi koleksi khusus di Perpustakaan Nasional RI.`,
    coverImage: '/images/kabar-keluarga/card-2.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Terbit',
    authorName: 'Dr. Sri Rahayu, M.Hum.',
    authorPosition: 'Peneliti Ahli Utama',
    authorUnit: 'Pusat Riset dan Pengembangan Perpustakaan',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
  {
    id: 'karya-akademik-3',
    title: 'Strategi Preservasi dan Konservasi Bahan Pustaka Digital Berbasis Cloud Architecture',
    excerpt: 'Formulasi kebijakan dan arsitektur teknis penyimpanan jangka panjang data digital master repositori naskah untuk menjamin integritas dan aksesibilitas masa depan.',
    content: `Preservasi digital memerlukan standardisasi mikroservis dan redundansi multi-region guna mengantisipasi kerusakan fisik media penyimpanan serta keusangan format berkas (format obsolescence).

Tulisan ini menjabarkan implementasi protokol OAIS (Open Archival Information System) yang diadopsi dalam infrastruktur Pusat Data dan Informasi Perpusnas RI guna memastikan siklus hidup aset intelektual bangsa terlindungi secara berkelanjutan.`,
    coverImage: '/images/kabar-keluarga/card-3.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Menunggu',
    authorName: 'Ahmad Fauzi, M.Kom.',
    authorPosition: 'Pranata Komputer Ahli Muda',
    authorUnit: 'Pusat Data dan Informasi (Pusdatin)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
  {
    id: 'karya-akademik-4',
    title: 'Studi Komparasi Layanan Informasi Inklusif Perpustakaan bagi Komunitas Disabilitas',
    excerpt: 'Evaluasi aksesibilitas fasilitas fisik dan portal digital ramah netra serta rungu di perpustakaan rujukan nasional kawasan Asia Tenggara.',
    content: `Layanan perpustakaan inklusif menuntut sinergi antara desain universal, koleksi buku braille/audiobook bertagging DAISY, serta antarmuka situs yang mematuhi pedoman Web Content Accessibility Guidelines (WCAG) 2.1 AA.

Riset ini mengusulkan roadmap peningkatan kapasitas pustakawan dalam mendampingi pemustaka berkebutuhan khusus demi mewujudkan hak atas literasi yang setara bagi seluruh lapisan warga negara.`,
    coverImage: '/images/kabar-keluarga/card-4.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Terbit',
    authorName: 'Dewi Lestari, S.Sos.',
    authorPosition: 'Pustakawan Ahli Pertama',
    authorUnit: 'Direktorat Layanan Perpustakaan dan Informasi',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
  {
    id: 'karya-akademik-5',
    title: 'Implementasi Ontologi Semantic Web pada Repositori Koleksi Khusus Perpusnas',
    excerpt: 'Penerapan teknologi Linked Open Data (LOD) dan skema Resource Description and Access (RDA) untuk integrasi data silang repositori perpustakaan, museum, dan arsip.',
    content: `Konektivitas antarpangkalan data warisan budaya menuntut semantik relasi yang kaya melampaui metadata MARC21 konvensional. 

Melalui perancangan model graf pengetahuan (knowledge graph), pemustaka dapat menelusuri korelasi historis antara pengarang, naskah turunan, peristiwa sejarah, serta artefak terkait secara dinamis dalam satu jendela pencarian terpadu.`,
    coverImage: '/images/kabar-keluarga/card-5.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Menunggu',
    authorName: 'Hendra Gunawan, S.Kom., M.T.I.',
    authorPosition: 'Pranata Komputer Ahli Madya',
    authorUnit: 'Pusat Data dan Informasi',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
  {
    id: 'karya-akademik-6',
    title: 'Transformasi Perpustakaan Berbasis Inklusi Sosial dalam Pengurangan Kemiskinan',
    excerpt: 'Kajian dampak sosio-ekonomi program perpustakaan berbasis inklusi sosial (TPBIS) pada masyarakat perdesaan dan pelaku UMKM binaan di 34 provinsi.',
    content: `Program Transformasi Perpustakaan Berbasis Inklusi Sosial (TPBIS) telah membuktikan bahwa perpustakaan bukan lagi sekadar gudang buku hening, melainkan ruang interaksi dan transfer keterampilan hidup (life skills).

Melalui pelatihan literasi digital, wirausaha kuliner, kerajinan tangan, dan pertanian hidroponik berbasis bahan bacaan terapan, perpustakaan telah menjadi agen transformasi nyata dalam memperkuat ketahanan ekonomi keluarga.`,
    coverImage: '/images/kabar-keluarga/card-6.jpg',
    publishedAt: '18 Agustus 2026',
    status: 'Terbit',
    authorName: 'Dra. Endang Sulistyowati, M.Si.',
    authorPosition: 'Pustakawan Ahli Utama',
    authorUnit: 'Pusat Pengembangan Perpustakaan Umum dan Khusus',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
  {
    id: 'karya-akademik-7',
    title: 'Kajian Filologis Naskah Hikayat Amir Hamzah Koleksi Perpustakaan Nasional',
    excerpt: 'Transliterasi, kritik teks, dan interpretasi makna kontekstual epos kepahlawanan melayu klasik bernilai adiluhung.',
    content: `Hikayat Amir Hamzah merupakan salah satu mahakarya sastra Melayu klasik dengan ketebalan fisik dan ragam variasi salinan terbanyak di dunia Melayu.

Kajian ini menelaah varian bahasa Melayu-Riau beraksara Jawi abad ke-18 dengan metode diplomatik guna menyajikan edisi teks yang akurat bagi rujukan filolog modern dan pemerhati sastra Nusantara.`,
    coverImage: '/images/kabar-keluarga/card-7.jpg',
    publishedAt: '15 Agustus 2026',
    status: 'Terbit',
    authorName: 'Rahmat Hidayat, M.Hum.',
    authorPosition: 'Filolog Ahli Muda',
    authorUnit: 'Pusat Preservasi dan Alih Media Bahan Perpustakaan',
    authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
    attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  },
];

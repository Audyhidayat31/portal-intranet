export interface JelajahBumiItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  location?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_JELAJAH_ATTACHMENTS_5 = [
  { id: 1, label: 'Gambar', src: '/images/jelajah-bumi/card-1.jpg' },
  { id: 2, label: 'Gambar', src: '/images/jelajah-bumi/card-2.jpg' },
  { id: 3, label: 'Gambar', src: '/images/jelajah-bumi/card-3.jpg' },
  { id: 4, label: 'Gambar', src: '/images/jelajah-bumi/card-4.jpg' },
  { id: 5, label: 'Gambar', src: '/images/jelajah-bumi/card-5.jpg' },
];

export const DEFAULT_STITCH_JELAJAH_DETAIL: JelajahBumiItem = {
  id: 'penerbitan-buku-sastra',
  title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
  excerpt: 'Uraian Jelajah Bumi mengenai peluncuran karya sastra dan safari literasi nasional di gedung fasilitas layanan Perpusnas RI.',
  content: `Uraian Jelajah Bumi

Perpustakaan Nasional Republik Indonesia menyelenggarakan kegiatan penerbitan dan bedah buku karya sastra bertajuk penjelajahan khazanah nusantara. Kegiatan ini dihadiri oleh para sastrawan, pustakawan, akademisi, serta pegiat literasi dari berbagai penjuru tanah air.

Dalam kegiatan ini, dipaparkan berbagai catatan perjalanan dan kekayaan narasi lokal yang didokumentasikan dalam naskah sastra kontemporer. Para peserta juga berkesempatan meninjau pameran foto safari literasi nusantara yang merangkum geliat membaca masyarakat di pelosok negeri.`,
  coverImage: '/images/jelajah-bumi/card-1.jpg',
  publishedAt: '2026-08-20',
  status: 'Terbit',
  authorName: 'Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.',
  location: 'Perpustakaan Nasional RI, Jakarta',
  attachments: MOCK_JELAJAH_ATTACHMENTS_5,
};

export const STITCH_MOCK_JELAJAH_BUMI_9: JelajahBumiItem[] = [
  {
    id: 'jelajah-bumi-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Perjalanan literasi keliling nusantara yang diprakarsai oleh tim ekspedisi Perpustakaan Nasional membuktikan antusiasme warga desa terpencil dalam menyambut kedatangan mobil perpustakaan keliling.

Di berbagai daerah yang disinggahi, warga bersama keluarga berkumpul di balai warga sejak pagi hari. Beragam buku mulai dari bacaan anak bergambar, panduan pertanian terpadu, hingga naskah sejarah lokal menjadi buruan utama. Program Jelajah Bumi Literasi ini tidak sekadar membawa buku, melainkan mempertemukan interaksi antar generasi untuk menghidupkan budaya tutur dan membaca di ruang terbuka.

Langkah berikutnya adalah memperkuat ekosistem pojok baca desa dengan melibatkan duta baca setempat dan penyediaan akses buku digital terintegrasi Cakrawala.`,
    coverImage: '/images/jelajah-bumi/card-1.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Tim Jelajah Literasi',
    location: 'Wonosobo, Jawa Tengah',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-2',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Kunjungan ke sekolah alam dan ruang baca anak di wilayah pesisir memperlihatkan bagaimana media literasi ramah anak menumbuhkan rasa ingin tahu yang tinggi.

Anak-anak belajar membaca bersama dengan didampingi fasilitator dan relawan pustakawan. Lewat format membaca nyaring (read aloud) dan eksplorasi ensiklopedia sains, pemahaman kognitif siswa berkembang pesat. Hasil observasi lapangan menunjukkan bahwa ketersediaan buku berkualitas secara langsung mendongkrak minat baca hingga 78%.`,
    coverImage: '/images/jelajah-bumi/card-2.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Siti Rahmawati, M.Pd.',
    location: 'Banyuwangi, Jawa Timur',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-3',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Transformasi digital melalui platform perpustakaan modern memungkinkan para pekerja profesional dan generasi muda mengakses koleksi buku elektronik kapan saja.

Studi lapangan mendapati kebiasaan baru di kalangan pekerja urban yang meluangkan waktu 30-45 menit setiap pagi untuk membaca publikasi ilmiah dan buku pengembangan diri via gawai tablet di ruang keluarga. Fenomena ini membuktikan bahwa era digital memperkuat, bukan menggantikan, tradisi membaca bangsa.`,
    coverImage: '/images/jelajah-bumi/card-3.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Santoso, S.Kom.',
    location: 'Bandung, Jawa Barat',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-4',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Sensasi membalik lembar demi lembar buku fisik tetap memiliki tempat istimewa di hati para pencinta literasi klasik.

Koleksi buku lawas dan sastra klasik Indonesia yang dirawat dengan baik kembali digemari pembaca muda. Saat melakukan dokumentasi ke berbagai perpustakaan komunitas di Yogyakarta, ditemukan tren pembaca yang membentuk kelompok kajian buku mandiri untuk mendiskusikan gagasan karya Pramoedya Ananta Toer dan Chairil Anwar.`,
    coverImage: '/images/jelajah-bumi/card-4.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Dra. Endang Purwanti',
    location: 'Yogyakarta, D.I. Yogyakarta',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-5',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Desain arsitektur perpustakaan modern yang ramah lingkungan dan menyatu dengan alam menjadi daya tarik utama bagi pengunjung dari berbagai latar belakang.

Gedung perpustakaan berkonsep 'green library' dengan ventilasi alami, taman terbuka hijau, dan interior kayu hangat berhasil meningkatkan angka kunjungan fisik hingga lebih dari 200 persen per bulan. Tempat ini kini bukan sekadar ruang baca, melainkan pusat kegiatan komunitas dan kreasi masyarakat.`,
    coverImage: '/images/jelajah-bumi/card-5.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Ir. Hendra Gunawan',
    location: 'Malang, Jawa Timur',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-6',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Kedekatan orang tua dan anak dalam aktivitas membaca bersama di taman kota memperkuat fondasi literasi keluarga Indonesia.

Melalui program 'Taman Baca Akhir Pekan', para pustakawan mengajak keluarga menghabiskan waktu luang dengan membaca cerita dongeng nusantara di bawah rindangnya pepohonan kota. Interaksi hangat antara orang tua dan anak ini menciptakan memori emosional positif terhadap buku sedari dini.`,
    coverImage: '/images/jelajah-bumi/card-6.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Maya Safitri, S.Sos.',
    location: 'Bogor, Jawa Barat',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-7',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Analisis data statistik membaca nasional menunjukkan tren kurva pertumbuhan yang konsisten positif sepanjang semester pertama tahun 2026.

Indeks Aktivitas Literasi Membaca (Alibaca) mengalami peningkatan yang didorong oleh sinergi program distribusi buku berbasis digital, revitalisasi perpustakaan daerah, dan kampanye gemar membaca yang masif di media sosial kedinasan.`,
    coverImage: '/images/jelajah-bumi/card-7.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pusat Analisis Kebijakan',
    location: 'Jakarta Pusat, DKI Jakarta',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-8',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Keberadaan perpustakaan pribadi dan pojok baca rumahan semakin marak di pemukiman warga urban.

Buku-buku yang tersusun rapi di rak ruang tamu kini menjadi kebanggaan keluarga Indonesia. Kampanye 'Satu Rumah Satu Rak Buku' yang digulirkan mendapat sambutan hangat dari masyarakat, terbukti dengan meningkatnya transaksi pembelian buku fiksi dan referensi edukatif.`,
    coverImage: '/images/jelajah-bumi/card-8.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Ahmad Fauzi, S.Hum.',
    location: 'Semarang, Jawa Tengah',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
  {
    id: 'jelajah-bumi-9',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Suasana ruang baca bersama di kampus dan perpustakaan universitas selalu dipadati mahasiswa dan peneliti muda.

Kolaborasi antar civitas akademika dalam mencari referensi jurnal terakreditasi dan naskah primer mencerminkan gairah keilmuan yang membanggakan. Fasilitas ruang diskusi yang kondusif turut memicu produktivitas riset dan penulisan karya ilmiah mahasiswa.`,
    coverImage: '/images/jelajah-bumi/card-9.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Rina Kusuma, M.Si.',
    location: 'Surabaya, Jawa Timur',
    attachments: MOCK_JELAJAH_ATTACHMENTS_5,
  },
];


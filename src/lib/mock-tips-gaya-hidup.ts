export interface TipsGayaHidupItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
  categoryType?: string;
  attachments?: Array<{ id: number; label: string; src: string }>;
}

export const MOCK_TIPS_ATTACHMENTS_5 = [
  { id: 1, label: 'Gambar', src: '/images/tips-gaya-hidup/card-1.jpg' },
  { id: 2, label: 'Gambar', src: '/images/tips-gaya-hidup/card-2.jpg' },
  { id: 3, label: 'Gambar', src: '/images/tips-gaya-hidup/card-3.jpg' },
  { id: 4, label: 'Gambar', src: '/images/tips-gaya-hidup/card-4.jpg' },
  { id: 5, label: 'Gambar', src: '/images/tips-gaya-hidup/card-5.jpg' },
];

export const CATEGORY_TYPES_TIPS = [
  'Semua',
  'Ergonomi Kerja',
  'Kesehatan Mata',
  'Gaya Hidup Digital',
  'Pola Tidur & Istirahat',
  'Ruang Kerja Sehat',
  'Aktivitas Fisik',
  'Nutrisi & Hidrasi',
  'Manajemen Stres',
  'Work-Life Balance',
];

export const STITCH_MOCK_TIPS_GAYA_HIDUP_9: TipsGayaHidupItem[] = [
  {
    id: 'tips-gaya-hidup-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Bagi staf dan pustakawan yang menghabiskan berjam-jam membaca dan memeriksa naskah, menjaga postur duduk ergonomis adalah kunci utama mencegah ketegangan leher dan tulang belakang.

Praktikkan aturan duduk 90 derajat, letakkan monitor sejajar dengan pandangan mata, dan gunakan bantalan pinggang untuk menopang kurva alami tulang punggung. Luangkan waktu 2 menit setiap jam untuk melakukan peregangan ringan pada pergelangan tangan dan pundak agar peredaran darah tetap lancar.`,
    coverImage: '/images/tips-gaya-hidup/card-1.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'dr. Hendra Wicaksono, Sp.Ok',
    categoryType: 'Ergonomi Kerja',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-2',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Pembiasaan membaca buku fisik sejak usia dini terbukti melatih konsentrasi dan mencegah kelelahan mata digital (*computer vision syndrome*).

Terapkan aturan 20-20-20 saat membaca gawai maupun buku: setiap 20 menit, alihkan pandangan ke objek berjarak 20 kaki (sekitar 6 meter) selama 20 detik. Jangan lupa menjaga pencahayaan ruangan tetap memadai agar mata tidak bekerja terlalu keras saat menatap teks bacaan.`,
    coverImage: '/images/tips-gaya-hidup/card-2.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Siti Nurhaliza, S.Kep.',
    categoryType: 'Kesehatan Mata',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-3',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Di tengah kesibukan pekerjaan modern, menyisihkan waktu istirahat sejenak sambil membaca artikel inspiratif dapat menjadi sarana *mindful relaxation* yang efektif.

Gunakan perangkat tablet dengan fitur filter cahaya biru (blue light filter) atau mode e-ink pada malam hari. Hindari membaca layar gawai minimal 30 menit sebelum tidur untuk memastikan kualitas istirahat malam yang optimal dan memulihkan energi tubuh.`,
    coverImage: '/images/tips-gaya-hidup/card-3.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Santoso, S.Kom.',
    categoryType: 'Gaya Hidup Digital',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-4',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Menjadikan membaca buku cetak sebagai ritual sebelum tidur membantu menurunkan kadar hormon stres (kortisol) dan memicu rasa rileks alami.

Ciptakan suasana kamar tidur yang hening, redupkan lampu utama, dan pilihlah bacaan yang bertema positif atau sastra menenangkan. Kebiasaan ini membantu otak melepaskan ketegangan rutinitas kerja harian.`,
    coverImage: '/images/tips-gaya-hidup/card-4.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Dra. Endang Purwanti',
    categoryType: 'Pola Tidur & Istirahat',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-5',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Penataan ruang kerja berkonsep *biophilic design* dengan tanaman hijau dan ventilasi udara alami sangat berdampak pada produktivitas serta kesehatan mental pegawai.

Meletakkan tanaman penyerap polutan seperti lidah mertua (*Sansevieria*) di sudut ruang baca atau meja kerja dapat meningkatkan pasokan oksigen, mengurangi kejenuhan, dan menyegarkan suasana kerja di kantor perpustakaan.`,
    coverImage: '/images/tips-gaya-hidup/card-5.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Ir. Hendra Gunawan',
    categoryType: 'Ruang Kerja Sehat',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-6',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Memadukan aktivitas rekreasi luar ruangan dengan membaca bersama keluarga di taman kota memberikan manfaat ganda bagi kebugaran fisik dan kehangatan emosional.

Jadwalkan jalan kaki pagi di sekitar taman kantor atau area terbuka hijau minimal 20 menit sebelum memulai jam dinas. Paparan sinar matahari pagi membantu sintesis vitamin D yang penting untuk imunitas dan kesehatan tulang.`,
    coverImage: '/images/tips-gaya-hidup/card-6.jpg',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Maya Safitri, S.Sos.',
    categoryType: 'Aktivitas Fisik',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-7',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Kebutuhan hidrasi tubuh sering kali terabaikan saat seseorang asyik membaca atau fokus menganalisis data kearsipan.

Sediakan botol air minum di meja kerja dan targetkan konsumsi minimal 2 liter air putih per hari. Kurangi konsumsi minuman berpemanis tinggi dan gantilah camilan kerja dengan buah segar atau kacang-kacangan kaya omega-3 yang mendukung fungsi otak.`,
    coverImage: '/images/tips-gaya-hidup/card-7.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Ahli Gizi Poliklinik',
    categoryType: 'Nutrisi & Hidrasi',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-8',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Membangun sudut baca pribadi yang tenang dan nyaman di rumah merupakan salah satu cara terbaik memulihkan energi setelah seharian bekerja.

Tata buku-buku favorit dengan pencahayaan hangat, tambahkan aroma terapi lavender atau eucalyptus, dan luangkan waktu bebas gawai untuk membaca buku sastra atau puisi guna menenangkan pikiran.`,
    coverImage: '/images/tips-gaya-hidup/card-8.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Ahmad Fauzi, S.Hum.',
    categoryType: 'Manajemen Stres',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
  {
    id: 'tips-gaya-hidup-9',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia...',
    content: `Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku terus mengalami peningkatan yang signifikan di berbagai kalangan usia. Menjaga keseimbangan antara tanggung jawab kedinasan dan pengembangan diri adalah seni penting dalam menjaga kesehatan mental pegawai.

Terapkan teknik manajemen waktu seperti metode Pomodoro (25 menit fokus bekerja, 5 menit rehat sejenak) saat menuntaskan tugas-tugas administratif perpustakaan agar stamina mental tetap terjaga hingga sore hari.`,
    coverImage: '/images/tips-gaya-hidup/card-9.jpg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Rina Kusuma, M.Si.',
    categoryType: 'Work-Life Balance',
    attachments: MOCK_TIPS_ATTACHMENTS_5,
  },
];

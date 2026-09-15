export interface HumorItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
}

export const STITCH_MOCK_HUMOR_9: HumorItem[] = [
  {
    id: 'humor-1',
    title: 'Misteri Spidol Papan Tulis yang Selalu Menghilang saat Rapat Evaluasi',
    excerpt: 'Sebuah penyelidikan mendalam tentang fenomena gaib hilangnya spidol permanen di ruang rapat lantai 4.',
    content: `Rapat baru dimulai 5 menit, namun drama pencarian spidol hitam sudah memakan waktu 15 menit. Dari lantai 2 sampai lantai 7, semua mengaku hanya meminjam sebentar, padahal di mejanya ada koleksi lengkap aneka warna.

Tips bertahan hidup di ruang rapat:
1. Selalu bawa spidol pribadi di dalam saku jas.
2. Jangan pernah meminjamkan spidol tanpa jaminan kunci motor.
3. Beri label nama sebesar mungkin pada tutup spidol.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0oi9RLhooT-XkOMEC7v4nh7NmI3yIX3mO-vcQkH3Zbz5N3OXui0lrAZJcR3wpqLESYA4Od7I9EKs6xVb2r3RHHaTrBV5yUA3WUbiIA_7EyT199ffA_W9d0NwA_8bq0_qidXbZF-jwzfB4tZQ3YreJGmNe-jwUwxNiO8lgd2MsxdhZEpNJF7GNywHi6bWBbrLUNUvci_RVB-tqkK-i38DVebEvb4mxvLFF7AfuKfjWP6LVSr2oC5Vd',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Agus Purnomo, S.Kom.',
  },
  {
    id: 'humor-2',
    title: 'Ketika Pemustaka Mengira Buku Tebal Kamus Adalah Sandaran Tablet',
    excerpt: 'Kisah kocak pustakawan lantai referensi saat mendapati pemustaka memanfaatkan ensiklopedia 10 jilid.',
    content: `Seorang mahasiswa tampak sangat tekun membaca jurnal di gawainya. Namun setelah diperhatikan lebih dekat, tablet miliknya disandarkan dengan presisi pada Kamus Besar Bahasa Indonesia edisi cetak lux tahun 1995.

"Mas, bukunya nggak dibaca?" tanya staf.
"Dibaca kok Pak, lewat layar HP, bukunya buat penopang ergonomis," jawabnya dengan senyum tanpa dosa.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDec0Baw2OVou_kvthuZkxxPOlZcCHmI-QFGwy_wQN4_8RXjE8fb8KlbeCnt1SnjFG5vfSMYz8Mqvqjr6y-ka5Dt3J8Z2R2ybP5bM3vYw0XJl13nelXnO6TbR2-7XGqmd5m3YGGvFNeYgMcMziwDbLd8dEIP8G7csr9VkISTz7krkCBtfhZToC6FD8fDDhOchj4FrN01ba3tJiGZC2QMMfBsBRQo9SGLrRPtES_BSsbKjF0zMhZjqcw',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Siti Nurhaliza, A.Md.',
  },
  {
    id: 'humor-3',
    title: 'Dilema AC Ruang Server: Dinginnya Mengalahkan Kutub Utara',
    excerpt: 'Catatan harian tim IT Support yang wajib mengenakan jaket musim dingin sebelum masuk ruang server utama.',
    content: `Jika di luar gedung Jakarta sedang terik 34 derajat, di ruang data center suhunya serasa berada di pegunungan Alpen. Masuk 5 menit untuk reboot switch, keluar-keluar gigi langsung bergemeretak.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhEDP_gi3mpvQ4Pr96__VZPmd6g1Kr4doVun1PiNEMHlAUc_JgwzMIWQTVnovzMfsqJBSgFAmZ7SshLGS_qJI3Uzd9SIaBKgTlJpmxy6vBa-e8Am80d-NTmzDZeYhU3Tfohhfr14b6j98ROWwTyP2mkW8Sm9FoloNmqsvLcOiNek4Xc4xEXY95AhCPonUYLoxAKwNoJ39voCDDX32PtXv9bcrKXYIYDKXGqlHvM06DzYdp8EIeudzq',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Rian Pratama',
  },
  {
    id: 'humor-4',
    title: 'Panggilan Telepon "Halo Perpustakaan, Mau Pesan Nasi Goreng"',
    excerpt: 'Cerita menggelitik bagian resepsionis yang kerap menerima salah sambung dari warung tenda sebelah.',
    content: `Tepat pukul 12 siang, telepon layanan berdering nyaring. Staf menyapa dengan ramah sesuai standar pelayanan prima, namun dijawab dengan: "Nasi goreng kambingnya dua, jangan pakai acar ya Mbak!"`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_EOes3wsDFbP30FPx61w9EwYcbn9t4_cE_UgXeKW7EsKsSLot4gn0Onb9YjW_GCG4GC1tQYCkFxAXU9h0hGZFJQleB3Jpt0-XToBFa2RFt1qvhPqlTpRNj5EUFSdSnSxuoWzNUvr2Ci13E7XN8V-Q_kvm-MMGl-EQwhuLhq7XMoYEM8CUioq2Bj8bC-SvQfKFwJXgjQamWDUdBi7W4HvMvPLlovKvX0EHn8nOk_WhGCinxm1HMswQ',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Dewi Lestari',
  },
  {
    id: 'humor-5',
    title: 'Stiker Sticky Note Berkelana: Dari Monitor ke Punggung Rekan Kerja',
    excerpt: 'Ketika memo penting jadwal meeting menempel di punggung Kabag saat berkeliling inspeksi pagi.',
    content: `Tertulis jelas di sticky note kuning: "Jangan lupa makan siang jam 12". Ajaibnya, memo itu berpindah dari tepi laptop ke punggung kemeja Pak Bambang saat beliau menghadiri rapat pimpinan.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2kVHxDGg-jP1bEYW-H-G3v6UygUscHeZnyPb94oSRtAW_pjoJUlVg2qxV-Nx1N-0W1b74n2YArKH3F5S0sT-SVVhFteJfSqP4b-EH659zSh-vcAF2IAgnWS5wiQuuxQy7Dn1XRxKa5PyzLYiEJ3uXMj3o-Lg0x1JxszlKnSMMgvhLWpOomSoRMhxlzt-IqKYV1owRW3ahWY43RNZDDz8d7ll1H7-jbwu3Ny229_tD0Hg45wipZ9cL',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Fajar Hidayat',
  },
  {
    id: 'humor-6',
    title: 'Menunggu Lift di Jam Istirahat Seperti Menanti Kepastian Masa Depan',
    excerpt: 'Perjuangan para pegawai menatap indikator lantai lift yang berhenti di setiap lantai tanpa terkecuali.',
    content: `Lantai 24 ke lantai 1 membutuhkan kesabaran tingkat dewa. Setiap lantai lift terbuka, hanya untuk disambut tatapan pasrah rekan kerja yang sudah berdesakan di dalam.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAadtapuzdRRSB0lOuiNsEn_YLrHvTMh0QE2gtVLISrNBfKtM8AxKzibvIHZ4Z6cqfOc-v9rUX5KgosgGSbWRuqktKdGBQnqJ2MOxK2jsWmZm2ONV4dBLTpVdTx3I1-ChbJdGz6fejDU_QE91ugLF7D3yIeKemAgx_0JY1NMJuw7zxYXNe98iorlJUBqny2Cqbc_xMZkZwAIygaYLgVtK5d7GFVPLX210Kc8GvHbXwjtYeQ9Rs_GFJD',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Hendra Gunawan',
  },
  {
    id: 'humor-7',
    title: 'Pembatas Buku Lucu yang Bikin Salah Fokus Para Peneliti Arsip',
    excerpt: 'Koleksi pembatas buku unik berbentuk monster kartun yang ditemukan terselip di naskah babad kuno.',
    content: `Saat memeriksa arsip langka abad ke-18, kurator kaget mendapati pembatas buku bergambar dinosaurus neon yang tertinggal oleh peneliti generasi milenial.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8unv_ISJCo508aGF99keJsGDO-Z6mxgPB4VQto0YxuLLIrUj_nJtMOXRqc0o96B01ccOMCH6ZrgD8IRzk7788Rtj_fQqHPb6yA2096gQwl9GmL_A5MnEycnbG2N1AjbsdxMGu3vmW15GbmDPI20MuiKFTsGJSinM4B0YowRXNHQlOprbT3sg05sGadp-fKWWxuoTGwCP_2ophQGblaFHnc_P59ogKuD_Kl1azxHJZsely5IZWBRQR',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Winda Sari',
  },
  {
    id: 'humor-8',
    title: 'Kopi Mesin Pantry: Sekali Tekan, Harumnya Sampai Ujung Lorong',
    excerpt: 'Kisah mesin espresso otomatis di ruang istirahat yang selalu jadi pusat negosiasi tugas antar divisi.',
    content: `Mesin kopi bukan sekadar pembuat kafein, melainkan forum diplomasi informal paling efektif di seluruh gedung perpustakaan nasional.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBra52Gv-C84uehemTMwuzIMptfOYleFPUUhfG3zMPvEZzoVl9v1JYCzVgF6tqLH2-Zhken0dNK-p7xvQ8tfHuDmlt2lJtBADFkDiQHOMuPYAmE0ulyuuHVBJ_45zx2RJXSbjrqJ54GmZbjPkOhVppSsAA0mdOXQbDw4TiFfL6B-vEKEFGDEN34x8o_HbSJtPd87Bbu27WtcT1aXZQkSa4HBcGsIFs3-IEQRMPMf7ekuOYAlGveHKBg',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Eko Prasetyo',
  },
  {
    id: 'humor-9',
    title: 'Jam Dinding Ruang Kerja yang Berdetak Lambat Menjelang Jam 5 Sore',
    excerpt: 'Teori relativitas waktu yang terbukti nyata ketika jarum jam bergerak semakin lambat di hari Jumat sore.',
    content: `Pukul 16.30 ke 17.00 terasa seperti 2 jam perjalanan antar galaksi. Semua tas sudah rapi di atas meja, siap sprint menuju mesin absensi tepat pada dentang jam lima.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuPmWTJ7g27fUwLY55Dn-yfpJyzjwSWJYaPy0MgqBNrigFEIoQLuDDOvgLoiElGuiqtLZ5muP3wdcHlWPEK_mdjvNlwW7JZ1x_lBq88sGuR8KV9PayXYh-MQfaDfscxtp-NbzFZEpjZiT-Cp8i4ByrgwimDtJvpX3C3sTjKwXdnO9LdUlU3y5IpG68b-P0jLREDxSgQ4ebFTruYvXTvczZ8sR34VAFukxchEfnpDARjhPX1I31dtQ-',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Budi Hartono',
  },
];

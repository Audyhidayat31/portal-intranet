export interface KalimatBijakAttachment {
  id: number;
  label: string;
  src: string;
  fileName?: string;
  size?: string;
}

export interface KalimatBijakItem {
  id: string;
  title: string;
  quote: string;
  excerpt?: string;
  content?: string;
  figure: string;
  figureDate: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  coverImage?: string;
  authorName?: string;
  authorPosition?: string;
  attachments?: KalimatBijakAttachment[];
}

export const MOCK_KALIMAT_BIJAK_ATTACHMENTS_5: KalimatBijakAttachment[] = [
  { id: 1, label: 'Kutipan & Poster', src: '/images/kabar-keluarga/card-1.jpg', fileName: 'kutipan_inspirasi_perpusnas.jpg', size: '1.8 MB' },
  { id: 2, label: 'Dokumentasi Tokoh', src: '/images/kabar-keluarga/card-2.jpg', fileName: 'arsip_tokoh_bangsa.jpg', size: '2.1 MB' },
  { id: 3, label: 'Transkrip Pidato Asli', src: '/images/kabar-keluarga/card-3.jpg', fileName: 'naskah_pidato_otentik.pdf', size: '950 KB' },
  { id: 4, label: 'Sesi Diskusi Literasi', src: '/images/kabar-keluarga/card-4.jpg', fileName: 'dokumentasi_literasi.jpg', size: '2.4 MB' },
  { id: 5, label: 'Bahan Siar Pustaka', src: '/images/kabar-keluarga/card-5.jpg', fileName: 'lembar_informasi_pustaka.pdf', size: '640 KB' },
];

export const STITCH_MOCK_KALIMAT_BIJAK: KalimatBijakItem[] = [
  {
    id: 'kalimat-bijak-1',
    title: 'Pancasila Dasar Falsafah Bangsa',
    quote: 'Gantungkan cita-citamu setinggi langit! Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.',
    excerpt: 'Gantungkan cita-citamu setinggi langit! Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.',
    content: 'Gantungkan cita-citamu setinggi langit! Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang. Pesan mendalam dari Sang Proklamator ini terus membakar semangat generasi penerus dalam menggapai kemajuan bangsa melalui integritas dan dedikasi.',
    figure: 'Soekarno',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-1.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-2',
    title: 'Kejujuran dan Kecintaan Membaca',
    quote: 'Aku rela di penjara asalkan bersama buku, karena dengan buku aku bebas.',
    excerpt: 'Aku rela di penjara asalkan bersama buku, karena dengan buku aku bebas.',
    content: 'Aku rela di penjara asalkan bersama buku, karena dengan buku aku bebas. Mohammad Hatta membuktikan bahwa raga boleh terbelenggu, namun cakrawala pemikiran dan kemerdekaan jiwa akan senantiasa melanglang buana lewat lembaran pustaka.',
    figure: 'Mohammad Hatta',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-2.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-3',
    title: 'Pendidikan yang Memerdekakan',
    quote: 'Lawan sastra ngesti mulya. Ing ngarsa sung tulada, ing madya mangun karsa, tut wuri handayani.',
    excerpt: 'Lawan sastra ngesti mulya. Ing ngarsa sung tulada, ing madya mangun karsa, tut wuri handayani.',
    content: 'Lawan sastra ngesti mulya. Ing ngarsa sung tulada, ing madya mangun karsa, tut wuri handayani. Prinsip kepemimpinan pendidikan Ki Hajar Dewantara yang mengajarkan teladan di depan, pembangun semangat di tengah, dan pendorong dari belakang.',
    figure: 'Ki Hajar Dewantara',
    figureDate: '2-05-1922',
    coverImage: '/images/kabar-keluarga/card-3.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-4',
    title: 'Kekuatan Abadi Menulis',
    quote: 'Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah. Menulis adalah bekerja untuk keabadian.',
    excerpt: 'Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah. Menulis adalah bekerja untuk keabadian.',
    content: 'Orang boleh pandai setinggi langit, tapi selama ia tidak menulis, ia akan hilang di dalam masyarakat dan dari sejarah. Menulis adalah bekerja untuk keabadian. Kutipan legendaris Pramoedya Ananta Toer yang mengajak seluruh insan intelektual untuk membukukan gagasan demi peradaban.',
    figure: 'Pramoedya Ananta Toer',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-4.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-5',
    title: 'Kemanusiaan dan Keberagaman',
    quote: 'Tidak penting apa agamamu atau sukumu, kalau kamu bisa melakukan sesuatu yang baik untuk semua orang, orang tidak pernah tanya apa agamamu.',
    excerpt: 'Tidak penting apa agamamu atau sukumu, kalau kamu bisa melakukan sesuatu yang baik untuk semua orang, orang tidak pernah tanya apa agamamu.',
    content: 'Tidak penting apa agamamu atau sukumu, kalau kamu bisa melakukan sesuatu yang baik untuk semua orang, orang tidak pernah tanya apa agamamu. Nilai luhur toleransi dan humanisme dari Gus Dur yang menjadi pedoman pelayanan publik tanpa diskriminasi.',
    figure: 'Gus Dur (K.H. Abdurrahman Wahid)',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-5.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-6',
    title: 'Cita-Cita dan Kerja Nyata',
    quote: 'Jadilah mata air yang jernih, yang memberikan kehidupan kepada sekitarmu di manapun kamu berada.',
    excerpt: 'Jadilah mata air yang jernih, yang memberikan kehidupan kepada sekitarmu di manapun kamu berada.',
    content: 'Jadilah mata air yang jernih, yang memberikan kehidupan kepada sekitarmu di manapun kamu berada. Nasihat B.J. Habibie agar setiap karya dan kiprah selalu membawa manfaat, keteduhan, serta kemaslahatan nyata bagi bangsa dan sesama.',
    figure: 'B.J. Habibie',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-6.jpg',
    publishedAt: '20 Agustus 2026',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-7',
    title: 'Kekuatan Literasi Generasi Muda',
    quote: 'Hanya mereka yang berani melangkah dan membaca yang akan memahami luasnya samudra peradaban.',
    excerpt: 'Hanya mereka yang berani melangkah dan membaca yang akan memahami luasnya samudra peradaban.',
    content: 'Hanya mereka yang berani melangkah dan membaca yang akan memahami luasnya samudra peradaban.',
    figure: 'Sutan Sjahrir',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-7.jpg',
    publishedAt: '18 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-8',
    title: 'Emansipasi dan Cahaya Ilmu',
    quote: 'Habis gelap terbitlah terang. Tiada awan di langit yang tetap selamanya; tiada mungkin akan terus-menerus terang cuaca.',
    excerpt: 'Habis gelap terbitlah terang. Tiada awan di langit yang tetap selamanya; tiada mungkin akan terus-menerus terang cuaca.',
    content: 'Habis gelap terbitlah terang. Tiada awan di langit yang tetap selamanya; tiada mungkin akan terus-menerus terang cuaca.',
    figure: 'R.A. Kartini',
    figureDate: '21-04-1904',
    coverImage: '/images/kabar-keluarga/card-8.jpg',
    publishedAt: '15 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-9',
    title: 'Integritas Aparatur Negara',
    quote: 'Lebih baik menjadi lilin kecil yang menerangi dalam gelap daripada mengutuk kegelapan tanpa berbuat apa-apa.',
    excerpt: 'Lebih baik menjadi lilin kecil yang menerangi dalam gelap daripada mengutuk kegelapan tanpa berbuat apa-apa.',
    content: 'Lebih baik menjadi lilin kecil yang menerangi dalam gelap daripada mengutuk kegelapan tanpa berbuat apa-apa.',
    figure: 'H. Agus Salim',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-9.jpg',
    publishedAt: '12 Agustus 2026',
    status: 'Menunggu',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
  {
    id: 'kalimat-bijak-10',
    title: 'Cinta Tanah Air dan Perjuangan',
    quote: 'Robek-robeklah badanku, potong-potonglah jasad ini, tetapi jiwaku yang dilindungi benteng Merah Putih akan tetap hidup.',
    excerpt: 'Robek-robeklah badanku, potong-potonglah jasad ini, tetapi jiwaku yang dilindungi benteng Merah Putih akan tetap hidup.',
    content: 'Robek-robeklah badanku, potong-potonglah jasad ini, tetapi jiwaku yang dilindungi benteng Merah Putih akan tetap hidup.',
    figure: 'Jenderal Soedirman',
    figureDate: '1-06-1945',
    coverImage: '/images/kabar-keluarga/card-1.jpg',
    publishedAt: '10 Agustus 2026',
    status: 'Terbit',
    authorName: 'Budi Sujatmiko',
    authorPosition: 'Pustakawan Ahli Madya',
    attachments: MOCK_KALIMAT_BIJAK_ATTACHMENTS_5,
  },
];

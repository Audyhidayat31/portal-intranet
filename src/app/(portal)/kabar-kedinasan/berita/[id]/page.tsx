'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar,
  User,
  Share2,
  Edit,
  Trash2,
  Link as LinkIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Mock Gallery Photos Pool with authentic high-res library & Perpusnas activities
const GALLERY_PHOTOS_PAGES: Record<number, { url: string; title: string }[]> = {
  1: [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCahcTZj5QXSmo3tJ8Zb2Xo1X9pKfvdvRYMZA94cK-i5_dLKEHbFSmblR-2uoRzcmMXVd8Pr0Gb30rpuD95uzQCqAdS2MwCjDq2jhqoR7HDhRt9ko2-g6u0vKDepAglqA-jLL14MSv0qL9KeKZUs2or1uCde_WHnFDwhqCQgCxz0VDCutPC0W9sEljXtLYwUpDTogD_ffc4JmQ759jerILSC0Cj_f0e46NooKBIPHoIXmT2BtEmOOzI',
      title: 'Peresmian dan Temu Wicara Pegawai Perpustakaan Nasional',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEHOB7QqUcScYgUvXChP9nVr-q786x2lx8BOuh71cyFmfAyQkh2I40zYne-i-muHCks4BFJXQicurqCY-ejOWaJtwmAKyhXqVhFLj1iiAEKtAjTnBXS-OH9nSV2Ow-xBU71sx6vyUz6Zd3QI86bMBNd88JZgcnjYUgjCyn7AUY3-cD-5BHpldUaYeEgDF3H_p4drpjrzX0hwVoYEgLJgWH_gjCteVr2n3GuwShw2bRGprmWd9kp71E',
      title: 'Pemanfaatan Ruang Baca Digital dan Akses Naskah Kuno',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVs8mmrPa3sdVqly6ut4qCv12iH9c_Vimok_K0v7C2uj3RMTC7sO_TvMqgHUldInW3xOGk_xu97YpdeQ4Ob3F81iN-mPJOb6JzY0tVieOHWOgvC-IOa8oRjF3SIv6GRiZeemSnRd8XgAeAdRcdfpaF04XF_I3kRRiAdo1EdTQLfsKJ1_R338NDEOCE5AdLyLmlBmM0zN4PLKfzcIKyRaHFlogpc5l9J8MvIM_fLuebs8P8tEtu6mqy',
      title: 'Kunjungan Mahasiswa dan Pemustaka di Gedung Merdeka Selatan',
    },
  ],
  2: [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkcdKoK5-REl9MBRrQbPYW0kksQiURmgFsjfTaeLUi_22R_MorHPvnMqTtejb4QVSXHM3k4-97p8hPyPjOTXwIrISNNnRkXMTPEaEkqLwuTlPndmih-rPWxvArIAGMz5Clty1H129PBoYcjNONKfKbbo2ZsxtlVwL_g7hlGFQcAfD-OqatB4RmWtP1o_1_ZEIalHfp5TcYvZThq76yXdL2ITlS5YVVy5yHBEJG7Q6T-V5yvTALGwTP',
      title: 'Diskusi Terpumpun Standardisasi Perpustakaan Inklusi',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAMzsEB9xDYlgOqRSHrkTLOUa9bZaTWA5LlNN5fXZVz7JVboMF1wjffNW4GV6RbfPN7zLuIVYF-JrBsaN7CBfBpOxMkNQIvYMLBTPh5AvFiMKZxzilZVpvWHQXKpwQ8oqYP7ryftiBHDWN1HKbC-yhW6Ux27FSQ_9PprOJRlEDYwdeics1PHFfKZNJBHWiJdH92gLs8Wjs4a1RKSH7g5GNB-agxtikww_ojgBT_cabf_qAUNFgshDQ',
      title: 'Tata Kelola Preservasi Koleksi Bahan Pustaka',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYiVIlTvlHWCZXsVWN5BKuXNUOFuVWmKl4EtLECjpaOy9dESc-3QPJSVJp5bXmxWHAow1d7ZRMI2LYZ5tJGkKcpz5-yH5kqvgRBImJwBq_iPLpDXPrffOSljK8yNGkVvtipwLYF0otGU56r_SjT5AXkGqMt713QDk_R1omHKPbPeDubgX7UWOLW_cpHkr6M-H7MhReBGdqjdui0kAAPiGWQWyZUqOTWsLnPHseHwN3rkEYjBhOFgaw',
      title: 'Pelayanan Fasilitas Inklusi Ramah Disabilitas',
    },
  ],
  3: [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCahcTZj5QXSmo3tJ8Zb2Xo1X9pKfvdvRYMZA94cK-i5_dLKEHbFSmblR-2uoRzcmMXVd8Pr0Gb30rpuD95uzQCqAdS2MwCjDq2jhqoR7HDhRt9ko2-g6u0vKDepAglqA-jLL14MSv0qL9KeKZUs2or1uCde_WHnFDwhqCQgCxz0VDCutPC0W9sEljXtLYwUpDTogD_ffc4JmQ759jerILSC0Cj_f0e46NooKBIPHoIXmT2BtEmOOzI',
      title: 'Festival Literasi Nasional & Pameran Naskah Nusantara',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEHOB7QqUcScYgUvXChP9nVr-q786x2lx8BOuh71cyFmfAyQkh2I40zYne-i-muHCks4BFJXQicurqCY-ejOWaJtwmAKyhXqVhFLj1iiAEKtAjTnBXS-OH9nSV2Ow-xBU71sx6vyUz6Zd3QI86bMBNd88JZgcnjYUgjCyn7AUY3-cD-5BHpldUaYeEgDF3H_p4drpjrzX0hwVoYEgLJgWH_gjCteVr2n3GuwShw2bRGprmWd9kp71E',
      title: 'Mobil Perpustakaan Keliling Menjangkau Daerah 3T',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVs8mmrPa3sdVqly6ut4qCv12iH9c_Vimok_K0v7C2uj3RMTC7sO_TvMqgHUldInW3xOGk_xu97YpdeQ4Ob3F81iN-mPJOb6JzY0tVieOHWOgvC-IOa8oRjF3SIv6GRiZeemSnRd8XgAeAdRcdfpaF04XF_I3kRRiAdo1EdTQLfsKJ1_R338NDEOCE5AdLyLmlBmM0zN4PLKfzcIKyRaHFlogpc5l9J8MvIM_fLuebs8P8tEtu6mqy',
      title: 'Penyerahan Penghargaan Nugra Jasadarma Pustaloka',
    },
  ],
};

const DEFAULT_NEWS_FALLBACK = {
  id: 'default',
  title: 'Judul Berita',
  publishedAt: '2026-08-19',
  coverImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCahcTZj5QXSmo3tJ8Zb2Xo1X9pKfvdvRYMZA94cK-i5_dLKEHbFSmblR-2uoRzcmMXVd8Pr0Gb30rpuD95uzQCqAdS2MwCjDq2jhqoR7HDhRt9ko2-g6u0vKDepAglqA-jLL14MSv0qL9KeKZUs2or1uCde_WHnFDwhqCQgCxz0VDCutPC0W9sEljXtLYwUpDTogD_ffc4JmQ759jerILSC0Cj_f0e46NooKBIPHoIXmT2BtEmOOzI',
  author: {
    name: 'Humas Perpustakaan Nasional',
  },
  body: `Jakarta – Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi secara resmi membuka gedung baru Perpustakaan Nasional Republik Indonesia yang berlokasi di Jalan Medan Merdeka Selatan. Acara peresmian ini dihadiri oleh berbagai pejabat tinggi negara, budayawan, serta tokoh masyarakat.\n\nGedung baru ini dirancang dengan konsep modern dan ramah lingkungan, dilengkapi dengan fasilitas teknologi informasi mutakhir untuk mendukung layanan perpustakaan digital. Dalam sambutannya, Menteri menekankan pentingnya perpustakaan sebagai pusat literasi dan peradaban bangsa.\n\n"Perpustakaan bukan lagi sekadar tempat menyimpan buku, melainkan ruang interaksi sosial, pusat inovasi, dan sumber inspirasi bagi generasi muda kita," ujar beliau. Fasilitas baru ini diharapkan dapat meningkatkan minat baca masyarakat dan memberikan akses informasi yang lebih luas dan merata.\n\nAcara ditutup dengan penandatanganan prasasti dan tur singkat mengelilingi fasilitas gedung baru, termasuk ruang teater, area pameran, dan koleksi naskah kuno yang kini disimpan dalam ruangan dengan pengatur suhu khusus.`,
};

export default function DetailBeritaPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string;

  const [news, setNews] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryPage, setGalleryPage] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!rawId) return;

    setIsLoading(true);
    fetch(`/api/news/${rawId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found in DB');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setNews(data.data);
        } else {
          throw new Error('API returned unsuccessful');
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Use Mock News Data from Stitch layout
        const fallback = {
          ...DEFAULT_NEWS_FALLBACK,
          id: rawId,
          title: rawId.startsWith('stitch-')
            ? 'Minat membaca Warga Indonesia semakin membaik'
            : 'Judul Berita',
        };
        setNews(fallback);
        setIsLoading(false);
      });
  }, [rawId]);

  // Social Share Handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = news?.title || 'Berita Portal Cakrawala';

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${shareTitle}\n\nBaca selengkapnya di: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(currentUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Delete Handler
  const handleDeleteNews = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/news/${rawId}`, {
        method: 'DELETE',
      });
      router.push('/kabar-kedinasan/berita');
    } catch {
      router.push('/kabar-kedinasan/berita');
    } finally {
      setIsDeleting(false);
    }
  };

  const currentGalleryPhotos = GALLERY_PHOTOS_PAGES[galleryPage] || GALLERY_PHOTOS_PAGES[1];

  const authorName = news?.author?.name || 'Humas Perpustakaan Nasional';
  const displayDate = news?.publishedAt
    ? formatDate(news.publishedAt)
    : '19 Agustus 2026';

  const bodyParagraphs = (news?.body || news?.content || DEFAULT_NEWS_FALLBACK.body)
    .split(/\n\n+/)
    .filter((p: string) => p.trim().length > 0);

  return (
    <div className="bg-[#faf8ff] min-h-[calc(100vh-80px)] text-[#1a1b20]">
      {/* Main Content Area matching Stitch screen spec */}
      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16 py-8 md:py-12">
        {/* Breadcrumbs matching Stitch */}
        <nav aria-label="Breadcrumb" className="flex text-[#444650] text-sm pt-2 mb-6">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                href="/beranda"
                className="hover:text-[#00113a] transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-[#757682]">&gt;</span>
                <span>
                  Kabar Kedinasan
                </span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-[#757682]">&gt;</span>
                <Link
                  href="/kabar-kedinasan/berita"
                  className="hover:text-[#00113a] transition-colors"
                >
                  Berita
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-[#757682]">&gt;</span>
                <span className="text-[#1a1b20] font-bold">Lihat</span>
              </div>
            </li>
          </ol>
        </nav>

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-slate-200 rounded-md w-3/4" />
            <div className="w-full aspect-video bg-slate-200 rounded-xl" />
            <div className="h-8 bg-slate-200 rounded-md w-1/4" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
          </div>
        ) : (
          <article className="w-full">
            {/* Header Section: Judul Berita */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1b20] tracking-tight leading-tight mb-4">
              {news?.title || 'Judul Berita'}
            </h1>

            {/* Image and Metadata Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Featured Image (Left side, takes up 2 columns on lg) */}
              <div className="lg:col-span-2 w-full aspect-video bg-[#e3e2e8] border border-[#c5c6d2] rounded-lg overflow-hidden flex items-center justify-center text-[#444650] shadow-xs relative group h-full">
                {news?.coverImage ? (
                  <img
                    src={news.coverImage}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-12 h-12 text-[#757682]" />
                    <span className="text-sm font-semibold">Gambar Berita</span>
                  </div>
                )}
              </div>

              {/* Metadata Sidebar (Right side, takes up 1 column on lg) */}
              <div className="lg:col-span-1 border border-black rounded-lg overflow-hidden shadow-sm flex flex-col h-full bg-white">
                <div className="bg-[#c5c6d2] px-5 py-3 border-b border-black">
                  <h3 className="font-bold text-xl text-[#1a1b20]">Detail Berita</h3>
                </div>
                <div className="p-5 flex flex-col gap-4 flex-grow">
                  <div>
                    <h4 className="font-bold text-lg text-[#1a1b20] mb-1">Sumber</h4>
                    <p className="text-sm text-[#1a1b20]">www.perpusnas.go.id</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#1a1b20] mb-1">Dibuat Oleh</h4>
                    <p className="text-sm text-[#1a1b20]">{authorName}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#1a1b20] mb-1">Tanggal Diperbarui</h4>
                    <p className="text-sm text-[#1a1b20]">{displayDate}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#1a1b20] mb-1">Status</h4>
                    <p className="text-sm text-[#1a1b20] capitalize">
                      {news?.status === 'PUBLISHED' || news?.status === 'TERBIT' ? 'Terbit' : (news?.status === 'DRAFT' || news?.status === 'DRAF' ? 'Menunggu' : (news?.status || 'Terbit'))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Body (Deskripsi) matching Stitch */}
            <div className="prose max-w-none text-[#1a1b20] text-base leading-relaxed mb-16">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1a1b20] mb-4">
                Deskripsi
              </h3>
              {bodyParagraphs.map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-4 text-[#1a1b20] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <hr className="border-t border-[#c5c6d2] mb-12" />

            {/* Galeri Foto Section */}
            <section className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1b20] mb-6">
                Galeri Foto
              </h2>

              {/* 3 Photos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {currentGalleryPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage(photo.url)}
                    className="aspect-video bg-[#e3e2e8] rounded-lg border border-[#c5c6d2] overflow-hidden relative cursor-pointer group shadow-xs hover:shadow-md transition-all flex items-center justify-center"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-xs text-white font-medium line-clamp-2 drop-shadow">
                        {photo.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery Pagination Controls matching Stitch */}
              <nav aria-label="Pagination Galeri" className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous gallery page"
                  disabled={galleryPage <= 1}
                  onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#444650] hover:text-[#00113a] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  &lt;
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setGalleryPage(page)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${galleryPage === page
                        ? 'bg-[#00113a] text-white'
                        : 'text-[#444650] hover:bg-[#efedf3] hover:text-[#00113a]'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <span className="text-[#757682] text-xs font-bold px-1">...</span>

                <button
                  type="button"
                  aria-label="Next gallery page"
                  disabled={galleryPage >= 5}
                  onClick={() => setGalleryPage((p) => Math.min(5, p + 1))}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#444650] hover:text-[#00113a] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  &gt;
                </button>
              </nav>
            </section>

            {/* Social Sharing Section matching Stitch */}
            <div className="flex flex-col md:flex-row justify-start items-start md:items-end gap-6 pt-6 mb-10 border-t border-[#c5c6d2]">

              {/* Social Sharing Icons matching Stitch exact styling */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-[#1a1b20]">
                  Bagikan :
                </span>

                {/* WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  title="Bagikan ke WhatsApp"
                  aria-label="Share to WhatsApp"
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-md flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg aria-hidden="true" className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  title="Bagikan ke Facebook"
                  aria-label="Share to Facebook"
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-[#1877F2] text-white rounded-md flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg aria-hidden="true" className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    />
                  </svg>
                </button>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title={copiedLink ? 'Tautan berhasil disalin!' : 'Salin Tautan'}
                  aria-label="Copy Link"
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-[#34B7F1] text-white rounded-md flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm relative"
                >
                  {copiedLink ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <LinkIcon className="w-5 h-5 text-white" />
                  )}
                  {copiedLink && (
                    <span className="absolute -top-8 right-0 bg-[#00113a] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-md">
                      Tersalin!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons: Edit Berita & Hapus Berita matching Stitch */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => router.push(`/kabar-kedinasan/berita/${rawId}/edit`)}
                className="px-8 py-3 bg-transparent border border-[#c5c6d2] text-[#1a1b20] font-bold text-sm rounded-md hover:bg-[#efedf3] hover:border-[#00113a] transition-all min-w-[140px] text-center shadow-xs inline-block"
              >
                Edit Berita
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-8 py-3 bg-transparent border border-[#c5c6d2] text-[#1a1b20] hover:text-red-700 hover:border-red-400 font-bold text-sm rounded-md hover:bg-red-50 transition-all min-w-[140px] text-center shadow-xs cursor-pointer"
              >
                Hapus Berita
              </button>
            </div>
          </article>
        )}
      </main>

      {/* Lightbox / Full Photo Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={previewImage}
              alt="Galeri Foto Preview"
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:-right-10 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c5c6d2] animate-fadeIn">
            <h2 className="text-xl font-bold text-[#00113a] mb-2">Hapus Berita Ini?</h2>
            <p className="text-sm text-[#444650] mb-6">
              Apakah Anda yakin ingin menghapus berita &quot;{news?.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteNews}
                className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

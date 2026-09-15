'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  status: 'Terbit' | 'Menunggu';
  authorName?: string;
}

// 6 Curated Mock News with authentic high-resolution Perpusnas & library images
const MOCK_BERITA_6: NewsItem[] = [
  {
    id: 'stitch-1',
    title: 'Minat membaca Warga Indonesia semakin membaik',
    excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku di berbagai daerah mengalami peningkatan signifikan...',
    content: 'Menurut penelitian yang dirilis pada tanggal 19 Agustus 2026, indeks kegemaran membaca masyarakat Indonesia mengalami lonjakan positif. Hal ini didorong oleh peningkatan penetrasi perpustakaan digital, penyediaan pojok baca terpadu di ruang publik, serta optimalisasi layanan perpustakaan berbasis inklusi sosial yang gencar dilaksanakan oleh Perpustakaan Nasional RI bersama seluruh pemangku kepentingan daerah.',
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Humas Perpusnas',
  },
  {
    id: 'stitch-2',
    title: 'Perpustakaan Digital Terpadu Dukung Pembelajaran Jarak Jauh',
    excerpt: 'Integrasi teknologi dalam membaca dokumen digital melalui tablet cerdas semakin memudahkan pemustaka dalam menjangkau koleksi naskah kuno...',
    content: 'Integrasi teknologi dalam membaca dokumen digital melalui tablet dan gawai cerdas semakin memudahkan masyarakat dalam menjangkau koleksi naskah kuno, jurnal penelitian, serta buku teks terakreditasi melalui portal iPusnas dan IOS.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pusat Preservasi',
  },
  {
    id: 'stitch-3',
    title: 'Gedung Layanan Merdeka Selatan Catatkan Rekor Kunjungan Tertinggi',
    excerpt: 'Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian...',
    content: 'Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian hingga mencapai rekor tertinggi pada kuartal ketiga tahun ini.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Biro Hukum & Kerjasama',
  },
  {
    id: 'stitch-4',
    title: 'Diskusi Standardisasi Kurikulum Literasi Informasi Era Modern',
    excerpt: 'Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi...',
    content: 'Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi di era komputasi awan.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Menunggu',
    authorName: 'Pusat Bibliografi',
  },
  {
    id: 'stitch-5',
    title: 'Penataan Rak Buku Tematik dan Sistem Otomasi RFID Terbaru',
    excerpt: 'Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu koleksi...',
    content: 'Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu kembali koleksi referensi.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Direktorat Deposit',
  },
  {
    id: 'stitch-6',
    title: 'Peningkatan Aksesibilitas Fasilitas Inklusi Ramah Disabilitas',
    excerpt: 'Layanan ruang baca lansia dan disabilitas dilengkapi fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra...',
    content: 'Layanan ruang baca lansia dan disabilitas dilengkapi dengan fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra demi pemerataan akses informasi.',
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-08-19',
    status: 'Terbit',
    authorName: 'Layanan Pemustaka',
  },
];

export default function BeritaPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>(MOCK_BERITA_6);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchNews = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/news?q=${encodeURIComponent(q)}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: NewsItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 110) + '...' : ''),
          content: item.body || item.content || '',
          coverImage:
            item.coverImage && !item.coverImage.includes('berita-arsip.webp')
              ? item.coverImage
              : 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
          publishedAt: item.publishedAt || item.createdAt || new Date().toISOString(),
          status: item.status === 'DRAFT' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Humas Perpusnas',
        }));

        if (q.trim()) {
          const allPool = [...formattedApiItems, ...MOCK_BERITA_6];
          const filtered = allPool.filter(
            (item) =>
              item.title.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(q.toLowerCase()) ||
              item.content.toLowerCase().includes(q.toLowerCase()) ||
              (item.authorName && item.authorName.toLowerCase().includes(q.toLowerCase()))
          );
          setNewsList(filtered);
        } else {
          // Combine API items with mock items ensuring all 6 cards are populated
          const combined = [...formattedApiItems];
          for (const mockItem of MOCK_BERITA_6) {
            if (combined.length >= 6) break;
            const alreadyExists = combined.some((c) => c.id === mockItem.id);
            if (!alreadyExists) {
              combined.push(mockItem);
            }
          }
          setNewsList(combined.slice(0, 6));
        }
      })
      .catch((e) => {
        console.error(e);
        if (!newsList || newsList.length === 0) {
          setNewsList(MOCK_BERITA_6);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(searchQuery);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-[#faf8ff] text-[#1a1b20] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Opini */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link href="/kabar-kedinasan" className="hover:text-[#00113a] transition-colors">
            Kabar Kedinasan
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Berita</span>
        </nav>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Header Section matching Opini */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Berita
            </h1>
            <p className="text-base text-[#444650]">
              Deskripsi mengenai halaman berita untuk portal Cakrawala.
            </p>
          </div>

          <Link
            href="/kabar-kedinasan/berita/tambah"
            className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Search Bar matching Opini */}
        <div className="mb-12 max-w-2xl mx-auto flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Berita terkini..."
                className="w-full border border-[#c5c6d2] rounded-lg py-3 px-4 text-base bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-all"
              />
            </div>
            <button
              type="submit"
              aria-label="Cari"
              className="bg-[#e9e7ee] border border-[#c5c6d2] rounded-lg px-4 flex items-center justify-center hover:bg-[#dad9e0] transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-5 h-5 text-[#444650]" />
            </button>
          </form>
        </div>

        {/* Cards Grid: 3 Columns matching Opini */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white animate-pulse h-96" />
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Berita Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau tambahkan berita baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {newsList.map((item) => {
              const displayDate = item.publishedAt ? formatDate(item.publishedAt) : '19 Agustus 2026';
              const isPublished = item.status === 'Terbit' || (item.status as any) === 'PUBLISHED' || !item.status;

              return (
                <article
                  key={item.id}
                  className="bg-white border border-[#c5c6d2] rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group"
                >
                  {/* Card Cover Image */}
                  <div className="w-full h-48 border-b border-[#c5c6d2] overflow-hidden relative shrink-0 bg-slate-100">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Top Metadata Row: Date & Status Badge */}
                      <div className="flex justify-between items-center mb-3 text-sm text-[#444650]">
                        <span className="text-sm text-[#444650]">{displayDate}</span>
                        {isPublished ? (
                          <span className="text-[#1b6d24] font-medium bg-[#a0f399]/40 border border-[#a0f399] px-2 py-1 rounded text-xs">
                            Status: Terbit
                          </span>
                        ) : (
                          <span className="text-[#00113a] font-medium bg-[#dbe1ff] border border-[#b3c5ff] px-2 py-1 rounded text-xs">
                            Status: Menunggu
                          </span>
                        )}
                      </div>

                      {/* Card Title */}
                      <h2 className="text-xl font-semibold text-[#00113a] mb-3 leading-snug line-clamp-2 group-hover:text-[#002366] transition-colors">
                        {item.title}
                      </h2>

                      {/* Card Excerpt */}
                      <p className="text-sm text-[#444650] mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {item.excerpt}
                      </p>
                    </div>

                    {/* Card Bottom Button: Lihat */}
                    <div className="flex justify-end pt-2 mt-auto">
                      <Link
                        href={`/kabar-kedinasan/berita/${item.id}`}
                        className="px-6 py-1.5 bg-[#00113a] hover:bg-[#2a4386] text-white text-xs sm:text-sm font-bold rounded transition-colors shadow-sm inline-block text-center cursor-pointer"
                      >
                        Lihat
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls matching Opini */}
      <div className="flex justify-center items-center gap-2 pt-4 pb-8">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#444650] hover:text-[#00113a] transition-colors disabled:opacity-40 cursor-pointer"
        >
          &lt;
        </button>

        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${
              currentPage === page
                ? 'bg-[#00113a] text-white'
                : 'text-[#444650] hover:bg-[#f4f3f9] hover:text-[#00113a]'
            }`}
          >
            {page}
          </button>
        ))}

        <span className="text-[#757682] text-xs font-bold px-1">...</span>

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= 5}
          onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
          className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#444650] hover:text-[#00113a] transition-colors disabled:opacity-40 cursor-pointer"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

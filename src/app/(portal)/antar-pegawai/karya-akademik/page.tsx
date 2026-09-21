'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  STITCH_MOCK_KARYA_AKADEMIK,
  KaryaAkademikItem,
} from '@/lib/mock-karya-akademik';

const ITEMS_PER_PAGE = 5;

export default function KaryaAkademikPage() {
  const [allItems, setAllItems] = useState<KaryaAkademikItem[]>(STITCH_MOCK_KARYA_AKADEMIK);
  const [filteredItems, setFilteredItems] = useState<KaryaAkademikItem[]>(STITCH_MOCK_KARYA_AKADEMIK);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchKaryaAkademik = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts?category=karya-akademik&q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: KaryaAkademikItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 180) + '...' : ''),
          content: item.body || '',
          coverImage: item.coverImage || '/images/kabar-keluarga/card-1.jpg',
          publishedAt: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '20 Agustus 2026',
          status: item.status === 'MENUNGGU' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Budi Sujatmiko',
          authorPosition: item.author?.profile?.position || 'Pustakawan Ahli',
          authorUnit: item.author?.profile?.unitKerja || 'Perpustakaan Nasional RI',
          attachments: item.attachments || [],
        }));

        // Merge initial mock data with API database items
        const pool = [...STITCH_MOCK_KARYA_AKADEMIK];
        for (const apiItm of formattedApiItems) {
          if (!pool.some((p) => p.id === apiItm.id || p.title === apiItm.title)) {
            pool.unshift(apiItm);
          }
        }

        setAllItems(pool);

        let filtered = pool;
        if (q.trim()) {
          const lowerQ = q.toLowerCase();
          filtered = pool.filter(
            (item) =>
              item.title.toLowerCase().includes(lowerQ) ||
              item.excerpt.toLowerCase().includes(lowerQ) ||
              item.content.toLowerCase().includes(lowerQ) ||
              item.authorName.toLowerCase().includes(lowerQ)
          );
        }

        setFilteredItems(filtered);
        setCurrentPage(1);
      })
      .catch(() => {
        let filtered = STITCH_MOCK_KARYA_AKADEMIK;
        if (q.trim()) {
          const lowerQ = q.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(lowerQ) ||
              item.excerpt.toLowerCase().includes(lowerQ)
          );
        }
        setFilteredItems(filtered);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchKaryaAkademik('');
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    const lowerQ = val.toLowerCase().trim();
    if (!lowerQ) {
      setFilteredItems(allItems);
    } else {
      const filtered = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQ) ||
          item.excerpt.toLowerCase().includes(lowerQ) ||
          item.content.toLowerCase().includes(lowerQ) ||
          item.authorName.toLowerCase().includes(lowerQ)
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchKaryaAkademik(searchQuery);
  };

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const startIndex = ((currentPage - 1) % totalPages) * ITEMS_PER_PAGE;
  const currentCards = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-white text-[#191c1d] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumbs as per Wireframe: Beranda > Antar Pegawai > Karya Akademik */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
          <Link href="/beranda" className="hover:text-[#007BFF] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Antar Pegawai
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-[#00113a]">Karya Akademik</span>
        </nav>

        {/* Top Header Section as per Wireframe */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00113a] tracking-tight">
              Karya Akademik
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              Publikasi ilmiah, riset keperpustakaan, jurnal, dan karya tulis akademik pegawai Perpustakaan Nasional RI.
            </p>
          </div>

          {/* Right Actions: Search Box + Tambah Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input matching Wireframe */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari Karya Akademik..."
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all shadow-2xs"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#007BFF] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* + Tambah Button as per Coretan Opini Style */}
            <Link
              href="/antar-pegawai/karya-akademik/tambah"
              className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </Link>
          </div>
        </div>

        {/* Card List Section matching Wireframe Layout */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#007BFF] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Memuat daftar karya akademik...</p>
          </div>
        ) : currentCards.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Karya Akademik Tidak Ditemukan</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tidak ada publikasi ilmiah yang cocok dengan kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {currentCards.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,51,102,0.06)] group relative overflow-hidden"
              >

                <div className="flex flex-col justify-between gap-3">
                  {/* Judul */}
                  <div>
                    <Link
                      href={`/antar-pegawai/karya-akademik/${item.id}`}
                      className="block group/title"
                    >
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#00113a] group-hover/title:text-[#007BFF] transition-colors leading-snug tracking-tight">
                        {item.title}
                      </h2>
                    </Link>

                    {/* Deskripsi */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
                      {item.excerpt || item.content}
                    </p>
                  </div>

                  {/* Bottom Row: Tanggal on Left, Status & Tombol Lihat on Right as per Wireframe */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/90 mt-1">
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.publishedAt}</span>
                      {item.authorName && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-normal">Oleh {item.authorName}</span>
                        </>
                      )}
                    </div>

                    {/* Right: Status Badge + Tombol Lihat as per Wireframe */}
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${
                          item.status === 'Terbit'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        Status : {item.status}
                      </span>

                      {/* Tombol Lihat with Arrow as per Wireframe */}
                      <Link
                        href={`/antar-pegawai/karya-akademik/${item.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#00113a] hover:bg-[#2a4386] text-white transition-all group/btn cursor-pointer"
                      >
                        <span>Lihat</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white group-hover/btn:translate-x-0.5 transition-all" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pagination matching Coretan Opini */}
      <div className="flex justify-center items-center gap-2 pt-6 pb-8 border-t border-slate-100">
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


'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Quote,
} from 'lucide-react';
import {
  STITCH_MOCK_KALIMAT_BIJAK,
  KalimatBijakItem,
} from '@/lib/mock-kalimat-bijak';

export default function KalimatBijakPage() {
  const [allItems, setAllItems] = useState<KalimatBijakItem[]>(STITCH_MOCK_KALIMAT_BIJAK);
  const [filteredItems, setFilteredItems] = useState<KalimatBijakItem[]>(STITCH_MOCK_KALIMAT_BIJAK);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false);
  const perPageDropdownRef = useRef<HTMLDivElement>(null);

  const fetchKalimatBijak = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts?category=kalimat-bijak&q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: KalimatBijakItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          quote: item.body || item.excerpt || item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 110) + '...' : item.title),
          content: item.body || '',
          figure: item.author?.name || 'Tokoh Bangsa',
          figureDate: '1-06-1945',
          publishedAt: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '20 Agustus 2026',
          status: item.status === 'DRAFT' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Pegawai Perpusnas',
          authorPosition: item.author?.profile?.position || 'Pustakawan Ahli Madya',
        }));

        const pool = [...STITCH_MOCK_KALIMAT_BIJAK];
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
              item.quote.toLowerCase().includes(lowerQ) ||
              item.figure.toLowerCase().includes(lowerQ)
          );
        }

        setFilteredItems(filtered);
        setCurrentPage(1);
      })
      .catch(() => {
        let filtered = STITCH_MOCK_KALIMAT_BIJAK;
        if (q.trim()) {
          const lowerQ = q.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(lowerQ) ||
              item.quote.toLowerCase().includes(lowerQ) ||
              item.figure.toLowerCase().includes(lowerQ)
          );
        }
        setFilteredItems(filtered);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchKalimatBijak('');
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (perPageDropdownRef.current && !perPageDropdownRef.current.contains(e.target as Node)) {
        setIsPerPageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          item.quote.toLowerCase().includes(lowerQ) ||
          item.figure.toLowerCase().includes(lowerQ)
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchKalimatBijak(searchQuery);
  };

  const totalPages = Math.max(5, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCards =
    filteredItems.slice(startIndex, startIndex + itemsPerPage).length > 0
      ? filteredItems.slice(startIndex, startIndex + itemsPerPage)
      : filteredItems.slice(0, itemsPerPage);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-white text-[#191c1d] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumbs matching Wireframe: Beranda > Antar Pegawai > Kalimat Bijak */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
          <Link href="/beranda" className="hover:text-[#007BFF] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/antar-pegawai" className="hover:text-[#007BFF] transition-colors">
            Antar Pegawai
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-[#00113a]">Kalimat Bijak</span>
        </nav>

        {/* Top Header Section matching Wireframe */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00113a] tracking-tight">
              Kalimat Bijak
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              Deskripsi Kalimat Bijak
            </p>
          </div>

          {/* + Tambah Button as per Coretan Opini Style */}
          <Link
            href="/antar-pegawai/kalimat-bijak/tambah"
            className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Search Bar Centered matching Wireframe */}
        <div className="flex justify-center mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari Kalimat Bijak..."
              className="flex-grow border border-slate-300 rounded-lg py-2.5 px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all shadow-2xs"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-4 flex items-center justify-center text-slate-600 hover:text-[#007BFF] transition-colors shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Data Per Page Selector matching Wireframe: Tampilkan [10 v] data */}
        <div className="flex items-center gap-2 mb-8 text-xs sm:text-sm text-slate-600">
          <span>Tampilkan</span>
          <div className="relative" ref={perPageDropdownRef}>
            <button
              type="button"
              onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{itemsPerPage}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isPerPageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 animate-fadeIn">
                {[10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setItemsPerPage(num);
                      setCurrentPage(1);
                      setIsPerPageDropdownOpen(false);
                    }}
                    className={`w-full text-center py-1.5 text-xs hover:bg-blue-50 transition-colors cursor-pointer ${
                      itemsPerPage === num ? 'font-bold text-[#007BFF] bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span>data</span>
        </div>

        {/* 2-Column Grid of Quote Cards strictly matching Wireframe */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#007BFF] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Memuat kalimat bijak...</p>
          </div>
        ) : currentCards.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 my-8">
            <Quote className="w-10 h-10 text-slate-300 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700">Kalimat Bijak Tidak Ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">
              Silakan coba kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {currentCards.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-300 hover:border-[#007BFF]/50 p-6 sm:p-7 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,51,102,0.06)] flex flex-col justify-between min-h-[190px] group"
              >
                {/* Quote Content matching Wireframe ("Deskripsi Kutipan" centered) */}
                <div className="text-center py-4 flex flex-col items-center justify-center flex-grow">
                  <p className="text-sm sm:text-base text-slate-800 font-medium italic leading-relaxed max-w-[420px] mx-auto">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  {/* Figure and Date matching Wireframe ("Soekarno, 1-06-1945") */}
                  <p className="text-xs text-slate-500 mt-3 font-normal">
                    {item.figure}, {item.figureDate}
                  </p>
                </div>

                {/* Bottom Bar matching Wireframe: [Lihat] on left and [Status : Terbit] on right */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                  {/* Tombol Lihat matching Wireframe pill button */}
                  <Link
                    href={`/antar-pegawai/kalimat-bijak/${item.id}`}
                    className="px-5 py-1 rounded-full border border-slate-300 text-slate-700 hover:text-[#007BFF] hover:border-[#007BFF] bg-slate-50 hover:bg-blue-50/60 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    Lihat
                  </Link>

                  {/* Status Badge matching Wireframe pill: Status : Terbit */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-tight border ${
                      item.status === 'Terbit'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-amber-300 bg-amber-50 text-amber-700'
                    }`}
                  >
                    Status : {item.status}
                  </span>
                </div>
              </article>
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

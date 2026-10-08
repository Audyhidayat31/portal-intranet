'use client';

import { Pagination } from '@/components/ui/Pagination';
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
  const [allItems, setAllItems] = useState<KalimatBijakItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KalimatBijakItem[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<KalimatBijakItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch(() => {});
  }, []);

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
          figure: item.title || 'Tokoh Bangsa',
          figureDate: '1-06-1945',
          publishedAt: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '20 Agustus 2026',
          status: item.status === 'MENUNGGU' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
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
    filteredItems.filter(item => filterAuthor === 'all' || (typeof currentUser !== 'undefined' && currentUser && ((item as any).authorName === currentUser.name || ((item as any).author && (item as any).author.name === currentUser.name) || (item as any).name === currentUser.name || (item as any).authorId === currentUser.id))).slice(startIndex, startIndex + itemsPerPage).length > 0
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
          <span>
            Antar Pegawai
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-[#00113a]">Kalimat Bijak</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Kalimat Bijak
            </h1>
            <p className="text-sm sm:text-base text-[#444650]">
              Kutipan inspiratif & motivasi
            </p>
          </div>
          <Link
            href="/antar-pegawai/kalimat-bijak/tambah"
            className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Left: Tampilkan [ 5 v ] data */}
          <div className="flex items-center gap-2 text-sm text-[#1a1b20] shrink-0" ref={perPageDropdownRef}>
            <span className="font-normal text-[#1a1b20]">Tampilkan</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
                className="w-14 bg-[#6c757d] hover:bg-[#5a6268] text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center justify-between shadow-sm transition-colors cursor-pointer"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-3 h-3 text-white" />
              </button>

              {isPerPageDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-14 bg-white border border-[#c5c6d2] rounded-md shadow-lg z-30 py-1 text-center overflow-hidden">
                  {[10, 15, 20].filter((n) => n !== itemsPerPage).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1); // Reset page when changing items per page
                        setIsPerPageDropdownOpen(false);
                      }}
                      className="w-full text-xs py-1 hover:bg-[#efedf3] text-[#1a1b20] transition-colors cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="font-normal text-[#1a1b20]">data</span>
          </div>

          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 flex-grow justify-end w-full md:w-auto">
            {/* Middle: Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex gap-2 w-full md:max-w-2xl flex-grow">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (typeof handleSearchChange === 'function') handleSearchChange(e);
                  }}
                  placeholder="Cari Kalimat Bijak ..."
                  className="w-full border border-[#c5c6d2] rounded-lg py-2 px-4 text-base bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-all"
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

            {/* Right: Filter Penulis */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="font-normal text-sm text-[#1a1b20]">Dibuat Oleh:</span>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className="bg-white border border-[#c5c6d2] rounded-lg px-3 py-2 text-sm text-[#1a1b20] focus:outline-none focus:border-[#00113a] cursor-pointer"
              >
                <option value="all">Semua Orang</option>
                <option value="me">Hanya Saya</option>
              </select>
            </div>
          </div>
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
                <div className="grid grid-cols-3 items-center pt-4 border-t border-slate-100 mt-2">
                  {/* Left Spacer */}
                  <div></div>

                  {/* Tombol Lihat Center */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedQuote(item)}
                      className="px-6 py-1.5 rounded-full bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer inline-block text-center"
                    >
                      Lihat
                    </button>
                  </div>

                  {/* Status Badge Right */}
                  <div className="flex justify-end">
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pagination matching Coretan Opini */}
      <Pagination 
          currentPage={currentPage}
          totalItems={filteredItems.length}
          itemsPerPage={6}
          onPageChange={setCurrentPage}
        />
    
      {/* Modal Detail Kalimat Bijak */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 relative max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col p-8 md:p-12">
            
            {/* Close Button on Top Right */}
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
              aria-label="Tutup popup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Quote Content */}
            <div className="flex-grow flex flex-col items-center justify-center py-10">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1a1b20] text-center leading-relaxed tracking-tight max-w-2xl mx-auto">
                "{selectedQuote.quote.replace(/<[^>]+>/g, '').replace(/^"|"$/g, '')}"
              </p>
              <p className="text-sm md:text-base text-slate-500 mt-6 font-medium text-center">
                {selectedQuote.title}, {selectedQuote.figureDate || '1-06-1945'}
              </p>
            </div>

            {/* Bottom Meta Info */}
            <div className="mt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 pt-6">
              <div className="flex-1 flex flex-col gap-1 border-l-2 border-slate-200 pl-4">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Dibuat oleh</span>
                <span className="text-xs font-bold text-[#1a1b20]">{selectedQuote.authorName || 'Ahmad Fauzi'}</span>
                <span className="text-[11px] text-slate-500">{selectedQuote.publishedAt}</span>
                <span className="text-[11px] text-slate-500">Status: {selectedQuote.status}</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 border-l-2 border-slate-200 pl-4">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Diperbarui oleh</span>
                <span className="text-xs font-bold text-[#1a1b20]">Administrator Perpusnas</span>
                <span className="text-[11px] text-slate-500">{selectedQuote.publishedAt}</span>
                <span className="text-[11px] text-slate-500">Status: {selectedQuote.status}</span>
              </div>
            </div>

          </div>
        </div>
      )}

</div>
  );
}


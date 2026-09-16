'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  RotateCcw,
  FileText,
  ChevronLeft,
  ChevronDown,
} from 'lucide-react';
import {
  ConsultationItem,
  getStoredConsultations,
  saveStoredConsultations,
} from '@/lib/mock-konsultasi';

export default function KonsultasiPage() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load consultations from localStorage / API
  useEffect(() => {
    const localData = getStoredConsultations();
    setConsultations(localData);

    // Also attempt fetching from API
    fetch('/api/consultations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const apiItems: ConsultationItem[] = data.data.map((topic: any) => ({
            id: topic.id,
            title: topic.title,
            category:
              topic.category === 'KEPEGAWAIAN'
                ? 'Pegawai'
                : topic.category === 'IT'
                ? 'IT'
                : 'Kesehatan',
            date: new Date(topic.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            status: topic.status === 'OPEN' ? 'Menunggu' : 'Terbit',
            description: topic.question || topic.description || '',
            attachmentName:
              topic.category === 'IT'
                ? 'Konsultasi IT.pdf'
                : topic.category === 'KEPEGAWAIAN'
                ? 'Konsultasi Pegawai.pdf'
                : 'Konsultasi Kesehatan.pdf',
            attachmentUrl: '#',
            authorName: topic.author?.name || 'Pegawai Perpusnas',
            replies: (topic.replies || []).map((r: any) => ({
              id: r.id,
              authorName: r.author?.name || 'Petugas',
              date: new Date(r.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              content: r.replyText,
            })),
          }));

          // Merge API items with local mock ensuring no duplication
          const existingIds = new Set(apiItems.map((i) => i.id));
          const filteredLocal = localData.filter((i) => !existingIds.has(i.id));
          const combined = [...apiItems, ...filteredLocal];
          setConsultations(combined);
          saveStoredConsultations(combined);
        }
      })
      .catch((err) => {
        console.warn('Consultations API fallback to local data:', err);
      });
  }, []);

  // Filter logic
  const filteredList = useMemo(() => {
    return consultations.filter((item) => {
      const matchSearch =
        !activeSearch.trim() ||
        item.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(activeSearch.toLowerCase()) ||
        (item.authorName &&
          item.authorName.toLowerCase().includes(activeSearch.toLowerCase()));

      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [consultations, activeSearch, selectedCategory]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSelectedCategory('Semua');
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setIsCategoryDropdownOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-[#faf8ff] min-h-[calc(100vh-80px)] text-[#1a1b20]">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 flex flex-col justify-between">
        <div>
          {/* Breadcrumb matching Stitch */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-[#444650] flex items-center gap-2"
          >
            <Link
              href="/beranda"
              className="hover:text-[#00113a] transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4 text-[#757682]" />
            <span>
              Antar Pegawai
            </span>
            <ChevronRight className="w-4 h-4 text-[#757682]" />
            <span className="text-[#00113a] font-semibold">Konsultasi</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
                Konsultasi
              </h1>
              <p className="text-base text-[#444650]">
                Deskripsi mengenai Halaman Konsultasi
              </p>
            </div>

            {/* + Tambah Button */}
            <Link
              href="/antar-pegawai/konsultasi/tambah"
              className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah</span>
            </Link>
          </div>

          {/* Filter Bar matching Wireframe 1 */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center flex-grow bg-white border border-[#c5c6d2] rounded-lg overflow-hidden focus-within:border-[#00113a] transition-colors shadow-2xs"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari konsultasi..."
                className="w-full py-2.5 px-4 text-sm text-[#1a1b20] placeholder-[#757682] outline-none bg-transparent"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="px-3.5 py-2.5 text-[#444650] hover:text-[#00113a] hover:bg-[#f4f3f9] transition-colors border-l border-[#c5c6d2]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Dropdown: Jenis Pilih */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full md:w-44 bg-[#666a73] hover:bg-[#52565e] text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {selectedCategory === 'Semua' ? 'Jenis Pilih' : selectedCategory}
                </span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute right-0 top-12 z-20 w-44 bg-white border border-[#c5c6d2] rounded-lg shadow-lg py-1 text-sm animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('Semua')}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f4f3f9] transition-colors ${
                      selectedCategory === 'Semua'
                        ? 'font-bold text-[#00113a] bg-[#f4f3f9]'
                        : 'text-[#1a1b20]'
                    }`}
                  >
                    Semua Jenis
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('IT')}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f4f3f9] transition-colors ${
                      selectedCategory === 'IT'
                        ? 'font-bold text-[#00113a] bg-[#f4f3f9]'
                        : 'text-[#1a1b20]'
                    }`}
                  >
                    IT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('Kesehatan')}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f4f3f9] transition-colors ${
                      selectedCategory === 'Kesehatan'
                        ? 'font-bold text-[#00113a] bg-[#f4f3f9]'
                        : 'text-[#1a1b20]'
                    }`}
                  >
                    Kesehatan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('Pegawai')}
                    className={`w-full text-left px-4 py-2 hover:bg-[#f4f3f9] transition-colors ${
                      selectedCategory === 'Pegawai'
                        ? 'font-bold text-[#00113a] bg-[#f4f3f9]'
                        : 'text-[#1a1b20]'
                    }`}
                  >
                    Pegawai
                  </button>
                </div>
              )}
            </div>

            {/* Atur Ulang Button */}
            <button
              type="button"
              onClick={handleReset}
              className="bg-[#002366] hover:bg-[#00113a] text-white text-sm font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Atur Ulang</span>
            </button>
          </div>

          {/* Cards List matching Wireframe 1 */}
          <div className="space-y-4 mb-10">
            {displayedItems.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-[#c5c6d2] rounded-xl">
                <p className="text-base font-bold text-[#00113a] mb-1">
                  Tidak Ada Konsultasi Ditemukan
                </p>
                <p className="text-sm text-[#444650] mb-4">
                  Silakan periksa kata kunci atau atur ulang filter pencarian Anda.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0070f3] hover:underline"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Kembalikan Semua Data</span>
                </button>
              </div>
            ) : (
              displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#c5c6d2] rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-4"
                >
                  {/* Top Row: Judul & Category Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/antar-pegawai/konsultasi/${item.id}`}
                      className="text-lg sm:text-xl font-bold text-[#00113a] hover:text-[#0070f3] transition-colors leading-snug"
                    >
                      {item.title}
                    </Link>

                    {/* Category Badge matching wireframe */}
                    <span className="shrink-0 text-xs sm:text-sm font-semibold text-[#1a1b20] border border-[#c5c6d2] px-4 py-1 rounded-full bg-white text-center min-w-[90px]">
                      {item.category}
                    </span>
                  </div>

                  {/* Metadata Row: Date & Status */}
                  <div className="text-xs sm:text-sm text-[#444650] flex items-center gap-2 font-medium">
                    <span>{item.date}</span>
                    <span className="text-[#c5c6d2]">|</span>
                    <span>
                      Status :{' '}
                      <span
                        className={
                          item.status === 'Terbit'
                            ? 'text-[#1b6d24] font-semibold'
                            : 'text-[#d97706] font-semibold'
                        }
                      >
                        {item.status}
                      </span>
                    </span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-sm text-[#444650] leading-relaxed line-clamp-2">
                    <span className="font-semibold text-[#1a1b20]">
                      Keterangan :{' '}
                    </span>
                    {item.description}
                  </p>

                  {/* Bottom Row: Attachment & Lihat Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#f4f3f9]">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#444650]">
                      <FileText className="w-4 h-4 text-[#757682] shrink-0" />
                      <span>
                        Lampiran File :{' '}
                        <span className="text-[#1a1b20] font-medium">
                          {item.attachmentName || 'Konsultasi.pdf'}
                        </span>
                      </span>
                    </div>

                    <Link
                      href={`/antar-pegawai/konsultasi/${item.id}`}
                      className="bg-[#00113a] hover:bg-[#2a4386] text-white text-xs sm:text-sm font-medium px-5 py-1 rounded-full transition-colors self-end sm:self-auto inline-block text-center cursor-pointer"
                    >
                      Lihat
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls matching Coretan Opini */}
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
      </div>
    </div>
  );
}

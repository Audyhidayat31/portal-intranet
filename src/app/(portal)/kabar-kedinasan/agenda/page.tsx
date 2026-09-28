'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  Calendar,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_AGENDAS_6, AgendaItem } from '@/lib/mock-agendas';
import { Pagination } from '@/components/ui/Pagination';

export default function AgendaKegiatanPage() {
  const [agendas, setAgendas] = useState<AgendaItem[]>(STITCH_MOCK_AGENDAS_6);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
        setIsPerPageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const fetchAgendas = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/agendas?q=${encodeURIComponent(q)}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: AgendaItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 120) + '...' : ''),
          content: item.body || item.content || '',
          coverImage: item.coverImage || STITCH_MOCK_AGENDAS_6[0].coverImage,
          publishedAt: item.eventStartDate
            ? formatDate(item.eventStartDate)
            : item.createdAt
              ? formatDate(item.createdAt)
              : '19 Agustus 2026',
          eventStartDate: item.eventStartDate,
          eventLocation: item.eventLocation,
          status: item.status === 'MENUNGGU' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Biro Umum Perpusnas',
        }));

        setAgendas(formattedApiItems);
      })
      .catch((e) => {
        console.error(e);
        setAgendas([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAgendas(searchQuery);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-[#faf8ff] text-[#1a1b20] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Coretan Opini */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span>
            Kabar Kedinasan
          </span>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Agenda Kegiatan</span>
        </nav>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Header Section matching Coretan Opini */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Agenda Kegiatan
            </h1>
            <p className="text-base text-[#444650]">
              Jadwal rakor, diklat, dan acara dinas</p>
          </div>

          <Link
            href="/kabar-kedinasan/agenda/tambah"
            className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Left: Tampilkan [ 9 v ] data */}
          <div className="flex items-center gap-2 text-sm text-[#1a1b20] shrink-0" ref={perPageRef}>
            <span className="font-normal text-[#1a1b20]">Tampilkan</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                className="w-14 bg-[#6c757d] hover:bg-[#5a6268] text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center justify-between shadow-sm transition-colors cursor-pointer"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-3 h-3 text-white" />
              </button>

              {isPerPageOpen && (
                <div className="absolute left-0 top-full mt-1 w-14 bg-white border border-[#c5c6d2] rounded-md shadow-lg z-30 py-1 text-center overflow-hidden">
                  {[9, 18, 27].filter((n) => n !== itemsPerPage).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1); // Reset page when changing items per page
                        setIsPerPageOpen(false);
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

          {/* Right: Search Bar */}
          <div className="flex-1 flex justify-center w-full">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-2xl">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Agenda Kegiatan..."
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
          </div>
          {/* Right: Dummy spacing to balance center */}
          <div className="hidden md:block w-32 shrink-0"></div>
        </div>

        {/* Cards Grid: 3 Columns matching Coretan Opini */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white animate-pulse h-96" />
            ))}
          </div>
        ) : agendas.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <Calendar className="w-12 h-12 text-[#757682] mx-auto mb-3 opacity-60" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Agenda Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau buat agenda kegiatan baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {agendas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => {
              const displayDate = item.publishedAt ? item.publishedAt : '19 Agustus 2026';

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

                  {/* Card Content Body matching Coretan Opini */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Top Metadata Row: Date & Status Badge */}
                      <div className="flex justify-between items-center mb-3 text-sm text-[#444650]">
                        <span className="text-sm text-[#444650]">{displayDate}</span>
                        {item.status === 'Terbit' ? (
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

                    {/* Card Bottom Button: Lihat matching Coretan Opini */}
                    <div className="flex justify-end pt-2 mt-auto">
                      <Link
                        href={`/kabar-kedinasan/agenda/${item.id}`}
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

      {/* Pagination Controls matching Coretan Opini */}
      <Pagination
        currentPage={currentPage}
        totalItems={agendas.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}


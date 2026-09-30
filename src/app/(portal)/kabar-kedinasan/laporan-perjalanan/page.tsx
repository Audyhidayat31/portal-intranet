'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Plane,
  MapPin,
  CheckCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_BUSINESS_TRIPS_5 } from '@/lib/mock-business-trips';
import { Pagination } from '@/components/ui/Pagination';

export default function LaporanPerjalananPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Add Report State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  
  // Dropdown Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(5);
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


  const fetchReports = (q: string = '') => {
    // If searching and no local reports match, show subtle loading
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/business-trips?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        setReports(apiItems.length > 0 ? apiItems : STITCH_MOCK_BUSINESS_TRIPS_5);
      })
      .catch((e) => {
        console.error(e);
        setReports(STITCH_MOCK_BUSINESS_TRIPS_5);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(searchQuery);
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/business-trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          destinationCity: newCity || 'Nasional',
          excerpt: newExcerpt || newContent.slice(0, 140),
          content: newContent,
          attachmentName: newAttachmentName || undefined,
          publishedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Laporan perjalanan dinas baru berhasil disimpan!');
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewCity('');
        setNewExcerpt('');
        setNewContent('');
        setNewAttachmentName('');
        fetchReports('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(data.message || 'Gagal menyimpan laporan perjalanan dinas');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Kabar Kedinasan
          </span>
          <span className="text-[#757682]">&gt;</span>
          <span className="text-[#1a1b20] font-bold">Laporan Perjalanan Dinas</span>
        </nav>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Page Header & Actions matching Stitch */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Laporan Perjalanan Dinas
            </h1>
            <p className="text-sm sm:text-base text-[#444650]">
              Laporan monitoring & supervisi wilayah</p>
            {/* Tampilkan [ 5 v ] data */}
            <div className="flex items-center gap-2 text-sm text-[#1a1b20] shrink-0 mt-4" ref={perPageRef}>
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
                    {[5, 10, 15].filter((n) => n !== itemsPerPage).map((num) => (
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
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Tambah Button */}
            <Link
              href="/kabar-kedinasan/laporan-perjalanan/tambah"
              className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </Link>

            {/* Search Input Bar with embedded search icon matching Stitch */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Laporan ..."
                className="w-full border border-[#757682] rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] bg-white text-[#1a1b20] placeholder-[#757682] shadow-xs transition-colors"
              />
              <button
                type="submit"
                aria-label="Cari Laporan"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00113a] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Content List (5 Distinct Cards) */}
        {isLoading ? (
          <div className="space-y-4 mb-12">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-lg p-6 bg-slate-50 animate-pulse h-32" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <Plane className="w-12 h-12 text-[#757682] mx-auto mb-3 opacity-60" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Laporan Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau buat laporan perjalanan dinas baru.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {reports.filter(item => filterAuthor === 'all' || (typeof currentUser !== 'undefined' && currentUser && ((item as any).authorName === currentUser.name || ((item as any).author && (item as any).author.name === currentUser.name) || (item as any).name === currentUser.name || (item as any).authorId === currentUser.id))).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => {
              const displayDate = item.publishedAt
                ? formatDate(item.publishedAt)
                : '19 Agustus 2026';

              return (
                <div
                  key={item.id}
                  className="border border-[#c5c6d2] rounded-lg p-4 sm:p-6 hover:shadow-md hover:bg-[#f4f3f9] transition-all group flex flex-col md:flex-row gap-4 justify-between items-stretch bg-white"
                >
                  <div className="flex-grow pr-0 md:pr-4 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/kabar-kedinasan/laporan-perjalanan/${item.id}`}
                        className="text-lg sm:text-xl font-bold text-[#002366] group-hover:text-[#00113a] transition-colors mb-2 block leading-snug"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm sm:text-base text-[#444650] mb-3 leading-relaxed">
                        {item.excerpt || item.body?.slice(0, 140) || item.content?.slice(0, 140)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#757682] mt-3">
                      <span>{displayDate}</span>
                      {item.destinationCity && (
                        <>
                          <span>•</span>
                          <span className="text-[#00113a] font-bold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.destinationCity}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 mt-4 md:mt-auto self-end flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${
                        (item.status === 'MENUNGGU' || item.status === 'Menunggu' || item.status === 'DRAFT')
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      Status: {(item.status === 'MENUNGGU' || item.status === 'Menunggu' || item.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                    </span>
                    <Link
                      href={`/kabar-kedinasan/laporan-perjalanan/${item.id}`}
                      className="bg-[#00113a] text-white hover:bg-[#2a4386] font-semibold text-xs py-1.5 px-4 rounded-full transition-all shadow-sm cursor-pointer inline-flex items-center justify-center"
                    >
                      <span>Lihat</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination 
          currentPage={currentPage}
          totalItems={reports.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

      {/* Tambah Laporan Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#00113a]">Tambah Laporan Perjalanan Dinas</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Laporan Perjalanan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul laporan kedinasan..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Kota / Daerah Tujuan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Yogyakarta / Surabaya / Bali"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Ringkasan Eksekutif
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan 1-2 kalimat..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Nama Dokumen Lampiran Laporan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Laporan_Dinas_Surabaya_2026.pdf"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Uraian Hasil Perjalanan Dinas
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan uraian hasil kegiatan, temuan, dan rekomendasi secara lengkap di sini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


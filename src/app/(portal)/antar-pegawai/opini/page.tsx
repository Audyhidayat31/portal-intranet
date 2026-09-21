'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  X,
  Heart,
  MessageSquare,
  Send,
  Calendar,
  User,
  CheckCircle,
  Share2,
  Bookmark,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_OPINI_6, OpiniItem } from '@/lib/mock-opini';

export default function CoretanOpiniPage() {
  const [opiniList, setOpiniList] = useState<OpiniItem[]>(STITCH_MOCK_OPINI_6);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Modal State
  const [selectedOpini, setSelectedOpini] = useState<OpiniItem | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Array<{ name: string; text: string; time: string }> }>({});
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});

  // Add Opini Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newStatus, setNewStatus] = useState<'Terbit' | 'Menunggu'>('Terbit');
  const [newCoverImage, setNewCoverImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchOpini = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts?category=opini&q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: OpiniItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 110) + '...' : ''),
          content: item.body || '',
          coverImage: item.coverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY',
          publishedAt: item.createdAt || new Date().toISOString(),
          status: item.status === 'MENUNGGU' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Pegawai Perpusnas',
        }));

        if (q.trim()) {
          const allPool = [...formattedApiItems, ...STITCH_MOCK_OPINI_6];
          const filtered = allPool.filter(
            (item) =>
              item.title.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(q.toLowerCase()) ||
              item.content.toLowerCase().includes(q.toLowerCase()) ||
              (item.authorName && item.authorName.toLowerCase().includes(q.toLowerCase()))
          );
          setOpiniList(filtered);
        } else {
          // Merge API items with mock items ensuring all 6 cards are shown
          const combined = [...formattedApiItems];
          for (const mockItem of STITCH_MOCK_OPINI_6) {
            if (combined.length >= 6) break;
            const alreadyExists = combined.some((c) => c.id === mockItem.id);
            if (!alreadyExists) {
              combined.push(mockItem);
            }
          }
          setOpiniList(combined.slice(0, 6));
        }
      })
      .catch((e) => {
        console.error(e);
        if (!opiniList || opiniList.length === 0) {
          setOpiniList(STITCH_MOCK_OPINI_6);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOpini();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpini(searchQuery);
  };

  const handleLikeToggle = (id: string) => {
    setIsLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 12) + (isLiked[id] ? -1 : 1),
    }));
  };

  const handleAddComment = (id: string) => {
    if (!newComment.trim()) return;
    const currentComments = comments[id] || [
      { name: 'Drs. Bambang Sudiro', text: 'Tulisan yang sangat mencerahkan dan relevan dengan program literasi kita saat ini.', time: '1 jam yang lalu' },
    ];
    setComments({
      ...comments,
      [id]: [
        ...currentComments,
        { name: 'Anda (Pegawai)', text: newComment.trim(), time: 'Baru saja' },
      ],
    });
    setNewComment('');
  };

  const handleCreateOpini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/employee-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          categorySlug: 'opini',
          body: newContent,
          coverImage: newCoverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Coretan opini baru berhasil disimpan!');
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewCoverImage('');
        fetchOpini('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(data.message || 'Gagal menyimpan opini');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan opini');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-[#faf8ff] text-[#1a1b20] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span>
            Antar Pegawai
          </span>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Coretan Opini</span>
        </nav>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Header Section matching Stitch */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Coretan Opini
            </h1>
            <p className="text-base text-[#444650]">
              Deskripsi mengenai halaman Coretan Opini
            </p>
          </div>

          <Link
            href="/antar-pegawai/opini/tambah"
            className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Search Bar matching Stitch */}
        <div className="mb-12 max-w-2xl mx-auto flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Coretan Opini..."
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

        {/* Cards Grid: 3 Columns, 6 Cards matching Stitch */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white animate-pulse h-96" />
            ))}
          </div>
        ) : opiniList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Coretan Opini Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau buat coretan opini baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {opiniList.map((item) => {
              const displayDate = item.publishedAt ? formatDate(item.publishedAt) : '19 Agustus 2026';

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

                    {/* Card Bottom Button: Lihat */}
                    <div className="flex justify-end pt-2 mt-auto">
                      <Link
                        href={`/antar-pegawai/opini/${item.id}`}
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

      {/* Pagination Controls */}
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

      {/* Modal: Lihat / Baca Opini Lengkap */}
      {selectedOpini && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#e2e3ea] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#757682] font-semibold">
                    {formatDate(selectedOpini.publishedAt)}
                  </span>
                  <span className="text-[#c5c6d2]">•</span>
                  <span className="text-xs text-[#00113a] font-bold">
                    {selectedOpini.authorName || 'Pegawai Perpusnas'}
                  </span>
                  <span className="text-[#c5c6d2]">•</span>
                  {selectedOpini.status === 'Terbit' ? (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#22c55e] text-white">
                      Terbit
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#f4f3f9] text-[#444650] border border-[#c5c6d2]">
                      Menunggu
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#00113a] leading-snug">
                  {selectedOpini.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpini(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Cover */}
            <div className="my-5 rounded-xl overflow-hidden max-h-64 bg-slate-100 border border-[#e2e3ea]">
              <img
                src={selectedOpini.coverImage}
                alt={selectedOpini.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="py-2 text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {selectedOpini.content || selectedOpini.excerpt}
            </div>

            {/* Interactivity: Like & Share */}
            <div className="pt-5 mt-6 border-t border-[#e2e3ea] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleLikeToggle(selectedOpini.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isLiked[selectedOpini.id]
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-[#c5c6d2] text-[#444650] hover:bg-[#f4f3f9]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked[selectedOpini.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likes[selectedOpini.id] || 12} Suka</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Tautan opini berhasil disalin ke papan klip!')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#c5c6d2] text-[#444650] hover:bg-[#f4f3f9] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpini(null)}
                className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1a1b20] text-xs font-bold rounded transition-colors"
              >
                Tutup
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-6 pt-5 border-t border-[#e2e3ea]">
              <h4 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#00113a]" />
                Komentar Rekan Pegawai
              </h4>

              {/* Comment Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis tanggapan atau opini Anda..."
                  className="w-full border border-[#c5c6d2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#00113a]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(selectedOpini.id);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(selectedOpini.id)}
                  className="px-4 py-2 bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>

              {/* Comment List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {(comments[selectedOpini.id] || [
                  { name: 'Drs. Bambang Sudiro', text: 'Tulisan yang sangat mencerahkan dan relevan dengan program literasi kita saat ini.', time: '1 jam yang lalu' },
                ]).map((c, idx) => (
                  <div key={idx} className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e3ea] text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#00113a]">{c.name}</span>
                      <span className="text-[10px] text-[#757682]">{c.time}</span>
                    </div>
                    <p className="text-[#444650]">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Coretan Opini */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#e2e3ea]">
              <h2 className="text-xl font-bold text-[#00113a]">Tambah Coretan Opini</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpini} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Opini <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul pemikiran atau opini Anda..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  URL Gambar Sampul (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newCoverImage}
                  onChange={(e) => setNewCoverImage(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Status Publikasi
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'Terbit' | 'Menunggu')}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] bg-white cursor-pointer"
                >
                  <option value="Terbit">Terbit</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Uraian Isi Opini <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan gagasan, analisis, atau pandangan Anda secara lengkap di sini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#e2e3ea]">
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
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Opini'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


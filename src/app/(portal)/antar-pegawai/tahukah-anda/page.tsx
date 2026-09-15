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
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  STITCH_MOCK_TAHUKAH_ANDA_9,
  TahukahAndaItem,
  getStoredTahukahAnda,
  saveStoredTahukahAnda,
} from '@/lib/mock-tahukah-anda';

export default function DaftarTahukahAndaPage() {
  const [itemList, setItemList] = useState<TahukahAndaItem[]>(STITCH_MOCK_TAHUKAH_ANDA_9);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<TahukahAndaItem | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Array<{ name: string; text: string; time: string }> }>({});
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const fetchTahukahAnda = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    const localStored = getStoredTahukahAnda();

    fetch(`/api/employee-posts?category=tahukah-anda&q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: TahukahAndaItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 140) + '...' : ''),
          content: item.body || '',
          coverImage:
            item.coverImage ||
            'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
          publishedAt: item.createdAt || new Date().toISOString(),
          status: item.status === 'DRAFT' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Budi Sujatmiko',
        }));

        // Pool together local stored items, API items, and base mock 9 items
        const combinedPool = [...formattedApiItems];
        for (const item of localStored) {
          if (!combinedPool.some((c) => c.id === item.id)) {
            combinedPool.push(item);
          }
        }
        for (const item of STITCH_MOCK_TAHUKAH_ANDA_9) {
          if (!combinedPool.some((c) => c.id === item.id)) {
            combinedPool.push(item);
          }
        }

        if (q.trim()) {
          const filtered = combinedPool.filter(
            (item) =>
              item.title.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(q.toLowerCase()) ||
              item.content.toLowerCase().includes(q.toLowerCase()) ||
              (item.authorName && item.authorName.toLowerCase().includes(q.toLowerCase()))
          );
          setItemList(filtered);
        } else {
          // Wireframe specifies 9 items (3x3 grid)
          setItemList(combinedPool.slice(0, 9));
        }
      })
      .catch((e) => {
        console.error(e);
        if (q.trim()) {
          const filtered = localStored.filter(
            (item) =>
              item.title.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(q.toLowerCase())
          );
          setItemList(filtered);
        } else {
          setItemList(localStored.slice(0, 9));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTahukahAnda();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTahukahAnda(searchQuery);
  };

  const handleLikeToggle = (id: string) => {
    setIsLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 24) + (isLiked[id] ? -1 : 1),
    }));
  };

  const handleAddComment = (id: string) => {
    if (!newComment.trim()) return;
    const currentComments = comments[id] || [
      { name: 'Siti Nurhaliza', text: 'Informasi dan trivia yang sangat menarik serta menambah wawasan kepustakaan!', time: '1 jam yang lalu' },
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

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-[#faf8ff] text-[#1a1b20] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch & Wireframe 1 */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link href="/antar-pegawai" className="hover:text-[#00113a] transition-colors">
            Antar Pegawai
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Tahukah Anda</span>
        </nav>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Header Section matching Wireframe 1 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Tahukah Anda
            </h1>
            <p className="text-base text-[#444650]">
              Deskripsi mengenai halaman Tahukah Anda
            </p>
          </div>

          <Link
            href="/antar-pegawai/tahukah-anda/tambah"
            className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Search Bar matching Wireframe 1 (Cari Artikel...) */}
        <div className="mb-12 max-w-2xl mx-auto flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Artikel..."
                className="w-full border border-[#c5c6d2] rounded-lg py-3 px-4 text-base bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-all"
              />
            </div>
            <button
              type="submit"
              aria-label="Cari Artikel"
              className="bg-[#e9e7ee] border border-[#c5c6d2] rounded-lg px-4 flex items-center justify-center hover:bg-[#dad9e0] transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-5 h-5 text-[#444650]" />
            </button>
          </form>
        </div>

        {/* Cards Grid: 3 Columns, 9 Cards matching Wireframe 1 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white animate-pulse h-96" />
            ))}
          </div>
        ) : itemList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Artikel Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau tambahkan artikel Tahukah Anda baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {itemList.map((item) => {
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

                    {/* Card Bottom Button: Lihat matching Wireframe 1 */}
                    <div className="flex justify-end pt-2 mt-auto">
                      <Link
                        href={`/antar-pegawai/tahukah-anda/${item.id}`}
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

      {/* Pagination Controls matching Wireframe 1 & Stitch */}
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

      {/* Detail Modal / Quick View (if triggered) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-[#e2e3ea] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#757682] font-semibold">
                    {formatDate(selectedItem.publishedAt)}
                  </span>
                  <span className="text-[#c5c6d2]">•</span>
                  <span className="text-xs text-[#00113a] font-bold">
                    {selectedItem.authorName || 'Budi Sujatmiko'}
                  </span>
                  <span className="text-[#c5c6d2]">•</span>
                  {selectedItem.status === 'Terbit' ? (
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
                  {selectedItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 rounded-xl overflow-hidden max-h-64 bg-slate-100 border border-[#e2e3ea]">
              <img
                src={selectedItem.coverImage}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="py-2 text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {selectedItem.content || selectedItem.excerpt}
            </div>

            <div className="pt-5 mt-6 border-t border-[#e2e3ea] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleLikeToggle(selectedItem.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isLiked[selectedItem.id]
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-[#c5c6d2] text-[#444650] hover:bg-[#f4f3f9]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked[selectedItem.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likes[selectedItem.id] || 24} Suka</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Tautan artikel berhasil disalin ke papan klip!')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#c5c6d2] text-[#444650] hover:bg-[#f4f3f9] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1a1b20] text-xs font-bold rounded transition-colors"
              >
                Tutup
              </button>
            </div>

            {/* Komentar Section */}
            <div className="mt-6 pt-5 border-t border-[#e2e3ea]">
              <h4 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#00113a]" />
                Komentar Pegawai
              </h4>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis tanggapan atau komentar Anda..."
                  className="w-full border border-[#c5c6d2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#00113a]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(selectedItem.id);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(selectedItem.id)}
                  className="px-4 py-2 bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {(comments[selectedItem.id] || [
                  { name: 'Siti Nurhaliza', text: 'Informasi dan trivia yang sangat menarik serta menambah wawasan kepustakaan!', time: '1 jam yang lalu' },
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
    </div>
  );
}

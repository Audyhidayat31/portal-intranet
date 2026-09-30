'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  Heart,
  MessageSquare,
  Send,
  Calendar,
  User,
  CheckCircle,
  Share2,
  Smile,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_HUMOR_9, HumorItem } from '@/lib/mock-humor';
import { Pagination } from '@/components/ui/Pagination';

export default function HumorPage() {
  const [humorList, setHumorList] = useState<HumorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown Pagination state
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


  // Detail Modal State
  const [selectedHumor, setSelectedHumor] = useState<HumorItem | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Array<{ name: string; text: string; time: string }> }>({});
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchHumor = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts?category=humor&q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: HumorItem[] = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 110) + '...' : ''),
          content: item.body || '',
          coverImage: item.coverImage || STITCH_MOCK_HUMOR_9[0].coverImage,
          publishedAt: item.createdAt || new Date().toISOString(),
          status: item.status === 'MENUNGGU' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Pegawai Perpusnas',
        }));

        if (q.trim()) {
          const allPool = [...formattedApiItems, ...STITCH_MOCK_HUMOR_9];
          const filtered = allPool.filter(
            (item) =>
              item.title.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(q.toLowerCase()) ||
              item.content.toLowerCase().includes(q.toLowerCase()) ||
              (item.authorName && item.authorName.toLowerCase().includes(q.toLowerCase()))
          );
          setHumorList(filtered);
        } else {
          // Merge API items with mock items ensuring all 9 cards shown
          const combined = [...formattedApiItems];
          for (const mockItem of STITCH_MOCK_HUMOR_9) {
            if (combined.length >= 9) break;
            const alreadyExists = combined.some((c) => c.id === mockItem.id);
            if (!alreadyExists) {
              combined.push(mockItem);
            }
          }
          setHumorList(combined.slice(0, 9));
        }
      })
      .catch((e) => {
        console.error(e);
        if (!humorList || humorList.length === 0) {
          setHumorList(STITCH_MOCK_HUMOR_9);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHumor();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHumor(searchQuery);
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
      { name: 'Drs. Bambang Sudiro', text: 'Haha relate sekali dengan kejadian di lantai 4 kemarin!', time: '30 menit yang lalu' },
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
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 bg-white text-[#1a1b20] min-h-[calc(100vh-80px)] flex flex-col justify-between">
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
          <span className="text-[#00113a] font-semibold">Humor</span>
        </nav>

        {/* Page Header matching Stitch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Humor
            </h1>
            <p className="text-sm sm:text-base text-[#444650]">Pojok rileks & cerita santai</p>
          </div>

          <Link
            href="/antar-pegawai/humor/tambah"
            className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </Link>
        </div>

                {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
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
                        setCurrentPage(1);
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

          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 flex-grow justify-end w-full md:w-auto">
            {/* Middle: Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-2xl flex-grow">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Humor..."
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

        {/* Humor Grid: Exactly 9 Cards in 3 Columns matching Stitch */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white animate-pulse h-96" />
            ))}
          </div>
        ) : humorList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <Smile className="w-12 h-12 text-[#757682] mx-auto mb-3 opacity-60" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Cerita Humor Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau buat cerita humor baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {humorList.filter(item => filterAuthor === 'all' || (typeof currentUser !== 'undefined' && currentUser && ((item as any).authorName === currentUser.name || ((item as any).author && (item as any).author.name === currentUser.name) || (item as any).name === currentUser.name || (item as any).authorId === currentUser.id))).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => {
              const displayDate = item.publishedAt ? formatDate(item.publishedAt) : '19 Agustus 2026';

              return (
                <article
                  key={item.id}
                  className="bg-white border border-[#c5c6d2] rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group"
                >
                  {/* Top Cover Image */}
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
                        href={`/antar-pegawai/humor/${item.id}`}
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

      {/* Pagination Controls matching Standard Website Pagination */}
      <Pagination 
          currentPage={currentPage}
          totalItems={humorList.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

      {/* Modal: Baca Cerita Humor Lengkap */}
      {selectedHumor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#e2e3ea] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#757682] font-semibold">
                    {formatDate(selectedHumor.publishedAt)}
                  </span>
                  <span className="text-[#c5c6d2]">•</span>
                  <span className="text-xs text-[#00113a] font-bold">
                    {selectedHumor.authorName || 'Pegawai Perpusnas'}
                  </span>
                  <span className="text-[#c5c6d2]">•</span>
                  {selectedHumor.status === 'Terbit' ? (
                    <span className="text-[#1b6d24] text-[11px] font-bold">
                      Terbit
                    </span>
                  ) : (
                    <span className="text-[#757682] text-[11px] font-bold">
                      Menunggu
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#00113a] leading-snug">
                  {selectedHumor.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHumor(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Cover */}
            <div className="my-5 rounded-xl overflow-hidden max-h-64 bg-slate-100 border border-[#e2e3ea]">
              <img
                src={selectedHumor.coverImage}
                alt={selectedHumor.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="py-2 text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {selectedHumor.content || selectedHumor.excerpt}
            </div>

            {/* Interactivity: Like & Share */}
            <div className="pt-5 mt-6 border-t border-[#e2e3ea] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleLikeToggle(selectedHumor.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isLiked[selectedHumor.id]
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-[#c5c6d2] text-[#444650] hover:bg-[#f4f3f9]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked[selectedHumor.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likes[selectedHumor.id] || 24} Lucu</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Tautan humor berhasil disalin ke papan klip!')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#c5c6d2] text-[#444650] hover:bg-[#f4f3f9] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHumor(null)}
                className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1a1b20] text-xs font-bold rounded transition-colors"
              >
                Tutup
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-6 pt-5 border-t border-[#e2e3ea]">
              <h4 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#00113a]" />
                Tanggapan Rekan Pegawai
              </h4>

              {/* Comment Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis tanggapan atau komentar lucu Anda..."
                  className="w-full border border-[#c5c6d2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#00113a]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(selectedHumor.id);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(selectedHumor.id)}
                  className="px-4 py-2 bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>

              {/* Comment List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {(comments[selectedHumor.id] || [
                  { name: 'Drs. Bambang Sudiro', text: 'Haha relate sekali dengan kejadian di lantai 4 kemarin!', time: '30 menit yang lalu' },
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


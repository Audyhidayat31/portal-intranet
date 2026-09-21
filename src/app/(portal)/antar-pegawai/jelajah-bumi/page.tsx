'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_JELAJAH_BUMI_9, JelajahBumiItem } from '@/lib/mock-jelajah-bumi';

export default function JelajahBumiPage() {
  const [itemsList, setItemsList] = useState<JelajahBumiItem[]>(STITCH_MOCK_JELAJAH_BUMI_9);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJelajahBumi = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts?category=jelajah-bumi&q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        const formattedApiItems: JelajahBumiItem[] = apiItems.map((item: any, idx: number) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || (item.body ? item.body.slice(0, 140) + '...' : ''),
          content: item.body || '',
          coverImage: item.coverImage || `/images/jelajah-bumi/card-${(idx % 9) + 1}.jpg`,
          publishedAt: item.createdAt || '2026-08-19',
          status: item.status === 'MENUNGGU' ? 'Menunggu' : 'Terbit',
          authorName: item.author?.name || 'Pegawai Perpusnas',
          location: 'Indonesia',
        }));

        if (q.trim()) {
          const allPool = [...formattedApiItems, ...STITCH_MOCK_JELAJAH_BUMI_9];
          const filtered = allPool.filter(
            (item) =>
              item.title.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt.toLowerCase().includes(q.toLowerCase()) ||
              item.content.toLowerCase().includes(q.toLowerCase()) ||
              (item.authorName && item.authorName.toLowerCase().includes(q.toLowerCase()))
          );
          setItemsList(filtered);
        } else {
          // Merge API items with mock items ensuring all 9 cards are shown
          const combined = [...formattedApiItems];
          for (const mockItem of STITCH_MOCK_JELAJAH_BUMI_9) {
            if (combined.length >= 9) break;
            const alreadyExists = combined.some((c) => c.id === mockItem.id);
            if (!alreadyExists) {
              combined.push(mockItem);
            }
          }
          setItemsList(combined.slice(0, 9));
        }
      })
      .catch((e) => {
        console.error(e);
        if (!itemsList || itemsList.length === 0) {
          setItemsList(STITCH_MOCK_JELAJAH_BUMI_9);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchJelajahBumi();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJelajahBumi(searchQuery);
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
          <span className="text-[#00113a] font-semibold">Jelajah Bumi</span>
        </nav>

        {/* Header Section matching Stitch */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Jelajah Bumi
            </h1>
            <p className="text-base text-[#444650]">
              Deskripsi mengenai halaman Jelajah Bumi
            </p>
          </div>

          <Link
            href="/antar-pegawai/jelajah-bumi/tambah"
            className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Search Bar matching Stitch */}
        <div className="mb-12 max-w-2xl mx-auto flex gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Jelajah Bumi..."
                className="w-full border border-[#c5c6d2] rounded-lg py-3 px-4 text-base bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-all"
              />
            </div>
            <button
              type="submit"
              aria-label="Cari"
              className="bg-[#e9e7ee] border border-[#c5c6d2] rounded-lg px-4 flex items-center justify-center hover:bg-[#dad9e0] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5 text-[#444650]" />
            </button>
          </form>
        </div>

        {/* Grid of Cards: Exactly 9 Cards in 3 Columns matching Stitch */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white animate-pulse h-96"
              />
            ))}
          </div>
        ) : itemsList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <Globe className="w-12 h-12 text-[#757682] mx-auto mb-3 opacity-60" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Data Jelajah Bumi Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau buat catatan Jelajah Bumi baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {itemsList.map((item) => {
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
                        href={`/antar-pegawai/jelajah-bumi/${item.id}`}
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
      </div>
    </div>
  );
}


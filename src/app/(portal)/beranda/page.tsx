'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Newspaper,
  MessageSquare,
  Lightbulb,
  User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BerandaPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/homepage/summary').then((res) => res.json()),
      fetch('/api/auth/me').then((res) => res.json()),
    ])
      .then(([homeRes, authRes]) => {
        if (homeRes.success) setData(homeRes.data);
        if (authRes.success) setUserSession(authRes.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 space-y-12 animate-pulse">
        <div className="h-40 rounded-xl bg-slate-200" />
        <div className="h-28 rounded-xl bg-slate-200" />
        <div className="h-64 rounded-xl bg-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 rounded-xl bg-slate-200" />
          <div className="h-80 rounded-xl bg-slate-200" />
          <div className="h-80 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const { setting, latestNews, latestPosts, spotlightFigure, birthdaysThisMonth } = data || {};

  // Mock fallbacks exactly matching Stitch Screen design
  const newsList = latestNews && latestNews.length > 0 ? latestNews.slice(0, 3) : [
    {
      id: '1',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku...',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYiVIlTvlHWCZXsVWN5BKuXNUOFuVWmKl4EtLECjpaOy9dESc-3QPJSVJp5bXmxWHAow1d7ZRMI2LYZ5tJGkKcpz5-yH5kqvgRBImJwBq_iPLpDXPrffOSljK8yNGkVvtipwLYF0otGU56r_SjT5AXkGqMt713QDk_R1omHKPbPeDubgX7UWOLW_cpHkr6M-H7MhReBGdqjdui0kAAPiGWQWyZUqOTWsLnPHseHwN3rkEYjBhOFgaw',
      publishedAt: '2026-08-19',
    },
    {
      id: '2',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku...',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt5lBUWzhdVxrkyuiafB82wFLsq84XIOyegYfJrMcVB-gfdH9EyMg8wwKSwC0zseXJNUtgoMWG8uyFftr_pN9HUlybMmPppNL07GbZ3GoRf4alC8Sv281OsX-smoOTDl-sz2ftmhsCo0xEZS-pCJXkakqQ_w_OT1dLiUlBVndD4ZxIA-f5B1BXe3Ecb1mDnt3GS_3SUDJBhI5kaLkHiS4MT1CVxIFTe4VP6TBeBYr62-9ozimVWd70',
      publishedAt: '2026-08-19',
    },
    {
      id: '3',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      excerpt: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku...',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtvt3SrRcH9vLeIKQjXR-13wmcqrCgl1s9ZzxYkGRgWam6JRAfyfFqOPn3G1BD2GuaaYYiMyp7lCmPCKTE9F0mp9Qbf-S2E3eRqaBFaVr2MKtga9XQlMcL4ls-YdE8-Yyh-bnywt0zaTMOYC5EI2w-Z5fwTsHeRqsUKw1FzbRZILddR1ohK6xzRx0FNIjgimQnjtTfMY2FWHZEV9iHu7C4MLXo0pbcObDK3Tah6nDDOD82f_b2MCmL',
      publishedAt: '2026-08-19',
    },
  ];

  const postsList = latestPosts && latestPosts.length > 0 ? latestPosts.slice(0, 3) : [
    {
      id: 'p1',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      content: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku...',
      category: 'HUMOR',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFmsQV5G444GOPEiBQmUDg0EimQGDtFLEcXXq5P1w9-nKwv4eWjePtkY-kW_EvS0EetnaQGSU--yGWdZF3CZERlTmj1GFqNxK8B_PHsuwYdaOWICZvAnLMOS6URsSZ9SATrogeMiqUHWbL5cHfXooB8QjBhQAqROIJGSe-FJf--DtPm7aLl-zxiBFZplX3DNjacuoYeURqvdKXrhE-6ZiHvKC52-ftmKi6hXXJxVGHey1gRcEDDp6d',
      createdAt: '2026-08-19',
    },
    {
      id: 'p2',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      content: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku...',
      category: 'HUMOR',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9bzcndqYsDsEmRnwkxthuLGjFNPN9JOJtvc1Nge6Df9GjOv30GrDKbn3CyXV-qUiwLvWwIsQhdahF_pOOgi7BAtzJCIrBzc_5BwqrOVdlJjIb72GOXgB6HlhvLvHoxqhndqzIu4Gr_tCShorbnvGYNF6OI8vb9XyWFekAB1EuZzPPCfRIMqi4Iw6tJsn7iJj729H_LvafPLyLu2tOhzya8gPDF2aqFucSYmJNh94lJ39sGwu2nnQE',
      createdAt: '2026-08-19',
    },
    {
      id: 'p3',
      title: 'Minat membaca Warga Indonesia semakin membaik',
      content: 'Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku...',
      category: 'HUMOR',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGRNk0oza_46EDS_OJlfiAY8kuwEDe380BVQyO6-tzN1j-8kr9EXDOHLqJexHh153m5oeAZYf3P_M2lUfvhZEWmUCzh13D7IkEoO1TJqzaje_qVF5ocpSXph3sbNtW9-oXUAuM5gVrOQxEsguu_g0HAQWhEjmLHcHoBzmD9UPl815ID6sJZvRqht91ubgXw7JiLxWvUgK2_KH683-p3KxNYufCJtjL9bDUllPT05Cg1jKf5Jtkivat',
      createdAt: '2026-08-19',
    },
  ];

  const birthdays = birthdaysThisMonth && birthdaysThisMonth.length > 0 ? birthdaysThisMonth.slice(0, 4) : [
    { id: 'b1', fullName: 'Nama' },
    { id: 'b2', fullName: 'Nama' },
    { id: 'b3', fullName: 'Nama' },
    { id: 'b4', fullName: 'Nama' },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 flex flex-col gap-12 md:gap-16 bg-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 pt-4 sm:pt-6">
        <div className="flex-1 space-y-4 sm:space-y-5 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#00113a] tracking-tight">
            Halo, {userSession?.name || 'Budi Santoso'}!
          </h1>
          <p className="text-sm sm:text-base text-[#444650] max-w-2xl leading-relaxed">
            Selamat datang di Portal Intranet Perpustakaan Nasional Republik Indonesia. Akses informasi terkini, kelola data kepegawaian, dan terhubung dengan rekan kerja Anda dalam satu platform terintegrasi.
          </p>
          <div className="pt-2">
            <Link
              href="/kabar-kedinasan/pengumuman"
              className="inline-flex items-center bg-[#00113a] text-white font-bold py-2.5 px-6 rounded-md hover:bg-[#2a4386] transition-colors shadow-sm text-sm"
            >
              Lihat Pengumuman
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border border-[#c5c6d2] rounded-xl p-4 sm:p-6 bg-white shadow-sm flex flex-wrap md:flex-nowrap divide-y md:divide-y-0 md:divide-x divide-[#c5c6d2]">
        <div className="w-full sm:w-1/2 md:w-1/4 p-4 flex flex-col items-center justify-center text-center gap-2">
          <Users className="w-8 h-8 text-[#00113a]" />
          <h3 className="text-2xl font-bold text-[#00113a]">120.000+</h3>
          <p className="text-xs text-[#444650]">Jumlah Pegawai Tergabung</p>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 p-4 flex flex-col items-center justify-center text-center gap-2">
          <Newspaper className="w-8 h-8 text-[#00113a]" />
          <h3 className="text-2xl font-bold text-[#00113a]">25.000+</h3>
          <p className="text-xs text-[#444650]">Info Berita</p>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 p-4 flex flex-col items-center justify-center text-center gap-2">
          <MessageSquare className="w-8 h-8 text-[#00113a]" />
          <h3 className="text-2xl font-bold text-[#00113a]">3.500+</h3>
          <p className="text-xs text-[#444650]">Coretan Opini</p>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4 p-4 flex flex-col items-center justify-center text-center gap-2">
          <Lightbulb className="w-8 h-8 text-[#00113a]" />
          <h3 className="text-2xl font-bold text-[#00113a]">1.200+</h3>
          <p className="text-xs text-[#444650]">Tips dan Trik</p>
        </div>
      </section>

      {/* Kupas Sosok Section */}
      <section className="bg-[#f4f3f9] rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-[#e3e2e8]">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-xl border border-[#c5c6d2] bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {spotlightFigure?.avatarUrl ? (
              <img
                src={spotlightFigure.avatarUrl}
                alt={spotlightFigure.name || 'Tokoh Perpusnas'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 sm:w-28 sm:h-28 text-[#c5c6d2] stroke-[1]" />
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-4 text-left">
          <h2 className="text-lg sm:text-xl font-bold text-[#00113a]">Kupas Sosok</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1b20] uppercase tracking-wide leading-snug">
            {spotlightFigure?.title || 'JNB TAIRAS : PEJUANG PUSTAKAWAN'}
          </h3>
          <p className="text-sm sm:text-base text-[#444650] leading-relaxed">
            {spotlightFigure?.bio ||
              'Jon Ngion Benyamin Tairas, atau lebih dikenal dengan inisial JNB. Tairas dalam kurun waktu yang tidak pendek, lebih dari 50 tahun mengabdikan seluruh hidupnya di dunia kepustakawanan.'}
          </p>
          <div className="pt-2">
            <Link
              href="/kupas-sosok"
              className="inline-flex items-center bg-[#007BFF] text-white font-bold py-2.5 px-6 rounded-md hover:bg-[#0056b3] transition-colors shadow-sm text-sm"
            >
              Lihat Sosok Lainnya &gt;&gt;
            </Link>
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#c5c6d2] pb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00113a]">Berita</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {newsList.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white shadow-sm flex flex-col group cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-[#e3e2e8] w-full relative overflow-hidden">
                <img
                  src={item.coverImage || '/images/berita-arsip.webp'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <span className="font-bold text-[10px] text-[#757682] mb-1.5 block">
                    {item.publishedAt ? formatDate(item.publishedAt) : '19 Agustus 2026'}
                  </span>
                  <h3 className="text-base font-bold text-[#00113a] mb-2 line-clamp-2 group-hover:text-[#1b6d24] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#444650] line-clamp-2 mb-4 leading-relaxed">
                    {item.excerpt || item.content?.slice(0, 120)}
                  </p>
                </div>
                <div className="flex justify-end mt-auto pt-2">
                  <Link
                    href={item.slug ? `/kabar-kedinasan/berita#${item.slug}` : '/kabar-kedinasan/berita'}
                    className="bg-[#00113a] text-white font-bold text-xs px-4 py-1.5 rounded-md hover:bg-[#2a4386] transition-colors shadow-sm"
                  >
                    Lihat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-2">
          <Link
            href="/kabar-kedinasan/berita"
            className="inline-flex items-center bg-[#007BFF] text-white font-bold py-2.5 px-6 rounded-md hover:bg-[#0056b3] transition-colors shadow-sm text-sm"
          >
            Lihat Semua Berita
          </Link>
        </div>
      </section>

      {/* Antar Pegawai Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#c5c6d2] pb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00113a]">Antar Pegawai</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {postsList.map((post: any, idx: number) => (
            <div
              key={post.id || idx}
              className="border border-[#c5c6d2] rounded-xl overflow-hidden bg-white shadow-sm flex flex-col group cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-[#e3e2e8] w-full relative overflow-hidden">
                <img
                  src={post.coverImage || '/images/hero-illustration.webp'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 left-4 bg-white border border-[#c5c6d2] text-[#1b6d24] font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider rounded shadow-sm">
                  {post.category || 'HUMOR'}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <span className="font-bold text-[10px] text-[#757682] mb-1.5 block">
                    {post.createdAt ? formatDate(post.createdAt) : '19 Agustus 2026'}
                  </span>
                  <h3 className="text-base font-bold text-[#00113a] mb-2 line-clamp-2 group-hover:text-[#1b6d24] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#444650] line-clamp-2 mb-4 leading-relaxed">
                    {post.content || post.excerpt}
                  </p>
                </div>
                <div className="flex justify-end mt-auto pt-2">
                  <span>
                    Lihat
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kalimat Bijak Section */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#00113a]">Kalimat Bijak</h2>
        <div className="border border-[#c5c6d2] rounded-xl p-8 md:p-12 bg-white text-center shadow-sm">
          <p className="text-base sm:text-lg text-[#1a1b20] italic mb-4 max-w-3xl mx-auto leading-relaxed">
            "{setting?.quoteText || 'Esensi Menjadi manusia adalah ketika seseorang tidak hanya mencari kesempurnaan'}"
          </p>
          <p className="font-bold text-xs sm:text-sm text-[#444650]">
            {setting?.quoteAuthor || 'George Orwell (1903-1950) novelis asal Inggris'}
          </p>
        </div>
      </section>

      {/* Selamat Ulang Tahun Section */}
      <section className="bg-[#f4f3f9] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center border border-[#e3e2e8]">
        <div className="w-full lg:w-1/3 space-y-3 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00113a]">
            {setting?.heroTitle && !setting.heroTitle.includes('Selamat Datang') ? setting.heroTitle : 'Selamat Ulang Tahun'}
          </h2>
          <p className="text-xs sm:text-sm text-[#444650] leading-relaxed">
            {setting?.heroSubtitle && !setting.heroSubtitle.includes('Satu pintu akses') && !setting.heroSubtitle.includes('Pusat Informasi')
              ? setting.heroSubtitle
              : 'Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia. Semoga selalu dianugerahi kesehatan, kebahagiaan, kelancaran, serta kesuksesan dalam setiap karya.'}
          </p>
        </div>
        <div className="w-full lg:w-2/3 flex overflow-x-auto gap-4 pb-2">
          {birthdays.map((emp: any, idx: number) => (
            <div
              key={emp.id || idx}
              className="shrink-0 w-28 h-36 border border-[#c5c6d2] rounded-xl bg-white p-3 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow gap-2"
            >
              <div className="w-16 h-16 border border-[#c5c6d2] rounded-full flex items-center justify-center text-[#444650] overflow-hidden bg-[#f4f3f9]">
                {emp.avatarUrl ? (
                  <img src={emp.avatarUrl} alt={emp.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#757682] stroke-[1.5]" />
                )}
              </div>
              <p className="font-bold text-xs text-[#1a1b20] truncate w-full" title={emp.fullName || 'Nama'}>
                {emp.fullName || 'Nama'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

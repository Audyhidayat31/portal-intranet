'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Search,
  Newspaper,
  Megaphone,
  Calendar,
  Plane,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_MENU_ITEMS } from '@/components/admin/AdminNavbar';

export interface UserSession {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  position?: string;
  unitKerja?: string;
}

export function PortalNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentUser(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/kabar-kedinasan/berita?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-white border-b border-[#c5c6d2] shadow-sm">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 max-w-[1280px] mx-auto h-20">
          {/* Brand Logo & Name */}
          <Link href="/beranda" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#f4f3f9] border border-[#c5c6d2] flex items-center justify-center p-1.5 shrink-0">
              <img
                src="/images/logo-perpusnas.png"
                alt="Perpusnas Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#00113a] leading-tight">Cakrawala</span>
              <span className="text-[10px] sm:text-[11px] text-[#444650] leading-tight font-medium">
                Portal Intranet<br />Perpustakaan Nasional
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {/* Beranda */}
            <Link
              href="/beranda"
              className={cn(
                'text-sm font-bold transition-all duration-200 pb-1',
                pathname === '/beranda'
                  ? 'text-[#00113a] border-b-2 border-[#00113a]'
                  : 'text-[#444650] hover:text-[#00113a]'
              )}
            >
              Beranda
            </Link>

            {/* Tentang */}
            <Link
              href="/tentang"
              className={cn(
                'text-sm font-bold transition-all duration-200 pb-1',
                pathname.startsWith('/tentang')
                  ? 'text-[#00113a] border-b-2 border-[#00113a]'
                  : 'text-[#444650] hover:text-[#00113a]'
              )}
            >
              Tentang
            </Link>

            {/* Kabar Kedinasan Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('Kabar Kedinasan')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'Kabar Kedinasan' ? null : 'Kabar Kedinasan')}
                className={cn(
                  'flex items-center gap-1 text-sm font-bold transition-all duration-200 pb-1',
                  pathname.startsWith('/kabar-kedinasan')
                    ? 'text-[#00113a] border-b-2 border-[#00113a]'
                    : 'text-[#444650] hover:text-[#00113a]'
                )}
              >
                Kabar Kedinasan
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {activeDropdown === 'Kabar Kedinasan' && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-white p-2 shadow-xl border border-slate-100 animate-fadeIn z-50">
                  <Link
                    href="/kabar-kedinasan/berita"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#00113a] transition-colors"
                  >
                    <p className="text-xs font-bold">Berita Kedinasan</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Warta resmi kegiatan Perpusnas RI</p>
                  </Link>
                  <Link
                    href="/kabar-kedinasan/pengumuman"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#00113a] transition-colors"
                  >
                    <p className="text-xs font-bold">Pengumuman Resmi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Surat edaran, cuti, dan arahan pimpinan</p>
                  </Link>
                  <Link
                    href="/kabar-kedinasan/agenda"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#00113a] transition-colors"
                  >
                    <p className="text-xs font-bold">Agenda Kegiatan</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Jadwal rakor, diklat, dan acara dinas</p>
                  </Link>
                  <Link
                    href="/kabar-kedinasan/laporan-perjalanan"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#00113a] transition-colors"
                  >
                    <p className="text-xs font-bold">Laporan Perjalanan Dinas</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Laporan monitoring & supervisi wilayah</p>
                  </Link>
                  <Link
                    href="/kabar-kedinasan/dokumen-intern"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#00113a] transition-colors"
                  >
                    <p className="text-xs font-bold">Dokumen Intern</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">SOP, pedoman kerja, dan regulasi internal</p>
                  </Link>
                </div>
              )}
            </div>

            {/* Antar Pegawai Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('Antar Pegawai')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'Antar Pegawai' ? null : 'Antar Pegawai')}
                className={cn(
                  'flex items-center gap-1 text-sm font-bold transition-all duration-200 pb-1',
                  pathname.startsWith('/antar-pegawai')
                    ? 'text-[#00113a] border-b-2 border-[#00113a]'
                    : 'text-[#444650] hover:text-[#00113a]'
                )}
              >
                Antar Pegawai
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {activeDropdown === 'Antar Pegawai' && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-white p-2 shadow-xl border border-slate-100 animate-fadeIn z-50 max-h-[380px] overflow-y-auto">
                  {[
                    { label: 'Daftar Pegawai', href: '/antar-pegawai/daftar-pegawai', desc: 'Direktori data & kontak pegawai' },
                    { label: 'Coretan Opini', href: '/antar-pegawai/opini', desc: 'Gagasan & pemikiran pegawai' },
                    { label: 'Humor Pegawai', href: '/antar-pegawai/humor', desc: 'Pojok rileks & cerita santai' },
                    { label: 'Jelajah Bumi', href: '/antar-pegawai/jelajah-bumi', desc: 'Catatan perjalanan wisata & budaya' },
                    { label: 'Kabar Keluarga', href: '/antar-pegawai/kabar-keluarga', desc: 'Warta suka & duka keluarga Perpusnas' },
                    { label: 'Kalimat Bijak', href: '/antar-pegawai/kalimat-bijak', desc: 'Kutipan inspiratif & motivasi' },
                    { label: 'Karya Akademik', href: '/antar-pegawai/karya-akademik', desc: 'Jurnal, riset, dan karya ilmiah' },
                    { label: 'Tips & Gaya Hidup', href: '/antar-pegawai/tips-gaya-hidup', desc: 'Kesehatan, ergonomis & hobi' },
                    { label: 'Layanan Konsultasi', href: '/antar-pegawai/konsultasi', desc: 'Tanya jawab Kepegawaian, IT, Kesehatan' },
                    { label: 'Komunitas Olahraga', href: '/antar-pegawai/olahraga', desc: 'Jadwal latihan & klub olahraga' },
                    { label: 'Tahukah Anda', href: '/antar-pegawai/tahukah-anda', desc: 'Trivia & fakta unik perpustakaan' },
                  ].map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#00113a] transition-colors"
                    >
                      <p className="text-xs font-bold">{sub.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{sub.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Kupas Sosok */}
            <Link
              href="/kupas-sosok"
              className={cn(
                'text-sm font-bold transition-all duration-200 pb-1',
                pathname.startsWith('/kupas-sosok') && !pathname.startsWith('/admin')
                  ? 'text-[#00113a] border-b-2 border-[#00113a]'
                  : 'text-[#444650] hover:text-[#00113a]'
              )}
            >
              Kupas Sosok
            </Link>

            {/* Kelola Admin Dropdown (Visible for Administrators) */}
            {currentUser?.role === 'ADMINISTRATOR' && (
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown('Kelola Admin')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    'flex items-center gap-1 text-sm font-bold transition-all duration-200 pb-1',
                    pathname.startsWith('/admin')
                      ? 'text-[#00113a] border-b-2 border-[#00113a]'
                      : 'text-[#444650] hover:text-[#00113a]'
                  )}
                >
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>Kelola Admin</span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </Link>

                {activeDropdown === 'Kelola Admin' && (
                  <div className="absolute top-full right-0 lg:left-0 mt-1 w-72 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 animate-fadeIn z-50">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Menu Kelola Admin
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        Admin Mode
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      {ADMIN_MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className={cn(
                              'flex items-start gap-3 p-2 rounded-xl transition-colors',
                              isActive
                                ? 'bg-[#00113a]/5 text-[#00113a] font-bold'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#00113a]'
                            )}
                          >
                            <div className={cn(
                              'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                              isActive ? 'bg-[#00113a] text-white' : 'bg-slate-100 text-slate-600'
                            )}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-left">
                              <p className={cn('text-xs leading-tight', isActive ? 'font-bold text-[#00113a]' : 'font-semibold text-slate-800')}>
                                {item.label}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile / Trailing Action Box (Matches Stitch Design) */}
          <div className="flex items-center gap-3 border border-[#c5c6d2] rounded-lg p-1.5 px-3 bg-[#f4f3f9] hover:bg-[#e9e7ee] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#c5c6d2] overflow-hidden flex items-center justify-center shrink-0">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-[#444650]" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-bold text-xs text-[#1a1b20] truncate max-w-[130px]" title={currentUser?.name || 'Budi Santoso'}>
                {currentUser?.name || '[Nama User]'}
              </p>
              <div className="flex gap-2 text-[10px]">
                <Link href="/profil/akun" className="text-[#002366] font-semibold hover:underline">
                  Profil
                </Link>
                <button onClick={handleLogout} className="text-[#ba1a1a] font-semibold hover:underline">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center ml-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#c5c6d2] bg-white p-4 space-y-3">
            <Link
              href="/beranda"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-sm text-[#00113a] py-1.5"
            >
              Beranda
            </Link>
            <Link
              href="/tentang"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-sm text-[#444650] py-1.5"
            >
              Tentang
            </Link>
            <Link
              href="/kabar-kedinasan/berita"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-sm text-[#444650] py-1.5"
            >
              Kabar Kedinasan
            </Link>
            <Link
              href="/antar-pegawai"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-sm text-[#444650] py-1.5"
            >
              Antar Pegawai
            </Link>
            <Link
              href="/kupas-sosok"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-sm text-[#444650] py-1.5"
            >
              Kupas Sosok
            </Link>

            {currentUser?.role === 'ADMINISTRATOR' && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-[#00113a] uppercase tracking-wider mb-2">
                  Kelola Admin
                </p>
                <div className="space-y-1 pl-2">
                  {ADMIN_MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-medium',
                          isActive ? 'bg-[#00113a] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/profil/akun"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-bold text-[#002366]"
              >
                Profil Saya
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs font-bold text-[#ba1a1a]"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

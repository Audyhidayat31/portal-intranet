'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || data.data.role !== 'ADMINISTRATOR') {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      })
      .catch(() => {
        setIsAuthorized(false);
      });
  }, []);

  const getBreadcrumbPageTitle = (path: string) => {
    if (path.startsWith('/admin/dashboard')) return 'Dashboard Admin';
    if (path.startsWith('/admin/pengguna')) return 'Kelola Pengguna';
    if (path.startsWith('/admin/hak-akses')) return 'Kelola Hak Akses';
    if (path.startsWith('/admin/kabar-kedinasan')) return 'Kabar Kedinasan';
    if (path.startsWith('/admin/antar-pegawai')) return 'Antar Pegawai';
    if (path.startsWith('/admin/kupas-sosok')) return 'Kupas Sosok';
    if (path.startsWith('/admin/log-aktivitas')) return 'Log Aktivitas';
    return 'Panel Pengelolaan';
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-[#00113a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00113a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
            Memverifikasi Hak Akses Administrator...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Akses Dibatasi (403 Forbidden)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Halaman ini khusus untuk Administrator Sistem Perpustakaan Nasional RI. Akun Anda tidak memiliki izin untuk mengelola panel ini.
          </p>
          <div className="pt-2 flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => router.push('/beranda')}>
              Kembali ke Beranda
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/login')}>
              Login Akun Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Navigation Bar (Wireframe Header) */}
      <AdminNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Breadcrumb for admin subpages that do not render it within their page body */}
        {pathname !== '/admin/homepage' && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
              Beranda
            </Link>
            <span>&gt;</span>
            <span>
              Kelola Admin
            </span>
            <span>&gt;</span>
            <span className="text-[#00113a] font-bold">{getBreadcrumbPageTitle(pathname)}</span>
          </nav>
        )}

        {children}
      </main>

      {/* Wireframe Footer */}
      <footer className="w-full bg-[#f8f9fa] border-t border-[#e3e2e8] py-6 text-center text-xs text-slate-600 mt-auto">
        <p>© Copyright 2026, All Rights Reserved | Perpustakaan Nasional RI.</p>
      </footer>
    </div>
  );
}

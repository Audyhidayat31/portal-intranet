'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  MessageSquare,
  Calendar,
  History,
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-white rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-white rounded-xl animate-pulse" />
          <div className="h-28 bg-white rounded-xl animate-pulse" />
          <div className="h-28 bg-white rounded-xl animate-pulse" />
          <div className="h-28 bg-white rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const { stats, recentLogs, recentContents } = data || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-perpusnas-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold border border-gold-500/30">
            <Shield className="w-3.5 h-3.5" /> Pusat Kendali Administrator
          </div>

          <div className="flex items-center gap-3.5 pt-0.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
              <span className="animate-wave">👋</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gold-400 tracking-wide leading-tight">
                Halo,
              </p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Administrator!
              </h1>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Kelola data pengguna, hak akses, tata letak homepage, publikasi konten kedinasan, dan pantau log aktivitas sistem.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/kabar-kedinasan">
            <Button variant="gold" size="sm" className="font-bold">
              <PlusCircle className="w-4 h-4" /> Buat Berita / Dokumen
            </Button>
          </Link>
          <Link href="/admin/pengguna">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Users className="w-4 h-4" /> Kelola Pengguna
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Akun Terdaftar</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Konten Kedinasan Aktif</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalContents || 0}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Postingan Antar Pegawai</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalPosts || 0}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Agenda Terjadwal</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalAgendas || 0}</h3>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Logs & Recent Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Audit Logs */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-perpusnas-800" />
              <h2 className="text-base font-bold text-slate-900">Aktivitas Sistem Terbaru</h2>
            </div>
            <Link href="/admin/log-aktivitas" className="text-xs font-bold text-perpusnas-700 hover:underline">
              Semua Log →
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs?.map((log: any) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant={log.action === 'CREATE' ? 'success' : log.action === 'DELETE' ? 'danger' : 'primary'} size="sm">
                    {log.action} • {log.module}
                  </Badge>
                  <span className="text-[10px] text-slate-400">{formatRelativeTime(log.createdAt)}</span>
                </div>
                <p className="text-slate-800 font-medium">{log.description}</p>
                <p className="text-[10px] text-slate-400 font-mono">Pelaku: {log.user?.name || 'Sistem'} (IP: {log.ipAddress})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contents */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-600" />
              <h2 className="text-base font-bold text-slate-900">Konten Publikasi Terakhir</h2>
            </div>
            <Link href="/admin/kabar-kedinasan" className="text-xs font-bold text-perpusnas-700 hover:underline">
              Kelola Konten →
            </Link>
          </div>

          <div className="space-y-3">
            {recentContents?.map((c: any) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5 max-w-[80%]">
                  <Badge variant="primary" size="sm">{c.type}</Badge>
                  <p className="font-bold text-slate-900 truncate">{c.title}</p>
                  <p className="text-[10px] text-slate-400">Dibuat: {formatDate(c.createdAt)}</p>
                </div>
                <Badge variant={c.status === 'PUBLISHED' ? 'success' : 'default'} size="sm">
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

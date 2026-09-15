import React from 'react';
import Link from 'next/link';
import { Newspaper, Megaphone, Calendar, Plane, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function KabarKedinasanIndexPage() {
  const modules = [
    {
      title: 'Berita Kedinasan',
      href: '/kabar-kedinasan/berita',
      icon: Newspaper,
      color: 'bg-blue-500',
      description: 'Publikasi warta berita resmi, siaran pers, dan liputan kegiatan Perpusnas RI.',
    },
    {
      title: 'Pengumuman Resmi',
      href: '/kabar-kedinasan/pengumuman',
      icon: Megaphone,
      color: 'bg-amber-500',
      description: 'Surat edaran, pengumuman kepegawaian, instruksi pimpinan, dan jadwal kedinasan.',
    },
    {
      title: 'Agenda Kegiatan',
      href: '/kabar-kedinasan/agenda',
      icon: Calendar,
      color: 'bg-emerald-500',
      description: 'Kalender jadwal rakor, seminar, bimbingan teknis, dan perhelatan nasional.',
    },
    {
      title: 'Laporan Perjalanan Dinas',
      href: '/kabar-kedinasan/laporan-perjalanan',
      icon: Plane,
      color: 'bg-purple-500',
      description: 'Laporan hasil tugas monitoring, supervisi, dan delegasi luar wilayah oleh aparatur.',
    },
    {
      title: 'Dokumen Intern',
      href: '/kabar-kedinasan/dokumen-intern',
      icon: FileText,
      color: 'bg-rose-500',
      description: 'Repositori regulasi internal, panduan kerja (SOP), dan arsip dokumen resmi.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-perpusnas-700 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Portal Kedinasan
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Kabar Kedinasan Perpusnas RI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pusat informasi resmi, regulasi, kalender kegiatan, dan laporan operasional kedinasan.
        </p>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-perpusnas-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${m.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-perpusnas-900 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-perpusnas-700">
                <span>Buka Modul</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

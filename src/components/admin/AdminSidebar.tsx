'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LayoutTemplate,
  Users,
  KeyRound,
  Newspaper,
  MessageSquare,
  History,
  BookOpen,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavLinks = [
  { label: 'Kelola Halaman Utama', href: '/admin/halaman-utama', icon: LayoutTemplate },
  { label: 'Kelola Pengguna', href: '/admin/pengguna', icon: Users },
  { label: 'Kelola Hak Akses', href: '/admin/hak-akses', icon: KeyRound },
  { label: 'Log Aktivitas', href: '/admin/log-aktivitas', icon: History },
];

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-default">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight block">
                ADMIN PANEL
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                PORTAL INTRANET
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Menu Utama Pengelolaan
          </p>

          {adminNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-gold-500 text-slate-950 font-bold shadow-md shadow-gold-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-slate-950" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* System Status & Version Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-200">Sistem Normal</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60">
              <span>Versi Intranet</span>
              <span className="font-mono font-medium text-gold-400/90">v1.2.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


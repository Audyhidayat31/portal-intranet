'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Search, 
  RotateCcw, 
  ChevronDown, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function AdminLogAktivitasPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Role Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'PEGAWAI'>('ALL');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Pagination state (Matching wireframe: Tampilkan [ 10 v ] data)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false);
  const perPageDropdownRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (perPageDropdownRef.current && !perPageDropdownRef.current.contains(event.target as Node)) {
        setIsPerPageDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLogs = () => {
    setIsLoading(true);
    fetch('/api/admin/activity-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showToast('Gagal memuat log aktivitas', 'error');
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Format date to: dd/mm/yyyy hh:mm (matching wireframe: 03/09/2026 11:00)
  const formatLogDate = (dateVal: string | Date) => {
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '-';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return '-';
    }
  };

  // Humanize module name matching wireframe
  const formatModule = (mod: string) => {
    if (!mod) return '-';
    const upper = mod.toUpperCase();
    if (upper === 'NEWS' || upper === 'BERITA') return 'Berita';
    if (upper === 'ANNOUNCEMENTS' || upper === 'PENGUMUMAN') return 'Pengumuman';
    if (upper === 'OPINION' || upper === 'CORETAN_OPINI' || upper === 'CORETAN OPINI') return 'Coretan Opini';
    if (upper === 'SPORTS' || upper === 'OLAHRAGA') return 'Olahraga';
    if (upper === 'LIFESTYLE' || upper === 'TIPS_DAN_GAYA_HIDUP' || upper === 'TIPS DAN GAYA HIDUP') return 'Tips dan Gaya Hidup';
    if (upper === 'EARTH' || upper === 'JELAJAH_BUMI' || upper === 'JELAJAH BUMI') return 'Jelajah Bumi';
    if (upper === 'DIDYOUKNOW' || upper === 'TAHUKAH_ANDA' || upper === 'TAHUKAH ANDA') return 'Tahukah Anda';
    if (upper === 'FIGURE' || upper === 'KUPAS_SOSOK' || upper === 'KUPAS SOSOK') return 'Kupas Sosok';
    if (upper === 'HOMEPAGE') return 'Homepage';
    if (upper === 'AUTH' || upper === 'AUTENTIKASI') return 'Autentikasi';
    if (upper === 'USERS' || upper === 'PENGGUNA') return 'Pengguna';
    if (upper === 'ROLES' || upper === 'HAK_AKSES' || upper === 'HAK AKSES') return 'Hak Akses';
    if (upper === 'POSTS') return 'Antar Pegawai';
    return mod;
  };

  // Humanize action name
  const formatAction = (act: string) => {
    if (!act) return '-';
    const upper = act.toUpperCase();
    if (upper === 'CREATE') return 'Create';
    if (upper === 'UPDATE') return 'Update';
    if (upper === 'DELETE') return 'Delete';
    if (upper === 'LOGIN') return 'Login';
    if (upper === 'LOGOUT') return 'Logout';
    return act;
  };

  // Determine user role label
  const getUserRole = (log: any): 'Admin' | 'Pegawai' => {
    const roleName = log.user?.role?.name || '';
    if (roleName.toUpperCase().includes('ADMIN') || roleName === 'ADMINISTRATOR') {
      return 'Admin';
    }
    return 'Pegawai';
  };

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const query = activeSearch.trim().toLowerCase();
      const moduleName = formatModule(log.module).toLowerCase();
      const description = (log.description || '').toLowerCase();
      const userName = (log.user?.name || 'Sistem').toLowerCase();
      const actionName = formatAction(log.action).toLowerCase();

      const matchesSearch = query === '' ||
        moduleName.includes(query) ||
        description.includes(query) ||
        userName.includes(query) ||
        actionName.includes(query);

      const userRole = getUserRole(log);
      const matchesRole =
        roleFilter === 'ALL' ||
        (roleFilter === 'ADMIN' && userRole === 'Admin') ||
        (roleFilter === 'PEGAWAI' && userRole === 'Pegawai');

      return matchesSearch && matchesRole;
    });
  }, [logs, activeSearch, roleFilter]);

  // Reset to page 1 whenever filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, roleFilter, itemsPerPage]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  // Generate pagination range matching wireframe: <  1  2  3  4  5  ...  >
  const paginationRange = useMemo(() => {
    if (totalPages <= 5) {
      const range = [];
      for (let i = 1; i <= Math.max(1, totalPages); i++) {
        range.push(i);
      }
      return range;
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [totalPages, currentPage]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchQuery);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveSearch('');
    setRoleFilter('ALL');
    fetchLogs();
    showToast('Data aktivitas berhasil dimuat ulang!', 'info');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-bottom-5 text-white ${
          toastType === 'error' 
            ? 'bg-[#ba1a1a] border-red-800' 
            : 'bg-[#00113a] border-slate-700'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header matching wireframe: Log Aktivitas */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#00113a] tracking-tight">
          Log Aktivitas
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Riwayat aktivitas pengguna dalam sistem.
        </p>
      </div>

      {/* Controls Bar matching wireframe: [ Search ] [ Peran v ] [ Cari ] [ Muat Ulang ] */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
            placeholder="Cari modul, aktivitas, nama..."
            className="w-52 sm:w-64 px-3.5 py-2 text-xs bg-white border border-[#c5c6d2] rounded-md focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a]/20 text-slate-900 placeholder-slate-400 shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveSearch('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Peran Dropdown Selector matching wireframe */}
        <div className="relative inline-block text-left z-20" ref={roleDropdownRef}>
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center justify-between gap-3 px-4 py-2 bg-[#5b6b82] hover:bg-[#485568] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors min-w-[115px] cursor-pointer"
          >
            <span>
              {roleFilter === 'ALL'
                ? 'Peran'
                : roleFilter === 'ADMIN'
                ? 'Admin'
                : 'Pegawai'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute left-0 mt-1 w-36 bg-white border border-[#c5c6d2] rounded-md shadow-lg overflow-hidden py-1 z-30">
              <button
                type="button"
                onClick={() => {
                  setRoleFilter('ALL');
                  setIsRoleDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  roleFilter === 'ALL'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Semua Peran</span>
                {roleFilter === 'ALL' && <Check className="w-3.5 h-3.5 text-[#00113a]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleFilter('ADMIN');
                  setIsRoleDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  roleFilter === 'ADMIN'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Admin</span>
                {roleFilter === 'ADMIN' && <Check className="w-3.5 h-3.5 text-[#00113a]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleFilter('PEGAWAI');
                  setIsRoleDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  roleFilter === 'PEGAWAI'
                    ? 'bg-slate-100 text-[#00113a] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Pegawai</span>
                {roleFilter === 'PEGAWAI' && <Check className="w-3.5 h-3.5 text-[#00113a]" />}
              </button>
            </div>
          )}
        </div>

        {/* Button Cari matching wireframe */}
        <button
          type="button"
          onClick={() => handleSearchSubmit()}
          className="px-5 py-2 bg-[#99ccff] hover:bg-[#80baff] active:scale-95 text-[#00113a] border border-[#6ea8e6] text-xs font-bold rounded-md shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Cari</span>
        </button>

        {/* Button Muat Ulang matching wireframe */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="px-4 py-2 bg-[#99ccff] hover:bg-[#80baff] active:scale-95 text-[#00113a] border border-[#6ea8e6] text-xs font-bold rounded-md shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* Activity Logs Table Card matching nested header & full grid wireframe */}
      <div className="bg-white border border-[#c5c6d2] shadow-2xs rounded-lg">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={8} />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-t-lg">
            <table className="w-full text-left border-collapse">
              {/* Nested Table Header: No | Modul | Aktivitas | Aksi | Peran | Diperbarui (Oleh, Pada) */}
              <thead>
                <tr className="border-b border-[#c5c6d2] bg-[#f1f3f7]">
                  <th 
                    rowSpan={2} 
                    className="py-3 px-3 text-xs font-bold text-[#00113a] text-center w-[5%] border-r border-[#c5c6d2]"
                  >
                    No
                  </th>
                  <th 
                    rowSpan={2} 
                    className="py-3 px-4 text-xs font-bold text-[#00113a] text-center w-[14%] border-r border-[#c5c6d2]"
                  >
                    Modul
                  </th>
                  <th 
                    rowSpan={2} 
                    className="py-3 px-5 text-xs font-bold text-[#00113a] text-center w-[29%] border-r border-[#c5c6d2]"
                  >
                    Aktivitas
                  </th>
                  <th 
                    rowSpan={2} 
                    className="py-3 px-4 text-xs font-bold text-[#00113a] text-center w-[11%] border-r border-[#c5c6d2]"
                  >
                    Aksi
                  </th>
                  <th 
                    rowSpan={2} 
                    className="py-3 px-4 text-xs font-bold text-[#00113a] text-center w-[11%] border-r border-[#c5c6d2]"
                  >
                    Peran
                  </th>
                  <th 
                    colSpan={2} 
                    className="py-2.5 px-4 text-xs font-bold text-[#00113a] text-center w-[30%] border-b border-[#c5c6d2]"
                  >
                    Diperbarui
                  </th>
                </tr>
                <tr className="border-b border-[#c5c6d2] bg-[#f1f3f7]">
                  <th className="py-2 px-4 text-xs font-bold text-[#00113a] text-center w-[15%] border-r border-[#c5c6d2]">
                    Oleh
                  </th>
                  <th className="py-2 px-4 text-xs font-bold text-[#00113a] text-center w-[15%]">
                    Pada
                  </th>
                </tr>
              </thead>

              {/* Table Body with full grid lines matching wireframe */}
              <tbody className="text-xs">
                {paginatedLogs.map((log, index) => {
                  const roleName = getUserRole(log);
                  const actionName = formatAction(log.action);
                  const moduleName = formatModule(log.module);
                  const userName = log.user?.name || 'Sistem';
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr key={log.id} className="border-b border-[#c5c6d2] hover:bg-slate-50/80 transition-colors">
                      {/* No */}
                      <td className="py-3.5 px-3 text-center font-medium text-slate-800 border-r border-[#c5c6d2]">
                        {rowNumber}
                      </td>

                      {/* Modul */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-900 border-r border-[#c5c6d2]">
                        {moduleName}
                      </td>

                      {/* Aktivitas */}
                      <td className="py-3.5 px-5 text-center text-slate-900 font-medium border-r border-[#c5c6d2] leading-relaxed">
                        {log.description}
                      </td>

                      {/* Aksi: Create / Update / Delete with Stitch-themed styling */}
                      <td className="py-3.5 px-4 text-center border-r border-[#c5c6d2]">
                        <span className={`inline-block px-3 py-1 rounded text-[11px] font-bold ${
                          actionName === 'Create'
                            ? 'text-[#1b6d24] bg-[#dcfce7] border border-[#86efac]'
                            : actionName === 'Delete'
                            ? 'text-[#ba1a1a] bg-[#fee2e2] border border-[#fca5a5]'
                            : 'text-[#002366] bg-[#dbe1ff] border border-[#b3c5ff]'
                        }`}>
                          {actionName}
                        </span>
                      </td>

                      {/* Peran: Admin / Pegawai */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-900 border-r border-[#c5c6d2]">
                        {roleName}
                      </td>

                      {/* Diperbarui: Oleh */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-900 border-r border-[#c5c6d2]">
                        {userName}
                      </td>

                      {/* Diperbarui: Pada */}
                      <td className="py-3.5 px-4 text-center text-slate-700 font-mono text-[11px]">
                        {formatLogDate(log.createdAt)}
                      </td>
                    </tr>
                  );
                })}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-slate-500 text-xs">
                      Tidak ditemukan aktivitas pengguna yang sesuai dengan kriteria filter atau pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls matching wireframe: [ Tampilkan 10 v data ] and [ < 1 2 3 4 5 ... > ] */}
        {!isLoading && filteredLogs.length > 0 && (
          <div className="px-6 py-3.5 bg-white border-t border-[#c5c6d2] rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
            {/* Left: Tampilkan [ 10 v ] data */}
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <span>Tampilkan</span>
              <div className="relative inline-block text-left" ref={perPageDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
                  className="flex items-center justify-between gap-1.5 px-2.5 py-1 bg-white border border-[#c5c6d2] rounded text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>{itemsPerPage}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isPerPageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPerPageDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-16 bg-white border border-[#c5c6d2] rounded shadow-lg overflow-hidden py-1 z-30">
                    {[10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(num);
                          setCurrentPage(1);
                          setIsPerPageDropdownOpen(false);
                        }}
                        className={`w-full text-center px-2 py-1 text-xs hover:bg-slate-100 transition-colors cursor-pointer ${
                          itemsPerPage === num ? 'font-bold text-[#00113a] bg-slate-50' : 'text-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span>data</span>
            </div>

            {/* Right: <  1  2  3  4  5  ...  > */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs font-bold text-slate-700 hover:text-[#00113a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Halaman Sebelumnya"
              >
                &lt;
              </button>

              {paginationRange.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className="px-1 text-xs text-slate-400">
                      ...
                    </span>
                  );
                }
                const pageNum = Number(page);
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`min-w-[24px] h-6 px-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#00113a] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs font-bold text-slate-700 hover:text-[#00113a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Halaman Selanjutnya"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer matching wireframe */}
      <footer className="pt-8 border-t border-[#c5c6d2] mt-8 text-center text-[11px] text-slate-500">
        © Copyright 2026, All Rights Reserved | Perpustakaan Nasional RI.
      </footer>
    </div>
  );
}

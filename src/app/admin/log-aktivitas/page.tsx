'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isUraianExpanded, setIsUraianExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsUraianExpanded(false);
    if (selectedLog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedLog]);

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

  // Format date to: dd/mm/yyyy hh:mm or dd/mm/yyyy hh:mm:ss
  const formatLogDate = (dateVal: string | Date, withSeconds = false) => {
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '-';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return withSeconds
        ? `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
        : `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return '-';
    }
  };

  // Format date to: dd/mm/yyyy
  const formatLogDateOnly = (dateStr?: string | Date | null): string => {
    if (!dateStr || dateStr === '-') return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return String(dateStr);
    }
  };

  // Format trip duration: dd/mm/yyyy Hingga dd/mm/yyyy
  const formatTripDuration = (startDate?: string | Date | null, endDate?: string | Date | null): string => {
    if (!startDate && !endDate) return '-';
    const startStr = formatLogDateOnly(startDate);
    const endStr = formatLogDateOnly(endDate);
    if (startStr !== '-' && endStr !== '-') {
      return `${startStr} Hingga ${endStr}`;
    }
    return startStr !== '-' ? startStr : endStr;
  };

  // Humanize module name matching front-end portal navigation
  const formatModule = (mod: string) => {
    if (!mod) return '-';
    const clean = mod.trim().toUpperCase().replace(/[\s-]+/g, '_');

    // 1. Kabar Kedinasan
    if (clean === 'NEWS' || clean === 'BERITA') return 'Berita';
    if (clean === 'ANNOUNCEMENTS' || clean === 'ANNOUNCEMENT' || clean === 'PENGUMUMAN') return 'Pengumuman';
    if (clean === 'AGENDAS' || clean === 'AGENDA' || clean === 'AGENDA_KEGIATAN') return 'Agenda Kegiatan';
    if (
      clean === 'BUSINESS_TRIP' ||
      clean === 'BUSINESS_TRIPS' ||
      clean === 'PERJALANAN_DINAS' ||
      clean === 'LAPORAN_PERJALANAN' ||
      clean === 'LAPORAN_PERJALANAN_DINAS'
    ) {
      return 'Laporan Perjalanan Dinas';
    }
    if (
      clean === 'INTERNAL_DOCUMENT' ||
      clean === 'INTERNAL_DOCUMENTS' ||
      clean === 'DOCUMENTS' ||
      clean === 'DOCUMENT' ||
      clean === 'DOKUMEN_INTERNAL' ||
      clean === 'DOKUMEN_INTERN' ||
      clean === 'DOKUMEN'
    ) {
      return 'Dokumen Internal';
    }

    // 2. Antar Pegawai
    if (clean === 'EMPLOYEES' || clean === 'EMPLOYEE' || clean === 'DAFTAR_PEGAWAI') return 'Daftar Pegawai';
    if (clean === 'OPINION' || clean === 'OPINI' || clean === 'CORETAN_OPINI') return 'Coretan Opini';
    if (clean === 'HUMOR') return 'Humor';
    if (clean === 'EARTH' || clean === 'JELAJAH_BUMI') return 'Jelajah Bumi';
    if (clean === 'FAMILY' || clean === 'KABAR_KELUARGA') return 'Kabar Keluarga';
    if (clean === 'WISDOM' || clean === 'KALIMAT_BIJAK') return 'Kalimat Bijak';
    if (clean === 'ACADEMIC' || clean === 'KARYA_AKADEMIK') return 'Karya Akademik';
    if (
      clean === 'LIFESTYLE' ||
      clean === 'TIPS_GAYA_HIDUP' ||
      clean === 'TIPS_DAN_GAYA_HIDUP' ||
      clean === 'TIPS_&_GAYA_HIDUP'
    ) {
      return 'Tips & Gaya Hidup';
    }
    if (clean === 'CONSULTATION' || clean === 'CONSULTATIONS' || clean === 'KONSULTASI') return 'Konsultasi';
    if (clean === 'SPORTS' || clean === 'SPORT' || clean === 'OLAHRAGA') return 'Olahraga';
    if (clean === 'DIDYOUKNOW' || clean === 'DID_YOU_KNOW' || clean === 'TAHUKAH_ANDA') return 'Tahukah Anda';
    if (clean === 'POSTS' || clean === 'POST' || clean === 'POSTINGAN_PEGAWAI' || clean === 'ANTAR_PEGAWAI') {
      return 'Antar Pegawai';
    }

    // 3. Kupas Sosok
    if (
      clean === 'FIGURE' ||
      clean === 'FIGURES' ||
      clean === 'FIGURE_PROFILE' ||
      clean === 'FIGURE_PROFILES' ||
      clean === 'KUPAS_SOSOK'
    ) {
      return 'Kupas Sosok';
    }

    // 4. Kelola Admin
    if (clean === 'HOMEPAGE' || clean === 'HALAMAN_UTAMA' || clean === 'KELOLA_HALAMAN_UTAMA' || clean === 'INFO_PENTING') {
      return 'Kelola Halaman Utama';
    }
    if (clean === 'USERS' || clean === 'USER' || clean === 'PENGGUNA' || clean === 'KELOLA_PENGGUNA') {
      return 'Kelola Pengguna';
    }
    if (
      clean === 'ROLES' ||
      clean === 'ROLE' ||
      clean === 'PERMISSIONS' ||
      clean === 'PERMISSION' ||
      clean === 'HAK_AKSES' ||
      clean === 'KELOLA_HAK_AKSES'
    ) {
      return 'Kelola Hak Akses';
    }
    if (
      clean === 'AUDIT' ||
      clean === 'AUDIT_LOG' ||
      clean === 'ACTIVITY_LOG' ||
      clean === 'LOG' ||
      clean === 'LOGS' ||
      clean === 'LOG_AKTIVITAS'
    ) {
      return 'Log Aktivitas';
    }

    // 5. Autentikasi
    if (clean === 'AUTH' || clean === 'AUTHENTICATION' || clean === 'AUTENTIKASI') {
      return 'Autentikasi';
    }

    // Fallback formatting: title case words instead of raw enum
    return mod
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Humanize action name
  const formatAction = (act: string) => {
    if (!act) return '-';
    const upper = act.toUpperCase();
    if (upper === 'CREATE') return 'Create';
    if (upper === 'UPDATE') return 'Update';
    if (upper === 'DELETE') return 'Delete';
    if (upper === 'CHANGE_STATUS') return 'Ubah Status';
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

  // Helper to safely strip HTML tags and decode common entities
  const stripHtml = (html?: string | null): string => {
    if (!html) return '';
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Helper to safely convert data URL (base64) to a Blob URL
  // This avoids passing massive base64 strings to window.open or href, completely eliminating HTTP 431 errors
  const dataUrlToBlobUrl = (dataUrl: string): string | null => {
    try {
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const binaryStr = atob(parts[1]);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mime });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Failed to convert dataUrl to Blob URL:', err);
      return null;
    }
  };

  // Helper to extract clean file name from URL or path
  const getFileName = (url?: string | null, customName?: string | null, fallback = '-'): string => {
    if (customName && customName.trim()) return customName.trim();
    if (!url) return fallback;
    if (url.startsWith('data:image/png')) return 'gambar.png';
    if (url.startsWith('data:image')) return 'gambar.jpg';
    if (url.startsWith('data:application/pdf')) return 'dokumen.pdf';
    try {
      const cleanUrl = url.split('?')[0].split('#')[0];
      const segments = cleanUrl.split('/');
      const last = decodeURIComponent(segments[segments.length - 1]);
      return last || fallback;
    } catch {
      return fallback;
    }
  };

  // Helper to parse multiple attachments or array JSON string
  const parseAttachments = (
    rawUrl?: any,
    rawName?: any,
    fallbackTitle?: string | null
  ): { url: string; name: string }[] => {
    if (!rawUrl && !rawName) return [];

    // Helper to determine extension from base64 data URL
    const getExtFromDataUrl = (u: string): string => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('data:image/png')) return '.png';
      if (u.startsWith('data:image/jpeg') || u.startsWith('data:image/jpg')) return '.jpg';
      if (u.startsWith('data:image/webp')) return '.webp';
      if (u.startsWith('data:image/gif')) return '.gif';
      if (u.startsWith('data:image/svg')) return '.svg';
      if (u.startsWith('data:application/pdf')) return '.pdf';
      if (u.includes('wordprocessingml') || u.includes('msword')) return '.docx';
      if (u.includes('spreadsheetml') || u.includes('vnd.ms-excel')) return '.xlsx';
      if (u.includes('presentationml') || u.includes('powerpoint')) return '.pptx';
      if (u.startsWith('data:text/plain')) return '.txt';
      if (u.startsWith('data:text/csv')) return '.csv';
      if (u.startsWith('data:image')) return '.jpg';
      return '';
    };

    // 1. Extract array of file names
    let names: string[] = [];
    if (Array.isArray(rawName)) {
      names = rawName
        .map((n) => (typeof n === 'string' ? n.trim() : typeof n === 'object' && n ? (n.name || n.label || '') : ''))
        .filter(Boolean);
    } else if (typeof rawName === 'string') {
      const cleanName = rawName.trim();
      if (cleanName && cleanName !== '-' && cleanName !== 'null' && cleanName !== 'undefined') {
        if (cleanName.startsWith('[') && cleanName.endsWith(']')) {
          try {
            const parsed = JSON.parse(cleanName);
            if (Array.isArray(parsed)) {
              names = parsed
                .map((item) => {
                  if (typeof item === 'string') return item.trim();
                  if (typeof item === 'object' && item !== null) {
                    return (item.name || item.label || item.fileName || '').trim();
                  }
                  return '';
                })
                .filter(Boolean);
            }
          } catch {}
        } else if (cleanName.includes('|||')) {
          names = cleanName.split('|||').map((s) => s.trim()).filter(Boolean);
        } else if (cleanName.includes(',')) {
          names = cleanName.split(',').map((s) => s.trim()).filter(Boolean);
        } else {
          names = [cleanName];
        }
      }
    }

    // 2. Extract array of URLs and any embedded names
    let urlItems: { url: string; name?: string }[] = [];
    if (Array.isArray(rawUrl)) {
      urlItems = rawUrl
        .filter((u) => u !== null && u !== undefined)
        .map((u) => {
          if (typeof u === 'string') return { url: u.trim() };
          if (typeof u === 'object') {
            const uUrl = (u.url || u.src || u.preview || '').trim();
            const uName = (u.name || u.label || u.fileName || '').trim();
            return { url: uUrl, name: uName };
          }
          return { url: '' };
        })
        .filter((item) => item.url.length > 0 || (item.name && item.name.length > 0));
    } else if (typeof rawUrl === 'string') {
      const cleanUrl = rawUrl.trim();
      if (cleanUrl && cleanUrl !== '-' && cleanUrl !== '#' && cleanUrl !== 'null' && cleanUrl !== 'undefined') {
        if (cleanUrl.startsWith('[') && cleanUrl.endsWith(']')) {
          try {
            const parsed = JSON.parse(cleanUrl);
            if (Array.isArray(parsed)) {
              urlItems = parsed
                .filter((u) => u !== null && u !== undefined)
                .map((u) => {
                  if (typeof u === 'string') return { url: u.trim() };
                  if (typeof u === 'object') {
                    const uUrl = (u.url || u.src || u.preview || '').trim();
                    const uName = (u.name || u.label || u.fileName || '').trim();
                    return { url: uUrl, name: uName };
                  }
                  return { url: '' };
                })
                .filter((item) => item.url.length > 0 || (item.name && item.name.length > 0));
            }
          } catch {}
        } else if (cleanUrl.includes('|||')) {
          urlItems = cleanUrl.split('|||').map((u) => ({ url: u.trim() })).filter((item) => item.url.length > 0);
        } else if (!cleanUrl.startsWith('data:') && cleanUrl.includes(',') && !cleanUrl.includes('data:')) {
          urlItems = cleanUrl.split(',').map((u) => ({ url: u.trim() })).filter((item) => item.url.length > 0);
        } else {
          urlItems = [{ url: cleanUrl }];
        }
      }
    }

    const totalCount = Math.max(urlItems.length, names.length);
    if (totalCount === 0) return [];

    const results: { url: string; name: string }[] = [];

    for (let i = 0; i < totalCount; i++) {
      const urlObj = urlItems[i];
      const itemUrl = urlObj?.url || (urlItems.length === 1 && totalCount === 1 ? urlItems[0].url : '');
      const embeddedName = urlObj?.name;
      const explicitName = names[i];

      let resolvedName = explicitName || embeddedName || '';

      // Check if resolvedName is generic or missing (e.g. "lampiran", "lampiran-2.jpg", "file", "-")
      const isGeneric =
        !resolvedName ||
        /^lampiran([-_ ]\d+)?(\.[a-z0-9]+)?$/i.test(resolvedName) ||
        resolvedName.toLowerCase() === 'dokumen' ||
        resolvedName.toLowerCase() === 'berkas' ||
        resolvedName === '-';

      if (isGeneric) {
        if (itemUrl && !itemUrl.startsWith('data:')) {
          const fromUrl = getFileName(itemUrl, null, '');
          if (fromUrl && fromUrl !== '-' && !fromUrl.startsWith('lampiran-')) {
            resolvedName = fromUrl;
          }
        } else if (itemUrl && itemUrl.startsWith('data:')) {
          const ext = getExtFromDataUrl(itemUrl);
          if (fallbackTitle) {
            const cleanTitle = fallbackTitle
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
              .slice(0, 30);
            resolvedName = `${cleanTitle}-lampiran-${i + 1}${ext || '.pdf'}`;
          } else {
            resolvedName = `lampiran-${i + 1}${ext || ''}`;
          }
        } else {
          resolvedName = `lampiran-${i + 1}`;
        }
      }

      // Add extension if data URL and resolvedName lacks an extension
      if (itemUrl && itemUrl.startsWith('data:') && !resolvedName.includes('.')) {
        const ext = getExtFromDataUrl(itemUrl);
        if (ext) resolvedName += ext;
      }

      results.push({
        url: itemUrl,
        name: resolvedName,
      });
    }

    return results;
  };

  // Safely open file in a new tab or trigger download, avoiding HTTP 431 errors
  const handleOpenFile = (e: React.MouseEvent, rawUrl: string, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rawUrl || rawUrl === '#' || rawUrl === '-') return;

    let targetUrl = rawUrl.trim();

    // If targetUrl is an array string ["..."], extract the first URL
    if (targetUrl.startsWith('[') && targetUrl.endsWith(']')) {
      try {
        const parsed = JSON.parse(targetUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          targetUrl = parsed[0];
        }
      } catch {}
    }

    // If data URL, convert to Blob URL so the browser opens it cleanly without sending a massive HTTP request
    if (targetUrl.startsWith('data:')) {
      const blobUrl = dataUrlToBlobUrl(targetUrl);
      if (blobUrl) {
        const win = window.open(blobUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          // If popup is blocked by browser, trigger direct download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName || 'berkas';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        alert('Format berkas tidak dapat diproses.');
      }
      return;
    }

    // Standard web URL or relative path
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const renderFileItem = (url?: string | null, customName?: string | null) => {
    if (!url && !customName) {
      return <span className="text-slate-400 font-normal">-</span>;
    }

    const fileName = getFileName(url, customName, 'file');

    if (!url || url === '#' || url === '-') {
      return <span className="text-slate-700 font-medium">{fileName}</span>;
    }

    return (
      <button
        type="button"
        onClick={(e) => handleOpenFile(e, url, fileName)}
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left break-all cursor-pointer inline-flex items-center gap-1 group"
        title={`Buka file: ${fileName}`}
      >
        <span>{fileName}</span>
      </button>
    );
  };

  const renderAttachmentsList = (attachments: { url: string; name: string }[]) => {
    if (attachments.length === 0) {
      return <span className="text-slate-400 font-normal">-</span>;
    }

    return (
      <div className="space-y-1.5">
        {attachments.map((item, idx) => (
          <div key={idx} className="flex items-start">
            {item.url && item.url !== '#' && item.url !== '-' ? (
              <button
                type="button"
                onClick={(e) => handleOpenFile(e, item.url, item.name)}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left break-all cursor-pointer inline-flex items-center gap-1 group text-xs sm:text-sm"
                title={`Buka / Unduh lampiran: ${item.name}`}
              >
                <span>{item.name}</span>
              </button>
            ) : (
              <span className="text-slate-700 font-medium text-xs sm:text-sm break-all">{item.name}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const query = activeSearch.trim().toLowerCase();
      const moduleName = formatModule(log.module).toLowerCase();
      const description = (log.description || '').toLowerCase();
      const rawDescription = (log.rawDescription || '').toLowerCase();
      const userName = (log.user?.name || 'Sistem').toLowerCase();
      const userNip = (log.user?.nip || '').toLowerCase();
      const actionName = formatAction(log.action).toLowerCase();
      const detailsTitle = (log.details?.title || '').toLowerCase();
      const detailsSource = (log.details?.source || '').toLowerCase();

      const matchesSearch = query === '' ||
        moduleName.includes(query) ||
        description.includes(query) ||
        rawDescription.includes(query) ||
        userName.includes(query) ||
        userNip.includes(query) ||
        actionName.includes(query) ||
        detailsTitle.includes(query) ||
        detailsSource.includes(query);

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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveSearch(searchQuery.trim());
    setCurrentPage(1);
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
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (!val.trim()) {
                setActiveSearch('');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                handleSearchSubmit();
              }
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
          type="submit"
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
      </form>

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
                      <td className="py-3 px-5 text-center text-slate-900 font-medium border-r border-[#c5c6d2] leading-relaxed">
                        <div className="text-xs">{log.description}</div>
                        {log.action !== 'LOGIN' && log.action !== 'LOGOUT' && (
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="block mx-auto mt-1 text-[11px] text-slate-600 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                          >
                            Lihat selengkapnya
                          </button>
                        )}
                      </td>

                      {/* Aksi: Create / Update / Delete / Ubah Status with Stitch-themed styling */}
                      <td className="py-3.5 px-4 text-center border-r border-[#c5c6d2]">
                        <span className={`inline-block px-3 py-1 rounded text-[11px] font-bold ${
                          actionName === 'Create'
                            ? 'text-[#1b6d24] bg-[#dcfce7] border border-[#86efac]'
                            : actionName === 'Delete'
                            ? 'text-[#ba1a1a] bg-[#fee2e2] border border-[#fca5a5]'
                            : actionName === 'Ubah Status'
                            ? 'text-[#7c2d12] bg-[#ffedd5] border border-[#fed7aa]'
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

      {/* Pop-up Modal: Rincian Aktivitas (Lihat Selengkapnya) - Rendered via Portal directly to body */}
      {isMounted && selectedLog && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedLog(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#f8f9ff] border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Rincian Aktivitas</h3>
                <p className="text-xs text-slate-500">Detail riwayat tindakan dan perubahan data dalam sistem</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              {/* Info Pelaksana & Waktu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Aksi</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-slate-900 text-sm">{formatModule(selectedLog.module)}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      formatAction(selectedLog.action) === 'Create'
                        ? 'text-[#1b6d24] bg-[#dcfce7] border border-[#86efac]'
                        : formatAction(selectedLog.action) === 'Delete'
                        ? 'text-[#ba1a1a] bg-[#fee2e2] border border-[#fca5a5]'
                        : formatAction(selectedLog.action) === 'Ubah Status'
                        ? 'text-[#7c2d12] bg-[#ffedd5] border border-[#fed7aa]'
                        : 'text-[#002366] bg-[#dbe1ff] border border-[#b3c5ff]'
                    }`}>
                      {formatAction(selectedLog.action)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Waktu</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatLogDate(selectedLog.createdAt, true)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">Pengguna</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLog.user?.name || 'Sistem'}
                    {selectedLog.user?.nip ? ` (${selectedLog.user.nip})` : ''}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Peran: {getUserRole(selectedLog)}
                  </span>
                </div>
              </div>

              {/* Deskripsi Aktivitas Ringkas */}
              <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-200/80">
                <span className="text-[#002366] font-bold block mb-1">Aktivitas</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedLog.description}
                </p>
              </div>

              {/* Detail Berdasarkan Aksi: Detail Aktivitas */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Detail Aktivitas
                </h4>

                <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 space-y-3.5">
                  {/* Dynamic Content Fields based on Source Page Module */}
                  {(() => {
                    const rawMod = selectedLog.module || '';
                    const mod = rawMod.trim().toUpperCase().replace(/[\s-]+/g, '_');
                    const descLower = (selectedLog.description || '').toLowerCase();
                    const details = selectedLog.details || {};
                    const rawUrl = details.attachmentUrl || details.fileUrl || details.attachments;
                    const rawName = details.attachmentName || details.fileName || details.namaLampiran;
                    const attachments = parseAttachments(rawUrl, rawName, details.title || details.keperluan || details.name);

                    // 1. LAPORAN PERJALANAN DINAS
                    if (
                      mod === 'BUSINESS_TRIP' ||
                      mod === 'BUSINESS_TRIPS' ||
                      mod === 'PERJALANAN_DINAS' ||
                      mod === 'LAPORAN_PERJALANAN' ||
                      mod === 'LAPORAN_PERJALANAN_DINAS' ||
                      descLower.includes('perjalanan dinas')
                    ) {
                      const keperluan = details.keperluan || details.title || selectedLog.description;
                      const nama = details.nama || details.authorName || selectedLog.user?.name || '-';
                      const tglMulai = formatLogDateOnly(details.eventStartDate || details.startDate || details.tanggalMulai || details.tanggal || details.publishedAt || selectedLog.createdAt);
                      const durasi = formatTripDuration(
                        details.eventStartDate || details.startDate || details.tanggalMulai || details.tanggal || details.publishedAt || selectedLog.createdAt,
                        details.eventEndDate || details.endDate
                      );
                      const kotaTujuan = details.destinationCity || details.kotaTujuan || '-';
                      const negaraTujuan = details.negaraTujuan || (details.source && details.source !== '-' ? details.source : 'Indonesia');

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Keperluan */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Keperluan:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {keperluan}
                            </span>
                          </div>

                          {/* Tanggal Mulai */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Tanggal Mulai:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {tglMulai}
                            </span>
                          </div>

                          {/* Durasi Penugasan */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Durasi Penugasan:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {durasi}
                            </span>
                          </div>

                          {/* Nama */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Nama:</span>
                            <span className="font-medium text-slate-800">
                              {nama}
                            </span>
                          </div>

                          {/* Kota/Kab Tujuan */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Kota/Kab Tujuan:</span>
                            <span className="font-medium text-slate-800">
                              {kotaTujuan}
                            </span>
                          </div>

                          {/* Negara Tujuan */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Negara Tujuan:</span>
                            <span className="font-medium text-slate-800">
                              {negaraTujuan}
                            </span>
                          </div>

                          {/* Lampiran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                            {renderAttachmentsList(attachments)}
                          </div>
                        </div>
                      );
                    }

                    // 2. DOKUMEN INTERNAL
                    if (
                      mod === 'INTERNAL_DOCUMENT' ||
                      mod === 'INTERNAL_DOCUMENTS' ||
                      mod === 'DOCUMENTS' ||
                      mod === 'DOCUMENT' ||
                      mod === 'DOKUMEN_INTERNAL' ||
                      mod === 'DOKUMEN_INTERN' ||
                      mod === 'DOKUMEN' ||
                      descLower.includes('dokumen internal') ||
                      descLower.includes('dokumen intern')
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Judul Dokumen */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Judul Dokumen:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.title || selectedLog.description}
                            </span>
                          </div>

                          {/* Nomor Dokumen */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Nomor Dokumen:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {details.documentNumber || details.nomorDokumen || '-'}
                            </span>
                          </div>

                          {/* Jenis Dokumen */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Jenis Dokumen:</span>
                            <span className="font-medium text-slate-800">
                              {details.categoryName || details.category || details.jenisDokumen || '-'}
                            </span>
                          </div>

                          {/* Tanggal */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Tanggal:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {formatLogDateOnly(details.tanggal || details.publishedAt || selectedLog.createdAt)}
                            </span>
                          </div>

                          {/* Lampiran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                            {renderAttachmentsList(attachments)}
                          </div>
                        </div>
                      );
                    }

                    // 3. AGENDA KEGIATAN
                    if (
                      mod === 'AGENDAS' ||
                      mod === 'AGENDA' ||
                      mod === 'AGENDA_KEGIATAN' ||
                      descLower.includes('agenda kegiatan') ||
                      descLower.includes('agenda')
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Judul Agenda */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Judul Agenda:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.title || selectedLog.description}
                            </span>
                          </div>

                          {/* Lokasi */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lokasi:</span>
                            <span className="font-medium text-slate-800">
                              {details.eventLocation || details.lokasi || '-'}
                            </span>
                          </div>

                          {/* Tanggal / Waktu Pelaksanaan */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Tanggal Pelaksanaan:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {details.eventStartDate ? formatLogDate(details.eventStartDate, true) : formatLogDate(selectedLog.createdAt, true)}
                            </span>
                          </div>

                          {/* Gambar Sampul */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Gambar:</span>
                            {renderFileItem(
                              details.coverImage || details.image || details.thumbnail,
                              details.coverImageName
                            )}
                          </div>

                          {/* Lampiran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                            {renderAttachmentsList(attachments)}
                          </div>
                        </div>
                      );
                    }

                    // 4. KUPAS SOSOK
                    if (
                      mod === 'FIGURE' ||
                      mod === 'FIGURES' ||
                      mod === 'FIGURE_PROFILE' ||
                      mod === 'KUPAS_SOSOK' ||
                      descLower.includes('kupas sosok') ||
                      descLower.includes('sosok')
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Nama Sosok */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Nama Sosok:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.name || details.title || selectedLog.description}
                            </span>
                          </div>

                          {/* Jabatan */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Jabatan:</span>
                            <span className="font-medium text-slate-800">
                              {details.position || details.jabatan || '-'}
                            </span>
                          </div>

                          {/* Unit Kerja */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Unit Kerja:</span>
                            <span className="font-medium text-slate-800">
                              {details.unitKerja || '-'}
                            </span>
                          </div>

                          {/* Foto Profil */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Foto Profil:</span>
                            {renderFileItem(
                              details.photoUrl || details.coverImage || details.image || details.thumbnail,
                              details.coverImageName || `${details.name || 'foto-sosok'}.jpg`
                            )}
                          </div>

                          {/* Lampiran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                            {renderAttachmentsList(attachments)}
                          </div>

                          {/* Kutipan jika ada */}
                          {details.quote && (
                            <div className="sm:col-span-2 p-2 bg-amber-50/60 rounded border border-amber-200/80">
                              <span className="text-slate-500 block mb-0.5 font-medium text-[11px]">Kutipan:</span>
                              <p className="text-slate-800 italic font-medium">"{details.quote}"</p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // 5. ANTAR PEGAWAI (Opini, Karya Akademik, Tips & Gaya Hidup, Jelajah Bumi, Kabar Keluarga, Kalimat Bijak, Humor, Konsultasi, Olahraga, Tahukah Anda)
                    if (
                      mod === 'OPINION' ||
                      mod === 'SPORTS' ||
                      mod === 'LIFESTYLE' ||
                      mod === 'EARTH' ||
                      mod === 'DIDYOUKNOW' ||
                      mod === 'ACADEMIC' ||
                      mod === 'FAMILY' ||
                      mod === 'HUMOR' ||
                      mod === 'WISDOM' ||
                      mod === 'CONSULTATION' ||
                      mod === 'POSTS' ||
                      mod === 'ANTAR_PEGAWAI'
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Judul */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Judul:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.title || selectedLog.description}
                            </span>
                          </div>

                          {/* Kategori */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Kategori:</span>
                            <span className="font-medium text-slate-800">
                              {formatModule(selectedLog.module)}
                            </span>
                          </div>

                          {/* Penulis */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Penulis:</span>
                            <span className="font-medium text-slate-800">
                              {details.authorName || details.author || selectedLog.user?.name || '-'}
                            </span>
                          </div>

                          {/* Tanggal */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Tanggal:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {details.tanggal
                                ? formatLogDate(details.tanggal, true)
                                : details.publishedAt
                                ? formatLogDate(details.publishedAt, true)
                                : formatLogDate(selectedLog.createdAt, true)}
                            </span>
                          </div>

                          {/* Gambar */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Gambar:</span>
                            {renderFileItem(
                              details.coverImage || details.image || details.thumbnail,
                              details.coverImageName
                            )}
                          </div>

                          {/* Lampiran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                            {renderAttachmentsList(attachments)}
                          </div>
                        </div>
                      );
                    }

                    // 6. PENGUMUMAN
                    if (
                      mod === 'ANNOUNCEMENTS' ||
                      mod === 'ANNOUNCEMENT' ||
                      mod === 'PENGUMUMAN' ||
                      descLower.includes('pengumuman')
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Judul Pengumuman */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Judul:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.title || selectedLog.description}
                            </span>
                          </div>

                          {/* Tanggal */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Tanggal:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {details.tanggal
                                ? formatLogDate(details.tanggal, true)
                                : details.publishedAt
                                ? formatLogDate(details.publishedAt, true)
                                : formatLogDate(selectedLog.createdAt, true)}
                            </span>
                          </div>

                          {/* Lampiran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                            {renderAttachmentsList(attachments)}
                          </div>

                          {/* Gambar jika ada */}
                          {(details.coverImage || details.image) && (
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-medium">Gambar:</span>
                              {renderFileItem(
                                details.coverImage || details.image || details.thumbnail,
                                details.coverImageName
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // 7. KELOLA PENGGUNA
                    if (
                      mod === 'USERS' ||
                      mod === 'USER' ||
                      mod === 'PENGGUNA' ||
                      mod === 'KELOLA_PENGGUNA' ||
                      descLower.includes('pengguna')
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Nama Pengguna */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Nama Pengguna:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.name || details.userName || selectedLog.user?.name || '-'}
                            </span>
                          </div>

                          {/* NIP */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">NIP:</span>
                            <span className="font-medium text-slate-800 font-mono">
                              {details.nip || selectedLog.user?.nip || '-'}
                            </span>
                          </div>

                          {/* Email */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Email:</span>
                            <span className="font-medium text-slate-800">
                              {details.email || '-'}
                            </span>
                          </div>

                          {/* Peran */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Peran:</span>
                            <span className="font-medium text-slate-800">
                              {details.role || details.roleName || '-'}
                            </span>
                          </div>

                          {/* Unit Kerja */}
                          <div>
                            <span className="text-slate-500 block mb-0.5 font-medium">Unit Kerja:</span>
                            <span className="font-medium text-slate-800">
                              {details.unitKerja || '-'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // 8. KELOLA HAK AKSES
                    if (
                      mod === 'ROLES' ||
                      mod === 'ROLE' ||
                      mod === 'HAK_AKSES' ||
                      mod === 'PERMISSIONS' ||
                      descLower.includes('hak akses') ||
                      descLower.includes('peran')
                    ) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Peran */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Peran:</span>
                            <span className="font-bold text-slate-900 text-[13px] leading-snug">
                              {details.roleName || details.title || '-'}
                            </span>
                          </div>

                          {/* Deskripsi */}
                          <div className="sm:col-span-2">
                            <span className="text-slate-500 block mb-0.5 font-medium">Deskripsi Peran:</span>
                            <span className="font-medium text-slate-800">
                              {details.description || selectedLog.description}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // DEFAULT: BERITA & KONTEN UMUM
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Judul */}
                        <div className="sm:col-span-2">
                          <span className="text-slate-500 block mb-0.5 font-medium">Judul:</span>
                          <span className="font-bold text-slate-900 text-[13px] leading-snug">
                            {details.title || selectedLog.description}
                          </span>
                        </div>

                        {/* Sumber (hanya jika ada atau modul berita) */}
                        <div>
                          <span className="text-slate-500 block mb-0.5 font-medium">Sumber:</span>
                          <span className="font-medium text-slate-800">
                            {details.source && details.source.trim() && details.source.trim() !== '-'
                              ? details.source.trim()
                              : '-'}
                          </span>
                        </div>

                        {/* Tanggal */}
                        <div>
                          <span className="text-slate-500 block mb-0.5 font-medium">Tanggal:</span>
                          <span className="font-medium text-slate-800 font-mono">
                            {details.tanggal
                              ? formatLogDate(details.tanggal, true)
                              : details.publishedAt
                              ? formatLogDate(details.publishedAt, true)
                              : formatLogDate(selectedLog.createdAt, true)}
                          </span>
                        </div>

                        {/* Gambar */}
                        <div>
                          <span className="text-slate-500 block mb-0.5 font-medium">Gambar:</span>
                          {renderFileItem(
                            details.coverImage || details.image || details.thumbnail,
                            details.coverImageName
                          )}
                        </div>

                        {/* Lampiran */}
                        <div>
                          <span className="text-slate-500 block mb-0.5 font-medium">Lampiran:</span>
                          {renderAttachmentsList(attachments)}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Status (Selalu di atas Uraian/ Deskripsi) */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1 font-medium">Status:</span>
                    {(() => {
                      const rawStatus =
                        selectedLog.details?.status ||
                        selectedLog.details?.changes?.find((c: any) => c.field?.toLowerCase() === 'status')?.new ||
                        'Terbit';
                      const isTerbit = String(rawStatus).toLowerCase().includes('terbit') || String(rawStatus).toLowerCase().includes('aktif');
                      return (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            isTerbit
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isTerbit ? (String(rawStatus).toLowerCase().includes('aktif') ? 'Aktif' : 'Terbit') : 'Menunggu'}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Uraian / Deskripsi jika ada */}
                  {(() => {
                    const rawContent =
                      selectedLog.details?.fullContent ||
                      selectedLog.details?.isi ||
                      selectedLog.details?.body ||
                      selectedLog.details?.uraian ||
                      selectedLog.details?.deskripsi ||
                      selectedLog.details?.contentExcerpt ||
                      selectedLog.details?.description ||
                      selectedLog.details?.content;

                    const cleanContent = stripHtml(rawContent);
                    if (!cleanContent) return null;

                    const isLongContent = cleanContent.length > 140;

                    return (
                      <div className="pt-2.5 border-t border-slate-200">
                        <span className="text-slate-500 block mb-1 font-medium">Uraian/ Deskripsi:</span>
                        <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-2xs">
                          <div
                            className={`p-2.5 text-slate-700 italic leading-relaxed text-xs transition-all duration-300 ${
                              isUraianExpanded
                                ? 'max-h-80 overflow-y-auto whitespace-pre-line'
                                : isLongContent
                                ? 'line-clamp-2'
                                : ''
                            }`}
                          >
                            "{cleanContent}"
                          </div>
                          {isLongContent && (
                            <button
                              type="button"
                              onClick={() => setIsUraianExpanded(!isUraianExpanded)}
                              className="w-full flex items-center justify-center py-1.5 bg-slate-50 hover:bg-slate-100/90 border-t border-slate-200 text-slate-500 hover:text-[#00113a] transition-all cursor-pointer group"
                              title={isUraianExpanded ? 'Tutup Uraian / Deskripsi' : 'Buka teks Uraian/ Deskripsi secara menyeluruh'}
                            >
                              <ChevronDown
                                className={`w-8 h-4.5 stroke-[2.5] transition-transform duration-300 ${
                                  isUraianExpanded ? 'rotate-180 text-[#00113a]' : 'group-hover:translate-y-0.5'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}


                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-[#00113a] text-white text-xs font-semibold rounded-lg hover:bg-[#001f5c] transition-colors cursor-pointer shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}



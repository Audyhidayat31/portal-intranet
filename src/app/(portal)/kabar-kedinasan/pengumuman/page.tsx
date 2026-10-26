'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  Download,
  CheckCircle,
  Megaphone,
  ImageIcon,
} from 'lucide-react';
import { formatDate, isUserAdmin, canManageContent } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';

// Helper to safely convert data URL (base64) to a Blob URL
// This completely eliminates HTTP 431 errors when opening files
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

const handleOpenFile = (rawUrl: string, fileName: string) => {
  if (!rawUrl || rawUrl === '#' || rawUrl === '-') return;

  let targetUrl = rawUrl.trim();
  if (targetUrl.startsWith('[') && targetUrl.endsWith(']')) {
    try {
      const parsed = JSON.parse(targetUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        targetUrl = parsed[0];
      }
    } catch {}
  }

  if (targetUrl.startsWith('data:')) {
    const blobUrl = dataUrlToBlobUrl(targetUrl);
    if (blobUrl) {
      const win = window.open(blobUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
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

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

interface AnnouncementAttachmentItem {
  id: string | number;
  name: string;
  url: string;
  isImage: boolean;
}

const parseAnnouncementAttachments = (
  attachmentName?: string | null,
  attachmentUrl?: string | null
): AnnouncementAttachmentItem[] => {
  if (!attachmentName && !attachmentUrl) return [];

  let urls: string[] = [];
  if (attachmentUrl) {
    const trimmed = attachmentUrl.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) urls = parsed;
      } catch {
        urls = [trimmed];
      }
    } else if (trimmed.includes('|||')) {
      urls = trimmed.split('|||').map((s) => s.trim());
    } else {
      urls = [trimmed];
    }
  }

  let names: string[] = [];
  if (attachmentName) {
    const trimmed = attachmentName.trim();
    if (trimmed.includes('|||')) {
      names = trimmed.split('|||').map((s) => s.trim()).filter(Boolean);
    } else if (trimmed.includes(',')) {
      names = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      names = [trimmed];
    }
  }

  const maxLen = Math.max(names.length, urls.length);
  if (maxLen === 0) return [];

  const items: AnnouncementAttachmentItem[] = [];
  for (let i = 0; i < maxLen; i++) {
    const u = urls[i] || (urls.length === 1 && names.length === 1 ? urls[0] : '');
    const n = names[i] || (u.startsWith('data:') ? `lampiran-${i + 1}` : u.split('/').pop() || `lampiran-${i + 1}`);
    const isImg =
      u.startsWith('data:image') ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(n) ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(u);

    items.push({
      id: i + 1,
      name: n,
      url: u,
      isImage: Boolean(isImg),
    });
  }

  return items;
};

// 5 Mock Announcements matching Stitch
const STITCH_MOCK_ANNOUNCEMENTS_5: any[] = [
];

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Add Announcement State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageRef = useRef<HTMLDivElement>(null);

  // Edit Announcement State variables moved up
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAttachmentName, setEditAttachmentName] = useState('');
  const [editStatus, setEditStatus] = useState('Terbit');
  const [isEditStatusMenuOpen, setIsEditStatusMenuOpen] = useState(false);
  const editStatusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
        setIsPerPageOpen(false);
      }
      if (editStatusMenuRef.current && !editStatusMenuRef.current.contains(event.target as Node)) {
        setIsEditStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);


    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Edit Announcement State variables are declared above

  const [editAttachments, setEditAttachments] = useState<{ file: File | null, name: string, preview: string | null }[]>([]);
  const editAttachmentInputRef = useRef<HTMLInputElement>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (editAttachments.length + files.length > 10) {
      alert('Maksimal 10 lampiran diperbolehkan');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setEditAttachments((prev) => {
          const updated = [...prev, { file, name: file.name, preview: dataUrl }];
          setEditAttachmentName(updated.map((a) => a.name).join(', '));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const removeEditAttachment = (index: number) => {
    const updated = editAttachments.filter((_, i) => i !== index);
    setEditAttachments(updated);
    setEditAttachmentName(updated.map(a => a.name).join(', '));
  };

  // Delete Announcement State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnnouncements = (q: string = '') => {
    setIsLoading(true);
    fetch(`/api/announcements?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        setAnnouncements(apiItems.length > 0 ? apiItems : STITCH_MOCK_ANNOUNCEMENTS_5);
      })
      .catch((e) => {
        console.error(e);
        setAnnouncements(STITCH_MOCK_ANNOUNCEMENTS_5);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAnnouncements();
    fetch('/api/profile/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch(() => { });
  }, []);

  // Prevent background scrolling when any modal is open
  useEffect(() => {
    if (isEditModalOpen || isAddModalOpen || isDeleteModalOpen || previewAttachment || selectedAnnouncement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditModalOpen, isAddModalOpen, isDeleteModalOpen, previewAttachment, selectedAnnouncement]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnnouncements(searchQuery);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          excerpt: newExcerpt || newContent.slice(0, 120),
          content: newContent,
          attachmentName: newAttachmentName || undefined,
          publishedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Pengumuman baru berhasil dipublikasikan!');
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewExcerpt('');
        setNewContent('');
        setNewAttachmentName('');
        fetchAnnouncements('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(data.message || 'Gagal menyimpan pengumuman');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan pengumuman');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditTitle(item.title || '');
    setEditStatus((item.status === 'MENUNGGU' || item.status === 'Menunggu' || item.status === 'DRAFT') ? 'Menunggu' : 'Terbit');
    setEditContent(item.content || item.body || item.excerpt || '');
    setEditAttachmentName(item.attachmentName || '');

    const parsed = parseAnnouncementAttachments(item.attachmentName, item.attachmentUrl);
    setEditAttachments(
      parsed.map((p) => ({
        file: null,
        name: p.name,
        preview: p.url || null,
      }))
    );

    setIsEditModalOpen(true);
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement || !editTitle.trim() || !editContent.trim()) {
      alert('Judul dan Deskripsi pengumuman wajib diisi.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/announcements/${selectedAnnouncement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          attachmentName: editAttachmentName,
          attachmentUrl: editAttachments.length > 0 ? JSON.stringify(editAttachments.map((a) => a.preview || '')) : null,
          status: editStatus === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = {
          ...selectedAnnouncement,
          title: editTitle,
          content: editContent,
          body: editContent,
          attachmentName: editAttachmentName,
          attachmentUrl: editAttachments.length > 0 ? JSON.stringify(editAttachments.map((a) => a.preview || '')) : null,
          status: editStatus === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
          updatedAt: data.data?.updatedAt || new Date().toISOString(),
          editor: currentUser,
        };
        setSelectedAnnouncement(updated);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === selectedAnnouncement.id ? updated : a))
        );
        setIsEditModalOpen(false);
      } else {
        // Fallback for mock items
        const updated = {
          ...selectedAnnouncement,
          title: editTitle,
          content: editContent,
          body: editContent,
          attachmentName: editAttachmentName,
          status: editStatus === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
          updatedAt: new Date().toISOString(),
          editor: currentUser,
        };
        setSelectedAnnouncement(updated);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === selectedAnnouncement.id ? updated : a))
        );
        setIsEditModalOpen(false);
      }
    } catch {
      const updated = {
        ...selectedAnnouncement,
        title: editTitle,
        content: editContent,
        body: editContent,
        attachmentName: editAttachmentName,
        updatedAt: new Date().toISOString(),
        editor: currentUser,
      };
      setSelectedAnnouncement(updated);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === selectedAnnouncement.id ? updated : a))
      );
      setIsEditModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/announcements/${selectedAnnouncement.id}`, {
        method: 'DELETE',
      });
      setAnnouncements((prev) => prev.filter((a) => a.id !== selectedAnnouncement.id));
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    } catch {
      setAnnouncements((prev) => prev.filter((a) => a.id !== selectedAnnouncement.id));
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumbs matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Kabar Kedinasan
          </span>
          <span className="text-[#757682]">&gt;</span>
          <span className="text-[#1a1b20] font-bold">Pengumuman</span>
        </nav>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Pengumuman
            </h1>
            <p className="text-sm sm:text-base text-[#444650]">
              Surat edaran, cuti, dan arahan pimpinan
            </p>
          </div>
          <Link
            href="/kabar-kedinasan/pengumuman/tambah"
            className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </Link>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Left: Tampilkan [ 5 v ] data */}
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
                  {[5, 10, 15].filter((n) => n !== itemsPerPage).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1); // Reset page when changing items per page
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Left: Filter Penulis */}
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

            {/* Right: Search Input Bar with embedded search icon */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Pengumuman ..."
                className="w-full pl-3 pr-10 py-2 border border-[#c5c6d2] rounded-lg text-sm focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] bg-white text-[#1a1b20] placeholder-[#757682] shadow-xs transition-colors"
              />
              <button
                type="submit"
                aria-label="Cari Pengumuman"
                className="absolute right-3 text-[#757682] hover:text-[#00113a] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Announcement List (5 Cards matching Stitch) */}
        {isLoading ? (
          <div className="flex flex-col gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl p-6 bg-slate-50 animate-pulse h-32" />
            ))}
          </div>
        ) : announcements.filter((item) => {
          const isPublished = item.status === 'Terbit' || item.status === 'TERBIT' || (!item.status);
          if (isPublished) return true;
          if (!currentUser) return false;
          if (isUserAdmin(currentUser)) return true;
          return currentUser.name === (item.authorName || item.author?.name);
        }).length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-white my-8">
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Pengumuman Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau tambahkan pengumuman baru.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {announcements.filter((item) => {
              const isPublished = item.status === 'Terbit' || item.status === 'TERBIT' || (!item.status);
              if (isPublished) return true;
              if (!currentUser) return false;
              if (isUserAdmin(currentUser)) return true;
              return currentUser.name === (item.authorName || item.author?.name);
            }).filter(item => filterAuthor === 'all' || (typeof currentUser !== 'undefined' && currentUser && ((item as any).authorName === currentUser.name || ((item as any).author && (item as any).author.name === currentUser.name) || (item as any).name === currentUser.name || (item as any).authorId === currentUser.id))).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => {
              const displayDate = item.publishedAt
                ? formatDate(item.publishedAt)
                : formatDate(new Date());

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#c5c6d2] rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 relative group flex flex-col sm:flex-row gap-4 justify-between items-stretch"
                >
                  <div className="flex-grow pr-0 sm:pr-4 flex flex-col justify-between">
                    <div>
                      <h2
                        onClick={() => setSelectedAnnouncement(item)}
                        className="text-base sm:text-lg font-bold text-[#00113a] mb-2 group-hover:text-[#2a4386] transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {item.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#444650] mb-3 line-clamp-2 leading-relaxed">
                        {item.excerpt || item.body?.slice(0, 140) || item.content?.slice(0, 140)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#757682] mt-3">
                      {displayDate}
                    </span>
                  </div>

                  <div className="shrink-0 mt-4 sm:mt-auto self-end flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${(item.status === 'MENUNGGU' || item.status === 'Menunggu' || item.status === 'DRAFT')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                    >
                      Status: {(item.status === 'MENUNGGU' || item.status === 'Menunggu' || item.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedAnnouncement(item)}
                      className="bg-[#00113a] text-white hover:bg-[#2a4386] font-semibold text-xs py-1.5 px-4 rounded-full transition-all shadow-sm cursor-pointer"
                    >
                      <span>Lihat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalItems={announcements.filter((item) => {
          const isPublished = item.status === 'Terbit' || item.status === 'TERBIT' || (!item.status);
          if (isPublished) return true;
          if (!currentUser) return false;
          if (isUserAdmin(currentUser)) return true;
          return currentUser.name === (item.authorName || item.author?.name);
        }).length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Detail Pengumuman Modal on List View (EXACT Stitch Screen Spec) */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center overflow-y-auto px-4 md:px-16 py-8 animate-fadeIn">
          {/* Document Container */}
          <article className="bg-white border border-[#c5c6d2] rounded shadow-2xl relative pt-12 pb-8 px-6 md:px-12 flex flex-col max-w-4xl w-[95%] my-auto max-h-[90vh] overflow-y-auto">
            {/* Red Close Button matching Stitch */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 bg-[#ba1a1a] hover:bg-[#93000a] text-white w-8 h-8 flex items-center justify-center rounded transition-colors shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Section */}
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1b20] mb-4 leading-snug">
                {selectedAnnouncement.title}
              </h1>

              <div className="text-sm text-[#1a1b20]">
                <p className="font-bold">Tanggal Pengumuman</p>
                <p className="text-[#1a1b20] mt-0.5">
                  {selectedAnnouncement.publishedAt
                    ? formatDate(selectedAnnouncement.publishedAt)
                    : formatDate(new Date())}
                </p>
              </div>
            </header>




            {/* Content Body (Uraian Pengumuman) */}
            <div className="prose max-w-none text-sm sm:text-base text-[#1a1b20] mb-8 flex-grow leading-relaxed">
              <p className="font-bold text-[#1a1b20] mb-2">Uraian Pengumuman</p>
              <div className="text-[#1a1b20] space-y-3 whitespace-pre-line leading-relaxed">
                {selectedAnnouncement.content ||
                  selectedAnnouncement.body ||
                  `[Isi pengumuman lengkap akan ditampilkan di sini. Area ini mendukung format teks panjang, list, dan elemen tipografi standar lainnya sesuai dengan desain Corporate Modern.]`}
              </div>
            </div>

            {/* Attachments Section (Render real attachments uploaded by user) */}
            {(() => {
              const attachments = parseAnnouncementAttachments(
                selectedAnnouncement.attachmentName,
                selectedAnnouncement.attachmentUrl
              );
              if (attachments.length === 0) return null;

              return (
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-3 border-b border-[#c5c6d2]/60 pb-2">
                    <h2 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider">
                      Lampiran ({attachments.length})
                    </h2>
                    <span className="text-[11px] font-medium text-slate-500">
                      {attachments.some(a => Boolean(a.url && a.url !== '#' && a.url !== '-'))
                        ? 'Klik berkas untuk melihat atau mengunduh'
                        : 'Daftar berkas terlampir'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {attachments.map((att) => {
                      const hasUrl = Boolean(att.url && att.url !== '#' && att.url !== '-');

                      if (att.isImage) {
                        return (
                          <div
                            key={att.id}
                            onClick={() => {
                              if (hasUrl) {
                                setPreviewAttachment(att.url);
                              }
                            }}
                            className={`bg-[#f8f9fc] border border-[#c5c6d2] rounded-lg p-2.5 flex items-center gap-3 transition-all shadow-2xs ${
                              hasUrl
                                ? 'hover:bg-[#eef2ff] hover:border-blue-400 cursor-pointer group'
                                : 'cursor-default'
                            }`}
                            title={hasUrl ? `Lihat gambar: ${att.name}` : att.name}
                          >
                            <div className="w-12 h-12 rounded bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-300">
                              {hasUrl ? (
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold text-slate-800 truncate ${hasUrl ? 'group-hover:text-blue-700' : ''}`}>
                                {att.name}
                              </p>
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Gambar
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Dokumen / PDF
                      return (
                        <div
                          key={att.id}
                          onClick={() => {
                            if (hasUrl) {
                              handleOpenFile(att.url, att.name);
                            }
                          }}
                          className={`bg-[#f8f9fc] border border-[#c5c6d2] rounded-lg p-2.5 flex items-center gap-3 transition-all shadow-2xs ${
                            hasUrl
                              ? 'hover:bg-[#eef2ff] hover:border-blue-400 cursor-pointer group'
                              : 'cursor-default'
                          }`}
                          title={hasUrl ? `Buka dokumen: ${att.name}` : att.name}
                        >
                          <div className="w-12 h-12 rounded bg-red-50 text-red-600 flex-shrink-0 flex items-center justify-center border border-red-200 group-hover:bg-red-100 transition-colors">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold text-slate-800 truncate ${hasUrl ? 'group-hover:text-blue-700' : ''}`}>
                              {att.name}
                            </p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-red-100 text-red-800 border border-red-200">
                              {att.name.toLowerCase().endsWith('.pdf') ? 'PDF Dokumen' : 'Dokumen'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })()}

            {/* Footer / Meta Section matching Stitch */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-[#c5c6d2] pt-6 gap-4">
              <div className="flex flex-row gap-6">
                <div className="text-sm text-[#1a1b20] w-[220px]">
                  <p className="font-bold">Dibuat oleh</p>
                  <p className="text-[#1a1b20]">{selectedAnnouncement.author?.name || 'Ahmad Fauzi'}</p>
                  <p className="text-[#444650] mb-1">
                    {selectedAnnouncement.publishedAt
                      ? formatDate(selectedAnnouncement.publishedAt)
                      : formatDate(new Date())}
                  </p>
                  <p className="text-[#444650] font-medium">
                    Status: {(selectedAnnouncement.status === 'MENUNGGU' || selectedAnnouncement.status === 'Menunggu' || selectedAnnouncement.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                  </p>
                </div>

                {Boolean(selectedAnnouncement.editor?.name || (selectedAnnouncement as any).editorName) && (
                  <>
                    <div className="border-l border-[#c5c6d2]" />
                    <div className="text-sm text-[#1a1b20] w-[220px]">
                      <p className="font-bold">Diperbarui oleh</p>
                      <p className="text-[#1a1b20]">{selectedAnnouncement.editor?.name || (selectedAnnouncement as any).editorName}</p>
                      <p className="text-[#444650] mb-1">
                        {selectedAnnouncement.updatedAt ? formatDate(selectedAnnouncement.updatedAt) : ''}
                      </p>
                      <p className="text-[#444650] font-medium">
                        Status: {(selectedAnnouncement.status === 'MENUNGGU' || selectedAnnouncement.status === 'Menunggu' || selectedAnnouncement.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {canManageContent(currentUser, selectedAnnouncement) && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(selectedAnnouncement)}
                    className="px-6 py-2 border border-[#757682] rounded text-[#1a1b20] hover:bg-[#efedf3] hover:border-[#00113a] transition-colors font-bold text-sm min-w-[90px] text-center"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-6 py-2 border border-[#757682] rounded text-[#1a1b20] hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-colors font-bold text-sm min-w-[90px] text-center"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </footer>
          </article>
        </div>
      )}

      {/* Lightbox Preview for Attachment Image */}
      {previewAttachment && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewAttachment(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewAttachment}
              alt="Lampiran Preview"
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenFile(previewAttachment, 'lampiran-pengumuman.jpg')}
                className="bg-white/20 hover:bg-white text-white hover:text-slate-900 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Buka / Unduh Berkas</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="bg-white/20 hover:bg-white text-white hover:text-slate-900 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPreviewAttachment(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:-right-10 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Pengumuman Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto overscroll-contain animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#00113a]">Edit Pengumuman</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Pengumuman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1a1b20] mb-1.5 flex items-center justify-between">
                  <span>Lampiran (Maks. 10 File)</span>
                  <span className="text-[#757682] font-normal">{editAttachments.length}/10</span>
                </label>
                <div className="space-y-4">
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={editAttachments.length > 0 ? `${editAttachments.length} file dipilih` : ''}
                      placeholder="Upload maksimal 10 file..."
                      className="flex-grow border border-r-0 border-[#c5c6d2] rounded-l-md p-2.5 text-sm bg-white text-[#444650] cursor-default focus:outline-none"
                    />
                    <input
                      ref={editAttachmentInputRef}
                      type="file"
                      multiple
                      onChange={handleEditAttachmentChange}
                      className="hidden"
                     suppressHydrationWarning />
                    <button
                      type="button"
                      onClick={() => editAttachmentInputRef.current?.click()}
                      disabled={editAttachments.length >= 10}
                      className="px-6 bg-[#e9e7ee] border border-[#c5c6d2] rounded-r-md text-[#1a1b20] font-bold text-xs sm:text-sm hover:bg-[#e1e3e4] transition-colors disabled:opacity-50"
                    >
                      Upload
                    </button>
                  </div>

                  {/* Previews */}
                  {editAttachments.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {editAttachments.map((att, idx) => (
                        <div key={idx} className="relative group bg-[#e9e7ee] border border-[#c5c6d2] rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center">
                          {att.preview ? (
                            <img src={att.preview} alt={att.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 p-2">
                              <FileText className="w-8 h-8 text-[#00113a]" />
                              <span className="text-[10px] font-bold text-center break-all line-clamp-2 text-[#00113a]">{att.name}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeEditAttachment(idx)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {att.preview && (
                            <span className="absolute bottom-0 w-full bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 truncate text-center">
                              {att.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Edit Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-center">
                <label className="font-bold text-xs md:text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1">
                  <span>Status</span>
                  <span className="ml-auto pr-4 hidden md:inline">:</span>
                </label>
                <div className="md:col-span-3 relative w-full md:w-56" ref={editStatusMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsEditStatusMenuOpen(!isEditStatusMenuOpen)}
                    className={`w-full bg-[#5a626a] hover:bg-[#4d545b] text-white py-2.5 px-4 font-medium text-sm flex items-center justify-between transition-colors shadow-xs cursor-pointer ${isEditStatusMenuOpen ? 'rounded-t-md' : 'rounded-md'
                      }`}
                  >
                    <span className="truncate">{editStatus || 'Jenis Status'}</span>
                    <ChevronDown className={`w-4 h-4 text-white transition-transform ${isEditStatusMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isEditStatusMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border border-[#c5c6d2] rounded-b-md shadow-lg z-50 overflow-hidden">
                      <div className="flex flex-col text-sm text-[#1a1b20]">
                        <button
                          type="button"
                          onClick={() => { setEditStatus('Terbit'); setIsEditStatusMenuOpen(false); }}
                          className={`text-left px-4 py-2.5 hover:bg-[#efedf3] transition-colors ${editStatus === 'Terbit' ? 'bg-[#efedf3] font-bold' : ''}`}
                        >
                          Terbit
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditStatus('Menunggu'); setIsEditStatusMenuOpen(false); }}
                          className={`text-left px-4 py-2.5 hover:bg-[#efedf3] transition-colors ${editStatus === 'Menunggu' ? 'bg-[#efedf3] font-bold' : ''}`}
                        >
                          Menunggu
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c5c6d2] animate-fadeIn">
            <h2 className="text-xl font-bold text-[#00113a] mb-2">Hapus Pengumuman?</h2>
            <p className="text-sm text-[#444650] mb-6">
              Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAnnouncement}
                className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Pengumuman Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#00113a]">Tambah Pengumuman Baru</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul pengumuman resmi..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Ringkasan Singkat (Excerpt)
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan 1 kalimat pengumuman..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Nama Dokumen Lampiran (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat_Edaran_Pengumuman_2026.pdf"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Isi Pengumuman Lengkap
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi pengumuman secara lengkap di sini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


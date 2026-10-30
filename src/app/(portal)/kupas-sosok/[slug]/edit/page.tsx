'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar as CalendarIcon,
  Bold,
  Italic,
  Underline,
  List,
  Link2,
  Heading1,
  Heading2,
  Type,
  Quote,
  ImageIcon,
  Upload,
  CheckCircle,
  FileText,
  Video,
  X,
  Check,
} from 'lucide-react';
import {
  STITCH_MOCK_FIGURES_6,
  getStoredFigures,
  saveStoredFigures,
} from '@/lib/mock-kupas-sosok';
import { SATUAN_KERJA_OPTIONS } from '@/lib/constants';
import { canManageContent } from '@/lib/utils';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            height *= MAX_HEIGHT / height;
            width = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function getSafeFigureFileName(name?: string | null, url?: string | null, fallback = 'foto-sosok.jpg'): string {
  if (name && name.trim()) return name.trim();
  if (!url) return fallback;
  if (url.startsWith('data:')) {
    const mimeMatch = url.match(/data:image\/([a-zA-Z0-9]+);/);
    const ext = mimeMatch ? (mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1]) : 'png';
    return `foto-tokoh.${ext}`;
  }
  const cleanUrl = url.split('?')[0].split('#')[0];
  const last = cleanUrl.split('/').pop();
  return last && last.length < 100 && !last.includes(';') ? last : fallback;
}

export default function EditKupasSosokPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || '';

  // Form states
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [status, setStatus] = useState<'Terbit' | 'Menunggu' | ''>('Terbit');
  const [deskripsiHtml, setDeskripsiHtml] = useState('');
  const [gambarFileName, setGambarFileName] = useState('');
  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [lampiranAttachments, setLampiranAttachments] = useState<Array<{ file?: File; name: string; preview: string | null }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [gambarError, setGambarError] = useState('');
  const [lampiranError, setLampiranError] = useState('');
  const [previewAttachmentImage, setPreviewAttachmentImage] = useState<string | null>(null);

  useEffect(() => {
    if (gambarError) {
      const timer = setTimeout(() => setGambarError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [gambarError]);

  useEffect(() => {
    if (lampiranError) {
      const timer = setTimeout(() => setLampiranError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [lampiranError]);

  // Active toolbar formatting states
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
  });

  // DatePicker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Status dropdown state
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  // Styling dropdown state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

  // Unit / Satuan Kerja dropdown state
  const [isUnitKerjaDropdownOpen, setIsUnitKerjaDropdownOpen] = useState(false);
  const unitKerjaDropdownRef = useRef<HTMLDivElement>(null);

  // Editor and Input refs
  const editorRef = useRef<HTMLDivElement>(null);
  const gambarInputRef = useRef<HTMLInputElement>(null);
  const lampiranInputRef = useRef<HTMLInputElement>(null);
  const hasInitializedEditor = useRef(false);

  // Fetch initial data
  useEffect(() => {
    try {
      localStorage.removeItem('portal_figures_data');
    } catch { }
    if (!rawSlug) return;

    const storedFigures = getStoredFigures();
    const matchedFigure = storedFigures.find(
      (m) =>
        m.slug === rawSlug ||
        m.id === rawSlug ||
        m.name.toLowerCase().includes(rawSlug.toLowerCase())
    );

    if (matchedFigure) {
      setNama(matchedFigure.name || '');
      setJabatan(matchedFigure.position || '');
      setUnitKerja(matchedFigure.unitKerja || '');
      if (matchedFigure.status) setStatus(matchedFigure.status);
      if (matchedFigure.photoUrl) {
        setGambarPreview(matchedFigure.photoUrl);
        setGambarFileName(getSafeFigureFileName(matchedFigure.coverImageName, matchedFigure.photoUrl));
      }
      const contentVal = matchedFigure.fullStory || '';
      setDeskripsiHtml(contentVal);
      if (matchedFigure.publishedAt) {
        const parsed = new Date(matchedFigure.publishedAt);
        if (!isNaN(parsed.getTime())) {
          setTanggal(parsed);
          setViewDate(parsed);
        }
      }
      if (matchedFigure.attachmentUrl) {
        try {
          const parsed = JSON.parse(matchedFigure.attachmentUrl);
          if (Array.isArray(parsed)) {
            const names = (matchedFigure.attachmentName || '').split(',').map((n: string) => n.trim()).filter(Boolean);
            setLampiranAttachments(
              parsed.map((att: any, idx: number) => {
                if (typeof att === 'string') {
                  return {
                    name: names[idx] || `Lampiran ${idx + 1}`,
                    preview: att,
                  };
                }
                return {
                  name: att.name || att.label || names[idx] || `Lampiran ${idx + 1}`,
                  preview: att.url || att.src || att.preview || null,
                };
              })
            );
          }
        } catch {
          if (typeof matchedFigure.attachmentUrl === 'string') {
            setLampiranAttachments([{
              name: matchedFigure.attachmentName || 'Lampiran',
              preview: matchedFigure.attachmentUrl,
            }]);
          }
        }
      } else if (matchedFigure.attachments && matchedFigure.attachments.length > 0) {
        setLampiranAttachments(
          matchedFigure.attachments.map((att: any) => {
            const name = att.label || att.name || (att.src ? att.src.split('/').pop() : `Lampiran ${att.id}`);
            const preview = att.src || (name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null);
            return {
              name,
              preview: preview && preview.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? preview : null,
            };
          })
        );
      } else if (matchedFigure.attachmentName) {
        const names = matchedFigure.attachmentName.split(',').map((n: string) => n.trim()).filter(Boolean);
        setLampiranAttachments(
          names.map((name: string) => ({
            name,
            preview: name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null,
          }))
        );
      }
    }

    Promise.all([
      fetch(`/api/figure-profiles/${rawSlug}`).then((res) => res.json()),
      fetch('/api/profile/me').then((res) => res.json()).catch(() => ({ success: false })),
    ])
      .then(([data, profileData]) => {
        const currentUser = profileData?.success ? profileData.data : null;
        if (data.success && data.data) {
          const item = data.data;

          if (currentUser && !canManageContent(currentUser, item)) {
            alert('Anda tidak memiliki izin untuk mengedit profil sosok ini.');
            router.push(`/kupas-sosok/${rawSlug}`);
            return;
          }

          setNama(item.name || '');
          setJabatan(item.position || '');
          setUnitKerja(item.unitKerja || '');
          if (item.photoUrl) {
            setGambarPreview(item.photoUrl);
            setGambarFileName(getSafeFigureFileName(item.coverImageName, item.photoUrl));
          }
          const bodyVal = item.fullStory || item.body || '';
          setDeskripsiHtml(bodyVal);
          if (item.publishedAt) {
            const parsed = new Date(item.publishedAt);
            if (!isNaN(parsed.getTime())) {
              setTanggal(parsed);
              setViewDate(parsed);
            }
          }
          if (item.attachmentUrl) {
            try {
              const parsed = JSON.parse(item.attachmentUrl);
              if (Array.isArray(parsed)) {
                const names = (item.attachmentName || '').split(',').map((n: string) => n.trim()).filter(Boolean);
                setLampiranAttachments(
                  parsed.map((att: any, idx: number) => {
                    if (typeof att === 'string') {
                      return {
                        name: names[idx] || `Lampiran ${idx + 1}`,
                        preview: att,
                      };
                    }
                    return {
                      name: att.name || att.label || names[idx] || `Lampiran ${idx + 1}`,
                      preview: att.url || att.src || att.preview || null,
                    };
                  })
                );
              }
            } catch {
              if (typeof item.attachmentUrl === 'string') {
                setLampiranAttachments([{
                  name: item.attachmentName || 'Lampiran',
                  preview: item.attachmentUrl,
                }]);
              }
            }
          } else if (item.attachments && item.attachments.length > 0) {
            setLampiranAttachments(
              item.attachments.map((att: any) => {
                const name = att.label || att.name || (att.src ? att.src.split('/').pop() : `Lampiran ${att.id}`);
                const preview = att.src || (name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null);
                return {
                  name,
                  preview: preview && preview.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? preview : null,
                };
              })
            );
          } else if (item.attachmentName || item.attachment) {
            const attStr = item.attachmentName || item.attachment || '';
            const names = attStr.split(',').map((n: string) => n.trim()).filter(Boolean);
            setLampiranAttachments(
              names.map((name: string) => ({
                name,
                preview: name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null,
              }))
            );
          }
        }
      })
      .catch((err) => {
        console.warn('API figure fetch failed, using stored mock:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rawSlug]);

  // Sync editor innerHTML when deskripsiHtml changes initially
  useEffect(() => {
    if (editorRef.current && deskripsiHtml && !hasInitializedEditor.current) {
      editorRef.current.innerHTML = deskripsiHtml;
      hasInitializedEditor.current = true;
    }
  }, [deskripsiHtml]);

  // Check active styles under selection
  const checkActiveStyles = useCallback(() => {
    try {
      setActiveStyles({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        unorderedList: document.queryCommandState('insertUnorderedList'),
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', checkActiveStyles);
    return () => {
      document.removeEventListener('selectionchange', checkActiveStyles);
    };
  }, [checkActiveStyles]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
      if (
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setIsStatusMenuOpen(false);
      }
      if (
        unitKerjaDropdownRef.current &&
        !unitKerjaDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUnitKerjaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDDMMYYYY = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const selectCalendarDay = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setTanggal(newDate);
    setIsDatePickerOpen(false);
  };

  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    const remaining = 35 - days.length;
    for (let i = 1; i <= (remaining > 0 ? remaining : 42 - days.length); i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const monthNamesIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const execFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setDeskripsiHtml(editorRef.current.innerHTML);
    }
    checkActiveStyles();
  };

  const handleLinkInsert = () => {
    const url = prompt('Masukkan URL tautan:', 'https://');
    if (url) {
      execFormat('createLink', url);
    }
  };

  const handleGambarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      const validExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
        if (gambarInputRef.current) gambarInputRef.current.value = '';
        setGambarFileName('');
        setGambarPreview(null);
        setGambarError('Berkas harus berupa .jpg/ .png');
        return;
      }

      setGambarError('');

      if (file.size > 5 * 1024 * 1024) {
        if (gambarInputRef.current) gambarInputRef.current.value = '';
        setGambarFileName('');
        setGambarPreview(null);
        setGambarError('Berkas maksimal 5MB');
        return;
      }
      setGambarFileName(file.name);
      try {
        const compressed = await compressImage(file);
        setGambarPreview(compressed);
      } catch {
        const dataUrl = await readFileAsDataUrl(file);
        setGambarPreview(dataUrl);
      }
    }
  };

  const handleRemoveGambar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGambarFileName('');
    setGambarPreview(null);
    setGambarError('');
    if (gambarInputRef.current) {
      gambarInputRef.current.value = '';
    }
  };

  const handleLampiranFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validExtensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'];
    const invalidFile = files.find((f) => {
      const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
      return !validExtensions.includes(ext);
    });

    if (invalidFile) {
      setLampiranError('Berkas harus berupa .pdf/ .docx/ .jpg/ .png');
      if (lampiranInputRef.current) lampiranInputRef.current.value = '';
      return;
    }

    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setLampiranError(`Berkas "${oversized.name}" melebihi ukuran maksimal 5MB`);
      if (lampiranInputRef.current) lampiranInputRef.current.value = '';
      return;
    }

    if (lampiranAttachments.length + files.length > 5) {
      setLampiranError('Maksimal 5 berkas diperbolehkan');
      if (lampiranInputRef.current) lampiranInputRef.current.value = '';
      return;
    }

    setLampiranError('');

    const newAttachments: Array<{ file: File; name: string; preview: string | null }> = [];
    for (const file of files) {
      let preview: string | null = null;
      try {
        preview = await readFileAsDataUrl(file);
      } catch {
        preview = null;
      }
      newAttachments.push({ file, name: file.name, preview });
    }

    setLampiranAttachments([...lampiranAttachments, ...newAttachments]);
    if (lampiranInputRef.current) {
      lampiranInputRef.current.value = '';
    }
  };

  const handleRemoveLampiran = (index: number) => {
    setLampiranError('');
    setLampiranAttachments(lampiranAttachments.filter((_, i) => i !== index));
    if (lampiranInputRef.current) lampiranInputRef.current.value = '';
  };

  const handleDownloadAttachment = (att: { file?: File; name: string; preview: string | null }) => {
    if (att.file) {
      const url = URL.createObjectURL(att.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = att.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (att.preview) {
      const a = document.createElement('a');
      a.href = att.preview;
      a.download = att.name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(`Mengunduh berkas ${att.name}...`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama judul Kupas Sosok wajib diisi');
      return;
    }

    const storyContent = deskripsiHtml.trim();
    const plainStory = editorRef.current?.innerText?.trim() || '';

    if (!storyContent && !plainStory) {
      alert('Kisah & Perjalanan wajib diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      try {
        localStorage.removeItem('portal_figures_data');
      } catch { }

      try {
        const userStr = localStorage.getItem('portal_user');
        const userName = userStr ? JSON.parse(userStr)?.name : 'Administrator Perpusnas';
        localStorage.setItem(`last_editor_${rawSlug}`, userName || 'Administrator Perpusnas');
      } catch { }

      const payload = {
        name: nama,
        position: jabatan.trim() || undefined,
        unitKerja: unitKerja.trim() || undefined,
        quote: plainStory.slice(0, 160).trim(),
        fullStory: storyContent || plainStory,
        photoUrl: gambarPreview || '',
        coverImageName: gambarFileName || undefined,
        attachmentName: lampiranAttachments.length > 0 ? lampiranAttachments.map((a) => a.name).join(', ') : undefined,
        attachmentUrl: lampiranAttachments.length > 0 ? JSON.stringify(lampiranAttachments.map((a) => ({ name: a.name, url: a.preview || '' }))) : undefined,
        status: status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
        publishedAt: tanggal.toISOString(),
      };

      // Attempt API PUT
      try {
        await fetch(`/api/figure-profiles/${rawSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('API PUT figure failed, local storage updated', e);
      }

      setSuccessMessage('Profil sosok berhasil diperbarui!');
      setTimeout(() => {
        router.push(`/kupas-sosok/${rawSlug}`);
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memperbarui sosok.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#fcfcff] min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10">
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-48" />
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="h-96 bg-slate-100 border border-[#c5c6d2] rounded-lg p-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fcfcff] min-h-screen">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 text-[#1a1b20]">
        {/* Breadcrumbs matching Stitch */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[#444650] text-sm mb-8 font-normal"
        >
          <Link
            href="/beranda"
            className="hover:text-[#00113a] transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link
            href="/kupas-sosok"
            className="hover:text-[#00113a] transition-colors"
          >
            Kupas Sosok
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#1a1b20] font-medium">Edit Sosok</span>
        </nav>

        {/* Page Title matching Stitch */}
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#00113a] mb-10 tracking-tight">
          Edit Kupas Sosok
        </h1>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container matching Stitch */}
        <div className="bg-white border border-[#c5c6d2] rounded-lg p-6 md:p-8 shadow-xs">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-[200px_auto] gap-6 mb-8 items-start">
              {/* 1. Nama Sosok / Judul */}
              <label
                htmlFor="nama"
                className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2"
              >
                Judul <span className="text-red-500">*</span> <span className="float-right hidden md:inline">:</span>
              </label>
              <div>
                <input
                  id="nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama judul Kupas Sosok"
                  className="w-full border border-[#c5c6d2] rounded p-3 text-sm sm:text-base text-[#1a1b20] placeholder-[#757682] focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] outline-none transition-colors"
                />
              </div>

              {/* 2. Tanggal */}
              <label
                htmlFor="tanggal"
                className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2"
              >
                Tanggal <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="relative w-full md:w-1/3" ref={datePickerRef}>
                <input
                  id="tanggal"
                  type="text"
                  readOnly
                  value={formatDDMMYYYY(tanggal)}
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  placeholder="DD/MM/YYYY"
                  className="w-full border border-[#c5c6d2] rounded p-3 pr-10 text-sm sm:text-base text-[#1a1b20] placeholder-[#757682] focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] outline-none transition-colors bg-[#f4f3f9] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00113a] cursor-pointer p-0.5"
                  aria-label="Pilih tanggal"
                >
                  <CalendarIcon className="w-5 h-5" />
                </button>

                {/* DatePicker Popover */}
                {isDatePickerOpen && (
                  <div className="absolute top-14 left-0 z-50 bg-white border border-[#c5c6d2] rounded-xl shadow-2xl p-4 w-72 animate-fadeIn">
                    <div className="flex justify-between items-center mb-3">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650]"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-bold text-sm text-[#00113a]">
                        {monthNamesIndo[viewDate.getMonth()]}{' '}
                        {viewDate.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650]"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs font-bold text-[#757682] mb-2">
                      <span>Min</span>
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span>Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {getCalendarDays().map((item, idx) => {
                        const isSelected =
                          item.isCurrentMonth &&
                          tanggal.getDate() === item.day &&
                          tanggal.getMonth() === viewDate.getMonth() &&
                          tanggal.getFullYear() === viewDate.getFullYear();

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!item.isCurrentMonth}
                            onClick={() => selectCalendarDay(item.day)}
                            className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition-colors ${!item.isCurrentMonth
                              ? 'text-slate-300 cursor-not-allowed'
                              : isSelected
                                ? 'bg-[#00113a] text-white font-bold shadow-xs'
                                : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                              }`}
                          >
                            {item.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Jabatan & Unit Kerja */}
              <label
                htmlFor="jabatan"
                className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2"
              >
                Jabatan &amp; Unit Kerja <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  id="jabatan"
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Tuliskan jabatan"
                  className="w-full border border-[#c5c6d2] rounded p-3 text-sm sm:text-base text-[#1a1b20] placeholder-[#757682] focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] outline-none transition-colors"
                />
                <div className="relative" ref={unitKerjaDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsUnitKerjaDropdownOpen(!isUnitKerjaDropdownOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 bg-[#5b6b82] text-white text-sm sm:text-base font-bold rounded-xl hover:bg-[#485568] transition-colors cursor-pointer shadow-xs text-left"
                  >
                    <span className="truncate pr-2">{unitKerja || 'Pilih Unit Kerja'}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isUnitKerjaDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUnitKerjaDropdownOpen && (
                    <div className="absolute left-0 w-full max-h-60 overflow-y-auto mt-1.5 bg-white border border-[#c5c6d2] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {unitKerja && !SATUAN_KERJA_OPTIONS.includes(unitKerja) && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUnitKerjaDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer bg-slate-100 text-[#00113a]"
                        >
                          <span className="truncate pr-2">{unitKerja} (Nilai Saat Ini)</span>
                          <Check className="w-4 h-4 text-[#007BFF] shrink-0" />
                        </button>
                      )}
                      {SATUAN_KERJA_OPTIONS.map((item) => {
                        const isSelected = unitKerja === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setUnitKerja(item);
                              setIsUnitKerjaDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-slate-100 text-[#00113a] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate pr-2">{item}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#007BFF] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Deskripsi / Kisah Lengkap */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Kisah & Perjalanan <span className="text-red-500">*</span> <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="border border-[#c5c6d2] rounded overflow-hidden">
                {/* Formatting Toolbar */}
                <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex flex-wrap items-center gap-1">


                  <div className="h-5 w-px bg-[#c5c6d2] mx-1" />

                  {/* Format buttons */}
                  <button
                    type="button"
                    onClick={() => execFormat('bold')}
                    className={`p-1.5 rounded transition-colors ${activeStyles.bold
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650] hover:bg-white'
                      }`}
                    title="Tebal (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('italic')}
                    className={`p-1.5 rounded transition-colors ${activeStyles.italic
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650] hover:bg-white'
                      }`}
                    title="Miring (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('underline')}
                    className={`p-1.5 rounded transition-colors ${activeStyles.underline
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650] hover:bg-white'
                      }`}
                    title="Garis bawah (Ctrl+U)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('insertUnorderedList')}
                    className={`p-1.5 rounded transition-colors ${activeStyles.unorderedList
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650] hover:bg-white'
                      }`}
                    title="Daftar Bullet"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleLinkInsert}
                    className="p-1.5 text-[#444650] hover:bg-white rounded transition-colors"
                    title="Sisipkan Link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Editable Area */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => setDeskripsiHtml(e.currentTarget.innerHTML)}
                  onKeyUp={checkActiveStyles}
                  onMouseUp={checkActiveStyles}
                  className="p-4 min-h-[220px] max-h-[450px] overflow-y-auto text-sm sm:text-base text-[#1a1b20] focus:outline-none leading-relaxed prose max-w-none"
                />
              </div>

              {/* 6. Foto Kupas Sosok */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Gambar <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={gambarFileName}
                      placeholder="Nama File.jpg/png"
                      className="flex-grow border border-[#c5c6d2] rounded-l p-3 text-sm sm:text-base outline-none bg-[#f4f3f9] text-[#1a1b20] placeholder-[#757682]"
                    />
                    <button
                      type="button"
                      onClick={() => gambarInputRef.current?.click()}
                      className="bg-[#e3e2e8] border border-l-0 border-[#c5c6d2] px-6 py-3 rounded-r text-[#444650] font-medium text-sm sm:text-base hover:bg-[#dad9e0] transition-colors cursor-pointer"
                    >
                      Upload
                    </button>
                    <input
                      ref={gambarInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleGambarFileChange}
                      className="hidden" suppressHydrationWarning />
                  </div>

                  {gambarError && (
                    <div className="absolute left-2 top-[calc(100%+8px)] z-40 flex items-center gap-2.5 bg-white text-slate-800 text-xs sm:text-sm py-2 px-3.5 rounded-lg shadow-xl border border-slate-300 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-slate-300 rotate-45 transform" />
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">!</div>
                      <span className="font-medium text-slate-800">{gambarError}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#757682] mt-1.5 font-normal">Berkas Maksimal 5MB</p>
                </div>

                {/* Dashed preview box: Gambar Preview */}
                <div
                  onClick={() => {
                    if (!gambarPreview) {
                      gambarInputRef.current?.click();
                    }
                  }}
                  className="w-full md:w-2/3 h-64 bg-[#efedf3] border-2 border-dashed border-[#c5c6d2] rounded flex items-center justify-center text-[#757682] text-sm relative group cursor-pointer hover:bg-[#e9e7ee] transition-colors overflow-hidden"
                >
                  {gambarPreview ? (
                    <div className="w-full h-full p-2 relative flex items-center justify-center bg-white/50">
                      <img
                        src={gambarPreview}
                        alt="Pratinjau Foto"
                        className="max-w-full max-h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveGambar}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm z-20"
                        title="Hapus gambar"
                        aria-label="Hapus gambar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>Gambar Preview</span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                        <ImageIcon className="w-8 h-8 text-[#757682]" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 7. Lampiran Dokumen */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Lampiran <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={lampiranAttachments.length > 0 ? `${lampiranAttachments.length} berkas dipilih` : ''}
                      placeholder="Maksimal 5 berkas berupa .pdf/ .docx/ .jpg/ .png"
                      className="flex-grow border border-[#c5c6d2] rounded-l p-3 text-sm sm:text-base outline-none bg-[#f4f3f9] text-[#1a1b20] placeholder-[#757682]"
                    />
                    <button
                      type="button"
                      onClick={() => lampiranInputRef.current?.click()}
                      disabled={lampiranAttachments.length >= 5}
                      className="bg-[#e3e2e8] border border-l-0 border-[#c5c6d2] px-6 py-3 rounded-r text-[#444650] font-medium text-sm sm:text-base hover:bg-[#dad9e0] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Upload
                    </button>
                    <input
                      ref={lampiranInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleLampiranFileChange}
                      className="hidden"
                      suppressHydrationWarning
                    />
                  </div>

                  {lampiranError && (
                    <div className="absolute left-2 top-[calc(100%+8px)] z-40 flex items-center gap-2.5 bg-white text-slate-800 text-xs sm:text-sm py-2 px-3.5 rounded-lg shadow-xl border border-slate-300 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-slate-300 rotate-45 transform" />
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">!</div>
                      <span className="font-medium text-slate-800">{lampiranError}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#757682] mt-1.5 font-normal">Berkas Maksimal 5MB</p>
                </div>

                {/* Previews */}
                {lampiranAttachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full mt-3">
                    {lampiranAttachments.map((att, idx) => {
                      const ext = att.name.split('.').pop()?.toUpperCase() || 'BERKAS';
                      const isDocx =
                        att.name.toLowerCase().endsWith('.docx') ||
                        att.name.toLowerCase().endsWith('.doc');
                      const isPdf = att.name.toLowerCase().endsWith('.pdf');
                      const isVideo = Boolean(
                        att.name.match(/\.(mp4|mkv|avi|mov|webm|3gp|wmv|m4v|flv)$/i) ||
                          att.preview?.startsWith('data:video')
                      );
                      const isImage = Boolean(
                        att.name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
                          att.preview?.startsWith('data:image')
                      );
                      const imgUrl = att.preview || (att.file ? URL.createObjectURL(att.file) : null);

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isImage && imgUrl) {
                              setPreviewAttachmentImage(imgUrl);
                            } else {
                              handleDownloadAttachment(att);
                            }
                          }}
                          title={
                            isImage
                              ? 'Klik untuk memperbesar'
                              : `Klik untuk unduh: ${att.name}`
                          }
                          className={`relative group border border-[#c5c6d2] rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center cursor-pointer transition-all shadow-2xs ${
                            isImage && imgUrl
                              ? 'p-0 bg-transparent'
                              : 'p-2 bg-[#e9e7ee] hover:bg-[#d8d9e2]'
                          }`}
                        >
                          {isImage && imgUrl ? (
                            <>
                              <img
                                src={imgUrl}
                                alt={att.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none z-10">
                                <span className="text-xs text-center px-2">
                                  Klik untuk memperbesar
                                </span>
                              </div>
                              <span className="absolute bottom-0 w-full bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 truncate text-center z-10">
                                {att.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col items-center justify-center gap-1.5 p-1 text-center w-full h-full">
                                <div
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-0.5 group-hover:scale-105 transition-transform ${
                                    isVideo
                                      ? 'bg-neutral-200 text-black'
                                      : isDocx
                                      ? 'bg-blue-100 text-blue-600'
                                      : isPdf
                                      ? 'bg-red-100 text-red-600'
                                      : 'bg-slate-200 text-[#00113a]'
                                  }`}
                                >
                                  {isVideo ? (
                                    <Video className="w-5 h-5 text-black" />
                                  ) : (
                                    <FileText className="w-5 h-5" />
                                  )}
                                </div>
                                <span
                                  className="text-[10px] font-semibold text-[#1a1b20] group-hover:text-[#00113a] transition-colors line-clamp-2 break-all text-center px-1"
                                  title={att.name}
                                >
                                  {att.name}
                                </span>
                                {isVideo && (
                                  <span className="text-[8px] font-bold text-black bg-white border border-black px-1.5 py-0.2 rounded uppercase tracking-wider shadow-2xs">
                                    VIDEO
                                  </span>
                                )}
                                {isPdf && !isVideo && (
                                  <span className="text-[8px] font-bold text-red-600 bg-white border border-red-200 px-1.5 py-0.2 rounded uppercase tracking-wider shadow-2xs">
                                    PDF
                                  </span>
                                )}
                                {isDocx && !isVideo && (
                                  <span className="text-[8px] font-bold text-blue-600 bg-white border border-blue-200 px-1.5 py-0.2 rounded uppercase tracking-wider shadow-2xs">
                                    DOCX
                                  </span>
                                )}
                                {!isPdf && !isDocx && !isVideo && (
                                  <span className="text-[8px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded uppercase tracking-wider shadow-2xs">
                                    {ext}
                                  </span>
                                )}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none z-10">
                                <span className="text-xs text-center px-2 leading-tight">
                                  Klik untuk unduh
                                </span>
                              </div>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLampiran(idx);
                            }}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                            title="Hapus berkas"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status Dropdown diletakkan di paling bawah */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Status <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="relative w-full md:w-56" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={`w-full bg-[#5a626a] hover:bg-[#4d545b] text-white py-2.5 px-4 font-medium text-sm flex items-center justify-between transition-colors shadow-xs cursor-pointer ${isStatusMenuOpen ? 'rounded-t-md' : 'rounded-md'
                    }`}
                >
                  <span className="truncate">{status || 'Jenis Status'}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isStatusMenuOpen && (
                  <div className="absolute top-full left-0 z-50 w-full bg-white border border-[#c5c6d2] border-t-0 rounded-b-md shadow-lg py-1 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('Terbit');
                        setIsStatusMenuOpen(false);
                      }}
                      className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${status === 'Terbit'
                        ? 'text-[#00113a] font-bold bg-[#f4f3f9]'
                        : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                        }`}
                    >
                      Terbit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('Menunggu');
                        setIsStatusMenuOpen(false);
                      }}
                      className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${status === 'Menunggu'
                        ? 'text-[#00113a] font-bold bg-[#f4f3f9]'
                        : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                        }`}
                    >
                      Menunggu
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons matching Stitch */}
            <div className="flex justify-start gap-3 pt-6 mt-8 border-t border-[#c5c6d2]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-[#00113a] text-white rounded font-bold text-sm hover:bg-[#2a4386] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link
                href={`/kupas-sosok/${rawSlug}`}
                className="px-8 py-2.5 border border-[#c5c6d2] text-[#444650] rounded font-bold text-sm hover:bg-[#f4f3f9] transition-colors cursor-pointer inline-block text-center"
              >
                Keluar
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Lightbox Modal Pratinjau Foto Lampiran */}
      {previewAttachmentImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn p-4 sm:p-8"
          onClick={() => setPreviewAttachmentImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewAttachmentImage(null);
            }}
            title="Tutup Pratinjau"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <img
            src={previewAttachmentImage}
            alt="Pratinjau Foto Lampiran"
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

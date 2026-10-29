'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ImageIcon,
  Upload,
  CheckCircle,
  FileText,
  Video,
  X,
} from 'lucide-react';
import {
  getStoredTahukahAnda,
  saveStoredTahukahAnda,
  TahukahAndaItem,
  MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
} from '@/lib/mock-tahukah-anda';

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
            height = MAX_HEIGHT;
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

export default function TambahArtikelTahukahAndaPage() {
  const router = useRouter();

  // Form states matching Wireframe 3
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [status, setStatus] = useState<'Terbit' | 'Menunggu' | ''>('');
  const [deskripsiHtml, setDeskripsiHtml] = useState('');
  const [gambarFileName, setGambarFileName] = useState('');
  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [lampiranAttachments, setLampiranAttachments] = useState<Array<{ file?: File; name: string; preview: string | null }>>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch(() => {});
  }, []);

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

  // Editor and Input refs
  const editorRef = useRef<HTMLDivElement>(null);
  const gambarInputRef = useRef<HTMLInputElement>(null);
  const lampiranInputRef = useRef<HTMLInputElement>(null);

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
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const monthNamesIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const execFormat = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      setDeskripsiHtml(editorRef.current.innerHTML);
      checkActiveStyles();
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Masukkan tautan URL (contoh: https://perpusnas.go.id):', 'https://');
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
    const rawText = editorRef.current?.innerText?.trim() || '';
    const htmlContent = deskripsiHtml.trim();

    if (!judul.trim()) {
      alert('Nama judul Artikel Tahukah Anda wajib diisi');
      return;
    }

    if (!rawText && !htmlContent) {
      alert('Deskripsi Artikel Tahukah Anda wajib diisi');
      return;
    }

    const finalBody = htmlContent || rawText || judul;

    setIsSubmitting(true);
    const resolvedStatus = status === 'Menunggu' ? 'Menunggu' : 'Terbit';
    const fallbackImage =
      gambarPreview ||
      '/images/logo-perpusnas.png';

    const authorName = currentUser?.name || 'Ahmad Fauzi, S.Kom.';
    const authorId = currentUser?.id || currentUser?.userId;

    let createdId = `tahukah-custom-${Date.now()}`;

    // Persist via API first so database has it for everyone
    try {
      const res = await fetch('/api/employee-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: judul,
          category: 'tahukah-anda',
          categorySlug: 'tahukah-anda',
          body: finalBody,
          coverImage: fallbackImage,
          coverImageName: gambarFileName || (gambarPreview ? 'sampul.jpg' : undefined),
          publishedAt: tanggal.toISOString(),
          status: status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
          attachmentName: lampiranAttachments.length > 0 ? lampiranAttachments.map((a) => a.name).join(', ') : undefined,
          attachmentUrl: lampiranAttachments.length > 0 ? JSON.stringify(lampiranAttachments.map((a) => a.preview || '')) : undefined,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data?.data?.id) {
        createdId = data.data.id;
      }
    } catch (apiErr) {
      console.warn('API save error, saving locally:', apiErr);
    }

    const newItem: TahukahAndaItem = {
      id: createdId,
      title: judul,
      excerpt: (rawText || judul).slice(0, 140) + '...',
      content: finalBody,
      coverImage: fallbackImage,
      coverImageName: gambarFileName || (gambarPreview ? 'sampul.jpg' : undefined),
      publishedAt: tanggal.toISOString().split('T')[0],
      status: resolvedStatus,
      authorName,
      authorId,
      attachmentName: lampiranAttachments.length > 0 ? lampiranAttachments.map((a) => a.name).join(', ') : undefined,
      attachmentUrl: lampiranAttachments.length > 0 ? JSON.stringify(lampiranAttachments.map((a) => a.preview || '')) : undefined,
      attachments: lampiranAttachments.length > 0
        ? lampiranAttachments.map((a, idx) => ({ id: idx + 1, label: a.name, src: a.preview || `/uploads/${a.name}` }))
        : MOCK_TAHUKAH_ANDA_ATTACHMENTS_5,
    };

    // Save to localStorage
    const currentStored = getStoredTahukahAnda();
    saveStoredTahukahAnda([newItem, ...currentStored]);

    setSuccessMessage('Artikel Tahukah Anda berhasil disimpan!');
    setTimeout(() => {
      router.push('/antar-pegawai/tahukah-anda');
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 text-[#1a1b20]">
      {/* Breadcrumbs matching Stitch & Wireframe 3 */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#444650] text-sm mb-8 font-normal">
        <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <span>
          Antar Pegawai
        </span>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <Link href="/antar-pegawai/tahukah-anda" className="hover:text-[#00113a] transition-colors">
          Tahukah Anda
        </Link>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <span className="text-[#1a1b20] font-medium">Tambah</span>
      </nav>

      {/* Page Title matching Wireframe 3 */}
      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#00113a] mb-10 tracking-tight">
        Tambah Artikel Tahukah Anda
      </h1>

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Container matching Stitch & Wireframe 3 */}
      <div className="bg-white border border-[#c5c6d2] rounded-lg p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-[200px_auto] gap-6 mb-8 items-start">
            {/* 1. Judul */}
            <label htmlFor="judul" className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Judul <span className="text-red-500">*</span> <span className="float-right hidden md:inline">:</span>
            </label>
            <div>
              <input
                id="judul"
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Nama Judul Artikel Tahukah Anda"
                className="w-full border border-[#c5c6d2] rounded p-3 text-sm sm:text-base text-[#1a1b20] placeholder-[#757682] focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] outline-none transition-colors"
              />
            </div>

            {/* 2. Tanggal */}
            <label htmlFor="tanggal" className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
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
                    <button type="button" onClick={prevMonth} className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650] cursor-pointer">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-sm text-[#00113a]">
                      {monthNamesIndo[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <button type="button" onClick={nextMonth} className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650] cursor-pointer">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 text-center text-xs font-bold text-[#757682] mb-2">
                    <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
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
                          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition-colors cursor-pointer ${
                            !item.isCurrentMonth
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

            {/* 3. Deskripsi */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Deskripsi <span className="text-red-500">*</span> <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="border border-[#c5c6d2] rounded overflow-hidden">
              {/* WYSIWYG Toolbar matching Wireframe 3 */}
              <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex gap-1 sm:gap-2 items-center text-[#757682] select-none">
                {/* Bold */}
                <button
                  type="button"
                  aria-label="Bold"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('bold');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors cursor-pointer ${
                    activeStyles.bold ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  aria-label="Italic"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('italic');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors cursor-pointer ${
                    activeStyles.italic ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  aria-label="Underline"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('underline');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors cursor-pointer ${
                    activeStyles.underline ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <Underline className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-[#c5c6d2] mx-1"></div>

                {/* Bullet List */}
                <button
                  type="button"
                  aria-label="Bullet List"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('insertUnorderedList');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors cursor-pointer ${
                    activeStyles.unorderedList ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>

                {/* Link */}
                <button
                  type="button"
                  aria-label="Link"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleLinkInsert();
                  }}
                  className="p-1 hover:bg-[#e9e7ee] rounded transition-colors text-[#444650] cursor-pointer"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contenteditable Editor area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onKeyUp={checkActiveStyles}
                onMouseUp={checkActiveStyles}
                onInput={(e) => {
                  setDeskripsiHtml(e.currentTarget.innerHTML);
                  checkActiveStyles();
                }}
                data-placeholder="Tulis deskripsi artikel tahukah anda..."
                className="w-full p-4 text-sm sm:text-base outline-none min-h-[190px] max-h-[400px] overflow-y-auto leading-relaxed bg-white text-[#1a1b20]"
              />
            </div>

            {/* 4. Gambar */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Gambar <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="flex flex-col gap-4">
              <div className="relative" suppressHydrationWarning>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    suppressHydrationWarning
                    value={gambarFileName}
                    placeholder="Berkas berupa .jpg/ .png"
                    className={`flex-grow border rounded-l p-3 text-sm sm:text-base outline-none bg-[#f4f3f9] text-[#1a1b20] placeholder-[#757682] transition-colors ${
                      gambarError ? 'border-amber-400 ring-1 ring-amber-400' : 'border-[#c5c6d2]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setGambarError('');
                      gambarInputRef.current?.click();
                    }}
                    className="bg-[#e3e2e8] border border-l-0 border-[#c5c6d2] px-6 py-3 rounded-r text-[#444650] font-medium text-sm sm:text-base hover:bg-[#dad9e0] transition-colors cursor-pointer"
                  >
                    Upload
                  </button>
                  <input
                    ref={gambarInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleGambarFileChange}
                    className="hidden"
                    suppressHydrationWarning
                  />
                </div>

                {/* Pop up balon peringatan seperti "Mohon isi bidang ini" */}
                {gambarError && (
                  <div className="absolute left-2 top-[calc(100%+8px)] z-40 flex items-center gap-2.5 bg-white text-slate-800 text-xs sm:text-sm py-2 px-3.5 rounded-lg shadow-xl border border-slate-300 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Panah segitiga ke atas menunjuk ke input field */}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-slate-300 rotate-45 transform" />
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">!</div>
                    <span className="font-medium text-slate-800">{gambarError}</span>
                  </div>
                )}

                <p className="text-xs text-[#757682] mt-1.5 font-normal">Berkas maksimal 5MB</p>
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
                      alt="Pratinjau Gambar Artikel Tahukah Anda"
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

            {/* 5. Lampiran */}
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

                {/* Pop up balon peringatan seperti "Mohon isi bidang ini" */}
                {lampiranError && (
                  <div className="absolute left-2 top-[calc(100%+8px)] z-40 flex items-center gap-2.5 bg-white text-slate-800 text-xs sm:text-sm py-2 px-3.5 rounded-lg shadow-xl border border-slate-300 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Panah segitiga ke atas menunjuk ke input field */}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-slate-300 rotate-45 transform" />
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">!</div>
                    <span className="font-medium text-slate-800">{lampiranError}</span>
                  </div>
                )}

                <p className="text-xs text-[#757682] mt-1.5 font-normal">Berkas maksimal 5MB</p>
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

            {/* 6. Status Dropdown placed under Lampiran */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Status <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="relative w-full md:w-56" ref={statusMenuRef}>
              <button
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={`w-full bg-[#5a626a] hover:bg-[#4d545b] text-white py-2.5 px-4 font-medium text-sm flex items-center justify-between transition-colors shadow-xs cursor-pointer ${
                  isStatusMenuOpen ? 'rounded-t-md' : 'rounded-md'
                }`}
              >
                <span className="truncate">{status || 'Jenis Status'}</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isStatusMenuOpen && (
                <div className="absolute top-full left-0 z-50 w-full bg-white border border-[#c5c6d2] border-t-0 rounded-b-md shadow-lg py-1 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('Terbit');
                      setIsStatusMenuOpen(false);
                    }}
                    className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${
                      status === 'Terbit'
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
                    className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${
                      status === 'Menunggu'
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

          {/* Form Actions matching Stitch & Wireframe 3 */}
          <div className="flex gap-4 pt-6 mt-8 border-t border-[#c5c6d2]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00113a] text-white rounded px-8 py-3 text-base font-bold hover:bg-[#002366] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link
              href="/antar-pegawai/tahukah-anda"
              className="bg-transparent border border-[#757682] text-[#444650] rounded px-8 py-3 text-base font-medium hover:bg-[#f4f3f9] transition-colors inline-block text-center cursor-pointer"
            >
              Keluar
            </Link>
          </div>
        </form>
      </div>

      {/* Lightbox Modal untuk Klik Perbesar Foto Lampiran */}
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

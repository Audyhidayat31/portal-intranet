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
  Heading1,
  Heading2,
  Type,
  Quote,
  X,
  FileText,
  Video,
  CheckCircle,
} from 'lucide-react';
import {
  ConsultationItem,
  getStoredConsultations,
  saveStoredConsultations,
} from '@/lib/mock-konsultasi';

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function TambahKonsultasiPage() {
  const router = useRouter();

  // Form states
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [keteranganHtml, setKeteranganHtml] = useState('');
  const [lampiranAttachments, setLampiranAttachments] = useState<
    Array<{ file?: File; name: string; preview: string | null }>
  >([]);
  const [jenisKonsultasi, setJenisKonsultasi] = useState<
    'IT' | 'Kesehatan' | 'Pegawai' | ''
  >('');
  const [status, setStatus] = useState<'Terbit' | 'Menunggu' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jenisKonsultasiError, setJenisKonsultasiError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Jenis Konsultasi dropdown state
  const [isJenisMenuOpen, setIsJenisMenuOpen] = useState(false);
  const jenisMenuRef = useRef<HTMLDivElement>(null);

  // Styling dropdown state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

  // Editor and Input refs
  const editorRef = useRef<HTMLDivElement>(null);
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
      if (
        jenisMenuRef.current &&
        !jenisMenuRef.current.contains(event.target as Node)
      ) {
        setIsJenisMenuOpen(false);
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

  const formatIndonesianDate = (date: Date) => {
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
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
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const execFormat = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      setKeteranganHtml(editorRef.current.innerHTML);
      checkActiveStyles();
    }
  };

  const handleLinkInsert = () => {
    const url = prompt(
      'Masukkan tautan URL (contoh: https://perpusnas.go.id):',
      'https://'
    );
    if (url) {
      execFormat('createLink', url);
    }
  };

  const handleLampiranFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Satu berkas maksimal 5MB
    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      alert(`Berkas "${oversized.name}" melebihi ukuran maksimal 5MB`);
      if (lampiranInputRef.current) lampiranInputRef.current.value = '';
      return;
    }

    // Total maksimal 5 berkas
    if (lampiranAttachments.length + files.length > 5) {
      alert('Maksimal 5 berkas diperbolehkan');
      if (lampiranInputRef.current) lampiranInputRef.current.value = '';
      return;
    }

    const newAttachments = await Promise.all(
      files.map(async (file) => {
        let preview: string | null = null;
        try {
          preview = await readFileAsDataUrl(file);
        } catch {
          if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
          }
        }
        return { file, name: file.name, preview };
      })
    );

    setLampiranAttachments((prev) => [...prev, ...newAttachments]);
    if (lampiranInputRef.current) {
      lampiranInputRef.current.value = '';
    }
  };

  const handleRemoveLampiran = (index: number) => {
    setLampiranAttachments((prev) => prev.filter((_, i) => i !== index));
    if (lampiranInputRef.current) lampiranInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawText = editorRef.current?.innerText?.trim() || '';

    if (!judul.trim()) {
      alert('Nama judul Konsultasi wajib diisi');
      return;
    }

    if (!jenisKonsultasi) {
      setJenisKonsultasiError(true);
      alert('Jenis Konsultasi wajib dipilih');
      return;
    }

    // Jika belum memilih status, otomatis Menunggu
    const finalStatus = (status || 'Menunggu') as 'Terbit' | 'Menunggu';

    setIsSubmitting(true);

    const finalCategory = jenisKonsultasi as 'IT' | 'Kesehatan' | 'Pegawai';
    const validPreviews = lampiranAttachments.map((a) => a.preview).filter(Boolean);
    const finalAttachment =
      lampiranAttachments.length > 0
        ? lampiranAttachments.map((a) => a.name).join(', ')
        : undefined;
    const finalAttachmentUrl =
      validPreviews.length > 0 ? JSON.stringify(validPreviews) : undefined;

    const newItem: ConsultationItem = {
      id: String(Date.now()),
      title: judul.trim(),
      category: finalCategory,
      date: formatIndonesianDate(tanggal),
      status: finalStatus,
      description: rawText || judul.trim(),
      attachmentName: finalAttachment,
      attachmentUrl: finalAttachmentUrl,
      authorName: 'Ahmad Fauzi',
      replies: [],
    };

    // Save locally
    const currentList = getStoredConsultations();
    const updatedList = [newItem, ...currentList];
    saveStoredConsultations(updatedList);

    // Sync to API
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newItem.title,
          category: newItem.category,
          question: newItem.description,
          description: newItem.description,
          status: newItem.status,
          attachmentName: newItem.attachmentName,
          attachmentUrl: newItem.attachmentUrl,
        }),
      });
      const resData = await res.json();
      if (resData.success && resData.data?.id) {
        newItem.id = resData.data.id;
        saveStoredConsultations([newItem, ...currentList]);
      }
    } catch (err) {
      console.warn('API sync fallback to local storage:', err);
    }

    setSuccessMessage('Konsultasi baru berhasil disimpan!');
    setTimeout(() => {
      router.push('/antar-pegawai/konsultasi');
    }, 1200);
  };

  return (
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
        <span>
          Antar Pegawai
        </span>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <Link
          href="/antar-pegawai/konsultasi"
          className="hover:text-[#00113a] transition-colors"
        >
          Konsultasi
        </Link>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <span className="text-[#00113a] font-semibold">Tambah</span>
      </nav>

      {/* Page Title matching Stitch */}
      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#00113a] mb-10 tracking-tight">
        Tambah Konsultasi
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
            {/* 1. Judul */}
            <label
              htmlFor="judul"
              className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2"
            >
              Judul <span className="float-right hidden md:inline">:</span>
            </label>
            <div>
              <input
                id="judul"
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Nama Judul Konsultasi"
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
                      className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650] cursor-pointer"
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
                      className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650] cursor-pointer"
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
                          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition-colors ${
                            !item.isCurrentMonth
                              ? 'text-slate-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#00113a] text-white font-bold shadow-xs'
                              : 'text-[#1a1b20] hover:bg-[#f4f3f9] cursor-pointer'
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

            {/* 4. Keterangan / Deskripsi */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Keterangan <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="border border-[#c5c6d2] rounded overflow-hidden">
              {/* WYSIWYG Toolbar matching Stitch (opini/tambah) */}
              <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex gap-1 sm:gap-2 items-center text-[#757682] select-none">
                {/* Bold */}
                <button
                  type="button"
                  aria-label="Bold"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('bold');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.bold
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650]'
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
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.italic
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650]'
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
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.underline
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650]'
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
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.unorderedList
                      ? 'bg-[#00113a] text-white'
                      : 'text-[#444650]'
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
                  className="p-1 hover:bg-[#e9e7ee] rounded transition-colors text-[#444650]"
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
                  setKeteranganHtml(e.currentTarget.innerHTML);
                  checkActiveStyles();
                }}
                className="w-full p-4 text-sm sm:text-base outline-none min-h-[190px] max-h-[400px] overflow-y-auto leading-relaxed bg-white text-[#1a1b20]"
              />
            </div>

            {/* 4. Lampiran */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Lampiran <span className="float-right hidden md:inline">:</span>
            </label>
            <div>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={
                    lampiranAttachments.length > 0
                      ? `${lampiranAttachments.length} berkas dipilih`
                      : ''
                  }
                  placeholder="Maksimal 5 berkas"
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
                  accept="*"
                  onChange={handleLampiranFileChange}
                  className="hidden"
                  suppressHydrationWarning
                />
              </div>
              <p className="text-xs text-[#757682] mt-1.5 font-normal">Berkas maksimal 5MB</p>

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

                    return (
                      <div
                        key={idx}
                        className="relative group bg-[#e9e7ee] border border-[#c5c6d2] rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center p-2"
                      >
                        {isImage && att.preview ? (
                          <img
                            src={att.preview}
                            alt={att.name}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1.5 p-1 text-center w-full h-full">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
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
                              className="text-[10px] font-medium text-slate-800 truncate w-full px-1 text-center"
                              title={att.name}
                            >
                              {att.name}
                            </span>
                            {isVideo && (
                              <span className="text-[8px] font-bold text-black bg-white border border-black px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                                VIDEO
                              </span>
                            )}
                            {isPdf && !isVideo && (
                              <span className="text-[8px] font-bold text-red-600 bg-white border border-red-200 px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                                PDF
                              </span>
                            )}
                            {isDocx && !isVideo && (
                              <span className="text-[8px] font-bold text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                                DOCX
                              </span>
                            )}
                            {!isPdf && !isDocx && !isVideo && (
                              <span className="text-[8px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                                {ext}
                              </span>
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveLampiran(idx)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                          title="Hapus berkas"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {isImage && (
                          <span className="absolute bottom-0 w-full bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 truncate text-center">
                            {att.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Jenis Konsultasi <span className="text-red-500 font-bold">*</span>{' '}
              <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="relative w-full md:w-56" ref={jenisMenuRef}>
              <button
                type="button"
                onClick={() => setIsJenisMenuOpen(!isJenisMenuOpen)}
                className={`w-full bg-[#5a626a] hover:bg-[#4d545b] text-white py-2.5 px-4 font-medium text-sm flex items-center justify-between transition-all shadow-xs cursor-pointer ${jenisKonsultasiError && !jenisKonsultasi ? 'ring-2 ring-red-500 border-2 border-red-500' : ''} ${
                  isJenisMenuOpen ? 'rounded-t-md' : 'rounded-md'
                }`}
              >
                <span className="truncate">
                  {jenisKonsultasi || 'Pilih Jenis Konsultasi'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform ${
                    isJenisMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isJenisMenuOpen && (
                <div className="absolute top-full left-0 z-50 w-full bg-white border border-[#c5c6d2] border-t-0 rounded-b-md shadow-lg py-1 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      setJenisKonsultasi('IT');
                      setJenisKonsultasiError(false);
                      setIsJenisMenuOpen(false);
                    }}
                    className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${
                      jenisKonsultasi === 'IT'
                        ? 'text-[#00113a] font-bold bg-[#f4f3f9]'
                        : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                    }`}
                  >
                    IT
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJenisKonsultasi('Kesehatan');
                      setIsJenisMenuOpen(false);
                    }}
                    className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${
                      jenisKonsultasi === 'Kesehatan'
                        ? 'text-[#00113a] font-bold bg-[#f4f3f9]'
                        : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                    }`}
                  >
                    Kesehatan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJenisKonsultasi('Pegawai');
                      setIsJenisMenuOpen(false);
                    }}
                    className={`w-full py-2 px-3 text-center text-sm font-medium transition-colors cursor-pointer block ${
                      jenisKonsultasi === 'Pegawai'
                        ? 'text-[#00113a] font-bold bg-[#f4f3f9]'
                        : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                    }`}
                  >
                    Pegawai
                  </button>
                </div>
              )}
              <input
                type="text"
                value={jenisKonsultasi}
                onChange={() => {}}
                required
                tabIndex={-1}
                aria-hidden="true"
                className="opacity-0 absolute inset-0 pointer-events-none -z-10 h-0 w-0"
                onInvalid={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity('Jenis Konsultasi wajib dipilih');
                  setJenisKonsultasiError(true);
                }}
                onInput={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity('');
                  setJenisKonsultasiError(false);
                }}
              />
              {jenisKonsultasiError && !jenisKonsultasi && (
                <p className="text-xs text-red-600 font-medium mt-1.5 animate-fadeIn">
                  Jenis Konsultasi wajib dipilih
                </p>
              )}
            </div>

            {/* 6. Status Dropdown (Paling Bawah) */}
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
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform ${
                    isStatusMenuOpen ? 'rotate-180' : ''
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

          {/* Form Actions matching Stitch */}
          <div className="flex gap-4 pt-6 mt-8 border-t border-[#c5c6d2]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00113a] text-white rounded px-8 py-3 text-base font-bold hover:bg-[#002366] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link
              href="/antar-pegawai/konsultasi"
              className="bg-transparent border border-[#757682] text-[#444650] rounded px-8 py-3 text-base font-medium hover:bg-[#f4f3f9] transition-colors inline-block text-center cursor-pointer"
            >
              Keluar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


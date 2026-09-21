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
  Loader2,
} from 'lucide-react';
import { STITCH_MOCK_KARYA_AKADEMIK } from '@/lib/mock-karya-akademik';

export default function EditKaryaAkademikPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  // Form states
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [status, setStatus] = useState<'Terbit' | 'Menunggu' | ''>('Terbit');
  const [deskripsiHtml, setDeskripsiHtml] = useState('');
  const [gambarFileName, setGambarFileName] = useState('');
  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [lampiranFileName, setLampiranFileName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Styling dropdown state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

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

  // Fetch initial post data
  useEffect(() => {
    if (!rawId) return;

    const matchedMock =
      STITCH_MOCK_KARYA_AKADEMIK.find(
        (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
      ) || STITCH_MOCK_KARYA_AKADEMIK[0];

    fetch(`/api/employee-posts/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setJudul(item.title || '');
          if (item.publishedAt) {
            const d = new Date(item.publishedAt);
            if (!isNaN(d.getTime())) {
              setTanggal(d);
              setViewDate(d);
            }
          }
          setStatus(item.status === 'MENUNGGU' ? 'Menunggu' : 'Terbit');
          const content = item.body || item.content || '';
          setDeskripsiHtml(content);
          if (editorRef.current) {
            editorRef.current.innerHTML = content;
          }
          if (item.coverImage) {
            setGambarPreview(item.coverImage);
            setGambarFileName('sampul-karya-akademik.jpg');
          }
        } else if (matchedMock) {
          setJudul(matchedMock.title);
          if (matchedMock.publishedAt) {
            const d = new Date(matchedMock.publishedAt);
            if (!isNaN(d.getTime())) {
              setTanggal(d);
              setViewDate(d);
            }
          }
          setStatus('Terbit');
          const content = matchedMock.content || '';
          setDeskripsiHtml(content);
          if (editorRef.current) {
            editorRef.current.innerHTML = content;
          }
          if (matchedMock.coverImage) {
            setGambarPreview(matchedMock.coverImage);
            setGambarFileName('sampul-karya-akademik.jpg');
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (matchedMock) {
          setJudul(matchedMock.title);
          const content = matchedMock.content || '';
          setDeskripsiHtml(content);
          if (editorRef.current) {
            editorRef.current.innerHTML = content;
          }
          if (matchedMock.coverImage) {
            setGambarPreview(matchedMock.coverImage);
            setGambarFileName('sampul-karya-akademik.jpg');
          }
        }
        setIsLoading(false);
      });
  }, [rawId]);

  useEffect(() => {
    if (editorRef.current && deskripsiHtml && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = deskripsiHtml;
    }
  }, [deskripsiHtml]);

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

  const handleGambarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGambarFileName(file.name);
      const url = URL.createObjectURL(file);
      setGambarPreview(url);
    }
  };

  const handleLampiranFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLampiranFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawText = editorRef.current?.innerText?.trim() || '';
    const htmlContent = deskripsiHtml.trim();

    if (!judul.trim()) {
      alert('Nama judul Karya Akademik wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch(`/api/employee-posts/${rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: judul,
          body: htmlContent || rawText || judul,
          coverImage: gambarPreview || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
          status: status === 'Menunggu' ? 'MENUNGGU' : 'TERBIT',
        }),
      });

      setSuccessMessage('Perubahan Karya Akademik berhasil disimpan!');
      setTimeout(() => {
        router.push(`/antar-pegawai/karya-akademik/${rawId}`);
      }, 1000);
    } catch {
      setSuccessMessage('Perubahan Karya Akademik berhasil disimpan (mode lokal)!');
      setTimeout(() => {
        router.push(`/antar-pegawai/karya-akademik/${rawId}`);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-16 flex flex-col items-center justify-center text-[#757682]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#00113a]" />
        <p className="text-sm font-medium">Memuat data Karya Akademik...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10 text-[#1a1b20]">
      {/* Breadcrumbs matching Stitch */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#444650] text-sm mb-8 font-normal flex-wrap">
        <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <span>
          Antar Pegawai
        </span>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <Link href="/antar-pegawai/karya-akademik" className="hover:text-[#00113a] transition-colors">
          Karya Akademik
        </Link>
        <ChevronRight className="w-4 h-4 text-[#757682]" />
        <span className="text-[#1a1b20] font-medium">Edit Karya Akademik</span>
      </nav>

      {/* Page Title matching Stitch */}
      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#00113a] mb-10 tracking-tight">
        Edit Karya Akademik
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
            <label htmlFor="judul" className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Judul Penelitian <span className="float-right hidden md:inline">:</span>
            </label>
            <div>
              <input
                id="judul"
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Nama judul Karya Akademik"
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
                    <button type="button" onClick={prevMonth} className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650]">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-sm text-[#00113a]">
                      {monthNamesIndo[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <button type="button" onClick={nextMonth} className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650]">
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
                          className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition-colors ${
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

            {/* 3. Status Dropdown */}
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

            {/* 4. Deskripsi */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Abstrak / Uraian <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="border border-[#c5c6d2] rounded overflow-hidden">
              {/* WYSIWYG Toolbar */}
              <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex gap-1 sm:gap-2 items-center text-[#757682] select-none">
                <button
                  type="button"
                  aria-label="Bold"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('bold');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.bold ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  aria-label="Italic"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('italic');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.italic ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  aria-label="Underline"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('underline');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.underline ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <Underline className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-[#c5c6d2] mx-1"></div>

                <button
                  type="button"
                  aria-label="Bullet List"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('insertUnorderedList');
                  }}
                  className={`p-1 hover:bg-[#e9e7ee] rounded transition-colors ${
                    activeStyles.unorderedList ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>

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

                <div className="relative ml-auto mr-2" ref={stylingMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsStylingMenuOpen(!isStylingMenuOpen)}
                    className="text-xs font-semibold text-[#757682] hover:text-[#00113a] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Styling</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {isStylingMenuOpen && (
                    <div className="absolute top-7 right-0 z-50 bg-white border border-[#c5c6d2] rounded-lg shadow-xl py-1.5 w-44 text-xs animate-fadeIn">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execFormat('formatBlock', '<h1>');
                          setIsStylingMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                      >
                        <Heading1 className="w-4 h-4 text-[#00113a]" />
                        <span>Judul Utama (H1)</span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execFormat('formatBlock', '<h2>');
                          setIsStylingMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                      >
                        <Heading2 className="w-4 h-4 text-[#00113a]" />
                        <span>Sub Judul (H2)</span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execFormat('formatBlock', '<p>');
                          setIsStylingMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                      >
                        <Type className="w-4 h-4 text-[#00113a]" />
                        <span>Paragraf Normal</span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          execFormat('formatBlock', '<blockquote>');
                          setIsStylingMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                      >
                        <Quote className="w-4 h-4 text-[#00113a]" />
                        <span>Kutipan (Quote)</span>
                      </button>
                    </div>
                  )}
                </div>
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
                data-placeholder="Tulis abstrak atau uraian penelitian..."
                className="w-full p-4 text-sm sm:text-base outline-none min-h-[190px] max-h-[400px] overflow-y-auto leading-relaxed bg-white text-[#1a1b20]"
              />
            </div>

            {/* 5. Gambar Karya Akademik */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Gambar Sampul <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="flex flex-col gap-4">
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
                  accept="image/*"
                  onChange={handleGambarFileChange}
                  className="hidden"
                />
              </div>

              {/* Dashed preview box */}
              <div
                onClick={() => gambarInputRef.current?.click()}
                className="w-full md:w-2/3 h-64 bg-[#efedf3] border-2 border-dashed border-[#c5c6d2] rounded flex items-center justify-center text-[#757682] text-sm relative group cursor-pointer hover:bg-[#e9e7ee] transition-colors overflow-hidden"
              >
                {gambarPreview ? (
                  <img
                    src={gambarPreview}
                    alt="Pratinjau Gambar"
                    className="w-full h-full object-cover"
                  />
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

            {/* 6. Lampiran */}
            <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
              Lampiran Dokumen <span className="float-right hidden md:inline">:</span>
            </label>
            <div className="flex flex-col gap-4">
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={lampiranFileName}
                  placeholder="Nama File.pdf/doc"
                  className="flex-grow border border-[#c5c6d2] rounded-l p-3 text-sm sm:text-base outline-none bg-[#f4f3f9] text-[#1a1b20] placeholder-[#757682]"
                />
                <button
                  type="button"
                  onClick={() => lampiranInputRef.current?.click()}
                  className="bg-[#e3e2e8] border border-l-0 border-[#c5c6d2] px-6 py-3 rounded-r text-[#444650] font-medium text-sm sm:text-base hover:bg-[#dad9e0] transition-colors cursor-pointer"
                >
                  Upload
                </button>
                <input
                  ref={lampiranInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleLampiranFileChange}
                  className="hidden"
                />
              </div>

              {/* Dashed preview box */}
              <div
                onClick={() => lampiranInputRef.current?.click()}
                className="w-full md:w-2/3 h-64 bg-[#efedf3] border-2 border-dashed border-[#c5c6d2] rounded flex items-center justify-center text-[#757682] text-sm relative group cursor-pointer hover:bg-[#e9e7ee] transition-colors overflow-hidden"
              >
                {lampiranFileName ? (
                  <div className="p-4 text-center">
                    <Upload className="w-8 h-8 text-[#00113a] mx-auto mb-2" />
                    <span className="font-semibold text-[#00113a] block break-all">{lampiranFileName}</span>
                    <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Berkas Terlampir</span>
                  </div>
                ) : (
                  <>
                    <span>File Preview</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                      <Upload className="w-8 h-8 text-[#757682]" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 mt-8 border-t border-[#c5c6d2]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00113a] text-white rounded px-8 py-3 text-base font-bold hover:bg-[#002366] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link
              href={`/antar-pegawai/karya-akademik/${rawId}`}
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

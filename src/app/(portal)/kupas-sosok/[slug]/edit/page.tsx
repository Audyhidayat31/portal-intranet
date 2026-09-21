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
} from 'lucide-react';
import {
  STITCH_MOCK_FIGURES_6,
  getStoredFigures,
  saveStoredFigures,
} from '@/lib/mock-kupas-sosok';

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
  const hasInitializedEditor = useRef(false);

  // Fetch initial data
  useEffect(() => {
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
      if (matchedFigure.photoUrl) setGambarPreview(matchedFigure.photoUrl);
      const contentVal = matchedFigure.fullStory || '';
      setDeskripsiHtml(contentVal);
      if (matchedFigure.publishedAt) {
        const parsed = new Date(matchedFigure.publishedAt);
        if (!isNaN(parsed.getTime())) {
          setTanggal(parsed);
          setViewDate(parsed);
        }
      }
    }

    fetch(`/api/figure-profiles/${rawSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setNama(item.name || '');
          setJabatan(item.position || '');
          setUnitKerja(item.unitKerja || '');
          if (item.photoUrl) setGambarPreview(item.photoUrl);
          const bodyVal = item.fullStory || item.body || '';
          setDeskripsiHtml(bodyVal);
          if (item.publishedAt) {
            const parsed = new Date(item.publishedAt);
            if (!isNaN(parsed.getTime())) {
              setTanggal(parsed);
              setViewDate(parsed);
            }
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

  const handleGambarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambarFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setGambarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLampiranFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLampiranFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama sosok wajib diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const storyContent = deskripsiHtml || (editorRef.current?.innerHTML || '');
      const plainStory = editorRef.current?.innerText || nama;

      // Update mock storage
      const storedFigures = getStoredFigures();
      const updatedFigures = storedFigures.map((item) => {
        if (
          item.slug === rawSlug ||
          item.id === rawSlug ||
          item.name.toLowerCase().includes(rawSlug.toLowerCase())
        ) {
          return {
            ...item,
            name: nama,
            position: jabatan || item.position,
            unitKerja: unitKerja || item.unitKerja,
            fullStory: storyContent || plainStory,
            photoUrl: gambarPreview || item.photoUrl,
            status: (status as 'Terbit' | 'Menunggu') || item.status,
            publishedAt: tanggal.toISOString(),
          };
        }
        return item;
      });
      saveStoredFigures(updatedFigures);

      // Attempt API PUT
      try {
        await fetch(`/api/figure-profiles/${rawSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nama,
            position: jabatan || 'Pustakawan & Insan Berprestasi',
            unitKerja: unitKerja || 'Perpustakaan Nasional RI',
            quote: 'Mendedikasikan karya untuk kemajuan literasi bangsa.',
            fullStory: plainStory,
            photoUrl:
              gambarPreview ||
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop',
            isSpotlight: false,
          }),
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
                Judul <span className="float-right hidden md:inline">:</span>
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

              {/* 3. Status Dropdown matching Stitch */}
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

              {/* 4. Jabatan & Unit Kerja */}
              <label
                htmlFor="jabatan"
                className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2"
              >
                Jabatan &amp; Unit Kerja{' '}
                <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  id="jabatan"
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Pustakawan Ahli Utama"
                  className="w-full border border-[#c5c6d2] rounded p-3 text-sm sm:text-base text-[#1a1b20] placeholder-[#757682] focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] outline-none transition-colors"
                />
                <input
                  id="unitKerja"
                  type="text"
                  value={unitKerja}
                  onChange={(e) => setUnitKerja(e.target.value)}
                  placeholder="Contoh: Deputi Pengembangan Bahan Pustaka"
                  className="w-full border border-[#c5c6d2] rounded p-3 text-sm sm:text-base text-[#1a1b20] placeholder-[#757682] focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] outline-none transition-colors"
                />
              </div>

              {/* 5. Deskripsi / Kisah Lengkap */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Deskripsi <span className="float-right hidden md:inline">:</span>
              </label>
              <div className="border border-[#c5c6d2] rounded overflow-hidden">
                {/* Formatting Toolbar */}
                <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex flex-wrap items-center gap-1">


                  <div className="h-5 w-px bg-[#c5c6d2] mx-1" />

                  {/* Format buttons */}
                  <button
                    type="button"
                    onClick={() => execFormat('bold')}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.bold
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
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.italic
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
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.underline
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
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.unorderedList
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

              {/* 6. Foto Sosok */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Foto Sosok <span className="float-right hidden md:inline">:</span>
              </label>
              <div>
                <input
                  type="file"
                  ref={gambarInputRef}
                  onChange={handleGambarFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {gambarPreview ? (
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-[#c5c6d2] group shadow-xs">
                      <img
                        src={gambarPreview}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => gambarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => gambarInputRef.current?.click()}
                      className="w-28 h-28 rounded-lg border-2 border-dashed border-[#c5c6d2] hover:border-[#00113a] flex flex-col items-center justify-center text-[#757682] cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <ImageIcon className="w-7 h-7 mb-1 text-slate-400" />
                      <span className="text-[11px] font-medium">Unggah Foto</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => gambarInputRef.current?.click()}
                      className="px-4 py-2 border border-[#c5c6d2] rounded text-xs font-bold text-[#1a1b20] bg-[#f4f3f9] hover:bg-[#efedf3] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{gambarPreview ? 'Ganti Foto Sosok' : 'Pilih Foto Sosok'}</span>
                    </button>
                    <p className="text-xs text-[#757682]">
                      {gambarFileName || 'Format JPG, PNG atau WEBP. Maks 5MB.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 7. Lampiran Dokumen */}
              <label className="font-semibold text-sm sm:text-base text-[#1a1b20] pt-2">
                Lampiran Dokumen{' '}
                <span className="float-right hidden md:inline">:</span>
              </label>
              <div>
                <input
                  type="file"
                  ref={lampiranInputRef}
                  onChange={handleLampiranFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => lampiranInputRef.current?.click()}
                    className="px-4 py-2 border border-[#c5c6d2] rounded text-xs font-bold text-[#1a1b20] bg-[#f4f3f9] hover:bg-[#efedf3] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Lampiran</span>
                  </button>
                  <span className="text-xs text-[#444650] truncate max-w-xs">
                    {lampiranFileName || 'Belum ada file dipilih (Opsional, PDF/DOC)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons matching Stitch */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#c5c6d2]">
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
    </div>
  );
}

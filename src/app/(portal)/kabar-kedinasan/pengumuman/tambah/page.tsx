'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heading1,
  Heading2,
  Quote,
  Highlighter,
  Type,
  ImageIcon,
} from 'lucide-react';

export default function TambahPengumumanPage() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [deskripsiHtml, setDeskripsiHtml] = useState('');

  // Active toolbar formatting states
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  // DatePicker Popover state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Styling Menu Popover state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

  // Editor Ref for WYSIWYG contentEditable
  const editorRef = useRef<HTMLDivElement>(null);

  // File uploads state
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Check active formatting under cursor
  const checkActiveStyles = useCallback(() => {
    try {
      setActiveStyles({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        unorderedList: document.queryCommandState('insertUnorderedList'),
        orderedList: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // ignore
    }
  }, []);

  // Update active styles on selection change
  useEffect(() => {
    document.addEventListener('selectionchange', checkActiveStyles);
    return () => {
      document.removeEventListener('selectionchange', checkActiveStyles);
    };
  }, [checkActiveStyles]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
      if (
        stylingMenuRef.current &&
        !stylingMenuRef.current.contains(event.target as Node)
      ) {
        setIsStylingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Date to DD/MM/YYYY
  const formatDDMMYYYY = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // DatePicker navigation
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const selectCalendarDay = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    setIsDatePickerOpen(false);
  };

  // Generate calendar days for viewDate
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Next month filler days
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

  // Execute formatting command without losing focus
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

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setAttachmentPreview(url);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawText = editorRef.current?.innerText?.trim() || '';
    const htmlContent = editorRef.current?.innerHTML?.trim() || '';

    if (!judul.trim() || !rawText) {
      alert('Judul dan Deskripsi pengumuman wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: judul,
          excerpt: rawText.slice(0, 150) + (rawText.length > 150 ? '...' : ''),
          content: htmlContent || rawText,
          attachmentName: attachmentFile ? attachmentFile.name : undefined,
          publishedAt: selectedDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Pengumuman berhasil disimpan dan dipublikasikan!');
        setTimeout(() => {
          router.push('/kabar-kedinasan/pengumuman');
        }, 1200);
      } else {
        alert(data.message || 'Gagal menambahkan pengumuman');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan pengumuman');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* Explicit WYSIWYG styling overrides */}
      <style jsx>{`
        .wysiwyg-editor {
          min-height: 200px;
          outline: none;
        }
        .wysiwyg-editor:empty:before {
          content: attr(data-placeholder);
          color: #757682;
          pointer-events: none;
        }
        .wysiwyg-editor b,
        .wysiwyg-editor strong {
          font-weight: 700 !important;
          color: inherit;
        }
        .wysiwyg-editor i,
        .wysiwyg-editor em {
          font-style: italic !important;
        }
        .wysiwyg-editor u {
          text-decoration: underline !important;
        }
        .wysiwyg-editor ul {
          list-style-type: disc !important;
          padding-left: 1.75rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .wysiwyg-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.75rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .wysiwyg-editor li {
          display: list-item !important;
          margin-bottom: 0.25rem !important;
        }
        .wysiwyg-editor h1 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #00113a !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
        }
        .wysiwyg-editor h2 {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #00113a !important;
          margin-top: 0.6rem !important;
          margin-bottom: 0.4rem !important;
        }
        .wysiwyg-editor blockquote {
          border-left: 4px solid #00113a !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          color: #444650 !important;
          background-color: #f8fafc !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }
        .wysiwyg-editor a {
          color: #002366 !important;
          text-decoration: underline !important;
          font-weight: 600 !important;
        }
      `}</style>

      <div>
        {/* Breadcrumb matching Stitch */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#444650] mb-8">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan" className="hover:text-[#00113a] transition-colors">
            Kabar Kedinasan
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan/pengumuman" className="hover:text-[#00113a] transition-colors">
            Pengumuman
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span className="font-bold text-[#1a1b20]">Tambah</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1b20] tracking-tight mb-8">
          Tambah Pengumuman
        </h1>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 text-sm font-semibold max-w-4xl mx-auto animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container matching Stitch */}
        <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Field: Judul */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="judul"
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Judul</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3">
                <input
                  id="judul"
                  type="text"
                  required
                  placeholder="Nama Judul Pengumuman"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded focus:ring-1 focus:ring-[#00113a] focus:border-[#00113a] px-3 text-sm bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Field: Tanggal with Functional DatePicker */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start relative">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Tanggal</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 flex flex-wrap gap-4 items-center relative" ref={datePickerRef}>
                {/* Left Date Display (DD/MM/YYYY) */}
                <input
                  type="text"
                  readOnly
                  value={formatDDMMYYYY(selectedDate)}
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-36 h-10 border border-[#c5c6d2] rounded px-3 text-sm text-center bg-white text-[#1a1b20] font-semibold cursor-pointer hover:border-[#00113a] transition-colors focus:outline-none"
                />

                {/* Right DatePicker Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="h-10 border border-[#c5c6d2] rounded px-4 bg-[#f4f3f9] hover:bg-[#e9e7ee] text-[#444650] text-sm flex items-center gap-3 transition-colors shadow-sm focus:outline-none"
                >
                  <span className="font-medium">DatePicker</span>
                  <CalendarIcon className="w-4 h-4 text-[#444650]" />
                </button>

                {/* Interactive DatePicker Calendar Popover */}
                {isDatePickerOpen && (
                  <div className="absolute top-12 left-0 z-50 bg-white border border-[#c5c6d2] rounded-xl shadow-2xl p-4 w-72 sm:w-80 animate-fadeIn">
                    {/* Header: Month & Year + Prev/Next buttons */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650] transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-bold text-sm text-[#00113a]">
                        {monthNamesIndo[viewDate.getMonth()]} {viewDate.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1 hover:bg-[#f4f3f9] rounded text-[#444650] transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-[#757682] mb-2">
                      <span>Min</span>
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span>Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {getCalendarDays().map((item, idx) => {
                        const isSelected =
                          item.isCurrentMonth &&
                          selectedDate.getDate() === item.day &&
                          selectedDate.getMonth() === viewDate.getMonth() &&
                          selectedDate.getFullYear() === viewDate.getFullYear();

                        const isToday =
                          item.isCurrentMonth &&
                          new Date().getDate() === item.day &&
                          new Date().getMonth() === viewDate.getMonth() &&
                          new Date().getFullYear() === viewDate.getFullYear();

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
                                ? 'bg-[#00113a] text-white font-bold shadow-sm'
                                : isToday
                                ? 'border border-[#00113a] text-[#00113a] hover:bg-[#f4f3f9]'
                                : 'text-[#1a1b20] hover:bg-[#f4f3f9]'
                            }`}
                          >
                            {item.day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Today Shortcut Button */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          setSelectedDate(today);
                          setViewDate(today);
                          setIsDatePickerOpen(false);
                        }}
                        className="text-[#00113a] font-bold hover:underline"
                      >
                        Hari Ini
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(false)}
                        className="text-[#757682] hover:text-[#1a1b20]"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Field: Deskripsi with Direct WYSIWYG Editing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="deskripsi"
                className="font-bold text-sm text-[#1a1b20] pt-2 md:col-span-1 flex items-start"
              >
                <span>Deskripsi</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 border border-[#c5c6d2] rounded overflow-hidden shadow-xs">
                {/* WYSIWYG Formatting Toolbar */}
                <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex gap-1 sm:gap-2 items-center text-[#444650] flex-wrap relative select-none">
                  {/* BOLD */}
                  <button
                    type="button"
                    title="Tebal (Bold)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('bold');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.bold
                        ? 'bg-[#00113a] text-white'
                        : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  {/* ITALIC */}
                  <button
                    type="button"
                    title="Miring (Italic)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('italic');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.italic
                        ? 'bg-[#00113a] text-white'
                        : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  {/* UNDERLINE */}
                  <button
                    type="button"
                    title="Garis Bawah (Underline)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('underline');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.underline
                        ? 'bg-[#00113a] text-white'
                        : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                  {/* BULLET LIST */}
                  <button
                    type="button"
                    title="Daftar Poin (Bullet List)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertUnorderedList');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.unorderedList
                        ? 'bg-[#00113a] text-white'
                        : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>

                  {/* NUMBERED LIST */}
                  <button
                    type="button"
                    title="Daftar Angka (Numbered List)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertOrderedList');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.orderedList
                        ? 'bg-[#00113a] text-white'
                        : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                  {/* LINK */}
                  <button
                    type="button"
                    title="Sisipkan Tautan Web (Link)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLinkInsert();
                    }}
                    className="p-1.5 hover:bg-[#e9e7ee] rounded text-[#1a1b20] transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  {/* STYLING MENU DROPDOWN */}
                  <div className="relative" ref={stylingMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsStylingMenuOpen(!isStylingMenuOpen)}
                      className="px-2.5 py-1 hover:bg-[#e9e7ee] rounded text-xs font-bold text-[#00113a] flex items-center gap-1 transition-colors border border-transparent hover:border-[#c5c6d2]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00113a]" />
                      <span>Styling</span>
                    </button>

                    {isStylingMenuOpen && (
                      <div className="absolute top-8 left-0 z-50 bg-white border border-[#c5c6d2] rounded-lg shadow-xl py-1.5 w-48 text-xs animate-fadeIn">
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
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            execFormat('hiliteColor', '#fef08a');
                            setIsStylingMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                        >
                          <Highlighter className="w-4 h-4 text-amber-600" />
                          <span>Sorot Teks (Highlight)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct WYSIWYG ContentEditable Area */}
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
                  data-placeholder="Tulis deskripsi pengumuman di sini..."
                  className="wysiwyg-editor w-full p-4 text-sm sm:text-base bg-white text-[#1a1b20] focus:outline-none max-h-[400px] overflow-y-auto leading-relaxed"
                />
              </div>
            </div>

            {/* Field: Lampiran */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1">
                <span>Lampiran</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 space-y-4">
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={attachmentFile ? attachmentFile.name : ''}
                    placeholder="Nama file .pdf/ .jpg/ .png"
                    className="flex-grow h-10 border border-r-0 border-[#c5c6d2] rounded-l px-3 text-sm bg-white text-[#444650] cursor-default focus:outline-none"
                  />
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => attachmentInputRef.current?.click()}
                    className="px-6 h-10 bg-[#e9e7ee] border border-[#c5c6d2] rounded-r text-[#1a1b20] font-bold text-xs sm:text-sm hover:bg-[#e1e3e4] transition-colors"
                  >
                    Upload
                  </button>
                </div>

                {/* Preview Box matching Stitch */}
                <div className="w-full md:w-2/3 h-32 bg-[#e9e7ee] border border-dashed border-[#c5c6d2] rounded flex items-center justify-center text-[#757682] font-bold text-xs">
                  {attachmentPreview ? (
                    <img
                      src={attachmentPreview}
                      alt="Preview Lampiran"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : attachmentFile ? (
                    <div className="flex items-center gap-2 text-[#00113a]">
                      <FileText className="w-5 h-5 text-[#00113a]" />
                      <span className="truncate max-w-[220px]">{attachmentFile.name}</span>
                    </div>
                  ) : (
                    <span>Lampiran Preview</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions matching Stitch */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-[#c5c6d2]">
              <div className="hidden md:block md:col-span-1" />
              <div className="md:col-span-3 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-[#00113a] text-white font-bold rounded hover:bg-[#2a4386] transition-colors shadow-sm text-sm min-w-[120px] disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <Link
                  href="/kabar-kedinasan/pengumuman"
                  className="px-8 py-2.5 bg-transparent border border-[#c5c6d2] text-[#1a1b20] font-bold rounded hover:bg-[#f4f3f9] transition-colors text-sm min-w-[120px] text-center inline-block"
                >
                  Keluar
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

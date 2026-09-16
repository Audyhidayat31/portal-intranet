'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Heading1,
  Heading2,
  Quote,
  Highlighter,
  Type,
  Upload,
} from 'lucide-react';
import {
  STITCH_MOCK_INTERNAL_DOCS_5,
  getStoredInternalDocs,
  saveStoredInternalDocs,
} from '@/lib/mock-internal-documents';

export default function EditDokumenInternalPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  // Form states
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [keteranganHtml, setKeteranganHtml] = useState('');
  const [lampiranName, setLampiranName] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('');
  const [status, setStatus] = useState('Terbit');
  const [isLoading, setIsLoading] = useState(true);

  // Active toolbar formatting states
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  // DatePicker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Styling dropdown state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

  // WYSIWYG Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitializedEditor = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    if (!rawId) return;

    const storedDocs = getStoredInternalDocs();
    const matchedDoc = storedDocs.find(
      (d) => d.id === rawId || d.title.toLowerCase().includes(rawId.toLowerCase())
    );

    if (matchedDoc) {
      setJudul(matchedDoc.title || '');
      setJenisDokumen(matchedDoc.category || '');
      const contentVal = matchedDoc.keterangan || '';
      setKeteranganHtml(contentVal);
      setLampiranName(matchedDoc.attachmentName || '');
      if (matchedDoc.publishedAt) {
        const parsed = new Date(matchedDoc.publishedAt);
        if (!isNaN(parsed.getTime())) {
          setTanggal(parsed);
          setViewDate(parsed);
        }
      }
    }

    fetch(`/api/internal-documents/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setJudul(item.title || '');
          if (item.category?.name) setJenisDokumen(item.category.name);
          const bodyContent = item.excerpt || item.body || item.keterangan || '';
          setKeteranganHtml(bodyContent);
          setLampiranName(item.attachmentName || '');
          if (item.publishedAt) {
            const parsed = new Date(item.publishedAt);
            if (!isNaN(parsed.getTime())) {
              setTanggal(parsed);
              setViewDate(parsed);
            }
          }
          if (item.status) {
            setStatus(item.status === 'DRAFT' ? 'Menunggu' : 'Terbit');
          }
        }
      })
      .catch((err) => {
        console.warn('API fetch error, using stored mock:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rawId]);

  // Sync editor innerHTML when keteranganHtml changes initially
  useEffect(() => {
    if (editorRef.current && keteranganHtml && !hasInitializedEditor.current) {
      editorRef.current.innerHTML = keteranganHtml;
      hasInitializedEditor.current = true;
    }
  }, [keteranganHtml]);

  // Check active styles under selection
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
        stylingMenuRef.current &&
        !stylingMenuRef.current.contains(event.target as Node)
      ) {
        setIsStylingMenuOpen(false);
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
      setKeteranganHtml(editorRef.current.innerHTML);
      checkActiveStyles();
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Masukkan tautan URL (contoh: https://perpusnas.go.id):', 'https://');
    if (url) {
      execFormat('createLink', url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLampiranName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawText = editorRef.current?.innerText?.trim() || '';
    const htmlContent = editorRef.current?.innerHTML?.trim() || '';

    if (!judul.trim()) {
      alert('Nama judul dokumen wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const storedDocs = getStoredInternalDocs();
      const updatedList = storedDocs.map((item) => {
        if (item.id === rawId || item.title.toLowerCase().includes(rawId.toLowerCase())) {
          return {
            ...item,
            title: judul,
            category: jenisDokumen || item.category,
            keterangan: htmlContent || rawText || judul,
            attachmentName: lampiranName || item.attachmentName,
            publishedAt: tanggal.toISOString(),
          };
        }
        return item;
      });
      saveStoredInternalDocs(updatedList);

      try {
        await fetch(`/api/internal-documents/${rawId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: judul,
            categoryName: jenisDokumen,
            keterangan: htmlContent || rawText || judul,
            attachmentName: lampiranName || `${judul.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            publishedAt: tanggal.toISOString(),
            status: status || 'Terbit',
          }),
        });
      } catch (e) {
        console.warn('API PUT failed, relying on local storage update', e);
      }

      setSuccessMessage('Dokumen internal berhasil diperbarui!');
      setTimeout(() => {
        router.push(`/kabar-kedinasan/dokumen-intern/${rawId}`);
      }, 1200);
    } catch {
      alert('Terjadi kesalahan saat memperbarui dokumen internal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
        <div className="max-w-5xl mx-auto w-full space-y-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-48" />
          <div className="h-96 bg-slate-100 border border-[#c5c6d2] rounded-lg p-8 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <style jsx>{`
        .wysiwyg-editor {
          min-height: 220px;
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

      <div className="max-w-5xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-2 text-sm text-[#444650] mb-6"
        >
          <Link
            href="/beranda"
            className="hover:text-[#00113a] transition-colors"
          >
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Kabar Kedinasan
          </span>
          <span className="text-[#757682]">&gt;</span>
          <Link
            href="/kabar-kedinasan/dokumen-intern"
            className="hover:text-[#00113a] transition-colors"
          >
            Dokumen Intern
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span className="text-[#1a1b20] font-bold">Edit Dokumen</span>
        </nav>

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <section className="bg-white border border-[#c5c6d2] rounded-lg p-6 sm:p-8 md:p-10 shadow-sm w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Judul */}
            <div className="flex flex-col md:flex-row md:items-center">
              <label
                htmlFor="judul"
                className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 flex items-center justify-between pr-4"
              >
                <span>Nama Judul</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1">
                <input
                  id="judul"
                  type="text"
                  required
                  placeholder="Masukkan nama atau judul dokumen internal..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded px-3.5 py-2.5 text-sm text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-colors"
                />
              </div>
            </div>

            {/* Field 2: Tanggal */}
            <div className="flex flex-col md:flex-row md:items-center relative">
              <label
                htmlFor="tanggal-btn"
                className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 flex items-center justify-between pr-4"
              >
                <span>Tanggal</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1 relative" ref={datePickerRef}>
                <button
                  id="tanggal-btn"
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full flex items-center justify-between border border-[#c5c6d2] rounded px-3.5 py-2.5 text-sm text-[#1a1b20] bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <span>{formatDDMMYYYY(tanggal)}</span>
                  <CalendarIcon className="w-4 h-4 text-[#444650]" />
                </button>

                {/* DatePicker Popover */}
                {isDatePickerOpen && (
                  <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-[#c5c6d2] rounded-lg shadow-xl p-4 w-[280px] animate-fadeIn">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm text-[#1a1b20]">
                        {monthNamesIndo[viewDate.getMonth()]}{' '}
                        {viewDate.getFullYear()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="p-1 hover:bg-slate-100 rounded text-[#444650]"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="p-1 hover:bg-slate-100 rounded text-[#444650]"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#757682] mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {getCalendarDays().map((d, index) => {
                        const isSelected =
                          d.isCurrentMonth &&
                          d.day === tanggal.getDate() &&
                          viewDate.getMonth() === tanggal.getMonth() &&
                          viewDate.getFullYear() === tanggal.getFullYear();

                        return (
                          <button
                            key={index}
                            type="button"
                            disabled={!d.isCurrentMonth}
                            onClick={() =>
                              d.isCurrentMonth && selectCalendarDay(d.day)
                            }
                            className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                              !d.isCurrentMonth
                                ? 'text-[#c5c6d2] cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#00113a] text-white font-bold'
                                : 'text-[#1a1b20] hover:bg-[#efedf3]'
                            }`}
                          >
                            {d.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Field 3: Jenis Dokumen */}
            <div className="flex flex-col md:flex-row md:items-center">
              <label
                htmlFor="jenisDokumen"
                className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 flex items-center justify-between pr-4"
              >
                <span>Jenis Dokumen</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1">
                <select
                  id="jenisDokumen"
                  value={jenisDokumen}
                  onChange={(e) => setJenisDokumen(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded px-3.5 py-2.5 text-sm text-[#1a1b20] bg-white focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-colors"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  <option value="Surat Edaran">Surat Edaran</option>
                  <option value="Surat Keputusan">Surat Keputusan</option>
                  <option value="Formulir">Formulir</option>
                  <option value="SOP & Regulasi">SOP &amp; Regulasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Field 4: Keterangan (WYSIWYG) */}
            <div className="flex flex-col md:flex-row md:items-start">
              <label className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 pt-2 flex items-center justify-between pr-4">
                <span>Keterangan</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1 w-full">
                <div className="border border-[#c5c6d2] rounded overflow-hidden focus-within:border-[#00113a] focus-within:ring-1 focus-within:ring-[#00113a] transition-colors">
                  {/* Toolbar */}
                  <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] px-3 py-2 flex flex-wrap items-center gap-1">
                    {/* Styling Dropdown */}
                    <div className="relative" ref={stylingMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsStylingMenuOpen(!isStylingMenuOpen)}
                        className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-[#1a1b20] bg-white border border-[#c5c6d2] rounded hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <Type className="w-3.5 h-3.5 text-[#00113a]" />
                        <span>Styling</span>
                        <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-[#444650]" />
                      </button>

                      {isStylingMenuOpen && (
                        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-[#c5c6d2] rounded shadow-lg py-1 w-44 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              execFormat('formatBlock', '<h1>');
                              setIsStylingMenuOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#efedf3] flex items-center space-x-2 text-[#1a1b20]"
                          >
                            <Heading1 className="w-4 h-4 text-[#00113a]" />
                            <span className="font-bold">Heading 1</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              execFormat('formatBlock', '<h2>');
                              setIsStylingMenuOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#efedf3] flex items-center space-x-2 text-[#1a1b20]"
                          >
                            <Heading2 className="w-4 h-4 text-[#00113a]" />
                            <span className="font-semibold">Heading 2</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              execFormat('formatBlock', '<p>');
                              setIsStylingMenuOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#efedf3] flex items-center space-x-2 text-[#1a1b20]"
                          >
                            <Type className="w-4 h-4 text-[#00113a]" />
                            <span>Paragraf Normal</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              execFormat('formatBlock', '<blockquote>');
                              setIsStylingMenuOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#efedf3] flex items-center space-x-2 text-[#1a1b20]"
                          >
                            <Quote className="w-4 h-4 text-[#00113a]" />
                            <span>Kutipan (Quote)</span>
                          </button>
                          <div className="border-t border-[#c5c6d2] my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              execFormat('hiliteColor', '#fef08a');
                              setIsStylingMenuOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#efedf3] flex items-center space-x-2 text-[#1a1b20]"
                          >
                            <Highlighter className="w-4 h-4 text-amber-500" />
                            <span>Sorot Kuning</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="h-4 w-px bg-[#c5c6d2] mx-1" />

                    {/* Basic formats */}
                    <button
                      type="button"
                      onClick={() => execFormat('bold')}
                      title="Tebal (Ctrl+B)"
                      className={`p-1.5 rounded transition-colors ${
                        activeStyles.bold
                          ? 'bg-[#00113a] text-white'
                          : 'hover:bg-white text-[#444650]'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormat('italic')}
                      title="Miring (Ctrl+I)"
                      className={`p-1.5 rounded transition-colors ${
                        activeStyles.italic
                          ? 'bg-[#00113a] text-white'
                          : 'hover:bg-white text-[#444650]'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormat('underline')}
                      title="Garis Bawah (Ctrl+U)"
                      className={`p-1.5 rounded transition-colors ${
                        activeStyles.underline
                          ? 'bg-[#00113a] text-white'
                          : 'hover:bg-white text-[#444650]'
                      }`}
                    >
                      <Underline className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-[#c5c6d2] mx-1" />

                    {/* Lists */}
                    <button
                      type="button"
                      onClick={() => execFormat('insertUnorderedList')}
                      title="Daftar Poin"
                      className={`p-1.5 rounded transition-colors ${
                        activeStyles.unorderedList
                          ? 'bg-[#00113a] text-white'
                          : 'hover:bg-white text-[#444650]'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormat('insertOrderedList')}
                      title="Daftar Angka"
                      className={`p-1.5 rounded transition-colors ${
                        activeStyles.orderedList
                          ? 'bg-[#00113a] text-white'
                          : 'hover:bg-white text-[#444650]'
                      }`}
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-[#c5c6d2] mx-1" />

                    {/* Link */}
                    <button
                      type="button"
                      onClick={handleLinkInsert}
                      title="Sisipkan Tautan"
                      className="p-1.5 rounded hover:bg-white text-[#444650] transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-[#c5c6d2] mx-1" />

                    {/* Clear Format */}
                    <button
                      type="button"
                      onClick={() => execFormat('removeFormat')}
                      title="Hapus Format"
                      className="px-2 py-1 text-xs text-[#444650] hover:bg-white rounded transition-colors"
                    >
                      Reset
                    </button>
                  </div>

                  {/* WYSIWYG Editable Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) =>
                      setKeteranganHtml(e.currentTarget.innerHTML)
                    }
                    onKeyUp={checkActiveStyles}
                    onMouseUp={checkActiveStyles}
                    data-placeholder="Tulis uraian atau keterangan dokumen internal di sini..."
                    className="wysiwyg-editor p-4 text-sm text-[#1a1b20] leading-relaxed bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Field 5: Lampiran File */}
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 flex items-center justify-between pr-4">
                <span>Dokumen Lampiran</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-[#c5c6d2] rounded text-xs font-bold text-[#1a1b20] bg-[#f4f3f9] hover:bg-[#efedf3] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas</span>
                  </button>
                  <span className="text-xs text-[#444650] truncate max-w-xs">
                    {lampiranName || 'Belum ada file dipilih (PDF, DOC, DOCX maks. 10MB)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Field 6: Status */}
            <div className="flex flex-col md:flex-row md:items-center">
              <label
                htmlFor="status"
                className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 flex items-center justify-between pr-4"
              >
                <span>Status</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded px-3.5 py-2.5 text-sm text-[#1a1b20] bg-white focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-colors"
                >
                  <option value="Terbit">Terbit</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#c5c6d2]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#00113a] text-white text-xs sm:text-sm font-bold rounded hover:bg-[#2a4386] transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link
                href={`/kabar-kedinasan/dokumen-intern/${rawId}`}
                className="px-6 py-2 border border-[#c5c6d2] text-[#444650] text-xs sm:text-sm font-bold rounded hover:bg-[#efedf3] transition-colors inline-block text-center"
              >
                Keluar
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

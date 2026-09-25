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
            setStatus(item.status === 'MENUNGGU' ? 'Menunggu' : 'Terbit');
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
                    <button
                      type="button"
                      title="Tebal (Bold)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        execFormat('bold');
                      }}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeStyles.bold
                          ? 'bg-[#d8d6e1] text-[#00113a]'
                          : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Miring (Italic)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        execFormat('italic');
                      }}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeStyles.italic
                          ? 'bg-[#d8d6e1] text-[#00113a]'
                          : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Garis Bawah (Underline)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        execFormat('underline');
                      }}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeStyles.underline
                          ? 'bg-[#d8d6e1] text-[#00113a]'
                          : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                      }`}
                    >
                      <Underline className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                    <button
                      type="button"
                      title="Daftar Bulat (Bullet List)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        execFormat('insertUnorderedList');
                      }}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeStyles.unorderedList
                          ? 'bg-[#d8d6e1] text-[#00113a]'
                          : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Daftar Angka (Numbered List)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        execFormat('insertOrderedList');
                      }}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        activeStyles.orderedList
                          ? 'bg-[#d8d6e1] text-[#00113a]'
                          : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                      }`}
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                    <button
                      type="button"
                      title="Sisipkan Tautan Web (Link)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleLinkInsert();
                      }}
                      className="p-1.5 hover:bg-[#e9e7ee] rounded text-[#1a1b20] transition-colors cursor-pointer"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* WYSIWYG ContentEditable */}
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
                    data-placeholder="Tuliskan keterangan dokumen..."
                    className="wysiwyg-editor w-full p-4 text-sm sm:text-base bg-white text-[#1a1b20] focus:outline-none min-h-[150px] max-h-[400px] overflow-y-auto leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Field 5: Lampiran (File Upload) */}
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-56 font-bold text-sm text-[#1a1b20] mb-2 md:mb-0 flex items-center justify-between pr-4">
                <span>Lampiran</span>
                <span className="hidden md:inline text-[#1a1b20]">:</span>
              </label>
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Nama file .pdf/ .docx"
                  value={lampiranName}
                  onChange={(e) => setLampiranName(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-l px-3.5 py-2.5 text-sm text-[#1a1b20] bg-white focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-[#f4f3f9] border border-l-0 border-[#c5c6d2] rounded-r text-sm font-bold text-[#1a1b20] hover:bg-[#e9e7ee] transition-colors shrink-0"
                >
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center mt-6">
              <div className="w-full md:w-56 hidden md:block"></div>
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-2.5 bg-[#00113a] text-white font-bold rounded hover:bg-[#2a4386] transition-colors disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <Link
                  href="/kabar-kedinasan/dokumen-intern"
                  className="w-full sm:w-auto px-8 py-2.5 bg-transparent border border-[#c5c6d2] text-[#1a1b20] font-bold rounded hover:bg-[#f4f3f9] transition-colors text-center text-sm"
                >
                  Keluar
                </Link>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

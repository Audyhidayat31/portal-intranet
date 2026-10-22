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
  Heading1,
  Heading2,
  Quote,
  Type,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { STITCH_MOCK_INTERNAL_DOCS_5 } from '@/lib/mock-internal-documents';

export default function EditDokumenInternalPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  // Form states
  const [judul, setJudul] = useState('');
  const [nomorDokumen, setNomorDokumen] = useState('');
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [keteranganHtml, setKeteranganHtml] = useState('');
  const [attachments, setAttachments] = useState<{ file?: File; name: string; preview?: string | null }[]>([]);
  const [jenisDokumen, setJenisDokumen] = useState('');
  const [status, setStatus] = useState<'Terbit' | 'Menunggu' | ''>('Terbit');

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

  // Status dropdown state
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  // Styling dropdown state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

  // WYSIWYG Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);
  const hasInitializedEditor = useRef(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setIsStatusMenuOpen(false);
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

  // Load existing document data
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetch(`/api/internal-documents/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setJudul(item.title || '');
          setNomorDokumen(item.documentNumber || item.source || '');
          if (item.publishedAt) {
            const d = new Date(item.publishedAt);
            if (!isNaN(d.getTime())) {
              setTanggal(d);
              setViewDate(d);
            }
          }
          const content = item.body || item.keterangan || item.excerpt || '';
          // Strip bracketed document number if stored at start of body
          const cleanedContent = content.replace(/^\[[^\]]+\]\s*/, '');
          setKeteranganHtml(cleanedContent);
          if (editorRef.current) {
            editorRef.current.innerHTML = cleanedContent;
          }
          if (item.attachmentName) {
            const names = item.attachmentName.split(',').map((n: string) => n.trim()).filter(Boolean);
            let urls: string[] = [];
            if (item.attachmentUrl) {
              try {
                const parsed = JSON.parse(item.attachmentUrl);
                if (Array.isArray(parsed)) urls = parsed;
                else if (typeof parsed === 'string') urls = [parsed];
              } catch {
                urls = [item.attachmentUrl];
              }
            }
            setAttachments(names.map((name: string, idx: number) => ({
              name,
              preview: urls[idx] || (name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null),
            })));
          } else {
            setAttachments([]);
          }
          setJenisDokumen(item.category?.name || item.category || 'Surat Edaran');
          setStatus(item.status === 'MENUNGGU' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit');
        } else {
          const matchedMock = STITCH_MOCK_INTERNAL_DOCS_5.find((m) => m.id === id);
          if (matchedMock) {
            setJudul(matchedMock.title || '');
            setNomorDokumen(matchedMock.documentNumber || '');
            if (matchedMock.publishedAt) {
              const d = new Date(matchedMock.publishedAt);
              if (!isNaN(d.getTime())) {
                setTanggal(d);
                setViewDate(d);
              }
            }
            setKeteranganHtml(matchedMock.keterangan || '');
            if (editorRef.current) {
              editorRef.current.innerHTML = matchedMock.keterangan || '';
            }
            if (matchedMock.attachmentName) {
              const names = matchedMock.attachmentName.split(',').map((n: string) => n.trim()).filter(Boolean);
              setAttachments(names.map((name: string) => ({
                name,
                preview: name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null,
              })));
            } else {
              setAttachments([]);
            }
            setJenisDokumen(matchedMock.category || 'Surat Edaran');
            setStatus('Terbit');
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching internal document:', err);
        const matchedMock = STITCH_MOCK_INTERNAL_DOCS_5.find((m) => m.id === id);
        if (matchedMock) {
          setJudul(matchedMock.title || '');
          setNomorDokumen(matchedMock.documentNumber || '');
          setKeteranganHtml(matchedMock.keterangan || '');
          if (editorRef.current) {
            editorRef.current.innerHTML = matchedMock.keterangan || '';
          }
          if (matchedMock.attachmentName) {
            const names = matchedMock.attachmentName.split(',').map((n: string) => n.trim()).filter(Boolean);
            setAttachments(names.map((name: string) => ({
              name,
              preview: name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? `/uploads/${name}` : null,
            })));
          } else {
            setAttachments([]);
          }
          setJenisDokumen(matchedMock.category || 'Surat Edaran');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!hasInitializedEditor.current && keteranganHtml && editorRef.current) {
      editorRef.current.innerHTML = keteranganHtml;
      hasInitializedEditor.current = true;
    }
  }, [keteranganHtml]);

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

  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const nonPdf = files.find(
      (f) => !f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf'
    );
    if (nonPdf) {
      alert(`File "${nonPdf.name}" bukan format .pdf. Hanya file .pdf yang diperbolehkan.`);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
      return;
    }

    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      alert(`File "${oversized.name}" melebihi ukuran maksimal 5MB`);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
      return;
    }

    if (attachments.length + files.length > 10) {
      alert('Maksimal 10 lampiran diperbolehkan');
      return;
    }

    const newAttachments = await Promise.all(
      files.map(async (file) => {
        let preview: string | null = null;
        try {
          preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string) || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        } catch {}
        return {
          file,
          name: file.name,
          preview,
        };
      })
    );

    setAttachments([...attachments, ...newAttachments]);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawText = editorRef.current?.innerText?.trim() || '';
    const htmlContent = editorRef.current?.innerHTML?.trim() || '';

    if (!judul.trim()) {
      alert('Silakan isi Judul');
      return;
    }
    if (!nomorDokumen.trim()) {
      alert('Silakan isi Nomor Dokumen');
      return;
    }
    if (!rawText && !htmlContent) {
      alert('Silakan isi Keterangan');
      return;
    }
    if (!jenisDokumen.trim()) {
      alert('Silakan pilih Jenis Dokumen');
      return;
    }

    setIsSubmitting(true);
    try {
      const validPreviews = attachments.map((a) => a.preview).filter(Boolean);
      const res = await fetch(`/api/internal-documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: judul,
          documentNumber: nomorDokumen || undefined,
          categoryName: jenisDokumen || 'Surat Edaran',
          keterangan: htmlContent || rawText,
          attachmentName: attachments.length > 0 ? attachments.map((a) => a.name).join(', ') : null,
          attachmentUrl: validPreviews.length > 0 ? JSON.stringify(validPreviews) : null,
          publishedAt: tanggal.toISOString(),
          status: status || 'Terbit',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Dokumen internal berhasil diperbarui!');
        setTimeout(() => {
          router.push(`/kabar-kedinasan/dokumen-intern/${id}`);
        }, 1200);
      } else {
        alert(data.message || 'Gagal memperbarui dokumen internal');
      }
    } catch {
      alert('Terjadi kesalahan saat memperbarui dokumen internal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
        <div className="max-w-4xl mx-auto w-full space-y-6 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-48" />
          <div className="h-8 bg-slate-200 rounded w-80" />
          <div className="h-96 bg-slate-100 border border-[#c5c6d2] rounded-lg p-8 space-y-4">
            <div className="h-10 bg-slate-200 rounded w-full" />
            <div className="h-10 bg-slate-200 rounded w-full" />
            <div className="h-40 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
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
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        .wysiwyg-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        .wysiwyg-editor li {
          display: list-item !important;
          margin-bottom: 0.25rem !important;
        }
        .wysiwyg-editor h1 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          color: #00113a !important;
        }
        .wysiwyg-editor h2 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
          color: #00113a !important;
        }
        .wysiwyg-editor blockquote {
          border-left: 4px solid #c5c6d2 !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          color: #444650 !important;
          margin: 0.75rem 0 !important;
        }
        .wysiwyg-editor a {
          color: #002366 !important;
          text-decoration: underline !important;
        }
      `}</style>

      <div>
        {/* Breadcrumb matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>Kabar Kedinasan</span>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan/dokumen-intern" className="hover:text-[#00113a] transition-colors">
            Dokumen Internal
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span className="font-bold text-[#1a1b20]">Edit</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] tracking-tight mb-8">
          Edit Dokumen Internal
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
                <span>Judul <span className="text-red-500">*</span></span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3">
                <input
                  id="judul"
                  type="text"
                  required
                  placeholder="Nama Judul Dokumen"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded focus:ring-1 focus:ring-[#00113a] focus:border-[#00113a] px-3 text-sm bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Field: Nomor Dokumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="nomorDokumen"
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Nomor Dokumen <span className="text-red-500">*</span></span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3">
                <input
                  id="nomorDokumen"
                  type="text"
                  required
                  placeholder="Masukkan Nomor Dokumen"
                  value={nomorDokumen}
                  onChange={(e) => setNomorDokumen(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded focus:ring-1 focus:ring-[#00113a] focus:border-[#00113a] px-3 text-sm bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Field: Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start relative">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Tanggal</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 flex flex-wrap gap-4 items-center relative" ref={datePickerRef}>
                <input
                  type="text"
                  readOnly
                  value={formatDDMMYYYY(tanggal)}
                  onClick={() => {
                    setViewDate(tanggal);
                    setIsDatePickerOpen(!isDatePickerOpen);
                  }}
                  className="w-40 h-10 border border-[#c5c6d2] rounded px-3 text-sm text-center bg-white text-[#1a1b20] font-semibold cursor-pointer hover:border-[#00113a] transition-colors focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    setViewDate(tanggal);
                    setIsDatePickerOpen(!isDatePickerOpen);
                  }}
                  className="h-10 border border-[#c5c6d2] rounded px-4 bg-[#f4f3f9] hover:bg-[#e9e7ee] text-[#444650] text-sm flex items-center gap-3 transition-colors shadow-sm focus:outline-none cursor-pointer"
                >
                  <span className="font-medium">DatePicker</span>
                  <CalendarIcon className="w-4 h-4 text-[#444650]" />
                </button>

                {/* Popover Calendar */}
                {isDatePickerOpen && (
                  <div className="absolute top-12 left-0 z-50 bg-white border border-[#c5c6d2] rounded-xl shadow-2xl p-4 w-72 sm:w-80 animate-fadeIn">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
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
                                ? 'bg-[#00113a] text-white font-bold shadow-sm'
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
            </div>

            {/* Field: Keterangan with WYSIWYG */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="keterangan"
                className="font-bold text-sm text-[#1a1b20] pt-2 md:col-span-1 flex items-start"
              >
                <span>Keterangan <span className="text-red-500">*</span></span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 border border-[#c5c6d2] rounded overflow-hidden shadow-xs">
                {/* WYSIWYG Toolbar */}
                <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex gap-1 sm:gap-2 items-center text-[#444650] flex-wrap relative select-none">
                  <button
                    type="button"
                    title="Tebal (Bold)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('bold');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.bold ? 'bg-[#00113a] text-white' : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
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
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.italic ? 'bg-[#00113a] text-white' : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
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
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.underline ? 'bg-[#00113a] text-white' : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                  <button
                    type="button"
                    title="Daftar Poin (Bullet List)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertUnorderedList');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.unorderedList ? 'bg-[#00113a] text-white' : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Daftar Bernomor (Numbered List)"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertOrderedList');
                    }}
                    className={`p-1.5 rounded transition-colors ${
                      activeStyles.orderedList ? 'bg-[#00113a] text-white' : 'hover:bg-[#e9e7ee] text-[#1a1b20]'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                  <button
                    type="button"
                    title="Sisipkan Tautan"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLinkInsert();
                    }}
                    className="p-1.5 rounded hover:bg-[#e9e7ee] text-[#1a1b20] transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  {/* Heading / Style Dropdown */}
                  <div className="relative ml-auto" ref={stylingMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsStylingMenuOpen(!isStylingMenuOpen)}
                      className="px-2 py-1 text-xs border border-[#c5c6d2] rounded bg-white hover:bg-[#f4f3f9] text-[#1a1b20] flex items-center gap-1.5 transition-colors"
                    >
                      <Type className="w-3.5 h-3.5 text-[#00113a]" />
                      <span>Format</span>
                      <ChevronDown className="w-3 h-3 text-[#757682]" />
                    </button>

                    {isStylingMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#c5c6d2] rounded-md shadow-xl py-1 z-50 animate-fadeIn">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            execFormat('formatBlock', '<h1>');
                            setIsStylingMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                        >
                          <Heading1 className="w-4 h-4 text-[#00113a]" />
                          <span>Judul 1 (H1)</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            execFormat('formatBlock', '<h2>');
                            setIsStylingMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                        >
                          <Heading2 className="w-4 h-4 text-[#00113a]" />
                          <span>Judul 2 (H2)</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            execFormat('formatBlock', '<p>');
                            setIsStylingMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                        >
                          <Type className="w-4 h-4 text-[#757682]" />
                          <span>Paragraf Normal</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            execFormat('formatBlock', '<blockquote>');
                            setIsStylingMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f4f3f9] flex items-center gap-2 text-[#1a1b20]"
                        >
                          <Quote className="w-4 h-4 text-[#757682]" />
                          <span>Kutipan (Quote)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* WYSIWYG ContentEditable */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => {
                    if (editorRef.current) {
                      setKeteranganHtml(editorRef.current.innerHTML);
                    }
                  }}
                  onKeyUp={checkActiveStyles}
                  onMouseUp={checkActiveStyles}
                  data-placeholder="Tuliskan keterangan lengkap dokumen internal di sini..."
                  className="wysiwyg-editor w-full p-4 text-sm sm:text-base bg-white text-[#1a1b20] focus:outline-none max-h-[400px] overflow-y-auto leading-relaxed"
                />
              </div>
            </div>

            {/* Field: Lampiran */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1">
                <span>Lampiran (Maks. 10 File)</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 space-y-3">
                <div>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value={attachments.length > 0 ? (attachments.length === 1 ? attachments[0].name : `${attachments.length} file dipilih`) : ''}
                      placeholder="File berupa .pdf"
                      className="flex-grow h-10 border border-r-0 border-[#c5c6d2] rounded-l px-3 text-sm bg-white text-[#444650] placeholder-[#757682] cursor-default focus:outline-none"
                    />
                    <input
                      ref={attachmentInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      suppressHydrationWarning
                      onChange={handleAttachmentChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => attachmentInputRef.current?.click()}
                      disabled={attachments.length >= 10}
                      className="px-6 h-10 bg-[#e9e7ee] border border-[#c5c6d2] rounded-r text-[#1a1b20] font-bold text-xs sm:text-sm hover:bg-[#e1e3e4] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                  <p className="text-xs text-[#757682] mt-1.5 font-normal">File Maksimal 5MB</p>
                </div>

                {/* Previews */}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
                    {attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="relative group bg-[#e9e7ee] border border-[#c5c6d2] rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center"
                      >
                        {att.preview ? (
                          <img
                            src={att.preview}
                            alt={att.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-2">
                            <FileText className="w-8 h-8 text-[#00113a]" />
                            <span className="text-[10px] font-bold text-center break-all line-clamp-2 text-[#00113a]">
                              {att.name}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
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

            {/* Field: Jenis Dokumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="jenisDokumen"
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Jenis Dokumen <span className="text-red-500">*</span></span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-2 relative">
                <select
                  id="jenisDokumen"
                  required
                  value={jenisDokumen}
                  onChange={(e) => setJenisDokumen(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded appearance-none bg-[#f4f3f9] text-[#1a1b20] px-3 text-sm focus:outline-none focus:border-[#00113a] cursor-pointer"
                >
                  <option value="">Pilih Jenis Dokumen</option>
                  <option value="Surat Edaran">Surat Edaran</option>
                  <option value="Surat Keputusan">Surat Keputusan</option>
                  <option value="Formulir">Formulir</option>
                  <option value="SOP & Regulasi">SOP & Regulasi</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#757682] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Field: Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-center">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Status</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 relative w-full md:w-56" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={`w-full bg-[#5a626a] hover:bg-[#4d545b] text-white py-2.5 px-4 font-medium text-sm flex items-center justify-between transition-colors shadow-xs cursor-pointer ${
                    isStatusMenuOpen ? 'rounded-t-md' : 'rounded-md'
                  }`}
                >
                  <span className="truncate">{status || 'Pilih Jenis Status'}</span>
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

            {/* Action Buttons matching Stitch */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-[#c5c6d2]">
              <div className="hidden md:block md:col-span-1" />
              <div className="md:col-span-3 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-[#00113a] text-white font-bold rounded hover:bg-[#2a4386] transition-colors shadow-sm text-sm min-w-[120px] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <Link
                  href={`/kabar-kedinasan/dokumen-intern/${id}`}
                  className="px-8 py-2.5 bg-transparent border border-[#c5c6d2] text-[#1a1b20] font-bold rounded hover:bg-[#f4f3f9] transition-colors text-sm min-w-[120px] text-center inline-block cursor-pointer"
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

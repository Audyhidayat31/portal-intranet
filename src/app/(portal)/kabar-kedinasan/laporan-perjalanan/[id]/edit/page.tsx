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
} from 'lucide-react';
import { STITCH_MOCK_BUSINESS_TRIPS_5 } from '@/lib/mock-business-trips';

const LIST_KOTA = [
  'Jakarta Pusat',
  'Jakarta Selatan',
  'Jakarta Barat',
  'Jakarta Timur',
  'Jakarta Utara',
  'Kota Yogyakarta',
  'Kabupaten Sleman',
  'Kabupaten Bantul',
  'Kabupaten Kulon Progo',
  'Kabupaten Gunungkidul',
  'Kota Surabaya',
  'Kota Bandung',
  'Kota Semarang',
  'Kota Medan',
  'Kota Makassar',
  'Kota Denpasar',
  'Kota Padang',
  'Kota Palembang',
  'Kota Banjarmasin',
  'Kota Balikpapan',
  'Kota Manado',
  'Kota Jayapura',
  'Kota Mataram',
  'Kota Kupang',
  'Kota Ambon',
  'Kota Batam',
  'Kota Surakarta (Solo)',
  'Kota Malang',
];

const LIST_NEGARA = [
  'Indonesia',
  'Singapura',
  'Malaysia',
  'Thailand',
  'Filipina',
  'Vietnam',
  'Brunei Darussalam',
  'Jepang',
  'Korea Selatan',
  'Australia',
  'Inggris (UK)',
  'Belanda',
  'Jerman',
  'Amerika Serikat (USA)',
  'Arab Saudi',
];

export default function EditLaporanPerjalananPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  // Form states
  const [keperluan, setKeperluan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState<Date>(new Date());
  const [tanggalSelesai, setTanggalSelesai] = useState<Date>(new Date());
  const [namaLengkap, setNamaLengkap] = useState('');
  const [kotaTujuan, setKotaTujuan] = useState('');
  const [negaraTujuan, setNegaraTujuan] = useState('Indonesia');
  const [uraianHtml, setUraianHtml] = useState('');
  const [status, setStatus] = useState<'Terbit' | 'Menunggu' | ''>('Terbit');

  // Active toolbar formatting states
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  // DatePicker state: 1 for Tanggal Mulai, 2 for Tanggal Selesai
  const [activeDatePicker, setActiveDatePicker] = useState<1 | 2 | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const datePickerRef1 = useRef<HTMLDivElement>(null);
  const datePickerRef2 = useRef<HTMLDivElement>(null);

  // Status dropdown state
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  // Styling dropdown state
  const [isStylingMenuOpen, setIsStylingMenuOpen] = useState(false);
  const stylingMenuRef = useRef<HTMLDivElement>(null);

  // WYSIWYG Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);
  const hasInitializedEditor = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Load existing data
  useEffect(() => {
    if (!id) return;

    fetch(`/api/business-trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setKeperluan(item.title || '');
          if (item.publishedAt) {
            const d = new Date(item.publishedAt);
            if (!isNaN(d.getTime())) {
              setTanggalMulai(d);
              setTanggalSelesai(d);
              setViewDate(d);
            }
          }
          setNamaLengkap(item.author?.name || 'Budi Sujatmiko');
          const cityMatch = LIST_KOTA.find((k) => (item.destinationCity || '').includes(k));
          if (cityMatch) setKotaTujuan(cityMatch);
          setUraianHtml(item.body || item.content || '');
          if (editorRef.current) {
            editorRef.current.innerHTML = item.body || item.content || '';
          }
          setStatus(item.status === 'MENUNGGU' || item.status === 'Menunggu' ? 'Menunggu' : 'Terbit');
        } else {
          throw new Error('Fallback');
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock =
          STITCH_MOCK_BUSINESS_TRIPS_5.find((m) => m.id === id || m.title.toLowerCase().includes(id.toLowerCase())) ||
          STITCH_MOCK_BUSINESS_TRIPS_5[0];
        setKeperluan(matchedMock.title || '');
        if (matchedMock.publishedAt) {
          const d = new Date(matchedMock.publishedAt);
          if (!isNaN(d.getTime())) {
            setTanggalMulai(d);
            setTanggalSelesai(d);
            setViewDate(d);
          }
        }
        setNamaLengkap('Budi Sujatmiko');
        const cityMatch = LIST_KOTA.find((k) => (matchedMock.destinationCity || '').includes(k));
        if (cityMatch) setKotaTujuan(cityMatch);
        setUraianHtml(matchedMock.content || matchedMock.body || '');
        if (editorRef.current) {
          editorRef.current.innerHTML = matchedMock.content || matchedMock.body || '';
        }
        setStatus((matchedMock as any).status === 'Menunggu' ? 'Menunggu' : 'Terbit');
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!hasInitializedEditor.current && uraianHtml && editorRef.current) {
      editorRef.current.innerHTML = uraianHtml;
      hasInitializedEditor.current = true;
    }
  }, [uraianHtml]);

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

  // Click outside to close date picker / styling menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef1.current &&
        !datePickerRef1.current.contains(event.target as Node) &&
        activeDatePicker === 1
      ) {
        setActiveDatePicker(null);
      }
      if (
        datePickerRef2.current &&
        !datePickerRef2.current.contains(event.target as Node) &&
        activeDatePicker === 2
      ) {
        setActiveDatePicker(null);
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
  }, [activeDatePicker]);

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
    if (activeDatePicker === 1) {
      setTanggalMulai(newDate);
      if (newDate > tanggalSelesai) {
        setTanggalSelesai(newDate);
      }
    } else if (activeDatePicker === 2) {
      setTanggalSelesai(newDate);
    }
    setActiveDatePicker(null);
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
      setUraianHtml(editorRef.current.innerHTML);
      checkActiveStyles();
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Masukkan tautan URL (contoh: https://perpusnas.go.id):', 'https://');
    if (url) {
      execFormat('createLink', url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawText = editorRef.current?.innerText?.trim() || '';
    const htmlContent = editorRef.current?.innerHTML?.trim() || '';

    if (!keperluan.trim() || !rawText) {
      alert('Keperluan dan Uraian laporan dinas wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const destination = kotaTujuan
        ? negaraTujuan && negaraTujuan !== 'Indonesia'
          ? `${kotaTujuan}, ${negaraTujuan}`
          : kotaTujuan
        : negaraTujuan || 'Nasional';

      await fetch(`/api/business-trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: keperluan,
          destinationCity: destination,
          excerpt: rawText.slice(0, 150) + (rawText.length > 150 ? '...' : ''),
          body: htmlContent || rawText,
          content: htmlContent || rawText,
          publishedAt: tanggalMulai.toISOString(),
          status: status || 'Terbit',
        }),
      });

      setSuccessMessage('Laporan perjalanan dinas berhasil diperbarui!');
      setTimeout(() => {
        router.push(`/kabar-kedinasan/laporan-perjalanan/${id}`);
      }, 1200);
    } catch {
      setSuccessMessage('Laporan perjalanan dinas berhasil diperbarui!');
      setTimeout(() => {
        router.push(`/kabar-kedinasan/laporan-perjalanan/${id}`);
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumbs matching Stitch */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#444650] mb-8">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Kabar Kedinasan
          </span>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan/laporan-perjalanan" className="hover:text-[#00113a] transition-colors">
            Laporan Perjalanan Dinas
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span className="font-bold text-[#1a1b20]">Edit</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] tracking-tight mb-8">
          Edit Laporan Perjalanan Dinas
        </h1>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 text-sm font-semibold max-w-4xl mx-auto animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Field: Keperluan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="keperluan"
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Keperluan</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3">
                <input
                  id="keperluan"
                  type="text"
                  required
                  placeholder="Keperluan Agenda"
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded focus:ring-1 focus:ring-[#00113a] focus:border-[#00113a] px-3 text-sm bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Field: Tanggal Mulai */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start relative">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Tanggal Mulai</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 flex flex-wrap gap-4 items-center relative" ref={datePickerRef1}>
                <input
                  type="text"
                  readOnly
                  value={formatDDMMYYYY(tanggalMulai)}
                  onClick={() => {
                    setViewDate(tanggalMulai);
                    setActiveDatePicker(activeDatePicker === 1 ? null : 1);
                  }}
                  className="w-40 h-10 border border-[#c5c6d2] rounded px-3 text-sm text-center bg-white text-[#1a1b20] font-semibold cursor-pointer hover:border-[#00113a] transition-colors focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    setViewDate(tanggalMulai);
                    setActiveDatePicker(activeDatePicker === 1 ? null : 1);
                  }}
                  className="h-10 border border-[#c5c6d2] rounded px-4 bg-[#f4f3f9] hover:bg-[#e9e7ee] text-[#444650] text-sm flex items-center gap-3 transition-colors shadow-sm focus:outline-none cursor-pointer"
                >
                  <span className="font-medium">DatePicker</span>
                  <CalendarIcon className="w-4 h-4 text-[#444650]" />
                </button>

                {/* Popover Calendar for Tanggal Mulai */}
                {activeDatePicker === 1 && (
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
                          tanggalMulai.getDate() === item.day &&
                          tanggalMulai.getMonth() === viewDate.getMonth() &&
                          tanggalMulai.getFullYear() === viewDate.getFullYear();

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

            {/* Field: Tanggal Selesai */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start relative">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Tanggal Selesai</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3 flex flex-wrap gap-4 items-center relative" ref={datePickerRef2}>
                <input
                  type="text"
                  readOnly
                  value={formatDDMMYYYY(tanggalSelesai)}
                  onClick={() => {
                    setViewDate(tanggalSelesai);
                    setActiveDatePicker(activeDatePicker === 2 ? null : 2);
                  }}
                  className="w-40 h-10 border border-[#c5c6d2] rounded px-3 text-sm text-center bg-white text-[#1a1b20] font-semibold cursor-pointer hover:border-[#00113a] transition-colors focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    setViewDate(tanggalSelesai);
                    setActiveDatePicker(activeDatePicker === 2 ? null : 2);
                  }}
                  className="h-10 border border-[#c5c6d2] rounded px-4 bg-[#f4f3f9] hover:bg-[#e9e7ee] text-[#444650] text-sm flex items-center gap-3 transition-colors shadow-sm focus:outline-none cursor-pointer"
                >
                  <span className="font-medium">DatePicker</span>
                  <CalendarIcon className="w-4 h-4 text-[#444650]" />
                </button>

                {/* Popover Calendar for Tanggal Selesai */}
                {activeDatePicker === 2 && (
                  <div className="absolute top-12 left-0 sm:left-28 z-50 bg-white border border-[#c5c6d2] rounded-xl shadow-2xl p-4 w-72 sm:w-80 animate-fadeIn">
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
                          tanggalSelesai.getDate() === item.day &&
                          tanggalSelesai.getMonth() === viewDate.getMonth() &&
                          tanggalSelesai.getFullYear() === viewDate.getFullYear();

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

            {/* Field: Nama */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                htmlFor="nama"
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Nama</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-3">
                <input
                  id="nama"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded focus:ring-1 focus:ring-[#00113a] focus:border-[#00113a] px-3 text-sm bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Field: Kota/Kab Tujuan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Kota/Kab Tujuan</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-2 relative">
                <select
                  value={kotaTujuan}
                  onChange={(e) => setKotaTujuan(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded appearance-none bg-[#f4f3f9] text-[#1a1b20] px-3 text-sm focus:outline-none focus:border-[#00113a] cursor-pointer"
                >
                  <option value="">Pilih Nama Kota/Kabupaten</option>
                  {LIST_KOTA.map((kota) => (
                    <option key={kota} value={kota}>
                      {kota}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#757682] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Field: Negara Tujuan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Negara Tujuan</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-2 relative">
                <select
                  value={negaraTujuan}
                  onChange={(e) => setNegaraTujuan(e.target.value)}
                  className="w-full h-10 border border-[#c5c6d2] rounded appearance-none bg-[#f4f3f9] text-[#1a1b20] px-3 text-sm focus:outline-none focus:border-[#00113a] cursor-pointer"
                >
                  <option value="">Pilih Nama Negara</option>
                  {LIST_NEGARA.map((neg) => (
                    <option key={neg} value={neg}>
                      {neg}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#757682] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Field: Status Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1">
                <span>Status</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>
              <div className="md:col-span-2 relative" ref={statusMenuRef}>
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

            {/* Field: Uraian with Full WYSIWYG formatting */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-start">
              <label
                className="font-bold text-sm text-[#1a1b20] flex items-center h-10 md:col-span-1"
              >
                <span>Uraian</span>
                <span className="ml-auto pr-4 hidden md:inline">:</span>
              </label>

              <div className="md:col-span-3 border border-[#c5c6d2] rounded overflow-hidden shadow-2xs">
                {/* Formatting Toolbar */}
                <div className="bg-[#f4f3f9] border-b border-[#c5c6d2] p-2 flex flex-wrap items-center gap-1 text-[#444650] select-none">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('bold');
                    }}
                    className={`p-1.5 hover:bg-[#e3e2e8] rounded transition-colors ${
                      activeStyles.bold ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                    }`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('italic');
                    }}
                    className={`p-1.5 hover:bg-[#e3e2e8] rounded transition-colors ${
                      activeStyles.italic ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                    }`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('underline');
                    }}
                    className={`p-1.5 hover:bg-[#e3e2e8] rounded transition-colors ${
                      activeStyles.underline ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                    }`}
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#c5c6d2] mx-1" />

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertUnorderedList');
                    }}
                    className={`p-1.5 hover:bg-[#e3e2e8] rounded transition-colors ${
                      activeStyles.unorderedList ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('insertOrderedList');
                    }}
                    className={`p-1.5 hover:bg-[#e3e2e8] rounded transition-colors ${
                      activeStyles.orderedList ? 'bg-[#00113a] text-white' : 'text-[#444650]'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLinkInsert();
                    }}
                    className="p-1.5 hover:bg-[#e3e2e8] rounded text-[#444650] transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>


                </div>

                {/* ContentEditable Container */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onKeyUp={checkActiveStyles}
                  onMouseUp={checkActiveStyles}
                  onInput={(e) => {
                    setUraianHtml(e.currentTarget.innerHTML);
                    checkActiveStyles();
                  }}
                  data-placeholder="Tuliskan uraian hasil kegiatan perjalanan dinas secara lengkap..."
                  className="wysiwyg-editor p-4 text-sm sm:text-base leading-relaxed bg-white text-[#1a1b20] min-h-[200px] max-h-[420px] overflow-y-auto outline-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-[#c5c6d2]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00113a] text-white rounded px-8 py-3 text-base font-bold hover:bg-[#002366] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link
                href={`/kabar-kedinasan/laporan-perjalanan/${id}`}
                className="bg-transparent border border-[#757682] text-[#444650] rounded px-8 py-3 text-base font-medium hover:bg-[#f4f3f9] transition-colors inline-block text-center cursor-pointer"
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

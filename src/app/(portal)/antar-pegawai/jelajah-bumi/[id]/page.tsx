'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Download,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  STITCH_MOCK_JELAJAH_BUMI_9,
  DEFAULT_STITCH_JELAJAH_DETAIL,
  JelajahBumiItem,
} from '@/lib/mock-jelajah-bumi';

// Mock 5 attachment images matching Stitch design
const MOCK_ATTACHMENT_IMAGES = [
  { id: 1, label: 'Gambar', src: '/images/jelajah-bumi/card-1.jpg' },
  { id: 2, label: 'Gambar', src: '/images/jelajah-bumi/card-2.jpg' },
  { id: 3, label: 'Gambar', src: '/images/jelajah-bumi/card-3.jpg' },
  { id: 4, label: 'Gambar', src: '/images/jelajah-bumi/card-4.jpg' },
  { id: 5, label: 'Gambar', src: '/images/jelajah-bumi/card-5.jpg' },
];

export default function DetailJelajahBumiPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial =
    STITCH_MOCK_JELAJAH_BUMI_9.find(
      (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
    ) || DEFAULT_STITCH_JELAJAH_DETAIL;

  const [item, setItem] = useState<any>(
    matchedInitial ? { ...matchedInitial, body: matchedInitial.content } : null
  );
  const [isLoading, setIsLoading] = useState(!matchedInitial);

  // Lightbox preview for attachments
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (!rawId) return;

    if (
      rawId === 'default' ||
      rawId === 'detail' ||
      rawId === 'penerbitan-buku-sastra' ||
      rawId.includes('penerbitan')
    ) {
      setItem(DEFAULT_STITCH_JELAJAH_DETAIL);
      setIsLoading(false);
      return;
    }

    if (!matchedInitial) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const apiItem = data.data;
          setItem(apiItem);
        } else {
          const matchedMock = STITCH_MOCK_JELAJAH_BUMI_9.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              body: matchedMock.content,
            };
            setItem(fullItem);
          } else {
            setItem(DEFAULT_STITCH_JELAJAH_DETAIL);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_JELAJAH_BUMI_9.find((m) => m.id === rawId);
        if (matchedMock) {
          setItem({ ...matchedMock, body: matchedMock.content });
        } else {
          setItem(DEFAULT_STITCH_JELAJAH_DETAIL);
        }
        setIsLoading(false);
      });
  }, [rawId, matchedInitial]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/employee-posts/${item?.id || rawId}`, {
        method: 'DELETE',
      });
      router.push('/antar-pegawai/jelajah-bumi');
    } catch {
      router.push('/antar-pegawai/jelajah-bumi');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayTitle =
    item?.title ||
    'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia';

  const displayDate = item?.publishedAt
    ? item.publishedAt.includes('-')
      ? formatDate(item.publishedAt)
      : item.publishedAt
    : '20 Agustus 2026';

  const displayContent =
    item?.body ||
    item?.content ||
    `Penerbitan buku karya sastra ini menjadi momen bersejarah dalam memajukan literasi dan mendokumentasikan kekayaan intelektual bangsa. Acara ini dihadiri oleh berbagai kalangan pustakawan, akademisi, sastrawan, serta mitra kerja Perpustakaan Nasional.

Melalui karya ini diharapkan generasi muda semakin terinspirasi untuk terus berkarya, membaca, serta menjaga warisan budaya literasi nusantara.`;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai" className="hover:text-[#00113a] transition-colors">
            Antar Pegawai
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai/jelajah-bumi" className="hover:text-[#00113a] transition-colors">
            Jelajah Bumi
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span className="text-[#1a1b20] font-bold">Detail</span>
        </nav>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Main Card Container Centered matching Stitch */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative">
          {/* Red Close Button [X] at top-right matching Stitch */}
          <Link
            href="/antar-pegawai/jelajah-bumi"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {/* Main Title */}
          <div className="pr-10 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#00113a] leading-tight tracking-tight">
              {displayTitle}
            </h1>
          </div>

          {/* Metadata: TANGGAL */}
          <div className="mb-6">
            <p className="text-xs font-bold text-[#757682] uppercase tracking-wider mb-1">
              TANGGAL
            </p>
            <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
              {displayDate}
            </p>
          </div>

          {/* Section: Uraian Jelajah Bumi */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Jelajah Bumi
            </h2>

            <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {displayContent}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: LAMPIRAN */}
          <div>
            <h3 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-4">
              LAMPIRAN
            </h3>

            {/* 5 Attachment Thumbnails matching Stitch */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {MOCK_ATTACHMENT_IMAGES.map((att) => (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => setPreviewImage(att.src)}
                  className="aspect-square bg-[#e2e3ea] hover:bg-[#d8d9e2] border border-[#c5c6d2] rounded-md flex flex-col items-center justify-center text-xs text-[#757682] hover:text-[#00113a] font-medium transition-all group shadow-2xs cursor-pointer"
                >
                  <span className="text-xs font-medium text-[#757682] group-hover:text-[#1a1b20] transition-colors">
                    {att.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Stitch */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            {/* Left: Dibuat oleh & copyright */}
            <div className="text-xs text-[#757682] space-y-0.5">
              <p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                © 2026 Perpusnas RI. Seluruh Hak Cipta Dilindungi.
              </p>
              <p className="font-medium text-[#757682]">
                {displayDate}
              </p>
            </div>

            {/* Right: Edit & Hapus Buttons matching Stitch */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Link
                href={`/antar-pegawai/jelajah-bumi/${item?.id || rawId}/edit`}
                className="px-7 py-1.5 bg-white border border-[#c5c6d2] hover:bg-[#f4f3f9] text-[#1a1b20] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs cursor-pointer inline-flex items-center justify-center"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-7 py-1.5 bg-white border border-[#dc2626] hover:bg-red-50 text-[#dc2626] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-400" />
                Pratinjau Dokumen Lampiran
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-white hover:text-rose-400 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-100 max-h-[75vh]">
              <img
                src={previewImage}
                alt="Lampiran Dokumen"
                className="max-h-[65vh] w-auto object-contain rounded shadow"
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => alert('Mengunduh berkas lampiran resmi...')}
                className="px-5 py-2 bg-[#00113a] text-white text-xs font-bold rounded hover:bg-[#2a4386] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2]">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Jelajah Bumi</h2>
            </div>
            <p className="text-sm text-[#444650] leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus catatan Jelajah Bumi{' '}
              <span className="font-bold text-[#1a1b20]">"{displayTitle}"</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 text-sm font-bold text-[#444650] hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-6 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

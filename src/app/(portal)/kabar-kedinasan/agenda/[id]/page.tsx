'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_AGENDAS_6, MOCK_AGENDA_ATTACHMENTS_5, AgendaItem } from '@/lib/mock-agendas';

export default function DetailAgendaKegiatanPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial = STITCH_MOCK_AGENDAS_6.find(
    (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
  );

  const [agendaItem, setAgendaItem] = useState<any>(
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

    if (!matchedInitial) {
      setIsLoading(true);
    }
    fetch(`/api/agendas/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setAgendaItem(item);
        } else {
          const matchedMock = STITCH_MOCK_AGENDAS_6.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              body: matchedMock.content,
            };
            setAgendaItem(fullItem);
          } else {
            const fallback = {
              id: rawId,
              title: 'Membangun Ekosistem Perpustakaan Digital Nasional Masa Depan',
              publishedAt: '2026-08-19',
              eventLocation: 'Ruang Teater Lt. 2, Gedung Perpusnas Medan Merdeka Selatan',
              body: `Rapat koordinasi nasional dan pemaparan hasil riset indeks kegemaran membaca masyarakat Indonesia bersama pemangku kepentingan perpustakaan daerah. Menampilkan inovasi pojok baca terpadu dan layanan perpustakaan digital inklusif.\n\nKegiatan ini berfokus pada sinkronisasi data repositori daerah dengan server induk Perpustakaan Nasional RI demi mendukung satu data literasi nusantara.`,
            };
            setAgendaItem(fallback);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_AGENDAS_6.find((m) => m.id === rawId);
        if (matchedMock) {
          setAgendaItem(matchedMock);
        }
        setIsLoading(false);
      });
  }, [rawId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/agendas/${agendaItem?.id || rawId}`, {
        method: 'DELETE',
      });
      router.push('/kabar-kedinasan/agenda');
    } catch {
      router.push('/kabar-kedinasan/agenda');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayTitle =
    agendaItem?.title ||
    'Membangun Ekosistem Perpustakaan Digital Nasional Masa Depan';

  const displayDate = agendaItem?.publishedAt
    ? agendaItem.publishedAt
    : '19 Agustus 2026';

  const displayContent =
    agendaItem?.body ||
    agendaItem?.content ||
    `Rapat koordinasi nasional dan pemaparan hasil riset indeks kegemaran membaca masyarakat Indonesia bersama pemangku kepentingan perpustakaan daerah. Menampilkan inovasi pojok baca terpadu dan layanan perpustakaan digital inklusif.\n\nKegiatan ini berfokus pada sinkronisasi data repositori daerah dengan server induk Perpustakaan Nasional RI demi mendukung satu data literasi nusantara.`;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Coretan Opini Detail */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Kabar Kedinasan
          </span>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan/agenda" className="hover:text-[#00113a] transition-colors">
            Agenda Kegiatan
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

        {/* Main Card Container Centered matching Coretan Opini Detail */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative">
          {/* Red Close Button [X] at top-right matching Coretan Opini Detail */}
          <Link
            href="/kabar-kedinasan/agenda"
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
            {agendaItem?.eventLocation && (
              <p className="text-xs sm:text-sm text-[#444650] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00113a]" />
                <span>{agendaItem.eventLocation}</span>
              </p>
            )}
          </div>

          {/* Section: Uraian Agenda Kegiatan */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Agenda Kegiatan
            </h2>

            <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {displayContent}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: LAMPIRAN matching Coretan Opini Detail */}
          <div>
            <h3 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-4">
              LAMPIRAN
            </h3>

            {/* 5 Attachment Thumbnails matching Coretan Opini Detail */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {MOCK_AGENDA_ATTACHMENTS_5.map((att) => (
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

          {/* Section: Footer Metadata & Action Buttons matching Coretan Opini Detail */}
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

            {/* Right: Edit & Hapus Buttons matching Coretan Opini Detail */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Link
                href={`/kabar-kedinasan/agenda/${rawId}/edit`}
                className="px-7 py-1.5 bg-white border border-[#c5c6d2] hover:bg-[#f4f3f9] text-[#1a1b20] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs inline-block text-center cursor-pointer"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-7 py-1.5 bg-white border border-[#c5c6d2] hover:bg-red-50 text-[#dc2626] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-lg p-3 max-w-xl w-full relative shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-video bg-slate-100 rounded overflow-hidden flex items-center justify-center">
              <img
                src={previewImage}
                alt="Lampiran Agenda"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center relative shadow-2xl border border-[#c5c6d2] animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#dc2626] mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1b20] mb-1">
              Hapus Agenda Kegiatan?
            </h3>
            <p className="text-xs text-[#757682] mb-6">
              Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus agenda kegiatan ini?
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-[#c5c6d2] rounded text-sm text-[#444650] hover:bg-[#f4f3f9] font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-[#dc2626] text-white rounded text-sm font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_BUSINESS_TRIPS_5 } from '@/lib/mock-business-trips';

// Mock attachments matching Stitch design
const MOCK_ATTACHMENTS = [
  { id: 1, label: 'Gambar 1', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY' },
  { id: 2, label: 'Gambar 2', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJqpdSWqi4KV1i-7jRf5iLGbx7hzXZT6om8uIvM6Gxh0jV2217HFACRTVNUj9PNSo7vEuRRYeUmI1t-2pe14o1qmLagxWhJ8R_Qf--olga7oGtqFYccTYNq95i4_BhUSogjJjz5SfLZC_7wD76F8GYvjcHSnQx87IqiQa86g7cQcKgNEow-OUj0s2q9NPO1WZwilwfT6BiJdtO_K4nDNLMTyDGct-4LqRCTkZTpkoqVCdiBMwRi2ok' },
  { id: 3, label: 'Gambar 3', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI9cPSwXjFyHERvym2knhVWw52knpd44L_RzO4mxF1mkeifUx-CCkcDsMvUz-jeJ7FRgSD0M27t2zJ5gr6Au6RAF7hMjY1Wj66bX91ufsyoOE4hjb_XNsFEp7agZfcGU3bEq4018Hu0nMy8ago94SxgTT1e8gEnLAovVnW_7wo1OzeA4VvhDM4beZeI23BCOOebX5yJzMUYB5MM0zLaV4YtVzNEh3Lsp2mUcG4kATp4iiJDiSGfU39' },
  { id: 4, label: 'Gambar 4', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq3Ad8SbNOIHo0l9dhaMbOOwA1Iwqkkfy5ANAXfx-vsxNnI8KtjS1CvMh7SlurVnlI7yll3VK6_XW6UTVXcyruVrkvw1tvquaCUL24HL5BE-ni2nrKhqTt13tN5_xdfzD8DeovuX47t3-wOkX8ryv1RlYFsR8T8s7MuGHf56zyiQWIIL0pFNq5luI_twZYDjWsb9xIlkOIRTV7x0TORFPGBTvVOOiKvM1ftqaDIIpMHw3MILOaWIT9' },
  { id: 5, label: 'Gambar 5', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcEp5AHIEhsaj4SjiT47pEN4U7HzCY8xYtSRg9bu4F9lRBQ0Ml6NfPIjSsn_OxTBiElMg8jw7MAUDPMf94hXJX1P3LgnxS6ryuybJ7Knlan21Dkn0bNayCQkcPYj9iCkRUzu8fIqCa1x9CXHawljgI-7aARboh7C4o3i5CceIdAeDM6OlBGI-Y8_tM2eWsYRZSS3WzLShZ1ndXDFg83Fn8wFPywwZjV21IdTOlzQo1yHIwPTo3SpZ9' },
];

export default function DetailLaporanPerjalananPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial = STITCH_MOCK_BUSINESS_TRIPS_5.find(
    (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
  );

  const [report, setReport] = useState<any>(
    matchedInitial ? { ...matchedInitial, body: matchedInitial.content || matchedInitial.body } : null
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
    fetch(`/api/business-trips/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setReport(item);
        } else {
          // Check if it matches our mock items
          const matchedMock = STITCH_MOCK_BUSINESS_TRIPS_5.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              body: matchedMock.content || matchedMock.body,
            };
            setReport(fullItem);
          } else {
            const fallback = {
              id: rawId,
              title: 'Laporan Perjalanan Dinas Pelatihan Kearsipan Digital di Yogyakarta',
              publishedAt: '2026-08-20',
              destinationCity: 'Yogyakarta',
              body: `Perjalanan dinas ini dilaksanakan dalam rangka mengikuti Pelatihan Kearsipan Digital Tingkat Lanjut yang diselenggarakan oleh Arsip Nasional Republik Indonesia (ANRI) cabang Yogyakarta. Pelatihan berlangsung selama tiga hari, mulai tanggal 15 hingga 17 Agustus 2026, bertempat di Hotel Tentrem, Yogyakarta.

Fokus utama dari pelatihan ini adalah pada implementasi sistem pengarsipan berbasis cloud untuk institusi pemerintahan dan strategi migrasi dari arsip fisik ke format digital dengan standar keamanan tinggi. Sesi-sesi meliputi:
• Standarisasi Metadata Arsip Digital (Pembicara: Dr. Hendrawan).
• Keamanan Data Siber dalam Sistem Pengarsipan Terpusat.
• Workshop Praktis: Migrasi Data Skala Besar menggunakan Sistem Manajemen Arsip Dinamis (SRIKANDI).

Hasil dari pelatihan ini sangat relevan dengan inisiatif digitalisasi yang sedang berlangsung di Perpusnas RI. Pengetahuan yang didapat akan segera dideseminasikan kepada tim IT dan kearsipan internal dalam sesi knowledge sharing minggu depan. Diharapkan kita dapat mengadopsi beberapa protokol keamanan baru yang diperkenalkan selama pelatihan.`,
              attachmentName: 'Laporan_Dinas_Kearsipan_Digital_Yogyakarta_2026.pdf',
              author: {
                name: 'Budi Sujatmiko',
                profile: {
                  position: 'Pustakawan Ahli Muda',
                  unitKerja: 'Pusat Preservasi & Pengolahan Bahan Pustaka',
                },
              },
            };
            setReport(fallback);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_BUSINESS_TRIPS_5.find((m) => m.id === rawId);
        if (matchedMock) {
          setReport(matchedMock);
        } else {
          setReport(STITCH_MOCK_BUSINESS_TRIPS_5[0]);
        }
        setIsLoading(false);
      });
  }, [rawId]);


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/business-trips/${report?.id || rawId}`, {
        method: 'DELETE',
      });
      router.push('/kabar-kedinasan/laporan-perjalanan');
    } catch {
      router.push('/kabar-kedinasan/laporan-perjalanan');
    } finally {
      setIsDeleting(false);
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
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full">
        {/* Breadcrumbs matching Stitch */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-[#444650] mb-6">
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
          <span className="text-[#1a1b20] font-bold">Detail</span>
        </nav>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn w-full">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Detail Card matching Stitch */}
        <article className="bg-white border border-[#c5c6d2] rounded-lg p-6 sm:p-8 md:p-10 relative shadow-sm w-full">
          {/* Close Button with red background matching Stitch */}
          <Link
            href="/kabar-kedinasan/laporan-perjalanan"
            aria-label="Tutup"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full text-[#444650] hover:bg-[#f4f3f9] hover:text-[#00113a] transition-colors cursor-pointer"
          >
            <span className="bg-[#ba1a1a] text-white rounded-sm p-0.5 flex items-center justify-center">
              <X className="w-4 h-4" />
            </span>
          </Link>

          {/* Header Section matching Stitch */}
          <header className="mb-8 pr-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00113a] mb-4 tracking-tight leading-snug">
              {report?.title || 'Laporan Perjalanan Dinas'}
            </h1>
            <div>
              <span className="font-bold text-xs text-[#444650] uppercase tracking-wider block mb-1">
                Tanggal
              </span>
              <span className="text-sm sm:text-base text-[#1a1b20] font-medium">
                {report?.publishedAt ? formatDate(report.publishedAt) : '19 Agustus 2026'}
                {report?.destinationCity && ` • ${report.destinationCity}`}
              </span>
            </div>
          </header>

          {/* Content Description matching Stitch */}
          <div className="prose max-w-none text-base sm:text-lg text-[#444650] mb-12 min-h-[300px] leading-relaxed whitespace-pre-line space-y-4">
            {report?.body || report?.content || report?.excerpt}
          </div>

          {/* Attachments Section (5 Images Grid) matching Stitch */}
          <div className="border-t border-[#c5c6d2] pt-8 mb-12">
            <h3 className="font-bold text-xs text-[#444650] uppercase tracking-wider mb-4">
              Lampiran
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {MOCK_ATTACHMENTS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPreviewImage(item.src)}
                  className="aspect-square bg-[#e3e2e8] border border-[#c5c6d2] rounded flex items-center justify-center text-[#444650] text-xs hover:bg-[#efedf3] transition-colors cursor-pointer relative overflow-hidden group shadow-2xs"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Lihat Foto
                  </div>
                </div>
              ))}
            </div>

            {report?.attachmentName && (
              <div className="mt-6 p-4 bg-[#f4f3f9] border border-[#c5c6d2] rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#00113a] truncate max-w-md">
                  <FileText className="w-5 h-5 text-[#00113a] shrink-0" />
                  <span className="truncate">{report.attachmentName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh berkas laporan: ${report.attachmentName}`)}
                  className="bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Meta & Actions matching Stitch */}
          <footer className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-[#c5c6d2] pt-6 gap-6">
            <div>
              <span className="font-bold text-xs text-[#444650] block mb-1">
                Dibuat oleh
              </span>
              <div className="text-sm sm:text-base font-medium text-[#1a1b20]">
                {report?.author?.name || 'Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.'}
              </div>
              <div className="text-xs text-[#757682] mt-0.5">
                {report?.publishedAt ? formatDate(report.publishedAt) : '19 Agustus 2026'}
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <Link
                href={`/kabar-kedinasan/laporan-perjalanan/${rawId}/edit`}
                className="flex-1 md:flex-none px-6 py-2 border border-[#757682] text-[#1a1b20] rounded font-bold text-xs sm:text-sm hover:bg-[#efedf3] transition-colors inline-block text-center"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 md:flex-none px-6 py-2 border border-[#ba1a1a] text-[#ba1a1a] rounded font-bold text-xs sm:text-sm hover:bg-[#ffdad6] hover:border-[#ba1a1a] transition-colors"
              >
                Hapus
              </button>
            </div>
          </footer>
        </article>
      </div>

      {/* Lightbox Modal for Attachment Pictures */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl p-2 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Preview Lampiran"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1b20] mb-2">Hapus Laporan Perjalanan Dinas?</h3>
            <p className="text-xs text-[#444650] mb-6 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Laporan perjalanan dinas akan dihapus secara permanen dari sistem.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md border border-[#c5c6d2]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-5 py-2 text-xs font-bold bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-md shadow-sm disabled:opacity-50"
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

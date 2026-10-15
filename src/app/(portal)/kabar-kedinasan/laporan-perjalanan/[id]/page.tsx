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
import { formatDate, canManageContent } from '@/lib/utils';
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

  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox preview for attachments
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!rawId) return;

    setIsLoading(true);
    fetch(`/api/business-trips/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setReport(data.data);
        } else {
          // Check if it matches our mock items strictly by ID
          const matchedMock = STITCH_MOCK_BUSINESS_TRIPS_5.find(
            (m) => m.id === rawId
          );

          if (matchedMock) {
            setReport({
              ...matchedMock,
              body: matchedMock.content || matchedMock.body,
            });
          } else {
            setReport(null);
          }
        }
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_BUSINESS_TRIPS_5.find((m) => m.id === rawId);
        if (matchedMock) {
          setReport(matchedMock);
        } else {
          setReport(null);
        }
      })
      .finally(() => {
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

  if (!report) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-bold text-[#00113a] mb-2">Laporan Tidak Ditemukan</h2>
        <p className="text-sm text-[#757682] mb-6">Laporan perjalanan dinas yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link
          href="/kabar-kedinasan/laporan-perjalanan"
          className="bg-[#00113a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a4386] transition-colors"
        >
          Kembali ke Daftar Laporan
        </Link>
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
          <div className="prose max-w-none text-base sm:text-lg text-[#444650] mb-12 min-h-[160px] leading-relaxed space-y-4">
            {report?.body && (report.body.includes('<p>') || report.body.includes('<div>') || report.body.includes('<br>') || report.body.includes('<strong>') || report.body.includes('<b>')) ? (
              <div dangerouslySetInnerHTML={{ __html: report.body }} />
            ) : (
              <div className="whitespace-pre-line">{report?.body || report?.content || report?.excerpt}</div>
            )}
          </div>

          {/* Attachments Section */}
          {((report?.id?.startsWith('trip-') && MOCK_ATTACHMENTS.length > 0) || report?.coverImage || report?.attachmentName) && (
            <div className="border-t border-[#c5c6d2] pt-8 mb-12">
              <h3 className="font-bold text-xs text-[#444650] uppercase tracking-wider mb-4">
                Lampiran
              </h3>

              {report?.coverImage && (
                <div className="mb-6 max-w-md">
                  <div
                    onClick={() => setPreviewImage(report.coverImage)}
                    className="aspect-video bg-[#e3e2e8] border border-[#c5c6d2] rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={report.coverImage}
                      alt="Lampiran Kegiatan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {report?.id?.startsWith('trip-') && (
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
              )}

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
          )}

          {/* Footer Meta & Actions matching Stitch */}
          <footer className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-[#c5c6d2] pt-6 gap-6">
            <div className="flex flex-row gap-6">
              <div className="w-[220px]">
                <span className="font-bold text-xs text-[#444650] block mb-1">
                  Dibuat oleh
                </span>
                <div className="text-sm sm:text-base font-medium text-[#1a1b20]">
                  {report?.author?.name || report?.authorName || 'Administrator Perpusnas'}
                </div>
                <div className="text-xs text-[#757682] mt-0.5">
                  {report?.publishedAt ? formatDate(report.publishedAt) : '19 Agustus 2026'}
                </div>
                <div className="text-xs text-[#757682] mt-0.5">
                  Status: {(report?.status === 'MENUNGGU' || report?.status === 'Menunggu' || report?.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                </div>
              </div>

              {(report?.updatedAt && report?.createdAt && new Date(report.updatedAt).getTime() - new Date(report.createdAt).getTime() > 1000) && (
                <>
                  <div className="border-l border-[#c5c6d2]" />
                  <div className="w-[220px]">
                    <span className="font-bold text-xs text-[#444650] block mb-1">
                      Diperbarui oleh
                    </span>
                    <div className="text-sm sm:text-base font-medium text-[#1a1b20]">
                      {report?.editor?.name || report?.author?.name || report?.authorName || 'Administrator Perpusnas'}
                    </div>
                    <div className="text-xs text-[#757682] mt-0.5">
                      {formatDate(report.updatedAt)}
                    </div>
                    <div className="text-xs text-[#757682] mt-0.5">
                      Status: {(report?.status === 'MENUNGGU' || report?.status === 'Menunggu' || report?.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                    </div>
                  </div>
                </>
              )}
            </div>

            {canManageContent(currentUser, report) && (
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
            )}
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  FileText,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Download,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_INTERNAL_DOCS_5, InternalDocument } from '@/lib/mock-internal-documents';

// Mock 5 attachment images matching Stitch design
const MOCK_ATTACHMENT_IMAGES = [
  { id: 1, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY' },
  { id: 2, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJqpdSWqi4KV1i-7jRf5iLGbx7hzXZT6om8uIvM6Gxh0jV2217HFACRTVNUj9PNSo7vEuRRYeUmI1t-2pe14o1qmLagxWhJ8R_Qf--olga7oGtqFYccTYNq95i4_BhUSogjJjz5SfLZC_7wD76F8GYvjcHSnQx87IqiQa86g7cQcKgNEow-OUj0s2q9NPO1WZwilwfT6BiJdtO_K4nDNLMTyDGct-4LqRCTkZTpkoqVCdiBMwRi2ok' },
  { id: 3, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI9cPSwXjFyHERvym2knhVWw52knpd44L_RzO4mxF1mkeifUx-CCkcDsMvUz-jeJ7FRgSD0M27t2zJ5gr6Au6RAF7hMjY1Wj66bX91ufsyoOE4hjb_XNsFEp7agZfcGU3bEq4018Hu0nMy8ago94SxgTT1e8gEnLAovVnW_7wo1OzeA4VvhDM4beZeI23BCOOebX5yJzMUYB5MM0zLaV4YtVzNEh3Lsp2mUcG4kATp4iiJDiSGfU39' },
  { id: 4, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq3Ad8SbNOIHo0l9dhaMbOOwA1Iwqkkfy5ANAXfx-vsxNnI8KtjS1CvMh7SlurVnlI7yll3VK6_XW6UTVXcyruVrkvw1tvquaCUL24HL5BE-ni2nrKhqTt13tN5_xdfzD8DeovuX47t3-wOkX8ryv1RlYFsR8T8s7MuGHf56zyiQWIIL0pFNq5luI_twZYDjWsb9xIlkOIRTV7x0TORFPGBTvVOOiKvM1ftqaDIIpMHw3MILOaWIT9' },
  { id: 5, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcEp5AHIEhsaj4SjiT47pEN4U7HzCY8xYtSRg9bu4F9lRBQ0Ml6NfPIjSsn_OxTBiElMg8jw7MAUDPMf94hXJX1P3LgnxS6ryuybJ7Knlan21Dkn0bNayCQkcPYj9iCkRUzu8fIqCa1x9CXHawljgI-7aARboh7C4o3i5CceIdAeDM6OlBGI-Y8_tM2eWsYRZSS3WzLShZ1ndXDFg83Fn8wFPywwZjV21IdTOlzQo1yHIwPTo3SpZ9' },
];

export default function DetailDokumenInternalPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial = STITCH_MOCK_INTERNAL_DOCS_5.find(
    (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
  );

  const [documentItem, setDocumentItem] = useState<any>(
    matchedInitial ? { ...matchedInitial, content: matchedInitial.keterangan } : null
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
    fetch(`/api/internal-documents/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setDocumentItem(item);
        } else {
          // Check if it matches our mock items
          const matchedMock = STITCH_MOCK_INTERNAL_DOCS_5.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              content: matchedMock.keterangan,
            };
            setDocumentItem(fullItem);
          } else {
            const fallback = {
              id: rawId,
              title: 'Laporan Pelatihan Kearsipan Digital Tingkat Lanjut',
              documentNumber: 'SE/101/VII/2026',
              publishedAt: '2026-08-20',
              keterangan: `Perjalanan dinas ini dilaksanakan dalam rangka mengikuti Pelatihan Kearsipan Digital Tingkat Lanjut yang diselenggarakan oleh Arsip Nasional Republik Indonesia (ANRI) cabang Yogyakarta. Pelatihan berlangsung selama tiga hari, mulai tanggal 15 hingga 17 Agustus 2026, bertempat di Hotel Tentrem, Yogyakarta.

Fokus utama dari pelatihan ini adalah pada implementasi sistem pengarsipan berbasis cloud untuk institusi pemerintahan dan strategi migrasi dari arsip fisik ke format digital dengan standar keamanan tinggi. Sesi-sesi meliputi:
• Standarisasi Metadata Arsip Digital (Pembicara: Dr. Hendrawan).
• Keamanan Data Siber dalam Sistem Pengarsipan Terpusat.
• Workshop Praktis: Migrasi Data Skala Besar menggunakan Sistem Manajemen Arsip Dinamis (SRIKANDI).

Hasil dari pelatihan ini sangat relevan dengan inisiatif digitalisasi yang sedang berlangsung di Perpusnas RI. Pengetahuan yang didapat akan segera dideseminasikan kepada tim IT dan kearsipan internal dalam sesi knowledge sharing minggu depan. Diharapkan kita dapat mengadopsi beberapa protokol keamanan baru yang diperkenalkan selama pelatihan.`,
              attachmentName: 'Surat Edaran.pdf',
            };
            setDocumentItem(fallback);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_INTERNAL_DOCS_5.find((m) => m.id === rawId);
        if (matchedMock) {
          setDocumentItem(matchedMock);
        } else {
          setDocumentItem(STITCH_MOCK_INTERNAL_DOCS_5[0]);
        }
        setIsLoading(false);
      });
  }, [rawId]);


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/internal-documents/${documentItem?.id || rawId}`, {
        method: 'DELETE',
      });
      router.push('/kabar-kedinasan/dokumen-intern');
    } catch {
      router.push('/kabar-kedinasan/dokumen-intern');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayKeterangan =
    documentItem?.keterangan ||
    documentItem?.body ||
    documentItem?.excerpt ||
    `Perjalanan dinas ini dilaksanakan dalam rangka mengikuti Pelatihan Kearsipan Digital Tingkat Lanjut yang diselenggarakan oleh Arsip Nasional Republik Indonesia (ANRI) cabang Yogyakarta. Pelatihan berlangsung selama tiga hari, mulai tanggal 15 hingga 17 Agustus 2026, bertempat di Hotel Tentrem, Yogyakarta.

Fokus utama dari pelatihan ini adalah pada implementasi sistem pengarsipan berbasis cloud untuk institusi pemerintahan dan strategi migrasi dari arsip fisik ke format digital dengan standar keamanan tinggi. Sesi-sesi meliputi:
• Standarisasi Metadata Arsip Digital (Pembicara: Dr. Hendrawan).
• Keamanan Data Siber dalam Sistem Pengarsipan Terpusat.
• Workshop Praktis: Migrasi Data Skala Besar menggunakan Sistem Manajemen Arsip Dinamis (SRIKANDI).

Hasil dari pelatihan ini sangat relevan dengan inisiatif digitalisasi yang sedang berlangsung di Perpusnas RI. Pengetahuan yang didapat akan segera dideseminasikan kepada tim IT dan kearsipan internal dalam sesi knowledge sharing minggu depan. Diharapkan kita dapat mengadopsi beberapa protokol keamanan baru yang diperkenalkan selama pelatihan.`;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Kabar Kedinasan
          </span>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan/dokumen-intern" className="hover:text-[#00113a] transition-colors">
            Dokumen Internal
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

        {/* Main Card Container matching Stitch */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative">
          {/* Red Close Button [X] at top-right matching Stitch */}
          <Link
            href="/kabar-kedinasan/dokumen-intern"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {/* Document Main Title */}
          <div className="pr-10 mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-[#00113a] leading-tight tracking-tight">
              {documentItem?.title || 'Laporan Perjalanan Dinas Pelatihan Kearsipan Digital di Yogyakarta'}
            </h1>
          </div>

          {/* Metadata: Nomor & Tanggal Dokumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs font-bold text-[#757682] mb-1">Nomor</p>
              <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
                {documentItem?.documentNumber || 'SE/101/VII/2026'}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#757682] mb-1">Tanggal Dokumen</p>
              <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
                {documentItem?.publishedAt
                  ? formatDate(documentItem.publishedAt)
                  : '20 Agustus 2026'}
              </p>
            </div>
          </div>

          {/* Metadata: Jenis Dokumen */}
          <div className="mb-8">
            <p className="text-xs font-bold text-[#757682] mb-1">Jenis Dokumen</p>
            <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
              {documentItem?.category?.name || documentItem?.category || 'Surat Edaran'}
            </p>
          </div>

          {/* Section: Keterangan Dokumen */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Keterangan Dokumen
            </h2>

            <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {displayKeterangan}
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
                {documentItem?.publishedAt
                  ? formatDate(documentItem.publishedAt)
                  : '20 Agustus 2026'}
              </p>
            </div>

            {/* Right: Edit & Hapus Buttons matching Stitch */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Link
                href={`/kabar-kedinasan/dokumen-intern/${rawId}/edit`}
                className="px-7 py-1.5 bg-white border border-[#c5c6d2] hover:bg-[#f4f3f9] text-[#1a1b20] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs inline-block text-center"
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
              <h2 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Dokumen</h2>
            </div>
            <p className="text-sm text-[#444650] leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus dokumen internal{' '}
              <span className="font-bold text-[#1a1b20]">"{documentItem?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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

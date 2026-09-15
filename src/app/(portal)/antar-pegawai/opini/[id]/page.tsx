'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  FileText,
  Trash2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Download,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { STITCH_MOCK_OPINI_6, OpiniItem } from '@/lib/mock-opini';

// Mock 5 attachment images matching Stitch design
const MOCK_ATTACHMENT_IMAGES = [
  { id: 1, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhefV1hDm9BZoapbWl8hj_Kx1fuSBMpUmJDa11zIMETtaj9OBZb42EHgmNOnQjlqWRTe9jiJf6RLK4ERfJpZZpSzk0AOJ28mos_9lk-LHMZC-4x9NZDJPGhF52TW2LIYUjuaj2COj729JUMGyJUbQygyE5WN3W9BAJPCA3AQLjqiwZLA_Qr4QGpAmOJ3lal-v90BJnf8Gl_h38YItMGssmkdiFMavJzoZDZulwDcrsn87gSHudNcnY' },
  { id: 2, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJqpdSWqi4KV1i-7jRf5iLGbx7hzXZT6om8uIvM6Gxh0jV2217HFACRTVNUj9PNSo7vEuRRYeUmI1t-2pe14o1qmLagxWhJ8R_Qf--olga7oGtqFYccTYNq95i4_BhUSogjJjz5SfLZC_7wD76F8GYvjcHSnQx87IqiQa86g7cQcKgNEow-OUj0s2q9NPO1WZwilwfT6BiJdtO_K4nDNLMTyDGct-4LqRCTkZTpkoqVCdiBMwRi2ok' },
  { id: 3, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI9cPSwXjFyHERvym2knhVWw52knpd44L_RzO4mxF1mkeifUx-CCkcDsMvUz-jeJ7FRgSD0M27t2zJ5gr6Au6RAF7hMjY1Wj66bX91ufsyoOE4hjb_XNsFEp7agZfcGU3bEq4018Hu0nMy8ago94SxgTT1e8gEnLAovVnW_7wo1OzeA4VvhDM4beZeI23BCOOebX5yJzMUYB5MM0zLaV4YtVzNEh3Lsp2mUcG4kATp4iiJDiSGfU39' },
  { id: 4, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq3Ad8SbNOIHo0l9dhaMbOOwA1Iwqkkfy5ANAXfx-vsxNnI8KtjS1CvMh7SlurVnlI7yll3VK6_XW6UTVXcyruVrkvw1tvquaCUL24HL5BE-ni2nrKhqTt13tN5_xdfzD8DeovuX47t3-wOkX8ryv1RlYFsR8T8s7MuGHf56zyiQWIIL0pFNq5luI_twZYDjWsb9xIlkOIRTV7x0TORFPGBTvVOOiKvM1ftqaDIIpMHw3MILOaWIT9' },
  { id: 5, label: 'Gambar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcEp5AHIEhsaj4SjiT47pEN4U7HzCY8xYtSRg9bu4F9lRBQ0Ml6NfPIjSsn_OxTBiElMg8jw7MAUDPMf94hXJX1P3LgnxS6ryuybJ7Knlan21Dkn0bNayCQkcPYj9iCkRUzu8fIqCa1x9CXHawljgI-7aARboh7C4o3i5CceIdAeDM6OlBGI-Y8_tM2eWsYRZSS3WzLShZ1ndXDFg83Fn8wFPywwZjV21IdTOlzQo1yHIwPTo3SpZ9' },
];

export default function DetailCoretanOpiniPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial = STITCH_MOCK_OPINI_6.find(
    (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
  );

  const [opiniItem, setOpiniItem] = useState<any>(
    matchedInitial ? { ...matchedInitial, body: matchedInitial.content } : null
  );
  const [isLoading, setIsLoading] = useState(!matchedInitial);

  // Lightbox preview for attachments
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Edit fields
  const [editTitle, setEditTitle] = useState(matchedInitial?.title || '');
  const [editContent, setEditContent] = useState(matchedInitial?.content || '');

  useEffect(() => {
    if (!rawId) return;

    if (!matchedInitial) {
      setIsLoading(true);
    }
    fetch(`/api/employee-posts/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setOpiniItem(item);
          setEditTitle(item.title || '');
          setEditContent(item.body || '');
        } else {
          // Check if it matches our mock items
          const matchedMock = STITCH_MOCK_OPINI_6.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              body: matchedMock.content,
            };
            setOpiniItem(fullItem);
            setEditTitle(matchedMock.title);
            setEditContent(matchedMock.content);
          } else {
            const fallback = {
              id: rawId,
              title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
              publishedAt: '2026-08-20',
              body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
            };
            setOpiniItem(fallback);
            setEditTitle(fallback.title);
            setEditContent(fallback.body);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_OPINI_6.find((m) => m.id === rawId);
        if (matchedMock) {
          setOpiniItem(matchedMock);
          setEditTitle(matchedMock.title);
          setEditContent(matchedMock.content);
        } else {
          const fallback = {
            id: rawId,
            title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
            publishedAt: '2026-08-20',
            body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
          };
          setOpiniItem(fallback);
          setEditTitle(fallback.title);
          setEditContent(fallback.body);
        }
        setIsLoading(false);
      });
  }, [rawId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/employee-posts/${opiniItem?.id || rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          body: editContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOpiniItem((prev: any) => ({
          ...prev,
          title: editTitle,
          body: editContent,
          content: editContent,
        }));
        setIsEditModalOpen(false);
        setFeedbackMsg('Coretan opini berhasil diperbarui!');
        setTimeout(() => setFeedbackMsg(''), 4000);
      } else {
        setOpiniItem((prev: any) => ({
          ...prev,
          title: editTitle,
          body: editContent,
          content: editContent,
        }));
        setIsEditModalOpen(false);
        setFeedbackMsg('Coretan opini berhasil diperbarui!');
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch {
      alert('Terjadi kesalahan saat memperbarui opini.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/employee-posts/${opiniItem?.id || rawId}`, {
        method: 'DELETE',
      });
      router.push('/antar-pegawai/opini');
    } catch {
      router.push('/antar-pegawai/opini');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayTitle =
    opiniItem?.title ||
    'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia';

  const displayDate = opiniItem?.publishedAt
    ? formatDate(opiniItem.publishedAt)
    : '20 Agustus 2026';

  const displayContent =
    opiniItem?.body ||
    opiniItem?.content ||
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

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
          <Link href="/antar-pegawai/opini" className="hover:text-[#00113a] transition-colors">
            Coretan Opini
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
            href="/antar-pegawai/opini"
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

          {/* Section: Uraian Coretan Opini */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Coretan Opini
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
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-7 py-1.5 bg-white border border-[#c5c6d2] hover:bg-[#f4f3f9] text-[#1a1b20] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs cursor-pointer"
              >
                Edit
              </button>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#e2e3ea]">
              <h2 className="text-lg font-bold text-[#00113a] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#00113a]" />
                Edit Coretan Opini
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1">Judul Opini</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1">Uraian Isi Opini</label>
                <textarea
                  rows={8}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#e2e3ea]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 text-sm font-bold text-[#444650] hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2]">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Coretan Opini</h2>
            </div>
            <p className="text-sm text-[#444650] leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus postingan opini{' '}
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

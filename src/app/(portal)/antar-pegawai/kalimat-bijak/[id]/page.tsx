'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Edit3,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  STITCH_MOCK_KALIMAT_BIJAK,
  KalimatBijakItem,
} from '@/lib/mock-kalimat-bijak';

export default function DetailKalimatBijakPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial = STITCH_MOCK_KALIMAT_BIJAK.find(
    (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
  );

  const [item, setItem] = useState<KalimatBijakItem | null>(matchedInitial || null);
  const [isLoading, setIsLoading] = useState(!matchedInitial);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Edit fields
  const [editQuote, setEditQuote] = useState(matchedInitial?.quote || matchedInitial?.content || '');
  const [editFigure, setEditFigure] = useState(
    matchedInitial?.figure
      ? `${matchedInitial.figure}${matchedInitial.figureDate ? `, ${matchedInitial.figureDate}` : ''}`
      : 'Soekarno, 1-06-1940'
  );

  useEffect(() => {
    if (!rawId) return;

    fetch(`/api/employee-posts/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const apiData = data.data;
          const formatted: KalimatBijakItem = {
            id: apiData.id,
            title: apiData.title,
            quote: apiData.body || apiData.excerpt || apiData.title,
            excerpt: apiData.excerpt || apiData.title,
            content: apiData.body || '',
            figure: apiData.title || 'Soekarno',
            figureDate: '1-06-1940',
            coverImage: apiData.coverImage || '/images/kabar-keluarga/card-1.jpg',
            publishedAt: apiData.createdAt
              ? formatDate(apiData.createdAt)
              : '20 Agustus 2026',
            status: apiData.status === 'DRAFT' || apiData.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
            authorName: apiData.author?.name || 'Budi Sujatmiko',
            authorPosition: apiData.author?.profile?.position || 'Pustakawan Ahli Madya',
          };
          setItem(formatted);
          setEditQuote(formatted.quote);
          setEditFigure(
            formatted.figure
              ? `${formatted.figure}${formatted.figureDate ? `, ${formatted.figureDate}` : ''}`
              : 'Soekarno, 1-06-1940'
          );
        } else {
          const matched = STITCH_MOCK_KALIMAT_BIJAK.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );
          if (matched) {
            setItem(matched);
            setEditQuote(matched.quote || matched.content || '');
            setEditFigure(
              matched.figure
                ? `${matched.figure}${matched.figureDate ? `, ${matched.figureDate}` : ''}`
                : 'Soekarno, 1-06-1940'
            );
          }
        }
      })
      .catch(() => {
        // Keep initial
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rawId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuote.trim()) return;

    setIsSaving(true);
    try {
      await fetch(`/api/employee-posts/${rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFigure.split(',')[0]?.trim() || item?.title || 'Kalimat Bijak',
          body: editQuote,
        }),
      });

      setItem((prev) =>
        prev
          ? {
              ...prev,
              title: editFigure.split(',')[0]?.trim() || prev.title,
              quote: editQuote,
              content: editQuote,
              figure: editFigure.split(',')[0]?.trim() || prev.figure,
              figureDate: editFigure.split(',')[1]?.trim() || prev.figureDate,
            }
          : null
      );
      setIsEditModalOpen(false);
      setFeedbackMsg('Kalimat bijak berhasil diperbarui!');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch {
      setItem((prev) =>
        prev
          ? {
              ...prev,
              title: editFigure.split(',')[0]?.trim() || prev.title,
              quote: editQuote,
              content: editQuote,
              figure: editFigure.split(',')[0]?.trim() || prev.figure,
              figureDate: editFigure.split(',')[1]?.trim() || prev.figureDate,
            }
          : null
      );
      setIsEditModalOpen(false);
      setFeedbackMsg('Perubahan tersimpan (mode lokal)!');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/employee-posts/${rawId}`, { method: 'DELETE' });
    } catch {
      // Continue
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      router.push('/antar-pegawai/kalimat-bijak');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#00113a] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500">Memuat detail kalimat bijak...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-16 text-center">
        <p className="text-slate-600 mb-4">Kalimat bijak tidak ditemukan.</p>
        <Link
          href="/antar-pegawai/kalimat-bijak"
          className="px-4 py-2 bg-[#00113a] text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  const displayQuote = item.quote || item.content || item.title || 'Deskripsi Kutipan Kalimat Bijak';
  const displayAuthor = item.authorName || 'Budi Sujatmiko';
  const displayDate = item.publishedAt || '20 Agustus 2026';

  const figureSource = item.figure
    ? `${item.figure}${item.figureDate ? `, ${item.figureDate}` : ''}`
    : (item.title ? `${item.title}, 1-06-1940` : 'Soekarno, 1-06-1940');

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Wireframe Gambar 2 */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai" className="hover:text-[#00113a] transition-colors">
            Antar Pegawai
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai/kalimat-bijak" className="hover:text-[#00113a] font-bold text-[#1a1b20] transition-colors">
            Kalimat Bijak
          </Link>
        </nav>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Main Card Container Centered matching Wireframe Gambar 2 */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative min-h-[460px] sm:min-h-[500px] flex flex-col justify-between">
          {/* Red Close Button [X] at top-right matching Wireframe */}
          <Link
            href="/antar-pegawai/kalimat-bijak"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {/* Centered Quote and Source matching Wireframe Gambar 2 */}
          <div className="my-auto py-16 sm:py-24 text-center px-4 max-w-2xl mx-auto flex flex-col items-center justify-center">
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#1a1b20] leading-relaxed mb-4 tracking-tight">
              {displayQuote}
            </h1>
            <p className="text-sm sm:text-base font-medium text-[#757682]">
              {figureSource}
            </p>
          </div>

          {/* Bottom Row: Metadata Left & Actions Right matching Wireframe Gambar 2 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-6">
            {/* Left: Dibuat oleh, Author Name, Date */}
            <div className="text-xs text-[#757682] space-y-0.5">
              <p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                {displayAuthor}
              </p>
              <p className="font-medium text-[#757682]">
                {displayDate}
              </p>
            </div>

            {/* Right: Edit & Hapus Buttons matching Wireframe */}
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

      {/* Edit Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#e2e3ea]">
              <h2 className="text-lg font-bold text-[#00113a] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#00113a]" />
                Edit Kalimat Bijak
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
                <label className="block text-xs font-bold text-[#1a1b20] mb-1">
                  Deskripsi Kutipan Kalimat Bijak
                </label>
                <textarea
                  rows={5}
                  required
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1">
                  Tokoh / Sumber Kutipan (contoh: Soekarno, 1-06-1940)
                </label>
                <input
                  type="text"
                  required
                  value={editFigure}
                  onChange={(e) => setEditFigure(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e3ea]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#c5c6d2] text-[#1a1b20] font-semibold text-xs rounded hover:bg-[#f4f3f9]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#00113a] text-white font-semibold text-xs rounded hover:bg-[#1a2d60] disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-[#c5c6d2] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#00113a] mb-2">
              Hapus Kalimat Bijak?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus kalimat bijak ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 rounded border border-[#c5c6d2] text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
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

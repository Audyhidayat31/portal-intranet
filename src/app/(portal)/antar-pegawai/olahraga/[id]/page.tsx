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
  Download,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  DEFAULT_STITCH_OLAHRAGA_DETAIL,
  STITCH_MOCK_OLAHRAGA_9,
  MOCK_OLAHRAGA_ATTACHMENTS_5,
  OlahragaItem,
  getStoredOlahraga,
  saveStoredOlahraga,
} from '@/lib/mock-olahraga';

export default function DetailOlahragaPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const storedList = getStoredOlahraga();
  const matchedInitial =
    storedList.find((m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())) ||
    STITCH_MOCK_OLAHRAGA_9.find((m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase()));

  const [olahragaItem, setOlahragaItem] = useState<any>(
    matchedInitial ? { ...matchedInitial, body: matchedInitial.content } : DEFAULT_STITCH_OLAHRAGA_DETAIL
  );
  const [isLoading, setIsLoading] = useState(!matchedInitial);

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
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!rawId) return;

    const currentStored = getStoredOlahraga();
    const foundStored = currentStored.find((m) => m.id === rawId);

    if (foundStored) {
      setOlahragaItem({
        ...foundStored,
        body: foundStored.content,
      });
      setIsLoading(false);
      return;
    }

    fetch(`/api/employee-posts/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setOlahragaItem(item);
        } else {
          const matchedMock = STITCH_MOCK_OLAHRAGA_9.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );
          if (matchedMock) {
            setOlahragaItem({
              ...matchedMock,
              body: matchedMock.content,
            });
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_OLAHRAGA_9.find((m) => m.id === rawId);
        if (matchedMock) {
          setOlahragaItem({
            ...matchedMock,
            body: matchedMock.content,
          });
        }
        setIsLoading(false);
      });
  }, [rawId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/employee-posts/${olahragaItem?.id || rawId}`, {
        method: 'DELETE',
      });
    } catch {
      // ignore
    } finally {
      const list = getStoredOlahraga();
      const filtered = list.filter((it) => it.id !== (olahragaItem?.id || rawId));
      saveStoredOlahraga(filtered);
      setIsDeleting(false);
      router.push('/antar-pegawai/olahraga');
    }
  };

  const displayTitle =
    olahragaItem?.title ||
    DEFAULT_STITCH_OLAHRAGA_DETAIL.title;

  const displayDate = olahragaItem?.publishedAt
    ? formatDate(olahragaItem.publishedAt)
    : '20 Agustus 2026';

  const displayAuthor = olahragaItem?.authorName || olahragaItem?.author?.name || 'Ahmad Fauzi';

  const displayContent =
    olahragaItem?.body ||
    olahragaItem?.content ||
    DEFAULT_STITCH_OLAHRAGA_DETAIL.content;

  const attachmentList = olahragaItem?.attachments || [];
  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 flex flex-col gap-8 bg-white min-h-[60vh] justify-center items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#00113a] rounded-full animate-spin"></div>
        <p className="text-[#00113a] font-bold mt-4">Memuat artikel...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch & Wireframe 2 */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Antar Pegawai
          </span>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai/olahraga" className="hover:text-[#00113a] transition-colors">
            Olahraga
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

        {/* Main Card Container Centered matching Wireframe 2 */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative">
          {/* Red Close Button [X] at top-right matching Stitch & Wireframe 2 */}
          <Link
            href="/antar-pegawai/olahraga"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {/* Main Title matching Wireframe 2 */}
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

          {/* Featured Image */}
          {(item?.coverImage || item?.coverImage) && (
            <div className="mb-8 w-full aspect-[2/1] bg-slate-100 rounded-lg overflow-hidden border border-[#c5c6d2]">
              <img src={item?.coverImage || item?.coverImage} alt={displayTitle} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Section: Uraian Artikel Olahraga matching Wireframe 2 */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Artikel Olahraga
            </h2>

            <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {displayContent}
            </div>
          </div>
          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Wireframe 2 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            {/* Left: Dibuat oleh Ahmad Fauzi, 20 Agustus 2026 */}
            
            <div className="flex flex-row gap-6">
              <div className="text-xs text-[#757682] space-y-0.5 w-[220px]"><p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                {displayAuthor}
              </p>
              <p className="font-medium text-[#757682]">
                {displayDate}
              </p>
              
              <p className="font-medium text-[#757682]">
                Status: {olahragaItem?.status === 'MENUNGGU' || olahragaItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
              </p>
            </div>
              {/* Diperbarui Oleh */}
              {true && (
                <>
                  <div className="border-l border-[#c5c6d2]" />
                  <div className="text-xs text-[#757682] space-y-0.5 w-[220px]">
                    <p className="font-semibold text-[#757682]">Diperbarui oleh</p>
                    <p className="font-semibold text-[#1a1b20]">
                      {olahragaItem?.editor?.name || olahragaItem?.author?.name || olahragaItem?.authorName || 'Administrator Perpusnas'}
                    </p>
                    <p className="font-medium text-[#757682]">
                      {olahragaItem?.updatedAt ? formatDate(olahragaItem.updatedAt) : '24 Agustus 2026'}
                    </p>
                    <p className="font-medium text-[#757682]">
                      Status: {olahragaItem?.status === 'MENUNGGU' || olahragaItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right: Edit & Hapus Buttons matching Wireframe 2 */}
            {currentUser && (currentUser.role === 'admin' || currentUser.name === (olahragaItem?.author?.name || olahragaItem?.authorName || 'Ahmad Fauzi')) && (
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href={`/antar-pegawai/olahraga/${olahragaItem?.id || rawId}/edit`}
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
            )}
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
                Pratinjau Dokumen Lampiran Olahraga
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-white hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-100 max-h-[75vh]">
              <img
                src={previewImage}
                alt="Lampiran Dokumen Olahraga"
                className="max-h-[65vh] w-auto object-contain rounded shadow"
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => alert('Mengunduh berkas lampiran olahraga...')}
                className="px-5 py-2 bg-[#00113a] text-white text-xs font-bold rounded hover:bg-[#2a4386] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 transition-colors cursor-pointer"
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
              <h2 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Artikel Olahraga</h2>
            </div>
            <p className="text-sm text-[#444650] leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus artikel olahraga{' '}
              <span className="font-bold text-[#1a1b20]">"{displayTitle}"</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 text-sm font-bold text-[#444650] hover:bg-slate-100 rounded cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-6 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded shadow-sm disabled:opacity-50 cursor-pointer"
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

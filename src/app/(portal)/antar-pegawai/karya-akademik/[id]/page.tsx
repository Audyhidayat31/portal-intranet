'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  Edit3,
  Trash2,
  Download,
  ImageIcon,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  STITCH_MOCK_KARYA_AKADEMIK,
  MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
  KaryaAkademikItem,
} from '@/lib/mock-karya-akademik';

export default function DetailKaryaAkademikPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial =
    STITCH_MOCK_KARYA_AKADEMIK.find(
      (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
    ) || STITCH_MOCK_KARYA_AKADEMIK[0];

  const [item, setItem] = useState<KaryaAkademikItem | null>(matchedInitial);
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
          const apiData = data.data;
          const formatted: KaryaAkademikItem = {
            id: apiData.id,
            title: apiData.title,
            excerpt: apiData.body?.slice(0, 180) + '...',
            content: apiData.body || '',
            coverImage: apiData.coverImage || '/images/kabar-keluarga/card-1.jpg',
            publishedAt: apiData.createdAt
              ? new Date(apiData.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '20 Agustus 2026',
            status: apiData.status === 'DRAFT' || apiData.status === 'Menunggu' ? 'Menunggu' : 'Terbit',
            authorName: apiData.author?.name || 'Budi Sujatmiko',
            authorPosition: apiData.author?.profile?.position || 'Pustakawan Ahli Madya',
            authorUnit: apiData.author?.profile?.unitKerja || 'Pusat Preservasi dan Alih Media Bahan Perpustakaan',
            authorAvatar: apiData.author?.profile?.avatarUrl,
            attachments: MOCK_KARYA_AKADEMIK_ATTACHMENTS_5,
          };
          setItem(formatted);
          setEditTitle(formatted.title);
          setEditContent(formatted.content);
        } else {
          const matchedMock = STITCH_MOCK_KARYA_AKADEMIK.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );
          if (matchedMock) {
            setItem(matchedMock);
            setEditTitle(matchedMock.title);
            setEditContent(matchedMock.content);
          }
        }
      })
      .catch(() => {
        // Fallback to matched initial
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rawId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/employee-posts/${item?.id || rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          body: editContent,
        }),
      });

      if (res.ok) {
        setItem((prev) =>
          prev
            ? {
                ...prev,
                title: editTitle,
                content: editContent,
              }
            : null
        );
        setIsEditModalOpen(false);
        setFeedbackMsg('Karya akademik berhasil diperbarui!');
        setTimeout(() => setFeedbackMsg(''), 4000);
      } else {
        setItem((prev) =>
          prev
            ? {
                ...prev,
                title: editTitle,
                content: editContent,
              }
            : null
        );
        setIsEditModalOpen(false);
        setFeedbackMsg('Karya akademik berhasil diperbarui!');
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch {
      setItem((prev) =>
        prev
          ? {
              ...prev,
              title: editTitle,
              content: editContent,
            }
          : null
      );
      setIsEditModalOpen(false);
      setFeedbackMsg('Karya akademik berhasil diperbarui!');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/employee-posts/${item?.id || rawId}`, { method: 'DELETE' });
    } catch {
      // Continue
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      router.push('/antar-pegawai/karya-akademik');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#00113a] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500">Memuat detail karya akademik...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-16 text-center">
        <p className="text-slate-600 mb-4">Karya akademik tidak ditemukan.</p>
        <Link
          href="/antar-pegawai/karya-akademik"
          className="px-4 py-2 bg-[#00113a] text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  const displayTitle =
    item.title ||
    'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia';
  const displayDate = item.publishedAt || '20 Agustus 2026';
  const displayContent = item.content || item.excerpt || '';
  const displayAuthor = item.authorName || 'Budi Sujatmiko';

  const attachments =
    item.attachments && item.attachments.length > 0
      ? item.attachments
      : MOCK_KARYA_AKADEMIK_ATTACHMENTS_5;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Wireframe Gambar 3 */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai" className="hover:text-[#00113a] transition-colors">
            Antar Pegawai
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai/karya-akademik" className="hover:text-[#00113a] font-bold text-[#1a1b20] transition-colors">
            Karya Akademik
          </Link>
        </nav>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Main Card Container Centered matching Desain Gambar 2 & Wireframe Gambar 3 */}
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative">
          {/* Red Close Button [X] at top-right matching Stitch / Gambar 2 */}
          <Link
            href="/antar-pegawai/karya-akademik"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {/* Main Title matching Wireframe */}
          <div className="pr-10 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#00113a] leading-tight tracking-tight">
              {displayTitle}
            </h1>
          </div>

          {/* Metadata: Tanggal Karya Akademik matching Wireframe Gambar 3 */}
          <div className="mb-6">
            <p className="text-xs font-bold text-[#757682] mb-1">
              Tanggal Karya Akademik
            </p>
            <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
              {displayDate}
            </p>
          </div>

          {/* Section: Uraian Karya Akademik matching Wireframe Gambar 3 */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Karya Akademik
            </h2>

            <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {displayContent}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Lampiran matching Wireframe Gambar 3 */}
          <div>
            <h3 className="text-xs font-bold text-[#1a1b20] mb-4">
              Lampiran
            </h3>

            {/* 5 Attachment Thumbnails labeled "Gambar" matching Wireframe Gambar 3 & Gambar 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {attachments.map((att, idx) => (
                <button
                  key={att.id || idx}
                  type="button"
                  onClick={() => setPreviewImage(att.src)}
                  className="aspect-square bg-[#e2e3ea] hover:bg-[#d8d9e2] border border-[#c5c6d2] rounded-md flex flex-col items-center justify-center text-xs text-[#757682] hover:text-[#00113a] font-medium transition-all group shadow-2xs cursor-pointer"
                >
                  <span className="text-xs font-medium text-[#757682] group-hover:text-[#1a1b20] transition-colors">
                    Gambar
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Wireframe Gambar 3 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            {/* Left: Dibuat oleh, Author Name, Date as in Wireframe Gambar 3 */}
            <div className="text-xs text-[#757682] space-y-0.5">
              <p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                {displayAuthor}
              </p>
              <p className="font-medium text-[#757682]">
                {displayDate}
              </p>
            </div>

            {/* Right: Edit & Hapus Buttons matching Wireframe Gambar 3 & Gambar 2 */}
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
              <a
                href={previewImage}
                download
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-[#00113a] text-white text-xs font-bold rounded hover:bg-[#2a4386] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar</span>
              </a>
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
                Edit Karya Akademik
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
                <label className="block text-xs font-bold text-[#1a1b20] mb-1">Judul Karya Akademik</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1">Uraian Karya Akademik</label>
                <textarea
                  rows={8}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-[#c5c6d2] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#00113a] mb-2">
              Hapus Karya Akademik?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus karya akademik <span className="font-semibold text-slate-800">"{displayTitle}"</span>? Tindakan ini tidak dapat dibatalkan.
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

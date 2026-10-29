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
import { formatDate, canManageContent } from '@/lib/utils';
import AttachmentDetailList from '@/components/portal/AttachmentDetailList';
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
    );

  const [item, setItem] = useState<KaryaAkademikItem | null>(matchedInitial || null);
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

    if (!matchedInitial) {
      setIsLoading(true);
    }

    fetch(`/api/employee-posts/${rawId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const apiData = data.data;
          const formatted: KaryaAkademikItem = {
            ...apiData,
            id: apiData.id,
            title: apiData.title,
            excerpt: apiData.body?.slice(0, 180) + '...',
            content: apiData.body || '',
            coverImage: apiData.coverImage || '/images/logo-perpusnas.png',
            publishedAt: apiData.publishedAt || apiData.createdAt,
            createdAt: apiData.createdAt,
            updatedAt: apiData.updatedAt,
            attachments: apiData.attachments,
            attachmentName: apiData.attachmentName,
            attachmentUrl: apiData.attachmentUrl,
            coverImageName: apiData.coverImageName,
            status: apiData.status === 'TERBIT' || apiData.status === 'Terbit' ? 'Terbit' : 'Menunggu',
            authorName: apiData.author?.name || apiData.authorName || 'Ahmad Fauzi',
            authorPosition: apiData.author?.profile?.position || apiData.authorPosition || 'Peneliti Ahli Madya',
            editor: apiData.editor || (apiData.editorName ? { name: apiData.editorName } : null),
            editorName: apiData.editorName || apiData.editor?.name || null,
          };
          setItem(formatted);
        } else {
          const matched = STITCH_MOCK_KARYA_AKADEMIK.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );
          if (matched) {
            setItem(matched);
          }
        }
      })
      .catch(() => {
        // Keep initial
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [rawId, matchedInitial]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const targetId = item?.id || rawId;
      await fetch(`/api/employee-posts/${targetId}`, { method: 'DELETE' });
      if (typeof window !== 'undefined') {
        try {
          const stored: string[] = JSON.parse(localStorage.getItem('deleted_karya_akademik_ids') || '[]');
          if (!stored.includes(targetId)) stored.push(targetId);
          if (item?.title && !stored.includes(item.title)) stored.push(item.title);
          localStorage.setItem('deleted_karya_akademik_ids', JSON.stringify(stored));
        } catch {}
      }
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
  const rawDate = item?.publishedAt || (item as any)?.createdAt;
  const displayDate = rawDate ? formatDate(rawDate) : formatDate(new Date());
  const displayContent = item.content || item.excerpt || '';
  const displayAuthor = item.authorName || (item as any)?.author?.name || 'Pegawai Perpusnas';
  const localEditor = typeof window !== 'undefined' ? (localStorage.getItem(`last_editor_${item?.id}`) || localStorage.getItem(`last_editor_${rawId}`)) : null;
  const displayEditor = (item as any)?.editor?.name || (item as any)?.editorName || localEditor;

  const attachments =
    item.attachments && item.attachments.length > 0
      ? item.attachments
      : [];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Wireframe Gambar 3 */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span>
            Antar Pegawai
          </span>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/antar-pegawai/karya-akademik" className="hover:text-[#00113a] transition-colors">
            Karya Akademik
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

          {/* Featured Image */}
          {(item?.coverImage || item?.coverImage) && (
            <div className="mb-8 w-full aspect-[2/1] bg-slate-100 rounded-lg overflow-hidden border border-[#c5c6d2]">
              <img src={item?.coverImage || item?.coverImage} alt={displayTitle} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Section: Uraian Karya Akademik matching Wireframe Gambar 3 */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Karya Akademik
            </h2>

            <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
              {displayContent && displayContent.includes('<') && displayContent.includes('>') ? (
                <div
                  className="prose max-w-none text-xs sm:text-sm text-[#1a1b20] leading-relaxed space-y-3 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>i]:italic [&>b]:font-bold [&>strong]:font-bold [&>em]:italic [&_source-footnote]:hidden"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              ) : (
                <span>{displayContent}</span>
              )}
            </div>
          </div>

          {/* Section: LAMPIRAN (Shown if has attachments) */}
          {(item?.attachmentName || item?.attachmentUrl || (item?.attachments && item.attachments.length > 0)) && (
            <div className="mt-8 pt-6 border-t border-[#e2e3ea]">
              <AttachmentDetailList
                attachments={
                  item?.attachments && (!item?.attachmentUrl && !item?.attachmentName)
                    ? item.attachments.map((att: any) => ({
                        name: att.label || `Lampiran ${att.id}`,
                        url: att.src,
                      }))
                    : undefined
                }
                attachmentName={item?.attachmentName}
                attachmentUrl={item?.attachmentUrl}
              />
            </div>
          )}

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Wireframe Gambar 3 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            {/* Left: Dibuat oleh, Author Name, Date as in Wireframe Gambar 3 */}
            
            <div className="flex flex-row gap-6">
              <div className="text-xs text-[#757682] space-y-0.5 w-[220px]"><p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                {displayAuthor}
              </p>
              <p className="font-medium text-[#757682]">
                {displayDate}
              </p>
              <p className="font-medium text-[#757682]">
                Status: {(item as any)?.status === 'MENUNGGU' || (item as any)?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
              </p>
            </div>
              {/* Diperbarui Oleh */}
              {Boolean(displayEditor) && (
                <>
                  <div className="border-l border-[#c5c6d2]" />
                  <div className="text-xs text-[#757682] space-y-0.5 w-[220px]">
                    <p className="font-semibold text-[#757682]">Diperbarui oleh</p>
                    <p className="font-semibold text-[#1a1b20]">
                      {displayEditor}
                    </p>
                    <p className="font-medium text-[#757682]">
                      {(item as any)?.updatedAt ? formatDate((item as any).updatedAt) : ''}
                    </p>
                    <p className="font-medium text-[#757682]">
                      Status: {(item as any)?.status === 'MENUNGGU' || (item as any)?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right: Edit & Hapus Buttons matching Wireframe Gambar 3 & Gambar 2 */}
            {canManageContent(currentUser, item) && (
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href={`/antar-pegawai/karya-akademik/${item?.id || rawId}/edit`}
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

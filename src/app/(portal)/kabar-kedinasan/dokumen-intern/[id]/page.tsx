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
import { formatDate, canManageContent } from '@/lib/utils';
import { STITCH_MOCK_INTERNAL_DOCS_5, InternalDocument } from '@/lib/mock-internal-documents';



export default function DetailDokumenInternalPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const matchedInitial = rawId
    ? STITCH_MOCK_INTERNAL_DOCS_5.find(
        (m) => m.id === rawId || (rawId.length >= 3 && m.title?.toLowerCase().includes(rawId.toLowerCase()))
      )
    : null;

  const [documentItem, setDocumentItem] = useState<any>(
    matchedInitial ? { ...matchedInitial, content: matchedInitial.keterangan } : null
  );

  const [isLoading, setIsLoading] = useState(!documentItem);

  // Lightbox preview for attachments
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Real attachments list
  const attachmentsList = React.useMemo(() => {
    const list: { name: string; url?: string; isImage?: boolean }[] = [];
    if (!documentItem) return list;

    if (documentItem.attachmentUrl) {
      try {
        const parsed = JSON.parse(documentItem.attachmentUrl);
        if (Array.isArray(parsed)) {
          const names = documentItem.attachmentName
            ? documentItem.attachmentName.split(',').map((s: string) => s.trim())
            : [];
          parsed.forEach((url: string, i: number) => {
            const name = names[i] || `Lampiran ${i + 1}`;
            const isImage = Boolean(
              url.startsWith('data:image') ||
                url.match(/\.(jpg|jpeg|png|webp|gif)$/i)
            );
            list.push({ name, url, isImage });
          });
        } else if (typeof parsed === 'string') {
          const isImage = Boolean(
            parsed.startsWith('data:image') ||
              parsed.match(/\.(jpg|jpeg|png|webp|gif)$/i)
          );
          list.push({
            name: documentItem.attachmentName || 'Dokumen Lampiran.pdf',
            url: parsed,
            isImage,
          });
        }
      } catch {
        const url = documentItem.attachmentUrl;
        const isImage = Boolean(
          url.startsWith('data:image') ||
            url.match(/\.(jpg|jpeg|png|webp|gif)$/i)
        );
        list.push({
          name: documentItem.attachmentName || 'Dokumen Lampiran.pdf',
          url,
          isImage,
        });
      }
    } else if (documentItem.attachmentName && documentItem.attachmentName.trim() !== '') {
      const names = documentItem.attachmentName
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      names.forEach((name: string) => {
        const isImage = Boolean(name.match(/\.(jpg|jpeg|png|webp|gif)$/i));
        list.push({ name, url: `/uploads/${name}`, isImage });
      });
    }
    return list;
  }, [documentItem]);

  const hasAttachments = attachmentsList.length > 0;

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

    // Check sessionStorage on mount/rawId change
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(`internal-doc-${rawId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed) {
            setDocumentItem(parsed);
            setIsLoading(false);
          }
        }
      } catch {}
    }

    if (!documentItem) {
      setIsLoading(true);
    }

    // Always revalidate with no-cache to guarantee fresh sync
    fetch(`/api/internal-documents/${rawId}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setDocumentItem(item);
          try {
            sessionStorage.setItem(`internal-doc-${rawId}`, JSON.stringify(item));
          } catch {}
        } else {
          // Check if it matches our mock items
          const matchedMock = STITCH_MOCK_INTERNAL_DOCS_5.find(
            (m) => m.id === rawId || m.title?.toLowerCase().includes(rawId.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              content: matchedMock.keterangan,
            };
            setDocumentItem(fullItem);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching internal document:', err);
        const matchedMock = STITCH_MOCK_INTERNAL_DOCS_5.find((m) => m.id === rawId);
        if (matchedMock) {
          setDocumentItem(matchedMock);
        }
      })
      .finally(() => {
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

  const rawDocNumber =
    documentItem?.documentNumber ||
    documentItem?.source ||
    (documentItem?.body?.startsWith('[') && documentItem?.body?.includes(']')
      ? documentItem.body.slice(1, documentItem.body.indexOf(']'))
      : '') ||
    '';

  const rawKeterangan =
    documentItem?.keterangan ||
    documentItem?.body ||
    documentItem?.excerpt ||
    '';

  const displayKeterangan = rawKeterangan.replace(/^\[[^\]]+\]\s*/, '') || rawKeterangan;

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
        <div className="bg-white rounded-lg p-6 sm:p-10 border border-[#c5c6d2] shadow-sm max-w-4xl mx-auto relative min-h-[460px]">
          {/* Red Close Button [X] at top-right matching Stitch */}
          <Link
            href="/kabar-kedinasan/dokumen-intern"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {isLoading && !documentItem ? (
            <div className="animate-pulse space-y-6 pr-10 py-2">
              {/* Title Skeleton */}
              <div className="space-y-2 mb-8">
                <div className="h-8 bg-slate-200 rounded w-4/5" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
              </div>

              {/* Metadata Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="h-3 bg-slate-200 rounded w-16 mb-2" />
                  <div className="h-5 bg-slate-200 rounded w-32" />
                </div>
                <div>
                  <div className="h-3 bg-slate-200 rounded w-28 mb-2" />
                  <div className="h-5 bg-slate-200 rounded w-36" />
                </div>
              </div>

              {/* Jenis Dokumen Skeleton */}
              <div className="mb-8">
                <div className="h-3 bg-slate-200 rounded w-24 mb-2" />
                <div className="h-5 bg-slate-200 rounded w-40" />
              </div>

              {/* Keterangan Skeleton */}
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-36 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-11/12" />
                <div className="h-4 bg-slate-200 rounded w-4/5" />
              </div>

              {/* Footer Skeleton */}
              <div className="border-t border-[#e2e3ea] pt-6 mt-8 flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-4 bg-slate-200 rounded w-32" />
                  <div className="h-3 bg-slate-200 rounded w-24" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-20 bg-slate-200 rounded" />
                  <div className="h-9 w-20 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Document Main Title */}
              <div className="pr-10 mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-[#00113a] leading-tight tracking-tight">
                  {documentItem?.title || 'Dokumen Internal'}
                </h1>
              </div>

              {/* Metadata: Nomor & Tanggal Dokumen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold text-[#757682] mb-1">Nomor</p>
                  <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
                    {rawDocNumber || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#757682] mb-1">Tanggal Dokumen</p>
                  <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
                    {documentItem?.publishedAt
                      ? formatDate(documentItem.publishedAt)
                      : formatDate(new Date())}
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

                {displayKeterangan.includes('<') && displayKeterangan.includes('>') ? (
                  <div
                    className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed space-y-3 prose max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: displayKeterangan }}
                  />
                ) : (
                  <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
                    {displayKeterangan || '-'}
                  </div>
                )}
              </div>

          {/* Section: LAMPIRAN (Only shown if document actually has attachments) */}
          {hasAttachments && (
            <>
              <div className="border-t border-[#c5c6d2] my-8" />
              <div>
                <h3 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-4">
                  LAMPIRAN
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {attachmentsList.map((att, idx) => {
                    const isDocx = att.name.toLowerCase().endsWith('.docx') || att.name.toLowerCase().endsWith('.doc');
                    const isPdf = att.name.toLowerCase().endsWith('.pdf');
                    const fileUrl = att.url || `/uploads/${att.name}`;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (att.isImage) {
                            setPreviewImage(fileUrl);
                          } else if (fileUrl) {
                            const link = document.createElement('a');
                            link.href = fileUrl;
                            link.download = att.name;
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } else {
                            alert(`Mengunduh berkas ${att.name}...`);
                          }
                        }}
                        className={`aspect-square border border-[#c5c6d2] rounded-md flex flex-col items-center justify-center font-medium transition-all group shadow-2xs cursor-pointer overflow-hidden relative ${
                          att.isImage
                            ? 'p-0 bg-transparent'
                            : 'p-2.5 bg-[#e9e7ee] hover:bg-[#d8d9e2] text-xs text-[#757682] hover:text-[#00113a]'
                        }`}
                        title={att.isImage ? 'Klik untuk memperbesar' : `Klik untuk unduh: ${att.name}`}
                      >
                        {att.isImage ? (
                          <>
                            <img
                              src={fileUrl}
                              alt={att.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                              <span className="text-xs text-center px-2">Klik untuk memperbesar</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col items-center justify-center w-full h-full">
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 group-hover:scale-105 transition-transform ${
                                  isDocx
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                <FileText className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-semibold text-[#1a1b20] group-hover:text-[#00113a] transition-colors line-clamp-2 break-all text-center px-1">
                                {att.name}
                              </span>
                              <span
                                className={`mt-1 px-1.5 py-0.2 rounded text-[8px] font-bold border ${
                                  isDocx
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                              >
                                {isPdf ? 'PDF' : isDocx ? 'DOCX' : 'BERKAS'}
                              </span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                              <span className="text-xs text-center px-2 leading-tight">Klik untuk unduh</span>
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Stitch */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            {/* Left: Dibuat oleh & copyright */}
            
            <div className="flex flex-row gap-6">
              <div className="text-xs text-[#757682] space-y-0.5 w-[220px]"><p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                {documentItem?.author?.name || documentItem?.authorName || 'Administrator Perpusnas'}
              </p>
              <p className="font-medium text-[#757682]">
                {documentItem?.publishedAt
                  ? formatDate(documentItem.publishedAt)
                  : formatDate(new Date())}
              </p>
              <p className="font-medium text-[#757682]">
                Status: {documentItem?.status === 'MENUNGGU' || documentItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
              </p>
            </div>
              {/* Diperbarui Oleh */}
              {Boolean(documentItem?.editor?.name || (documentItem as any)?.editorName) && (
                <>
                  <div className="border-l border-[#c5c6d2]" />
                  <div className="text-xs text-[#757682] space-y-0.5 w-[220px]">
                    <p className="font-semibold text-[#757682]">Diperbarui oleh</p>
                    <p className="font-semibold text-[#1a1b20]">
                      {documentItem?.editor?.name || (documentItem as any)?.editorName}
                    </p>
                    <p className="font-medium text-[#757682]">
                      {documentItem?.updatedAt ? formatDate(documentItem.updatedAt) : ''}
                    </p>
                    <p className="font-medium text-[#757682]">
                      Status: {documentItem?.status === 'MENUNGGU' || documentItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right: Edit & Hapus Buttons matching Stitch */}
            {canManageContent(currentUser, documentItem) && (
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href={`/kabar-kedinasan/dokumen-intern/${rawId}/edit`}
                  className="px-7 py-1.5 bg-white border border-[#757682] hover:bg-[#efedf3] text-[#1a1b20] font-bold text-xs sm:text-sm rounded transition-colors shadow-2xs cursor-pointer inline-block text-center"
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
            </>
          )}
        </div>
      </div>

      {/* Lightbox Preview Modal (Foto saja dengan tombol X) */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn p-4 sm:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImage(null);
            }}
            title="Tutup Pratinjau"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <img
            src={previewImage}
            alt="Pratinjau Foto Lampiran"
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
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

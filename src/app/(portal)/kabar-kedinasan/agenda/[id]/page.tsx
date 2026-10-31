'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  ImageIcon,
  FileText,
} from 'lucide-react';
import { formatDate, canManageContent } from '@/lib/utils';
import { STITCH_MOCK_AGENDAS_6, MOCK_AGENDA_ATTACHMENTS_5, AgendaItem } from '@/lib/mock-agendas';

const formatAgendaHtml = (content: string | undefined | null): string => {
  if (!content) return '-';

  // Remove data-* attributes like data-path-to-node, data-index-in-node injected by editors/extensions
  let clean = content
    .replace(/\s+data-[a-z0-9\-]+="[^"]*"/gi, '')
    .replace(/\s+data-[a-z0-9\-]+='[^']*'/gi, '');

  // Normalize empty break divs from browser contentEditable
  clean = clean.replace(/<div>\s*<br\s*\/?>\s*<\/div>/gi, '<br />');

  // If already contains HTML tags, return clean HTML
  if (/<[a-z][\s\S]*>/i.test(clean)) {
    return clean.trim();
  }

  // If plain text: wrap in clean paragraphs
  return clean
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
};

export default function DetailAgendaKegiatanPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const [agendaItem, setAgendaItem] = useState<any>(null);
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
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!rawId) return;

    setIsLoading(true);
    fetch(`/api/agendas/${rawId}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setAgendaItem(item);
        } else {
          setAgendaItem(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setAgendaItem(null);
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

  const displayTitle = agendaItem?.title || 'Agenda Kegiatan';

  const displayDate = (agendaItem?.publishedAt || agendaItem?.createdAt) ? formatDate(agendaItem.publishedAt || agendaItem.createdAt) : formatDate(new Date());

  const displayContent = agendaItem?.body || agendaItem?.content || '-';

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00113a] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#444650] font-medium">Memuat data agenda...</p>
      </div>
    );
  }

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
          </div>

          {agendaItem?.coverImage && (
            <div
              className="mb-6 w-full rounded-lg overflow-hidden border border-[#c5c6d2] cursor-pointer"
              onClick={() => setPreviewImage(agendaItem.coverImage)}
              title="Klik untuk melihat ukuran asli"
            >
              <img
                src={agendaItem.coverImage}
                alt={displayTitle}
                className="w-full h-auto block object-cover"
              />
            </div>
          )}

          {/* Section: Uraian Agenda Kegiatan */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Agenda Kegiatan
            </h2>

            <div
              className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed space-y-4 agenda-body [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-blue-600 [&>a]:underline"
              dangerouslySetInnerHTML={{
                __html: formatAgendaHtml(displayContent),
              }}
            />
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: LAMPIRAN */}
          {(agendaItem?.attachmentUrl || agendaItem?.attachmentName) && (
          <div>
            <h3 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-4">
              LAMPIRAN
            </h3>
            {/* 5 Attachment Thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {(() => {
                let realAttachments: { src: string, label: string }[] = [];
                if (agendaItem?.attachmentUrl) {
                  try {
                    const urls = JSON.parse(agendaItem.attachmentUrl);
                    const names = agendaItem.attachmentName ? agendaItem.attachmentName.split('|||') : [];
                    realAttachments = urls.map((u: string, i: number) => ({
                      src: u,
                      label: names[i] || `Lampiran ${i + 1}`
                    }));
                  } catch {
                    if (agendaItem.attachmentUrl.startsWith('data:') || agendaItem.attachmentUrl.startsWith('blob:') || agendaItem.attachmentUrl.startsWith('/') || agendaItem.attachmentUrl.startsWith('http')) {
                      realAttachments = [{ src: agendaItem.attachmentUrl, label: agendaItem.attachmentName || 'Lampiran 1' }];
                    }
                  }
                } else if (agendaItem?.id?.startsWith('stitch-')) {
                   realAttachments = MOCK_AGENDA_ATTACHMENTS_5;
                }
                
                return realAttachments.map((att, idx) => {
                  const isImg = att.src && (att.src.startsWith('data:image') || (!att.src.includes('pdf') && !att.src.includes('doc') && !att.label.includes('pdf') && !att.label.includes('doc') && !att.src.startsWith('data:application')));
                  const isPdf = att.label.toLowerCase().endsWith('.pdf') || att.src.includes('pdf') || att.src.startsWith('data:application/pdf');
                  const isDocx = att.label.toLowerCase().endsWith('.docx') || att.label.toLowerCase().endsWith('.doc') || att.src.includes('word') || att.src.includes('document');

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!att.src) return;
                        if (isImg) {
                          setPreviewImage(att.src);
                        } else {
                          const link = document.createElement('a');
                          link.href = att.src;
                          link.download = att.label || 'lampiran';
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                      className={`aspect-square border border-[#c5c6d2] rounded-md flex flex-col items-center justify-center font-medium transition-all group shadow-2xs cursor-pointer overflow-hidden relative ${
                        isImg
                          ? 'p-0 bg-transparent'
                          : 'p-2.5 bg-[#e9e7ee] hover:bg-[#d8d9e2] text-xs text-[#757682] hover:text-[#00113a]'
                      }`}
                      title={isImg ? 'Klik untuk memperbesar' : `Klik untuk unduh: ${att.label}`}
                    >
                      {isImg ? (
                        <>
                          <img src={att.src} alt={att.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                            <span className="text-xs text-center px-2">Klik untuk memperbesar</span>
                          </div>
                        </>
                      ) : (
                        <>
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
                            {att.label}
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
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                            <span className="text-xs text-center px-2 leading-tight">Klik untuk unduh</span>
                          </div>
                        </>
                      )}
                    </button>
                  );
                });
              })()}

            </div>
          </div>
          )}

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Coretan Opini Detail */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            {/* Left: Dibuat oleh & copyright */}
            
            <div className="flex flex-row gap-6">
              <div className="text-xs text-[#757682] space-y-0.5 w-[220px]"><p className="font-semibold text-[#757682]">Dibuat oleh</p>
              <p className="font-semibold text-[#1a1b20]">
                {agendaItem?.author?.name || agendaItem?.authorName || 'Administrator Perpustakaan Nasional'}
              </p>
              <p className="font-medium text-[#757682]">
                {displayDate}
              </p>
              <p className="font-medium text-[#757682]">
                Status: {(agendaItem?.status === 'MENUNGGU' || agendaItem?.status === 'Menunggu' || agendaItem?.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
              </p>
            </div>
              {/* Diperbarui Oleh */}
              {Boolean(agendaItem?.editor?.name || (agendaItem as any)?.editorName) && (
                <>
                  <div className="border-l border-[#c5c6d2]" />
                  <div className="text-xs text-[#757682] space-y-0.5 w-[220px]">
                    <p className="font-semibold text-[#757682]">Diperbarui oleh</p>
                    <p className="font-semibold text-[#1a1b20]">
                      {agendaItem?.editor?.name || (agendaItem as any)?.editorName}
                    </p>
                    <p className="font-medium text-[#757682]">
                      {agendaItem?.updatedAt ? formatDate(agendaItem.updatedAt) : ''}
                    </p>
                    <p className="font-medium text-[#757682]">
                      Status: {agendaItem?.status === 'MENUNGGU' || agendaItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right: Edit & Hapus Buttons matching Coretan Opini Detail */}
            {canManageContent(currentUser, agendaItem) && (
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
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Lampiran Agenda"
              className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl cursor-default"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:-right-10 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
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

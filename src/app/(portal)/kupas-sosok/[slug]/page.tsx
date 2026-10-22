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
import { STITCH_MOCK_FIGURES_6, FigureItem } from '@/lib/mock-kupas-sosok';

export default function DetailKupasSosokPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || '';

  const matchedInitial = STITCH_MOCK_FIGURES_6.find(
    (m) => m.slug === rawSlug || m.id === rawSlug || m.name.toLowerCase().includes(rawSlug.toLowerCase())
  );

  const [figureItem, setFigureItem] = useState<any>(
    matchedInitial ? { ...matchedInitial, body: matchedInitial.fullStory } : null
  );
  const [isLoading, setIsLoading] = useState(!matchedInitial);

  // Lightbox preview for attachments
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (!rawSlug) return;

    if (!matchedInitial) {
      setIsLoading(true);
    }

    fetch(`/api/figure-profiles/${rawSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const item = data.data;
          setFigureItem(item);
        } else {
          // Check mock items
          const matchedMock = STITCH_MOCK_FIGURES_6.find(
            (m) => m.slug === rawSlug || m.id === rawSlug || m.name.toLowerCase().includes(rawSlug.toLowerCase())
          );

          if (matchedMock) {
            const fullItem = {
              ...matchedMock,
              body: matchedMock.fullStory,
            };
            setFigureItem(fullItem);
          } else {
            const fallback = {
              id: rawSlug,
              slug: rawSlug,
              name: 'Ir. Hendro Wicaksono, M.Eng.',
              position: 'Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu',
              publishedAt: '2026-08-19',
              fullStory: `Ir. Hendro Wicaksono, M.Eng. dikenal sebagai pelopor transformasi komputasi dan arsitektur data perpustakaan modern di Indonesia. Berbekal latar belakang rekayasa perangkat lunak dan kecintaan pada literasi, ia merancang fondasi sistem otomasi perpustakaan terbuka yang kini digunakan oleh ribuan lembaga di seluruh Nusantara.

Beliau memimpin proyek integrasi katalog induk nasional dan layanan akses repositori digital terdistribusi, memungkinkan pemustaka di seluruh pelosok mengakses koleksi ilmiah secara instan dan andal.

Prinsip open-source dan kolaborasi antarpengembang menjadi pilar penting yang terus ia tularkan kepada para pranata komputer di lingkungan Perpusnas RI.`,
            };
            setFigureItem(fallback);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_FIGURES_6.find(
          (m) => m.slug === rawSlug || m.id === rawSlug
        );
        if (matchedMock) {
          setFigureItem(matchedMock);
        } else {
          const fallback = {
            id: rawSlug,
            slug: rawSlug,
            name: 'Ir. Hendro Wicaksono, M.Eng.',
            position: 'Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu',
            publishedAt: '2026-08-19',
            fullStory: `Ir. Hendro Wicaksono, M.Eng. dikenal sebagai pelopor transformasi komputasi dan arsitektur data perpustakaan modern di Indonesia. Berbekal latar belakang rekayasa perangkat lunak dan kecintaan pada literasi, ia merancang fondasi sistem otomasi perpustakaan terbuka yang kini digunakan oleh ribuan lembaga di seluruh Nusantara.

Beliau memimpin proyek integrasi katalog induk nasional dan layanan akses repositori digital terdistribusi, memungkinkan pemustaka di seluruh pelosok mengakses koleksi ilmiah secara instan dan andal.`,
          };
          setFigureItem(fallback);
        }
        setIsLoading(false);
      });
  }, [rawSlug]);


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/figure-profiles/${figureItem?.slug || figureItem?.id || rawSlug}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      router.push('/kupas-sosok');
    }
  };

  const displayTitle = figureItem?.name || 'Profil Sosok Inspiratif';
  const displayDate = figureItem?.publishedAt
    ? formatDate(figureItem.publishedAt)
    : figureItem?.createdAt
      ? formatDate(figureItem.createdAt)
      : formatDate(new Date());
  const displayContent = figureItem?.fullStory || figureItem?.body || figureItem?.quote || '';

  // Attachments
  const hasRealPhoto = Boolean(figureItem?.photoUrl && !figureItem.photoUrl.includes('unsplash.com'));
  let realAttachments: Array<{ id: number | string; label: string; src: string; isImage?: boolean }> = [];
  if (figureItem?.attachments && Array.isArray(figureItem.attachments)) {
    realAttachments = figureItem.attachments.filter(
      (att: any) => att.label !== 'Foto Profil' && att.src !== figureItem.photoUrl
    );
  } else if (figureItem?.attachmentUrl) {
    try {
      const parsed = JSON.parse(figureItem.attachmentUrl);
      if (Array.isArray(parsed)) {
        realAttachments = parsed
          .filter((item: any) => (typeof item === 'string' ? item !== figureItem.photoUrl : item.url !== figureItem.photoUrl))
          .map((item: any, idx: number) => ({
            id: idx + 1,
            label: item.name || `Lampiran ${idx + 1}`,
            src: item.url || item.preview || item,
            isImage: typeof item === 'string' ? item.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)/i.test(item) : Boolean(item.preview || item.type?.startsWith('image/')),
          }));
      }
    } catch {
      if (
        figureItem.attachmentUrl !== figureItem.photoUrl &&
        (figureItem.attachmentUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)/i.test(figureItem.attachmentUrl))
      ) {
        realAttachments = [{
          id: 1,
          label: figureItem.attachmentName || 'Lampiran Berkas',
          src: figureItem.attachmentUrl,
          isImage: true,
        }];
      }
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00113a] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 mt-4">Memuat detail sosok...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumb matching Stitch & Coretan Opini */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kupas-sosok" className="hover:text-[#00113a] transition-colors">
            Kupas Sosok
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
            href="/kupas-sosok"
            aria-label="Tutup Halaman Detail"
            className="absolute top-6 right-6 w-6 h-6 bg-[#dc2626] hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </Link>

          {/* Profile Header Section: Foto Profil Tokoh & Metadata */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mb-6 pr-8">
            {/* Foto Profil Sosok (Jika diunggah) */}
            {hasRealPhoto && (
              <div className="shrink-0 w-36 sm:w-44 md:w-48 aspect-[3/4] rounded-lg border border-[#c5c6d2] overflow-hidden bg-[#f4f5f8] shadow-xs relative group flex items-center justify-center">
                <img
                  src={figureItem.photoUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none"
                />
                <img
                  src={figureItem.photoUrl}
                  alt={displayTitle}
                  className="relative z-10 max-w-full max-h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(figureItem.photoUrl)}
                  className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Klik untuk memperbesar foto profil"
                >
                  <span className="bg-white/95 text-[#00113a] text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                    Lihat Foto
                  </span>
                </button>
              </div>
            )}

            {/* Kolom Informasi: Nama Sosok, Jabatan/Unit Kerja, Tanggal */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-[#00113a] leading-tight tracking-tight">
                {displayTitle}
              </h1>
              {(figureItem?.position || figureItem?.unitKerja) && (
                <p className="text-sm font-medium text-slate-500 mt-1.5">
                  {[figureItem?.position, figureItem?.unitKerja].filter(Boolean).join(' • ')}
                </p>
              )}

              {/* Metadata: TANGGAL */}
              <div className="mt-5">
                <p className="text-xs font-bold text-[#757682] uppercase tracking-wider mb-1">
                  TANGGAL
                </p>
                <p className="text-sm sm:text-base font-semibold text-[#1a1b20]">
                  {displayDate}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Uraian Kupas Sosok */}
          <div>
            <h2 className="text-xs font-bold text-[#757682] mb-2">
              Uraian Kupas Sosok
            </h2>

            {displayContent.includes('<') && displayContent.includes('>') ? (
              <div
                className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed space-y-3 font-normal"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            ) : (
              <div className="text-xs sm:text-sm text-[#1a1b20] leading-relaxed whitespace-pre-line space-y-4">
                {displayContent}
              </div>
            )}
          </div>

          {/* Section: LAMPIRAN (Hanya muncul jika ada berkas pendukung yang diunggah) */}
          {realAttachments.length > 0 && (
            <>
              {/* Divider Line */}
              <div className="border-t border-[#c5c6d2] my-8" />

              <div>
                <h3 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-4">
                  LAMPIRAN
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {realAttachments.map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => att.src && setPreviewImage(att.src)}
                      className="aspect-square bg-[#e2e3ea] hover:bg-[#d8d9e2] border border-[#c5c6d2] rounded-md overflow-hidden relative flex flex-col items-center justify-center text-xs text-[#757682] hover:text-[#00113a] font-medium transition-all group shadow-2xs cursor-pointer p-2"
                    >
                      {att.isImage && att.src ? (
                        <img
                          src={att.src}
                          alt={att.label}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-2">
                          <FileText className="w-6 h-6 mb-1 text-[#757682]" />
                          <span className="text-[11px] line-clamp-2 font-medium text-[#1a1b20]">
                            {att.label}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Divider Line */}
          <div className="border-t border-[#c5c6d2] my-8" />

          {/* Section: Footer Metadata & Action Buttons matching Stitch */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-row gap-6">
              {/* Left: Dibuat oleh */}
              <div className="text-xs text-[#757682] space-y-0.5 w-[220px]">
                <p className="font-semibold text-[#757682]">Dibuat oleh</p>
                <p className="font-semibold text-[#1a1b20]">
                  {figureItem?.author?.name || figureItem?.authorName || '-'}
                </p>
                <p className="font-medium text-[#757682]">
                  {displayDate}
                </p>
                <p className="font-medium text-[#757682]">
                  Status: {figureItem?.status === 'MENUNGGU' || figureItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
                </p>
              </div>

              {/* Diperbarui Oleh */}
              {Boolean(figureItem?.editor?.name || (figureItem as any)?.editorName) && (
                <>
                  <div className="border-l border-[#c5c6d2]" />
                  <div className="text-xs text-[#757682] space-y-0.5 w-[220px]">
                    <p className="font-semibold text-[#757682]">Diperbarui oleh</p>
                    <p className="font-semibold text-[#1a1b20]">
                      {figureItem?.editor?.name || (figureItem as any)?.editorName}
                    </p>
                    <p className="font-medium text-[#757682]">
                      {figureItem?.updatedAt ? formatDate(figureItem.updatedAt) : displayDate}
                    </p>
                    <p className="font-medium text-[#757682]">
                      Status: {figureItem?.status === 'MENUNGGU' || figureItem?.status === 'Menunggu' ? 'Menunggu' : 'Terbit'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right: Edit & Hapus Buttons matching Stitch */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Link
                href={`/kupas-sosok/${rawSlug}/edit`}
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
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Pratinjau Lampiran"
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg"
            />
            <div className="p-3 flex justify-between items-center bg-slate-50 border-t border-slate-100 mt-2">
              <span className="text-xs font-semibold text-slate-700">{previewImage === figureItem?.photoUrl ? 'Foto Profil Tokoh' : 'Lampiran Berkas'}</span>
              <a
                href={previewImage}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00113a] hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Buka Ukuran Penuh
              </a>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal matching Stitch */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#c5c6d2] shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#1a1b20]">
                Hapus Profil Sosok?
              </h2>
              <p className="text-xs text-slate-600">
                Apakah Anda yakin ingin menghapus "{displayTitle}"? Aksi ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-[#757682] text-[#444650] rounded font-bold text-xs hover:bg-[#f4f3f9] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-6 py-2 bg-[#dc2626] text-white rounded font-bold text-xs hover:bg-red-700 disabled:opacity-50 cursor-pointer shadow-xs"
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

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

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
            figureDate: apiData.publishedAt ? formatDate(apiData.publishedAt) : '1-06-1940',
            publishedAt: apiData.publishedAt ? formatDate(apiData.publishedAt) : '20-08-2026',
            status: apiData.status === 'PUBLISHED' ? 'Terbit' : 'Menunggu',
          };
          setItem(formatted);
        } else {
          const matchedMock = STITCH_MOCK_KALIMAT_BIJAK.find(
            (m) => m.id === rawId || m.title.toLowerCase().includes(rawId.toLowerCase())
          );
          if (matchedMock) {
            setItem(matchedMock);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        const matchedMock = STITCH_MOCK_KALIMAT_BIJAK.find((m) => m.id === rawId);
        if (matchedMock) {
          setItem(matchedMock);
        }
        setIsLoading(false);
      });
  }, [rawId]);

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
              <Link
                href={`/antar-pegawai/kalimat-bijak/${item?.id || rawId}/edit`}
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
          </div>
        </div>
      </div>

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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  Plus,
  FileText,
  CheckCircle,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  ConsultationItem,
  ConsultationReplyItem,
  getStoredConsultations,
  saveStoredConsultations,
} from '@/lib/mock-konsultasi';

export default function DetailKonsultasiPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [item, setItem] = useState<ConsultationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Modals for Consultation
  const [isDeleteConsultationOpen, setIsDeleteConsultationOpen] = useState(false);

  // Modals for Tanggapan (Replies)
  const [isAddReplyOpen, setIsAddReplyOpen] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState('Budi Sujatmiko');
  const [replyText, setReplyText] = useState('');

  const [editingReply, setEditingReply] = useState<ConsultationReplyItem | null>(null);
  const [editReplyText, setEditReplyText] = useState('');

  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);

  // Fetch initial item from local storage or API
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    const allStored = getStoredConsultations();
    const found = allStored.find((c) => c.id === id || String(c.id) === String(id));

    if (found) {
      setItem(found);
      setIsLoading(false);
    }

    // Also attempt fetching from API
    fetch(`/api/consultations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const apiData = data.data;
          const mapped: ConsultationItem = {
            id: apiData.id,
            title: apiData.title,
            category:
              apiData.category === 'KEPEGAWAIAN'
                ? 'Pegawai'
                : apiData.category === 'IT'
                ? 'IT'
                : 'Kesehatan',
            date: new Date(apiData.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            status: apiData.status === 'OPEN' ? 'Menunggu' : 'Terbit',
            description: apiData.question || '',
            attachmentName:
              apiData.category === 'IT'
                ? 'Konsultasi IT.pdf'
                : apiData.category === 'KEPEGAWAIAN'
                ? 'Konsultasi Pegawai.pdf'
                : 'Konsultasi Kesehatan.pdf',
            attachmentUrl: '#',
            authorName: apiData.author?.name || 'Budi Sujatmiko',
            replies: (apiData.replies || []).map((r: any) => ({
              id: r.id,
              authorName: r.author?.name || 'Pegawai',
              date: new Date(r.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              content: r.replyText,
            })),
          };
          setItem(mapped);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local consultation data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  // Sync updates to localStorage helper
  const updateLocalItem = (updated: ConsultationItem) => {
    setItem(updated);
    const allStored = getStoredConsultations();
    const index = allStored.findIndex((c) => c.id === updated.id);
    if (index !== -1) {
      allStored[index] = updated;
      saveStoredConsultations(allStored);
    } else {
      saveStoredConsultations([updated, ...allStored]);
    }
  };

  // 2. Handle Delete Consultation
  const handleDeleteConsultation = async () => {
    if (!item) return;

    const allStored = getStoredConsultations();
    const remaining = allStored.filter((c) => c.id !== item.id);
    saveStoredConsultations(remaining);

    // Call API in background
    try {
      await fetch(`/api/consultations/${item.id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete fallback:', err);
    }

    router.push('/antar-pegawai/konsultasi');
  };

  // 3. Handle Add Tanggapan
  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !replyText.trim()) return;

    const newReply: ConsultationReplyItem = {
      id: `rep-${Date.now()}`,
      authorName: replyAuthor.trim() || 'Budi Sujatmiko',
      date: '20 Agustus 2026',
      content: replyText.trim(),
    };

    const updatedReplies = [...(item.replies || []), newReply];
    const updated: ConsultationItem = {
      ...item,
      replies: updatedReplies,
    };

    updateLocalItem(updated);
    setReplyText('');
    setIsAddReplyOpen(false);
    setFeedbackMsg('Tanggapan berhasil ditambahkan!');
    setTimeout(() => setFeedbackMsg(''), 3500);

    // Call API
    try {
      await fetch(`/api/consultations/${item.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newReply.content,
          authorName: newReply.authorName,
        }),
      });
    } catch (err) {
      console.warn('API reply fallback:', err);
    }
  };

  // 4. Handle Edit Tanggapan
  const handleSaveEditReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !editingReply || !editReplyText.trim()) return;

    const updatedReplies = (item.replies || []).map((r) =>
      r.id === editingReply.id ? { ...r, content: editReplyText.trim() } : r
    );

    const updated: ConsultationItem = {
      ...item,
      replies: updatedReplies,
    };

    updateLocalItem(updated);
    setEditingReply(null);
    setEditReplyText('');
    setFeedbackMsg('Tanggapan berhasil diperbarui!');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  // 5. Handle Delete Tanggapan
  const handleConfirmDeleteReply = () => {
    if (!item || !deletingReplyId) return;

    const updatedReplies = (item.replies || []).filter(
      (r) => r.id !== deletingReplyId
    );

    const updated: ConsultationItem = {
      ...item,
      replies: updatedReplies,
    };

    updateLocalItem(updated);
    setDeletingReplyId(null);
    setFeedbackMsg('Tanggapan berhasil dihapus!');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-[#e9e7ee] rounded w-1/4" />
          <div className="h-8 bg-[#e9e7ee] rounded w-3/4" />
          <div className="h-32 bg-[#e9e7ee] rounded" />
        </div>
      </div>
    );
  }

  const currentItem =
    item || {
      id: '1',
      title: 'Musim Batuk & Flu Massal Tiba: Jaga Diri dan Pertahanan Tubuh Anda',
      category: 'Kesehatan' as const,
      date: '20 Agustus 2026',
      status: 'Terbit' as const,
      description:
        'Musim peralihan cuaca seringkali membawa lonjakan kasus batuk dan flu di lingkungan kerja. Mari tingkatkan daya tahan tubuh dengan menjaga hidrasi, konsumsi vitamin C, istirahat cukup, dan mengenakan masker saat berada di ruang kerja bersama.',
      attachmentName: 'Konsultasi Kesehatan.pdf',
      attachmentUrl: '#',
      authorName: 'Budi Sujatmiko',
      replies: [],
    };

  return (
    <div className="w-full bg-[#faf8ff] min-h-screen text-[#1a1b20]">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-10">
        {/* Breadcrumb matching Stitch */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[#444650] text-sm mb-8 font-normal"
        >
          <Link
            href="/beranda"
            className="hover:text-[#00113a] transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link
            href="/antar-pegawai"
            className="hover:text-[#00113a] transition-colors"
          >
            Antar Pegawai
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link
            href="/antar-pegawai/konsultasi"
            className="hover:text-[#00113a] transition-colors"
          >
            Konsultasi
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Detail</span>
        </nav>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Main Consultation Section matching Wireframe 3 */}
        <div className="mb-12">
          {/* Judul Besar */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00113a] leading-tight mb-8 tracking-tight">
            {currentItem.title}
          </h1>

          {/* Tanggal Konsultasi */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#1a1b20] mb-1">
              Tanggal Konsultasi
            </p>
            <p className="text-sm text-[#444650]">{currentItem.date}</p>
          </div>

          {/* Deskripsi Konsultasi */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#1a1b20] mb-2">
              Deskripsi Konsultasi
            </p>
            <div className="text-sm sm:text-base text-[#444650] leading-relaxed whitespace-pre-line">
              {currentItem.description}
            </div>
          </div>

          {/* Lampiran File (if exists) */}
          {currentItem.attachmentName && (
            <div className="mb-8 p-3.5 bg-white border border-[#c5c6d2] rounded-lg inline-flex items-center gap-3 text-sm text-[#444650]">
              <FileText className="w-4 h-4 text-[#0070f3]" />
              <span>
                Lampiran File :{' '}
                <span className="font-semibold text-[#00113a]">
                  {currentItem.attachmentName}
                </span>
              </span>
            </div>
          )}

          {/* Author Block & Edit / Hapus Action Buttons matching Wireframe 3 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-6 border-t border-[#c5c6d2]">
            <div>
              <p className="text-xs text-[#757682] mb-1">Dibuat oleh</p>
              <p className="text-sm sm:text-base font-bold text-[#1a1b20]">
                {currentItem.authorName}
              </p>
              <p className="text-xs sm:text-sm text-[#757682]">
                {currentItem.date}
              </p>
            </div>

            {/* Action Buttons: Edit & Hapus */}
            <div className="flex items-center gap-3">
              <Link
                href={`/antar-pegawai/konsultasi/${id}/edit`}
                className="border border-[#c5c6d2] hover:border-[#00113a] hover:bg-[#f4f3f9] text-[#1a1b20] text-sm font-semibold px-6 py-1.5 rounded-lg transition-colors cursor-pointer min-w-[90px] inline-block text-center"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteConsultationOpen(true)}
                className="border border-[#c5c6d2] hover:border-[#ba1a1a] hover:bg-red-50 text-[#1a1b20] hover:text-[#ba1a1a] text-sm font-semibold px-6 py-1.5 rounded-lg transition-colors cursor-pointer min-w-[90px]"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Section Tanggapan matching Wireframe 3 */}
        <div className="mt-12 pt-8 border-t border-[#c5c6d2]">
          {/* Header Tanggapan with + Tambah Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#00113a]">
              Tanggapan
            </h2>

            <button
              type="button"
              onClick={() => setIsAddReplyOpen(true)}
              className="bg-[#002366] hover:bg-[#00113a] text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah</span>
            </button>
          </div>

          {/* List of Tanggapan Cards matching Wireframe 3 */}
          <div className="space-y-4">
            {(!currentItem.replies || currentItem.replies.length === 0) ? (
              <div className="text-center py-10 bg-white border border-dashed border-[#c5c6d2] rounded-xl">
                <p className="text-sm font-medium text-[#444650] mb-2">
                  Belum ada tanggapan untuk konsultasi ini.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddReplyOpen(true)}
                  className="text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer"
                >
                  + Berikan Tanggapan Pertama
                </button>
              </div>
            ) : (
              currentItem.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white border border-[#c5c6d2] rounded-xl p-5 sm:p-6 shadow-2xs space-y-3"
                >
                  {/* Top Row: Author & Date */}
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm sm:text-base text-[#1a1b20]">
                      {reply.authorName}
                    </p>
                    <p className="text-xs text-[#757682]">{reply.date}</p>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-[#444650] leading-relaxed whitespace-pre-line">
                    {reply.content}
                  </p>

                  {/* Bottom Right Actions: Edit & Hapus matching wireframe */}
                  <div className="flex justify-end items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReply(reply);
                        setEditReplyText(reply.content);
                      }}
                      className="border border-[#c5c6d2] hover:border-[#00113a] hover:bg-[#f4f3f9] text-[#1a1b20] text-xs font-medium px-4 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingReplyId(reply.id)}
                      className="border border-[#c5c6d2] hover:border-[#ba1a1a] hover:bg-red-50 text-[#1a1b20] hover:text-[#ba1a1a] text-xs font-medium px-4 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal: Tambah Tanggapan */}
        {isAddReplyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#c5c6d2] rounded-xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#00113a]">
                  Tambah Tanggapan
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddReplyOpen(false)}
                  className="p-1 rounded text-[#757682] hover:text-[#00113a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b20] mb-1">
                    Nama Penanggap
                  </label>
                  <input
                    type="text"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    required
                    placeholder="Nama pengirim tanggapan"
                    className="w-full border border-[#c5c6d2] rounded-lg p-2.5 text-sm text-[#1a1b20] outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1a1b20] mb-1">
                    Isi Tanggapan
                  </label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    placeholder="Tulis tanggapan atau saran Anda di sini..."
                    className="w-full border border-[#c5c6d2] rounded-lg p-2.5 text-sm text-[#1a1b20] outline-none focus:border-[#00113a]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddReplyOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-[#444650] hover:bg-[#f4f3f9] rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0070f3] hover:bg-[#005bb5] text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Kirim Tanggapan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Tanggapan */}
        {editingReply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#c5c6d2] rounded-xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#00113a]">
                  Edit Tanggapan
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingReply(null)}
                  className="p-1 rounded text-[#757682] hover:text-[#00113a] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditReply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b20] mb-1">
                    Isi Tanggapan
                  </label>
                  <textarea
                    rows={4}
                    value={editReplyText}
                    onChange={(e) => setEditReplyText(e.target.value)}
                    required
                    className="w-full border border-[#c5c6d2] rounded-lg p-2.5 text-sm text-[#1a1b20] outline-none focus:border-[#00113a]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingReply(null)}
                    className="px-4 py-2 text-sm font-medium text-[#444650] hover:bg-[#f4f3f9] rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00113a] hover:bg-[#002366] text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Konfirmasi Hapus Tanggapan */}
        {deletingReplyId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#c5c6d2] rounded-xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
              <div className="w-12 h-12 bg-red-100 text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#00113a] mb-2">
                Hapus Tanggapan?
              </h3>
              <p className="text-sm text-[#444650] mb-6">
                Apakah Anda yakin ingin menghapus tanggapan ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingReplyId(null)}
                  className="px-5 py-2 text-sm font-medium text-[#444650] hover:bg-[#f4f3f9] rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteReply}
                  className="bg-[#ba1a1a] hover:bg-red-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Konfirmasi Hapus Konsultasi */}
        {isDeleteConsultationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white border border-[#c5c6d2] rounded-xl shadow-xl w-full max-w-md p-6 text-center animate-fadeIn">
              <div className="w-12 h-12 bg-red-100 text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#00113a] mb-2">
                Hapus Konsultasi?
              </h3>
              <p className="text-sm text-[#444650] mb-6">
                Apakah Anda yakin ingin menghapus topik konsultasi ini beserta
                seluruh tanggapannya?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteConsultationOpen(false)}
                  className="px-5 py-2 text-sm font-medium text-[#444650] hover:bg-[#f4f3f9] rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConsultation}
                  className="bg-[#ba1a1a] hover:bg-red-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

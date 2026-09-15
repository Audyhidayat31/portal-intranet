'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Download,
  CheckCircle,
  Megaphone,
  ImageIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Mock 5 Attachments for the Detail Modal
const MOCK_ATTACHMENT_IMAGES = [
  { id: 1, label: 'Gambar', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCahcTZj5QXSmo3tJ8Zb2Xo1X9pKfvdvRYMZA94cK-i5_dLKEHbFSmblR-2uoRzcmMXVd8Pr0Gb30rpuD95uzQCqAdS2MwCjDq2jhqoR7HDhRt9ko2-g6u0vKDepAglqA-jLL14MSv0qL9KeKZUs2or1uCde_WHnFDwhqCQgCxz0VDCutPC0W9sEljXtLYwUpDTogD_ffc4JmQ759jerILSC0Cj_f0e46NooKBIPHoIXmT2BtEmOOzI' },
  { id: 2, label: 'Gambar', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEHOB7QqUcScYgUvXChP9nVr-q786x2lx8BOuh71cyFmfAyQkh2I40zYne-i-muHCks4BFJXQicurqCY-ejOWaJtwmAKyhXqVhFLj1iiAEKtAjTnBXS-OH9nSV2Ow-xBU71sx6vyUz6Zd3QI86bMBNd88JZgcnjYUgjCyn7AUY3-cD-5BHpldUaYeEgDF3H_p4drpjrzX0hwVoYEgLJgWH_gjCteVr2n3GuwShw2bRGprmWd9kp71E' },
  { id: 3, label: 'Gambar', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVs8mmrPa3sdVqly6ut4qCv12iH9c_Vimok_K0v7C2uj3RMTC7sO_TvMqgHUldInW3xOGk_xu97YpdeQ4Ob3F81iN-mPJOb6JzY0tVieOHWOgvC-IOa8oRjF3SIv6GRiZeemSnRd8XgAeAdRcdfpaF04XF_I3kRRiAdo1EdTQLfsKJ1_R338NDEOCE5AdLyLmlBmM0zN4PLKfzcIKyRaHFlogpc5l9J8MvIM_fLuebs8P8tEtu6mqy' },
  { id: 4, label: 'Gambar', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkcdKoK5-REl9MBRrQbPYW0kksQiURmgFsjfTaeLUi_22R_MorHPvnMqTtejb4QVSXHM3k4-97p8hPyPjOTXwIrISNNnRkXMTPEaEkqLwuTlPndmih-rPWxvArIAGMz5Clty1H129PBoYcjNONKfKbbo2ZsxtlVwL_g7hlGFQcAfD-OqatB4RmWtP1o_1_ZEIalHfp5TcYvZThq76yXdL2ITlS5YVVy5yHBEJG7Q6T-V5yvTALGwTP' },
  { id: 5, label: 'Gambar', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAMzsEB9xDYlgOqRSHrkTLOUa9bZaTWA5LlNN5fXZVz7JVboMF1wjffNW4GV6RbfPN7zLuIVYF-JrBsaN7CBfBpOxMkNQIvYMLBTPh5AvFiMKZxzilZVpvWHQXKpwQ8oqYP7ryftiBHDWN1HKbC-yhW6Ux27FSQ_9PprOJRlEDYwdeics1PHFfKZNJBHWiJdH92gLs8Wjs4a1RKSH7g5GNB-agxtikww_ojgBT_cabf_qAUNFgshDQ' },
];

// 5 Mock Announcements matching Stitch
const STITCH_MOCK_ANNOUNCEMENTS_5 = [
  {
    id: 'stitch-pengumuman-1',
    title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
    excerpt: 'Pengumuman publikasi Penerbitan Buku Karya Sastra Profesor ...',
    content: 'Sehubungan dengan program penerbitan karya sastra dan pengayaan khazanah literasi nasional, Perpustakaan Nasional Republik Indonesia mengumumkan pelaksanaan kurasi naskah dan penerbitan buku karya sastra terpilih.\n\nSeluruh pegawai dan civitas akademika di lingkungan Perpustakaan Nasional RI diundang untuk menghadiri acara bedah buku dan peluncuran resmi yang diselenggarakan di Ruang Serbaguna Lantai 4 Gedung Fasilitas Layanan Perpustakaan Nasional, Jl. Medan Merdeka Selatan No. 11, Jakarta Pusat.',
    publishedAt: '2026-08-20',
    attachmentName: 'Surat_Edaran_Penerbitan_Karya_Sastra_2026.pdf',
    author: { name: 'Budi Sujatmiko' },
  },
  {
    id: 'stitch-pengumuman-2',
    title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
    excerpt: 'Pengumuman publikasi Penerbitan Buku Karya Sastra Profesor ...',
    content: 'Pemberitahuan kepada seluruh unit kerja terkait pedoman pengajuan nomor registrasi ISBN dan standardisasi katalogisasi dalam terbitan (KDT) untuk naskah karya ilmiah dan sastra terbitan tahun anggaran 2026.\n\nBatas akhir penyerahan naskah digital lengkap beserta ringkasan eksekutif dapat dikirimkan melalui surel persuratan resmi atau portal intranet internal sebelum akhir bulan berjalan.',
    publishedAt: '2026-08-20',
    attachmentName: 'Pedoman_Standardisasi_KDT_2026.pdf',
    author: { name: 'Budi Sujatmiko' },
  },
  {
    id: 'stitch-pengumuman-3',
    title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
    excerpt: 'Pengumuman publikasi Penerbitan Buku Karya Sastra Profesor ...',
    content: 'Informasi jadwal pelaksanaan lokakarya penulisan kreatif dan penyusunan antologi sastra daerah bagi para pegawai di lingkungan Perpustakaan Nasional RI.\n\nKegiatan ini dirancang untuk memfasilitasi peningkatan kompetensi literasi menulis serta pelestarian budaya daerah melalui karya literatur terstruktur.',
    publishedAt: '2026-08-20',
    attachmentName: 'Jadwal_Lokakarya_Penulisan_Sastra.pdf',
    author: { name: 'Budi Sujatmiko' },
  },
  {
    id: 'stitch-pengumuman-4',
    title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
    excerpt: 'Pengumuman publikasi Penerbitan Buku Karya Sastra Profesor ...',
    content: 'Diumumkan kepada seluruh jajaran bahwa Perpustakaan Nasional membuka kesempatan publikasi artikel ilmiah dan tinjauan literatur sastra nusantara pada jurnal terindeks edisi volume ke-14.\n\nNaskah yang lolos seleksi awal dari Dewan Redaksi akan mendapatkan bantuan pendampingan penulisan hingga tahap penerbitan akhir.',
    publishedAt: '2026-08-20',
    attachmentName: 'Call_For_Papers_Jurnal_Sastra_Vol14.pdf',
    author: { name: 'Budi Sujatmiko' },
  },
  {
    id: 'stitch-pengumuman-5',
    title: 'Penerbitan Buku Karya Sastra Prof. .... Berlangsung di Perpustakaan Nasional Republik Indonesia',
    excerpt: 'Pengumuman publikasi Penerbitan Buku Karya Sastra Profesor ...',
    content: 'Ketentuan teknis mengenai serah simpan karya cetak dan karya rekam (SSKCKR) atas karya-karya sastra dan hasil penelitian mutakhir yang dihasilkan oleh pustakawan madya dan utama.\n\nDokumen fisik dan salinan digital wajib diserahkan kepada Bagian Akuisisi dan Pengolahan untuk diarsipkan ke dalam basis data repositori nasional.',
    publishedAt: '2026-08-20',
    attachmentName: 'Surat_Pemberitahuan_SSKCKR_2026.pdf',
    author: { name: 'Budi Sujatmiko' },
  },
];

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<any[]>(STITCH_MOCK_ANNOUNCEMENTS_5);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(null);

  // Add Announcement State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Edit Announcement State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAttachmentName, setEditAttachmentName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Announcement State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnnouncements = (q: string = '') => {
    setIsLoading(true);
    fetch(`/api/announcements?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        if (q.trim()) {
          const allPool = [...apiItems, ...STITCH_MOCK_ANNOUNCEMENTS_5];
          const filtered = allPool.filter(
            (item) =>
              item.title?.toLowerCase().includes(q.toLowerCase()) ||
              item.excerpt?.toLowerCase().includes(q.toLowerCase()) ||
              item.body?.toLowerCase().includes(q.toLowerCase()) ||
              item.content?.toLowerCase().includes(q.toLowerCase())
          );
          setAnnouncements(filtered);
        } else {
          // Combine API items with mock items ensuring 5 items for the design
          const combined = [...apiItems];
          for (const item of STITCH_MOCK_ANNOUNCEMENTS_5) {
            if (combined.length >= 5) break;
            if (!combined.some((c) => c.title === item.title && c.id === item.id)) {
              combined.push(item);
            }
          }
          let idx = 1;
          while (combined.length < 5) {
            const base = STITCH_MOCK_ANNOUNCEMENTS_5[(combined.length) % STITCH_MOCK_ANNOUNCEMENTS_5.length];
            combined.push({ ...base, id: `fill-pengumuman-${idx++}` });
          }
          setAnnouncements(combined.slice(0, 5));
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setAnnouncements(STITCH_MOCK_ANNOUNCEMENTS_5);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnnouncements(searchQuery);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          excerpt: newExcerpt || newContent.slice(0, 120),
          content: newContent,
          attachmentName: newAttachmentName || undefined,
          publishedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Pengumuman baru berhasil dipublikasikan!');
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewExcerpt('');
        setNewContent('');
        setNewAttachmentName('');
        fetchAnnouncements('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(data.message || 'Gagal menyimpan pengumuman');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan pengumuman');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditTitle(item.title || '');
    setEditContent(item.content || item.body || item.excerpt || '');
    setEditAttachmentName(item.attachmentName || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement || !editTitle.trim()) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/announcements/${selectedAnnouncement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          attachmentName: editAttachmentName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = {
          ...selectedAnnouncement,
          title: editTitle,
          content: editContent,
          body: editContent,
          attachmentName: editAttachmentName,
        };
        setSelectedAnnouncement(updated);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === selectedAnnouncement.id ? updated : a))
        );
        setIsEditModalOpen(false);
      } else {
        // Fallback for mock items
        const updated = {
          ...selectedAnnouncement,
          title: editTitle,
          content: editContent,
          body: editContent,
          attachmentName: editAttachmentName,
        };
        setSelectedAnnouncement(updated);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === selectedAnnouncement.id ? updated : a))
        );
        setIsEditModalOpen(false);
      }
    } catch {
      const updated = {
        ...selectedAnnouncement,
        title: editTitle,
        content: editContent,
        body: editContent,
        attachmentName: editAttachmentName,
      };
      setSelectedAnnouncement(updated);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === selectedAnnouncement.id ? updated : a))
      );
      setIsEditModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/announcements/${selectedAnnouncement.id}`, {
        method: 'DELETE',
      });
      setAnnouncements((prev) => prev.filter((a) => a.id !== selectedAnnouncement.id));
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    } catch {
      setAnnouncements((prev) => prev.filter((a) => a.id !== selectedAnnouncement.id));
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-8 md:py-12 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div>
        {/* Breadcrumbs matching Stitch */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <Link href="/kabar-kedinasan" className="hover:text-[#00113a] transition-colors">
            Kabar Kedinasan
          </Link>
          <span className="text-[#757682]">&gt;</span>
          <span className="text-[#1a1b20] font-bold">Pengumuman</span>
        </nav>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Header Section matching Stitch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Pengumuman
            </h1>
            <p className="text-sm sm:text-base text-[#444650]">
              Deskripsi Pengumuman
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Tambah Button */}
            <Link
              href="/kabar-kedinasan/pengumuman/tambah"
              className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold text-xs sm:text-sm py-2 px-4 rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </Link>

            {/* Search Input Bar with embedded search icon matching Stitch */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Pengumuman ..."
                className="w-full pl-3 pr-10 py-2 border border-[#c5c6d2] rounded-lg text-sm focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] bg-white text-[#1a1b20] placeholder-[#757682] shadow-xs transition-colors"
              />
              <button
                type="submit"
                aria-label="Cari Pengumuman"
                className="absolute right-3 text-[#757682] hover:text-[#00113a] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Announcement List (5 Cards matching Stitch) */}
        {isLoading ? (
          <div className="flex flex-col gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-xl p-6 bg-slate-50 animate-pulse h-32" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-[#faf8ff] my-8">
            <Megaphone className="w-12 h-12 text-[#757682] mx-auto mb-3 opacity-60" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Pengumuman Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau klik tombol Tambah di atas.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {announcements.map((item) => {
              const displayDate = item.publishedAt
                ? formatDate(item.publishedAt)
                : '20 AGUSTUS 2026';

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#c5c6d2] rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 relative group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                >
                  <div className="flex-grow pr-0 sm:pr-4">
                    <h2
                      onClick={() => setSelectedAnnouncement(item)}
                      className="text-base sm:text-lg font-bold text-[#00113a] mb-2 group-hover:text-[#2a4386] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#444650] mb-3 line-clamp-2 leading-relaxed">
                      {item.excerpt || item.body?.slice(0, 140) || item.content?.slice(0, 140)}
                    </p>
                    <span className="text-xs font-bold text-[#757682]">
                      {displayDate}
                    </span>
                  </div>

                  <div className="shrink-0 mt-2 sm:mt-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedAnnouncement(item)}
                      className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold text-xs py-2 px-4 rounded transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Lihat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 pt-4 pb-8">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#444650] hover:text-[#00113a] transition-colors disabled:opacity-40 cursor-pointer"
        >
          &lt;
        </button>

        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${
              currentPage === page
                ? 'bg-[#00113a] text-white'
                : 'text-[#444650] hover:bg-[#f4f3f9] hover:text-[#00113a]'
            }`}
          >
            {page}
          </button>
        ))}

        <span className="text-[#757682] text-xs font-bold px-1">...</span>

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= 5}
          onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
          className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#444650] hover:text-[#00113a] transition-colors disabled:opacity-40 cursor-pointer"
        >
          &gt;
        </button>
      </div>

      {/* Detail Pengumuman Modal on List View (EXACT Stitch Screen Spec) */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center overflow-y-auto px-4 md:px-16 py-8 animate-fadeIn">
          {/* Document Container */}
          <article className="bg-white border border-[#c5c6d2] rounded shadow-2xl relative pt-12 pb-8 px-6 md:px-12 flex flex-col max-w-4xl w-[95%] my-auto max-h-[90vh] overflow-y-auto">
            {/* Red Close Button matching Stitch */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 bg-[#ba1a1a] hover:bg-[#93000a] text-white w-8 h-8 flex items-center justify-center rounded transition-colors shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Section */}
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1b20] mb-4 leading-snug">
                {selectedAnnouncement.title}
              </h1>
              <div className="text-sm text-[#1a1b20]">
                <p className="font-bold">Tanggal Pengumuman</p>
                <p className="text-[#1a1b20] mt-0.5">
                  {selectedAnnouncement.publishedAt
                    ? formatDate(selectedAnnouncement.publishedAt)
                    : '20 Agustus 2026'}
                </p>
              </div>
            </header>

            {/* Content Body (Uraian Pengumuman) */}
            <div className="prose max-w-none text-sm sm:text-base text-[#1a1b20] mb-8 flex-grow leading-relaxed">
              <p className="font-bold text-[#1a1b20] mb-2">Uraian Pengumuman</p>
              <div className="text-[#1a1b20] space-y-3 whitespace-pre-line leading-relaxed">
                {selectedAnnouncement.content ||
                  selectedAnnouncement.body ||
                  `[Isi pengumuman lengkap akan ditampilkan di sini. Area ini mendukung format teks panjang, list, dan elemen tipografi standar lainnya sesuai dengan desain Corporate Modern.]`}
              </div>
            </div>

            {/* Attachments Section (5 Image Placeholders matching Stitch) */}
            <section className="mb-8">
              <h2 className="text-xs font-bold text-[#1a1b20] mb-3">Lampiran</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {MOCK_ATTACHMENT_IMAGES.map((att) => (
                  <div
                    key={att.id}
                    onClick={() => setPreviewAttachment(att.url)}
                    className="aspect-square bg-[#efedf3] border border-[#c5c6d2] rounded flex flex-col items-center justify-center hover:bg-[#e9e7ee] transition-colors cursor-pointer group p-2 relative overflow-hidden"
                  >
                    <img
                      src={att.url}
                      alt={`Lampiran ${att.id}`}
                      className="w-full h-full object-cover rounded opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all"
                    />
                    <span className="absolute bottom-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {att.label} {att.id}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer / Meta Section matching Stitch */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-[#c5c6d2] pt-6 gap-4">
              <div className="text-sm text-[#1a1b20]">
                <p className="font-bold">Dibuat oleh</p>
                <p className="text-[#1a1b20]">{selectedAnnouncement.author?.name || 'Budi Sujatmiko'}</p>
                <p className="text-[#444650]">
                  {selectedAnnouncement.publishedAt
                    ? formatDate(selectedAnnouncement.publishedAt)
                    : '20 Agustus 2026'}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedAnnouncement)}
                  className="px-6 py-2 border border-[#757682] rounded text-[#1a1b20] hover:bg-[#efedf3] hover:border-[#00113a] transition-colors font-bold text-sm min-w-[90px] text-center"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-6 py-2 border border-[#757682] rounded text-[#1a1b20] hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-colors font-bold text-sm min-w-[90px] text-center"
                >
                  Hapus
                </button>
              </div>
            </footer>
          </article>
        </div>
      )}

      {/* Lightbox Preview for Attachment Image */}
      {previewAttachment && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewAttachment(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={previewAttachment}
              alt="Lampiran Preview"
              className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setPreviewAttachment(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:-right-10 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Pengumuman Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#00113a]">Edit Pengumuman</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Nama Dokumen Lampiran
                </label>
                <input
                  type="text"
                  value={editAttachmentName}
                  onChange={(e) => setEditAttachmentName(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Uraian / Isi Pengumuman
                </label>
                <textarea
                  rows={6}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c5c6d2] animate-fadeIn">
            <h2 className="text-xl font-bold text-[#00113a] mb-2">Hapus Pengumuman?</h2>
            <p className="text-sm text-[#444650] mb-6">
              Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAnnouncement}
                className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Pengumuman Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#00113a]">Tambah Pengumuman Baru</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul pengumuman resmi..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Ringkasan Singkat (Excerpt)
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan 1 kalimat pengumuman..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Nama Dokumen Lampiran (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat_Edaran_Pengumuman_2026.pdf"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Isi Pengumuman Lengkap
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi pengumuman secara lengkap di sini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#444650] hover:bg-[#f4f3f9] rounded-md transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

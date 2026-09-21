'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  X,
  FileText,
  Download,
  CheckCircle,
  Folder,
  Calendar,
  Eye,
  FileCode,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  STITCH_MOCK_INTERNAL_DOCS_5,
  InternalDocument,
} from '@/lib/mock-internal-documents';

export default function DokumenInternPage() {
  const [documents, setDocuments] = useState<InternalDocument[]>(STITCH_MOCK_INTERNAL_DOCS_5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Detail Modal State
  const [selectedDoc, setSelectedDoc] = useState<InternalDocument | null>(null);

  // Add Document Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newCategory, setNewCategory] = useState('Surat Edaran');
  const [newKeterangan, setNewKeterangan] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDocuments = (q: string = '') => {
    if (q.trim()) {
      setIsLoading(true);
    }
    fetch(`/api/internal-documents?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        const apiItems = data.success && Array.isArray(data.data) ? data.data : [];

        // Format API items to match InternalDocument shape if needed
        const formattedApiItems: InternalDocument[] = apiItems.map((item: any) => {
          let docNum = 'SE/01/Perpusnas/2026';
          let ket = item.excerpt || item.body || '';
          if (item.body && item.body.startsWith('[') && item.body.includes(']')) {
            const closingIdx = item.body.indexOf(']');
            docNum = item.body.slice(1, closingIdx);
            ket = item.body.slice(closingIdx + 1).trim();
          }

          return {
            id: item.id,
            title: item.title,
            documentNumber: docNum,
            category: item.category?.name || 'Surat Edaran',
            publishedAt: item.publishedAt,
            keterangan: ket,
            attachmentName: item.attachmentName || 'Dokumen_Internal.pdf',
            fileSize: item.fileSize || '1.5 MB',
          };
        });

        if (q.trim()) {
          const allPool = [...formattedApiItems, ...STITCH_MOCK_INTERNAL_DOCS_5];
          const filtered = allPool.filter(
            (doc) =>
              doc.title.toLowerCase().includes(q.toLowerCase()) ||
              doc.documentNumber.toLowerCase().includes(q.toLowerCase()) ||
              doc.category.toLowerCase().includes(q.toLowerCase()) ||
              doc.keterangan.toLowerCase().includes(q.toLowerCase()) ||
              doc.attachmentName.toLowerCase().includes(q.toLowerCase())
          );
          setDocuments(filtered);
        } else {
          // Keep exactly 5 distinct items by combining DB items + unique mock items
          const combined = [...formattedApiItems];
          for (const mockItem of STITCH_MOCK_INTERNAL_DOCS_5) {
            if (combined.length >= 5) break;
            const alreadyExists = combined.some(
              (c) =>
                c.id === mockItem.id ||
                c.title?.toLowerCase().trim() === mockItem.title?.toLowerCase().trim()
            );
            if (!alreadyExists) {
              combined.push(mockItem);
            }
          }
          setDocuments(combined.slice(0, 5));
        }
      })
      .catch((e) => {
        console.error(e);
        if (!documents || documents.length === 0) {
          setDocuments(STITCH_MOCK_INTERNAL_DOCS_5);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments(searchQuery);
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/internal-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          documentNumber: newDocNumber || 'SE/103/IX/2026',
          categoryName: newCategory,
          keterangan: newKeterangan || 'Keterangan dokumen internal...',
          attachmentName: newAttachmentName || `${newTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
          publishedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Dokumen internal baru berhasil ditambahkan!');
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewDocNumber('');
        setNewCategory('Surat Edaran');
        setNewKeterangan('');
        setNewAttachmentName('');
        fetchDocuments('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(data.message || 'Gagal menyimpan dokumen internal');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan dokumen');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <span className="text-[#1a1b20] font-bold">Dokumen Internal</span>
        </nav>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Page Header & Actions matching Stitch */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] mb-2 tracking-tight">
              Dokumen Internal
            </h1>
            <p className="text-sm sm:text-base text-[#444650]">
              Deskripsi Dokumen Intern
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Tambah Button matching Stitch */}
            <Link
              href="/kabar-kedinasan/dokumen-intern/tambah"
              className="bg-[#00113a] hover:bg-[#2a4386] text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </Link>

            {/* Search Input Bar with embedded search icon matching Stitch */}
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Dokumen ..."
                className="w-full border border-[#757682] rounded-l-md px-3 py-2 text-sm focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] bg-white text-[#1a1b20] placeholder-[#757682] shadow-xs transition-colors"
              />
              <button
                type="submit"
                aria-label="Cari Dokumen"
                className="bg-[#00113a] hover:bg-[#2a4386] text-white px-3.5 py-2.5 rounded-r-md flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Content List (5 Distinct Cards matching Stitch) */}
        {isLoading ? (
          <div className="space-y-4 mb-12">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="border border-[#c5c6d2] rounded-lg p-6 bg-slate-50 animate-pulse h-36" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#c5c6d2] rounded-xl bg-[#faf8ff] my-8">
            <FileText className="w-12 h-12 text-[#757682] mx-auto mb-3 opacity-60" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">Tidak Ada Dokumen Ditemukan</h2>
            <p className="text-sm text-[#444650]">
              Silakan coba kata kunci pencarian lain atau tambahkan dokumen internal baru.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {documents.map((doc) => {
              const displayDate = doc.publishedAt
                ? formatDate(doc.publishedAt)
                : '20 Agustus 2026';

              return (
                <div
                  key={doc.id}
                  className="border border-[#c5c6d2] rounded-lg p-6 bg-white hover:bg-[#fcfbfe] transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  {/* Top Row: Title, Document Number & Category Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1a1b20] leading-snug">
                        {doc.title || 'Judul'}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#757682] font-medium mt-1">
                        Nomor: {doc.documentNumber} <span className="mx-2 text-[#c5c6d2]">|</span> {displayDate}
                      </p>
                    </div>

                    {/* Category Pill Tag matching Stitch */}
                    <div className="shrink-0 self-start">
                      <span className="inline-block px-4 py-1 rounded-full border border-[#757682] text-xs font-semibold text-[#1a1b20] bg-white">
                        {doc.category}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Keterangan */}
                  <div className="text-xs sm:text-sm text-[#444650] leading-relaxed">
                    <span className="font-semibold text-[#1a1b20]">Keterangan :</span>{' '}
                    <span>{doc.keterangan || '.....'}</span>
                  </div>

                  {/* Divider Line */}
                  <div className="w-full h-px bg-[#e2e3ea] my-1" />

                  {/* Bottom Row: Lampiran File & Lihat Button */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="text-xs sm:text-sm text-[#1a1b20] font-medium">
                      <span>Lampiran File : </span>
                      <span className="text-[#002366] font-semibold">{doc.attachmentName}</span>
                    </div>

                    <div className="shrink-0 mt-4 md:mt-0 self-end flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${
                          (doc.status === 'MENUNGGU' || doc.status === 'Menunggu' || doc.status === 'DRAFT')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        Status: {(doc.status === 'MENUNGGU' || doc.status === 'Menunggu' || doc.status === 'DRAFT') ? 'Menunggu' : 'Terbit'}
                      </span>
                      <Link
                        href={`/kabar-kedinasan/dokumen-intern/${doc.id}`}
                        className="bg-[#00113a] text-white hover:bg-[#2a4386] font-semibold text-xs py-1.5 px-4 rounded-full transition-all shadow-sm cursor-pointer inline-flex items-center justify-center"
                      >
                        <span>Lihat</span>
                      </Link>
                    </div>
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

      {/* Modal: Lihat / Detail Dokumen */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-[#e2e3ea] gap-4">
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full border border-[#757682] text-[11px] font-semibold text-[#1a1b20] mb-2 bg-white">
                  {selectedDoc.category}
                </span>
                <h2 className="text-xl font-bold text-[#00113a] leading-snug">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-[#757682] mt-1 font-medium">
                  Nomor: {selectedDoc.documentNumber} • {formatDate(selectedDoc.publishedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-1.5">
                  Keterangan & Deskripsi
                </h4>
                <p className="text-sm text-[#444650] leading-relaxed bg-[#f8fafc] p-4 rounded-lg border border-[#e2e3ea]">
                  {selectedDoc.keterangan || 'Tidak ada keterangan tambahan untuk dokumen ini.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-1.5">
                  Lampiran Dokumen Resmi
                </h4>
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#c5c6d2] rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#00113a]" />
                    <div>
                      <p className="text-sm font-bold text-[#1a1b20]">{selectedDoc.attachmentName}</p>
                      <p className="text-xs text-[#757682]">{selectedDoc.fileSize || 'PDF Dokumen Resmi'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Memulai pengunduhan berkas resmi: ${selectedDoc.attachmentName}`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold rounded transition-colors shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e3ea] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-[#1a1b20] text-sm font-bold rounded transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Dokumen Internal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#c5c6d2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#e2e3ea]">
              <h2 className="text-xl font-bold text-[#00113a]">Tambah Dokumen Internal</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Judul Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Surat Edaran Penyesuaian Jam Kerja Pegawai..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                    Nomor Dokumen
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: SE/103/IX/2026"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                    Kategori / Jenis Dokumen
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] bg-white cursor-pointer"
                  >
                    <option value="Surat Edaran">Surat Edaran</option>
                    <option value="Surat Keputusan">Surat Keputusan</option>
                    <option value="Formulir">Formulir</option>
                    <option value="SOP & Regulasi">SOP & Regulasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan ringkasan atau keterangan isi dokumen..."
                  value={newKeterangan}
                  onChange={(e) => setNewKeterangan(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b20] mb-1.5">
                  Nama Berkas Lampiran
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat_Edaran_Triwulan_III.pdf"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-md p-2.5 text-sm focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#e2e3ea]">
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
                  className="px-6 py-2.5 text-sm font-bold bg-[#00113a] text-white hover:bg-[#2a4386] rounded-md transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


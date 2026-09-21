'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit2, Trash2, Search, Pin, Calendar, FileText, Plane, Megaphone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

export default function AdminKabarKedinasanPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any | null>(null);
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [type, setType] = useState('NEWS');
  const [status, setStatus] = useState('TERBIT');
  const [isPinned, setIsPinned] = useState(false);
  const [eventLocation, setEventLocation] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContents = () => {
    setIsLoading(true);
    fetch(`/api/admin/contents?type=${selectedType}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContents(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchContents();
  }, [selectedType]);

  const handleOpenCreate = () => {
    setEditingContent(null);
    setTitle('');
    setExcerpt('');
    setBody('');
    setCoverImage('');
    setType(selectedType === 'ALL' ? 'NEWS' : selectedType);
    setStatus('TERBIT');
    setIsPinned(false);
    setEventLocation('');
    setDestinationCity('');
    setAttachmentName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingContent(item);
    setTitle(item.title);
    setExcerpt(item.excerpt || '');
    setBody(item.body || '');
    setCoverImage(item.coverImage || '');
    setType(item.type);
    setStatus(item.status);
    setIsPinned(Boolean(item.isPinned));
    setEventLocation(item.eventLocation || '');
    setDestinationCity(item.destinationCity || '');
    setAttachmentName(item.attachmentName || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = '/api/admin/contents';
      const method = editingContent ? 'PUT' : 'POST';
      const payload = {
        id: editingContent?.id,
        title,
        excerpt,
        body,
        coverImage,
        type,
        status,
        isPinned,
        eventLocation,
        destinationCity,
        attachmentName,
        fileSize: attachmentName ? '2.5 MB' : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchContents();
      } else {
        alert(data.message || 'Gagal menyimpan konten');
      }
    } catch (e) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/contents?id=${itemToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItemToDelete(null);
        fetchContents();
      } else {
        alert(data.message || 'Gagal menghapus konten');
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = contents.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-gold-600" />
            Kelola Konten Kabar Kedinasan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publikasi dan kelola Berita, Pengumuman, Agenda, Laporan Perjalanan Dinas, dan Dokumen Intern.
          </p>
        </div>

        <Button onClick={handleOpenCreate} variant="primary" size="md" className="font-bold shrink-0">
          <Plus className="w-4 h-4" /> Buat Konten Baru
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { label: 'Semua Konten', value: 'ALL' },
            { label: 'Berita', value: 'NEWS' },
            { label: 'Pengumuman', value: 'ANNOUNCEMENT' },
            { label: 'Agenda', value: 'AGENDA' },
            { label: 'Lap. Perjadin', value: 'BUSINESS_TRIP' },
            { label: 'Dokumen Intern', value: 'INTERNAL_DOCUMENT' },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === t.value
                  ? 'bg-perpusnas-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Input
          placeholder="Cari judul konten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="w-full sm:w-60"
        />
      </div>

      {/* Table of Contents */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Konten"
          description="Belum ada konten kedinasan pada kategori ini."
          actionLabel="Buat Konten"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Judul Konten</th>
                  <th className="py-3.5 px-4">Tipe</th>
                  <th className="py-3.5 px-4">Penulis</th>
                  <th className="py-3.5 px-4">Tanggal Publikasi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-start gap-2">
                        {item.isPinned && <Pin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-bold text-slate-900 leading-snug line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">{item.excerpt || item.body}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" size="sm">{item.type}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.author?.name || 'Admin'}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(item.publishedAt)}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.status === 'TERBIT' ? 'success' : 'warning'} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 text-slate-600 hover:text-perpusnas-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setItemToDelete(item)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContent ? 'Ubah Konten Kedinasan' : 'Buat Konten Kedinasan Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tipe Konten
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={Boolean(editingContent)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none disabled:bg-slate-100 cursor-pointer"
                >
                  <option value="NEWS">Berita Kedinasan</option>
                  <option value="ANNOUNCEMENT">Pengumuman Resmi</option>
                  <option value="AGENDA">Agenda Kegiatan</option>
                  <option value="BUSINESS_TRIP">Laporan Perjalanan Dinas</option>
                  <option value="INTERNAL_DOCUMENT">Dokumen Intern & SOP</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>


          </div>

          <Input
            label="Judul Konten"
            placeholder="Masukkan judul..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Ringkasan Singkat (Excerpt)"
            placeholder="Ringkasan 1-2 kalimat..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Isi Konten Lengkap
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tuliskan isi artikel / teks pengumuman secara rinci..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none"
              required
            />
          </div>

          {/* Type specific fields */}
          {type === 'NEWS' && (
            <Input
              label="URL Gambar Sampul (Cover Image)"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          )}

          {type === 'AGENDA' && (
            <Input
              label="Lokasi Acara / Ruang Rapat"
              placeholder="Contoh: Gedung Perpusnas Lt. 24"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          )}

          {type === 'BUSINESS_TRIP' && (
            <Input
              label="Kota / Lokasi Tujuan Dinas"
              placeholder="Contoh: Yogyakarta & Sleman"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            />
          )}

          {(type === 'ANNOUNCEMENT' || type === 'INTERNAL_DOCUMENT' || type === 'BUSINESS_TRIP') && (
            <Input
              label="Nama Berkas Lampiran PDF"
              placeholder="Contoh: Surat_Edaran_2026.pdf"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
            />
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pinCheck"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-slate-300 text-perpusnas-900 focus:ring-perpusnas-700"
            />
            <label htmlFor="pinCheck" className="text-xs font-medium text-slate-700">
              Sematkan sebagai Konten Utama / Pinned di Beranda
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Simpan Konten
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Konten Kedinasan"
        message={`Apakah Anda yakin ingin menghapus "${itemToDelete?.title}"?`}
        isLoading={isDeleting}
      />
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, Search, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminKupasSosokPage() {
  const [figures, setFigures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [figureToDelete, setFigureToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFigures = () => {
    setIsLoading(true);
    fetch('/api/admin/figure-profiles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFigures(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchFigures();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/figure-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          deskripsi,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setName('');
        setDeskripsi('');
        fetchFigures();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!figureToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/figure-profiles?id=${figureToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFigureToDelete(null);
        fetchFigures();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = figures.filter((f) => {
    const figureName = f.nama_tokoh || f.name || '';
    const figureDesc = f.deskripsi || f.fullStory || f.cerita_lengkap || f.quote || '';
    return (
      figureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      figureDesc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-gold-600" />
            Kelola Profil Kupas Sosok
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar figur tokoh inspiratif dan pustakawan teladan Perpustakaan Nasional RI.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md" className="font-bold shrink-0">
          <Plus className="w-4 h-4" /> Tambah Profil Sosok
        </Button>
      </div>

      <div className="flex justify-end">
        <Input
          placeholder="Cari nama tokoh atau deskripsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="w-full sm:w-72"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum Ada Profil Sosok"
          description="Tambahkan figur teladan pertama untuk tampil di Kupas Sosok."
          actionLabel="Tambah Sosok"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-1/4">Nama Tokoh</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-4 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 align-top">
                      {f.nama_tokoh || f.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 align-top leading-relaxed">
                      <p className="line-clamp-3">
                        {f.deskripsi || f.cerita_lengkap || f.fullStory || f.quote || '-'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/kupas-sosok/${f.slug}`} target="_blank">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-perpusnas-900" title="Lihat Halaman">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setFigureToDelete(f)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          title="Hapus Profil"
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

      {/* Modal Add Figure */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Sosok Baru"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Tokoh"
            placeholder="Contoh: Dra. Sri Sumekar, M.Si."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Deskripsi Tokoh
            </label>
            <textarea
              rows={6}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Tuliskan biografi atau deskripsi tentang sosok ini..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Simpan Profil Sosok
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(figureToDelete)}
        onClose={() => setFigureToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Profil Sosok"
        message={`Apakah Anda yakin ingin menghapus profil "${figureToDelete?.name}"?`}
        isLoading={isDeleting}
      />
    </div>
  );
}


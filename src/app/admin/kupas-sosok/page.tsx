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
  const [position, setPosition] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [quote, setQuote] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSpotlight, setIsSpotlight] = useState(false);
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
          position,
          unitKerja,
          quote,
          fullStory,
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop',
          isSpotlight,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setName('');
        setPosition('');
        setUnitKerja('');
        setQuote('');
        setFullStory('');
        setPhotoUrl('');
        setIsSpotlight(false);
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

  const filtered = figures.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-gold-600" />
            Kelola Profil Kupas Sosok
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tambahkan profil tokoh inspiratif, pustakawan teladan, dan inovator sistem Perpusnas.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md" className="font-bold shrink-0">
          <Plus className="w-4 h-4" /> Tambah Profil Sosok
        </Button>
      </div>

      <div className="flex justify-end">
        <Input
          placeholder="Cari nama tokoh..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="w-full sm:w-64"
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
                  <th className="py-3.5 px-4">Nama Tokoh</th>
                  <th className="py-3.5 px-4">Jabatan & Unit Kerja</th>
                  <th className="py-3.5 px-4">Kutipan Singkat</th>
                  <th className="py-3.5 px-4">Spotlight</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{f.name}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{f.position}</p>
                      <p className="text-[10px] text-slate-400">{f.unitKerja}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic max-w-xs truncate">"{f.quote}"</td>
                    <td className="py-3.5 px-4">
                      {f.isSpotlight ? (
                        <Badge variant="gold" size="sm"><Star className="w-3 h-3 fill-gold-500" /> Spotlight</Badge>
                      ) : (
                        <Badge variant="default" size="sm">Reguler</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/kupas-sosok/${f.slug}`} target="_blank">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-perpusnas-900">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setFigureToDelete(f)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
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
        title="Tambah Sosok Inspiratif Baru"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <Input
            label="Nama Lengkap Beserta Gelar"
            placeholder="Contoh: Dra. Sri Sumekar, M.Si."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Jabatan / Bidang Keahlian"
              placeholder="Pustakawan Ahli Utama"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
            <Input
              label="Unit Kerja / Deputi"
              placeholder="Deputi Pengembangan Bahan Pustaka"
              value={unitKerja}
              onChange={(e) => setUnitKerja(e.target.value)}
              required
            />
          </div>

          <Input
            label="URL Foto Tokoh"
            placeholder="https://images.unsplash.com/..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Kutipan Inspirasi / Quote Utama
            </label>
            <textarea
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Tuliskan kutipan mutiara dari sosok ini..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Kisah Perjalanan Karier & Kontribusi Lengkap
            </label>
            <textarea
              rows={5}
              value={fullStory}
              onChange={(e) => setFullStory(e.target.value)}
              placeholder="Tuliskan biografi dan narasi kisah inspiratif sosok..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="spotCheck"
              checked={isSpotlight}
              onChange={(e) => setIsSpotlight(e.target.checked)}
              className="rounded border-slate-300 text-gold-600 focus:ring-gold-500"
            />
            <label htmlFor="spotCheck" className="text-xs font-medium text-slate-700">
              Jadikan sebagai Sosok Pilihan Utama (Spotlight di Beranda)
            </label>
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


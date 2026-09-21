'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Search, Heart, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

export default function AdminAntarPegawaiPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = () => {
    setIsLoading(true);
    fetch('/api/admin/employee-posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/employee-posts?id=${postToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPostToDelete(null);
        fetchPosts();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Terjadi kesalahan');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categorySlug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-gold-600" />
            Moderasi & Kelola Konten Antar Pegawai
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan moderasi tulisan pegawai di 12 kanal komunitas internal.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Cari judul, kategori, atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak Ada Postingan"
          description="Belum ada postingan antar pegawai yang terdata."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Judul Postingan</th>
                  <th className="py-3.5 px-4">Kanal Kategori</th>
                  <th className="py-3.5 px-4">Penulis (Pegawai)</th>
                  <th className="py-3.5 px-4">Interaksi</th>
                  <th className="py-3.5 px-4">Tanggal Post</th>
                  <th className="py-3.5 px-4 text-right">Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 leading-snug line-clamp-1">{post.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{post.body}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" size="sm" className="capitalize">
                        {post.categorySlug.replace(/-/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{post.author?.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">NIP: {post.author?.nip}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {post.likesCount || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-sky-500" /> {post._count?.comments || 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(post.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setPostToDelete(post)}
                        title="Hapus / Moderasi Postingan"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete / Moderation Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Moderasi / Hapus Postingan Pegawai"
        message={`Apakah Anda yakin ingin menghapus postingan "${postToDelete?.title}" karya ${postToDelete?.author?.name}?`}
        confirmText="Hapus Postingan"
        isLoading={isDeleting}
      />
    </div>
  );
}


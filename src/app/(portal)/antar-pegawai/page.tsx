'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Heart,
  PlusCircle,
  Search,
  Smile,
  Globe,
  Home,
  Quote,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Trophy,
  Lightbulb,
  Send,
  User,
  Clock,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import { CATEGORIES_CONFIG } from '@/lib/constants';

export default function AntarPegawaiPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('opini');
  const [newBody, setNewBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment State
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const fetchPosts = () => {
    setIsLoading(true);
    const catParam = activeCategory === 'all' ? '' : activeCategory;
    
    if (activeCategory === 'konsultasi') {
      fetch('/api/consultations')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setConsultations(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      fetch(`/api/employee-posts?category=${catParam}&q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setPosts(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/employee-posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likesCount: data.likesCount } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`/api/employee-posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: [...(p.comments || []), data.data] }
              : p
          )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/employee-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          categorySlug: newCategory,
          body: newBody,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewBody('');
        fetchPosts();
      } else {
        alert(data.message || 'Gagal menyimpan postingan');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/beranda" className="hover:text-perpusnas-800">Beranda</Link>
            <span>/</span>
            <span className="text-perpusnas-900 font-bold">Antar Pegawai</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600" />
            Ruang Interaksi & Kanal Antar Pegawai
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Wadah ekspresi, karya tulis, konsultasi, dan kebersamaan seluruh insan Perpusnas RI.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="md"
          className="font-bold shadow-md shadow-perpusnas-900/20"
        >
          <PlusCircle className="w-4 h-4" /> Tulis Konten Baru
        </Button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_CONFIG.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-perpusnas-900 text-white shadow-md shadow-perpusnas-900/20 scale-[1.02]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeCategory === 'konsultasi' ? (
        /* Konsultasi View */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
              <span><strong>Layanan Konsultasi Kedinasan:</strong> Ajukan pertanyaan seputar Kepegawaian (SI-ASN/BKN), Kendala IT Pusdatin, atau Layanan Medis.</span>
            </div>
          </div>

          <div className="space-y-4">
            {consultations.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={c.category === 'KEPEGAWAIAN' ? 'primary' : c.category === 'IT' ? 'info' : 'success'} size="sm">
                    KONSULTASI {c.category}
                  </Badge>
                  <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.question}</p>
                  <p className="text-[11px] text-slate-400 mt-2">Diajukan oleh: <span className="font-semibold text-slate-700">{c.author?.name}</span></p>
                </div>

                {c.replies && c.replies.length > 0 ? (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-800">Tanggapan Resmi Tim Terkait:</p>
                    {c.replies.map((rep: any) => (
                      <div key={rep.id} className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                        <p className="font-bold text-emerald-900">🛡️ {rep.author?.name} ({rep.author?.role?.name || 'Administrator'}):</p>
                        <p className="leading-relaxed">{rep.replyText}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 italic">⏳ Menunggu jawaban dari unit kerja terkait.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Belum Ada Tulisan di Kategori Ini"
          description="Jadilah pegawai pertama yang membagikan cerita atau karya di kategori ini!"
          actionLabel="Tulis Sekarang"
          onAction={() => {
            setNewCategory(activeCategory === 'all' ? 'opini' : activeCategory);
            setIsCreateModalOpen(true);
          }}
        />
      ) : (
        /* Regular Employee Posts Feed */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Author Info & Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-perpusnas-900 text-gold-400 flex items-center justify-center text-xs font-bold">
                      {getInitials(post.author?.name)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-none">{post.author?.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{post.author?.profile?.unitKerja || 'Perpusnas RI'}</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm" className="capitalize">
                    {post.categorySlug.replace(/-/g, ' ')}
                  </Badge>
                </div>

                {/* Body Content */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {post.body}
                  </p>
                </div>
              </div>

              {/* Interaction Bar & Comments */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-rose-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{post.likesCount || 0} Suka</span>
                  </button>

                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>

                {/* Comment List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-50">
                    {post.comments.map((cm: any) => (
                      <div key={cm.id} className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900">{cm.author?.name}: </span>
                        {cm.content}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Beri apresiasi atau komentar..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-perpusnas-700"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddComment(post.id)}
                    className="text-xs px-2.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tulis Konten Antar Pegawai"
        description="Bagikan artikel, catatan, humor, atau kutipan motivasi kepada rekan Perpusnas"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Kategori Konten
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none"
            >
              {CATEGORIES_CONFIG.filter((c) => c.slug !== 'all' && c.slug !== 'konsultasi').map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} — {c.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Input
              label="Judul Postingan"
              placeholder="Contoh: Pentingnya Menjaga Konsistensi Preservasi Koleksi Digital..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Isi Tulisan / Artikel
            </label>
            <textarea
              rows={5}
              placeholder="Tuliskan gagasan, cerita, atau inspirasi Anda di sini secara lengkap..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-perpusnas-700 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Publikasikan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

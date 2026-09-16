'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CATEGORIES_CONFIG } from '@/lib/constants';
import { Heart, PlusCircle, Clock, Send, Users, ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils';

export default function DynamicCategoryPage() {
  const params = useParams();
  const categorySlug = (params?.category as string) || 'opini';

  const currentCategory = CATEGORIES_CONFIG.find((c) => c.slug === categorySlug) || {
    slug: categorySlug,
    name: categorySlug.replace(/-/g, ' ').toUpperCase(),
    desc: 'Kanal informasi dan interaksi antarpegawai',
  };

  const [posts, setPosts] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // Post / Consultation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [consCategory, setConsCategory] = useState<'KEPEGAWAIAN' | 'IT' | 'KESEHATAN'>('KEPEGAWAIAN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    if (categorySlug === 'konsultasi' || categorySlug.startsWith('konsultasi-')) {
      const type = categorySlug.includes('it')
        ? 'IT'
        : categorySlug.includes('kesehatan')
        ? 'KESEHATAN'
        : categorySlug.includes('kepegawaian')
        ? 'KEPEGAWAIAN'
        : '';
      fetch(`/api/consultations${type ? `?category=${type}` : ''}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setConsultations(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      fetch(`/api/employee-posts?category=${categorySlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setPosts(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [categorySlug]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (categorySlug === 'konsultasi' || categorySlug.startsWith('konsultasi-')) {
        const res = await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            category: consCategory,
            question: body,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          setTitle('');
          setBody('');
          fetchData();
        } else {
          alert(data.message);
        }
      } else {
        const res = await fetch('/api/employee-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            categorySlug,
            body,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          setTitle('');
          setBody('');
          fetchData();
        } else {
          alert(data.message);
        }
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConsultation = categorySlug === 'konsultasi' || categorySlug.startsWith('konsultasi-');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/beranda" className="hover:text-perpusnas-800">Beranda</Link>
            <span>/</span>
            <span>Antar Pegawai</span>
            <span>/</span>
            <span className="text-perpusnas-900 font-bold capitalize">{currentCategory.name}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600" />
            {currentCategory.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{currentCategory.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <span>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" /> Semua Kanal
            </Button>
          </span>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
            className="font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            {isConsultation ? 'Ajukan Konsultasi' : 'Tulis di Kanal Ini'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isConsultation ? (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <EmptyState
              title="Belum Ada Topik Konsultasi"
              description="Ajukan pertanyaan Anda untuk dijawab oleh tim unit kerja terkait."
              actionLabel="Ajukan Konsultasi Sekarang"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            consultations.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge variant={c.category === 'KEPEGAWAIAN' ? 'primary' : c.category === 'IT' ? 'info' : 'success'} size="sm">
                    KONSULTASI {c.category}
                  </Badge>
                  <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.question}</p>
                  <p className="text-[11px] text-slate-400 mt-2">Penanya: <span className="font-semibold text-slate-700">{c.author?.name}</span></p>
                </div>
                {c.replies && c.replies.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-800">Tanggapan Unit Kerja:</p>
                    {c.replies.map((rep: any) => (
                      <div key={rep.id} className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950">
                        <p className="font-bold text-emerald-900">🛡️ {rep.author?.name}:</p>
                        <p className="leading-relaxed mt-0.5">{rep.replyText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title={`Belum Ada Postingan pada ${currentCategory.name}`}
          description="Jadilah yang pertama membagikan tulisan atau ide di kategori ini!"
          actionLabel="Tulis Sekarang"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
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
                  <span className="text-[11px] text-slate-400">{formatRelativeTime(post.createdAt)}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {post.body}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-rose-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{post.likesCount || 0} Suka</span>
                  </button>
                  <span className="text-[11px] text-slate-400">{formatDate(post.createdAt)}</span>
                </div>

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

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tulis komentar..."
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

      {/* Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isConsultation ? 'Form Pengajuan Konsultasi' : `Tulis Konten: ${currentCategory.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {isConsultation && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kategori Konsultasi
              </label>
              <select
                value={consCategory}
                onChange={(e) => setConsCategory(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 focus:border-perpusnas-700 focus:outline-none"
              >
                <option value="KEPEGAWAIAN">Kepegawaian (Kenaikan Pangkat, Cuti, SI-ASN)</option>
                <option value="IT">Teknologi Informasi (VPN, Akun Email, Aplikasi INLISLite)</option>
                <option value="KESEHATAN">Kesehatan Kerja & Poliklinik</option>
              </select>
            </div>
          )}

          <div>
            <Input
              label={isConsultation ? 'Topik / Pokok Pertanyaan' : 'Judul Tulisan'}
              placeholder="Masukkan judul yang ringkas dan jelas..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {isConsultation ? 'Uraian Pertanyaan' : 'Isi Artikel / Postingan'}
            </label>
            <textarea
              rows={5}
              placeholder="Tuliskan isi secara rinci..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-perpusnas-700 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Kirim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

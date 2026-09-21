'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Share2, Check } from 'lucide-react';

export interface SocialMediaItem {
  id: string;
  platform: 'youtube' | 'x' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'website';
  nama: string;
  link: string;
  status: 'ACTIVE' | 'INACTIVE' | 'Draft' | 'Menunggu Review' | 'Perlu Revisi' | 'Diterbitkan' | 'Diarsipkan' | string;
  imageUrl?: string;
  bannerUrl?: string;
  iconUrl?: string;
  imageFileName?: string;
  updatedBy: string;
  updatedAt: string;
}

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SocialMediaItem) => Promise<void>;
  initialData?: SocialMediaItem | null;
}

export const STATUS_OPTIONS = [
  'Draft',
  'Menunggu Review',
  'Perlu Revisi',
  'Diterbitkan',
  'Diarsipkan',
] as const;

export const PLATFORM_OPTIONS: { value: SocialMediaItem['platform']; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'website', label: 'Website Portal' },
];

export function SocialMediaModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: SocialMediaModalProps) {
  const [nama, setNama] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<string>('Status');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama || '');
      setLink(initialData.link || '');
      if (initialData.status === 'ACTIVE' || initialData.status === 'Diterbitkan' || initialData.status === 'Aktif') {
        setStatus('Aktif');
      } else if (initialData.status === 'INACTIVE' || initialData.status === 'Draft' || initialData.status === 'Nonaktif') {
        setStatus('Nonaktif');
      } else {
        setStatus(initialData.status || 'Nonaktif');
      }
      setImageUrl(initialData.imageUrl || initialData.bannerUrl || initialData.iconUrl || '');
      setImageFileName(initialData.imageFileName || '');
    } else {
      setNama('');
      setLink('');
      setStatus('Status');
      setImageUrl('');
      setImageFileName('');
    }
    setErrorMsg('');
    setIsStatusDropdownOpen(false);
  }, [initialData, isOpen]);

  // Click outside to close status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File maksimal berukuran 10 MB.');
        return;
      }
      setImageFileName(file.name);
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImageUrl('');
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const detectPlatform = (url: string, name: string): SocialMediaItem['platform'] => {
    const target = (url + ' ' + name).toLowerCase();
    if (target.includes('youtube') || target.includes('youtu.be')) return 'youtube';
    if (target.includes('instagram') || target.includes('ig.me')) return 'instagram';
    if (target.includes('facebook') || target.includes('fb.com')) return 'facebook';
    if (target.includes('twitter') || target.includes('x.com')) return 'x';
    if (target.includes('tiktok')) return 'tiktok';
    if (target.includes('linkedin')) return 'linkedin';
    return 'website';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama akun atau label media sosial wajib diisi.');
      return;
    }
    if (!link.trim()) {
      setErrorMsg('Tautan URL link wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const effectivePlatform = initialData?.platform || detectPlatform(link, nama);
      await onSave({
        id: initialData?.id || `soc-${Date.now()}`,
        platform: effectivePlatform,
        nama: nama.trim(),
        link: link.trim(),
        status: status === 'Status' ? 'Aktif' : status,
        imageUrl: imageUrl || undefined,
        bannerUrl: imageUrl || undefined,
        iconUrl: imageUrl || undefined,
        imageFileName: imageFileName || undefined,
        updatedBy: initialData?.updatedBy || 'Admin 1',
        updatedAt: new Date().toISOString(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan media sosial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop with soft blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container matching Google Stitch Design System */}
      <div
        className="relative w-full max-w-lg bg-white border border-[#c5c6d2] shadow-2xl rounded-2xl z-10 p-6 sm:p-7 max-h-[94vh] overflow-y-auto my-3 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header: Title & Red Square Close Button [X] */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <h2 className="text-xl font-black text-[#00113a] tracking-tight">
            {initialData ? 'Edit Media Sosial' : 'Tambah Media Sosial'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 bg-[#d32f2f] hover:bg-[#b71c1c] active:scale-95 text-white flex items-center justify-center rounded-xs font-bold text-xs transition-all shadow-2xs cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-800 ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* 1. Gambar Banner */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Gambar Banner
            </label>

            {/* Input Row: [ Pilih Berkas ] [ File berupa .png atau .jpg ] */}
            <div className="flex items-stretch border border-[#c5c6d2] rounded-xl overflow-hidden shadow-2xs focus-within:border-[#007BFF] focus-within:ring-1 focus-within:ring-[#007BFF] transition-all">
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
                id="social-media-banner-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#d1d5db] hover:bg-[#c4c8ce] active:scale-95 text-slate-900 text-xs font-bold border-r border-[#c5c6d2] transition-all shrink-0 cursor-pointer"
              >
                Pilih Berkas
              </button>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3.5 py-2 bg-white text-xs text-slate-600 truncate cursor-pointer flex items-center select-none hover:text-slate-800 transition-colors"
              >
                {imageFileName || 'File berupa .png atau .jpg'}
              </div>
            </div>

            <p className="text-[11px] text-[#007BFF] hover:underline cursor-pointer mt-1 font-medium">
              File maksimal berukuran 10 MB
            </p>

            {/* Preview Box (Matching Wireframe with Google Stitch Polish) */}
            <div className="relative mt-2.5 w-44 sm:w-48 h-28 bg-slate-100 border border-[#c5c6d2] rounded-xl overflow-hidden flex items-center justify-center shadow-2xs group">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain p-2.5"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/60 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer shadow-sm"
                    title="Hapus gambar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <Share2 className="w-7 h-7 text-slate-400 stroke-1" />
                    <span className="text-xs font-semibold text-slate-600">
                      Icon
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 font-bold text-xs p-1 cursor-pointer transition-colors"
                    title="Hapus"
                  >
                    x
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. Nama */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Masukkan nama atau label media sosial..."
              className="w-full rounded-xl border border-[#c5c6d2] bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* 3. Link */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              placeholder="https://..."
              className="w-full rounded-xl border border-[#c5c6d2] bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* 4. Simpan Button matching Wireframe */}
          <div className="flex items-start justify-end pt-1 pb-2">

            {/* Simpan Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 text-xs font-bold rounded-lg bg-[#5b6b82] hover:bg-[#485568] active:scale-95 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


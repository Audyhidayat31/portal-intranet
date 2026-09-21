'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Image as ImageIcon } from 'lucide-react';

export interface BannerItem {
  id?: string;
  imageUrl: string;
  imageName?: string;
  headline: string;
  subheadline: string;
  status: 'TERBIT' | 'WAITING' | 'MENUNGGU' | string;
  createdBy?: string;
  createdAt?: string;
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: BannerItem) => Promise<void>;
  initialData?: BannerItem | null;
}

export const BANNER_STATUS_OPTIONS = [
  { value: 'TERBIT', label: 'Terbit' },
  { value: 'WAITING', label: 'Menunggu' },
  { value: 'MENUNGGU', label: 'Draft' },
] as const;

export function BannerModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BannerModalProps) {
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [status, setStatus] = useState<string>('TERBIT');
  const [statusDisplay, setStatusDisplay] = useState<string>('Status');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setHeadline(initialData.headline || '');
      setSubheadline(initialData.subheadline || '');
      if (initialData.status === 'WAITING') {
        setStatus('WAITING');
        setStatusDisplay('Menunggu');
      } else if (initialData.status === 'MENUNGGU') {
        setStatus('MENUNGGU');
        setStatusDisplay('Draft');
      } else {
        setStatus('TERBIT');
        setStatusDisplay('Terbit');
      }
      setImageUrl(initialData.imageUrl || '');
      setImageFileName(initialData.imageName || (initialData.imageUrl ? 'Banner.png' : ''));
    } else {
      setHeadline('');
      setSubheadline('');
      setStatus('TERBIT');
      setStatusDisplay('Status');
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

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      setErrorMsg('Headline banner wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onSave({
        id: initialData?.id,
        imageUrl: imageUrl || '/images/hero-illustration.webp',
        imageName: imageFileName || 'Banner.png',
        headline: headline.trim(),
        subheadline: subheadline.trim(),
        status: status || 'TERBIT',
        createdBy: initialData?.createdBy || 'Admin 1',
        createdAt: initialData?.createdAt || new Date().toISOString(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan banner.');
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
            {initialData ? 'Edit Banner' : 'Tambah Banner'}
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
            <button
              type="button"
              onClick={() => setErrorMsg('')}
              className="text-red-500 hover:text-red-800 ml-2 cursor-pointer"
            >
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
                id="banner-image-upload"
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

            {/* Preview Box */}
            <div className="relative mt-2.5 w-full h-36 bg-slate-100 border border-[#c5c6d2] rounded-xl overflow-hidden flex items-center justify-center shadow-2xs group">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview Banner"
                    className="w-full h-full object-cover"
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
                  <div className="flex flex-col items-center gap-1.5 text-slate-500">
                    <ImageIcon className="w-8 h-8 text-slate-400 stroke-1" />
                    <span className="text-xs font-semibold text-slate-600">
                      Gambar Banner
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

          {/* 2. Headline */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              placeholder="Masukkan headline banner..."
              className="w-full rounded-xl border border-[#c5c6d2] bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* 3. Subheadline */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Subheadline
            </label>
            <input
              type="text"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="Masukkan subheadline banner..."
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


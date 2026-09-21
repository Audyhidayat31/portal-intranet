'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface DigitalServiceItem {
  id: string;
  nama: string;
  link: string;
  status: 'ACTIVE' | 'INACTIVE' | 'Draft' | 'Menunggu Review' | 'Perlu Revisi' | 'Diterbitkan' | 'Diarsipkan' | string;
  updatedBy: string;
  updatedAt: string;
}

interface DigitalServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DigitalServiceItem) => Promise<void>;
  initialData?: DigitalServiceItem | null;
}

export const STATUS_OPTIONS = [
  'Draft',
  'Menunggu Review',
  'Perlu Revisi',
  'Diterbitkan',
  'Diarsipkan',
] as const;

export function DigitalServiceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: DigitalServiceModalProps) {
  const [nama, setNama] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<string>('Status');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama || '');
      setLink(initialData.link || '');
      if (initialData.status === 'ACTIVE') {
        setStatus('Diterbitkan');
      } else if (initialData.status === 'INACTIVE') {
        setStatus('Draft');
      } else {
        setStatus(initialData.status || 'Draft');
      }
    } else {
      setNama('');
      setLink('');
      setStatus('Status');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama layanan digital wajib diisi.');
      return;
    }
    if (!link.trim()) {
      setErrorMsg('Tautan URL layanan digital wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: initialData?.id || `svc-${Date.now()}`,
        nama: nama.trim(),
        link: link.trim(),
        status: status === 'Status' ? 'Diterbitkan' : status,
        updatedBy: initialData?.updatedBy || 'Admin 1',
        updatedAt: new Date().toISOString(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan layanan digital.');
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
            {initialData ? 'Edit Layanan Digital' : 'Tambah Layanan Digital'}
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
          {/* 1. Nama */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Masukkan nama layanan digital..."
              className="w-full rounded-xl border border-[#c5c6d2] bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* 2. Link */}
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

          {/* 3. Simpan Button matching Wireframe */}
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


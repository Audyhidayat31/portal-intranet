'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export interface AttachmentItem {
  file?: File;
  name: string;
  preview?: string | null;
}

export interface AttachmentUploadFieldProps {
  attachments: AttachmentItem[];
  onChange: (attachments: AttachmentItem[]) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
  placeholder?: string;
  accept?: string;
  disabled?: boolean;
}

export default function AttachmentUploadField({
  attachments,
  onChange,
  maxFiles = 5,
  maxFileSizeMB = 5,
  placeholder = 'Maksimal 5 berkas berupa .pdf/ .docx/ .jpg/ .png',
  accept = '.pdf,.docx,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png',
  disabled = false,
}: AttachmentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  // Auto-dismiss balloon error after 5s
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate extension
    const invalidFormat = files.find(
      (f) => !f.name.match(/\.(pdf|docx|doc|jpg|jpeg|png)$/i)
    );
    if (invalidFormat) {
      if (inputRef.current) inputRef.current.value = '';
      setErrorMsg('Berkas harus berupa .pdf/ .docx/ .jpg/ .png');
      return;
    }

    // Validate size limit (5MB default per file)
    const MAX_BYTES = maxFileSizeMB * 1024 * 1024;
    const oversized = files.find((f) => f.size > MAX_BYTES);
    if (oversized) {
      if (inputRef.current) inputRef.current.value = '';
      setErrorMsg(`Ukuran berkas maksimal ${maxFileSizeMB}MB per file`);
      return;
    }

    // Validate max count
    if (attachments.length + files.length > maxFiles) {
      if (inputRef.current) inputRef.current.value = '';
      setErrorMsg(`Maksimal ${maxFiles} berkas diperbolehkan`);
      return;
    }

    setErrorMsg('');

    const newItems: AttachmentItem[] = await Promise.all(
      files.map(async (file) => {
        let preview: string | null = null;
        try {
          preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string) || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        } catch {
          preview = null;
        }
        return {
          file,
          name: file.name,
          preview,
        };
      })
    );

    onChange([...attachments, ...newItems]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  const handleDownload = (dataUrl: string | null | undefined, fileName: string) => {
    if (!dataUrl) {
      alert(`Mengunduh berkas ${fileName}...`);
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName || 'lampiran';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Input & Button Bar */}
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            readOnly
            suppressHydrationWarning
            value={
              attachments.length > 0
                ? attachments.length === 1
                  ? attachments[0].name
                  : `${attachments.length} berkas dipilih`
                : ''
            }
            placeholder={placeholder}
            className={`flex-grow h-10 border border-r-0 rounded-l px-3 text-sm bg-white text-[#444650] placeholder-[#757682] cursor-default focus:outline-none transition-colors ${
              errorMsg ? 'border-amber-400 ring-1 ring-amber-400' : 'border-[#c5c6d2]'
            }`}
          />
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            disabled={disabled}
            suppressHydrationWarning
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              inputRef.current?.click();
            }}
            disabled={disabled || attachments.length >= maxFiles}
            className="px-6 h-10 bg-[#e9e7ee] border border-[#c5c6d2] rounded-r text-[#1a1b20] font-bold text-xs sm:text-sm hover:bg-[#e1e3e4] transition-colors disabled:opacity-50 cursor-pointer"
          >
            Upload
          </button>
        </div>

        {/* Warning Balloon */}
        {errorMsg && (
          <div className="absolute left-2 top-[calc(100%+8px)] z-40 flex items-center gap-2.5 bg-white text-slate-800 text-xs sm:text-sm py-2 px-3.5 rounded-lg shadow-xl border border-slate-300 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-slate-300 rotate-45 transform" />
            <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">
              !
            </div>
            <span className="font-medium text-slate-800">{errorMsg}</span>
          </div>
        )}

        <p className="text-xs text-[#757682] mt-1.5 font-normal">
          Berkas maksimal {maxFileSizeMB}MB
        </p>
      </div>

      {/* Attachment Previews Grid */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
          {attachments.map((att, idx) => {
            const isImg = att.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
            const isPdf = att.name.toLowerCase().endsWith('.pdf');
            const isDocx =
              att.name.toLowerCase().endsWith('.docx') ||
              att.name.toLowerCase().endsWith('.doc');

            return (
              <div
                key={idx}
                className={`relative group border border-[#c5c6d2] rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center transition-all shadow-2xs hover:shadow-md cursor-pointer ${
                  isImg ? 'p-0 bg-transparent' : 'p-2.5 bg-[#e9e7ee]'
                }`}
                onClick={() => {
                  if (isImg && att.preview) {
                    setModalImageUrl(att.preview);
                  } else {
                    handleDownload(att.preview, att.name);
                  }
                }}
                title={isImg ? 'Klik untuk memperbesar' : `Klik untuk unduh: ${att.name}`}
              >
                {isImg && att.preview ? (
                  <>
                    <img
                      src={att.preview}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                      <span className="text-xs text-center px-2">Klik untuk memperbesar</span>
                    </div>
                    <span className="absolute bottom-0 w-full bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 truncate text-center z-10 pointer-events-none">
                      {att.name}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 group-hover:scale-105 transition-transform ${
                          isDocx
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#1a1b20] group-hover:text-[#00113a] transition-colors line-clamp-2 break-all text-center px-1">
                        {att.name}
                      </span>
                      <span
                        className={`mt-1 px-1.5 py-0.2 rounded text-[8px] font-bold border ${
                          isDocx
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {isPdf ? 'PDF' : isDocx ? 'DOCX' : 'BERKAS'}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                      <span className="text-xs text-center px-2 leading-tight">Klik untuk unduh</span>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAttachment(idx);
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                  title="Hapus berkas"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {modalImageUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4 sm:p-8"
          onClick={() => setModalImageUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setModalImageUrl(null);
            }}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <img
            src={modalImageUrl}
            alt="Pratinjau Gambar Penuh"
            className="max-w-full max-h-full object-contain rounded shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

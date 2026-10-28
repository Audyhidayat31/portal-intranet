'use client';

import React, { useState, useMemo } from 'react';
import { FileText, X } from 'lucide-react';

export interface DetailAttachmentItem {
  name: string;
  url?: string;
  isImage?: boolean;
}

export interface AttachmentDetailListProps {
  attachments?: DetailAttachmentItem[];
  attachmentName?: string | null;
  attachmentUrl?: string | null;
  title?: string;
  className?: string;
}

export default function AttachmentDetailList({
  attachments,
  attachmentName,
  attachmentUrl,
  title = 'LAMPIRAN',
  className = '',
}: AttachmentDetailListProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Parse structured list if not provided directly
  const list = useMemo(() => {
    if (attachments && attachments.length > 0) {
      return attachments.map((att) => ({
        ...att,
        url: att.url || `/uploads/${att.name}`,
        isImage:
          att.isImage ?? Boolean(att.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)),
      }));
    }

    const result: DetailAttachmentItem[] = [];

    if (attachmentUrl) {
      try {
        const parsed = JSON.parse(attachmentUrl);
        if (Array.isArray(parsed)) {
          const names = attachmentName
            ? attachmentName.split(',').map((s) => s.trim()).filter(Boolean)
            : [];
          const totalCount = Math.max(names.length, parsed.length);
          for (let i = 0; i < totalCount; i++) {
            const name = names[i] || `Lampiran ${i + 1}`;
            const url = parsed[i] || `/uploads/${name}`;
            const isImage = Boolean(
              url?.startsWith('data:image') ||
                name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
                url?.match(/\.(jpg|jpeg|png|webp|gif)$/i)
            );
            result.push({ name, url, isImage });
          }
        } else if (typeof parsed === 'string') {
          const isImage = Boolean(
            parsed.startsWith('data:image') ||
              attachmentName?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
              parsed.match(/\.(jpg|jpeg|png|webp|gif)$/i)
          );
          result.push({
            name: attachmentName || 'Dokumen Lampiran.pdf',
            url: parsed,
            isImage,
          });
        }
      } catch {
        const url = attachmentUrl;
        const isImage = Boolean(
          url?.startsWith('data:image') ||
            attachmentName?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
            url?.match(/\.(jpg|jpeg|png|webp|gif)$/i)
        );
        result.push({
          name: attachmentName || 'Dokumen Lampiran.pdf',
          url,
          isImage,
        });
      }
    } else if (attachmentName && attachmentName.trim() !== '') {
      const names = attachmentName
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      names.forEach((name) => {
        const isImage = Boolean(name.match(/\.(jpg|jpeg|png|webp|gif)$/i));
        result.push({ name, url: `/uploads/${name}`, isImage });
      });
    }

    return result;
  }, [attachments, attachmentName, attachmentUrl]);

  if (list.length === 0) return null;

  const handleDownload = (fileUrl: string | undefined, name: string) => {
    if (!fileUrl) {
      alert(`Mengunduh berkas ${name}...`);
      return;
    }
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-xs font-bold text-[#1a1b20] uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}

      {/* Grid Lampiran */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {list.map((att, idx) => {
          const isDocx =
            att.name.toLowerCase().endsWith('.docx') ||
            att.name.toLowerCase().endsWith('.doc');
          const isPdf = att.name.toLowerCase().endsWith('.pdf');
          const fileUrl = att.url || `/uploads/${att.name}`;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (att.isImage) {
                  setPreviewImage(fileUrl);
                } else {
                  handleDownload(fileUrl, att.name);
                }
              }}
              className={`aspect-square border border-[#c5c6d2] rounded-md flex flex-col items-center justify-center font-medium transition-all group shadow-2xs cursor-pointer overflow-hidden relative ${
                att.isImage
                  ? 'p-0 bg-transparent'
                  : 'p-2.5 bg-[#e9e7ee] hover:bg-[#d8d9e2] text-xs text-[#757682] hover:text-[#00113a]'
              }`}
              title={
                att.isImage
                  ? 'Klik untuk memperbesar'
                  : `Klik untuk unduh: ${att.name}`
              }
            >
              {att.isImage ? (
                <>
                  <img
                    src={fileUrl}
                    alt={att.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white font-medium backdrop-blur-xs pointer-events-none">
                    <span className="text-xs text-center px-2">
                      Klik untuk memperbesar
                    </span>
                  </div>
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
                    <span className="text-xs text-center px-2 leading-tight">
                      Klik untuk unduh
                    </span>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox Preview Modal (Foto saja tanpa border atau tempat wadah dan tanpa tombol unduh/tutup) */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn p-4 sm:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImage(null);
            }}
            title="Tutup Pratinjau"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <img
            src={previewImage}
            alt="Pratinjau Foto Lampiran"
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 select-none">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Halaman Sebelumnya"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c5c6d2] bg-white text-[#444650] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
        const isActive = currentPage === pageNum;
        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              isActive
                ? 'bg-[#002366] text-white shadow-sm'
                : 'border border-[#c5c6d2] bg-white text-[#444650] hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Halaman Berikutnya"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c5c6d2] bg-white text-[#444650] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

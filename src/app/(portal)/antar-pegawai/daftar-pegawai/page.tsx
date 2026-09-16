'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  User,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  X,
  ExternalLink,
} from 'lucide-react';
import { LIST_UNIT_KERJA, MockEmployee } from '@/lib/mock-employees';

export default function DaftarPegawaiPage() {
  const [employees, setEmployees] = useState<MockEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('Semua Unit Kerja');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dropdown UI states
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageRef = useRef<HTMLDivElement>(null);

  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const unitDropdownRef = useRef<HTMLDivElement>(null);

  // Selected employee for detail modal
  const [selectedEmployee, setSelectedEmployee] = useState<MockEmployee | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
        setIsPerPageOpen(false);
      }
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target as Node)) {
        setIsUnitDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (submittedSearch) params.append('q', submittedSearch);
      if (selectedUnit && selectedUnit !== 'Semua Unit Kerja') {
        params.append('unit', selectedUnit);
      }

      const res = await fetch(`/api/employees?${params.toString()}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [submittedSearch, selectedUnit]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [submittedSearch, selectedUnit, itemsPerPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(searchQuery.trim());
  };

  // Pagination calculation
  const totalItems = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return employees.slice(start, start + itemsPerPage);
  }, [employees, currentPage, itemsPerPage]);

  return (
    <main className="min-h-screen bg-[#f8f9fb] pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb matching wireframe */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span>
            Antar Pegawai
          </span>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Daftar Pegawai</span>
        </nav>

        {/* Header Section matching wireframe */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#00113a] tracking-tight">
            Daftar Pegawai
          </h1>
          <p className="text-sm sm:text-base text-[#444650] mt-1 font-normal">
            Deskripsi Daftar Pegawai
          </p>
        </div>

        {/* Controls Row with Centered Search Feature */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 mt-6">
          {/* Left: Tampilkan [ 20 v ] data */}
          <div className="flex items-center gap-2 text-sm text-[#1a1b20] shrink-0" ref={perPageRef}>
            <span className="font-normal text-slate-800">Tampilkan</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-3 h-3 text-white fill-white" />
              </button>

              {isPerPageOpen && (
                <div className="absolute left-0 top-full mt-1 w-14 bg-white border border-[#c5c6d2] rounded-sm shadow-md z-30 py-1 text-center">
                  {[20, 50, 100].filter((n) => n !== itemsPerPage).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(num);
                        setIsPerPageOpen(false);
                      }}
                      className="w-full text-center py-1 text-xs text-slate-800 hover:bg-slate-100 transition-colors block font-normal cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="font-normal text-slate-800">data</span>
          </div>

          {/* Center: Search Bar [ Cari Pegawai... ] [ Q ] */}
          <div className="flex-1 flex justify-center w-full">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-lg w-full sm:w-[480px]">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Pegawai..."
                  className="w-full border border-[#c5c6d2] rounded py-1.5 px-3 text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSubmittedSearch('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                aria-label="Cari"
                className="bg-white border border-[#c5c6d2] rounded px-3 py-2 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <Search className="w-4 h-4 text-slate-400" />
              </button>
            </form>
          </div>

          {/* Invisible Balancer on Right */}
          <div className="hidden md:flex items-center gap-2 text-sm shrink-0 invisible pointer-events-none select-none" aria-hidden="true">
            <span>Tampilkan</span>
            <div className="px-2.5 py-0.5 text-xs">
              <span>{itemsPerPage}</span>
            </div>
            <span>data</span>
          </div>
        </div>

        {/* 5-Column Grid matching Wireframe */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 mb-12">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-[#c5c6d2] rounded-2xl overflow-hidden bg-white animate-pulse h-72 flex flex-col"
              >
                <div className="h-44 bg-slate-200 w-full" />
                <div className="p-3.5 space-y-2 flex flex-col items-center">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedEmployees.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#c5c6d2] rounded-2xl bg-white mb-12">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-[#00113a] mb-1">
              Tidak Ada Pegawai Ditemukan
            </h2>
            <p className="text-sm text-[#444650] max-w-md mx-auto">
              Tidak ditemukan data pegawai untuk pencarian atau filter yang dipilih. Silakan coba kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSubmittedSearch('');
                setSelectedUnit('Semua Unit Kerja');
              }}
              className="mt-4 text-xs font-bold text-[#002366] hover:underline"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 mb-12">
            {paginatedEmployees.map((emp) => (
              <Link
                key={emp.id || emp.nip}
                href={`/antar-pegawai/daftar-pegawai/${emp.id || emp.nip}`}
                className="border border-[#c5c6d2] rounded-2xl overflow-hidden bg-white hover:border-[#002366] hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer group text-inherit no-underline"
              >
                {/* Photo section */}
                <div className="h-44 sm:h-48 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {emp.avatarUrl ? (
                    <img
                      src={emp.avatarUrl}
                      alt={emp.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-[#757682]">
                      <User className="w-16 h-16 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Details section matching wireframe */}
                <div className="p-3 sm:p-3.5 text-center flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#00113a] group-hover:text-[#002366] transition-colors line-clamp-1 leading-snug">
                      {emp.name}
                    </h3>
                    <p className="text-[11px] text-[#757682] mt-0.5 tracking-tight font-mono">
                      {emp.nip}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] text-[#444650] font-medium line-clamp-2 leading-tight">
                      {emp.position || emp.unitKerja}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Section matching wireframe (< 1 2 3 4 5 ... >) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 select-none">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                  onClick={() => setCurrentPage(pageNum)}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman Berikutnya"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#c5c6d2] bg-white text-[#444650] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-[#00113a]">
                Profil Detail Pegawai
              </h2>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
                <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                  {selectedEmployee.avatarUrl ? (
                    <img
                      src={selectedEmployee.avatarUrl}
                      alt={selectedEmployee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-grow">
                  <h3 className="text-xl font-black text-[#00113a]">
                    {selectedEmployee.fullName || selectedEmployee.name}
                  </h3>
                  <p className="text-sm font-mono text-slate-500">
                    NIP: {selectedEmployee.nip}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#002366] border border-blue-200">
                      {selectedEmployee.position}
                    </span>
                    {selectedEmployee.golRuang && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Gol. {selectedEmployee.golRuang}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1.5 pt-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedEmployee.unitKerja}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#002366] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Email Kedinasan</p>
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {selectedEmployee.email || `${selectedEmployee.nip}@perpusnas.go.id`}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Nomor Kontak</p>
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {selectedEmployee.phone || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education & Bio Details */}
              <div className="space-y-4 text-xs">
                {selectedEmployee.education && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                      <GraduationCap className="w-4 h-4 text-[#002366]" />
                      Riwayat Pendidikan
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedEmployee.education}
                    </p>
                  </div>
                )}

                {selectedEmployee.careerHistory && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                      <Briefcase className="w-4 h-4 text-[#002366]" />
                      Riwayat Jabatan & Karir
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedEmployee.careerHistory}
                    </p>
                  </div>
                )}

                {selectedEmployee.achievements && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      Prestasi & Penghargaan
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedEmployee.achievements}
                    </p>
                  </div>
                )}

                {selectedEmployee.bio && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      Biografi Singkat
                    </h4>
                    <p className="text-slate-600 leading-relaxed italic">
                      "{selectedEmployee.bio}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-5 py-2 rounded-lg bg-[#002366] text-white text-xs font-bold hover:bg-[#00113a] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Building, Phone, Mail, Award, GraduationCap, Briefcase, User, X, Cake, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getInitials, formatBirthDate } from '@/lib/utils';

export default function DirektoriPegawaiPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEmployees(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nip.includes(searchQuery) ||
      (emp.profile?.position && emp.profile.position.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchUnit = !unitFilter || (emp.profile?.unitKerja && emp.profile.unitKerja.includes(unitFilter));
    return matchSearch && matchUnit;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/beranda" className="hover:text-perpusnas-800">Beranda</Link>
            <span>/</span>
            <Link href="/profil/akun" className="hover:text-perpusnas-800">Profil</Link>
            <span>/</span>
            <span className="text-perpusnas-900 font-bold">Direktori Pegawai</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-perpusnas-800" />
            Direktori Pegawai Perpusnas RI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar resmi aparatur sipil negara dan pejabat fungsional di lingkungan Perpustakaan Nasional RI.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Cari nama, NIP, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Grid of Employees */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TableSkeleton rows={4} />
          <TableSkeleton rows={4} />
          <TableSkeleton rows={4} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Pegawai Tidak Ditemukan"
          description="Tidak ada data pegawai yang sesuai dengan kata kunci pencarian Anda."
          actionLabel="Reset Filter"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((emp) => {
            const p = emp.profile;
            const empBirthDate = formatBirthDate(p?.birthDate, emp.nip);

            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-perpusnas-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-perpusnas-900 to-perpusnas-700 text-gold-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    {getInitials(emp.name)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-perpusnas-900 transition-colors leading-tight truncate">
                      {emp.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">NIP: {emp.nip}</p>
                    <p className="text-xs font-medium text-perpusnas-800 leading-snug line-clamp-1">
                      {p?.position || 'Aparatur Sipil Negara'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p?.unitKerja || 'Perpusnas RI'}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Cake className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Lahir: {empBirthDate}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.email}</span>
                  </p>
                </div>

                <div className="pt-2 text-right">
                  <span className="text-[11px] font-bold text-perpusnas-700 group-hover:underline">
                    Lihat Profil Lengkap →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          title="Detail Informasi Pegawai"
          maxWidth="lg"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Bio */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-perpusnas-50 border border-perpusnas-100">
              <div className="w-16 h-16 rounded-2xl bg-perpusnas-900 text-gold-400 flex items-center justify-center font-black text-xl shadow">
                {getInitials(selectedEmployee.name)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEmployee.name}</h3>
                <p className="text-xs font-mono text-slate-500">NIP: {selectedEmployee.nip}</p>
                <p className="text-xs font-semibold text-perpusnas-800 mt-0.5">
                  {selectedEmployee.profile?.position || 'Aparatur Perpusnas'}
                </p>
              </div>
            </div>

            {/* Official Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Unit Kerja / Direktorat</span>
                <p className="font-semibold text-slate-800 mt-1">{selectedEmployee.profile?.unitKerja || 'Perpusnas RI'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Golongan / Ruang</span>
                <p className="font-semibold text-slate-800 mt-1">{selectedEmployee.profile?.golRuang || 'IV/a - Pembina'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-rose-500" /> Tanggal, Bulan & Tahun Kelahiran
                </span>
                <p className="font-bold text-slate-900 mt-1">
                  {formatBirthDate(selectedEmployee.profile?.birthDate, selectedEmployee.nip)}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Email Kedinasan</span>
                <p className="font-semibold text-slate-800 mt-1 truncate">{selectedEmployee.email}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Nomor Kontak / Ekstensi</span>
                <p className="font-semibold text-slate-800 mt-1">{selectedEmployee.profile?.phone || '(021) 3154864'}</p>
              </div>
            </div>

            {/* Education */}
            {selectedEmployee.profile?.education && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-perpusnas-800" /> Riwayat Pendidikan
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedEmployee.profile.education}
                </p>
              </div>
            )}

            {/* Career History */}
            {selectedEmployee.profile?.careerHistory && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-perpusnas-800" /> Riwayat Pekerjaan / Penugasan
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedEmployee.profile.careerHistory}
                </p>
              </div>
            )}

            {/* Achievements */}
            {selectedEmployee.profile?.achievements && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-600" /> Prestasi & Penghargaan
                </h4>
                <p className="text-xs text-slate-600 bg-gold-50/50 p-3 rounded-xl border border-gold-200 leading-relaxed">
                  {selectedEmployee.profile.achievements}
                </p>
              </div>
            )}

            {/* Bio */}
            {selectedEmployee.profile?.bio && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900">Biografi / Motto</h4>
                <p className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  "{selectedEmployee.profile.bio}"
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedEmployee(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

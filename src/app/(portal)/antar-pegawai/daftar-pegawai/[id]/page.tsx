'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  X,
  Pencil,
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { MockEmployee } from '@/lib/mock-employees';

export default function LihatPegawaiPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.id as string;

  const [employee, setEmployee] = useState<MockEmployee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MockEmployee>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    fetch(`/api/employees/${employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setEmployee(data.data);
          setEditForm(data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch employee details:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [employeeId]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success) {
        setEmployee((prev) => ({ ...prev, ...editForm } as MockEmployee));
        setNotification({ type: 'success', message: 'Data pegawai berhasil diperbarui!' });
        setIsEditModalOpen(false);
      } else {
        setNotification({ type: 'error', message: data.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setEditForm((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f9fb] pb-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-8">
          <div className="h-6 bg-slate-200 rounded w-64 mb-6 animate-pulse" />
          <div className="bg-white border border-[#c5c6d2] rounded-2xl p-8 h-[550px] animate-pulse" />
        </div>
      </main>
    );
  }

  if (!employee) {
    return (
      <main className="min-h-screen bg-[#f8f9fb] pb-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-8 text-center py-20">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#00113a]">Pegawai Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">Data pegawai dengan ID yang diminta tidak tersedia.</p>
          <Link
            href="/antar-pegawai/daftar-pegawai"
            className="px-5 py-2.5 rounded-lg bg-[#002366] text-white text-xs font-bold hover:bg-[#00113a]"
          >
            Kembali ke Daftar Pegawai
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] pb-20">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-8">
        {/* Breadcrumb matching wireframe */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link href="/antar-pegawai" className="hover:text-[#00113a] transition-colors">
            Antar Pegawai
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link href="/antar-pegawai/daftar-pegawai" className="hover:text-[#00113a] transition-colors">
            Daftar Pegawai
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold truncate max-w-[200px]">
            {employee.name}
          </span>
        </nav>

        {/* Feedback Alert Banner */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Main Box Card (Matching Wireframe) */}
        <div className="bg-white border border-[#c5c6d2] rounded-2xl p-6 sm:p-10 shadow-xs relative">
          {/* Red Square Close Button (Top Right as in Wireframe) */}
          <Link
            href="/antar-pegawai/daftar-pegawai"
            aria-label="Tutup dan kembali ke daftar pegawai"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Kembali ke Daftar Pegawai"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </Link>

          {/* Grid Layout: Left Column (Profile Box) & Right Column (Data Details) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mt-2">
            {/* ---------------- KOLOM KIRI: RINGKASAN PROFIL ---------------- */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center">
              <div className="w-full border border-[#c5c6d2] rounded-xl p-6 sm:p-8 flex flex-col items-center text-center justify-center bg-white shadow-2xs">
                {/* Circular Avatar with Blue Pencil Badge */}
                <div className="relative mb-4">
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner">
                    {employee.avatarUrl ? (
                      <img
                        src={employee.avatarUrl}
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-slate-300" />
                    )}
                  </div>

                  {/* Blue Pencil Icon Badge (Matching Wireframe) */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm(employee);
                      setIsEditModalOpen(true);
                    }}
                    aria-label="Ubah foto atau profil"
                    className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-[#007BFF] hover:bg-[#0056b3] text-white flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Edit Profil"
                  >
                    <Pencil className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>

                {/* Name, NIP, Position */}
                <h1 className="font-bold text-base sm:text-lg text-[#00113a] leading-snug">
                  {employee.name}
                </h1>
                <p className="text-xs text-[#757682] mt-1 font-mono tracking-wide">
                  {employee.nip}
                </p>
                <p className="text-xs sm:text-sm text-[#444650] mt-1.5 font-medium leading-relaxed">
                  {employee.position}
                </p>
              </div>
            </div>

            {/* ---------------- KOLOM KANAN: RINCIAN DATA ---------------- */}
            <div className="md:col-span-8 lg:col-span-8 space-y-6">
              {/* SECTION 1: DATA PRIBADI */}
              <div>
                <h2 className="text-base font-bold text-[#00113a] mb-4 tracking-tight">
                  Data Pribadi
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {/* Nama Lengkap */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Nama Lengkap</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.fullName || employee.name}
                    </p>
                  </div>

                  {/* Nomor Induk Pegawai (NIP) */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Nomor Induk Pegawai (NIP)</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5 font-mono">
                      {employee.nip}
                    </p>
                  </div>

                  {/* Email Kedinasan */}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#757682] font-medium">Email Kedinasan</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.email || `${employee.nip}@perpusnas.go.id`}
                    </p>
                  </div>

                  {/* Alamat Domisili */}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#757682] font-medium">Alamat Domisili</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5 leading-relaxed">
                      {employee.alamatDomisili ||
                        'Jalan Imam Bonjol Nomor 1, RT 5/RW 4, Menteng, Kecamatan Menteng, Kota Jakarta Pusat'}
                    </p>
                  </div>

                  {/* Nomor Seluler */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Nomor Seluler</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.phone || '+62 812 1714 0352'}
                    </p>
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Tanggal Lahir</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.tanggalLahir || '27 November 1986'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <hr className="border-t border-[#c5c6d2]" />

              {/* SECTION 2: UNIT KERJA */}
              <div>
                <h2 className="text-base font-bold text-[#00113a] mb-4 tracking-tight">
                  Unit Kerja
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  {/* Satuan Kerja */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Satuan Kerja</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.satuanKerja || 'Sistem Informasi'}
                    </p>
                  </div>

                  {/* Unit Eselon II */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Unit Eselon II</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.eselon2 || employee.unitKerja || 'Pusat Sistem Informasi'}
                    </p>
                  </div>

                  {/* Jabatan Saat Ini */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Jabatan Saat Ini</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.position || 'Kepala Sistem Informasi'}
                    </p>
                  </div>

                  {/* Unit Eselon III */}
                  <div>
                    <p className="text-xs text-[#757682] font-medium">Unit Eselon III</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.eselon3 || 'Bidang Layanan Sistem Informasi'}
                    </p>
                  </div>

                  {/* Lokasi Kerja */}
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#757682] font-medium">Lokasi Kerja</p>
                    <p className="text-sm font-semibold text-[#00113a] mt-0.5">
                      {employee.lokasiKerja || 'Jl. Medan Merdeka Selatan No. 11, Jakarta 10110'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: [ Edit ] Button matching wireframe */}
              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditForm(employee);
                    setIsEditModalOpen(true);
                  }}
                  className="px-6 py-2 rounded-lg border border-[#c5c6d2] bg-white hover:bg-slate-50 text-[#00113a] font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MODAL EDIT DATA PEGAWAI ---------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-[#00113a]">
                Edit Data Pegawai
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-left">
              {/* Foto Profil Preview & URL */}
              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {editForm.avatarUrl ? (
                      <img src={editForm.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400 m-auto" />
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto Baru</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                    <input
                      type="url"
                      value={editForm.avatarUrl || ''}
                      onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                      placeholder="Atau masukkan URL foto"
                      className="w-full rounded border border-[#c5c6d2] px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value, fullName: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Nomor Induk Pegawai (NIP)
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nip || ''}
                    onChange={(e) => setEditForm({ ...editForm, nip: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Email Kedinasan
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Nomor Seluler
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Alamat Domisili
                  </label>
                  <input
                    type="text"
                    value={editForm.alamatDomisili || ''}
                    onChange={(e) => setEditForm({ ...editForm, alamatDomisili: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    value={editForm.tanggalLahir || ''}
                    onChange={(e) => setEditForm({ ...editForm, tanggalLahir: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Jabatan Saat Ini
                  </label>
                  <input
                    type="text"
                    value={editForm.position || ''}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Satuan Kerja
                  </label>
                  <input
                    type="text"
                    value={editForm.satuanKerja || ''}
                    onChange={(e) => setEditForm({ ...editForm, satuanKerja: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Unit Eselon II
                  </label>
                  <input
                    type="text"
                    value={editForm.eselon2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, eselon2: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Unit Eselon III
                  </label>
                  <input
                    type="text"
                    value={editForm.eselon3 || ''}
                    onChange={(e) => setEditForm({ ...editForm, eselon3: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#00113a] mb-1">
                    Lokasi Kerja
                  </label>
                  <input
                    type="text"
                    value={editForm.lokasiKerja || ''}
                    onChange={(e) => setEditForm({ ...editForm, lokasiKerja: e.target.value })}
                    className="w-full rounded border border-[#c5c6d2] px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00113a]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-[#002366] hover:bg-[#00113a] text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

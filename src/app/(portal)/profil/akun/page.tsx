'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Edit,
  Info,
  Briefcase,
  User,
  BadgeAlert,
  History,
  Settings,
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Cake,
  GraduationCap,
  Award,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Camera,
  Shield,
  Upload,
  ChevronDown,
  Check
} from 'lucide-react';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatBirthDate, getInitials } from '@/lib/utils';

export default function ProfilPegawaiPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [isSatuanKerjaDropdownOpen, setIsSatuanKerjaDropdownOpen] = useState(false);
  const satuanKerjaDropdownRef = useRef<HTMLDivElement>(null);
  const SATUAN_KERJA_OPTIONS = ['Sistem Informasi', 'Pusat Data dan Informasi'];
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info-akun' | 'ubah-kata-sandi'>('info-akun');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchProfile = () => {
    fetch('/api/profile/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const u = data.data;
          setProfile(u);
          let bd = '';
          if (u.profile?.birthDate) {
            const raw = new Date(u.profile.birthDate);
            if (!isNaN(raw.getTime())) {
              bd = raw.toISOString().split('T')[0];
            }
          }

          setEditForm({
            name: u.name,
            fullName: u.profile?.fullName || u.name,
            nip: u.nip,
            email: u.email,
            phone: u.profile?.phone || '',
            alamatDomisili: u.profile?.bio || '',
            tanggalLahir: bd,
            position: u.profile?.position || 'Pustakawan Ahli Madya',
            satuanKerja: u.profile?.unitKerja || 'Pusat Data dan Informasi',
            eselon2: 'Pusat Pengembangan Perpustakaan Sekolah/Madrasah dan Perguruan Tinggi',
            eselon3: 'Bidang Layanan Informasi & Automasi Perpustakaan',
            lokasiKerja: 'Gedung Fasilitas Layanan Perpusnas, Jl. Medan Merdeka Selatan No. 11',
            avatarUrl: u.profile?.avatarUrl || ''
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (satuanKerjaDropdownRef.current && !satuanKerjaDropdownRef.current.contains(event.target as Node)) {
        setIsSatuanKerjaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert('File foto harus berformat .jpg atau .png');
        e.target.value = '';
        return;
      }
      setAvatarFile(file);
      // Create local preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditForm({ ...editForm, avatarUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setStatusMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        setStatusMessage({ type: 'error', text: 'Sandi baru minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.' });
        return;
      }
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          phone: editForm.phone,
          bio: editForm.alamatDomisili,
          birthDate: editForm.tanggalLahir || undefined,
          avatarUrl: editForm.avatarUrl,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Data profil berhasil diperbarui!' });
        setIsEditModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchProfile();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (e) {
      console.error(e);
      setStatusMessage({ type: 'error', text: 'Terjadi gangguan jaringan.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="h-6 rounded bg-slate-200 w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <CardSkeleton />
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const p = profile?.profile;
  const displayName = p?.fullName || profile?.name || 'Budi Santoso, S.IP., M.Si.';
  const displayNip = profile?.nip || '198012052005011002';
  const displayPosition = p?.position || 'Pustakawan Ahli Madya';
  const displayUnitKerja = p?.unitKerja || 'Pusat Jasa Informasi Perpustakaan dan Pengelolaan Naskah Nusantara';
  const displayEmail = profile?.email || 'budi.santoso@perpusnas.go.id';
  const displayPhone = p?.phone || '+62 812 3456 7890';
  const displayAddress = p?.bio || 'Jl. Salemba Raya No.28A, RT.5/RW.6, Kenari, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10430';
  const displayBirthDate = formatBirthDate(p?.birthDate, profile?.nip);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-slate-500">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <Link href="/beranda" className="hover:text-institutional-navy transition-colors">
              Beranda
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
            <span className="text-slate-500">Profil</span>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
            <span className="text-institutional-navy font-bold">
              {activeTab === 'info-akun' ? 'Info Akun' : 'Ubah Kata Sandi'}
            </span>
          </li>
        </ol>
      </nav>

      {/* Notification Toast / Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar / Navigation */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-5">
          {/* User Quick Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E9ECEF] flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative mb-4">
              <div 
                className="group relative w-32 h-32 shrink-0 aspect-square rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center cursor-pointer" 
                onClick={() => setPreviewImage(p?.avatarUrl || '/images/avatar-budi-santoso.jpg')}
              >
                <img
                  src={p?.avatarUrl || '/images/avatar-budi-santoso.jpg'}
                  alt={displayName}
                  className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-110 group-hover:blur-[1px]"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold text-center px-4 leading-tight shadow-sm">Lihat Ukuran Penuh</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 bg-institutional-navy text-white p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all hover:scale-105"
                title="Ubah Foto Profil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-1">
              {displayName.split(',')[0]}
            </h2>
            <p className="text-xs font-mono font-semibold text-slate-500">{displayNip}</p>
            <p className="text-xs font-bold text-institutional-navy mt-3 bg-blue-50/80 border border-blue-100 px-3.5 py-1.5 rounded-full inline-block">
              {displayPosition}
            </p>
          </div>

          {/* Navigation Menu List */}
          <nav className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden">
            <ul className="flex flex-col divide-y divide-slate-100">
              <li>
                <button
                  onClick={() => setActiveTab('info-akun')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                    activeTab === 'info-akun'
                      ? 'bg-blue-50/80 text-institutional-navy font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <User className={`w-4 h-4 ${activeTab === 'info-akun' ? 'text-institutional-navy' : 'text-slate-500'}`} />
                  <span className={activeTab === 'info-akun' ? 'border-b-2 border-institutional-navy pb-0.5 inline-block' : ''}>Info Akun</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ubah-kata-sandi')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                    activeTab === 'ubah-kata-sandi'
                      ? 'bg-blue-50/80 text-institutional-navy font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Settings className={`w-4 h-4 ${activeTab === 'ubah-kata-sandi' ? 'text-institutional-navy' : 'text-slate-500'}`} />
                  <span className={activeTab === 'ubah-kata-sandi' ? 'border-b-2 border-institutional-navy pb-0.5 inline-block' : ''}>Ubah Kata Sandi</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Right Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {activeTab === 'info-akun' && (
            <>
              {/* Information Card 1: Data Pribadi */}
              <section className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E9ECEF]">
                  <h3 className="text-xl font-extrabold text-institutional-navy flex items-center gap-2.5">
                    <Info className="w-5 h-5 text-institutional-navy" />
                    Data Pribadi
                  </h3>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-institutional-navy hover:text-blue-700 font-bold text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50/70 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</p>
                    <p className="text-slate-900 font-bold text-base">{displayName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nomor Induk Pegawai (NIP)</p>
                    <p className="text-slate-800 font-mono font-medium">{displayNip}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Kedinasan</p>
                    <p className="text-slate-800 font-medium">{displayEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nomor Telepon</p>
                    <p className="text-slate-800 font-medium">{displayPhone}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alamat Domisili</p>
                    <p className="text-slate-800 leading-relaxed font-normal">{displayAddress}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Cake className="w-3.5 h-3.5 text-rose-500" /> Tanggal Lahir
                    </p>
                    <p className="text-slate-900 font-bold">{displayBirthDate}</p>
                  </div>
                </div>
              </section>

              {/* Information Card 2: Unit Kerja */}
              <section className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E9ECEF]">
                  <h3 className="text-xl font-extrabold text-institutional-navy flex items-center gap-2.5">
                    <Briefcase className="w-5 h-5 text-institutional-navy" />
                    Unit Kerja
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Satuan Kerja</p>
                    <p className="text-slate-900 font-bold text-base">{p?.unitKerja || 'Pusat Data dan Informasi'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Eselon II</p>
                    <p className="text-slate-800 leading-snug">{displayUnitKerja}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jabatan Saat Ini</p>
                    <p className="text-slate-800 leading-snug">{displayPosition}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Eselon III</p>
                    <p className="text-slate-800 leading-snug">Bidang Layanan Informasi & Automasi Perpustakaan</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Kerja</p>
                    <p className="text-slate-800 leading-snug">Gedung Fasilitas Layanan Perpusnas, Jl. Medan Merdeka Selatan No. 11</p>
                  </div>
                </div>
              </section>
            </>
          )}



          {activeTab === 'ubah-kata-sandi' && (
            <section className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E9ECEF]">
                <h3 className="text-xl font-extrabold text-institutional-navy flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-institutional-navy" />
                  Ubah Kata Sandi
                </h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <Input
                  label="Sandi Lama"
                  type="password"
                  placeholder="Masukkan sandi saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="space-y-1">
                  <Input
                    label="Sandi Baru"
                    type="password"
                    placeholder="Masukkan Sandi Baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword.length > 0 && (
                    <div className="pt-1 pb-2 space-y-1.5 text-[11px] font-medium px-1">
                      <div className={`flex items-center gap-1.5 ${/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Menggunakan Huruf Kecil dan Huruf Besar</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${/^(?=.*\d).+$/.test(newPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Menggunakan Angka</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Minimal 8 karakter</span>
                      </div>
                    </div>
                  )}
                </div>
                <Input
                  label="Konfirmasi Sandi Baru"
                  type="password"
                  placeholder="Ulangi sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="pt-2">
                  <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="font-bold">
                    <Save className="w-4 h-4" /> Simpan Kata Sandi
                  </Button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>

      {/* ---------------- MODAL EDIT DATA PEGAWAI ---------------- */}
      {isEditModalOpen && typeof document !== 'undefined' ? createPortal(
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
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-left">
              {/* Foto Profil Preview & URL */}
              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4">
                  <div 
                    className={`group relative w-16 h-16 aspect-square rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center ${editForm.avatarUrl ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (editForm.avatarUrl) {
                        setPreviewImage(editForm.avatarUrl);
                      }
                    }}
                  >
                    {editForm.avatarUrl ? (
                      <>
                        <img src={editForm.avatarUrl} alt="Preview" className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-110 group-hover:blur-[1px]" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-[8px] font-bold text-center px-1 leading-tight">Lihat Ukuran Penuh</span>
                        </div>
                      </>
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto Baru</span>
                      <input type="file" accept=".jpg,.jpeg,.png" onChange={handleAvatarFile} className="hidden" suppressHydrationWarning />
                    </label>
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
                    value={editForm.fullName || editForm.name || ''}
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
                    type="date"
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

                <div className="relative" ref={satuanKerjaDropdownRef}><label className="block text-xs font-bold text-[#00113a] mb-1">
                    Satuan Kerja
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSatuanKerjaDropdownOpen(!isSatuanKerjaDropdownOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#5b6b82] text-white text-xs font-bold rounded-xl hover:bg-[#485568] transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="truncate pr-2">{editForm.satuanKerja || 'Pilih Satuan Kerja'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isSatuanKerjaDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSatuanKerjaDropdownOpen && (
                    <div className="absolute left-0 w-full mt-1 bg-white border border-[#c5c6d2] rounded-xl shadow-lg overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {SATUAN_KERJA_OPTIONS.map((item) => {
                        const isSelected = editForm.satuanKerja === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setEditForm({ ...editForm, satuanKerja: item });
                              setIsSatuanKerjaDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-slate-100 text-[#00113a] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{item}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
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
      , document.body) : null}
    
      {/* Lightbox Preview */}
      {previewImage && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 sm:-right-12 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain border border-white/20"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
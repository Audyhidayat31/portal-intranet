'use client';

import React, { useState, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatBirthDate, getInitials } from '@/lib/utils';

export default function ProfilPegawaiPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info-akun' | 'kepegawaian' | 'riwayat-pekerjaan' | 'pengaturan-privasi'>('info-akun');
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
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
          setPhone(u.profile?.phone || '');
          setBio(u.profile?.bio || '');
          setEducation(u.profile?.education || '');

          if (u.profile?.birthDate) {
            const raw = new Date(u.profile.birthDate);
            if (!isNaN(raw.getTime())) {
              setBirthDateInput(raw.toISOString().split('T')[0]);
            }
          } else if (u.nip && u.nip.length >= 8) {
            const y = u.nip.substring(0, 4);
            const m = u.nip.substring(4, 6);
            const d = u.nip.substring(6, 8);
            if (parseInt(y) > 1900 && parseInt(m) <= 12 && parseInt(d) <= 31) {
              setBirthDateInput(`${y}-${m}-${d}`);
            }
          }
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          bio,
          education,
          birthDate: birthDateInput || undefined,
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
  const displayBirthDate = formatBirthDate(p?.birthDate || birthDateInput, profile?.nip);

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
            <span className="text-institutional-navy font-bold">Info Akun</span>
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
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center">
                <img
                  src={p?.avatarUrl || '/images/avatar-budi-santoso.jpg'}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
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
                      ? 'bg-blue-50/80 border-l-4 border-institutional-navy text-institutional-navy font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4 text-institutional-navy" />
                  <span>Info Akun</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('kepegawaian')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                    activeTab === 'kepegawaian'
                      ? 'bg-blue-50/80 border-l-4 border-institutional-navy text-institutional-navy font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Kepegawaian</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('riwayat-pekerjaan')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                    activeTab === 'riwayat-pekerjaan'
                      ? 'bg-blue-50/80 border-l-4 border-institutional-navy text-institutional-navy font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Riwayat Pekerjaan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pengaturan-privasi')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                    activeTab === 'pengaturan-privasi'
                      ? 'bg-blue-50/80 border-l-4 border-institutional-navy text-institutional-navy font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Pengaturan Privasi</span>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jabatan Saat Ini</p>
                    <p className="text-slate-900 font-bold text-base">{displayPosition}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Eselon II</p>
                    <p className="text-slate-800 leading-snug">{displayUnitKerja}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Eselon III</p>
                    <p className="text-slate-800 leading-snug">Bidang Layanan Informasi & Automasi Perpustakaan</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Kerja</p>
                    <p className="text-slate-800 leading-snug">Gedung Fasilitas Layanan Perpusnas, Jl. Medan Merdeka Selatan No. 11</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'kepegawaian' && (
            <section className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E9ECEF]">
                <h3 className="text-xl font-extrabold text-institutional-navy flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-institutional-navy" />
                  Status Kepegawaian & Pendidikan
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">Golongan / Ruang</p>
                  <p className="text-base font-bold text-slate-900 mt-1">{p?.golRuang || 'IV/a - Pembina'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">Status Kepegawaian</p>
                  <p className="text-base font-bold text-emerald-700 mt-1">PNS Aktif (Perpusnas RI)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-institutional-navy" /> Riwayat Pendidikan Terakhir
                  </p>
                  <p className="text-slate-800 font-medium mt-1">
                    {p?.education || 'S2 Ilmu Perpustakaan dan Informasi — Universitas Indonesia'}
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'riwayat-pekerjaan' && (
            <section className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E9ECEF]">
                <h3 className="text-xl font-extrabold text-institutional-navy flex items-center gap-2.5">
                  <History className="w-5 h-5 text-institutional-navy" />
                  Riwayat Pekerjaan & Penugasan
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-institutional-navy">2020 - Sekarang</span>
                  <h4 className="text-sm font-bold text-slate-900">Pustakawan Ahli Madya</h4>
                  <p className="text-xs text-slate-600">Pusat Jasa Informasi Perpustakaan dan Pengelolaan Naskah Nusantara</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-institutional-navy">2014 - 2020</span>
                  <h4 className="text-sm font-bold text-slate-900">Pustakawan Ahli Muda</h4>
                  <p className="text-xs text-slate-600">Direktorat Deposit dan Pengembangan Koleksi Bahan Pustaka</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-institutional-navy">2005 - 2014</span>
                  <h4 className="text-sm font-bold text-slate-900">Pranata Komputer Pertama</h4>
                  <p className="text-xs text-slate-600">Pusat Data dan Informasi (Pusdatin)</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'pengaturan-privasi' && (
            <section className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E9ECEF]">
                <h3 className="text-xl font-extrabold text-institutional-navy flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-institutional-navy" />
                  Pengaturan Keamanan & Sandi
                </h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <Input
                  label="Password Lama"
                  type="password"
                  placeholder="Masukkan password saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  label="Password Baru"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Konfirmasi Password Baru"
                  type="password"
                  placeholder="Ulangi password baru"
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

      {/* Edit Data Pribadi Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Ubah Data Pribadi & Biodata"
          maxWidth="md"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Nomor Telepon / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812..."
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-institutional-navy" /> Tanggal Lahir Pegawai
              </label>
              <input
                type="date"
                value={birthDateInput}
                onChange={(e) => setBirthDateInput(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:border-institutional-navy focus:outline-none shadow-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Format saat ini: {displayBirthDate}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Alamat Domisili / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-institutional-navy focus:outline-none shadow-sm"
                placeholder="Jl. Salemba Raya No. 28A..."
              />
            </div>

            <Input
              label="Riwayat Pendidikan Terakhir"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="S2 Ilmu Perpustakaan..."
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSaving} className="font-bold">
                <Save className="w-4 h-4" /> Simpan
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}


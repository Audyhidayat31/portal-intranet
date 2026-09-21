'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  User,
  Upload,
  CheckCircle,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { LIST_UNIT_KERJA } from '@/lib/mock-employees';

export default function TambahPegawaiPage() {
  const router = useRouter();

  // Form states
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [unitKerja, setUnitKerja] = useState(LIST_UNIT_KERJA[1] || 'Pusat Data dan Informasi');
  const [golRuang, setGolRuang] = useState('III/a - Penata Muda');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [education, setEducation] = useState('');
  const [careerHistory, setCareerHistory] = useState('');
  const [achievements, setAchievements] = useState('');
  const [bio, setBio] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nama.trim()) {
      setErrorMsg('Nama lengkap pegawai wajib diisi');
      return;
    }

    if (!nip.trim()) {
      setErrorMsg('NIP pegawai wajib diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: nama.trim(),
        nip: nip.trim(),
        position: jabatan.trim() || 'Pegawai Perpusnas RI',
        unitKerja,
        golRuang,
        email: email.trim() || `${nip.trim()}@perpusnas.go.id`,
        phone: phone.trim(),
        avatarUrl: avatarPreview || avatarUrl || '',
        education: education.trim(),
        careerHistory: careerHistory.trim(),
        achievements: achievements.trim(),
        bio: bio.trim(),
      };

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Data pegawai berhasil ditambahkan!');
        setTimeout(() => {
          router.push('/antar-pegawai/daftar-pegawai');
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan data pegawai.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#444650] flex items-center gap-2">
          <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span>
            Antar Pegawai
          </span>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <Link href="/antar-pegawai/daftar-pegawai" className="hover:text-[#00113a] transition-colors">
            Daftar Pegawai
          </Link>
          <ChevronRight className="w-4 h-4 text-[#757682]" />
          <span className="text-[#00113a] font-semibold">Tambah Pegawai</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#00113a] tracking-tight">
              Tambah Data Pegawai
            </h1>
            <p className="text-sm text-[#444650] mt-1">
              Masukkan data dan profil pegawai baru ke dalam direktori internal Perpusnas RI.
            </p>
          </div>

          <Link
            href="/antar-pegawai/daftar-pegawai"
            className="flex items-center gap-2 text-xs font-bold text-[#002366] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
          </Link>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm font-semibold animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-sm font-semibold animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-[#c5c6d2] rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto Profil */}
            <div>
              <label className="block text-xs font-bold text-[#00113a] uppercase tracking-wider mb-2">
                Foto Profil Pegawai
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>

                <div className="flex-grow space-y-3 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="bg-[#002366] hover:bg-[#00113a] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Pilih Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-slate-500">atau masukkan URL gambar di bawah</span>
                  </div>

                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => {
                      setAvatarUrl(e.target.value);
                      setAvatarPreview(e.target.value || null);
                    }}
                    placeholder="https://images.unsplash.com/... atau URL foto"
                    className="w-full border border-[#c5c6d2] rounded-lg py-2 px-3 text-xs bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a]"
                  />
                  <p className="text-[11px] text-slate-400">
                    Format disarankan JPG/PNG rasio potret 4:5. Ukuran maksimal 2MB.
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Identitas Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Nama Lengkap (beserta Gelar) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Budi Sujatmiko, S.Kom., M.T.I."
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Nomor Induk Pegawai (NIP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 199012272015011001"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>
            </div>

            {/* Jabatan & Unit Kerja */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Jabatan / Posisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Kepala Sistem Informasi"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Unit Kerja / Direktorat <span className="text-red-500">*</span>
                </label>
                <select
                  value={unitKerja}
                  onChange={(e) => setUnitKerja(e.target.value)}
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                >
                  {LIST_UNIT_KERJA.filter((u) => u !== 'Semua Unit Kerja').map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Golongan / Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Pangkat / Golongan Ruang
                </label>
                <input
                  type="text"
                  value={golRuang}
                  onChange={(e) => setGolRuang(e.target.value)}
                  placeholder="Contoh: IV/a - Pembina"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Email Kedinasan
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi.sujatmiko@perpusnas.go.id"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5">
                  Nomor Kontak / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Riwayat Pendidikan & Karir */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#002366]" />
                  Riwayat Pendidikan
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Contoh: S2 Magister Teknologi Informasi Universitas Indonesia"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#002366]" />
                  Riwayat Jabatan & Karir
                </label>
                <textarea
                  rows={2}
                  value={careerHistory}
                  onChange={(e) => setCareerHistory(e.target.value)}
                  placeholder="Contoh: Staf IT (2015-2019), Kasubbag Infrastruktur (2019-2023), Kepala Sistem Informasi (2023-Sekarang)"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  Prestasi & Penghargaan
                </label>
                <input
                  type="text"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Contoh: Inovator Layanan Cloud Perpusnas RI 2024"
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#00113a] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  Biografi Singkat / Motto Kerja
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Deskripsi singkat mengenai pegawai, visi profesional, atau kutipan dedikasi kerja..."
                  className="w-full border border-[#c5c6d2] rounded-lg py-2.5 px-3.5 text-sm bg-white text-[#1a1b20] focus:outline-none focus:border-[#00113a]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/antar-pegawai/daftar-pegawai"
                className="px-5 py-2.5 rounded-lg border border-[#c5c6d2] text-xs font-bold text-[#444650] hover:bg-slate-100 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-[#002366] hover:bg-[#00113a] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Data Pegawai</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}


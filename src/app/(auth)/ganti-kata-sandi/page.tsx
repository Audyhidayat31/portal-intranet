'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Check, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

function GantiKataSandiContent() {
  const searchParams = useSearchParams();
  const isSuccessParam = searchParams.get('success') === 'true';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(isSuccessParam);
  const [targetAccount, setTargetAccount] = useState('198501152010011001');

  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmInputRef = useRef<HTMLInputElement>(null);

  const isModalVisible = showSuccessModal || isSuccessParam;

  useEffect(() => {
    const isSuccess = searchParams.get('success') === 'true';
    if (isSuccess) {
      setShowSuccessModal(true);
    }
    const nipParam = searchParams.get('nip');
    const emailParam = searchParams.get('email');
    if (nipParam) {
      setTargetAccount(nipParam);
    } else if (emailParam) {
      setTargetAccount(emailParam);
    } else if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('target_reset_identifier');
      if (stored) setTargetAccount(stored);
    }
  }, [searchParams]);

  // Validation criteria - identical to Ubah Kata Sandi profil pegawai
  const hasUpperAndLower = /^(?=.*[a-z])(?=.*[A-Z]).+$/.test(newPassword);
  const hasNumber = /^(?=.*\d).+$/.test(newPassword);
  const isLengthValid = newPassword.length >= 8;

  // Sync custom validity for password confirmation
  useEffect(() => {
    if (confirmInputRef.current) {
      if (confirmPassword && newPassword && confirmPassword !== newPassword) {
        confirmInputRef.current.setCustomValidity('Kata sandi harus sama.');
      } else {
        confirmInputRef.current.setCustomValidity('');
      }
    }
  }, [confirmPassword, newPassword]);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    newPasswordInputRef.current?.setCustomValidity('');
    if (confirmInputRef.current) {
      if (confirmPassword && val && confirmPassword !== val) {
        confirmInputRef.current.setCustomValidity('Kata sandi harus sama.');
      } else {
        confirmInputRef.current.setCustomValidity('');
      }
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (val && newPassword && val !== newPassword) {
      e.target.setCustomValidity('Kata sandi harus sama.');
    } else {
      e.target.setCustomValidity('');
    }
  };

  const handleConfirmBlur = () => {
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      confirmInputRef.current?.setCustomValidity('Kata sandi harus sama.');
      confirmInputRef.current?.reportValidity();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword) {
      newPasswordInputRef.current?.setCustomValidity('Harap isi bidang ini.');
      newPasswordInputRef.current?.reportValidity();
      return;
    }

    if (!hasUpperAndLower) {
      newPasswordInputRef.current?.setCustomValidity('Kata sandi harus menggunakan kombinasi huruf besar dan kecil.');
      newPasswordInputRef.current?.reportValidity();
      return;
    }

    if (!hasNumber) {
      newPasswordInputRef.current?.setCustomValidity('Kata sandi harus menggunakan angka.');
      newPasswordInputRef.current?.reportValidity();
      return;
    }

    if (!isLengthValid) {
      newPasswordInputRef.current?.setCustomValidity('Kata sandi minimal 8 karakter.');
      newPasswordInputRef.current?.reportValidity();
      return;
    }

    if (!confirmPassword) {
      confirmInputRef.current?.setCustomValidity('Harap isi bidang ini.');
      confirmInputRef.current?.reportValidity();
      return;
    }

    if (newPassword !== confirmPassword) {
      confirmInputRef.current?.setCustomValidity('Kata sandi harus sama.');
      confirmInputRef.current?.reportValidity();
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          identifier: targetAccount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Gagal memperbarui kata sandi di server.');
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(`last_updated_password_${targetAccount}`, newPassword);
      }

      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kendala jaringan saat menghubungkan ke server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#191c1d] min-h-screen flex flex-col justify-between selection:bg-[#007BFF] selection:text-white">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-5">
        {/* Large Rounded Card Matching Wireframe */}
        <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-black/80 sm:border-black w-full max-w-[1200px] py-8 sm:py-12 md:py-14 px-4 sm:px-10 flex flex-col items-center justify-center relative shadow-[0_2px_8px_rgba(0,0,0,0.03)] min-h-[560px]">
          
          {isModalVisible ? (
            /* Berhasil Ganti Kata Sandi View */
            <div className="w-full max-w-[480px] py-8 sm:py-10 flex flex-col items-center justify-center text-center animate-fadeIn">
              {/* Big Green Circle Checkmark */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#22c55e] flex items-center justify-center mb-7 shadow-xs">
                <Check className="w-16 h-16 sm:w-18 sm:h-18 text-white stroke-[3.5]" />
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-black mb-6 tracking-tight">
                Kata Sandi anda berhasil diperbarui
              </h2>

              {/* Action Button: Kembali ke Halaman Utama */}
              <Link
                href="/login"
                className="w-full max-w-[270px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm text-white bg-[#007BFF] hover:bg-[#0069d9] active:bg-[#005cbf] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#007BFF] transition-all shadow-xs text-center inline-block"
              >
                Kembali ke Halaman Utama
              </Link>
            </div>
          ) : (
            /* Form State */
            <div className="w-full max-w-[340px] sm:max-w-[350px] flex flex-col items-center text-center">
              {/* Centered Perpusnas Star Logo */}
              <img
                src="/images/logo-perpusnas.png"
                alt="Logo Perpustakaan Nasional RI"
                className="h-14 sm:h-16 w-auto object-contain shrink-0 mb-3.5"
              />

              {/* Title & Subtitle as per Wireframe */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-black tracking-tight mb-1">
                Ganti Kata Sandi
              </h1>
              <p className="text-sm sm:text-base text-[#222] font-normal mb-5 sm:mb-6">
                Ubah kata sandi anda
              </p>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="w-full mb-3.5 flex items-start gap-2 p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs text-left animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
                {/* Field 1: Kata sandi baru */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs sm:text-sm font-normal text-black mb-1"
                  >
                    Kata sandi baru
                  </label>
                  <div className="relative">
                    <input
                      ref={newPasswordInputRef}
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      placeholder="Masukkan kata sandi baru.."
                      className="block w-full pl-3 pr-9 py-2 border border-neutral-400 rounded-[3px] sm:rounded-md text-sm text-black placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-1 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                      title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Rules kata sandi baru (sama persis seperti Ubah Kata Sandi profil pegawai) */}
                  {newPassword.length > 0 && (
                    <div className="pt-1.5 pb-0.5 space-y-1.5 text-[11px] sm:text-xs font-medium px-1 animate-fadeIn">
                      <div className={`flex items-center gap-1.5 ${hasUpperAndLower ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Menggunakan Huruf Kecil dan Huruf Besar</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Menggunakan Angka</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Minimal 8 karakter</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 2: Tulis Ulang Kata sandi baru */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs sm:text-sm font-normal text-black mb-1"
                  >
                    Tulis Ulang Kata sandi baru
                  </label>
                  <div className="relative">
                    <input
                      ref={confirmInputRef}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={handleConfirmChange}
                      onBlur={handleConfirmBlur}
                      placeholder="Ketik ulang kata sandi baru.."
                      className="block w-full pl-3 pr-9 py-2 border border-neutral-400 rounded-[3px] sm:rounded-md text-sm text-black placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-1 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                      title={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Simpan Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-md font-semibold text-sm text-white bg-[#007BFF] hover:bg-[#0069d9] active:bg-[#005cbf] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-1 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </div>
                    ) : (
                      'Simpan'
                    )}
                  </button>
                </div>

                {/* Back to Login Link */}
                <div className="pt-2 text-center flex justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-[#007BFF] font-medium transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Utama</span>
                  </Link>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Footer Matching Wireframe */}
      <footer className="w-full mt-auto bg-[#f4f5f7] border-t border-slate-200/80 py-3 sm:py-3.5 text-center text-xs text-slate-500 font-normal">
        Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.
      </footer>
    </div>
  );
}

export default function GantiKataSandiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GantiKataSandiContent />
    </Suspense>
  );
}



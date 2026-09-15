'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import RecaptchaMock from '@/components/auth/RecaptchaMock';

export default function LupaKataSandiPage() {
  const [email, setEmail] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [confirmationUrl, setConfirmationUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (!isCaptchaVerified) {
      setErrorMessage('Silakan selesaikan verifikasi reCAPTCHA ("I\'m not a robot") terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      // Store in session storage for autofill on ganti-kata-sandi
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('target_reset_identifier', email.trim());
      }

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Gagal mengirim tautan pemulihan kata sandi.');
        setIsLoading(false);
        return;
      }

      if (data.data?.resetUrl) {
        setResetUrl(data.data.resetUrl);
      } else {
        setResetUrl(`/ganti-kata-sandi?email=${encodeURIComponent(email.trim())}`);
      }

      if (data.data?.confirmationUrl) {
        setConfirmationUrl(data.data.confirmationUrl);
      } else {
        setConfirmationUrl(`/email-konfirmasi?email=${encodeURIComponent(email.trim())}`);
      }

      setIsLoading(false);
      setIsSent(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kendala jaringan saat menghubungkan ke server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#191c1d] min-h-screen flex flex-col justify-between selection:bg-[#007BFF] selection:text-white p-3 sm:p-5">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center">
        {/* Large Rounded Card Matching Wireframe */}
        <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-black/80 sm:border-black w-full max-w-[1200px] py-8 sm:py-12 md:py-14 px-4 sm:px-10 flex flex-col items-center justify-center relative shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          
          <div className="w-full max-w-[340px] sm:max-w-[350px] flex flex-col items-center text-center">
            {/* Centered Perpusnas Star Logo */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative mb-3.5 shrink-0 flex items-center justify-center">
              <img
                src="/images/logo-perpusnas.png"
                alt="Logo Perpustakaan Nasional RI"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title & Subtitle as per Wireframe */}
            <h1 className="text-2xl sm:text-[28px] font-bold text-black tracking-tight mb-1">
              Lupa Kata Sandi
            </h1>
            <p className="text-sm sm:text-base text-[#222] font-normal mb-5 sm:mb-6">
              Masukkan Email untuk menerima tautan
            </p>

            {/* Error Message */}
            {errorMessage && (
              <div className="w-full mb-3.5 flex items-start gap-2 p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs text-left animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success State */}
            {isSent ? (
              <div className="w-full p-4 sm:p-5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-center animate-fadeIn space-y-2.5">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-900">
                    Tautan Pemulihan Terkirim!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Instruksi pemulihan kata sandi telah dikirimkan ke <strong>{email}</strong>.
                  </p>
                </div>
                <div className="pt-1 flex flex-col gap-2">
                  <Link
                    href={confirmationUrl || `/email-konfirmasi?email=${encodeURIComponent(email)}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded font-semibold text-xs text-white bg-[#007BFF] hover:bg-[#0069d9] transition-colors shadow-2xs"
                  >
                    <span>Buka Email Konfirmasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={resetUrl || `/ganti-kata-sandi?email=${encodeURIComponent(email)}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded font-medium text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <span>Lanjut ke Halaman Ganti Kata Sandi</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setEmail('');
                      setIsCaptchaVerified(false);
                      setErrorMessage('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-normal"
                  >
                    Kirim ke email lain
                  </button>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1 text-xs text-slate-600 hover:text-[#007BFF] font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Utama</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-normal text-black mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email Anda.."
                    className="block w-full px-3 py-2 border border-neutral-400 rounded-[3px] sm:rounded-md text-sm text-black placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-1 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                  />
                </div>

                {/* reCAPTCHA Widget */}
                <div className="pt-0.5 flex justify-center">
                  <RecaptchaMock
                    verified={isCaptchaVerified}
                    onVerifyChange={(v) => {
                      setIsCaptchaVerified(v);
                      if (v && errorMessage.includes('reCAPTCHA')) {
                        setErrorMessage('');
                      }
                    }}
                    hasError={Boolean(errorMessage && !isCaptchaVerified)}
                    className="w-full"
                  />
                </div>

                {/* Kirim Button */}
                <div className="pt-0.5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-md font-semibold text-sm text-white bg-[#007BFF] hover:bg-[#0069d9] active:bg-[#005cbf] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-offset-1 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim...</span>
                      </div>
                    ) : (
                      'Kirim'
                    )}
                  </button>
                </div>

                {/* Kembali ke Halaman Utama Link */}
                <div className="pt-1.5 text-center">
                  <Link
                    href="/login"
                    className="text-xs sm:text-sm text-black hover:text-[#007BFF] transition-colors inline-block"
                  >
                    Kembali ke Halaman Utama
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Matching Wireframe */}
      <footer className="pt-2 pb-1 text-center text-xs sm:text-sm text-black font-normal">
        © Copyright 2026, All Rights Reserved | Perpustakaan Nasional RI.
      </footer>
    </div>
  );
}

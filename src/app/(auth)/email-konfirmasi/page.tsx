'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function EmailKonfirmasiContent() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name') || 'Budi Sujatmiko';
  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  // Construct target link for reset password
  const resetQuery = new URLSearchParams();
  if (emailParam) resetQuery.set('email', emailParam);
  if (tokenParam) resetQuery.set('token', tokenParam);
  const resetLink = `/ganti-kata-sandi${resetQuery.toString() ? `?${resetQuery.toString()}` : ''}`;

  return (
    <div className="bg-white text-[#191c1d] min-h-screen flex flex-col justify-between selection:bg-[#007BFF] selection:text-white">
      {/* Top Header Banner Matching Wireframe */}
      <header className="w-full bg-[#3898ec] py-6 sm:py-8 px-4 flex items-center justify-center shadow-xs">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0 flex items-center justify-center">
            <img
              src="/images/logo-perpusnas.png"
              alt="Logo Perpustakaan Nasional RI"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>
          <span className="font-bold text-2xl sm:text-3xl text-black tracking-tight leading-none">
            Cakrawala
          </span>
        </div>
      </header>

      {/* Main Email Body Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16 max-w-xl mx-auto text-center w-full">
        {/* Salutation */}
        <p className="text-sm sm:text-base font-normal text-black mb-6">
          Hai {nameParam},
        </p>

        {/* Message */}
        <p className="text-sm sm:text-base font-normal text-black max-w-[480px] leading-relaxed mb-8">
          Kami telah menerima permintaan Anda untuk mengatur ulang kata sandi akun Cakrawala Portal Intranet anda. Silahkan konfirmasi dengan klik tombol di bawah ini.,
        </p>

        {/* Action Button */}
        <div className="mb-8">
          <Link
            href={resetLink}
            className="inline-block py-2.5 px-6 rounded-lg font-semibold text-sm sm:text-base text-white bg-[#007BFF] hover:bg-[#0069d9] active:bg-[#005cbf] transition-all shadow-xs"
          >
            Atur Ulang Kata Sandi
          </Link>
        </div>

        {/* Disclaimer & Contact */}
        <p className="text-xs sm:text-sm font-normal text-black max-w-[460px] leading-relaxed">
          Abaikan email ini jika anda tidak pernah meminta untuk atur ulang kata sandi. Untuk pertanyaan, silakan hubungi kami di{' '}
          <a
            href="mailto:persuratan@perpusnas.go.id"
            className="hover:underline font-normal text-black"
          >
            persuratan@perpusnas.go.id
          </a>
        </p>
      </main>

      {/* Bottom Footer Bar Matching Wireframe */}
      <footer className="w-full bg-[#f4f5f7] border-t border-slate-200/80 py-3.5 px-4 text-center text-xs sm:text-sm text-[#444] font-normal">
        © Hak Cipta 2026, Perpustakaan Nasional Republik Indonesia.
      </footer>
    </div>
  );
}

export default function EmailKonfirmasiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EmailKonfirmasiContent />
    </Suspense>
  );
}


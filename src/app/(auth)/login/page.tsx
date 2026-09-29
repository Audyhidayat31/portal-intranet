'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
export default function LoginPage() {
  const router = useRouter();
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDemoAcc, setShowDemoAcc] = useState(false);

  const [infoPenting, setInfoPenting] = useState<{
    headline: string;
    subheadline: string;
    status: string;
  }>({
    headline: 'Pemberitahuan',
    subheadline:
      'Diberitahukan kepada seluruh pegawai bahwa sistem portal intranet akan menjalani sinkronisasi berkala pada hari Jumat pukul 17.00 WIB. Pastikan pekerjaan Anda telah tersimpan.',
    status: 'AKTIF',
  });

  useEffect(() => {
    fetch('/api/info-penting')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setInfoPenting(data.data);
        }
      })
      .catch((err) => console.error('Failed to load info penting:', err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!nip.trim()) {
      setErrorMessage('Silakan masukkan Nomor Induk Pegawai (NIP).');
      return;
    }

    if (!password) {
      setErrorMessage('Silakan masukkan Kata sandi Anda.');
      return;
    }

    if (!recaptchaToken) {
      setErrorMessage('Silakan selesaikan verifikasi reCAPTCHA terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nip: nip.trim(), password, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'NIP atau kata sandi tidak sesuai.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Login berhasil! Mengarahkan ke sistem...');
      setTimeout(() => {
        router.push('/beranda');
        router.refresh();
      }, 400);
    } catch (error) {
      console.error(error);
      setErrorMessage('Terjadi kendala jaringan saat menghubungkan ke server.');
      setIsLoading(false);
    }
  };

  const fillQuickCredential = (nipVal: string, passVal: string) => {
    setNip(nipVal);
    setPassword(passVal);
    setErrorMessage('');
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col justify-between selection:bg-[#007BFF] selection:text-white">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center">
          
          {/* Left Column: Form Section */}
          <div className="flex flex-col justify-center max-w-[440px] w-full mx-auto md:mx-0">
            {/* Logo Brand */}
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src="/images/logo-perpusnas.png"
                alt="Logo Perpustakaan Nasional RI"
                className="h-11 sm:h-12 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl text-[#00113a] leading-none tracking-tight">
                  Cakrawala
                </span>
                <span className="text-xs font-semibold text-[#00113a] mt-1 leading-snug">
                  Portal Intranet
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-lg sm:text-xl font-bold text-[#00113a] tracking-tight mb-5">
              Masuk dengan menggunakan Kredensial Anda
            </h1>

            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="mb-4 flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-start gap-2 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-fadeIn">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* NIP Field */}
              <div>
                <label
                  htmlFor="nip"
                  className="block text-xs font-medium text-slate-800 mb-1"
                >
                  Nomor Induk Pegawai
                </label>
                <input
                  id="nip"
                  name="nip"
                  type="text"
                  required
                  autoFocus
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Masukkan Nomor Induk Pegawai.."
                  className="block w-full px-3.5 py-2 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all shadow-2xs"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-800 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Kata sandi anda..."
                    className="block w-full pl-3.5 pr-10 py-2 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* reCAPTCHA Widget */}
              <div className="pt-0.5">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#007BFF] hover:bg-[#0069d9] active:bg-[#0056b3] text-white font-semibold rounded text-sm transition-colors shadow-2xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    'Masuk'
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="pt-0.5">
                <Link
                  href="/lupa-kata-sandi"
                  className="text-xs text-slate-500 hover:text-[#007BFF] hover:underline transition-colors"
                >
                  Lupa Kata sandi?
                </Link>
              </div>
            </form>

            {/* Quick Demo Credentials (Collapsible helper) */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDemoAcc(!showDemoAcc)}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              >
                <span>Akses Cepat Pengujian (Demo Mode)</span>
                {showDemoAcc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showDemoAcc && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => fillQuickCredential('ADMIN001', 'admin123')}
                    className="p-2 text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Administrator</div>
                    <div className="text-[10px] text-slate-500 font-mono">ADMIN001</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickCredential('198501152010011001', 'pegawai123')}
                    className="p-2 text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Pegawai (Bambang)</div>
                    <div className="text-[10px] text-slate-500 font-mono">198501152010011001</div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Centered Star & Pemberitahuan (as per Wireframe) */}
          <div className="flex flex-col items-center justify-center text-center px-4 max-w-[420px] mx-auto w-full">
            {/* Big Perpusnas Star Logo */}
            <img
              src="/images/logo-perpusnas.png"
              alt="Logo Perpustakaan Nasional RI"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-5 object-contain"
            />

            {/* Pemberitahuan Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#00113a] mb-3">
              {infoPenting.headline || 'Pemberitahuan'}
            </h2>

            {/* Pemberitahuan Text */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[360px] mx-auto whitespace-pre-line font-normal">
              {infoPenting.subheadline ||
                'Diberitahukan kepada seluruh pegawai bahwa sistem portal intranet akan menjalani sinkronisasi berkala pada hari Jumat pukul 17.00 WIB. Pastikan pekerjaan Anda telah tersimpan.'}
            </p>
          </div>

        </div>
      </main>

      {/* Footer as per Wireframe: Light gray banner */}
      <footer className="w-full bg-[#f4f5f7] border-t border-slate-200/80 py-3 sm:py-3.5 text-center text-xs text-slate-500 font-normal">
        Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.
      </footer>
    </div>
  );
}



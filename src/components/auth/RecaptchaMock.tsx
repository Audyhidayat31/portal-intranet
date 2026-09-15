'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface RecaptchaMockProps {
  verified: boolean;
  onVerifyChange: (verified: boolean) => void;
  hasError?: boolean;
  className?: string;
}

export default function RecaptchaMock({ verified, onVerifyChange, hasError, className = '' }: RecaptchaMockProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (verified || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerifyChange(true);
    }, 600);
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center justify-between bg-[#f9f9f9] hover:bg-[#f3f4f6] rounded-[3px] p-3 select-none cursor-pointer transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] border ${
        hasError && !verified
          ? 'border-red-400 bg-red-50/30 ring-2 ring-red-400/20 animate-shake'
          : 'border-[#d1d5db]'
      } ${className || 'w-full max-w-[304px]'}`}
      title="Verifikasi reCAPTCHA"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-[26px] h-[26px] rounded-[2px] border flex items-center justify-center transition-all ${
            verified
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white border-[#c1c1c1] hover:border-[#a0a0a0]'
          }`}
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-[#007BFF] border-t-transparent rounded-full animate-spin" />
          ) : verified ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : null}
        </div>
        <span className="text-[13px] font-normal text-slate-700">
          I&apos;m not a robot
        </span>
      </div>

      <div className="flex flex-col items-center justify-center pl-2">
        <div className="flex items-center justify-center w-7 h-7 text-[#007BFF]">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
              fill="#1A73E8"
              opacity="0.2"
            />
            <path
              d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.85 20 14.48 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.15 4 11.52 4 13c0 4.42 3.58 8 8 8v-4c-3.31 0-6-2.69-6-6z"
              fill="#4285F4"
            />
          </svg>
        </div>
        <span className="text-[9px] text-[#555] font-semibold tracking-tighter leading-none mt-0.5">
          reCAPTCHA
        </span>
        <div className="text-[7.5px] text-[#777] flex gap-1 mt-0.5 leading-none">
          <span className="hover:underline">Privacy</span>
          <span>-</span>
          <span className="hover:underline">Terms</span>
        </div>
      </div>
    </div>
  );
}

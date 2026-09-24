'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function PortalFooter() {
  const [footerData, setFooterData] = useState<{
    deskripsi: string;
    socialMedia: any[];
    digitalServices: any[];
    kontak: {
      telepon: string;
      email: string;
      alamat1: string;
      alamat2: string;
    };
    copyright: string;
  }>({
    deskripsi:
      'Platform layanan internal yang menyediakan informasi dan mendukung kebutuhan pegawai Perpustakaan Nasional Republik Indonesia secara efektif, efisien, dan mudah diakses.',
    socialMedia: [
      { platform: 'youtube', link: 'https://www.youtube.com/@PerpustakaanNasionalRI' },
      { platform: 'x', link: 'https://x.com/perpusnas1' },
      { platform: 'instagram', link: 'https://www.instagram.com/perpusnas.go.id' },
      { platform: 'facebook', link: 'https://www.facebook.com/ayokeperpusnas' },
    ],
    digitalServices: [
      { nama: 'ISBN', link: 'https://isbn.perpusnas.go.id' },
      { nama: 'OPAC', link: 'https://opac.perpusnas.go.id' },
      { nama: 'IOS', link: 'https://onesearch.id' },
      { nama: 'K-OL', link: 'https://keanggotaan.perpusnas.go.id' },
      { nama: 'iPusnas', link: 'https://ipusnas.id' },
      { nama: 'BintangPusnas Edu', link: 'https://bintangpusnas.perpusnas.go.id' },
      { nama: 'E-Resources', link: 'https://e-resources.perpusnas.go.id' },
    ],
    kontak: {
      telepon: '085717147303',
      email: 'persuratan@perpusnas.go.id',
      alamat1: 'Jl. Salemba Raya No. 28A, Jakarta 10430',
      alamat2: 'Jl. Medan Merdeka Selatan No. 11, Jakarta 10110',
    },
    copyright: 'Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.',
  });

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.footer) {
          const f = data.data.footer;
          setFooterData((prev) => ({
            ...prev,
            deskripsi: f.deskripsi || prev.deskripsi,
            socialMedia: f.socialMedia?.filter((s: any) => s.status === 'ACTIVE' || s.status === 'Diterbitkan' || s.status === 'Aktif') || prev.socialMedia,
            digitalServices: f.digitalServices?.filter((s: any) => s.status === 'ACTIVE' || s.status === 'Diterbitkan' || s.status === 'Aktif') || prev.digitalServices,
            kontak: f.kontak || prev.kontak,
            copyright: f.copyright || prev.copyright,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const getSocialPlatformStyle = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return 'bg-[#ff0000] hover:bg-[#e60000] text-white';
      case 'x':
      case 'twitter':
        return 'bg-slate-950 hover:bg-black text-white border border-white/10';
      case 'instagram':
        return 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:brightness-110 text-white';
      case 'facebook':
        return 'bg-[#1877f2] hover:bg-[#166fe5] text-white';
      case 'tiktok':
        return 'bg-black hover:bg-neutral-900 text-white';
      default:
        return 'bg-[#00113a] hover:bg-[#2a4386] text-white';
    }
  };

  const renderSocialIconSvg = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return (
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.37-.07 2.56-.99 2.95-2.31.25-.75.25-1.57.25-2.36V.02h-.03z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'x':
      default:
        return (
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
    }
  };

  return (
    <footer className="w-full bg-[#002366] text-white py-16 px-4 sm:px-8 mt-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-perpusnas.png"
              alt="Perpusnas Logo"
              className="h-11 sm:h-12 w-auto object-contain shrink-0"
            />
            <div>
              <h2 className="font-bold text-base text-white leading-tight">
                Cakrawala<br />Portal Intranet<br />Perpustakaan Nasional
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#b3c5ff] leading-relaxed mt-4">
            {footerData.deskripsi}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {footerData.socialMedia.map((item: any, idx: number) => {
              const platform = (item.platform || '').toLowerCase();
              return (
                <a
                  key={item.id || idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.platform || 'Social Media'}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs shrink-0 overflow-hidden ${getSocialPlatformStyle(platform)}`}
                  title={item.nama || item.platform}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.nama || item.platform}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    renderSocialIconSvg(platform)
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white mb-6">Statistik Pengunjung</h3>
          <div className="space-y-3 font-normal text-xs sm:text-sm text-[#b3c5ff]">
            <div className="flex justify-between border-b border-[#2a4386] pb-2">
              <span>Hari ini</span>
              <span className="font-semibold text-white">: 1.060</span>
            </div>
            <div className="flex justify-between border-b border-[#2a4386] pb-2">
              <span>Bulan ini</span>
              <span className="font-semibold text-white">: 41.709</span>
            </div>
            <div className="flex justify-between border-b border-[#2a4386] pb-2">
              <span>Tahun ini</span>
              <span className="font-semibold text-white">: 378.783</span>
            </div>
          </div>
        </div>

        {/* Services Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white mb-6">Layanan Digital</h3>
          <ul className="text-xs sm:text-sm text-[#b3c5ff] space-y-2 list-disc pl-5">
            {footerData.digitalServices.map((svc: any, idx: number) => (
              <li key={svc.id || idx}>
                <a
                  href={svc.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {svc.nama}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white mb-6">Kontak Kami</h3>
          <div className="text-xs sm:text-sm text-[#b3c5ff] space-y-3">
            <p>{footerData.kontak.telepon}</p>
            <p>
              <a
                href={`mailto:${footerData.kontak.email}`}
                className="hover:text-white transition-colors"
              >
                {footerData.kontak.email}
              </a>
            </p>
            <p>{footerData.kontak.alamat1}</p>
            <p>{footerData.kontak.alamat2}</p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-[1280px] mx-auto text-center border-t border-[#2a4386] pt-8">
        <p className="text-xs sm:text-sm text-[#b3c5ff]">
          {footerData.copyright || 'Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.'}
        </p>
      </div>
    </footer>
  );
}



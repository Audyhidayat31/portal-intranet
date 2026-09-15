'use client';

import React from 'react';
import Link from 'next/link';

export default function TentangPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/tentang-bg.jpg')" }}>
      {/* Semi-transparent Backdrop Overlay */}
      <div className="min-h-[calc(100vh-80px)] w-full bg-white/85 md:bg-white/88 backdrop-blur-[1.5px] py-10 sm:py-14 px-4 sm:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col justify-center">
          
          {/* Breadcrumb */}
          <div className="text-sm text-[#444650] mb-8 sm:mb-12">
            <Link href="/beranda" className="hover:text-[#00113a] transition-colors">
              Beranda
            </Link>{' '}
            &gt; <span className="font-bold text-[#1a1b20]">Tentang</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#00113a] tracking-tight mb-12 sm:mb-16">
            Tentang
          </h1>

          {/* Description Section */}
          <section className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-7 mb-16 sm:mb-20">
            <p className="text-sm sm:text-base md:text-[17px] text-[#333741] leading-relaxed">
              Portal Intranet Perpustakaan Nasional Republik Indonesia merupakan media digital internal yang dirancang untuk mendukung kebutuhan informasi, komunikasi, dan interaksi antarpegawai dalam lingkungan Perpustakaan Nasional RI.
            </p>
            <p className="text-sm sm:text-base md:text-[17px] text-[#333741] leading-relaxed">
              Melalui portal ini, pegawai dapat memperoleh berbagai informasi kedinasan, mengakses dokumen internal, mengikuti kabar dan pengumuman terkini, serta mengenal lebih dekat rekan kerja melalui berbagai informasi dan konten yang tersedia.
            </p>
            <p className="text-sm sm:text-base md:text-[17px] text-[#333741] leading-relaxed">
              Portal Intranet juga menjadi ruang bersama untuk membangun komunikasi yang lebih terbuka, mempererat hubungan antarpegawai, serta menciptakan lingkungan kerja yang informatif, kolaboratif, dan terhubung.
            </p>
            <p className="text-sm sm:text-base md:text-[17px] text-[#333741] leading-relaxed">
              Dengan hadirnya Portal Intranet, diharapkan kebutuhan informasi internal dapat diakses dengan lebih mudah, cepat, dan terintegrasi dalam satu platform.
            </p>
          </section>

          {/* Terms & Conditions Section */}
          <section className="max-w-4xl mx-auto border-t border-[#c5c6d2]/80 pt-12 sm:pt-16 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#00113a] mb-6">
              Syarat &amp; Ketentuan
            </h2>
            <p className="text-sm sm:text-base text-[#1a1b20] mb-6 leading-relaxed">
              Dengan memiliki akun Portal Intranet Perpusnas, berarti anda akan menyetujui, memahami, dan akan melaksanakan tata tertib komunitas Portal Intranet Perpusnas sebagai berikut:
            </p>

            <ol className="list-decimal pl-5 space-y-4 text-xs sm:text-sm text-[#1a1b20] leading-relaxed mb-10">
              <li>
                Setiap pegawai Perpusnas yang masih aktif dan memiliki NIP terdaftar pada Bagian Kepegawaian berhak memiliki akun pada Portal Intranet Perpusnas.
              </li>
              <li>
                Registrasi akun Portal Intranet Perpusnas hanya boleh dilakukan oleh pegawai yang bersangkutan. Tidak diperkenankan melakukan registrasi atas nama pegawai lain.
              </li>
              <li>
                Untuk keamanan dan kenyamanan bersama, setiap pemilik akun hendaknya tidak memberitahukan password login kepada pegawai lain atau siapapun yang dikehendaki.
              </li>
              <li>
                Manfaatkanlah rubrik yang tersedia untuk meningkatkan wawasan keilmuan, kinerja, dan manfaat bagi seluruh pegawai Perpusnas.
              </li>
              <li>
                Gunakanlah bahasa yang sopan dalam mengisi rubrik yang tersedia. Tidak diperkenankan menyinggung masalah pribadi, suku, agama dan ras, memprovokasi, memfitnah, mengintimidasi, dan sejenisnya.
              </li>
              <li>
                Semua tulisan yang diinput dalam rubrik umum merupakan tanggungjawab penulis yang bersangkutan.
              </li>
              <li>
                Khusus pegawai yang ditugaskan untuk mengisi rubrik-rubrik yang memerlukan otoritas khusus, diharapkan dapat melaksanakan tugasnya dengan baik dan menjaga kemutakhiran datanya.
              </li>
              <li>
                Keluarlah dari Portal Intranet Perpusnas dengan cara mengklik hyperlink Logout apabila anda akan meninggalkan komputer. Hal ini untuk mencegah orang lain mengisi rubrik / menginput data atas nama anda.
              </li>
              <li>
                Silahkan meminta penjelasan seputar penggunaan Portal Intranet Perpusnas kepada Tim Pemelihara Portal Intranet Perpusnas apabila ada hal-hal yang masih belum dimengerti.
              </li>
              <li>
                Anda diperkenankan untuk memberikan koreksi atau informasi kepada Tim Pemelihara Portal Intranet Perpusnas apabila melihat kesalahan program ataupun kesalahan isi cantuman dari suatu rubrik.
              </li>
            </ol>

            <div className="pt-2">
              <a
                href="/kabar-kedinasan/dokumen-intern"
                className="inline-flex items-center justify-center bg-[#00113a] text-white font-bold px-8 py-3.5 rounded-md hover:bg-[#2a4386] transition-colors shadow-sm text-sm sm:text-base"
              >
                Panduan Aplikasi
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

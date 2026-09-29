import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import fs from 'fs';
import path from 'path';

// Initial default banners matching the wireframe
const DEFAULT_BANNERS = [
  {
    id: 'b-1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYiVIlTvlHWCZXsVWN5BKuXNUOFuVWmKl4EtLECjpaOy9dESc-3QPJSVJp5bXmxWHAow1d7ZRMI2LYZ5tJGkKcpz5-yH5kqvgRBImJwBq_iPLpDXPrffOSljK8yNGkVvtipwLYF0otGU56r_SjT5AXkGqMt713QDk_R1omHKPbPeDubgX7UWOLW_cpHkr6M-H7MhReBGdqjdui0kAAPiGWQWyZUqOTWsLnPHseHwN3rkEYjBhOFgaw',
    imageName: 'Banner_Layanan_Digital.png',
    headline: 'Sosialisasi Sistem Perpustakaan Digital Nasional',
    subheadline: 'Akses koleksi digital dan naskah kuno nusantara dalam genggaman pegawai.',
    status: 'TERBIT',
    createdBy: 'Admin 1',
    createdAt: '2026-01-01T08:30:00.000Z',
  },
  {
    id: 'b-2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt5lBUWzhdVxrkyuiafB82wFLsq84XIOyegYfJrMcVB-gfdH9EyMg8wwKSwC0zseXJNUtgoMWG8uyFftr_pN9HUlybMmPppNL07GbZ3GoRf4alC8Sv281OsX-smoOTDl-sz2ftmhsCo0xEZS-pCJXkakqQ_w_OT1dLiUlBVndD4ZxIA-f5B1BXe3Ecb1mDnt3GS_3SUDJBhI5kaLkHiS4MT1CVxIFTe4VP6TBeBYr62-9ozimVWd70',
    imageName: 'Banner_Bulan_K3.png',
    headline: 'Peringatan Bulan K3 Nasional di Lingkungan Perpusnas',
    subheadline: 'Wujudkan budaya kerja yang sehat, aman, dan berintegritas tinggi.',
    status: 'WAITING',
    createdBy: 'Admin 1',
    createdAt: '2026-01-01T09:15:00.000Z',
  },
  {
    id: 'b-3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtvt3SrRcH9vLeIKQjXR-13wmcqrCgl1s9ZzxYkGRgWam6JRAfyfFqOPn3G1BD2GuaaYYiMyp7lCmPCKTE9F0mp9Qbf-S2E3eRqaBFaVr2MKtga9XQlMcL4ls-YdE8-Yyh-bnywt0zaTMOYC5EI2w-Z5fwTsHeRqsUKw1FzbRZILddR1ohK6xzRx0FNIjgimQnjtTfMY2FWHZEV9iHu7C4MLXo0pbcObDK3Tah6nDDOD82f_b2MCmL',
    imageName: 'Banner_Workshop_Inovasi.png',
    headline: 'Workshop Transformasi Perpustakaan Berbasis Inklusi Sosial',
    subheadline: 'Penguatan peran pustakawan dalam memberdayakan kesejahteraan masyarakat.',
    status: 'TERBIT',
    createdBy: 'Admin 1',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'b-4',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFmsQV5G444GOPEiBQmUDg0EimQGDtFLEcXXq5P1w9-nKwv4eWjePtkY-kW_EvS0EetnaQGSU--yGWdZF3CZERlTmj1GFqNxK8B_PHsuwYdaOWICZvAnLMOS6URsSZ9SATrogeMiqUHWbL5cHfXooB8QjBhQAqROIJGSe-FJf--DtPm7aLl-zxiBFZplX3DNjacuoYeURqvdKXrhE-6ZiHvKC52-ftmKi6hXXJxVGHey1gRcEDDp6d',
    imageName: 'Banner_Pelayanan_Prima.png',
    headline: 'Gerakan Peningkatan Kualitas Tata Kelola Dokumen Kedinasan',
    subheadline: 'Implementasi tata naskah dinas elektronik terintegrasi 2026.',
    status: 'TERBIT',
    createdBy: 'Admin 1',
    createdAt: '2026-01-01T11:45:00.000Z',
  },
];

const FOOTER_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'footer-config.json');
const INFO_PENTING_FILE = path.join(process.cwd(), 'src', 'lib', 'info-penting-config.json');
const TENTANG_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'tentang-config.json');

function getTentangConfig() {
  try {
    if (fs.existsSync(TENTANG_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(TENTANG_FILE_PATH, 'utf-8'));
    }
  } catch (err) {}
  return {
    deskripsi: 'Portal Intranet Perpustakaan Nasional Republik Indonesia merupakan media digital internal yang dirancang untuk mendukung kebutuhan informasi, komunikasi, dan interaksi antarpegawai dalam lingkungan Perpustakaan Nasional RI.',
    syaratKetentuan: `1. Setiap pegawai Perpusnas yang masih aktif dan memiliki NIP terdaftar pada Bagian Kepegawaian berhak memiliki akun pada Portal Intranet Perpusnas.\n2. Registrasi akun Portal Intranet Perpusnas hanya boleh dilakukan oleh pegawai yang bersangkutan. Tidak diperkenankan melakukan registrasi atas nama pegawai lain.\n3. Untuk keamanan dan kenyamanan bersama, setiap pemilik akun hendaknya tidak memberitahukan password login kepada pegawai lain.\n4. Manfaatkanlah rubrik yang tersedia untuk meningkatkan wawasan keilmuan, kinerja, dan integritas ASN.\n5. Gunakanlah bahasa yang sopan, santun, dan menjunjung tinggi etika kedinasan.`,
    latarBelakang: 'Background.png',
    latarBelakangUrl: '/images/tentang-bg.jpg',
    panduanAplikasi: '',
    panduanAplikasiUrl: '',
    status: 'TERBIT',
  };
}

function saveTentangConfig(data: any) {
  try {
    fs.writeFileSync(TENTANG_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving tentang config:', err);
    return false;
  }
}

function getInfoPentingConfig() {
  try {
    if (fs.existsSync(INFO_PENTING_FILE)) {
      return JSON.parse(fs.readFileSync(INFO_PENTING_FILE, 'utf-8'));
    }
  } catch (err) {}
  return {
    headline: 'Pemberitahuan',
    subheadline: 'Gunakan Nomor Induk Pegawai (NIP) resmi dan kata sandi kedinasan Anda. Jangan pernah membagikan kata sandi kepada siapapun.',
    status: 'AKTIF',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Administrator',
  };
}

function saveInfoPentingConfig(data: any) {
  try {
    fs.writeFileSync(INFO_PENTING_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving info penting:', err);
    return false;
  }
}

function getFooterConfig() {
  try {
    if (fs.existsSync(FOOTER_FILE_PATH)) {
      const data = fs.readFileSync(FOOTER_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading footer config file:', err);
  }
  return {
    deskripsi: 'Platform layanan internal yang menyediakan informasi dan mendukung kebutuhan pegawai Perpustakaan Nasional Republik Indonesia secara efektif, efisien, dan mudah diakses.',
    socialMedia: [
      {
        id: 'soc-1',
        platform: 'youtube',
        nama: 'Perpustakaan Nasional Republik Indonesia, @PerpustakaanNasionalRI',
        link: 'https://www.youtube.com/@PerpustakaanNasionalRI',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T08:30:00.000Z',
      },
      {
        id: 'soc-2',
        platform: 'x',
        nama: 'X Perpusnas RI (@perpusnas1)',
        link: 'https://x.com/perpusnas1',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T09:00:00.000Z',
      },
      {
        id: 'soc-3',
        platform: 'instagram',
        nama: 'Instagram Resmi Perpusnas RI (@perpusnas.go.id)',
        link: 'https://www.instagram.com/perpusnas.go.id',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T09:30:00.000Z',
      },
      {
        id: 'soc-4',
        platform: 'facebook',
        nama: 'Facebook Resmi Perpustakaan Nasional RI',
        link: 'https://www.facebook.com/ayokeperpusnas',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T10:00:00.000Z',
      },
    ],
    digitalServices: [
      {
        id: 'svc-1',
        nama: 'ISBN',
        link: 'https://isbn.perpusnas.go.id',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T08:30:00.000Z',
      },
      {
        id: 'svc-2',
        nama: 'OPAC',
        link: 'https://opac.perpusnas.go.id',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T08:30:00.000Z',
      },
      {
        id: 'svc-3',
        nama: 'IOS',
        link: 'https://onesearch.id',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T08:30:00.000Z',
      },
      {
        id: 'svc-4',
        nama: 'K-OL',
        link: 'https://keanggotaan.perpusnas.go.id',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T08:30:00.000Z',
      },
      {
        id: 'svc-5',
        nama: 'e-Pusnas',
        link: 'https://ipusnas.id',
        status: 'ACTIVE',
        updatedBy: 'Admin 1',
        updatedAt: '2026-01-01T08:30:00.000Z',
      },
    ],
    kontak: {
      telepon: '085717147303',
      email: 'persuratan@perpusnas.go.id',
      alamat1: 'Jl. Salemba Raya No. 28A, Jakarta 10430',
      alamat2: 'Jl. Medan Merdeka Selatan No. 11, Jakarta 10110',
    },
    copyright: 'Hak Cipta Dilindungi © 2026. Perpustakaan Nasional Republik Indonesia.',
  };
}

function saveFooterConfig(newConfig: any) {
  try {
    fs.writeFileSync(FOOTER_FILE_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving footer config file:', err);
    return false;
  }
}

export async function GET() {
  try {
    const setting = await prisma.homepageSetting.findFirst();

    // Parse banners stored in heroBannerUrl if available
    let banners = DEFAULT_BANNERS;
    if (setting?.heroBannerUrl) {
      try {
        const parsed = JSON.parse(setting.heroBannerUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          banners = parsed;
        }
      } catch (e) {
        // heroBannerUrl is a regular single URL string, keep default banners
      }
    }

    const isOldDefaultGreeting = !setting?.heroTitle ||
      setting.heroTitle === 'Selamat Datang di Cakrawala Portal Intranet Perpusnas RI' ||
      setting.heroTitle === 'Selamat Datang di Portal Intranet Perpusnas RI';

    const greeting = {
      headline: isOldDefaultGreeting ? 'Selamat Ulang Tahun' : setting.heroTitle,
      subheadline: isOldDefaultGreeting
        ? 'Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia. Semoga selalu dianugerahi kesehatan, kebahagiaan, kelancaran, serta kesuksesan dalam setiap karya.'
        : (setting?.heroSubtitle || 'Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia. Semoga selalu dianugerahi kesehatan, kebahagiaan, kelancaran, serta kesuksesan dalam setiap karya.'),
      status: 'TERBIT',
    };

    const tentang = getTentangConfig();

    const footer = getFooterConfig();
    const infoPenting = getInfoPentingConfig();

    return NextResponse.json({
      success: true,
      data: {
        setting: setting || null,
        banners,
        greeting,
        tentang,
        footer,
        infoPenting,
      },
    });
  } catch (error) {
    console.error('Error fetching admin homepage config:', error);
    return NextResponse.json({
      success: true,
      data: {
        banners: DEFAULT_BANNERS,
        greeting: {
          headline: 'Selamat Ulang Tahun',
          subheadline: 'Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia. Semoga selalu dianugerahi kesehatan, kebahagiaan, kelancaran, serta kesuksesan dalam setiap karya.',
          status: 'TERBIT',
        },
        footer: getFooterConfig(),
        infoPenting: getInfoPentingConfig(),
      },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      banners,
      greeting,
      heroTitle,
      heroSubtitle,
      heroBadge,
      quoteText,
      quoteAuthor,
      quoteAuthorRole,
      announcementTicker,
      footer,
      infoPenting,
      tentang,
    } = body;

    // Handle infoPenting update if provided
    let savedInfoPenting = null;
    if (infoPenting) {
      const currentInfo = getInfoPentingConfig();
      const mergedInfo = {
        ...currentInfo,
        ...infoPenting,
        updatedAt: new Date().toISOString(),
        updatedBy: user.name || 'Administrator',
      };
      saveInfoPentingConfig(mergedInfo);
      savedInfoPenting = mergedInfo;
    }

    // Handle footer update if provided
    let savedFooter = null;
    if (footer) {
      const currentFooter = getFooterConfig();
      const mergedFooter = {
        ...currentFooter,
        ...footer,
        kontak: {
          ...currentFooter.kontak,
          ...(footer.kontak || {}),
        },
      };
      saveFooterConfig(mergedFooter);
      savedFooter = mergedFooter;
    }

    // Handle tentang update if provided
    let savedTentang = null;
    if (tentang) {
      const currentTentang = getTentangConfig();
      const mergedTentang = {
        ...currentTentang,
        ...tentang,
      };
      saveTentangConfig(mergedTentang);
      savedTentang = mergedTentang;
    }

    const existing = await prisma.homepageSetting.findFirst();
    
    // Prepare updated fields
    const updatedHeroTitle = greeting?.headline || heroTitle || existing?.heroTitle || 'Selamat Ulang Tahun';
    const updatedHeroSubtitle = greeting?.subheadline || heroSubtitle || existing?.heroSubtitle || 'Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia. Semoga selalu dianugerahi kesehatan, kebahagiaan, kelancaran, serta kesuksesan dalam setiap karya.';
    const updatedHeroBannerUrl = banners ? JSON.stringify(banners) : existing?.heroBannerUrl;

    let setting;
    if (existing) {
      setting = await prisma.homepageSetting.update({
        where: { id: existing.id },
        data: {
          heroTitle: updatedHeroTitle,
          heroSubtitle: updatedHeroSubtitle,
          heroBannerUrl: updatedHeroBannerUrl,
          heroBadge: heroBadge ?? existing.heroBadge,
          quoteText: quoteText ?? existing.quoteText,
          quoteAuthor: quoteAuthor ?? existing.quoteAuthor,
          quoteAuthorRole: quoteAuthorRole ?? existing.quoteAuthorRole,
          announcementTicker: announcementTicker ?? existing.announcementTicker,
        },
      });
    } else {
      setting = await prisma.homepageSetting.create({
        data: {
          heroTitle: updatedHeroTitle,
          heroSubtitle: updatedHeroSubtitle,
          heroBannerUrl: updatedHeroBannerUrl,
          heroBadge: heroBadge || 'Portal Terpadu ASN',
          quoteText: quoteText || 'Membaca adalah jembatan emas menuju peradaban bangsa.',
          quoteAuthor: quoteAuthor || 'Pustakawan Ahli Perpusnas RI',
          quoteAuthorRole: quoteAuthorRole || 'Perpustakaan Nasional RI',
          announcementTicker: announcementTicker || '',
        },
      });
    }

    await logActivity({
      userId: user.userId,
      action: 'UPDATE',
      module: 'HOMEPAGE',
      description: 'Administrator memperbarui konfigurasi halaman utama (Banner / Ucapan / Footer / Pengaturan).',
    });

    return NextResponse.json({
      success: true,
      message: 'Konfigurasi Halaman Utama berhasil disimpan!',
      data: {
        setting,
        banners,
        greeting: {
          headline: setting.heroTitle,
          subheadline: setting.heroSubtitle,
          status: 'TERBIT',
        },
        footer: savedFooter || getFooterConfig(),
        infoPenting: savedInfoPenting || getInfoPentingConfig(),
      },
    });
  } catch (error) {
    console.error('Error updating admin homepage config:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui konfigurasi halaman utama' }, { status: 500 });
  }
}


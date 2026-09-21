'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  User,
  LogOut,
  Info,
  Layers,
  Globe,
  FileText,
  Clock,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
  ExternalLink,
  Share2,
  PhoneCall,
  Layout,
  Sliders,
  Check,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BannerModal, BannerItem } from '@/components/admin/BannerModal';
import { SocialMediaModal, SocialMediaItem } from '@/components/admin/SocialMediaModal';
import { DigitalServiceModal, DigitalServiceItem } from '@/components/admin/DigitalServiceModal';
import { formatDate } from '@/lib/utils';

export default function AdminHomepageKelolaPage() {
  const router = useRouter();

  // Active Tab: 'utama' | 'beranda' | 'tentang' | 'footer'
  const [activeTab, setActiveTab] = useState<'utama' | 'beranda' | 'tentang' | 'footer'>('utama');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Current Admin User Session
  const [adminUser, setAdminUser] = useState<any>(null);

  // ---------------- TAB UTAMA: PEMBERITAHUAN (SEBELAH HALAMAN LOGIN) ----------------
  const [savedInfoPenting, setSavedInfoPenting] = useState({
    headline: 'Pemberitahuan',
    subheadline: 'Gunakan Nomor Induk Pegawai (NIP) resmi dan kata sandi kedinasan Anda. Jangan pernah membagikan kata sandi kepada siapapun demi menjaga integritas data kepegawaian Perpusnas RI.',
    status: 'AKTIF' as 'AKTIF' | 'MENUNGGU',
  });

  const [formInfoPenting, setFormInfoPenting] = useState({
    headline: 'Pemberitahuan',
    subheadline: 'Gunakan Nomor Induk Pegawai (NIP) resmi dan kata sandi kedinasan Anda. Jangan pernah membagikan kata sandi kepada siapapun demi menjaga integritas data kepegawaian Perpusnas RI.',
    status: 'AKTIF' as 'AKTIF' | 'MENUNGGU',
  });

  // ---------------- TAB UTAMA: PENGATURAN UMUM ----------------
  const [utamaData, setUtamaData] = useState({
    heroBadge: 'Kiprah Literasi Bangsa',
    quoteText: 'Membaca adalah jembatan emas menuju peradaban bangsa yang unggul dan berkarakter.',
    quoteAuthor: 'Prof. Dr. Ir. Muhammad Syarif Bando, M.M.',
    quoteAuthorRole: 'Kepala Perpustakaan Nasional RI (Periode 2016-2023)',
    announcementTicker: 'Pemberitahuan: Seluruh pegawai dihimbau melengkapi data profil kepegawaian terkini sebelum akhir bulan.',
  });

  // ---------------- TAB BERANDA: BANNER & UCAPAN ----------------
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<BannerItem | null>(null);
  const [isDeletingBanner, setIsDeletingBanner] = useState(false);

  // Data Ucapan Selamat Ulang Tahun
  const [ucapanHeadline, setUcapanHeadline] = useState('');
  const [ucapanSubheadline, setUcapanSubheadline] = useState('');
  const [ucapanStatus, setUcapanStatus] = useState<'TERBIT' | 'WAITING'>('TERBIT');

  const [savedGreeting, setSavedGreeting] = useState({
    headline: 'Selamat Ulang Tahun',
    subheadline: 'Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia. Semoga selalu dianugerahi kesehatan, kebahagiaan, kelancaran, serta kesuksesan dalam setiap karya.',
    status: 'TERBIT',
  });

  // ---------------- TAB TENTANG ----------------
  const [tentangData, setTentangData] = useState({
    deskripsi: 'Portal Intranet Perpustakaan Nasional Republik Indonesia merupakan media digital internal yang dirancang untuk mendukung kebutuhan informasi, komunikasi, dan interaksi antarpegawai dalam lingkungan Perpustakaan Nasional RI.',
    syaratKetentuan: `1. Setiap pegawai Perpusnas yang masih aktif dan memiliki NIP terdaftar pada Bagian Kepegawaian berhak memiliki akun pada Portal Intranet Perpusnas.\n2. Registrasi akun Portal Intranet Perpusnas hanya boleh dilakukan oleh pegawai yang bersangkutan. Tidak diperkenankan melakukan registrasi atas nama pegawai lain.\n3. Untuk keamanan dan kenyamanan bersama, setiap pemilik akun hendaknya tidak memberitahukan password login kepada pegawai lain.\n4. Manfaatkanlah rubrik yang tersedia untuk meningkatkan wawasan keilmuan, kinerja, dan integritas ASN.\n5. Gunakanlah bahasa yang sopan, santun, dan menjunjung tinggi etika kedinasan.`,
    latarBelakang: 'Background.png',
    panduanAplikasi: 'panduan.pdf',
    status: 'TERBIT',
  });

  const backgroundFileInputRef = useRef<HTMLInputElement | null>(null);
  const panduanFileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------------- TAB FOOTER ----------------
  const [footerDeskripsi, setFooterDeskripsi] = useState(
    'Platform layanan internal yang menyediakan informasi dan mendukung kebutuhan pegawai Perpustakaan Nasional Republik Indonesia secara efektif, efisien, dan mudah diakses.'
  );

  const [socialMediaList, setSocialMediaList] = useState<SocialMediaItem[]>([
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
  ]);

  const [digitalServiceList, setDigitalServiceList] = useState<DigitalServiceItem[]>([
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
  ]);

  const [kontakData, setKontakData] = useState({
    telepon: '085717147303',
    email: 'persuratan@perpusnas.go.id',
    alamat1: 'Jl. Salemba Raya No. 28A, Jakarta 10430',
    alamat2: 'Jl. Medan Merdeka Selatan No. 11, Jakarta 10110',
  });

  // Modals for Footer
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMediaItem | null>(null);
  const [socialToDelete, setSocialToDelete] = useState<SocialMediaItem | null>(null);
  const [isDeletingSocial, setIsDeletingSocial] = useState(false);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<DigitalServiceItem | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<DigitalServiceItem | null>(null);
  const [isDeletingService, setIsDeletingService] = useState(false);

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/homepage').then((res) => res.json()),
      fetch('/api/auth/me').then((res) => res.json()),
    ])
      .then(([homeRes, authRes]) => {
        if (homeRes.success && homeRes.data) {
          const d = homeRes.data;
          if (d.banners) setBanners(d.banners);
          if (d.greeting) {
            setSavedGreeting(d.greeting);
            setUcapanHeadline(d.greeting.headline || '');
            setUcapanSubheadline(d.greeting.subheadline || '');
            setUcapanStatus(d.greeting.status || 'TERBIT');
          }
          if (d.infoPenting) {
            setSavedInfoPenting(d.infoPenting);
            setFormInfoPenting(d.infoPenting);
          }
          if (d.setting) {
            setUtamaData({
              heroBadge: d.setting.heroBadge || 'Kiprah Literasi Bangsa',
              quoteText: d.setting.quoteText || 'Membaca adalah jembatan emas menuju peradaban bangsa.',
              quoteAuthor: d.setting.quoteAuthor || 'Prof. Dr. Ir. Muhammad Syarif Bando, M.M.',
              quoteAuthorRole: d.setting.quoteAuthorRole || 'Kepala Perpustakaan Nasional RI (Periode 2016-2023)',
              announcementTicker: d.setting.announcementTicker || '',
            });
          }
          if (d.tentang) setTentangData(d.tentang);
          if (d.footer) {
            if (d.footer.deskripsi) setFooterDeskripsi(d.footer.deskripsi);
            if (d.footer.socialMedia && Array.isArray(d.footer.socialMedia)) {
              setSocialMediaList(d.footer.socialMedia);
            }
            if (d.footer.digitalServices && Array.isArray(d.footer.digitalServices)) {
              setDigitalServiceList(d.footer.digitalServices);
            }
            if (d.footer.kontak) {
              setKontakData(d.footer.kontak);
            }
          }
        }
        if (authRes.success && authRes.data) {
          setAdminUser(authRes.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  };

  // Helper to persist entire footer payload
  const persistFooterData = async (overrides: Partial<{
    deskripsi: string;
    socialMedia: SocialMediaItem[];
    digitalServices: DigitalServiceItem[];
    kontak: typeof kontakData;
  }>) => {
    const payload = {
      deskripsi: overrides.deskripsi !== undefined ? overrides.deskripsi : footerDeskripsi,
      socialMedia: overrides.socialMedia !== undefined ? overrides.socialMedia : socialMediaList,
      digitalServices: overrides.digitalServices !== undefined ? overrides.digitalServices : digitalServiceList,
      kontak: overrides.kontak !== undefined ? overrides.kontak : kontakData,
      copyright: '© Hak Cipta 2026, Perpustakaan Nasional Republik Indonesia.',
    };

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ footer: payload }),
      });
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.error('Error saving footer data:', e);
      return false;
    }
  };

  // ----------------- TAB UTAMA: PEMBERITAHUAN HANDLERS -----------------
  const handleSaveInfoPenting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInfoPenting.headline.trim()) {
      showNotification('error', 'Headline Pemberitahuan wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/info-penting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInfoPenting),
      });
      const data = await res.json();
      if (data.success) {
        setSavedInfoPenting(data.data);
        showNotification('success', 'Pemberitahuan berhasil disimpan dan langsung diterapkan ke Halaman Login!');
      } else {
        showNotification('error', data.message || 'Gagal menyimpan Pemberitahuan.');
      }
    } catch (err) {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelInfoPenting = () => {
    setFormInfoPenting(savedInfoPenting);
    showNotification('success', 'Perubahan dibatalkan, form dikembalikan ke data tersimpan.');
  };

  const handleEditInfoPentingFromPreview = () => {
    setFormInfoPenting(savedInfoPenting);
    const formElement = document.getElementById('form-ubah-info-penting');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('info-headline-input');
      input?.focus();
    }
  };

  // ----------------- TAB UTAMA HANDLER -----------------
  const handleSaveUtama = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utamaData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Pengaturan Utama berhasil disimpan!');
      } else {
        showNotification('error', data.message || 'Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      showNotification('error', 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------- BANNER HANDLERS -----------------
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (item: BannerItem) => {
    setEditingBanner(item);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (bannerData: BannerItem) => {
    let updatedBanners: BannerItem[];
    if (editingBanner) {
      updatedBanners = banners.map((b) =>
        b.id === editingBanner.id ? { ...b, ...bannerData } : b
      );
    } else {
      const newBanner: BannerItem = {
        ...bannerData,
        id: `banner-${Date.now()}`,
        createdBy: adminUser?.name || 'Admin 1',
        createdAt: new Date().toISOString(),
      };
      updatedBanners = [newBanner, ...banners];
    }

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: updatedBanners }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners(updatedBanners);
        showNotification('success', editingBanner ? 'Banner berhasil diperbarui!' : 'Banner baru berhasil ditambahkan!');
      } else {
        showNotification('error', data.message || 'Gagal menyimpan banner.');
      }
    } catch (e) {
      showNotification('error', 'Terjadi masalah jaringan saat menyimpan banner.');
    }
  };

  const handleConfirmDeleteBanner = async () => {
    if (!bannerToDelete) return;
    setIsDeletingBanner(true);
    const updatedBanners = banners.filter((b) => b.id !== bannerToDelete.id);

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: updatedBanners }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners(updatedBanners);
        showNotification('success', 'Banner berhasil dihapus.');
      } else {
        showNotification('error', data.message || 'Gagal menghapus banner.');
      }
    } catch (e) {
      showNotification('error', 'Terjadi gangguan koneksi.');
    } finally {
      setIsDeletingBanner(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleBannerStatus = async (item: BannerItem) => {
    const nextStatus: 'TERBIT' | 'WAITING' = item.status === 'TERBIT' ? 'WAITING' : 'TERBIT';
    const updatedBanners: BannerItem[] = banners.map((b) =>
      b.id === item.id ? { ...b, status: nextStatus } : b
    );

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: updatedBanners }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners(updatedBanners);
        showNotification('success', `Status banner "${item.headline}" diubah menjadi ${nextStatus === 'TERBIT' ? 'Terbit' : 'Menunggu'}`);
      }
    } catch (e) {
      showNotification('error', 'Gagal memperbarui status banner.');
    }
  };

  // ----------------- UCAPAN HANDLERS -----------------
  const handleSaveUcapan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ucapanHeadline.trim()) {
      showNotification('error', 'Headline ucapan selamat ulang tahun wajib diisi.');
      return;
    }

    setIsSaving(true);
    const payloadGreeting = {
      headline: ucapanHeadline.trim(),
      subheadline: ucapanSubheadline.trim(),
      status: ucapanStatus,
    };

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ greeting: payloadGreeting }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedGreeting(payloadGreeting);
        showNotification('success', 'Ucapan Selamat Ulang Tahun berhasil diperbarui dan diterapkan ke Beranda!');
      } else {
        showNotification('error', data.message || 'Gagal menyimpan ucapan.');
      }
    } catch (e) {
      showNotification('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUcapanFromPreview = () => {
    setUcapanHeadline(savedGreeting.headline);
    setUcapanSubheadline(savedGreeting.subheadline);
    setUcapanStatus(savedGreeting.status as any);
    const formElement = document.getElementById('form-ucapan');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      formElement.classList.add('ring-2', 'ring-[#007BFF]');
      setTimeout(() => {
        formElement.classList.remove('ring-2', 'ring-[#007BFF]');
      }, 1500);
    }
  };

  // ----------------- TENTANG HANDLERS -----------------
  const handleSaveTentangSection = async (sectionName: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tentang: tentangData }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `${sectionName} berhasil disimpan!`);
      } else {
        showNotification('error', data.message || `Gagal menyimpan ${sectionName}.`);
      }
    } catch (e) {
      showNotification('error', 'Terjadi gangguan jaringan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------- FOOTER SECTION 1: DESKRIPSI HANDLER -----------------
  const handleSaveDeskripsi = async () => {
    setIsSaving(true);
    const success = await persistFooterData({ deskripsi: footerDeskripsi });
    setIsSaving(false);
    if (success) {
      showNotification('success', 'Deskripsi footer berhasil disimpan!');
    } else {
      showNotification('error', 'Gagal menyimpan deskripsi footer.');
    }
  };

  // ----------------- FOOTER SECTION 2: MEDIA SOSIAL HANDLERS -----------------
  const handleOpenAddSocial = () => {
    setEditingSocial(null);
    setIsSocialModalOpen(true);
  };

  const handleOpenEditSocial = (item: SocialMediaItem) => {
    setEditingSocial(item);
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = async (item: SocialMediaItem) => {
    let updatedList: SocialMediaItem[];
    if (editingSocial) {
      updatedList = socialMediaList.map((s) => (s.id === editingSocial.id ? item : s));
    } else {
      updatedList = [...socialMediaList, item];
    }
    const success = await persistFooterData({ socialMedia: updatedList });
    if (success) {
      setSocialMediaList(updatedList);
      showNotification(
        'success',
        editingSocial ? 'Media sosial berhasil diperbarui!' : 'Media sosial baru berhasil ditambahkan!'
      );
    } else {
      throw new Error('Gagal menyimpan ke server');
    }
  };

  const handleConfirmDeleteSocial = async () => {
    if (!socialToDelete) return;
    setIsDeletingSocial(true);
    const updatedList = socialMediaList.filter((s) => s.id !== socialToDelete.id);
    const success = await persistFooterData({ socialMedia: updatedList });
    setIsDeletingSocial(false);
    setSocialToDelete(null);
    if (success) {
      setSocialMediaList(updatedList);
      showNotification('success', 'Media sosial berhasil dihapus.');
    } else {
      showNotification('error', 'Gagal menghapus media sosial.');
    }
  };

  const handleToggleSocialStatus = async (item: SocialMediaItem) => {
    const isCurrentlyActive = item.status === 'ACTIVE' || item.status === 'Diterbitkan' || item.status === 'Aktif';
    const nextStatus: any = isCurrentlyActive ? 'Nonaktif' : 'Aktif';
    const updatedList: SocialMediaItem[] = socialMediaList.map((s) =>
      s.id === item.id
        ? {
          ...s,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: adminUser?.name || s.updatedBy || 'Admin 1',
        }
        : s
    );
    const success = await persistFooterData({ socialMedia: updatedList });
    if (success) {
      setSocialMediaList(updatedList);
      showNotification(
        'success',
        `Status ${item.nama} diubah menjadi ${nextStatus === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}`
      );
    }
  };

  // ----------------- FOOTER SECTION 3: LAYANAN DIGITAL HANDLERS -----------------
  const handleOpenAddService = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (item: DigitalServiceItem) => {
    setEditingService(item);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (item: DigitalServiceItem) => {
    let updatedList: DigitalServiceItem[];
    if (editingService) {
      updatedList = digitalServiceList.map((s) => (s.id === editingService.id ? item : s));
    } else {
      updatedList = [...digitalServiceList, item];
    }
    const success = await persistFooterData({ digitalServices: updatedList });
    if (success) {
      setDigitalServiceList(updatedList);
      showNotification(
        'success',
        editingService ? 'Layanan digital berhasil diperbarui!' : 'Layanan digital baru berhasil ditambahkan!'
      );
    } else {
      throw new Error('Gagal menyimpan layanan digital.');
    }
  };

  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    setIsDeletingService(true);
    const updatedList = digitalServiceList.filter((s) => s.id !== serviceToDelete.id);
    const success = await persistFooterData({ digitalServices: updatedList });
    setIsDeletingService(false);
    setServiceToDelete(null);
    if (success) {
      setDigitalServiceList(updatedList);
      showNotification('success', 'Layanan digital berhasil dihapus.');
    } else {
      showNotification('error', 'Gagal menghapus layanan digital.');
    }
  };

  const handleToggleServiceStatus = async (item: DigitalServiceItem) => {
    const isCurrentlyActive = item.status === 'ACTIVE' || item.status === 'Diterbitkan';
    const nextStatus: any = isCurrentlyActive ? 'Draft' : 'Diterbitkan';
    const updatedList: DigitalServiceItem[] = digitalServiceList.map((s) =>
      s.id === item.id
        ? {
          ...s,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: adminUser?.name || s.updatedBy || 'Admin 1',
        }
        : s
    );
    const success = await persistFooterData({ digitalServices: updatedList });
    if (success) {
      setDigitalServiceList(updatedList);
      showNotification(
        'success',
        `Status layanan ${item.nama} diubah menjadi ${nextStatus === 'ACTIVE' || nextStatus === 'Diterbitkan' ? 'Aktif' : 'Nonaktif'}`
      );
    }
  };

  // ----------------- FOOTER SECTION 4: KONTAK HANDLER -----------------
  const handleSaveKontak = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await persistFooterData({ kontak: kontakData });
    setIsSaving(false);
    if (success) {
      showNotification('success', 'Informasi Kontak Footer berhasil disimpan!');
    } else {
      showNotification('error', 'Gagal menyimpan informasi kontak.');
    }
  };

  // ----------------- ICON RENDERER HELPER -----------------
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return (
          <div className="w-7 h-7 rounded-md bg-[#ff0000] flex items-center justify-center text-white mx-auto shadow-2xs shrink-0">
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );
      case 'x':
        return (
          <div className="w-7 h-7 rounded-md bg-slate-950 flex items-center justify-center text-white mx-auto shadow-2xs shrink-0">
            <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        );
      case 'instagram':
        return (
          <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-2xs shrink-0">
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className="w-7 h-7 rounded-md bg-[#1877f2] flex items-center justify-center text-white mx-auto shadow-2xs shrink-0">
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );
      case 'tiktok':
        return (
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center text-white mx-auto shadow-2xs shrink-0">
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.37-.07 2.56-.99 2.95-2.31.25-.75.25-1.57.25-2.36V.02h-.03z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-md bg-[#00113a] flex items-center justify-center text-white mx-auto shadow-2xs shrink-0">
            <Globe className="w-3.5 h-3.5 text-white" />
          </div>
        );
    }
  };

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-7 text-[#1a1b20] overflow-x-hidden">
      {/* 1. BREADCRUMB, PAGE TITLE & SUBTITLE (WIREFRAME) */}
      <div className="space-y-1.5">

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00113a] tracking-tight font-sans">
          Kelola Halaman Utama
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Kelola konten yang tampil pada beranda Cakrawala Portal Intranet
        </p>
      </div>

      {/* Toast Alert Feedback */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium shadow-xs transition-all animate-fadeIn ${statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
            }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 2. MODERN SEGMENTED TAB BAR */}
      <div className="pt-0.5">
        <div className="inline-flex p-1 bg-slate-200/60 rounded-xl gap-1 border border-slate-300/70 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('utama')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'utama'
                ? 'bg-white text-[#00113a] shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Utama
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beranda')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'beranda'
                ? 'bg-white text-[#00113a] shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
          >
            <Layout className="w-3.5 h-3.5" />
            Beranda
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tentang')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'tentang'
                ? 'bg-white text-[#00113a] shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
          >
            <Info className="w-3.5 h-3.5" />
            Tentang
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('footer')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'footer'
                ? 'bg-white text-[#00113a] shadow-xs ring-1 ring-slate-200/80 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Footer
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB: FOOTER (STRUCTURED, POLISHED & NO HORIZONTAL SCROLL) */}
      {/* ========================================================= */}
      {activeTab === 'footer' && (
        <div className="space-y-6 text-left">

          {/* ---------------- CARD 1: DESKRIPSI FOOTER ---------------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Deskripsi Singkat Portal
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Teks pengantar yang tampil pada kolom pertama footer portal publik.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <textarea
                rows={3}
                value={footerDeskripsi}
                onChange={(e) => setFooterDeskripsi(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all leading-relaxed resize-none"
                placeholder="Tuliskan deskripsi ringkas portal intranet..."
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  {footerDeskripsi.length} karakter
                </span>
                <button
                  type="button"
                  onClick={handleSaveDeskripsi}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />Simpan</button>
              </div>
            </div>
          </section>

          {/* ---------------- CARD 2: MEDIA SOSIAL ---------------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-slate-900">
                      Media Sosial Resmi
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      {socialMediaList.length} Akun
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Daftar tautan akun media sosial resmi yang tampil di footer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSocial}
                className="inline-flex items-center justify-center gap-1.5 bg-[#007BFF] hover:bg-[#0056b3] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                + Tambah</button>
            </div>

            {/* Media Sosial Table Container (100% Fit, No Scrollbar) */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2 px-1 w-[4%] text-center">No</th>
                    <th className="py-2 px-1 w-[6%] text-center">Ikon</th>
                    <th className="py-2 px-2 w-[28%]">Nama / Platform</th>
                    <th className="py-2 px-2 w-[25%]">Tautan URL</th>
                    <th className="py-2 px-1 w-[11%] text-center">Status</th>
                    <th className="py-2 px-2 w-[15%] text-left">Diperbarui</th>
                    <th className="py-2 px-1 w-[11%] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {socialMediaList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                        Belum ada tautan media sosial. Klik tombol "Tambah Media Sosial" di atas untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    socialMediaList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* No */}
                        <td className="py-2 px-1 text-center text-[11px] font-medium text-slate-400">
                          {idx + 1}
                        </td>

                        {/* Ikon */}
                        <td className="py-2 px-1 text-center">
                          <div className="mx-auto w-fit">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.nama} className="w-5 h-5 object-cover rounded mx-auto" />
                            ) : (
                              renderSocialIcon(item.platform)
                            )}
                          </div>
                        </td>

                        {/* Nama */}
                        <td className="py-2 px-2">
                          <p className="text-[11px] font-bold text-slate-900 leading-tight truncate" title={item.nama}>
                            {item.nama}
                          </p>
                          <span className="text-[10px] text-slate-400 capitalize block truncate">
                            {item.platform}
                          </span>
                        </td>

                        {/* Link */}
                        <td className="py-2 px-2">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 max-w-full font-medium"
                            title={item.link}
                          >
                            <span className="truncate block max-w-[90%]">{item.link}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </a>
                        </td>

                        {/* Status */}
                        <td className="py-2 px-1 text-center">
                          {item.status === 'ACTIVE' || item.status === 'Diterbitkan' || item.status === 'Aktif' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                              Aktif
                            </span>
                          ) : item.status === 'Draft' || item.status === 'Nonaktif' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                              Nonaktif
                            </span>
                          ) : item.status === 'Menunggu Review' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                              Menunggu Review
                            </span>
                          ) : item.status === 'Perlu Revisi' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                              Perlu Revisi
                            </span>
                          ) : item.status === 'Diarsipkan' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                              Diarsipkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                              Nonaktif
                            </span>
                          )}
                        </td>

                        {/* Diperbarui */}
                        <td className="py-2 px-2 text-left">
                          <span className="font-semibold text-[11px] text-slate-800 block truncate" title={item.updatedBy || 'Admin'}>
                            {item.updatedBy || 'Admin 1'}
                          </span>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.updatedAt ? formatDate(item.updatedAt) : '01/01/2026'}</span>
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-2 px-1 text-center">
                          <div className="inline-flex items-center justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSocial(item)}
                              title="Edit"
                              className="p-0.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSocialToDelete(item)}
                              title="Hapus"
                              className="p-0.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSocialStatus(item)}
                              title={`Ubah status menjadi ${item.status === 'ACTIVE' || item.status === 'Diterbitkan' || item.status === 'Aktif' ? 'Nonaktif' : 'Aktif'}`}
                              className={`relative inline-flex h-3.5 w-6 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.status === 'ACTIVE' || item.status === 'Diterbitkan' || item.status === 'Aktif' ? 'bg-emerald-600' : 'bg-slate-300'
                                }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${item.status === 'ACTIVE' || item.status === 'Diterbitkan' || item.status === 'Aktif' ? 'translate-x-[13px]' : 'translate-x-0'
                                  }`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------------- CARD 3: LAYANAN DIGITAL ---------------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-slate-900">
                      Layanan Digital Terintegrasi
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      {digitalServiceList.length} Layanan
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Katalog tautan layanan perpustakaan digital nasional bagi seluruh pegawai.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddService}
                className="inline-flex items-center justify-center gap-1.5 bg-[#007BFF] hover:bg-[#0056b3] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                + Tambah</button>
            </div>

            {/* Layanan Digital Table Container (100% Fit, No Scrollbar) */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2 px-1 w-[4%] text-center">No</th>
                    <th className="py-2 px-2 w-[26%]">Nama Layanan</th>
                    <th className="py-2 px-2 w-[34%]">Tautan URL Layanan</th>
                    <th className="py-2 px-1 w-[11%] text-center">Status</th>
                    <th className="py-2 px-2 w-[14%] text-left">Diperbarui</th>
                    <th className="py-2 px-1 w-[11%] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {digitalServiceList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                        Belum ada layanan digital. Klik tombol "Tambah Layanan Digital" di atas untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    digitalServiceList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* No */}
                        <td className="py-2 px-1 text-center text-[11px] font-medium text-slate-400">
                          {idx + 1}
                        </td>

                        {/* Nama */}
                        <td className="py-2 px-2">
                          <p className="text-[11px] font-bold text-slate-900 leading-tight truncate" title={item.nama}>
                            {item.nama}
                          </p>
                        </td>

                        {/* Link */}
                        <td className="py-2 px-2">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 max-w-full font-medium"
                            title={item.link}
                          >
                            <span className="truncate block max-w-[90%]">{item.link}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                          </a>
                        </td>

                        {/* Status */}
                        <td className="py-2 px-1 text-center">
                          {item.status === 'ACTIVE' || item.status === 'Diterbitkan' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                              Aktif
                            </span>
                          ) : item.status === 'Draft' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
                              Nonaktif
                            </span>
                          ) : item.status === 'Menunggu Review' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                              Menunggu Review
                            </span>
                          ) : item.status === 'Perlu Revisi' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                              Perlu Revisi
                            </span>
                          ) : item.status === 'Diarsipkan' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                              Diarsipkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                              Nonaktif
                            </span>
                          )}
                        </td>

                        {/* Diperbarui */}
                        <td className="py-2 px-2 text-left">
                          <span className="font-semibold text-[11px] text-slate-800 block truncate" title={item.updatedBy || 'Admin'}>
                            {item.updatedBy || 'Admin 1'}
                          </span>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.updatedAt ? formatDate(item.updatedAt) : '01/01/2026'}</span>
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-2 px-1 text-center">
                          <div className="inline-flex items-center justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditService(item)}
                              title="Edit"
                              className="p-0.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setServiceToDelete(item)}
                              title="Hapus"
                              className="p-0.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleServiceStatus(item)}
                              title={`Ubah status menjadi ${item.status === 'ACTIVE' || item.status === 'Diterbitkan' ? 'Nonaktif' : 'Aktif'}`}
                              className={`relative inline-flex h-3.5 w-6 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.status === 'ACTIVE' || item.status === 'Diterbitkan' ? 'bg-emerald-600' : 'bg-slate-300'
                                }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${item.status === 'ACTIVE' || item.status === 'Diterbitkan' ? 'translate-x-[13px]' : 'translate-x-0'
                                  }`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------------- CARD 4: KONTAK ---------------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Informasi Kontak & Lokasi Gedung
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alamat resmi kantor perpustakaan, nomor telepon hotline, dan email persuratan dinas.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveKontak} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* No. Telepon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    No. Telepon / Hotline
                  </label>
                  <input
                    type="text"
                    value={kontakData.telepon}
                    onChange={(e) => setKontakData({ ...kontakData, telepon: e.target.value })}
                    placeholder="085717147303 / (021) 3814861"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Email Resmi Dinas
                  </label>
                  <input
                    type="email"
                    value={kontakData.email}
                    onChange={(e) => setKontakData({ ...kontakData, email: e.target.value })}
                    placeholder="persuratan@perpusnas.go.id"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all"
                  />
                </div>

                {/* Alamat 1 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Alamat Gedung 1 (Salemba)
                  </label>
                  <input
                    type="text"
                    value={kontakData.alamat1}
                    onChange={(e) => setKontakData({ ...kontakData, alamat1: e.target.value })}
                    placeholder="Jl. Salemba Raya No. 28A, Jakarta 10430"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all"
                  />
                </div>

                {/* Alamat 2 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    Alamat Gedung 2 (Merdeka Selatan)
                  </label>
                  <input
                    type="text"
                    value={kontakData.alamat2}
                    onChange={(e) => setKontakData({ ...kontakData, alamat2: e.target.value })}
                    placeholder="Jl. Medan Merdeka Selatan No. 11, Jakarta 10110"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />Simpan</button>
              </div>
            </form>
          </section>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: UTAMA (INFO PENTING SEBELAH HALAMAN LOGIN - WIREFRAME) */}
      {/* ========================================================= */}
      {activeTab === 'utama' && (
        <div className="space-y-8 text-left">
          {/* Section: Pemberitahuan (Wireframe) */}
          <div className="space-y-5">
            <div className="border-b-2 border-slate-200 pb-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#00113a] tracking-tight">
                Pemberitahuan
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ---------------- KOLOM KIRI: PREVIEW CARD (WIREFRAME) ---------------- */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-xl border border-slate-300/90 shadow-2xs p-6 space-y-4 min-h-[220px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {savedInfoPenting.headline || 'Pemberitahuan'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {savedInfoPenting.subheadline || 'Deskripsi atau subheadline info penting..'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      {savedInfoPenting.status === 'AKTIF' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-[#dcfce7] text-[#15803d] border border-[#86efac]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-[#fef9c3] text-[#a16207] border border-[#fde047]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ca8a04]" />
                          Menunggu
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleEditInfoPentingFromPreview}
                      className="px-4 py-1.5 rounded bg-slate-500 hover:bg-slate-600 text-white text-xs font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* ---------------- KOLOM KANAN: FORM UBAH PEMBERITAHUAN (WIREFRAME) ---------------- */}
              <div className="lg:col-span-7" id="form-ubah-info-penting">
                <div className="bg-white rounded-xl border border-slate-300/90 shadow-2xs p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Ubah Pemberitahuan
                  </h3>

                  <form onSubmit={handleSaveInfoPenting} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="info-headline-input" className="block text-xs font-semibold text-slate-800">
                        Headline
                      </label>
                      <input
                        id="info-headline-input"
                        type="text"
                        value={formInfoPenting.headline}
                        onChange={(e) => setFormInfoPenting({ ...formInfoPenting, headline: e.target.value })}
                        placeholder="Judul Pemberitahuan"
                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="info-subheadline-input" className="block text-xs font-semibold text-slate-800">
                        Subheadline
                      </label>
                      <textarea
                        id="info-subheadline-input"
                        rows={3}
                        value={formInfoPenting.subheadline}
                        onChange={(e) => setFormInfoPenting({ ...formInfoPenting, subheadline: e.target.value })}
                        placeholder="Deskripsi atau subheadline info penting.."
                        className="w-full rounded border border-slate-300 bg-white p-3 text-xs sm:text-sm text-slate-800 focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] focus:outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleCancelInfoPenting}
                        className="px-5 py-2 rounded bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 rounded bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>


        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: BERANDA (BANNER & UCAPAN SELAMAT DATANG)              */}
      {/* ========================================================= */}
      {activeTab === 'beranda' && (
        <div className="space-y-8 text-left">
          {/* ---------------- SECTION 1: BANNER ---------------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Banner Promosi & Agenda
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Banner slider pada halaman depan beranda intranet.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenAddBanner}
                className="inline-flex items-center gap-1.5 bg-[#007BFF] hover:bg-[#0056b3] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                + Tambah</button>
            </div>

            {/* Banner Table */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2 px-1 w-[4%] text-center">No.</th>
                    <th className="py-2 px-2 w-[10%]">Preview</th>
                    <th className="py-2 px-2 w-[27%]">Headline</th>
                    <th className="py-2 px-2 w-[26%]">Subheadline</th>
                    <th className="py-2 px-1 w-[11%] text-center">Status</th>
                    <th className="py-2 px-2 w-[13%] text-left">Dibuat Oleh</th>
                    <th className="py-2 px-1 w-[9%] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {banners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                        Belum ada banner yang ditambahkan. Klik tombol "Tambah Banner" di atas untuk menambahkan banner baru.
                      </td>
                    </tr>
                  ) : (
                    banners.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-1 text-center text-[11px] font-medium text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2">
                          <div className="w-16 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden relative shadow-2xs flex items-center justify-center">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.headline} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-[9px] text-slate-400 flex flex-col items-center gap-0.5">
                                <ImageIcon className="w-3 h-3" />
                                <span>Banner</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <p className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-snug">
                            {item.headline}
                          </p>
                        </td>
                        <td className="py-2 px-2">
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                            {item.subheadline || '-'}
                          </p>
                        </td>
                        <td className="py-2 px-1 text-center">
                          {item.status === 'TERBIT' ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                              Terbit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-amber-600 shrink-0" />
                              Menunggu
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-left">
                          <span className="font-semibold text-[11px] text-slate-800 block truncate">
                            {item.createdBy || 'Admin 1'}
                          </span>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.createdAt ? formatDate(item.createdAt) : '01/01/2026'}</span>
                          </span>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <div className="inline-flex items-center justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditBanner(item)}
                              title="Edit Banner"
                              className="p-0.5 rounded-md text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setBannerToDelete(item)}
                              title="Hapus Banner"
                              className="p-0.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleBannerStatus(item)}
                              title={`Ubah status menjadi ${item.status === 'TERBIT' ? 'Menunggu' : 'Terbit'}`}
                              className={`relative inline-flex h-3.5 w-6 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.status === 'TERBIT' ? 'bg-emerald-600' : 'bg-slate-300'
                                }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${item.status === 'TERBIT' ? 'translate-x-[13px]' : 'translate-x-0'
                                  }`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------------- SECTION 2: UCAPAN SELAMAT ULANG TAHUN ---------------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Ucapan Selamat Ulang Tahun
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pesan ucapan selamat ulang tahun untuk pegawai yang tampil pada halaman beranda intranet.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Card: Preview Ucapan */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between min-h-[240px]">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Live Preview
                  </span>
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <p className="text-sm font-bold text-[#00113a]">
                      {savedGreeting.headline}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {savedGreeting.subheadline || 'Deskripsi atau subheadline ucapan belum diisi.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {savedGreeting.status === 'TERBIT' ? 'Terbit' : 'Menunggu'}
                  </span>

                  <button
                    type="button"
                    onClick={handleEditUcapanFromPreview}
                    className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#00113a] border border-slate-200 text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Form
                  </button>
                </div>
              </div>

              {/* Right Card: Form Tambah / Edit Ucapan */}
              <div id="form-ucapan" className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Form Pengaturan Ucapan
                </h3>

                <form onSubmit={handleSaveUcapan} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Headline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ucapanHeadline}
                      onChange={(e) => setUcapanHeadline(e.target.value)}
                      placeholder="Selamat Ulang Tahun"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Subheadline
                    </label>
                    <textarea
                      rows={3}
                      value={ucapanSubheadline}
                      onChange={(e) => setUcapanSubheadline(e.target.value)}
                      placeholder="Doa terbaik kami untuk Bapak/Ibu di momen bertambahnya usia..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isSaving}
                      className="bg-[#00113a] text-white hover:bg-[#2a4386] font-bold px-6 shadow-xs rounded-xl cursor-pointer"
                    >
                      Simpan
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: TENTANG                                              */}
      {/* ========================================================= */}
      {activeTab === 'tentang' && (
        <div className="space-y-6 text-left">
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Informasi Halaman Tentang Portal
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur deskripsi platform, pedoman etika kedinasan, berkas latar belakang, dan buku panduan.
                </p>
              </div>
            </div>

            {/* 1. Deskripsi */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-900">
                Deskripsi Umum Platform
              </label>
              <textarea
                rows={4}
                value={tentangData.deskripsi}
                onChange={(e) => setTentangData({ ...tentangData, deskripsi: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all leading-relaxed"
                placeholder="Tuliskan deskripsi mengenai portal intranet..."
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveTentangSection('Deskripsi')}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >Simpan</button>
              </div>
            </div>

            <hr className="border-t border-slate-100" />

            {/* 2. Syarat dan Ketentuan */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-900">
                Syarat dan Ketentuan Pegawai
              </label>
              <textarea
                rows={6}
                value={tentangData.syaratKetentuan}
                onChange={(e) => setTentangData({ ...tentangData, syaratKetentuan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#00113a] focus:ring-2 focus:ring-[#00113a]/15 focus:outline-none transition-all leading-relaxed"
                placeholder="Tuliskan syarat dan ketentuan komunitas portal..."
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveTentangSection('Syarat dan Ketentuan')}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >Simpan</button>
              </div>
            </div>

            <hr className="border-t border-slate-100" />

            {/* 3. Latar Belakang & Panduan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900">
                  Berkas Gambar Latar Belakang
                </label>
                <div className="flex items-center">
                  <input
                    ref={backgroundFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTentangData({ ...tentangData, latarBelakang: file.name });
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => backgroundFileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-300 border-r-0 rounded-l-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Pilih Berkas
                  </button>
                  <div className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-r-xl text-xs text-slate-700 truncate">
                    {tentangData.latarBelakang || 'Background.png'}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">File maksimal berukuran 10MB</p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveTentangSection('Berkas Latar Belakang')}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >Simpan</button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900">
                  Berkas Panduan Aplikasi (PDF / Dokumen)
                </label>
                <div className="flex items-center">
                  <input
                    ref={panduanFileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTentangData({ ...tentangData, panduanAplikasi: file.name });
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => panduanFileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-300 border-r-0 rounded-l-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Pilih Berkas
                  </button>
                  <div className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-r-xl text-xs text-slate-700 truncate">
                    {tentangData.panduanAplikasi || 'panduan.pdf'}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">File maksimal berukuran 10MB</p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveTentangSection('Berkas Panduan Aplikasi')}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#00113a] hover:bg-[#2a4386] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >Simpan</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 5. MODALS & DIALOGS */}
      {/* Modal: Tambah/Edit Banner */}
      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSave={handleSaveBanner}
        initialData={editingBanner}
      />

      {/* Dialog: Delete Banner */}
      <ConfirmDialog
        isOpen={Boolean(bannerToDelete)}
        onClose={() => setBannerToDelete(null)}
        onConfirm={handleConfirmDeleteBanner}
        title="Hapus Banner Promosi"
        message={`Apakah Anda yakin ingin menghapus banner "${bannerToDelete?.headline}"? Banner yang dihapus tidak dapat dipulihkan kembali.`}
        confirmText="Hapus Banner"
        cancelText="Batal"
        isLoading={isDeletingBanner}
        variant="danger"
      />

      {/* Modal: Tambah/Edit Media Sosial */}
      <SocialMediaModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        onSave={handleSaveSocial}
        initialData={editingSocial}
      />

      {/* Dialog: Delete Media Sosial */}
      <ConfirmDialog
        isOpen={Boolean(socialToDelete)}
        onClose={() => setSocialToDelete(null)}
        onConfirm={handleConfirmDeleteSocial}
        title="Hapus Media Sosial"
        message={`Apakah Anda yakin ingin menghapus tautan media sosial "${socialToDelete?.nama}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeletingSocial}
        variant="danger"
      />

      {/* Modal: Tambah/Edit Layanan Digital */}
      <DigitalServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveService}
        initialData={editingService}
      />

      {/* Dialog: Delete Layanan Digital */}
      <ConfirmDialog
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleConfirmDeleteService}
        title="Hapus Layanan Digital"
        message={`Apakah Anda yakin ingin menghapus layanan digital "${serviceToDelete?.nama}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeletingService}
        variant="danger"
      />
    </div>
  );
}


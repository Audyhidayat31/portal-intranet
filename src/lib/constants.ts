import {
  MessageSquare,
  Smile,
  Globe,
  Home,
  Quote,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Trophy,
  Lightbulb,
} from 'lucide-react';

export const CATEGORIES_CONFIG = [
  { slug: 'all', name: 'Semua Kategori', icon: Sparkles, desc: 'Seluruh konten antar pegawai' },
  { slug: 'opini', name: 'Coretan Opini', icon: MessageSquare, desc: 'Gagasan dan aspirasi pegawai' },
  { slug: 'humor', name: 'Humor', icon: Smile, desc: 'Cerita santai dan canda tawa' },
  { slug: 'jelajah-bumi', name: 'Jelajah Bumi', icon: Globe, desc: 'Catatan perjalanan & wisata' },
  { slug: 'kabar-keluarga', name: 'Kabar Keluarga', icon: Home, desc: 'Warta suka duka keluarga' },
  { slug: 'kalimat-bijak', name: 'Kalimat Bijak', icon: Quote, desc: 'Kutipan mutiara & motivasi' },
  { slug: 'karya-akademik', name: 'Karya Akademik', icon: GraduationCap, desc: 'Jurnal, riset, dan ilmiah' },
  { slug: 'tips-gaya-hidup', name: 'Tips & Gaya Hidup', icon: Sparkles, desc: 'Kesehatan, ergonomi & hobi' },
  { slug: 'konsultasi', name: 'Konsultasi', icon: HelpCircle, desc: 'Layanan Kepegawaian, IT, Kesehatan' },
  { slug: 'olahraga', name: 'Olahraga', icon: Trophy, desc: 'Klub dan aktivitas olahraga' },
  { slug: 'tahukah-anda', name: 'Tahukah Anda', icon: Lightbulb, desc: 'Trivia unik kepustakaan' },
];

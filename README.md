# Cakrawala - Portal Intranet Perpustakaan Nasional RI

Sistem informasi portal intranet terpadu berbasis web untuk koordinasi kedinasan, komunikasi dan interaksi antar pegawai, publikasi informasi, pengelolaan dokumen internal, agenda kegiatan, kupas sosok, profil pegawai, dan audit jejak aktivitas sistem (*Activity Log*).

---

## Teknologi Utama (Tech Stack)

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Bahasa Pemrograman**: TypeScript / JavaScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Database**: MySQL / MariaDB (via [Prisma ORM](https://www.prisma.io/) & `@prisma/adapter-mariadb`)
- **Autentikasi & Keamanan**: JSON Web Token (JWT), HTTP-Only Cookies, `bcryptjs`, dan Google reCAPTCHA
- **Email Notification**: Nodemailer (SMTP Server)

---

## Kredensial Akun Pengguna (Login)

Berikut adalah daftar 3 akun aktif yang tersedia untuk keperluan pengujian dan operasional sistem:

| No | Nama Lengkap | NIP / Username | Kata Sandi | Email | Peran (*Role*) | Hak Akses |
|---|---|---|---|---|---|---|
| 1 | **Administrator Perpusnas** | `ADMIN001` | `admin123` | `[EMAIL_ADDRESS]` | **ADMINISTRATOR** | Akses Penuh: Portal & Panel Admin (`/admin`), Kelola Pengguna, Hak Akses, Audit Log |
| 2 | **Bambang** | `123456789` | `Pegawai123` | `[EMAIL_ADDRESS]` | **PEGAWAI** | Akses Pegawai: Buat/Baca Konten, Perjalanan Dinas, Antar Pegawai, Profil |
| 3 | **Ahmad Fauzi, S.Kom.** | `987654321` | `Pegawai123` | `[EMAIL_ADDRESS]` | **PEGAWAI** | Akses Pegawai: Buat/Baca Konten, Perjalanan Dinas, Antar Pegawai, Profil |

> **Catatan Kata Sandi:**
> - Kata sandi akun **Administrator Perpusnas** adalah `admin123`.
> - Kata sandi akun **Bambang** dan **Ahmad Fauzi** adalah `Pegawai123` (*huruf 'P' kapital*).
> - Pengguna dapat memperbarui kata sandi sewaktu-waktu melalui menu **Profil Pegawai > Ubah Kata Sandi** atau halaman **Lupa Kata Sandi**.

---

## Prasyarat Sistem (Prerequisites)

Pastikan lingkungan komputer/server Anda telah terpasang:
1. **Node.js**: Versi `v18.17.0` atau yang lebih baru (disarankan `Node.js v20.x` / `v22.x` / `v24.x`).
2. **Database MySQL / MariaDB**: Port default `3306` (misalnya menggunakan **Laragon**, **XAMPP**, atau **MySQL Community Server**).
3. **NPM / NPX**: Paket manajer bawaan Node.js.

---

## Panduan Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan portal secara lokal:

### 1. Ekstrak / Buka Direktori Proyek
Buka terminal (PowerShell / Command Prompt / Bash) pada direktori proyek:
```bash
cd portal-intranet
```

### 2. Konfigurasi Variabel Lingkungan (`.env`)
Pastikan file `.env` di direktori utama telah sesuai dengan konfigurasi database MySQL lokal Anda:
```env
DATABASE_URL=
JWT_SECRET=
PORT=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
APP_BASE_URL=
```
*(Sesuaikan username dan password MySQL pada `DATABASE_URL` jika database Anda menggunakan kata sandi).*

### 3. Siapkan Database
1. Buka database tool Anda (**phpMyAdmin**, **HeidiSQL**, **DBeaver**, atau terminal MySQL).
2. Buat database baru dengan nama `portal_intranet`:
   ```sql
   CREATE DATABASE portal_intranet;
   ```
3. Impor file cadangan skema & data awal:
   - Impor file **`portal_intranet.sql`** yang ada di direktori utama proyek ke database `portal_intranet`.

### 4. Pasang Dependensi (*Dependencies*)
Jalankan perintah berikut untuk mengunduh dan memasang seluruh paket pustaka:
```bash
npm install
```

### 5. Generate Prisma Client
Sinkronkan skema Prisma dengan klien:
```bash
npx prisma generate
```

### 6. Jalankan Aplikasi dalam Mode Pengembangan (*Development*)
Jalankan server pengembangan Next.js:
```bash
npm run dev
```
Setelah server aktif, buka peramban (*browser*) dan akses:
**`http://localhost:3000`**

---

## Menjalankan Aplikasi dalam Mode Produksi (*Production*)

Untuk menguji performa dan menjalankan aplikasi secara optimal:
```bash
# 1. Bangun bundle produksi
npm run build

# 2. Jalankan server produksi
npm run start
```

---

## Struktur Modul & Fitur Utama

- **Halaman Login & Autentikasi (`/login`)**
  - Autentikasi NIP & Kata Sandi terenkripsi bcrypt.
  - Integrasi verifikasi bot Google reCAPTCHA.
  - Widget informasi penting dinamis di sisi kanan form login.
  - Fitur Lupa Kata Sandi (`/lupa-kata-sandi`) dan Ganti Kata Sandi (`/ganti-kata-sandi`).

- **Beranda (`/beranda`)**
  - Banner dinamis & pengumuman *marquee*.
  - Widget cuaca real-time & waktu presisi.
  - Sorotan Berita, Agenda Kegiatan, dan tautan aplikasi layanan cepat Perpusnas.
  - Ucapan ulang tahun pegawai harian otomatis.

- **Kabar Kedinasan (`/kabar-kedinasan`)**
  - **Berita**: Publikasi berita terkini dan pengumuman pers kedinasan.
  - **Pengumuman**: Surat edaran dan informasi resmi kedinasan.
  - **Agenda Kegiatan**: Jadwal kegiatan dinas lengkap dengan mode kalender dan daftar.
  - **Laporan Perjalanan Dinas**: Pengajuan, pencatatan durasi tugas, kota/negara tujuan, dan lampiran berkas penugasan.
  - **Dokumen Internal**: Repositori arsip SK, peraturan, panduan teknis, dan surat tugas dengan dukungan unduh dokumen PDF.

- **Antar Pegawai (`/antar-pegawai`)**
  - Ruang berbagi artikel dan kreativitas pegawai: Coretan Opini, Karya Akademik, Tips & Gaya Hidup, Jelajah Bumi, Kabar Keluarga, Kalimat Bijak, Humor, Konsultasi, Olahraga, dan Tahukah Anda.
  - **Daftar Pegawai**: Direktori seluruh ASN & pegawai Perpusnas.

- **Kupas Sosok (`/kupas-sosok`)**
  - Artikel profil inspiratif pegawai dan tokoh teladan di lingkungan Perpusnas.

- **Profil Akun Pegawai (`/profil/akun`)**
  - Biodata, unit kerja, satuan kerja, riwayat karir, serta pengaturan kata sandi.

- **Panel Administrator (`/admin`)**
  - **Ringkasan**: Statistik konten, jumlah pembaca, dan grafik pengunjung.
  - **Kelola Konten**: Moderasi dan persetujuan status terbit/menunggu seluruh artikel.
  - **Kelola Pengguna**: Penambahan, pengubahan data profil, penetapan peran, dan penonaktifan akun.
  - **Kelola Hak Akses**: Pengaturan peran administrator, editor, dan pegawai biasa.
  - **Log Aktivitas (`/admin/log-aktivitas`)**: Pencatatan riwayat audit lengkap (Create, Update, Delete, Login, Logout) dengan pencarian otomatis via tombol *Enter*, filter peran, pagination 10 data per halaman, dan modal pop-up rincian aktivitas dengan field konten yang sinkron sesuai halaman sumber aslinya.

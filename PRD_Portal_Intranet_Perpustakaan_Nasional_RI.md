# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Pengembangan Web Portal Intranet "Cakrawala"
### Perpustakaan Nasional Republik Indonesia

**Versi**: 2.0 (Mutakhir)  
**Platform**: Web (Desktop, Tablet, Mobile)  
**Target Pengguna**: Pegawai dan Administrator Perpusnas RI  
**Status**: Implementasi & Pemutakhiran Berkelanjutan  
**Tanggal Rilis Dokumen**: 19 Oktober 2026  

---

# 1. Pendahuluan

## 1.1 Latar Belakang
Portal Intranet Perpustakaan Nasional Republik Indonesia (dikenal dengan nama portal **"Cakrawala"**) merupakan sistem informasi internal modern terintegrasi yang berfungsi sebagai episentrum penyampaian warta kedinasan, komunikasi interaktif antarpegawai, publikasi karya, direktori kepegawaian, hingga wadah berbagi kisah inspiratif keluarga besar Perpusnas RI. 

Sistem ini dikembangkan menggunakan arsitektur web modern (Next.js App Router, React 19, TypeScript, dan Prisma ORM dengan driver MariaDB/MySQL) serta dilengkapi antarmuka berstandar desain *Stitch & Clean Corporate Portal*. Portal juga menyediakan panel Administrator yang komprehensif untuk tata kelola banner beranda, hak akses, manajemen pengguna, log aktivitas terperinci, serta seluruh modul publikasi dinas dan komunitas pegawai.

## 1.2 Tujuan Produk
1. **Pusat Informasi Terpadu**: Menyediakan satu pintu resmi bagi seluruh berita, pengumuman, agenda, perjalanan dinas, dan dokumen internal Perpusnas RI.
2. **Keterbukaan & Kolaborasi Antarpegawai**: Memfasilitasi pegawai untuk berbagi opini, humor, travel story (Jelajah Bumi), warta keluarga, karya akademik, tips gaya hidup, hingga konsultasi internal (Kepegawaian, IT, Kesehatan).
3. **Dokumentasi Sosok Inspiratif**: Menyajikan modul *Kupas Sosok* yang elegan untuk mendokumentasikan kontribusi, prestasi, dan rekam jejak insan perpustakaan.
4. **Pencatatan Identitas Nyata & Audit Trail**: Merekam identitas riil pengguna (pembuat dan pengubah) secara dinamis dari akun yang terautentikasi tanpa penetapan teks statis (hardcoded).
5. **Kenyamanan & Keandalan Penyimpanan**: Menjamin penanganan berkas dan gambar beresolusi tinggi tanpa kendala kuota penyimpanan browser melalui penyimpanan basis data `LONGTEXT` yang optimal.
6. **Tata Kelola Admin yang Rapi**: Mempermudah administrator dalam mengelola banner beranda, media sosial, pengguna, serta rekam log aktivitas sistem.

---

# 2. Sasaran Pengguna & Peran (Role)

1. **Pegawai (Employee / User)**
   - Mengakses seluruh artikel kedinasan, direktori pegawai, konten komunitas antarpegawai, dan kupas sosok.
   - Menerbitkan tulisan, komentar, dan pertanyaan konsultasi sesuai hak akses.
   - Mengelola profil pribadi dan riwayat aktivitas akun.
2. **Administrator (Admin)**
   - Memiliki wewenang penuh (Superuser) dalam tata kelola portal.
   - Mengelola banner halaman utama (pengaturan kuota tampilan 5 baris dengan scrollable view), media sosial, berita dinas, dan seluruh kategori konten.
   - Mengelola akun pengguna, hak akses peran (Role Permission), dan memantau Log Aktivitas sistem secara real-time.

---

# 3. Ruang Lingkup Produk

## 3.1 Portal Pegawai
- **Autentikasi**: Login terproteksi NIP/Password, Session terenkripsi, Logout aman.
- **Beranda (Homepage)**: Hero banner dinamis, breaking news/headline, shortcut modul dinas, artikel antarpegawai pilihan, widget kupas sosok spotlight, kalender agenda, direktori ulang tahun, kutipan bijak, dan tautan jejaring resmi.
- **Kabar Kedinasan**:
  - Berita Kedinasan
  - Pengumuman Resmi
  - Agenda Kegiatan
  - Laporan Perjalanan Dinas
  - Dokumen Intern
- **Antar Pegawai**:
  - Coretan Opini Pegawai
  - Humor Pegawai
  - Jelajah Bumi (Travel & Story)
  - Kabar Keluarga
  - Kalimat Bijak
  - Karya Akademik Pegawai
  - Tips & Gaya Hidup
  - Olahraga
  - Tahukah Anda
  - Konsultasi Interaktif (Kepegawaian, IT, Kesehatan)
- **Kupas Sosok**: Profil tokoh, pahlawan literasi, dan sosok inspiratif dengan tampilan foto portrait proporsional dan narasi biografi lengkap.
- **Profil & Pegawai**: Info akun pribadi dan direktori data kepegawaian Perpusnas RI.

## 3.2 Panel Administrator
- **Dashboard & Analitik**: Ringkasan statistik konten, jumlah pegawai, dan metrik sistem.
- **Kelola Homepage**: Manajemen slider/banner beranda (tabel muat 5 item dengan scrollbar internal), tautan media sosial dinamis, dan teks sambutan hero.
- **Kelola Konten**: Moderasi, penambahan, pengeditan, serta penghapusan konten dinas, kupas sosok, dan konten antarpegawai.
- **Kelola Pengguna & Hak Akses**: Manajemen database pengguna, penugasan peran, dan konfigurasi izin akses.
- **Log Aktivitas**: Audit trail komprehensif mencatat setiap aksi penambahan, pembaruan, dan penghapusan data beserta identitas pelakunya.

---

# 4. Arsitektur Teknologi & Spesifikasi Teknis

| Komponen | Spesifikasi / Teknologi |
| :--- | :--- |
| **Framework Utama** | Next.js 16 (App Router) |
| **UI Library & Logic** | React 19, TypeScript |
| **Styling Engine** | Tailwind CSS v4, Vanilla CSS tokens, Modern Glassmorphism & Stitch Design |
| **Icons & Visuals** | Lucide React Icons |
| **ORM & Database** | Prisma ORM 7 (`@prisma/adapter-mariadb`) dengan MySQL / MariaDB |
| **Tipe Kolom Media** | `LONGTEXT` untuk gambar profil, cover, dan uraian konten berformat HTML/Base64 |
| **State & Session** | HTTP Cookies, JWT / Server Session terproteksi middleware |
| **Rich Text Editor** | ContentEditable WYSIWYG dengan sanitasi markup HTML aman |

---

# 5. Aturan Bisnis & Fungsional Mutakhir (Business Rules)

Berikut adalah daftar aturan bisnis resmi sistem yang telah diperbarui sesuai implementasi terkini:

### BR-01: Autentikasi Wajib
Pengguna wajib melakukan login menggunakan NIP dan Kata Sandi terdaftar sebelum dapat mengakses fitur dan dokumen internal portal.

### BR-02: Keunikan NIP & Identitas Akun
Nomor Induk Pegawai (NIP) bersifat unik dan bertindak sebagai pengenal utama kredensial akun pegawai.

### BR-03: Pencatatan Penulis & Editor Dinamis (No Hardcoded Names)
Sistem **tidak mengizinkan** penetapan nama statis kaku (seperti *"Humas Perpustakaan Nasional"*). Setiap konten yang dibuat dan diperbarui **wajib merekam nama asli** pengguna yang sedang login (`authorName` dan `editorName`) secara otomatis.

### BR-04: Ketentuan Modul Kupas Sosok
- **Field Wajib**: Nama Sosok / Judul dan Kisah & Perjalanan (Uraian) wajib diisi.
- **Field Opsional**: Jabatan dan Unit Kerja bersifat **opsional** (tidak wajib diisi dan tanpa tanda bintang `*`).
- **Foto Profil Sosok**: Foto profil sosok ditampilkan sebagai foto utama tokoh pada header kartu detail sosok (rasio portrait 3:4 dengan ambient framing dan pratinjau lightbox). Foto profil **tidak disusupkan** ke bagian berkas lampiran.
- **Bagian Lampiran**: Bagian LAMPIRAN murni diperuntukkan bagi berkas dokumen tambahan (PDF/DOC/Gambar pendukung). **Jika tidak ada berkas lampiran yang diunggah, bagian teks LAMPIRAN beserta garis pembatasnya disembunyikan secara otomatis** sehingga tampilan kartu tetap bersih dan rapi.
- **Urutan Tampilan Konten**: Seluruh daftar artikel Kupas Sosok diurutkan secara kronologis terbalik (`createdAt: 'desc'`) sehingga **artikel yang baru ditambahkan selalu berada di posisi paling atas kiri** pada grid tampilan.

### BR-05: Kuota Tabel Banner Halaman Utama
Pada panel Admin Kelola Homepage, tabel daftar banner beranda menampilkan **tepat 5 data pertama secara penuh** dalam kontainer berketinggian tetap, dan baris data selebihnya **dapat diakses dengan melakukan scroll ke bawah** pada tabel tanpa merusak tata letak halaman.

### BR-06: Manajemen Berkas Lampiran Tanpa Quota Storage Error
Penyimpanan berkas media dan gambar profil diintegrasikan langsung ke basis data menggunakan tipe `LONGTEXT`. Sistem dilarang menyimpan data base64 gambar berukuran besar ke dalam browser `localStorage` guna mencegah error `QuotaExceededError`. Tombol hapus berkas lampiran pada form input dibuat jelas terlihat (ikon silang merah) agar pengguna dapat membatalkan atau menghilangkan berkas yang tidak digunakan lagi sebelum disimpan.

### BR-07: Log Aktivitas Audit Trail
Setiap aktivitas pembuatan, pengubahan, atau penghapusan data penting (berita, pengumuman, kupas sosok, banner, dan pengaturan akun) secara otomatis tercatat pada tabel `log_aktivitas` lengkap dengan ID pengguna, modul, aksi, deskripsi, dan waktu kejadian.

### BR-08: Proteksi Dokumen Kedinasan
Dokumen internal dan laporan perjalanan dinas berstatus terbatas hanya dapat diunduh oleh akun pegawai aktif yang telah terautentikasi.

---

# 6. Struktur URL & Navigasi Terkini

### 6.1 Menu Portal Pengguna
- `/beranda` : Halaman Utama Portal
- `/tentang` : Informasi Profil Perpustakaan Nasional RI
- `/kabar-kedinasan/berita` : Indeks & Detail Berita Kedinasan
- `/kabar-kedinasan/pengumuman` : Pengumuman Resmi Kedinasan
- `/kabar-kedinasan/agenda` : Agenda Kegiatan & Kalender Kerja
- `/kabar-kedinasan/laporan-perjalanan` : Laporan Perjalanan Dinas Pegawai
- `/kabar-kedinasan/dokumen-intern` : Repositori Dokumen Internal
- `/kupas-sosok` : Direktori Profil Sosok Inspiratif
- `/kupas-sosok/tambah` : Form Tambah Profil Sosok
- `/kupas-sosok/[slug]` : Detail Profil Sosok
- `/kupas-sosok/[slug]/edit` : Form Ubah Profil Sosok
- `/antar-pegawai/opini` : Coretan Opini Pegawai
- `/antar-pegawai/humor` : Humor Pegawai
- `/antar-pegawai/jelajah-bumi` : Jelajah Bumi
- `/antar-pegawai/kabar-keluarga` : Kabar Keluarga
- `/antar-pegawai/kalimat-bijak` : Kalimat Bijak Inspiratif
- `/antar-pegawai/karya-akademik` : Karya Akademik & Riset
- `/antar-pegawai/tips-gaya-hidup` : Tips & Gaya Hidup Sehat
- `/antar-pegawai/olahraga` : Komunitas & Jadwal Olahraga
- `/antar-pegawai/tahukah-anda` : Fakta Unik & Trivia
- `/antar-pegawai/konsultasi` : Layanan Konsultasi Online (Kepegawaian, IT, Kesehatan)
- `/antar-pegawai/daftar-pegawai` : Direktori Pegawai Perpusnas RI
- `/profil/akun` : Manajemen Akun Pengguna

### 6.2 Menu Panel Admin
- `/admin/halaman-utama` : Pengaturan Banner (5 muat + scroll) & Media Sosial
- `/admin/pengguna` : Manajemen Data Pegawai & Akun
- `/admin/hak-akses` : Matriks Izin & Peran Sistem
- `/admin/log-aktivitas` : Pemantauan Jejak Audit Sistem

---

# 7. Log Pembaruan & Riwayat Perubahan (Changelog)

| Versi | Tanggal | Pembaruan Utama |
| :--- | :--- | :--- |
| **v1.0** | 16 Sept 2026 | Rilis inisial rancangan PRD dan analisis kebutuhan awal sistem. |
| **v1.1** | 14 Okt 2026 | Integrasi skema database relasional MariaDB/MySQL via Prisma ORM 7. |
| **v1.2** | 15 Okt 2026 | Penyempurnaan modul Kabar Kedinasan dan Antar Pegawai sesuai standar Stitch. |
| **v2.0** | 19 Okt 2026 | **Pembaruan Mutakhir Sistem**: <br>• Tabel banner beranda dibatasi 5 baris dengan scrollable body.<br>• Field Jabatan & Unit Kerja Kupas Sosok diubah menjadi opsional.<br>• Pembersihan total batas `localStorage` (`QuotaExceededError`) beralih ke `LONGTEXT`.<br>• Penghapusan penetapan statis nama instansi; digantikan oleh nama asli sesi akun.<br>• Pemisahan foto profil sosok dari seksi lampiran dan penempatan foto elegan di header.<br>• Penyembunyian otomatis seksi LAMPIRAN jika tidak ada file lampiran yang diunggah.<br>• Pengurutan artikel terbaru Kupas Sosok selalu berada di posisi paling atas kiri (`createdAt: desc`). |

---

*Dokumen PRD ini merupakan acuan resmi yang mencerminkan kondisi implementasi fungsional dan teknis terkini dari Portal Intranet Perpustakaan Nasional Republik Indonesia.*

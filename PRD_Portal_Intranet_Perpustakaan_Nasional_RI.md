# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Pengembangan Web Portal Intranet "Cakrawala"
### Perpustakaan Nasional Republik Indonesia

**Versi**: 2.5 (Final Release)  
**Platform**: Web (Desktop)  
**Target Pengguna**: Pegawai dan Administrator Perpusnas RI  
**Status**: Siap Produksi (*Production Ready*)  
**Tanggal Pemutakhiran**: 30 Oktober 2026  

---

# 1. Pendahuluan

## 1.1 Latar Belakang
Portal Intranet Perpustakaan Nasional Republik Indonesia (dikenal dengan nama portal **"Cakrawala"**) merupakan sistem informasi internal terpadu yang berfungsi sebagai episentrum penyampaian warta kedinasan, komunikasi interaktif antarpegawai, publikasi karya dan riset, repositori dokumen kedinasan, direktori kepegawaian, hingga wadah berbagi kisah inspiratif keluarga besar Perpusnas RI.

Sistem ini dikembangkan menggunakan arsitektur web modern (**Next.js 16 App Router**, **React**, **TypeScript**, dan **Prisma ORM** dengan database **MySQL / MariaDB**) serta dilengkapi antarmuka berstandar desain *Stitch & Clean Corporate Portal*. Portal juga menyediakan panel Administrator yang komprehensif untuk tata kelola banner beranda, hak akses, manajemen pengguna, log audit aktivitas sistem yang tersinkronisasi, serta seluruh modul publikasi dinas dan komunitas pegawai.

## 1.2 Tujuan Produk
1. **Pusat Informasi Terpadu**: Menyediakan satu pintu resmi bagi seluruh berita, pengumuman, agenda kegiatan, laporan perjalanan dinas, dan repositori dokumen internal Perpusnas RI.
2. **Keterbukaan & Kolaborasi Antarpegawai**: Memfasilitasi pegawai untuk berbagi opini, humor, travel story (Jelajah Bumi), warta keluarga, karya akademik, tips gaya hidup, konsultasi internal, hingga direktori pegawai.
3. **Dokumentasi Sosok Inspiratif**: Menyajikan modul *Kupas Sosok* yang elegan untuk mendokumentasikan kontribusi, prestasi, dan rekam jejak insan perpustakaan.
4. **Pencatatan Identitas Nyata & Audit Trail**: Merekam identitas riil pengguna (pembuat dan pengubah) secara dinamis dari akun yang terautentikasi tanpa penetapan teks statis (*hardcoded*).
5. **Keamanan & Akuntabilitas**: Melindungi sistem dengan autentikasi NIP, enkripsi kata sandi `bcryptjs`, token JWT, Google reCAPTCHA, serta pencatatan audit aktivitas komprehensif.
6. **Sinkronisasi Rincian Aktivitas Sesuai Sumber**: Menyajikan pop-up rincian log aktivitas dengan field konten yang dinamis dan sinkron persis dengan modul halaman aslinya.

---

# 2. Sasaran Pengguna & Peran (Role)

1. **Pegawai (Employee / User)**
   - Mengakses seluruh artikel kedinasan, direktori pegawai, konten komunitas antarpegawai, dan kupas sosok.
   - Menerbitkan tulisan, komentar, laporan perjalanan dinas, dan pertanyaan konsultasi sesuai hak akses.
   - Mengelola profil pribadi, unit kerja, serta pengaturan kata sandi akun.
2. **Administrator (Admin)**
   - Memiliki wewenang penuh (*Superuser*) dalam tata kelola portal dan panel administrasi (`/admin`).
   - Mengelola banner halaman utama (pembatasan 5 data tampilan dengan scrollable view), media sosial dinamis, dan moderasi publikasi konten.
   - Mengelola akun pengguna (*User Management*), konfigurasi hak akses peran (*Role Permissions*), dan memantau Log Aktivitas sistem secara real-time.

---

# 3. Kredensial Akun Default Sistem

Sistem menyediakan 3 akun aktif utama untuk keperluan operasional dan verifikasi:

| No | Nama Akun | NIP / Username | Kata Sandi | Email | Peran (*Role*) | Cakupan Akses |
|:---:|---|---|---|---|:---:|---|
| 1 | **Administrator Perpusnas** | `ADMIN001` | `admin123` | `admin@perpusnas.go.id` | **ADMINISTRATOR** | Akses Penuh: Portal Publik & Panel Admin (`/admin`), Kelola Pengguna, Hak Akses, Log Audit |
| 2 | **Bambang** | `123456789` | `Pegawai123` | `argabudim@gmail.com` | **PEGAWAI** | Akses Pegawai: Buat/Baca Konten, Perjalanan Dinas, Antar Pegawai, Profil |
| 3 | **Ahmad Fauzi, S.Kom.** | `987654321` | `Pegawai123` | `argabudi02@gmail.com` | **PEGAWAI** | Akses Pegawai: Buat/Baca Konten, Perjalanan Dinas, Antar Pegawai, Profil |

---

# 4. Ruang Lingkup Produk

## 4.1 Portal Publik & Pegawai
- **Autentikasi & Akun**: Login NIP/Kata Sandi, verifikasi Google reCAPTCHA, proteksi JWT cookie, fitur Lupa Kata Sandi (`/lupa-kata-sandi`), dan Ganti Kata Sandi (`/ganti-kata-sandi`).
- **Beranda (Homepage)**: Hero banner dinamis, teks sambutan, pengumuman *running text*, widget cuaca & waktu real-time, sorotan berita, agenda kegiatan, link cepat aplikasi layanan, direktori ulang tahun pegawai, dan kutipan bijak.
- **Kabar Kedinasan**:
  - **Berita**: Indeks berita, pembaca artikel, galeri foto, dan pencatatan sumber warta.
  - **Pengumuman**: Surat edaran resmi, lampiran berkas dinas, dan pengumuman kedinasan.
  - **Agenda Kegiatan**: Kalender jadwal interaktif dan daftar kegiatan kedinasan.
  - **Laporan Perjalanan Dinas**: Formulir pengajuan dan pelaporan penugasan dinas lengkap dengan field Keperluan, Tanggal Mulai, Durasi Penugasan, Nama Pegawai, Kota/Kab Tujuan, Negara Tujuan, Lampiran, dan Uraian kegiatan.
  - **Dokumen Internal**: Repositori arsip SK, peraturan, panduan teknis, dan surat tugas dengan dukungan unduh dokumen PDF (maksimal 5MB per file).
- **Antar Pegawai**:
  - Coretan Opini Pegawai
  - Karya Akademik Pegawai
  - Tips & Gaya Hidup Sehat
  - Jelajah Bumi (Travel & Story)
  - Kabar Keluarga
  - Kalimat Bijak Inspiratif
  - Humor Pegawai
  - Konsultasi Interaktif (Kepegawaian, IT, Kesehatan)
  - Olahraga
  - Tahukah Anda
  - **Daftar Pegawai**: Direktori seluruh ASN & pegawai Perpusnas RI.
- **Kupas Sosok**: Profil tokoh inspiratif dengan foto portrait elegan, biografi, kutipan, dan dokumen pendukung.
- **Profil Pegawai (`/profil/akun`)**: Biodata, unit kerja, satuan kerja, riwayat karir, serta form ubah kata sandi terverifikasi.

## 4.2 Panel Administrator (`/admin`)
- **Ringkasan (Dashboard)**: Statistik konten, jumlah pembaca, metrik artikel, dan grafik pengunjung.
- **Halaman Utama**: Tata kelola banner beranda (kuota 5 item tampilan + scrollbar), tautan media sosial, dan info penting login.
- **Kelola Konten**: Moderasi, persetujuan status publikasi (Terbit/Menunggu), penambahan, dan penyuntingan konten.
- **Kelola Pengguna (`/admin/pengguna`)**: Penambahan pegawai baru, edit biodata/unit kerja, penetapan peran, reset kata sandi, dan hapus akun.
- **Kelola Hak Akses (`/admin/hak-akses`)**: Matriks izin akses dan hak kelola modul per peran.
- **Log Aktivitas (`/admin/log-aktivitas`)**: Jejak audit sistem komprehensif dengan filter peran, pencarian Enter, pagination 10 data per halaman, dan modal pop-up rincian aktivitas dinamis.

---

# 5. Arsitektur Teknologi & Spesifikasi Teknis

| Komponen | Spesifikasi / Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework Utama** | Next.js 16 (App Router) | Mode Webpack & Turbopack |
| **Bahasa Pemrograman** | TypeScript / JavaScript (Node.js v20+) | Strict Type Safety |
| **UI & Styling** | Tailwind CSS & Lucide React Icons | Modern Stitch Design |
| **ORM & Database** | Prisma ORM 7 (`@prisma/adapter-mariadb`) | MySQL / MariaDB (Port 3306) |
| **Media & Berkas** | Base64 Data URI & Path Lokal | Penyimpanan database `LONGTEXT` |
| **Autentikasi** | JSON Web Token (JWT) & HTTP-Only Cookie | Sesi terproteksi middleware |
| **Keamanan Bot** | Google reCAPTCHA v2 / v3 | Verifikasi token pada form login |
| **Layanan Email** | Nodemailer (SMTP Authentication) | `smtpauth.mail.go.id:587` |

---

# 6. Aturan Bisnis & Fungsional Mutakhir (Business Rules)

### BR-01: Autentikasi & Keamanan Wajib
Pengguna wajib login menggunakan NIP dan Kata Sandi terdaftar serta menyelesaikan verifikasi Google reCAPTCHA sebelum dapat mengakses fitur dan dokumen internal.

### BR-02: Keunikan NIP & Identitas Akun
Nomor Induk Pegawai (NIP) bersifat unik di seluruh database dan bertindak sebagai pengenal utama kredensial akun pegawai.

### BR-03: Pencatatan Penulis & Editor Dinamis (No Hardcoded Names)
Sistem tidak mengizinkan penetapan nama statis buatan. Setiap konten yang dibuat dan diperbarui wajib merekam nama asli pengguna yang sedang login (`authorName` dan `editorName`) secara otomatis.

### BR-04: Ketentuan Modul Kupas Sosok
- **Field Wajib**: Nama Sosok dan Kisah & Perjalanan (Uraian) wajib diisi.
- **Field Opsional**: Jabatan dan Unit Kerja bersifat opsional. Dropdown Unit Kerja menggunakan style yang sama persis dengan dropdown Satuan Kerja.
- **Tata Letak Form Edit**: Posisi tombol "Simpan" dan "Keluar" berada di sebelah kiri bawah formulir.
- **Foto Profil Sosok**: Ditampilkan sebagai foto utama tokoh pada header kartu detail (rasio portrait 3:4 dengan ambient framing). Foto profil tidak digabungkan ke bagian lampiran.
- **Bagian Lampiran**: Jika tidak ada berkas lampiran yang diunggah, bagian teks LAMPIRAN disembunyikan secara otomatis.
- **Urutan Tampilan Konten**: Seluruh daftar artikel Kupas Sosok diurutkan kronologis terbalik (`createdAt: desc`), artikel terbaru selalu berada di posisi paling atas kiri.

### BR-05: Kuota Tabel Banner Halaman Utama
Pada panel Admin Kelola Halaman Utama, tabel daftar banner menampilkan tepat 5 data pertama secara penuh dalam kontainer berketinggian tetap, dan baris data selebihnya dapat diakses dengan melakukan scroll ke bawah tanpa merusak tata letak.

### BR-06: Manajemen Berkas & Dokumen Bebas Error Quota
Penyimpanan berkas media dan gambar profil diintegrasikan langsung ke basis data menggunakan tipe `LONGTEXT`. Dilarang menyimpan data base64 gambar berukuran besar ke dalam browser `localStorage` guna mencegah error `QuotaExceededError`. Ukuran berkas dokumen internal dibatasi maksimal 5MB per berkas.

### BR-07: Log Aktivitas Audit Trail Komprehensif
Setiap aktivitas sistem (Create, Update, Delete, Login, Logout) dicatat secara otomatis pada tabel `log_aktivitas` lengkap dengan ID pengguna, modul, aksi, deskripsi, alamat IP, user agent, dan waktu kejadian.

### BR-08: Pencarian Log Aktivitas Berbasis Tombol Enter
Pada halaman Log Aktivitas (`/admin/log-aktivitas`), input pencarian otomatis mengeksekusi pencarian saat pengguna menekan tombol **Enter** pada keyboard tanpa mengharuskan pengguna mengklik tombol "Cari". Tombol "Reset" mengembalikan seluruh filter ke kondisi semula.

### BR-09: Tampilan Modul Log Aktivitas Sesuai Front-End Portal
Nama modul yang tampil pada tabel Log Aktivitas tidak menggunakan kode enum backend mentah (misal: bukan `INTERNAL_DOCUMENT`), melainkan diselaraskan dengan nama navigasi resmi portal intranet (misal: *Dokumen Internal*, *Laporan Perjalanan Dinas*, *Berita*, *Pengumuman*, *Coretan Opini*, *Tips & Gaya Hidup*, dll.).

### BR-10: Sinkronisasi Dinamis Field Detail Aktivitas
Bagian **DETAIL AKTIVITAS** pada pop-up modal Rincian Aktivitas menampilkan field konten yang dinamis dan sinkron sesuai modul aslinya:
- **Laporan Perjalanan Dinas**: Menampilkan field `Keperluan`, `Tanggal Mulai`, `Durasi Penugasan` (*format: dd/mm/yyyy Hingga dd/mm/yyyy*), `Nama Pegawai`, `Kota/Kab Tujuan`, `Negara Tujuan`, dan `Lampiran`.
- **Dokumen Internal**: Menampilkan `Judul Dokumen`, `Nomor Dokumen`, `Jenis Dokumen`, `Tanggal`, dan `Lampiran`.
- **Agenda Kegiatan**: Menampilkan `Judul Agenda`, `Lokasi`, `Tanggal Pelaksanaan`, `Gambar`, dan `Lampiran`.
- **Kupas Sosok**: Menampilkan `Nama Sosok`, `Jabatan`, `Unit Kerja`, `Foto Profil`, `Lampiran`, dan `Kutipan`.
- **Antar Pegawai**: Menampilkan `Judul`, `Kategori`, `Penulis`, `Tanggal`, `Gambar`, dan `Lampiran`.
- **Pengumuman**: Menampilkan `Judul`, `Tanggal`, `Lampiran`, dan `Gambar`.
- **Berita**: Menampilkan `Judul`, `Sumber`, `Tanggal`, `Gambar`, dan `Lampiran`.
- **Kelola Pengguna**: Menampilkan `Nama Pengguna`, `NIP`, `Email`, `Peran`, dan `Unit Kerja`.
- **Kelola Hak Akses**: Menampilkan `Peran` dan `Deskripsi Peran`.

### BR-11: Posisi Status dan Uraian/ Deskripsi Tetap Atas-Bawah
Pada modal pop-up Rincian Aktivitas, posisi **Status** (badge *Menunggu* / *Terbit*) dan **Uraian/ Deskripsi** wajib selalu berada di posisi paling bawah kontainer detail aktivitas, tersusun rapi secara vertikal (Status di atas, Uraian/Deskripsi di bawahnya).

### BR-12: Ekspansi Uraian/ Deskripsi dengan Toggle Chevron Lebar
Field Uraian/Deskripsi pada modal rincian aktivitas menampilkan teks lengkap isi uraian (bukan cuplikan singkat). Jika teks melebihi batas ringkas, disediakan tombol toggle berbentuk ikon **"v" lebar** (*chevron down*) yang ketika diklik akan membuka teks uraian secara menyeluruh (*scrollable*), dan dapat ditutup kembali.

### BR-13: Pemisahan Berkas Lampiran Individual
Pada modal rincian aktivitas, setiap berkas lampiran dipisahkan satu per satu dengan penamaan berkas yang rapi dan dapat diklik langsung untuk melihat atau mengunduh dokumen.

---

# 7. Struktur Rute & Navigasi

### 7.1 Halaman Pengguna & Portal Publik
- `/login` : Autentikasi Pengguna & Info Penting
- `/lupa-kata-sandi` : Pengajuan Reset Kata Sandi
- `/ganti-kata-sandi` : Penetapan Kata Sandi Baru
- `/beranda` : Halaman Utama Portal Intranet
- `/tentang` : Profil Perpustakaan Nasional RI
- `/kabar-kedinasan/berita` : Indeks & Detail Berita Kedinasan
- `/kabar-kedinasan/pengumuman` : Surat Edaran & Pengumuman
- `/kabar-kedinasan/agenda` : Kalender & Daftar Agenda Kegiatan
- `/kabar-kedinasan/laporan-perjalanan` : Modul Laporan Perjalanan Dinas
- `/kabar-kedinasan/dokumen-intern` : Repositori Dokumen Internal
- `/kupas-sosok` : Direktori Profil Sosok Inspiratif
- `/kupas-sosok/tambah` : Formulir Tambah Profil Sosok
- `/kupas-sosok/[slug]` : Halaman Detail Profil Sosok
- `/kupas-sosok/[slug]/edit` : Formulir Edit Profil Sosok
- `/antar-pegawai/opini` : Coretan Opini Pegawai
- `/antar-pegawai/humor` : Humor Pegawai
- `/antar-pegawai/jelajah-bumi` : Jelajah Bumi
- `/antar-pegawai/kabar-keluarga` : Kabar Keluarga
- `/antar-pegawai/kalimat-bijak` : Kalimat Bijak Inspiratif
- `/antar-pegawai/karya-akademik` : Karya Akademik Pegawai
- `/antar-pegawai/tips-gaya-hidup` : Tips & Gaya Hidup
- `/antar-pegawai/olahraga` : Komunitas Olahraga
- `/antar-pegawai/tahukah-anda` : Fakta Unik & Trivia
- `/antar-pegawai/konsultasi` : Konsultasi Kepegawaian, IT, Kesehatan
- `/antar-pegawai/daftar-pegawai` : Direktori ASN & Pegawai
- `/profil/akun` : Manajemen Akun & Kata Sandi Pegawai

### 7.2 Panel Administrator
- `/admin/halaman-utama` : Pengaturan Slider Beranda & Media Sosial
- `/admin/pengguna` : Manajemen Data Pegawai & Akun
- `/admin/hak-akses` : Matriks Peran & Hak Izin
- `/admin/log-aktivitas` : Pemantauan Jejak Audit & Rincian Aktivitas

---

# 8. Log Pembaruan & Riwayat Perubahan (Changelog)

| Versi | Tanggal | Pembaruan Utama |
| :--- | :--- | :--- |
| **v1.0** | 16 Sept 2026 | Rilis inisial rancangan PRD dan analisis kebutuhan awal sistem. |
| **v1.1** | 14 Okt 2026 | Integrasi skema database relasional MariaDB/MySQL via Prisma ORM 7. |
| **v1.2** | 15 Okt 2026 | Penyempurnaan modul Kabar Kedinasan dan Antar Pegawai sesuai standar Stitch. |
| **v2.0** | 19 Okt 2026 | Pembatasan tabel banner beranda 5 baris, field opsional Kupas Sosok, dan migrasi `LONGTEXT` untuk mencegah `QuotaExceededError`. |
| **v2.1** | 22 Okt 2026 | Penyesuaian style dropdown Unit Kerja Kupas Sosok sama dengan Satuan Kerja, dan pemindahan posisi tombol Simpan & Keluar ke kiri bawah form edit. |
| **v2.2** | 26 Okt 2026 | Penggantian label "Uraian / Cuplikan Konten" menjadi "Uraian/ Deskripsi" pada modal pop-up Log Aktivitas. |
| **v2.3** | 28 Okt 2026 | Implementasi teks lengkap Uraian/Deskripsi dengan tombol toggle ekspansi ikon "v" lebar (*chevron down*), pemisahan nama file lampiran satu per satu, dan fungsi eksekusi pencarian dengan tombol *Enter*. |
| **v2.4** | 29 Okt 2026 | Standardisasi nama modul pada tabel Log Aktivitas agar sesuai dengan nama front-end portal publik (bukan string enum database mentah). |
| **v2.5** | 30 Okt 2026 | **Rilis Final**: <br>• Sinkronisasi dinamis field konten Detail Aktivitas sesuai halaman sumber aslinya (Laporan Perjalanan Dinas menampilkan Keperluan, Tanggal Mulai, Durasi Penugasan, Nama, Kota/Kab Tujuan, Negara Tujuan, Lampiran; Dokumen Internal menampilkan Judul, Nomor Dokumen, Jenis Dokumen, Tanggal, Lampiran, dst).<br>• Penetapan posisi Status dan Uraian/Deskripsi konsisten bertumpuk atas-bawah.<br>• Dokumentasi kredensial login akun aktif (Admin, Bambang, Ahmad Fauzi) dan pembuatan panduan rilis [README.md](file:///d:/Users/Lenovo/Documents/portal-intranet/README.md). |

---

*Dokumen PRD ini merupakan acuan resmi yang mencerminkan spesifikasi fungsional, aturan bisnis, dan arsitektur teknis mutakhir dari Portal Intranet Perpustakaan Nasional Republik Indonesia.*

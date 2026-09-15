**PRODUCT REQUIREMENT DOCUMENT (PRD)**

**Pengembangan Web Portal Intranet Perpustakaan Nasional Republik Indonesia**

Versi: 1.0
Platform: Web
Target Pengguna: Pegawai dan Administrator
Status: Rancangan / Pengembangan

# 1. Pendahuluan

## 1.1 Latar Belakang

Portal Intranet Perpustakaan Nasional Republik Indonesia merupakan sistem informasi internal yang digunakan sebagai media penyampaian informasi, komunikasi, publikasi, dan interaksi antarpegawai. Sistem dikembangkan untuk menyediakan satu portal terintegrasi bagi pegawai dalam mengakses informasi kedinasan, profil pegawai, artikel, konten antarpegawai, konsultasi, serta berbagai informasi internal lainnya. Sistem juga menyediakan panel Administrator untuk mengelola homepage, pengguna, hak akses, konten, dan aktivitas sistem.

## 1.2 Tujuan Produk

1\. Menyediakan pusat informasi internal Perpusnas RI.

2\. Mempermudah pegawai memperoleh informasi kedinasan.

3\. Memfasilitasi komunikasi dan berbagi informasi antarpegawai.

4\. Menyediakan direktori serta informasi pegawai.

5\. Menampilkan profil dan perjalanan karier pegawai.

6\. Menyediakan konten informatif dan inspiratif.

7\. Mempermudah administrator dalam mengelola konten portal.

8\. Menerapkan sistem autentikasi dan hak akses yang aman.

9\. Menyediakan sistem yang responsif dan mudah digunakan.

# 2. Sasaran Pengguna

## 2.1 Role

Pegawai: pengguna internal yang mengakses informasi dan fitur interaksi portal.

Administrator: pengelola sistem yang memiliki hak untuk mengelola pengguna, hak akses, homepage, dan konten.

# 3. Ruang Lingkup Produk

## 3.1 Portal Pegawai

Login; Beranda/Homepage; Profil; Info Akun Pengguna; Pegawai Perpusnas; Kupas Sosok; Kabar Kedinasan; Antar Pegawai; Logout.

## 3.2 Panel Administrator

Login; Homepage; Info Admin; Tentang; Kabar Kedinasan; Antar Pegawai; Kupas Sosok; Kelola Homepage; Kelola Hak Akses; Kelola Pengguna; Log Aktivitas; Logout.

# 4. Struktur Navigasi

## 4.1 Navigasi Pegawai

Login → Beranda/Homepage → Profil → Info Akun Pengguna / Pegawai Perpusnas; Kabar Kedinasan → Berita / Pengumuman / Agenda Kegiatan / Laporan Perjalanan Dinas / Dokumen Intern; Antar Pegawai → Coretan Opini Pegawai / Humor / Jelajah Bumi / Kabar Keluarga / Kalimat Bijak / Karya Akademik Pegawai / Tips dan Gaya Hidup / Konsultasi Kepegawaian / Konsultasi IT / Konsultasi Kesehatan / Olahraga / Tahukah Anda; Kupas Sosok; Logout.

## 4.2 Navigasi Administrator

Login → Beranda/Homepage → Info Admin / Tentang / Kabar Kedinasan / Antar Pegawai / Kupas Sosok / Admin → Kelola Homepage / Kelola Hak Akses / Kelola Pengguna / Log Aktivitas → Logout.

# 5. Modul Fungsional

## 5.1 Login

Input NIP dan password. Sistem memvalidasi kredensial. Jika valid, sistem membuat session dan mengarahkan pengguna ke Beranda. Jika tidak valid, sistem menampilkan pesan error dan mengembalikan pengguna ke form login.

## 5.2 Beranda/Homepage

Menampilkan navbar, informasi pengguna, berita terbaru, konten Antar Pegawai terbaru, Kupas Sosok, direktori, kalimat bijak, informasi ulang tahun, statistik, dan footer.

## 5.3 Profil

Info Akun Pengguna menampilkan identitas akun. Pegawai Perpusnas menampilkan data pegawai seperti nama, foto, NIP, jabatan, unit kerja, pendidikan, riwayat pekerjaan, dan prestasi.

## 5.4 Kupas Sosok

Menampilkan profil pegawai yang memiliki pengalaman, prestasi, kontribusi, atau cerita inspiratif.

## 5.5 Kabar Kedinasan

Kategori: Berita, Pengumuman, Agenda Kegiatan, Laporan Perjalanan Dinas, dan Dokumen Intern.

## 5.6 Antar Pegawai

Kategori: Coretan Opini Pegawai, Humor, Jelajah Bumi, Kabar Keluarga, Kalimat Bijak, Karya Akademik Pegawai, Tips dan Gaya Hidup, Konsultasi Kepegawaian, Konsultasi IT, Konsultasi Kesehatan, Olahraga, dan Tahukah Anda.

## 5.7 Administrator

Administrator dapat mengelola homepage, pengguna, hak akses, konten Kabar Kedinasan, Antar Pegawai, Kupas Sosok, serta melihat Log Aktivitas.

# 6. Business Rules

## 6.1 Aturan

BR-01: Pengguna wajib login sebelum mengakses fitur internal.

BR-02: NIP harus unik.

BR-03: Pengguna hanya dapat mengakses fitur sesuai role.

BR-04: Panel administrator hanya dapat diakses administrator.

BR-05: Session dihapus ketika logout.

BR-06: Konten memiliki status aktif/nonaktif.

BR-07: Perubahan data administrator dicatat pada log aktivitas.

BR-08: Dokumen internal tidak boleh dapat diakses tanpa autentikasi.

# 7. Kebutuhan Non-Fungsional

## 7.1 Security

Password tidak disimpan plaintext; password di-hash; session aman; URL admin dilindungi; hak akses diverifikasi pada backend; dokumen internal dilindungi.

## 7.2 Performance dan Usability

Halaman dimuat dengan cepat, gambar dioptimasi, query database efisien, navigasi sederhana dan mudah dipahami.

## 7.3 Responsive dan Availability

Website mendukung desktop, laptop, tablet, dan smartphone serta ditargetkan memiliki availability tinggi.

# 8. Acceptance Criteria

## 8.1 Pegawai

Login berhasil dengan NIP/password valid; kredensial salah ditolak; session dibuat setelah login; homepage dapat diakses; seluruh modul pegawai tersedia; logout menghapus session.

## 8.2 Administrator

Admin dapat login; dashboard/menu admin dapat diakses; admin dapat mengelola homepage, pengguna, hak akses, konten, dan log aktivitas; logout berfungsi.

# 9. UML – Ringkasan Use Case

## 9.1 Pegawai

Login; Beranda/Homepage; Profil; Info Akun Pengguna; Pegawai Perpusnas; Kupas Sosok; Kabar Kedinasan; Berita; Pengumuman; Agenda Kegiatan; Laporan Perjalanan Dinas; Dokumen Intern; Antar Pegawai; Logout.

## 9.2 Administrator

Login; Beranda/Homepage; Info Admin; Tentang; Kabar Kedinasan; Antar Pegawai; Kupas Sosok; Admin; Kelola Homepage; Kelola Hak Akses; Kelola Pengguna; Log Aktivitas; Logout.

# 10. Activity Flow

## 10.1 Login Pegawai

START → Buka Halaman Login → Tampilkan Form Login → Input NIP & Password → Klik Login → Validasi → Jika valid: Buat Session → Beranda → Aktivitas → Logout → Hapus Session → Redirect Login → END. Jika tidak valid: tampilkan error → kembali ke Form Login.

## 10.2 Administrator

START → Buka Login → Input NIP & Password Admin → Validasi Akun & Level Hak Akses → Jika valid: Session Admin → Beranda/Menu Admin → Pilih Pengelolaan → Kelola data → Validasi → Simpan ke Database → Catat Log Aktivitas → Kelola data lain atau Logout → Hapus Session → Redirect Login → END.

# 11. Matriks Hak Akses

## 11.1 Hak Akses

Fitur Pegawai Admin

Login Ya Ya

Beranda Ya Ya

Profil Ya Ya

Kupas Sosok Ya Ya

Kabar Kedinasan Ya Ya

Antar Pegawai Ya Ya

Logout Ya Ya

Kelola Homepage Tidak Ya

Kelola Pengguna Tidak Ya

Kelola Hak Akses Tidak Ya

Log Aktivitas Tidak Ya

CRUD Konten Terbatas Ya

# 12. Struktur Data Utama

## 12.1 Entitas

USER: id, nip, nama, email, password, foto, jabatan, unit\_kerja, role, status.

CONTENT: id, title, slug, content, category, image, author\_id, status, created\_at, updated\_at.

CATEGORY: id, name, type.

ACTIVITY\_LOG: id, user\_id, action, module, ip\_address, created\_at.

# 13. Struktur URL yang Direkomendasikan

## 13.1 Portal

/login

/beranda

/kabar-kedinasan/berita

/kabar-kedinasan/pengumuman

/kabar-kedinasan/agenda

/kabar-kedinasan/laporan-perjalanan

/kabar-kedinasan/dokumen-intern

/antar-pegawai/opini

/antar-pegawai/humor

/antar-pegawai/jelajah-bumi

/antar-pegawai/kabar-keluarga

/antar-pegawai/kalimat-bijak

/antar-pegawai/karya-akademik

/antar-pegawai/tips-gaya-hidup

/antar-pegawai/konsultasi

/antar-pegawai/olahraga

/antar-pegawai/tahukah-anda

/profil/akun

/profil/pegawai

/kupas-sosok

/admin/dashboard

/admin/homepage

/admin/pengguna

/admin/hak-akses

/admin/kabar-kedinasan

/admin/antar-pegawai

/admin/kupas-sosok

/admin/log-aktivitas

# 14. Catatan Penyelarasan

## 14.1 UML vs SRS

1\. UML yang dikirim tidak menampilkan use case Register, sehingga PRD ini tidak menetapkan registrasi mandiri sebagai fitur utama.

2\. Akun pegawai disarankan dikelola administrator untuk konteks intranet.

3\. Pada UML Admin terdapat label Coretan Opini Pegawai yang muncul ganda; PRD menggunakan daftar kategori yang konsisten.

4\. Validasi level hak akses pada Activity Diagram dipertahankan sebagai bagian penting dari keamanan.

5\. CRUD administrator ditetapkan sebagai kebutuhan pengelolaan data.

# 15. Catatan Implementasi

## 15.1 Prinsip

PRD ini digunakan sebagai dasar implementasi website. Detail UI/UX, desain visual, ERD, API, dan spesifikasi teknis dapat dibuat sebagai dokumen lanjutan tanpa mengubah alur dan kebutuhan utama yang telah ditetapkan pada UML dan SRS.

-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: portal_intranet
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `balasan_konsultasi`
--

DROP TABLE IF EXISTS `balasan_konsultasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `balasan_konsultasi` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topicId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `replyText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAdminReply` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `balasan_konsultasi_topicId_fkey` (`topicId`),
  KEY `balasan_konsultasi_authorId_fkey` (`authorId`),
  CONSTRAINT `balasan_konsultasi_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `balasan_konsultasi_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topik_konsultasi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balasan_konsultasi`
--

LOCK TABLES `balasan_konsultasi` WRITE;
/*!40000 ALTER TABLE `balasan_konsultasi` DISABLE KEYS */;
INSERT INTO `balasan_konsultasi` VALUES ('cmuaohn1v003jzbpbqninp7ez','cmuaohn1v003hzbpb9qvd0lp3','cmuaohmus001ezbpbyejw0jab','Batas waktu pengunggahan dokumen kelengkapan di aplikasi SI-ASN adalah tanggal 31 Agustus 2026 pukul 23.59 WIB. Tim penilai akan memverifikasi pada minggu pertama September.',1,'2026-09-21 03:21:15.763'),('cmuaohn28003nzbpb1ublxa47','cmuaohn28003lzbpbh851jkkc','cmuaohmus001ezbpbyejw0jab','Halo Pak Bambang, silakan perbarui client OpenVPN ke versi 2.6.8 dan gunakan profil konfigurasi VPN-Cluster-B yang baru diunduh dari modul Dokumen Intern.',1,'2026-09-21 03:21:15.776');
/*!40000 ALTER TABLE `balasan_konsultasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `izin`
--

DROP TABLE IF EXISTS `izin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `izin` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `izin_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `izin`
--

LOCK TABLES `izin` WRITE;
/*!40000 ALTER TABLE `izin` DISABLE KEYS */;
INSERT INTO `izin` VALUES ('cmuaohmk10002zbpbns7h3sta','USERS_MANAGE','USERS','Mengelola data pengguna dan NIP'),('cmuaohmkk0005zbpbh0sb2ky1','ROLES_MANAGE','ROLES','Mengelola role dan hak akses'),('cmuaohmkv0008zbpb72lsjnvf','HOMEPAGE_MANAGE','HOMEPAGE','Mengelola tata letak dan banner homepage'),('cmuaohml7000bzbpb1f2zoptu','NEWS_MANAGE','CONTENTS','Mengelola berita kedinasan'),('cmuaohmlh000ezbpbyx7sapbh','ANNOUNCEMENTS_MANAGE','CONTENTS','Mengelola pengumuman dinas'),('cmuaohmlr000hzbpbriz15o2e','AGENDAS_MANAGE','CONTENTS','Mengelola kalender agenda dinas'),('cmuaohmm2000kzbpbcsvhy9c1','DOCUMENTS_MANAGE','CONTENTS','Mengelola repositori dokumen intern'),('cmuaohmma000nzbpbnos0vklr','POSTS_MODERATE','POSTS','Moderasi dan pengelolaan konten antar pegawai'),('cmuaohmml000qzbpb0xng2ncr','FIGURE_MANAGE','FIGURE','Mengelola artikel profil Kupas Sosok'),('cmuaohmmv000tzbpbsi9n39yt','LOGS_VIEW','LOGS','Melihat riwayat audit log aktivitas');
/*!40000 ALTER TABLE `izin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategori`
--

DROP TABLE IF EXISTS `kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kategori_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori`
--

LOCK TABLES `kategori` WRITE;
/*!40000 ALTER TABLE `kategori` DISABLE KEYS */;
INSERT INTO `kategori` VALUES ('cmuaohmn6000wzbpbtvlabj53','Berita','berita','KABAR_KEDINASAN','Berita resmi kedinasan Perpusnas','2026-09-21 03:21:15.234'),('cmuaohmnc000xzbpb7bto5c5t','Pengumuman','pengumuman','KABAR_KEDINASAN','Surat edaran dan pengumuman kedinasan','2026-09-21 03:21:15.241'),('cmuaohmnj000yzbpbf083rele','Agenda Kegiatan','agenda','KABAR_KEDINASAN','Jadwal agenda kegiatan kedinasan','2026-09-21 03:21:15.247'),('cmuaohmnn000zzbpboludbxkd','Laporan Perjalanan Dinas','laporan-perjalanan','KABAR_KEDINASAN','Laporan hasil tugas perjalanan dinas','2026-09-21 03:21:15.252'),('cmuaohmns0010zbpb1digh1p4','Dokumen Intern','dokumen-intern','KABAR_KEDINASAN','Dokumen, panduan, dan regulasi internal','2026-09-21 03:21:15.256'),('cmuaohmnx0011zbpb01p7chf1','Coretan Opini Pegawai','opini','ANTAR_PEGAWAI','Opini dan gagasan pegawai','2026-09-21 03:21:15.262'),('cmuaohmo20012zbpbeyj0e6uf','Humor','humor','ANTAR_PEGAWAI','Pojok humor dan relaksasi','2026-09-21 03:21:15.267'),('cmuaohmo70013zbpbekvy3h7q','Jelajah Bumi','jelajah-bumi','ANTAR_PEGAWAI','Catatan traveling dan petualangan','2026-09-21 03:21:15.271'),('cmuaohmoc0014zbpbrkxtyj9o','Kabar Keluarga','kabar-keluarga','ANTAR_PEGAWAI','Berita suka dan duka keluarga besar pegawai','2026-09-21 03:21:15.277'),('cmuaohmoh0015zbpbxrab1306','Kalimat Bijak','kalimat-bijak','ANTAR_PEGAWAI','Kutipan motivasi dan mutiara kata','2026-09-21 03:21:15.282'),('cmuaohmom0016zbpbarxeyfsv','Karya Akademik Pegawai','karya-akademik','ANTAR_PEGAWAI','Jurnal, riset, dan karya ilmiah pegawai','2026-09-21 03:21:15.287'),('cmuaohmos0017zbpb6daqiuek','Tips dan Gaya Hidup','tips-gaya-hidup','ANTAR_PEGAWAI','Tips kesehatan, keuangan, dan hobi','2026-09-21 03:21:15.292'),('cmuaohmox0018zbpbc2cogioj','Konsultasi Kepegawaian','konsultasi-kepegawaian','ANTAR_PEGAWAI','Layanan tanya-jawab kepegawaian','2026-09-21 03:21:15.298'),('cmuaohmp20019zbpbxwjvlz8b','Konsultasi IT','konsultasi-it','ANTAR_PEGAWAI','Bantuan teknis dan sistem informasi','2026-09-21 03:21:15.302'),('cmuaohmp7001azbpbkd5opim8','Konsultasi Kesehatan','konsultasi-kesehatan','ANTAR_PEGAWAI','Konsultasi medis dan kesehatan kerja','2026-09-21 03:21:15.307'),('cmuaohmpd001bzbpbdi77smli','Olahraga','olahraga','ANTAR_PEGAWAI','Komunitas dan kegiatan olahraga','2026-09-21 03:21:15.313'),('cmuaohmpi001czbpb8i538jnf','Tahukah Anda','tahukah-anda','ANTAR_PEGAWAI','Trivia dan fakta unik perpustakaan','2026-09-21 03:21:15.318');
/*!40000 ALTER TABLE `kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `komentar_postingan`
--

DROP TABLE IF EXISTS `komentar_postingan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `komentar_postingan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `komentar_postingan_postId_fkey` (`postId`),
  KEY `komentar_postingan_authorId_fkey` (`authorId`),
  CONSTRAINT `komentar_postingan_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `komentar_postingan_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `postingan_pegawai` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `komentar_postingan`
--

LOCK TABLES `komentar_postingan` WRITE;
/*!40000 ALTER TABLE `komentar_postingan` DISABLE KEYS */;
INSERT INTO `komentar_postingan` VALUES ('cmuaohmyw002jzbpb1ouryih4','cmuaohmyo002hzbpb64wned0u','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.656'),('cmuaohmz9002nzbpbub0ksom8','cmuaohmz2002lzbpb0efuajhx','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.669'),('cmuaohmzr002rzbpbkmhsqll6','cmuaohmzk002pzbpbyibal2sc','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.687'),('cmuaohn03002vzbpbaepjamzk','cmuaohmzy002tzbpbegd2lh80','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.700'),('cmuaohn0d002zzbpbkjglxc3u','cmuaohn08002xzbpbwrzhlffa','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.709'),('cmuaohn0m0033zbpbelcydmb9','cmuaohn0h0031zbpbzrr6e0ml','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.718'),('cmuaohn0w0037zbpbyoeojxcw','cmuaohn0q0035zbpb2817ja6p','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.728'),('cmuaohn18003bzbpbxp13z1x6','cmuaohn110039zbpb0hg93mty','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.740'),('cmuaohn1o003fzbpbvx0ji3db','cmuaohn1g003dzbpbcjln0u6d','cmuaohmvd001kzbpbpepi51ts','Tulisan yang sangat bermanfaat dan menginspirasi kita semua di lingkungan Perpusnas!','2026-09-21 03:21:15.756');
/*!40000 ALTER TABLE `komentar_postingan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `konten`
--

DROP TABLE IF EXISTS `konten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `konten` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverImage` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `publishedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `eventStartDate` datetime(3) DEFAULT NULL,
  `eventEndDate` datetime(3) DEFAULT NULL,
  `eventLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destinationCity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachmentUrl` text COLLATE utf8mb4_unicode_ci,
  `attachmentName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileSize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPinned` tinyint(1) NOT NULL DEFAULT '0',
  `viewCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `konten_slug_key` (`slug`),
  KEY `konten_categoryId_fkey` (`categoryId`),
  KEY `konten_authorId_fkey` (`authorId`),
  CONSTRAINT `konten_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `konten_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `kategori` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `konten`
--

LOCK TABLES `konten` WRITE;
/*!40000 ALTER TABLE `konten` DISABLE KEYS */;
INSERT INTO `konten` VALUES ('agenda-1','Agenda Kedinasan #1: Rapat Koordinasi Nasional Perpusnas RI','agenda-1','Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.','Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','AGENDA','PUBLISHED','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.244','2026-08-25 08:30:00.000',NULL,'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:23.247','2026-09-21 03:21:23.247'),('agenda-2','Agenda Kedinasan #2: Rapat Koordinasi Nasional Perpusnas RI','agenda-2','Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.','Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','AGENDA','DRAFT','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.251','2026-08-25 08:30:00.000',NULL,'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:23.255','2026-09-21 03:21:23.255'),('agenda-3','Agenda Kedinasan #3: Rapat Koordinasi Nasional Perpusnas RI','agenda-3','Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.','Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','AGENDA','PUBLISHED','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.258','2026-08-25 08:30:00.000',NULL,'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:23.262','2026-09-21 03:21:23.262'),('agenda-4','Agenda Kedinasan #4: Rapat Koordinasi Nasional Perpusnas RI','agenda-4','Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.','Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','AGENDA','DRAFT','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.266','2026-08-25 08:30:00.000',NULL,'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:23.270','2026-09-21 03:21:23.270'),('agenda-5','Agenda Kedinasan #5: Rapat Koordinasi Nasional Perpusnas RI','agenda-5','Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.','Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','AGENDA','PUBLISHED','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.274','2026-08-25 08:30:00.000',NULL,'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:23.278','2026-09-21 03:21:23.278'),('agenda-6','Agenda Kedinasan #6: Rapat Koordinasi Nasional Perpusnas RI','agenda-6','Rapat koordinasi dan sinkronisasi program kerja strategis perpustakaan nasional bersama seluruh unit kerja.','Rapat koordinasi nasional membahas target kinerja triwulan, tata kelola kearsipan digital, dan penguatan literasi masyarakat berbasis inklusi sosial.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','AGENDA','DRAFT','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.283','2026-08-25 08:30:00.000',NULL,'Auditorium Gedung Perpusnas Lt. 2 Medan Merdeka Selatan',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:23.287','2026-09-21 03:21:23.287'),('cmuaohmwh001tzbpbhk0gxe6o','Perpusnas Resmikan Layanan Digital Koleksi Naskah Kuno Berbasis AI','perpusnas-resmikan-layanan-digital-koleksi-naskah-kuno-ai','Inovasi teknologi kecerdasan buatan kini diintegrasikan untuk transkripsi dan transliterasi otomatis naskah nusantara berumur ratusan tahun.','Perpustakaan Nasional Republik Indonesia secara resmi meluncurkan pembaruan platform preservasi digital naskah kuno nusantara dengan dukungan AI. Layanan ini memungkinkan para peneliti, akademisi, dan masyarakat umum untuk membaca naskah beraksara Pegon, Jawa, Bali, dan Sunda kuno dengan terjemahan instan ke dalam Bahasa Indonesia modern.\n\nDalam sambutannya, Kepala Perpustakaan Nasional menegaskan bahwa langkah ini adalah bukti nyata komitmen lembaga dalam mengawal amanat pelestarian warisan budaya bangsa sekaligus merespons disrupsi teknologi abad ke-21 secara proaktif.\n\nPegawai di seluruh unit kerja diharapkan turut menyosialisasikan layanan kebanggaan ini kepada para pemustaka di seluruh penjuru tanah air.','https://images.unsplash.com/photo-1507842229451-7f01be8510d2?w=800&auto=format&fit=crop','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.569',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1420,'2026-09-21 03:21:15.569','2026-09-21 03:21:15.569'),('cmuaohmwq001vzbpbrhfupovd','Kunjungan Delegasi Perpustakaan Nasional Australia (NLA) Perkuat Kerja Sama Bilateral','kunjungan-delegasi-perpustakaan-nasional-australia-2026','Pertemuan bilateral membahas pertukaran arsip digital, program magang pustakawan muda, dan pelestarian peta sejarah maritim Asia-Pasifik.','Delegasi tingkat tinggi dari National Library of Australia (NLA) mengunjungi Gedung Fasilitas Layanan Perpustakaan Nasional RI di Jalan Medan Merdeka Selatan No. 11, Jakarta. Kunjungan diplomatik dan teknis ini menghasilkan kesepakatan pembaruan MoU terkait pertukaran data bibliografi serta transfer teknologi konservasi kertas langka.\n\nSeluruh tim kerja Pusat Preservasi dan Alih Media Bahan Perpustakaan turut mendampingi proses workshop bersama yang diselenggarakan di lantai 8.','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.578',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,890,'2026-09-21 03:21:15.578','2026-09-21 03:21:15.578'),('cmuaohmwv001xzbpb0gdte9o5','Pekan Literasi Kebangsaan 2026 Sukses Digelar di 38 Provinsi','pekan-literasi-kebangsaan-2026-sukses-digelar','Rangkaian festival buku keliling, bedah buku tematik, dan lomba bertutur daerah berhasil menjangkau lebih dari 2 juta generasi muda Indonesia.','Pekan Literasi Kebangsaan 2026 yang diinisiasi oleh Perpustakaan Nasional RI bersama Dinas Perpustakaan dan Kearsipan Daerah di seluruh Indonesia berakhir dengan sukses. Tingkat partisipasi masyarakat meningkat 34% dibanding tahun sebelumnya, didorong oleh kolaborasi perpustakaan desa ramah anak dan armada perpustakaan keliling modern.','https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.583',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,650,'2026-09-21 03:21:15.583','2026-09-21 03:21:15.583'),('cmuaohmx1001zzbpb32j3gne1','Surat Edaran: Tata Tertib Presensi Online dan Kerja Fleksibel (FWA) TW III 2026','surat-edaran-presensi-fwa-tw-3-2026','Pemberlakuan panduan teknis Flexible Working Arrangement bagi seluruh ASN dan PPNPN di lingkungan Perpustakaan Nasional RI.','Menindaklanjuti Keputusan Kepala Perpustakaan Nasional RI terkait tata kelola aparatur sipil negara modern, diberitahukan kepada seluruh pegawai bahwa sistem presensi geolokasi dan laporan harian wajib diinput sebelum pukul 17.30 WIB setiap hari kerja.\n\nDetail ketentuan FWA dan pengecualian unit layanan operasional dapat diunduh pada lampiran dokumen terlampir.',NULL,'ANNOUNCEMENT','PUBLISHED','cmuaohmnc000xzbpb7bto5c5t','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.589',NULL,NULL,NULL,NULL,'/files/SE_Presensi_FWA_Perpusnas_2026.pdf','SE_Presensi_FWA_Perpusnas_2026.pdf','1.4 MB',1,0,'2026-09-21 03:21:15.589','2026-09-21 03:21:15.589'),('cmuaohmxa0021zbpbhn15ondb','Jadwal Pemeriksaan Kesehatan Berkala (Medical Check-Up) Pegawai Perpusnas 2026','jadwal-mcu-pegawai-perpusnas-2026','Pelaksanaan MCU gratis di Poliklinik Gedung Salemba dan Merdeka Selatan mulai tanggal 25 Agustus s.d. 5 September 2026.','Biro Umum dan Kepegawaian menyelenggarakan kegiatan Medical Check-Up tahunan. Seluruh pegawai dimohon mendaftar pada shift jadwal unit kerja masing-masing guna menghindari antrean.',NULL,'ANNOUNCEMENT','PUBLISHED','cmuaohmnc000xzbpb7bto5c5t','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.598',NULL,NULL,NULL,NULL,'/files/Jadwal_MCU_Pegawai_2026.pdf','Jadwal_MCU_Pegawai_2026.pdf','820 KB',0,0,'2026-09-21 03:21:15.598','2026-09-21 03:21:15.598'),('cmuaohmxg0023zbpbw7967glv','Rapat Koordinasi Nasional (Rakornas) Bidang Perpustakaan 2026','rakornas-bidang-perpustakaan-2026','Sinergi Pusat dan Daerah Menuju Ekosistem Perpustakaan Berkelanjutan.','Rapat pleno tahunan mengundang perwakilan Dinas Perpustakaan Provinsi/Kabupaten/Kota, pengelola perpustakaan perguruan tinggi, dan asosiasi kepustakawanan.',NULL,'AGENDA','PUBLISHED','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.605','2026-08-25 01:30:00.000','2026-08-27 10:00:00.000','Auditorium Gd. Teater Jakarta & Lt. 2 Hall Perpusnas',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:15.605','2026-09-21 03:21:15.605'),('cmuaohmxo0025zbpbfhknqufs','Workshop Kurasi dan Digital Preservation Format 3D Koleksi Bernilai Sejarah','workshop-digital-preservation-3d-2026','Pelatihan teknis pemindaian fotogrametri dan pemodelan 3D artefak perpustakaan.','Bimbingan teknis intensif bagi pranata komputer dan pustakawan konservasi bekerja sama dengan Laboratorium Digital ITB.',NULL,'AGENDA','PUBLISHED','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.612','2026-09-02 02:00:00.000','2026-09-03 09:00:00.000','Ruang Workshop Lab Preservasi Lt. 8 Salemba',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:15.612','2026-09-21 03:21:15.612'),('cmuaohmxt0027zbpbiu6f88k8','Bedah Buku dan Diskusi Literasi: Menelusuri Jejak Pustaka Nusantara Abad 18','bedah-buku-jejak-pustaka-nusantara','Narasumber ahli filologi dan sastrawan nasional mengupas manuskrip langka koleksi deposit.','Terbuka untuk seluruh pegawai dan sivitas akademika. Disediakan sertifikat e-learning bagi peserta internal.',NULL,'AGENDA','PUBLISHED','cmuaohmnj000yzbpbf083rele','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.618','2026-09-10 06:30:00.000','2026-09-10 09:30:00.000','Lantai 24 Lounge Eksekutif Perpusnas',NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:15.618','2026-09-21 03:21:15.618'),('cmuaohmxz0029zbpbtmdl7xgz','Laporan Tugas Monitoring dan Supervisi Perpustakaan Daerah Provinsi DI Yogyakarta','lap-perjadin-monitoring-perpusda-diy-2026','Evaluasi akreditasi 45 perpustakaan sekolah dan desa di wilayah Kabupaten Kulon Progo dan Sleman.','Tim Direktorat Pengembangan Perpustakaan Umum melaksanakan monitoring lapangan pada 10-14 Agustus 2026. Temuan penting mencakup tingginya adopsi katalog otomasi berbasis INLISLite di 85% titik layanan serta usulan penguatan hibah pojok baca digital (POCADI).',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmv6001hzbpb5rad9j5z','2026-09-21 03:21:15.624',NULL,NULL,NULL,'Yogyakarta & Sleman','/files/Laporan_Perjadin_DIY_Agustus2026.pdf','Laporan_Perjadin_DIY_Agustus2026.pdf','3.1 MB',0,0,'2026-09-21 03:21:15.624','2026-09-21 03:21:15.624'),('cmuaohmy6002bzbpbh90jm81g','Laporan Delegasi Workshop Kepustakawanan Asia Tenggara (CONSAL) di Singapura','lap-perjadin-consal-singapura-2026','Partisipasi aktif dalam perumusan standar interoperabilitas data metadata katalog perpustakaan ASEAN.','Perpusnas mengutus 3 orang pejabat fungsional pustakawan utama untuk menyampaikan makalah best practice penanganan manuskrip tropis dan big data analitik pengguna perpustakaan digital.',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmvr001qzbpbxn66k19q','2026-09-21 03:21:15.631',NULL,NULL,NULL,'Singapura','/files/Laporan_Delegasi_CONSAL_2026.pdf','Laporan_Delegasi_CONSAL_2026.pdf','4.8 MB',0,0,'2026-09-21 03:21:15.631','2026-09-21 03:21:15.631'),('cmuaohmyc002dzbpb6w8w1pq1','Pedoman Standar Operasional Prosedur (SOP) Layanan Referensi & Deposit 2026','sop-layanan-referensi-deposit-2026','Buku panduan baku alur kerja penyerahan karya cetak dan karya rekam (KCKR) serta alur layanan pemustaka riset.','Dokumen ini mengikat seluruh staf direktorat deposit dan layanan informasi dalam memastikan kepatuhan UU No. 13 Tahun 2018.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.636',NULL,NULL,NULL,NULL,'/files/SOP_Layanan_Deposit_2026_Final.pdf','SOP_Layanan_Deposit_2026_Final.pdf','5.2 MB',0,0,'2026-09-21 03:21:15.636','2026-09-21 03:21:15.636'),('cmuaohmyi002fzbpb9ii5ftdq','Pedoman Teknis Keselamatan Kerja dan Tanggap Darurat Gedung Fasilitas Layanan','pedoman-k3-evakuasi-gedung-2026','Instruksi kerja evakuasi, penanganan kebakaran koleksi bahan langka, dan nomor darurat internal gedung 27 lantai.','Wajib dipahami oleh seluruh floor captain dan pegawai di lingkungan Medan Merdeka Selatan No. 11.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:15.642',NULL,NULL,NULL,NULL,'/files/Buku_Saku_K3_Perpusnas_2026.pdf','Buku_Saku_K3_Perpusnas_2026.pdf','2.9 MB',0,0,'2026-09-21 03:21:15.642','2026-09-21 03:21:15.642'),('doc-1','Dokumen Internal #1: Surat Edaran & Panduan Operasional Perpusnas','doc-1','Panduan tata kelola administrasi kedinasan, jam kerja, dan standar operasional prosedur internal.','Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.330',NULL,NULL,NULL,NULL,NULL,'Surat_Edaran_1.pdf','2.1 MB',0,0,'2026-09-21 03:21:23.333','2026-09-21 03:21:23.333'),('doc-2','Dokumen Internal #2: Surat Edaran & Panduan Operasional Perpusnas','doc-2','Panduan tata kelola administrasi kedinasan, jam kerja, dan standar operasional prosedur internal.','Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.338',NULL,NULL,NULL,NULL,NULL,'Surat_Edaran_2.pdf','2.1 MB',0,0,'2026-09-21 03:21:23.342','2026-09-21 03:21:23.342'),('doc-3','Dokumen Internal #3: Surat Edaran & Panduan Operasional Perpusnas','doc-3','Panduan tata kelola administrasi kedinasan, jam kerja, dan standar operasional prosedur internal.','Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.345',NULL,NULL,NULL,NULL,NULL,'Surat_Edaran_3.pdf','2.1 MB',0,0,'2026-09-21 03:21:23.349','2026-09-21 03:21:23.349'),('doc-4','Dokumen Internal #4: Surat Edaran & Panduan Operasional Perpusnas','doc-4','Panduan tata kelola administrasi kedinasan, jam kerja, dan standar operasional prosedur internal.','Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.353',NULL,NULL,NULL,NULL,NULL,'Surat_Edaran_4.pdf','2.1 MB',0,0,'2026-09-21 03:21:23.357','2026-09-21 03:21:23.357'),('doc-5','Dokumen Internal #5: Surat Edaran & Panduan Operasional Perpusnas','doc-5','Panduan tata kelola administrasi kedinasan, jam kerja, dan standar operasional prosedur internal.','Pedoman penyesuaian jam kerja efektif, rekapitulasi presensi biometrik, serta tata tertib kedisiplinan pegawai di lingkungan Perpustakaan Nasional RI.',NULL,'INTERNAL_DOCUMENT','PUBLISHED','cmuaohmns0010zbpb1digh1p4','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.361',NULL,NULL,NULL,NULL,NULL,'Surat_Edaran_5.pdf','2.1 MB',0,0,'2026-09-21 03:21:23.364','2026-09-21 03:21:23.364'),('stitch-1','Minat membaca Warga Indonesia semakin membaik','stitch-1','Menurut penelitian pada tanggal 19 Agustus 2026 terlihat bahwa jumlah peminat buku di berbagai daerah mengalami peningkatan signifikan...','Menurut penelitian yang dirilis pada tanggal 19 Agustus 2026, indeks kegemaran membaca masyarakat Indonesia mengalami lonjakan positif. Hal ini didorong oleh peningkatan penetrasi perpustakaan digital, penyediaan pojok baca terpadu di ruang publik, serta optimalisasi layanan perpustakaan berbasis inklusi sosial yang gencar dilaksanakan oleh Perpustakaan Nasional RI bersama seluruh pemangku kepentingan daerah.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:22.773',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:22.779','2026-09-21 03:21:22.779'),('stitch-2','Perpustakaan Digital Terpadu Dukung Pembelajaran Jarak Jauh','stitch-2','Integrasi teknologi dalam membaca dokumen digital melalui tablet cerdas semakin memudahkan pemustaka dalam menjangkau koleksi naskah kuno...','Integrasi teknologi dalam membaca dokumen digital melalui tablet dan gawai cerdas semakin memudahkan masyarakat dalam menjangkau koleksi naskah kuno, jurnal penelitian, serta buku teks terakreditasi melalui portal iPusnas dan IOS.','https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80','NEWS','DRAFT','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:22.788',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:22.792','2026-09-21 03:21:22.792'),('stitch-3','Gedung Layanan Merdeka Selatan Catatkan Rekor Kunjungan Tertinggi','stitch-3','Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian...','Gedung fasilitas layanan Perpustakaan Nasional di Jalan Medan Merdeka Selatan terus mencatatkan lonjakan kunjungan pemustaka harian hingga mencapai rekor tertinggi pada kuartal ketiga tahun ini.','https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:22.796',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:22.800','2026-09-21 03:21:22.800'),('stitch-4','Diskusi Standardisasi Kurikulum Literasi Informasi Era Modern','stitch-4','Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi...','Diskusi kelompok terarah antar civitas akademika dan pustakawan profesional membahas standardisasi kurikulum literasi informasi di era komputasi awan.','https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80','NEWS','DRAFT','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:22.806',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:22.809','2026-09-21 03:21:22.809'),('stitch-5','Penataan Rak Buku Tematik dan Sistem Otomasi RFID Terbaru','stitch-5','Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu koleksi...','Penataan tata kelola rak buku tematik dan sistem katalog otomatisasi RFID di seluruh lantai layanan mempercepat waktu temu kembali koleksi referensi.','https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:22.813',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:22.817','2026-09-21 03:21:22.817'),('stitch-6','Peningkatan Aksesibilitas Fasilitas Inklusi Ramah Disabilitas','stitch-6','Layanan ruang baca lansia dan disabilitas dilengkapi fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra...','Layanan ruang baca lansia dan disabilitas dilengkapi dengan fasilitas pendukung ergonomis serta perangkat bantu baca audio ramah tuna netra demi pemerataan akses informasi.','https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80','NEWS','PUBLISHED','cmuaohmn6000wzbpbtvlabj53','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:22.821',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,'2026-09-21 03:21:22.825','2026-09-21 03:21:22.825'),('trip-1','Laporan Delegasi Workshop Kepustakawanan Asia Tenggara (CONSAL) di Singapura','trip-1','Pelaksanaan tugas kedinasan di kota Singapura dalam rangka penguatan layanan kepustakawanan.','Perjalanan dinas ini dilaksanakan dengan penuh tanggung jawab demi memastikan ketercapaian sasaran strategis program kerja Perpusnas RI di wilayah Singapura. Seluruh agenda koordinasi dan lokakarya berjalan lancar.',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.291',NULL,NULL,NULL,'Singapura',NULL,'Laporan_Dinas_Singapura.pdf',NULL,0,0,'2026-09-21 03:21:23.295','2026-09-21 03:21:23.295'),('trip-2','Laporan Perjalanan Dinas Pelatihan Kearsipan Digital di Yogyakarta','trip-2','Pelaksanaan tugas kedinasan di kota Yogyakarta dalam rangka penguatan layanan kepustakawanan.','Perjalanan dinas ini dilaksanakan dengan penuh tanggung jawab demi memastikan ketercapaian sasaran strategis program kerja Perpusnas RI di wilayah Yogyakarta. Seluruh agenda koordinasi dan lokakarya berjalan lancar.',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.298',NULL,NULL,NULL,'Yogyakarta',NULL,'Laporan_Dinas_Yogyakarta.pdf',NULL,0,0,'2026-09-21 03:21:23.302','2026-09-21 03:21:23.302'),('trip-3','Laporan Pendampingan Akreditasi Perpustakaan Daerah di Surabaya','trip-3','Pelaksanaan tugas kedinasan di kota Surabaya dalam rangka penguatan layanan kepustakawanan.','Perjalanan dinas ini dilaksanakan dengan penuh tanggung jawab demi memastikan ketercapaian sasaran strategis program kerja Perpusnas RI di wilayah Surabaya. Seluruh agenda koordinasi dan lokakarya berjalan lancar.',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.307',NULL,NULL,NULL,'Surabaya',NULL,'Laporan_Dinas_Surabaya.pdf',NULL,0,0,'2026-09-21 03:21:23.310','2026-09-21 03:21:23.310'),('trip-4','Laporan Preservasi dan Konservasi Lontar Kuno di Denpasar Bali','trip-4','Pelaksanaan tugas kedinasan di kota Denpasar dalam rangka penguatan layanan kepustakawanan.','Perjalanan dinas ini dilaksanakan dengan penuh tanggung jawab demi memastikan ketercapaian sasaran strategis program kerja Perpusnas RI di wilayah Denpasar. Seluruh agenda koordinasi dan lokakarya berjalan lancar.',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.314',NULL,NULL,NULL,'Denpasar',NULL,'Laporan_Dinas_Denpasar.pdf',NULL,0,0,'2026-09-21 03:21:23.317','2026-09-21 03:21:23.317'),('trip-5','Laporan Monitoring dan Evaluasi Bantuan Pojok Baca di Medan','trip-5','Pelaksanaan tugas kedinasan di kota Medan dalam rangka penguatan layanan kepustakawanan.','Perjalanan dinas ini dilaksanakan dengan penuh tanggung jawab demi memastikan ketercapaian sasaran strategis program kerja Perpusnas RI di wilayah Medan. Seluruh agenda koordinasi dan lokakarya berjalan lancar.',NULL,'BUSINESS_TRIP','PUBLISHED','cmuaohmnn000zzbpboludbxkd','cmuaohmus001ezbpbyejw0jab','2026-09-21 03:21:23.322',NULL,NULL,NULL,'Medan',NULL,'Laporan_Dinas_Medan.pdf',NULL,0,0,'2026-09-21 03:21:23.326','2026-09-21 03:21:23.326');
/*!40000 ALTER TABLE `konten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_aktivitas`
--

DROP TABLE IF EXISTS `log_aktivitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_aktivitas` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '127.0.0.1',
  `userAgent` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `log_aktivitas_userId_fkey` (`userId`),
  CONSTRAINT `log_aktivitas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_aktivitas`
--

LOCK TABLES `log_aktivitas` WRITE;
/*!40000 ALTER TABLE `log_aktivitas` DISABLE KEYS */;
INSERT INTO `log_aktivitas` VALUES ('cmuaohn36003rzbpbmjtwo9uk','cmuaohmus001ezbpbyejw0jab','LOGIN','AUTH',NULL,'Administrator berhasil login ke sistem','127.0.0.1',NULL,'2026-09-21 03:21:15.810'),('cmuaohn3d003tzbpbq1lzu091','cmuaohmus001ezbpbyejw0jab','CREATE','HOMEPAGE',NULL,'Pembaruan banner hero dan kalimat bijak portal intranet','127.0.0.1',NULL,'2026-09-21 03:21:15.817'),('cmuaohn3i003vzbpb5h5zcis8','cmuaohmus001ezbpbyejw0jab','CREATE','NEWS',NULL,'Publikasi berita: Perpusnas Resmikan Layanan Digital Koleksi Naskah Kuno Berbasis AI','127.0.0.1',NULL,'2026-09-21 03:21:15.822');
/*!40000 ALTER TABLE `log_aktivitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengaturan_beranda`
--

DROP TABLE IF EXISTS `pengaturan_beranda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengaturan_beranda` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `heroTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Selamat Datang di Portal Intranet Perpusnas RI',
  `heroSubtitle` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pusat Informasi Internal, Kolaborasi, dan Layanan Terintegrasi Pegawai Perpustakaan Nasional Republik Indonesia',
  `heroBadge` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Kiprah Literasi Bangsa',
  `heroBannerUrl` text COLLATE utf8mb4_unicode_ci,
  `quoteText` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Membaca adalah jembatan emas menuju peradaban bangsa yang unggul dan berkarakter.',
  `quoteAuthor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Prof. Dr. Ir. Muhammad Syarif Bando, M.M.',
  `quoteAuthorRole` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Kepala Perpustakaan Nasional RI (Periode 2016-2023)',
  `announcementTicker` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT 'Pemberitahuan: Seluruh pegawai dihimbau melengkapi data profil kepegawaian terkini sebelum akhir bulan.',
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengaturan_beranda`
--

LOCK TABLES `pengaturan_beranda` WRITE;
/*!40000 ALTER TABLE `pengaturan_beranda` DISABLE KEYS */;
INSERT INTO `pengaturan_beranda` VALUES ('default-setting','Selamat Datang di Portal Intranet Perpusnas RI','Satu pintu akses informasi kedinasan, kolaborasi antarpegawai, pengembangan kompetensi, dan layanan terpadu Perpustakaan Nasional Republik Indonesia.','Portal Terpadu Aparatur Sipil Negara Perpusnas','https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop','Membaca dan melestarikan khazanah literasi adalah ikhtiar luhur merajut martabat dan masa depan bangsa.','Pimpinan Perpustakaan Nasional RI','Gedung Fasilitas Layanan Perpusnas Jl. Medan Merdeka Selatan No. 11 Jakarta','Pemberitahuan Resmi: Pelaksanaan Penilaian Kinerja Triwulan III dan Pembaruan Data Pegawai dapat diakses melalui portal sebelum 31 Agustus 2026.','2026-09-21 03:21:15.550');
/*!40000 ALTER TABLE `pengaturan_beranda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengguna`
--

DROP TABLE IF EXISTS `pengguna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengguna` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengguna_nip_key` (`nip`),
  UNIQUE KEY `pengguna_email_key` (`email`),
  KEY `pengguna_roleId_fkey` (`roleId`),
  CONSTRAINT `pengguna_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `peran` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengguna`
--

LOCK TABLES `pengguna` WRITE;
/*!40000 ALTER TABLE `pengguna` DISABLE KEYS */;
INSERT INTO `pengguna` VALUES ('cmuaohmus001ezbpbyejw0jab','ADMIN001','Administrator Perpusnas','admin@perpusnas.go.id','$2a$10$ZBqRkcSsGjZeay9RbPz9SePA80UobdQ9SayDyBhb/Yk/UpikMzVe2','cmuaohmjb0000zbpbornwu9jg','ACTIVE','2026-09-21 03:21:15.509','2026-09-21 03:21:15.509'),('cmuaohmv6001hzbpb5rad9j5z','198501152010011001','Drs. Bambang Sudirman, M.Hum.','bambang.sudirman@perpusnas.go.id','$2a$10$Fgw5OfX/RF5ln8ntyxqPLeJqDVFeZiL.jBruaN8dkm9SVKYQH3BYC','cmuaohmjv0001zbpbukjwvoyh','ACTIVE','2026-09-21 03:21:15.522','2026-09-21 03:21:15.522'),('cmuaohmvd001kzbpbpepi51ts','199003202015022003','Siti Nurhaliza, S.Sos.','siti.nurhaliza@perpusnas.go.id','$2a$10$Fgw5OfX/RF5ln8ntyxqPLeJqDVFeZiL.jBruaN8dkm9SVKYQH3BYC','cmuaohmjv0001zbpbukjwvoyh','ACTIVE','2026-09-21 03:21:15.530','2026-09-21 03:21:15.530'),('cmuaohmvl001nzbpbjb6v0b4i','199208142018011005','Ahmad Fauzi, S.Kom.','ahmad.fauzi@perpusnas.go.id','$2a$10$Fgw5OfX/RF5ln8ntyxqPLeJqDVFeZiL.jBruaN8dkm9SVKYQH3BYC','cmuaohmjv0001zbpbukjwvoyh','ACTIVE','2026-09-21 03:21:15.537','2026-09-21 03:21:15.537'),('cmuaohmvr001qzbpbxn66k19q','198811052012012002','Dr. Ratna Dewi, M.Si.','ratna.dewi@perpusnas.go.id','$2a$10$Fgw5OfX/RF5ln8ntyxqPLeJqDVFeZiL.jBruaN8dkm9SVKYQH3BYC','cmuaohmjv0001zbpbukjwvoyh','ACTIVE','2026-09-21 03:21:15.544','2026-09-21 03:21:15.544');
/*!40000 ALTER TABLE `pengguna` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peran`
--

DROP TABLE IF EXISTS `peran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peran` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `peran_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peran`
--

LOCK TABLES `peran` WRITE;
/*!40000 ALTER TABLE `peran` DISABLE KEYS */;
INSERT INTO `peran` VALUES ('cmuaohmjb0000zbpbornwu9jg','ADMINISTRATOR','Pengelola penuh sistem, pengguna, hak akses, homepage, konten, dan log aktivitas.','2026-09-21 03:21:15.095','2026-09-21 03:21:15.095'),('cmuaohmjv0001zbpbukjwvoyh','PEGAWAI','Pegawai internal Perpustakaan Nasional RI pengguna modul informasi & interaksi portal.','2026-09-21 03:21:15.115','2026-09-21 03:21:15.115');
/*!40000 ALTER TABLE `peran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peran_izin`
--

DROP TABLE IF EXISTS `peran_izin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peran_izin` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `peran_izin_roleId_permissionId_key` (`roleId`,`permissionId`),
  KEY `peran_izin_permissionId_fkey` (`permissionId`),
  CONSTRAINT `peran_izin_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `izin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `peran_izin_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `peran` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peran_izin`
--

LOCK TABLES `peran_izin` WRITE;
/*!40000 ALTER TABLE `peran_izin` DISABLE KEYS */;
INSERT INTO `peran_izin` VALUES ('cmuaohmkd0004zbpbdcvehown','cmuaohmjb0000zbpbornwu9jg','cmuaohmk10002zbpbns7h3sta'),('cmuaohmkr0007zbpb035yinxh','cmuaohmjb0000zbpbornwu9jg','cmuaohmkk0005zbpbh0sb2ky1'),('cmuaohml0000azbpbmllstkkj','cmuaohmjb0000zbpbornwu9jg','cmuaohmkv0008zbpb72lsjnvf'),('cmuaohmlc000dzbpbwa71bn8l','cmuaohmjb0000zbpbornwu9jg','cmuaohml7000bzbpb1f2zoptu'),('cmuaohmln000gzbpbi8yejmzc','cmuaohmjb0000zbpbornwu9jg','cmuaohmlh000ezbpbyx7sapbh'),('cmuaohmlw000jzbpbc7mk57yw','cmuaohmjb0000zbpbornwu9jg','cmuaohmlr000hzbpbriz15o2e'),('cmuaohmm6000mzbpbg33lmh7j','cmuaohmjb0000zbpbornwu9jg','cmuaohmm2000kzbpbcsvhy9c1'),('cmuaohmmf000pzbpbfewfbpmk','cmuaohmjb0000zbpbornwu9jg','cmuaohmma000nzbpbnos0vklr'),('cmuaohmmq000szbpbfqsrx4iy','cmuaohmjb0000zbpbornwu9jg','cmuaohmml000qzbpb0xng2ncr'),('cmuaohmn1000vzbpb5rjq29vn','cmuaohmjb0000zbpbornwu9jg','cmuaohmmv000tzbpbsi9n39yt');
/*!40000 ALTER TABLE `peran_izin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postingan_pegawai`
--

DROP TABLE IF EXISTS `postingan_pegawai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postingan_pegawai` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorySlug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverImage` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `likesCount` int NOT NULL DEFAULT '0',
  `viewsCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `postingan_pegawai_slug_key` (`slug`),
  KEY `postingan_pegawai_authorId_fkey` (`authorId`),
  CONSTRAINT `postingan_pegawai_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postingan_pegawai`
--

LOCK TABLES `postingan_pegawai` WRITE;
/*!40000 ALTER TABLE `postingan_pegawai` DISABLE KEYS */;
INSERT INTO `postingan_pegawai` VALUES ('cmuaohmyo002hzbpb64wned0u','Membangun Ekosistem Knowledge Sharing yang Nyaman di Lingkungan Birokrasi','membangun-ekosistem-knowledge-sharing-perpusnas','Birokrasi sering diidentikkan dengan sekat-sekat unit kerja yang kaku. Namun di Perpustakaan Nasional, kekayaan ilmu dari para pustakawan senior dan energi inovatif dari generasi muda ASN sejatinya dapat berpadu indah jika ruang bertukar ide informal terus dipupuk. Mari aktif menuliskan catatan lapangan, metode baru, dan inspirasi harian di portal ini!','opini','cmuaohmv6001hzbpb5rad9j5z','https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop','PUBLISHED',28,310,'2026-09-21 03:21:15.648','2026-09-21 03:21:15.648'),('cmuaohmz2002lzbpb0efuajhx','Ketika Pembaca Bertanya: \"Buku Ini Masih di Rak atau Sudah Dipinjam?\"','humor-pustakawan-rak-buku-lucu','Pustakawan layanan referensi sering menghadapi momen menggelitik. Suatu siang seorang pemustaka bertanya: \"Mbak, saya cari buku yang sampulnya warna biru, tebalnya sejengkal, penulisnya kalau tidak salah pakai kacamata...\" Dengan jurus pencarian katalog sakti dan senyum ramah, akhirnya buku tersebut ketemu juga dalam waktu 2 menit! Salam hangat untuk kawan-kawan front office!','humor','cmuaohmvd001kzbpbpepi51ts','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop','PUBLISHED',45,520,'2026-09-21 03:21:15.663','2026-09-21 03:21:15.663'),('cmuaohmzk002pzbpbyibal2sc','Menyusuri Jejak Manuskrip Kuno di Pedalaman Lembah Baliem Papua','jelajah-bumi-ekspedisi-papua-2026','Menjalankan tugas dinas preservasi naskah daerah memberi kesempatan menikmati keagungan alam Lembah Baliem. Udara dingin pegunungan, keramahan tetua suku, dan tradisi tutur yang kaya mengajarkan kita bahwa perpustakaan sejati hidup dalam denyut nadi masyarakat adat.','jelajah-bumi','cmuaohmv6001hzbpb5rad9j5z','https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop','PUBLISHED',39,430,'2026-09-21 03:21:15.680','2026-09-21 03:21:15.680'),('cmuaohmzy002tzbpbegd2lh80','Selamat Atas Kelahiran Putri Pertama Rekanita Siti Nurhaliza','kabar-keluarga-kelahiran-putri-siti','Keluarga besar Biro Humas dan Pusdatin mengucapkan selamat dan penuh suka cita kepada Ibu Siti Nurhaliza atas kelahiran putri pertama bernama \"Aisyah Literasi Putri\" pada 12 Agustus 2026. Semoga tumbuh menjadi anak yang sholehah, cerdas, dan membanggakan keluarga serta nusa bangsa.','kabar-keluarga','cmuaohmvl001nzbpbjb6v0b4i','https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop','PUBLISHED',62,710,'2026-09-21 03:21:15.694','2026-09-21 03:21:15.694'),('cmuaohn08002xzbpbwrzhlffa','Kutipan Pekan Ini: Nilai Sejati Sebuah Buku','kalimat-bijak-nilai-buku-dan-manusia','\"Perpustakaan bukan sekadar bangunan bertingkat penyimpan kertas berjilid. Perpustakaan adalah suaka peradaban tempat gagasan terbaik manusia sepanjang masa saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmvr001qzbpbxn66k19q','https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop','PUBLISHED',84,920,'2026-09-21 03:21:15.704','2026-09-21 03:21:15.704'),('cmuaohn0h0031zbpbzrr6e0ml','Studi Analisis Perilaku Penelusuran Informasi Generasi Z pada Portal iPusnas','karya-akademik-analisis-generasi-z-ipusnas','Abstrak: Penelitian ini mengkaji pola retensi dan kecenderungan genre bacaan digital pada 50.000 pengguna aktif muda. Hasil riset menunjukkan format e-book interaktif dan gamifikasi pencapaian membaca meningkatkan waktu baca harian hingga 42%. Makalah lengkap siap dipresentasikan pada simposium internasional.','karya-akademik','cmuaohmvr001qzbpbxn66k19q','https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop','PUBLISHED',31,380,'2026-09-21 03:21:15.714','2026-09-21 03:21:15.714'),('cmuaohn0q0035zbpb2817ja6p','5 Tips Ergonomis Menjaga Kesehatan Mata dan Postur Tubuh di Depan Layar Komputer','tips-gaya-hidup-ergonomi-kantor','Pekerjaan digital dan penataan katalog seharian sering membuat leher kaku dan mata lelah. Terapkan aturan 20-20-20 (setiap 20 menit, lihat objek sejauh 20 kaki selama 20 detik), atur ketinggian monitor sejajar mata, dan luangkan waktu stretching 3 menit di sela jam kerja!','tips-gaya-hidup','cmuaohmvl001nzbpbjb6v0b4i','https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop','PUBLISHED',47,560,'2026-09-21 03:21:15.722','2026-09-21 03:21:15.722'),('cmuaohn110039zbpb0hg93mty','Jadwal Latihan Rutin Komunitas Badminton Perpusnas Setiap Kamis Malam','olahraga-komunitas-badminton-perpusnas','Untuk menjaga kebugaran dan mempererat tali silaturahmi antardeputi, Komunitas Bulutangkis Perpusnas rutin mengadakan sparring setiap hari Kamis pukul 18.30 WIB di GOR Senayan. Semua pegawai, baik pemula maupun pro, sangat disambut hangat untuk bergabung!','olahraga','cmuaohmvl001nzbpbjb6v0b4i','https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop','PUBLISHED',35,410,'2026-09-21 03:21:15.733','2026-09-21 03:21:15.733'),('cmuaohn1g003dzbpbcjln0u6d','Tahukah Anda? Gedung Perpusnas Merdeka Selatan Merupakan Gedung Perpustakaan Nasional Tertinggi di Dunia','tahukah-anda-gedung-perpusnas-tertinggi','Dengan 27 lantai dan ketinggian mencapai 126,3 meter, fasilitas layanan Perpusnas di Jalan Medan Merdeka Selatan dinobatkan sebagai gedung perpustakaan nasional tertinggi di dunia! Gedung ini dirancang dengan konsep green building ramah lingkungan dan mampu menampung jutaan koleksi pustaka serta ribuan pengunjung setiap harinya.','tahukah-anda','cmuaohmvd001kzbpbpepi51ts','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop','PUBLISHED',92,1100,'2026-09-21 03:21:15.749','2026-09-21 03:21:15.749'),('humor-1','Humor Pegawai #1: Minat Membaca & Kemajuan Perpusnas','humor-1','Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!','humor','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:22.882','2026-09-21 03:21:22.882'),('humor-2','Humor Pegawai #2: Minat Membaca & Kemajuan Perpusnas','humor-2','Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!','humor','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:22.889','2026-09-21 03:21:22.889'),('humor-3','Humor Pegawai #3: Minat Membaca & Kemajuan Perpusnas','humor-3','Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!','humor','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:22.895','2026-09-21 03:21:22.895'),('humor-4','Humor Pegawai #4: Minat Membaca & Kemajuan Perpusnas','humor-4','Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!','humor','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:22.901','2026-09-21 03:21:22.901'),('humor-5','Humor Pegawai #5: Minat Membaca & Kemajuan Perpusnas','humor-5','Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!','humor','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:22.908','2026-09-21 03:21:22.908'),('humor-6','Humor Pegawai #6: Minat Membaca & Kemajuan Perpusnas','humor-6','Pustakawan layanan referensi sering menghadapi momen menggelitik saat pengunjung mencari buku berdasarkan warna sampulnya. Tetap layani dengan senyum tulus dan ramah!','humor','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:22.915','2026-09-21 03:21:22.915'),('jelajah-1','Jelajah Bumi #1: Minat Membaca & Kemajuan Perpusnas','jelajah-1','Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.','jelajah-bumi','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:22.923','2026-09-21 03:21:22.923'),('jelajah-2','Jelajah Bumi #2: Minat Membaca & Kemajuan Perpusnas','jelajah-2','Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.','jelajah-bumi','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:22.929','2026-09-21 03:21:22.929'),('jelajah-3','Jelajah Bumi #3: Minat Membaca & Kemajuan Perpusnas','jelajah-3','Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.','jelajah-bumi','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:22.937','2026-09-21 03:21:22.937'),('jelajah-4','Jelajah Bumi #4: Minat Membaca & Kemajuan Perpusnas','jelajah-4','Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.','jelajah-bumi','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:22.946','2026-09-21 03:21:22.946'),('jelajah-5','Jelajah Bumi #5: Minat Membaca & Kemajuan Perpusnas','jelajah-5','Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.','jelajah-bumi','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:22.953','2026-09-21 03:21:22.953'),('jelajah-6','Jelajah Bumi #6: Minat Membaca & Kemajuan Perpusnas','jelajah-6','Catatan ekspedisi dan perjalanan ke pelosok nusantara mengajarkan arti penting menghargai kearifan lokal dan pelestarian naskah kuno daerah.','jelajah-bumi','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:22.960','2026-09-21 03:21:22.960'),('kabar-keluarga-1','Kabar Keluarga #1: Minat Membaca & Kemajuan Perpusnas','kabar-keluarga-1','Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.','kabar-keluarga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:22.967','2026-09-21 03:21:22.967'),('kabar-keluarga-2','Kabar Keluarga #2: Minat Membaca & Kemajuan Perpusnas','kabar-keluarga-2','Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.','kabar-keluarga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:22.975','2026-09-21 03:21:22.975'),('kabar-keluarga-3','Kabar Keluarga #3: Minat Membaca & Kemajuan Perpusnas','kabar-keluarga-3','Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.','kabar-keluarga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:22.981','2026-09-21 03:21:22.981'),('kabar-keluarga-4','Kabar Keluarga #4: Minat Membaca & Kemajuan Perpusnas','kabar-keluarga-4','Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.','kabar-keluarga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:22.988','2026-09-21 03:21:22.988'),('kabar-keluarga-5','Kabar Keluarga #5: Minat Membaca & Kemajuan Perpusnas','kabar-keluarga-5','Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.','kabar-keluarga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:22.996','2026-09-21 03:21:22.996'),('kabar-keluarga-6','Kabar Keluarga #6: Minat Membaca & Kemajuan Perpusnas','kabar-keluarga-6','Keluarga besar Perpustakaan Nasional RI senantiasa memupuk rasa persaudaraan dan solidaritas antarpegawai baik dalam suka maupun duka.','kabar-keluarga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:23.002','2026-09-21 03:21:23.002'),('kalimat-bijak-1','Kalimat Bijak #1: Minat Membaca & Kemajuan Perpusnas','kalimat-bijak-1','\"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:23.013','2026-09-21 03:21:23.013'),('kalimat-bijak-2','Kalimat Bijak #2: Minat Membaca & Kemajuan Perpusnas','kalimat-bijak-2','\"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:23.020','2026-09-21 03:21:23.020'),('kalimat-bijak-3','Kalimat Bijak #3: Minat Membaca & Kemajuan Perpusnas','kalimat-bijak-3','\"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:23.028','2026-09-21 03:21:23.028'),('kalimat-bijak-4','Kalimat Bijak #4: Minat Membaca & Kemajuan Perpusnas','kalimat-bijak-4','\"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:23.035','2026-09-21 03:21:23.035'),('kalimat-bijak-5','Kalimat Bijak #5: Minat Membaca & Kemajuan Perpusnas','kalimat-bijak-5','\"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:23.043','2026-09-21 03:21:23.043'),('kalimat-bijak-6','Kalimat Bijak #6: Minat Membaca & Kemajuan Perpusnas','kalimat-bijak-6','\"Perpustakaan bukan sekadar bangunan penyimpan buku, melainkan suaka peradaban tempat gagasan terbaik manusia saling bertegur sapa melintasi zaman.\"','kalimat-bijak','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:23.050','2026-09-21 03:21:23.050'),('karya-1','Karya Akademik #1: Minat Membaca & Kemajuan Perpusnas','karya-1','Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.','karya-akademik','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:23.057','2026-09-21 03:21:23.057'),('karya-2','Karya Akademik #2: Minat Membaca & Kemajuan Perpusnas','karya-2','Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.','karya-akademik','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:23.064','2026-09-21 03:21:23.064'),('karya-3','Karya Akademik #3: Minat Membaca & Kemajuan Perpusnas','karya-3','Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.','karya-akademik','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:23.071','2026-09-21 03:21:23.071'),('karya-4','Karya Akademik #4: Minat Membaca & Kemajuan Perpusnas','karya-4','Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.','karya-akademik','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:23.078','2026-09-21 03:21:23.078'),('karya-5','Karya Akademik #5: Minat Membaca & Kemajuan Perpusnas','karya-5','Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.','karya-akademik','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:23.085','2026-09-21 03:21:23.085'),('karya-6','Karya Akademik #6: Minat Membaca & Kemajuan Perpusnas','karya-6','Abstrak: Penelitian ini mengkaji implementasi sistem temu kembali informasi dan manajemen repositori digital institusi pemerintahan dalam mendukung akuntabilitas publik.','karya-akademik','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:23.092','2026-09-21 03:21:23.092'),('olahraga-1','Kegiatan Olahraga #1: Minat Membaca & Kemajuan Perpusnas','olahraga-1','Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.','olahraga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:23.100','2026-09-21 03:21:23.100'),('olahraga-2','Kegiatan Olahraga #2: Minat Membaca & Kemajuan Perpusnas','olahraga-2','Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.','olahraga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:23.108','2026-09-21 03:21:23.108'),('olahraga-3','Kegiatan Olahraga #3: Minat Membaca & Kemajuan Perpusnas','olahraga-3','Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.','olahraga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:23.114','2026-09-21 03:21:23.114'),('olahraga-4','Kegiatan Olahraga #4: Minat Membaca & Kemajuan Perpusnas','olahraga-4','Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.','olahraga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:23.122','2026-09-21 03:21:23.122'),('olahraga-5','Kegiatan Olahraga #5: Minat Membaca & Kemajuan Perpusnas','olahraga-5','Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.','olahraga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:23.128','2026-09-21 03:21:23.128'),('olahraga-6','Kegiatan Olahraga #6: Minat Membaca & Kemajuan Perpusnas','olahraga-6','Menjaga kebugaran jasmani di sela rutinitas pekerjaan kedinasan adalah kunci menjaga stamina dan produktivitas kerja yang optimal.','olahraga','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:23.135','2026-09-21 03:21:23.135'),('opini-1','Coretan Opini #1: Minat Membaca & Kemajuan Perpusnas','opini-1','Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.','opini','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:22.834','2026-09-21 03:21:22.834'),('opini-2','Coretan Opini #2: Minat Membaca & Kemajuan Perpusnas','opini-2','Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.','opini','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:22.844','2026-09-21 03:21:22.844'),('opini-3','Coretan Opini #3: Minat Membaca & Kemajuan Perpusnas','opini-3','Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.','opini','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:22.851','2026-09-21 03:21:22.851'),('opini-4','Coretan Opini #4: Minat Membaca & Kemajuan Perpusnas','opini-4','Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.','opini','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:22.860','2026-09-21 03:21:22.860'),('opini-5','Coretan Opini #5: Minat Membaca & Kemajuan Perpusnas','opini-5','Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.','opini','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:22.867','2026-09-21 03:21:22.867'),('opini-6','Coretan Opini #6: Minat Membaca & Kemajuan Perpusnas','opini-6','Perjalanan literasi di Indonesia terus menunjukkan grafik positif. Berdasarkan survei dan kajian kepustakawanan terkini, aksesibilitas terhadap buku fisik maupun portal baca digital mengalami kenaikan signifikan.','opini','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:22.875','2026-09-21 03:21:22.875'),('tahukah-1','Tahukah Anda #1: Minat Membaca & Kemajuan Perpusnas','tahukah-1','Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.','tahukah-anda','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:23.143','2026-09-21 03:21:23.143'),('tahukah-2','Tahukah Anda #2: Minat Membaca & Kemajuan Perpusnas','tahukah-2','Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.','tahukah-anda','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:23.149','2026-09-21 03:21:23.149'),('tahukah-3','Tahukah Anda #3: Minat Membaca & Kemajuan Perpusnas','tahukah-3','Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.','tahukah-anda','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:23.157','2026-09-21 03:21:23.157'),('tahukah-4','Tahukah Anda #4: Minat Membaca & Kemajuan Perpusnas','tahukah-4','Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.','tahukah-anda','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:23.165','2026-09-21 03:21:23.165'),('tahukah-5','Tahukah Anda #5: Minat Membaca & Kemajuan Perpusnas','tahukah-5','Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.','tahukah-anda','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:23.172','2026-09-21 03:21:23.172'),('tahukah-6','Tahukah Anda #6: Minat Membaca & Kemajuan Perpusnas','tahukah-6','Fasilitas Layanan Perpusnas di Jalan Medan Merdeka Selatan memiliki 27 lantai dan menjadi salah satu gedung perpustakaan nasional tertinggi dan termegah di dunia.','tahukah-anda','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:23.179','2026-09-21 03:21:23.179'),('tips-gaya-hidup-1','Tips & Gaya Hidup #1: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-1','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',18,145,'2026-09-21 03:21:23.186','2026-09-21 03:21:23.186'),('tips-gaya-hidup-2','Tips & Gaya Hidup #2: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-2','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',21,170,'2026-09-21 03:21:23.193','2026-09-21 03:21:23.193'),('tips-gaya-hidup-3','Tips & Gaya Hidup #3: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-3','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',24,195,'2026-09-21 03:21:23.199','2026-09-21 03:21:23.199'),('tips-gaya-hidup-4','Tips & Gaya Hidup #4: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-4','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',27,220,'2026-09-21 03:21:23.207','2026-09-21 03:21:23.207'),('tips-gaya-hidup-5','Tips & Gaya Hidup #5: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-5','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',30,245,'2026-09-21 03:21:23.213','2026-09-21 03:21:23.213'),('tips-gaya-hidup-6','Tips & Gaya Hidup #6: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-6','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',33,270,'2026-09-21 03:21:23.220','2026-09-21 03:21:23.220'),('tips-gaya-hidup-7','Tips & Gaya Hidup #7: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-7','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',36,295,'2026-09-21 03:21:23.226','2026-09-21 03:21:23.226'),('tips-gaya-hidup-8','Tips & Gaya Hidup #8: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-8','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','DRAFT',39,320,'2026-09-21 03:21:23.233','2026-09-21 03:21:23.233'),('tips-gaya-hidup-9','Tips & Gaya Hidup #9: Minat Membaca & Kemajuan Perpusnas','tips-gaya-hidup-9','Menjaga kesehatan postur tubuh, asupan hidrasi, dan manajemen stres adalah fondasi utama dalam meningkatkan produktivitas serta kenyamanan bekerja.','tips-gaya-hidup','cmuaohmus001ezbpbyejw0jab','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop','PUBLISHED',42,345,'2026-09-21 03:21:23.240','2026-09-21 03:21:23.240');
/*!40000 ALTER TABLE `postingan_pegawai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profil_pegawai`
--

DROP TABLE IF EXISTS `profil_pegawai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profil_pegawai` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unitKerja` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `golRuang` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` text COLLATE utf8mb4_unicode_ci,
  `birthDate` datetime(3) DEFAULT NULL,
  `education` text COLLATE utf8mb4_unicode_ci,
  `careerHistory` text COLLATE utf8mb4_unicode_ci,
  `achievements` text COLLATE utf8mb4_unicode_ci,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profil_pegawai_userId_key` (`userId`),
  UNIQUE KEY `profil_pegawai_nip_key` (`nip`),
  CONSTRAINT `profil_pegawai_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profil_pegawai`
--

LOCK TABLES `profil_pegawai` WRITE;
/*!40000 ALTER TABLE `profil_pegawai` DISABLE KEYS */;
INSERT INTO `profil_pegawai` VALUES ('cmuaohmus001fzbpbz3b85ips','cmuaohmus001ezbpbyejw0jab','ADMIN001','Administrator Sistem Perpusnas RI','Pranata Komputer Ahli Madya','Pusat Data dan Informasi (Pusdatin)','IV/a - Pembina','081299988776','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop','1985-05-10 00:00:00.000','S2 Magister Teknologi Informasi Universitas Indonesia','Staff Pusdatin (2010-2015), Kasubbag Infrastruktur IT (2016-2021), Pranata Komputer Ahli Madya (2022-Sekarang)','Inovator Terbaik Transformasi Layanan Digital Perpusnas 2024','Mengabdi untuk keandalan infrastruktur dan inovasi sistem digital Perpustakaan Nasional RI.','2026-09-21 03:21:15.509','2026-09-21 03:21:15.509'),('cmuaohmv6001izbpbsvfmcsv3','cmuaohmv6001hzbpb5rad9j5z','198501152010011001','Drs. Bambang Sudirman, M.Hum.','Pustakawan Ahli Madya','Direktorat Deposit dan Pengembangan Koleksi Bahan Pustaka','IV/b - Pembina Tingkat I','081122334455','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop','1985-01-15 00:00:00.000','S2 Ilmu Perpustakaan dan Informasi Universitas Indonesia','Pustakawan Pertama (2010-2015), Pustakawan Muda (2015-2020), Pustakawan Madya (2020-Sekarang)','Pustakawan Berprestasi Tingkat Nasional Kategori Pelestarian Naskah Kuno 2023','Pencinta manuskrip Nusantara dan penggerak digitalisasi naskah kuno nusantara.','2026-09-21 03:21:15.522','2026-09-21 03:21:15.522'),('cmuaohmve001lzbpb7pbzsqzf','cmuaohmvd001kzbpbpepi51ts','199003202015022003','Siti Nurhaliza, S.Sos.','Pranata Humas Ahli Muda','Biro Hukum, Organisasi, Kerja Sama, dan Hubungan Masyarakat','III/c - Penata','081344556677','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop','1990-03-20 00:00:00.000','S1 Ilmu Komunikasi Universitas Gadjah Mada','Staf Humas (2015-2019), Pranata Humas Ahli Pertama (2019-2023), Pranata Humas Ahli Muda (2023-Sekarang)','Penulis Siaran Pers Terbaik Kementerian/Lembaga Anugerah Media Humas 2024','Menyampaikan kabar literasi bangsa dengan integritas, keramahan, dan kreativitas.','2026-09-21 03:21:15.530','2026-09-21 03:21:15.530'),('cmuaohmvl001ozbpbd1qhph1n','cmuaohmvl001nzbpbjb6v0b4i','199208142018011005','Ahmad Fauzi, S.Kom.','Pranata Komputer Ahli Pertama','Pusat Data dan Informasi (Pusdatin)','III/b - Penata Muda Tingkat I','081566778899','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop','1992-08-14 00:00:00.000','S1 Teknik Informatika Institut Teknologi Bandung','Fullstack Developer Pusdatin Perpusnas (2018-Sekarang)','Pengembang Sistem Integrasi iPusnas dan Katalog Terdistribusi Nasional','Pengembang software antusias yang berdedikasi membangun aplikasi perpustakaan modern.','2026-09-21 03:21:15.537','2026-09-21 03:21:15.537'),('cmuaohmvr001rzbpbvda0a0vk','cmuaohmvr001qzbpbxn66k19q','198811052012012002','Dr. Ratna Dewi, M.Si.','Pustakawan Ahli Utama','Pusat Pengembangan Perpustakaan Sekolah/Madrasah dan Perguruan Tinggi','IV/c - Pembina Utama Muda','081277889900','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop','1988-11-05 00:00:00.000','S3 Manajemen Kebijakan Publik Universitas Indonesia','Koordinator Standardisasi Perpustakaan (2018-2022), Peneliti Kebijakan Literasi (2022-Sekarang)','Penerima Satyalancana Karya Satya X Tahun dari Presiden Republik Indonesia','Memajukan perpustakaan ramah inklusi dan standardisasi mutu perpustakaan se-Indonesia.','2026-09-21 03:21:15.544','2026-09-21 03:21:15.544');
/*!40000 ALTER TABLE `profil_pegawai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profil_tokoh`
--

DROP TABLE IF EXISTS `profil_tokoh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profil_tokoh` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unitKerja` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quote` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullStory` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `photoUrl` text COLLATE utf8mb4_unicode_ci,
  `achievements` text COLLATE utf8mb4_unicode_ci,
  `careerHistory` text COLLATE utf8mb4_unicode_ci,
  `isSpotlight` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profil_tokoh_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profil_tokoh`
--

LOCK TABLES `profil_tokoh` WRITE;
/*!40000 ALTER TABLE `profil_tokoh` DISABLE KEYS */;
INSERT INTO `profil_tokoh` VALUES ('cmuaohn2g003ozbpb4215ikht','Dra. Sri Sumekar, M.Si.','dra-sri-sumekar-m-si','Pustakawan Ahli Utama & Tokoh Pelestari Manuskrip Langka','Deputi Bidang Pengembangan Bahan Pustaka dan Jasa Informasi','Setiap helai naskah kuno yang kita selamatkan adalah satu nyawa ingatan peradaban leluhur yang kita wariskan kepada generasi emas masa depan.','Lebih dari 35 tahun mendedikasikan hidupnya di lingkungan Perpustakaan Nasional Republik Indonesia, Ibu Sri Sumekar telah menjelajahi ratusan pelosok tanah air dari ujung barat Sabang hingga Merauke demi melacak keberadaan manuskrip daun lontar, kulit kayu, dan kertas dluwang kuno.\n\nDengan ketekunan luar biasa, beliau memimpin pembentukan laboratorium kimia konservasi bahan perpustakaan pertama di Asia Tenggara yang memenuhi standar internasional IFLA-PAC. Kepemimpinan beliau yang humanis dan penuh keteladanan telah menginspirasi ratusan pustakawan muda di seluruh Indonesia.','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop','[\"Lifetime Achievement Award Ikatan Pustakawan Indonesia (IPI) 2024\",\"Pustakawan Teladan Nasional Kementerian Pendidikan & Kebudayaan RI\",\"Ketua Komite Akreditasi Preservasi Manuskrip Asia-Pasifik (2020-2024)\"]','[{\"year\":\"1989-1998\",\"role\":\"Konservator Bahan Pustaka Kertas Langka\"},{\"year\":\"1998-2008\",\"role\":\"Kepala Seksi Preservasi Fisik Naskah Kuno\"},{\"year\":\"2008-2018\",\"role\":\"Direktur Deposit Bahan Pustaka\"},{\"year\":\"2018-Sekarang\",\"role\":\"Pustakawan Ahli Utama Perpusnas RI\"}]',1,'2026-09-21 03:21:15.784','2026-09-21 03:21:15.784'),('cmuaohn2x003pzbpb3ifmuptr','Ir. Hendro Wicaksono, M.Eng.','ir-hendro-wicaksono-m-eng','Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu','Pusat Data dan Informasi (Pusdatin)','Teknologi adalah sarana, tetapi semangat melayani pemustaka dengan sepenuh hati adalah jiwa dari setiap baris kode yang kita bangun.','Ir. Hendro Wicaksono memimpin transformasi sistem perpustakaan dari era kartu katalog fisik menuju jaringan katalog daring terdistribusi nasional (INLISLite). Inovasi sistem otomasi open-source ini kini digunakan oleh lebih dari 25.000 perpustakaan sekolah, kampus, dan daerah di seluruh Indonesia secara cuma-cuma, menghemat anggaran negara puluhan miliar rupiah.','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop','[\"Top 10 Inovasi Pelayanan Publik KemenPAN-RB (Inovasi INLISLite)\",\"Anugerah Ksatria Bakti Literasi Teknologi 2023\"]','[{\"year\":\"2005-2012\",\"role\":\"System Analyst & Database Architect Pusdatin\"},{\"year\":\"2012-2020\",\"role\":\"Lead Architect INLISLite National Open System\"},{\"year\":\"2020-Sekarang\",\"role\":\"Pranata Komputer Ahli Madya Pusdatin\"}]',0,'2026-09-21 03:21:15.801','2026-09-21 03:21:15.801'),('fig-1','Dra. Sri Sumekar, M.Si.','dra-sri-sumekar-msi','Pustakawan Ahli Utama & Tokoh Pelestari Manuskrip Langka','Deputi Bidang Pengembangan Bahan Pustaka dan Jasa Informasi','Setiap helai naskah kuno yang kita selamatkan adalah satu nyawa ingatan peradaban leluhur yang kita wariskan kepada generasi emas masa depan.','Dra. Sri Sumekar, M.Si. dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',NULL,NULL,1,'2026-09-21 03:21:23.372','2026-09-21 03:21:23.372'),('fig-2','Ir. Hendro Wicaksono, M.Eng.','ir-hendro-wicaksono-meng','Inovator Arsitektur Sistem Informasi Perpustakaan Terpadu','Pusat Data dan Informasi Perpustakaan Nasional RI','Teknologi adalah sarana, tetapi semangat melayani pemustaka dengan sepenuh hati adalah jiwa dari setiap baris kode yang kita bangun.','Ir. Hendro Wicaksono, M.Eng. dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',NULL,NULL,1,'2026-09-21 03:21:23.383','2026-09-21 03:21:23.383'),('fig-3','Drs. Supriyanto, M.Hum.','drs-supriyanto-mhum','Pustakawan Madya & Kurator Koleksi Khusus Nusantara','Direktorat Deposit dan Pengembangan Koleksi Perpustakaan','Koleksi perpustakaan adalah jembatan pengetahuan yang menghubungkan kebijaksanaan masa lalu dengan penjelajahan masa depan.','Drs. Supriyanto, M.Hum. dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',NULL,NULL,1,'2026-09-21 03:21:23.392','2026-09-21 03:21:23.392'),('fig-4','Prof. Dr. Sulistyo Basuki','prof-dr-sulistyo-basuki','Pakar Ilmu Perpustakaan & Tokoh Pendidikan Kepustakawanan','Pusat Pembinaan Pustakawan Perpusnas RI','Profesi pustakawan bukan sekadar penjaga buku, melainkan navigator peradaban di tengah samudera informasi dunia.','Prof. Dr. Sulistyo Basuki dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',NULL,NULL,1,'2026-09-21 03:21:23.401','2026-09-21 03:21:23.401'),('fig-5','Dr. Adi Wibowo, M.Si.','dr-adi-wibowo-msi','Peneliti Konservasi Kertas Kuno & Bahan Repositori Tropis','Pusat Preservasi dan Alih Media Bahan Perpustakaan','Merawat lembaran rapuh naskah sejarah membutuhkan ketelitian sains dan ketulusan hati.','Dr. Adi Wibowo, M.Si. dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',NULL,NULL,1,'2026-09-21 03:21:23.414','2026-09-21 03:21:23.414'),('fig-6','Nurcahyono, S.S., M.Si.','nurcahyono-ss-msi','Pegiat Transformasi Layanan Digital & Budaya Baca Pemustaka','Pusat Pengembangan Perpustakaan Sekolah/Madrasah dan PT','Inovasi ruang baca digital membuka gerbang tak terbatas bagi anak-anak pelosok untuk menggapai mimpi setinggi langit.','Nurcahyono, S.S., M.Si. dikenal atas kontribusi dan dedikasinya yang luar biasa di lingkungan Perpustakaan Nasional RI. Beliau terus menginspirasi generasi muda ASN melalui keteladanan profesionalisme, inovasi riset, dan pengabdian tulus bagi kemajuan literasi bangsa.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',NULL,NULL,1,'2026-09-21 03:21:23.428','2026-09-21 03:21:23.428');
/*!40000 ALTER TABLE `profil_tokoh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topik_konsultasi`
--

DROP TABLE IF EXISTS `topik_konsultasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topik_konsultasi` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OPEN',
  `isPrivate` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `topik_konsultasi_authorId_fkey` (`authorId`),
  CONSTRAINT `topik_konsultasi_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topik_konsultasi`
--

LOCK TABLES `topik_konsultasi` WRITE;
/*!40000 ALTER TABLE `topik_konsultasi` DISABLE KEYS */;
INSERT INTO `topik_konsultasi` VALUES ('cmuaohn1v003hzbpb9qvd0lp3','Prosedur Pengusulan Angka Kredit (PAK) Jabatan Fungsional Pustakawan 2026','KEPEGAWAIAN','Mohon info batas waktu pengunggahan berkas dupak/e-kinerja periode penilaian kenaikan pangkat Oktober mendatang bagi fungsional muda ke madya.','cmuaohmvl001nzbpbjb6v0b4i','ANSWERED',0,'2026-09-21 03:21:15.763','2026-09-21 03:21:15.763'),('cmuaohn28003lzbpbh851jkkc','Kendala Akses VPN Internal saat Work From Home','IT','Koneksi VPN Pusdatin sering terputus setelah 15 menit saat mengakses server repositori naskah dari rumah. Bagaimana solusinya?','cmuaohmv6001hzbpb5rad9j5z','ANSWERED',0,'2026-09-21 03:21:15.776','2026-09-21 03:21:15.776'),('kon-1','Topik Konsultasi #1: Penyesuaian Angka Kredit Pustakawan','KEPEGAWAIAN','Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?','cmuaohmus001ezbpbyejw0jab','ANSWERED',0,'2026-09-21 03:21:23.437','2026-09-21 03:21:23.437'),('kon-2','Topik Konsultasi #2: Penyesuaian Angka Kredit Pustakawan','IT','Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?','cmuaohmus001ezbpbyejw0jab','OPEN',0,'2026-09-21 03:21:23.451','2026-09-21 03:21:23.451'),('kon-3','Topik Konsultasi #3: Penyesuaian Angka Kredit Pustakawan','KEPEGAWAIAN','Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?','cmuaohmus001ezbpbyejw0jab','ANSWERED',0,'2026-09-21 03:21:23.462','2026-09-21 03:21:23.462'),('kon-4','Topik Konsultasi #4: Penyesuaian Angka Kredit Pustakawan','IT','Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?','cmuaohmus001ezbpbyejw0jab','OPEN',0,'2026-09-21 03:21:23.469','2026-09-21 03:21:23.469'),('kon-5','Topik Konsultasi #5: Penyesuaian Angka Kredit Pustakawan','KEPEGAWAIAN','Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?','cmuaohmus001ezbpbyejw0jab','ANSWERED',0,'2026-09-21 03:21:23.477','2026-09-21 03:21:23.477'),('kon-6','Topik Konsultasi #6: Penyesuaian Angka Kredit Pustakawan','IT','Bagaimana prosedur konversi angka kredit konvensional ke integrasi melalui sistem kepegawaian nasional?','cmuaohmus001ezbpbyejw0jab','OPEN',0,'2026-09-21 03:21:23.484','2026-09-21 03:21:23.484');
/*!40000 ALTER TABLE `topik_konsultasi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-21 10:21:43

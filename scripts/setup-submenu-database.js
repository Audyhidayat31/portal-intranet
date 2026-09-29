const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting creation of dedicated sub-menu tables...');

  // 1. DEDICATED TABLES CREATION SQL
  const createTablesSQL = [
    // BERITA
    `CREATE TABLE IF NOT EXISTS \`berita\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`ringkasan\` text COLLATE utf8mb4_unicode_ci,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`nama_penulis\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Humas Perpusnas',
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`tanggal_terbit\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`disematkan\` tinyint(1) NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`berita_slug_key\` (\`slug\`),
      KEY \`berita_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`berita_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // PENGUMUMAN
    `CREATE TABLE IF NOT EXISTS \`pengumuman\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`ringkasan\` text COLLATE utf8mb4_unicode_ci,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`file_lampiran\` text COLLATE utf8mb4_unicode_ci,
      \`nama_lampiran\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`ukuran_file\` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`nama_penulis\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Biro SDM Perpusnas',
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`tanggal_terbit\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`disematkan\` tinyint(1) NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`pengumuman_slug_key\` (\`slug\`),
      KEY \`pengumuman_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`pengumuman_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // AGENDA KEGIATAN
    `CREATE TABLE IF NOT EXISTS \`agenda_kegiatan\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`nama_kegiatan\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`deskripsi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`tanggal_mulai\` datetime(3) NOT NULL,
      \`tanggal_selesai\` datetime(3) DEFAULT NULL,
      \`lokasi\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`tanggal_terbit\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`agenda_slug_key\` (\`slug\`),
      KEY \`agenda_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`agenda_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // LAPORAN PERJALANAN DINAS
    `CREATE TABLE IF NOT EXISTS \`laporan_perjalanan_dinas\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul_laporan\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`kota_tujuan\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`ringkasan\` text COLLATE utf8mb4_unicode_ci,
      \`laporan_lengkap\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`file_laporan\` text COLLATE utf8mb4_unicode_ci,
      \`nama_file\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`tanggal_terbit\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`laporan_perjalanan_slug_key\` (\`slug\`),
      KEY \`laporan_perjalanan_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`laporan_perjalanan_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // DOKUMEN INTERN
    `CREATE TABLE IF NOT EXISTS \`dokumen_intern\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`nama_dokumen\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`deskripsi\` text COLLATE utf8mb4_unicode_ci,
      \`kategori_dokumen\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Pedoman & SOP',
      \`file_url\` text COLLATE utf8mb4_unicode_ci,
      \`nama_file\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`ukuran_file\` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`tanggal_terbit\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`dokumen_intern_slug_key\` (\`slug\`),
      KEY \`dokumen_intern_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`dokumen_intern_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // KUPAS SOSOK
    `CREATE TABLE IF NOT EXISTS \`kupas_sosok\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`nama_tokoh\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`jabatan\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`unit_kerja\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`kutipan_inspiratif\` text COLLATE utf8mb4_unicode_ci NOT NULL,
      \`cerita_lengkap\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`foto_url\` text COLLATE utf8mb4_unicode_ci,
      \`prestasi\` text COLLATE utf8mb4_unicode_ci,
      \`riwayat_karier\` text COLLATE utf8mb4_unicode_ci,
      \`is_spotlight\` tinyint(1) NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`kupas_sosok_slug_key\` (\`slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // CORETAN OPINI PEGAWAI
    `CREATE TABLE IF NOT EXISTS \`coretan_opini\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`coretan_opini_slug_key\` (\`slug\`),
      KEY \`coretan_opini_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`coretan_opini_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // HUMOR PEGAWAI
    `CREATE TABLE IF NOT EXISTS \`humor_pegawai\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`humor_pegawai_slug_key\` (\`slug\`),
      KEY \`humor_pegawai_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`humor_pegawai_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // JELAJAH BUMI
    `CREATE TABLE IF NOT EXISTS \`jelajah_bumi\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`jelajah_bumi_slug_key\` (\`slug\`),
      KEY \`jelajah_bumi_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`jelajah_bumi_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // KABAR KELUARGA
    `CREATE TABLE IF NOT EXISTS \`kabar_keluarga\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`kabar_keluarga_slug_key\` (\`slug\`),
      KEY \`kabar_keluarga_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`kabar_keluarga_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // KALIMAT BIJAK
    `CREATE TABLE IF NOT EXISTS \`kalimat_bijak\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`kalimat_bijak_slug_key\` (\`slug\`),
      KEY \`kalimat_bijak_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`kalimat_bijak_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // KARYA AKADEMIK
    `CREATE TABLE IF NOT EXISTS \`karya_akademik\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`karya_akademik_slug_key\` (\`slug\`),
      KEY \`karya_akademik_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`karya_akademik_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // TIPS DAN GAYA HIDUP
    `CREATE TABLE IF NOT EXISTS \`tips_gaya_hidup\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`tips_gaya_hidup_slug_key\` (\`slug\`),
      KEY \`tips_gaya_hidup_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`tips_gaya_hidup_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // OLAHRAGA
    `CREATE TABLE IF NOT EXISTS \`olahraga\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`olahraga_slug_key\` (\`slug\`),
      KEY \`olahraga_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`olahraga_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // TAHUKAH ANDA
    `CREATE TABLE IF NOT EXISTS \`tahukah_anda\` (
      \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`judul\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`isi\` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
      \`gambar_sampul\` text COLLATE utf8mb4_unicode_ci,
      \`penulis_id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
      \`status\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TERBIT',
      \`jumlah_suka\` int NOT NULL DEFAULT '0',
      \`jumlah_baca\` int NOT NULL DEFAULT '0',
      \`created_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`tahukah_anda_slug_key\` (\`slug\`),
      KEY \`tahukah_anda_penulis_id_fkey\` (\`penulis_id\`),
      CONSTRAINT \`tahukah_anda_penulis_id_fkey\` FOREIGN KEY (\`penulis_id\`) REFERENCES \`pengguna\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  ];

  for (const sql of createTablesSQL) {
    await prisma.$executeRawUnsafe(sql);
  }
  console.log('✅ All dedicated sub-menu tables created successfully!');

  // 2. MIGRATE & SYNC DATA FROM konten & postingan_pegawai & profil_tokoh
  console.log('🔄 Populating data into dedicated tables...');

  // BERITA
  await prisma.$executeRawUnsafe(`
    INSERT INTO \`berita\` (\`id\`, \`judul\`, \`slug\`, \`ringkasan\`, \`isi\`, \`gambar_sampul\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`jumlah_baca\`, \`disematkan\`, \`created_at\`, \`updated_at\`)
    SELECT k.\`id\`, k.\`title\`, k.\`slug\`, k.\`excerpt\`, k.\`body\`, k.\`coverImage\`, k.\`authorId\`, k.\`status\`, k.\`publishedAt\`, k.\`viewCount\`, k.\`isPinned\`, k.\`createdAt\`, k.\`updatedAt\`
    FROM \`konten\` k
    WHERE k.\`type\` = 'NEWS'
    ON DUPLICATE KEY UPDATE 
      \`judul\` = VALUES(\`judul\`), 
      \`isi\` = VALUES(\`isi\`), 
      \`ringkasan\` = VALUES(\`ringkasan\`), 
      \`gambar_sampul\` = VALUES(\`gambar_sampul\`), 
      \`status\` = VALUES(\`status\`);
  `);
  console.log('  ↳ Table berita populated.');

  // PENGUMUMAN
  await prisma.$executeRawUnsafe(`
    INSERT INTO \`pengumuman\` (\`id\`, \`judul\`, \`slug\`, \`ringkasan\`, \`isi\`, \`file_lampiran\`, \`nama_lampiran\`, \`ukuran_file\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`disematkan\`, \`created_at\`, \`updated_at\`)
    SELECT k.\`id\`, k.\`title\`, k.\`slug\`, k.\`excerpt\`, k.\`body\`, k.\`attachmentUrl\`, k.\`attachmentName\`, k.\`fileSize\`, k.\`authorId\`, k.\`status\`, k.\`publishedAt\`, k.\`isPinned\`, k.\`createdAt\`, k.\`updatedAt\`
    FROM \`konten\` k
    WHERE k.\`type\` = 'ANNOUNCEMENT'
    ON DUPLICATE KEY UPDATE 
      \`judul\` = VALUES(\`judul\`), 
      \`isi\` = VALUES(\`isi\`), 
      \`file_lampiran\` = VALUES(\`file_lampiran\`), 
      \`status\` = VALUES(\`status\`);
  `);
  console.log('  ↳ Table pengumuman populated.');

  // AGENDA KEGIATAN
  await prisma.$executeRawUnsafe(`
    INSERT INTO \`agenda_kegiatan\` (\`id\`, \`nama_kegiatan\`, \`slug\`, \`deskripsi\`, \`tanggal_mulai\`, \`tanggal_selesai\`, \`lokasi\`, \`gambar_sampul\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`created_at\`, \`updated_at\`)
    SELECT k.\`id\`, k.\`title\`, k.\`slug\`, k.\`body\`, COALESCE(k.\`eventStartDate\`, k.\`createdAt\`), k.\`eventEndDate\`, COALESCE(k.\`eventLocation\`, 'Gedung Layanan Perpusnas Salemba / Merdeka Selatan'), k.\`coverImage\`, k.\`authorId\`, k.\`status\`, k.\`publishedAt\`, k.\`createdAt\`, k.\`updatedAt\`
    FROM \`konten\` k
    WHERE k.\`type\` = 'AGENDA'
    ON DUPLICATE KEY UPDATE 
      \`nama_kegiatan\` = VALUES(\`nama_kegiatan\`), 
      \`deskripsi\` = VALUES(\`deskripsi\`), 
      \`lokasi\` = VALUES(\`lokasi\`), 
      \`status\` = VALUES(\`status\`);
  `);
  console.log('  ↳ Table agenda_kegiatan populated.');

  // LAPORAN PERJALANAN DINAS
  await prisma.$executeRawUnsafe(`
    INSERT INTO \`laporan_perjalanan_dinas\` (\`id\`, \`judul_laporan\`, \`slug\`, \`kota_tujuan\`, \`ringkasan\`, \`laporan_lengkap\`, \`file_laporan\`, \`nama_file\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`created_at\`, \`updated_at\`)
    SELECT k.\`id\`, k.\`title\`, k.\`slug\`, COALESCE(k.\`destinationCity\`, 'Jakarta'), k.\`excerpt\`, k.\`body\`, k.\`attachmentUrl\`, k.\`attachmentName\`, k.\`authorId\`, k.\`status\`, k.\`publishedAt\`, k.\`createdAt\`, k.\`updatedAt\`
    FROM \`konten\` k
    WHERE k.\`type\` = 'BUSINESS_TRIP'
    ON DUPLICATE KEY UPDATE 
      \`judul_laporan\` = VALUES(\`judul_laporan\`), 
      \`kota_tujuan\` = VALUES(\`kota_tujuan\`), 
      \`laporan_lengkap\` = VALUES(\`laporan_lengkap\`), 
      \`status\` = VALUES(\`status\`);
  `);
  console.log('  ↳ Table laporan_perjalanan_dinas populated.');

  // DOKUMEN INTERN
  await prisma.$executeRawUnsafe(`
    INSERT INTO \`dokumen_intern\` (\`id\`, \`nama_dokumen\`, \`slug\`, \`deskripsi\`, \`kategori_dokumen\`, \`file_url\`, \`nama_file\`, \`ukuran_file\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`created_at\`, \`updated_at\`)
    SELECT k.\`id\`, k.\`title\`, k.\`slug\`, k.\`excerpt\`, 'SOP & Regulasi Kedinasan', k.\`attachmentUrl\`, k.\`attachmentName\`, k.\`fileSize\`, k.\`authorId\`, k.\`status\`, k.\`publishedAt\`, k.\`createdAt\`, k.\`updatedAt\`
    FROM \`konten\` k
    WHERE k.\`type\` = 'INTERNAL_DOCUMENT'
    ON DUPLICATE KEY UPDATE 
      \`nama_dokumen\` = VALUES(\`nama_dokumen\`), 
      \`deskripsi\` = VALUES(\`deskripsi\`), 
      \`file_url\` = VALUES(\`file_url\`), 
      \`status\` = VALUES(\`status\`);
  `);
  console.log('  ↳ Table dokumen_intern populated.');

  // KUPAS SOSOK
  await prisma.$executeRawUnsafe(`
    INSERT INTO \`kupas_sosok\` (\`id\`, \`nama_tokoh\`, \`slug\`, \`jabatan\`, \`unit_kerja\`, \`kutipan_inspiratif\`, \`cerita_lengkap\`, \`foto_url\`, \`prestasi\`, \`riwayat_karier\`, \`is_spotlight\`, \`created_at\`, \`updated_at\`)
    SELECT p.\`id\`, p.\`name\`, p.\`slug\`, p.\`position\`, p.\`unitKerja\`, p.\`quote\`, p.\`fullStory\`, p.\`photoUrl\`, p.\`achievements\`, p.\`careerHistory\`, p.\`isSpotlight\`, p.\`createdAt\`, p.\`updatedAt\`
    FROM \`profil_tokoh\` p
    ON DUPLICATE KEY UPDATE 
      \`nama_tokoh\` = VALUES(\`nama_tokoh\`), 
      \`jabatan\` = VALUES(\`jabatan\`), 
      \`kutipan_inspiratif\` = VALUES(\`kutipan_inspiratif\`), 
      \`cerita_lengkap\` = VALUES(\`cerita_lengkap\`);
  `);
  console.log('  ↳ Table kupas_sosok populated.');

  // ANTAR PEGAWAI TABLES POPULATION
  const catMapping = [
    { table: 'coretan_opini', slug: 'opini' },
    { table: 'humor_pegawai', slug: 'humor' },
    { table: 'jelajah_bumi', slug: 'jelajah-bumi' },
    { table: 'kabar_keluarga', slug: 'kabar-keluarga' },
    { table: 'kalimat_bijak', slug: 'kalimat-bijak' },
    { table: 'karya_akademik', slug: 'karya-akademik' },
    { table: 'tips_gaya_hidup', slug: 'tips-gaya-hidup' },
    { table: 'olahraga', slug: 'olahraga' },
    { table: 'tahukah_anda', slug: 'tahukah-anda' },
  ];

  for (const m of catMapping) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO \`${m.table}\` (\`id\`, \`judul\`, \`slug\`, \`isi\`, \`gambar_sampul\`, \`penulis_id\`, \`status\`, \`jumlah_suka\`, \`jumlah_baca\`, \`created_at\`, \`updated_at\`)
      SELECT p.\`id\`, p.\`title\`, p.\`slug\`, p.\`body\`, p.\`coverImage\`, p.\`authorId\`, p.\`status\`, p.\`likesCount\`, p.\`viewsCount\`, p.\`createdAt\`, p.\`updatedAt\`
      FROM \`postingan_pegawai\` p
      WHERE p.\`categorySlug\` = '${m.slug}'
      ON DUPLICATE KEY UPDATE 
        \`judul\` = VALUES(\`judul\`), 
        \`isi\` = VALUES(\`isi\`), 
        \`gambar_sampul\` = VALUES(\`gambar_sampul\`), 
        \`status\` = VALUES(\`status\`);
    `);
    console.log(`  ↳ Table ${m.table} populated.`);
  }

  // 3. CREATE SYNC TRIGGERS SO FUTURE INSERTS/UPDATES STAY 100% IN SYNC
  console.log('⚡ Setting up bidirectional database triggers...');

  // Helper to drop and create trigger
  async function setupTrigger(triggerName, triggerSQL) {
    try {
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS \`${triggerName}\`;`);
      await prisma.$executeRawUnsafe(triggerSQL);
    } catch (e) {
      console.warn(`Trigger ${triggerName} warning:`, e.message);
    }
  }

  // Trigger: when new berita is inserted directly into `berita` table, sync to `konten`
  await setupTrigger('trg_berita_after_insert', `
    CREATE TRIGGER \`trg_berita_after_insert\` AFTER INSERT ON \`berita\`
    FOR EACH ROW
    BEGIN
      INSERT INTO \`konten\` (\`id\`, \`title\`, \`slug\`, \`excerpt\`, \`body\`, \`coverImage\`, \`type\`, \`status\`, \`authorId\`, \`publishedAt\`, \`isPinned\`, \`viewCount\`, \`createdAt\`, \`updatedAt\`)
      VALUES (NEW.\`id\`, NEW.\`judul\`, NEW.\`slug\`, NEW.\`ringkasan\`, NEW.\`isi\`, NEW.\`gambar_sampul\`, 'NEWS', NEW.\`status\`, NEW.\`penulis_id\`, NEW.\`tanggal_terbit\`, NEW.\`disematkan\`, NEW.\`jumlah_baca\`, NEW.\`created_at\`, NEW.\`updated_at\`)
      ON DUPLICATE KEY UPDATE \`title\` = NEW.\`judul\`, \`body\` = NEW.\`isi\`, \`excerpt\` = NEW.\`ringkasan\`, \`coverImage\` = NEW.\`gambar_sampul\`, \`status\` = NEW.\`status\`;
    END;
  `);

  // Trigger: when berita is updated, update `konten`
  await setupTrigger('trg_berita_after_update', `
    CREATE TRIGGER \`trg_berita_after_update\` AFTER UPDATE ON \`berita\`
    FOR EACH ROW
    BEGIN
      UPDATE \`konten\`
      SET \`title\` = NEW.\`judul\`, \`body\` = NEW.\`isi\`, \`excerpt\` = NEW.\`ringkasan\`, \`coverImage\` = NEW.\`gambar_sampul\`, \`status\` = NEW.\`status\`
      WHERE \`id\` = NEW.\`id\`;
    END;
  `);

  // Trigger: when berita is deleted, delete from `konten`
  await setupTrigger('trg_berita_after_delete', `
    CREATE TRIGGER \`trg_berita_after_delete\` AFTER DELETE ON \`berita\`
    FOR EACH ROW
    BEGIN
      DELETE FROM \`konten\` WHERE \`id\` = OLD.\`id\` AND \`type\` = 'NEWS';
    END;
  `);

  // Trigger: when pengumuman is inserted directly into `pengumuman`
  await setupTrigger('trg_pengumuman_after_insert', `
    CREATE TRIGGER \`trg_pengumuman_after_insert\` AFTER INSERT ON \`pengumuman\`
    FOR EACH ROW
    BEGIN
      INSERT INTO \`konten\` (\`id\`, \`title\`, \`slug\`, \`excerpt\`, \`body\`, \`attachmentUrl\`, \`attachmentName\`, \`fileSize\`, \`type\`, \`status\`, \`authorId\`, \`publishedAt\`, \`isPinned\`, \`createdAt\`, \`updatedAt\`)
      VALUES (NEW.\`id\`, NEW.\`judul\`, NEW.\`slug\`, NEW.\`ringkasan\`, NEW.\`isi\`, NEW.\`file_lampiran\`, NEW.\`nama_lampiran\`, NEW.\`ukuran_file\`, 'ANNOUNCEMENT', NEW.\`status\`, NEW.\`penulis_id\`, NEW.\`tanggal_terbit\`, NEW.\`disematkan\`, NEW.\`created_at\`, NEW.\`updated_at\`)
      ON DUPLICATE KEY UPDATE \`title\` = NEW.\`judul\`, \`body\` = NEW.\`isi\`, \`attachmentUrl\` = NEW.\`file_lampiran\`, \`status\` = NEW.\`status\`;
    END;
  `);

  // Trigger: when agenda is inserted directly into `agenda_kegiatan`
  await setupTrigger('trg_agenda_after_insert', `
    CREATE TRIGGER \`trg_agenda_after_insert\` AFTER INSERT ON \`agenda_kegiatan\`
    FOR EACH ROW
    BEGIN
      INSERT INTO \`konten\` (\`id\`, \`title\`, \`slug\`, \`body\`, \`eventStartDate\`, \`eventEndDate\`, \`eventLocation\`, \`coverImage\`, \`type\`, \`status\`, \`authorId\`, \`publishedAt\`, \`createdAt\`, \`updatedAt\`)
      VALUES (NEW.\`id\`, NEW.\`nama_kegiatan\`, NEW.\`slug\`, NEW.\`deskripsi\`, NEW.\`tanggal_mulai\`, NEW.\`tanggal_selesai\`, NEW.\`lokasi\`, NEW.\`gambar_sampul\`, 'AGENDA', NEW.\`status\`, NEW.\`penulis_id\`, NEW.\`tanggal_terbit\`, NEW.\`created_at\`, NEW.\`updated_at\`)
      ON DUPLICATE KEY UPDATE \`title\` = NEW.\`nama_kegiatan\`, \`body\` = NEW.\`deskripsi\`, \`eventLocation\` = NEW.\`lokasi\`, \`status\` = NEW.\`status\`;
    END;
  `);

  // Trigger: when laporan perjalanan is inserted directly into `laporan_perjalanan_dinas`
  await setupTrigger('trg_laporan_after_insert', `
    CREATE TRIGGER \`trg_laporan_after_insert\` AFTER INSERT ON \`laporan_perjalanan_dinas\`
    FOR EACH ROW
    BEGIN
      INSERT INTO \`konten\` (\`id\`, \`title\`, \`slug\`, \`destinationCity\`, \`excerpt\`, \`body\`, \`attachmentUrl\`, \`attachmentName\`, \`type\`, \`status\`, \`authorId\`, \`publishedAt\`, \`createdAt\`, \`updatedAt\`)
      VALUES (NEW.\`id\`, NEW.\`judul_laporan\`, NEW.\`slug\`, NEW.\`kota_tujuan\`, NEW.\`ringkasan\`, NEW.\`laporan_lengkap\`, NEW.\`file_laporan\`, NEW.\`nama_file\`, 'BUSINESS_TRIP', NEW.\`status\`, NEW.\`penulis_id\`, NEW.\`tanggal_terbit\`, NEW.\`created_at\`, NEW.\`updated_at\`)
      ON DUPLICATE KEY UPDATE \`title\` = NEW.\`judul_laporan\`, \`destinationCity\` = NEW.\`kota_tujuan\`, \`body\` = NEW.\`laporan_lengkap\`, \`status\` = NEW.\`status\`;
    END;
  `);

  // Trigger: when dokumen intern is inserted directly into `dokumen_intern`
  await setupTrigger('trg_dokumen_after_insert', `
    CREATE TRIGGER \`trg_dokumen_after_insert\` AFTER INSERT ON \`dokumen_intern\`
    FOR EACH ROW
    BEGIN
      INSERT INTO \`konten\` (\`id\`, \`title\`, \`slug\`, \`excerpt\`, \`body\`, \`attachmentUrl\`, \`attachmentName\`, \`fileSize\`, \`type\`, \`status\`, \`authorId\`, \`publishedAt\`, \`createdAt\`, \`updatedAt\`)
      VALUES (NEW.\`id\`, NEW.\`nama_dokumen\`, NEW.\`slug\`, NEW.\`deskripsi\`, NEW.\`deskripsi\`, NEW.\`file_url\`, NEW.\`nama_file\`, NEW.\`ukuran_file\`, 'INTERNAL_DOCUMENT', NEW.\`status\`, NEW.\`penulis_id\`, NEW.\`tanggal_terbit\`, NEW.\`created_at\`, NEW.\`updated_at\`)
      ON DUPLICATE KEY UPDATE \`title\` = NEW.\`nama_dokumen\`, \`body\` = NEW.\`deskripsi\`, \`attachmentUrl\` = NEW.\`file_url\`, \`status\` = NEW.\`status\`;
    END;
  `);

  // Trigger: when kupas_sosok is inserted directly into `kupas_sosok`
  await setupTrigger('trg_kupas_sosok_after_insert', `
    CREATE TRIGGER \`trg_kupas_sosok_after_insert\` AFTER INSERT ON \`kupas_sosok\`
    FOR EACH ROW
    BEGIN
      INSERT INTO \`profil_tokoh\` (\`id\`, \`name\`, \`slug\`, \`position\`, \`unitKerja\`, \`quote\`, \`fullStory\`, \`photoUrl\`, \`achievements\`, \`careerHistory\`, \`isSpotlight\`, \`createdAt\`, \`updatedAt\`)
      VALUES (NEW.\`id\`, NEW.\`nama_tokoh\`, NEW.\`slug\`, NEW.\`jabatan\`, NEW.\`unit_kerja\`, NEW.\`kutipan_inspiratif\`, NEW.\`cerita_lengkap\`, NEW.\`foto_url\`, NEW.\`prestasi\`, NEW.\`riwayat_karier\`, NEW.\`is_spotlight\`, NEW.\`created_at\`, NEW.\`updated_at\`)
      ON DUPLICATE KEY UPDATE \`name\` = NEW.\`nama_tokoh\`, \`position\` = NEW.\`jabatan\`, \`quote\` = NEW.\`kutipan_inspiratif\`, \`fullStory\` = NEW.\`cerita_lengkap\`;
    END;
  `);

  // Triggers from `konten` to dedicated tables
  await setupTrigger('trg_konten_after_insert_sync', `
    CREATE TRIGGER \`trg_konten_after_insert_sync\` AFTER INSERT ON \`konten\`
    FOR EACH ROW
    BEGIN
      IF NEW.\`type\` = 'NEWS' THEN
        INSERT INTO \`berita\` (\`id\`, \`judul\`, \`slug\`, \`ringkasan\`, \`isi\`, \`gambar_sampul\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`jumlah_baca\`, \`disematkan\`, \`created_at\`, \`updated_at\`)
        VALUES (NEW.\`id\`, NEW.\`title\`, NEW.\`slug\`, NEW.\`excerpt\`, NEW.\`body\`, NEW.\`coverImage\`, NEW.\`authorId\`, NEW.\`status\`, NEW.\`publishedAt\`, NEW.\`viewCount\`, NEW.\`isPinned\`, NEW.\`createdAt\`, NEW.\`updatedAt\`)
        ON DUPLICATE KEY UPDATE \`judul\` = NEW.\`title\`, \`isi\` = NEW.\`body\`, \`ringkasan\` = NEW.\`excerpt\`, \`gambar_sampul\` = NEW.\`coverImage\`, \`status\` = NEW.\`status\`;
      ELSEIF NEW.\`type\` = 'ANNOUNCEMENT' THEN
        INSERT INTO \`pengumuman\` (\`id\`, \`judul\`, \`slug\`, \`ringkasan\`, \`isi\`, \`file_lampiran\`, \`nama_lampiran\`, \`ukuran_file\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`disematkan\`, \`created_at\`, \`updated_at\`)
        VALUES (NEW.\`id\`, NEW.\`title\`, NEW.\`slug\`, NEW.\`excerpt\`, NEW.\`body\`, NEW.\`attachmentUrl\`, NEW.\`attachmentName\`, NEW.\`fileSize\`, NEW.\`authorId\`, NEW.\`status\`, NEW.\`publishedAt\`, NEW.\`isPinned\`, NEW.\`createdAt\`, NEW.\`updatedAt\`)
        ON DUPLICATE KEY UPDATE \`judul\` = NEW.\`title\`, \`isi\` = NEW.\`body\`, \`file_lampiran\` = NEW.\`attachmentUrl\`, \`status\` = NEW.\`status\`;
      ELSEIF NEW.\`type\` = 'AGENDA' THEN
        INSERT INTO \`agenda_kegiatan\` (\`id\`, \`nama_kegiatan\`, \`slug\`, \`deskripsi\`, \`tanggal_mulai\`, \`tanggal_selesai\`, \`lokasi\`, \`gambar_sampul\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`created_at\`, \`updated_at\`)
        VALUES (NEW.\`id\`, NEW.\`title\`, NEW.\`slug\`, NEW.\`body\`, COALESCE(NEW.\`eventStartDate\`, NEW.\`createdAt\`), NEW.\`eventEndDate\`, COALESCE(NEW.\`eventLocation\`, 'Perpusnas'), NEW.\`coverImage\`, NEW.\`authorId\`, NEW.\`status\`, NEW.\`publishedAt\`, NEW.\`createdAt\`, NEW.\`updatedAt\`)
        ON DUPLICATE KEY UPDATE \`nama_kegiatan\` = NEW.\`title\`, \`deskripsi\` = NEW.\`body\`, \`lokasi\` = NEW.\`eventLocation\`, \`status\` = NEW.\`status\`;
      ELSEIF NEW.\`type\` = 'BUSINESS_TRIP' THEN
        INSERT INTO \`laporan_perjalanan_dinas\` (\`id\`, \`judul_laporan\`, \`slug\`, \`kota_tujuan\`, \`ringkasan\`, \`laporan_lengkap\`, \`file_laporan\`, \`nama_file\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`created_at\`, \`updated_at\`)
        VALUES (NEW.\`id\`, NEW.\`title\`, NEW.\`slug\`, COALESCE(NEW.\`destinationCity\`, 'Jakarta'), NEW.\`excerpt\`, NEW.\`body\`, NEW.\`attachmentUrl\`, NEW.\`attachmentName\`, NEW.\`authorId\`, NEW.\`status\`, NEW.\`publishedAt\`, NEW.\`createdAt\`, NEW.\`updatedAt\`)
        ON DUPLICATE KEY UPDATE \`judul_laporan\` = NEW.\`title\`, \`kota_tujuan\` = NEW.\`destinationCity\`, \`laporan_lengkap\` = NEW.\`body\`, \`status\` = NEW.\`status\`;
      ELSEIF NEW.\`type\` = 'INTERNAL_DOCUMENT' THEN
        INSERT INTO \`dokumen_intern\` (\`id\`, \`nama_dokumen\`, \`slug\`, \`deskripsi\`, \`kategori_dokumen\`, \`file_url\`, \`nama_file\`, \`ukuran_file\`, \`penulis_id\`, \`status\`, \`tanggal_terbit\`, \`created_at\`, \`updated_at\`)
        VALUES (NEW.\`id\`, NEW.\`title\`, NEW.\`slug\`, NEW.\`excerpt\`, 'SOP & Dokumen Resmi', NEW.\`attachmentUrl\`, NEW.\`attachmentName\`, NEW.\`fileSize\`, NEW.\`authorId\`, NEW.\`status\`, NEW.\`publishedAt\`, NEW.\`createdAt\`, NEW.\`updatedAt\`)
        ON DUPLICATE KEY UPDATE \`nama_dokumen\` = NEW.\`title\`, \`deskripsi\` = NEW.\`excerpt\`, \`file_url\` = NEW.\`attachmentUrl\`, \`status\` = NEW.\`status\`;
      END IF;
    END;
  `);

  await setupTrigger('trg_konten_after_update_sync', `
    CREATE TRIGGER \`trg_konten_after_update_sync\` AFTER UPDATE ON \`konten\`
    FOR EACH ROW
    BEGIN
      IF NEW.\`type\` = 'NEWS' THEN
        UPDATE \`berita\` SET \`judul\` = NEW.\`title\`, \`isi\` = NEW.\`body\`, \`ringkasan\` = NEW.\`excerpt\`, \`gambar_sampul\` = NEW.\`coverImage\`, \`status\` = NEW.\`status\` WHERE \`id\` = NEW.\`id\`;
      ELSEIF NEW.\`type\` = 'ANNOUNCEMENT' THEN
        UPDATE \`pengumuman\` SET \`judul\` = NEW.\`title\`, \`isi\` = NEW.\`body\`, \`file_lampiran\` = NEW.\`attachmentUrl\`, \`status\` = NEW.\`status\` WHERE \`id\` = NEW.\`id\`;
      ELSEIF NEW.\`type\` = 'AGENDA' THEN
        UPDATE \`agenda_kegiatan\` SET \`nama_kegiatan\` = NEW.\`title\`, \`deskripsi\` = NEW.\`body\`, \`lokasi\` = NEW.\`eventLocation\`, \`status\` = NEW.\`status\` WHERE \`id\` = NEW.\`id\`;
      ELSEIF NEW.\`type\` = 'BUSINESS_TRIP' THEN
        UPDATE \`laporan_perjalanan_dinas\` SET \`judul_laporan\` = NEW.\`title\`, \`kota_tujuan\` = NEW.\`destinationCity\`, \`laporan_lengkap\` = NEW.\`body\`, \`status\` = NEW.\`status\` WHERE \`id\` = NEW.\`id\`;
      ELSEIF NEW.\`type\` = 'INTERNAL_DOCUMENT' THEN
        UPDATE \`dokumen_intern\` SET \`nama_dokumen\` = NEW.\`title\`, \`deskripsi\` = NEW.\`excerpt\`, \`file_url\` = NEW.\`attachmentUrl\`, \`status\` = NEW.\`status\` WHERE \`id\` = NEW.\`id\`;
      END IF;
    END;
  `);

  await setupTrigger('trg_konten_after_delete_sync', `
    CREATE TRIGGER \`trg_konten_after_delete_sync\` AFTER DELETE ON \`konten\`
    FOR EACH ROW
    BEGIN
      IF OLD.\`type\` = 'NEWS' THEN
        DELETE FROM \`berita\` WHERE \`id\` = OLD.\`id\`;
      ELSEIF OLD.\`type\` = 'ANNOUNCEMENT' THEN
        DELETE FROM \`pengumuman\` WHERE \`id\` = OLD.\`id\`;
      ELSEIF OLD.\`type\` = 'AGENDA' THEN
        DELETE FROM \`agenda_kegiatan\` WHERE \`id\` = OLD.\`id\`;
      ELSEIF OLD.\`type\` = 'BUSINESS_TRIP' THEN
        DELETE FROM \`laporan_perjalanan_dinas\` WHERE \`id\` = OLD.\`id\`;
      ELSEIF OLD.\`type\` = 'INTERNAL_DOCUMENT' THEN
        DELETE FROM \`dokumen_intern\` WHERE \`id\` = OLD.\`id\`;
      END IF;
    END;
  `);

  console.log('✅ All triggers configured successfully!');
  console.log('🎉 Setup sub-menu database completed with flying colors!');
}

main()
  .catch((e) => {
    console.error('❌ Error executing setup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

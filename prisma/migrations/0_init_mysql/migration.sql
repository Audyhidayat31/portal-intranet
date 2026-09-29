-- CreateTable
CREATE TABLE `pengguna` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pengguna_nip_key`(`nip`),
    UNIQUE INDEX `pengguna_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profil_pegawai` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `unitKerja` VARCHAR(191) NOT NULL,
    `golRuang` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `avatarUrl` TEXT NULL,
    `birthDate` DATETIME(3) NULL,
    `education` TEXT NULL,
    `careerHistory` TEXT NULL,
    `achievements` TEXT NULL,
    `bio` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profil_pegawai_userId_key`(`userId`),
    UNIQUE INDEX `profil_pegawai_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peran` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `peran_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `izin` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `izin_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peran_izin` (
    `id` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `peran_izin_roleId_permissionId_key`(`roleId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `kategori_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `konten` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `body` LONGTEXT NOT NULL,
    `coverImage` TEXT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'TERBIT',
    `categoryId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eventStartDate` DATETIME(3) NULL,
    `eventEndDate` DATETIME(3) NULL,
    `eventLocation` VARCHAR(191) NULL,
    `destinationCity` VARCHAR(191) NULL,
    `attachmentUrl` TEXT NULL,
    `attachmentName` VARCHAR(191) NULL,
    `fileSize` VARCHAR(191) NULL,
    `isPinned` BOOLEAN NOT NULL DEFAULT false,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `konten_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postingan_pegawai` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `categorySlug` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `coverImage` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'TERBIT',
    `likesCount` INTEGER NOT NULL DEFAULT 0,
    `viewsCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `postingan_pegawai_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `komentar_postingan` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topik_konsultasi` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `question` TEXT NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `isPrivate` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balasan_konsultasi` (
    `id` VARCHAR(191) NOT NULL,
    `topicId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `replyText` TEXT NOT NULL,
    `isAdminReply` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profil_tokoh` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `unitKerja` VARCHAR(191) NOT NULL,
    `quote` TEXT NOT NULL,
    `fullStory` LONGTEXT NOT NULL,
    `photoUrl` TEXT NULL,
    `achievements` TEXT NULL,
    `careerHistory` TEXT NULL,
    `isSpotlight` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profil_tokoh_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengaturan_beranda` (
    `id` VARCHAR(191) NOT NULL,
    `heroTitle` VARCHAR(191) NOT NULL DEFAULT 'Selamat Datang di Portal Intranet Perpusnas RI',
    `heroSubtitle` VARCHAR(1000) NOT NULL DEFAULT 'Pusat Informasi Internal, Kolaborasi, dan Layanan Terintegrasi Pegawai Perpustakaan Nasional Republik Indonesia',
    `heroBadge` VARCHAR(191) NOT NULL DEFAULT 'Kiprah Literasi Bangsa',
    `heroBannerUrl` TEXT NULL,
    `quoteText` VARCHAR(1000) NOT NULL DEFAULT 'Membaca adalah jembatan emas menuju peradaban bangsa yang unggul dan berkarakter.',
    `quoteAuthor` VARCHAR(191) NOT NULL DEFAULT 'Prof. Dr. Ir. Muhammad Syarif Bando, M.M.',
    `quoteAuthorRole` VARCHAR(191) NOT NULL DEFAULT 'Kepala Perpustakaan Nasional RI (Periode 2016-2023)',
    `announcementTicker` VARCHAR(1000) NULL DEFAULT 'Pemberitahuan: Seluruh pegawai dihimbau melengkapi data profil kepegawaian terkini sebelum akhir bulan.',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_aktivitas` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `targetId` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `ipAddress` VARCHAR(191) NULL DEFAULT '127.0.0.1',
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengguna` ADD CONSTRAINT `pengguna_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `peran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profil_pegawai` ADD CONSTRAINT `profil_pegawai_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peran_izin` ADD CONSTRAINT `peran_izin_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `peran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peran_izin` ADD CONSTRAINT `peran_izin_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `izin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `konten` ADD CONSTRAINT `konten_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `kategori`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `konten` ADD CONSTRAINT `konten_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postingan_pegawai` ADD CONSTRAINT `postingan_pegawai_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `komentar_postingan` ADD CONSTRAINT `komentar_postingan_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `postingan_pegawai`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `komentar_postingan` ADD CONSTRAINT `komentar_postingan_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topik_konsultasi` ADD CONSTRAINT `topik_konsultasi_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `balasan_konsultasi` ADD CONSTRAINT `balasan_konsultasi_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topik_konsultasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `balasan_konsultasi` ADD CONSTRAINT `balasan_konsultasi_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `pengguna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_aktivitas` ADD CONSTRAINT `log_aktivitas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `pengguna`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


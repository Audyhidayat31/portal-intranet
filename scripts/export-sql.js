const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (val instanceof Date) {
    return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }
  if (typeof val === 'string') {
    return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
  }
  return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

async function main() {
  console.log('📦 Exporting comprehensive database dump to portal_intranet.sql...');

  const rawTables = await prisma.$queryRawUnsafe('SHOW TABLES');
  const tableKey = Object.keys(rawTables[0])[0];
  const tableNames = rawTables.map(t => t[tableKey]);

  let sqlOutput = `-- Portal Intranet Perpustakaan Nasional RI - Database Dump
-- Generated: ${new Date().toISOString()}
-- Database: portal_intranet
-- Sub Menu Tables: Berita, Pengumuman, Agenda, Laporan, Dokumen Intern, Antar Pegawai (Opini, Humor, Jelajah, Keluarga, Kalimat Bijak, Akademik, Tips, Olahraga, Tahukah Anda), Profil, Kupas Sosok, Admin, Log Aktivitas.

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS \`portal_intranet\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`portal_intranet\`;

`;

  // Sort tables to ensure parent tables like pengguna, peran, izin are created first
  const priorityOrder = [
    'peran',
    'izin',
    'peran_izin',
    'pengguna',
    'profil_pegawai',
    'kategori',
    'pengaturan_beranda',
    'log_aktivitas',
    'berita',
    'pengumuman',
    'agenda_kegiatan',
    'laporan_perjalanan_dinas',
    'dokumen_intern',
    'kupas_sosok',
    'profil_tokoh',
    'coretan_opini',
    'humor_pegawai',
    'jelajah_bumi',
    'kabar_keluarga',
    'kalimat_bijak',
    'karya_akademik',
    'tips_gaya_hidup',
    'olahraga',
    'tahukah_anda',
    'topik_konsultasi',
    'balasan_konsultasi',
    'konten',
    'postingan_pegawai',
    'komentar_postingan',
  ];

  const sortedTables = [
    ...priorityOrder.filter(t => tableNames.includes(t)),
    ...tableNames.filter(t => !priorityOrder.includes(t)),
  ];

  for (const tableName of sortedTables) {
    console.log(`  Processing table: ${tableName}`);

    // SHOW CREATE TABLE
    const createResult = await prisma.$queryRawUnsafe(`SHOW CREATE TABLE \`${tableName}\``);
    const createTableStmt = createResult[0]['Create Table'] || createResult[0]['f1'] || Object.values(createResult[0])[1];

    sqlOutput += `--\n-- Table structure for table \`${tableName}\`\n--\n\n`;
    sqlOutput += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    sqlOutput += `${createTableStmt};\n\n`;

    // SELECT ALL ROWS
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM \`${tableName}\``);
    if (rows.length > 0) {
      sqlOutput += `--\n-- Dumping data for table \`${tableName}\` (${rows.length} rows)\n--\n\n`;
      sqlOutput += `LOCK TABLES \`${tableName}\` WRITE;\n`;
      sqlOutput += `/*!40000 ALTER TABLE \`${tableName}\` DISABLE KEYS */;\n`;

      const columns = Object.keys(rows[0]);
      const valueSets = [];

      for (const row of rows) {
        const escapedVals = columns.map(col => escapeSqlValue(row[col]));
        valueSets.push(`(${escapedVals.join(', ')})`);
      }

      // Group in batches of 50
      const batchSize = 50;
      for (let i = 0; i < valueSets.length; i += batchSize) {
        const batch = valueSets.slice(i, i + batchSize);
        sqlOutput += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES \n${batch.join(',\n')};\n`;
      }

      sqlOutput += `/*!40000 ALTER TABLE \`${tableName}\` ENABLE KEYS */;\n`;
      sqlOutput += `UNLOCK TABLES;\n\n`;
    }
  }

  sqlOutput += `/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;\n`;
  sqlOutput += `/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\n`;
  sqlOutput += `/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;\n`;
  sqlOutput += `/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */; \n`;
  sqlOutput += `/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n`;
  sqlOutput += `/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n`;
  sqlOutput += `/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;\n`;
  sqlOutput += `-- Dump completed on ${new Date().toISOString()}\n`;

  const outputPath = path.join(__dirname, '..', 'portal_intranet.sql');
  fs.writeFileSync(outputPath, sqlOutput, 'utf8');

  console.log(`✅ portal_intranet.sql successfully updated (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)!`);
}

main()
  .catch((e) => {
    console.error('❌ Error exporting sql:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

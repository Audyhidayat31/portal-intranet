const fs = require('fs');
const path = require('path');

const mappings = {
  // Kabar Kedinasan
  'berita': 'Warta resmi kegiatan Perpusnas RI',
  'pengumuman': 'Surat edaran, cuti, dan arahan pimpinan',
  'agenda': 'Jadwal rakor, diklat, dan acara dinas',
  'laporan-perjalanan': 'Laporan monitoring & supervisi wilayah',
  'dokumen-intern': 'SOP, pedoman kerja, dan regulasi internal',
  
  // Antar Pegawai
  'daftar-pegawai': 'Direktori data & kontak pegawai',
  'opini': 'Gagasan & pemikiran pegawai',
  'humor': 'Pojok rileks & cerita santai',
  'jelajah-bumi': 'Catatan perjalanan wisata & budaya',
  'kabar-keluarga': 'Warta suka & duka keluarga Perpusnas',
  'kalimat-bijak': 'Kutipan inspiratif & motivasi',
  'karya-akademik': 'Jurnal, riset, dan karya ilmiah',
  'tips-gaya-hidup': 'Kesehatan, ergonomis & hobi',
  'konsultasi': 'Tanya jawab Kepegawaian, IT, Kesehatan',
  'olahraga': 'Jadwal latihan & klub olahraga',
  'tahukah-anda': 'Trivia & fakta unik perpustakaan'
};

function processDir(dir, routeKey) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath, routeKey || file);
    } else if (file === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newDesc = mappings[routeKey];
      if (newDesc) {
        // Use 'g' and 's' flags so dot matches newline
        const regex = /(<p[^>]*text-\[#444650\][^>]*>\s*)Deskripsi(?:.*?)(<\/p>)/gs;
        const textSmRegex = /(<p[^>]*text-sm md:text-base text-slate-500[^>]*>\s*)Deskripsi(?:.*?)(<\/p>)/gs;
        
        let newContent = content;
        if (regex.test(content)) {
          newContent = content.replace(regex, `$1${newDesc}$2`);
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated ${fullPath}`);
        } else if (textSmRegex.test(content)) {
          newContent = content.replace(textSmRegex, `$1${newDesc}$2`);
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated (text-sm) ${fullPath}`);
        } else {
            console.log(`NO MATCH in ${routeKey}: ${fullPath}`);
        }
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app/(portal)/kabar-kedinasan'));
processDir(path.join(__dirname, 'src/app/(portal)/antar-pegawai'));

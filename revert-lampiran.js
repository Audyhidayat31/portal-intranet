const fs = require('fs');
const path = require('path');
const files = [
  'src/app/(portal)/kabar-kedinasan/agenda/[id]/page.tsx',
  'src/app/(portal)/kabar-kedinasan/dokumen-intern/[id]/page.tsx',
  'src/app/(portal)/kabar-kedinasan/laporan-perjalanan/[id]/page.tsx',
  'src/app/(portal)/kabar-kedinasan/pengumuman/page.tsx',
  'src/app/(portal)/kupas-sosok/[slug]/page.tsx',
  'src/app/(portal)/antar-pegawai/humor/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/jelajah-bumi/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/kabar-keluarga/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/kalimat-bijak/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/karya-akademik/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/konsultasi/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/olahraga/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/opini/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/tahukah-anda/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/tips-gaya-hidup/[id]/page.tsx'
];

for (const f of files) {
  try {
    if (!fs.existsSync(f)) continue;
    let c = fs.readFileSync(f, 'utf8');
    let replaced = false;
    
    // For pengumuman/page.tsx
    if (f.includes('pengumuman')) {
       if (c.includes('{attachmentList.length > 0 && (<section className="mb-8">')) {
          c = c.replace('{attachmentList.length > 0 && (<section className="mb-8">', '<section className="mb-8">');
          c = c.replace('</section>)}', '</section>');
          replaced = true;
       }
    } else {
       if (c.includes('{attachmentList.length > 0 && (')) {
          c = c.replace(/\{attachmentList\.length > 0 && \(\s*<div/g, '<div');
          
          c = c.replace(/              \}\)\)\}\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*\)\}/g, '              ))}\n            </div>\n          </div>');
          
          c = c.replace(/<\/div>\r?\n\s*\)\}\r?\n\s*\{\/\* Divider Line/g, '</div>\n\n          {/* Divider Line');
          replaced = true;
       }
    }
    
    if (replaced) {
      fs.writeFileSync(f, c);
      console.log('Reverted: ' + f);
    }
  } catch(e) {
    console.error('Error on ' + f + ' : ' + e.message);
  }
}
console.log('Done');

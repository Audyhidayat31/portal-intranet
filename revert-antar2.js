const fs = require('fs');
const files = [
  'src/app/(portal)/antar-pegawai/opini/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/tahukah-anda/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/tips-gaya-hidup/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/olahraga/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/kabar-keluarga/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/jelajah-bumi/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/humor/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/kalimat-bijak/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/karya-akademik/[id]/page.tsx',
  'src/app/(portal)/antar-pegawai/konsultasi/[id]/page.tsx'
];

for (const f of files) {
  try {
    if (!fs.existsSync(f)) continue;
    let c = fs.readFileSync(f, 'utf8');
    
    if (c.includes('{attachmentList && attachmentList.length > 0 && (')) {
       // Replace the opening part
       c = c.replace(/\{attachmentList && attachmentList\.length > 0 && \(\s*<>\s*/, '');
       
       // Replace the closing part
       c = c.replace(/<\/div>\s*<\/>\s*\)\}/, '</div>');
       
       fs.writeFileSync(f, c);
       console.log('Reverted correctly: ' + f);
    }
  } catch(e) {
    console.error('Error on ' + f + ' : ' + e.message);
  }
}
console.log('Done');

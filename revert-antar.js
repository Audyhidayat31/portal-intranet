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
       c = c.replace(/\{\/\* Divider Line \*\/\}[\s\S]*?\{attachmentList && attachmentList\.length > 0 && \(\s*<>\s*/, '{/* Divider Line */}\n          <div className="border-t border-[#c5c6d2] my-8" />\n\n          ');
       
       c = c.replace(/\s*\{\/\* Divider Line \*\/\}[\s\S]*?<\/div>\s*<\/>\s*\)\}/, '');
       
       fs.writeFileSync(f, c);
       console.log('Reverted correctly: ' + f);
    }
  } catch(e) {
    console.error('Error on ' + f + ' : ' + e.message);
  }
}
console.log('Done');

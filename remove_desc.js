const fs = require('fs');

const files = [
  'src/components/portal/Navbar.tsx',
  'src/components/admin/AdminNavbar.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove Kabar Kedinasan static desc
  content = content.replace(/\s*<p className="text-\[11px\] text-slate-500 mt-0\.5">.*?<\/p>/g, '');
  
  // Remove Antar Pegawai dynamic desc
  content = content.replace(/\s*<p className="text-\[10px\] text-slate-500 mt-0\.5 line-clamp-1">\{sub\.desc\}<\/p>/g, '');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}

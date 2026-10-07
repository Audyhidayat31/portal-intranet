const fs = require('fs');
const file = 'src/app/(portal)/profil/akun/page.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center"/, 'className="w-32 h-32 shrink-0 aspect-square rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100 flex items-center justify-center"');
c = c.replace(/className="w-full h-full object-cover"/g, 'className="w-full h-full object-cover object-center"');
c = c.replace(/w-16 h-16 rounded-full overflow-hidden/g, 'w-16 h-16 shrink-0 aspect-square rounded-full overflow-hidden');
fs.writeFileSync(file, c, 'utf8');
console.log('Fixed aspect ratio');
